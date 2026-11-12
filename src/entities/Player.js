import Phaser from 'phaser';
import { audioManager } from '../audio/AudioManager.js';

/**
 * Classe que gerencia o Personagem Principal e sua física 2D clássica
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle1');

    // Registra na cena e no sistema de física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Aumento visual de aproximadamente 18% (na faixa de 15% a 20%)
    // Mantém a renderização nítida em pixel art sem borrões
    this.setScale(1.18);

    // Camada de profundidade explícita: Camada 50 (Frente de montanhas, árvores e terreno)
    this.setDepth(50);

    // Configurações do corpo físico
    this.setCollideWorldBounds(true);
    // Ajusta o tamanho da hitbox para ser precisa com o novo tamanho (evita prender em quinas)
    this.body.setSize(18, 40);
    this.body.setOffset(7, 8);

    // Parâmetros de física ajustados para jogabilidade de plataforma responsiva
    this.ACCELERATION_WALK = 650;
    this.ACCELERATION_RUN = 1000;
    this.DRAG_GROUND = 850;
    this.DRAG_AIR = 120;
    this.MAX_SPEED_WALK = 160;
    this.MAX_SPEED_RUN = 260;
    
    // Pulo e gravidade
    this.JUMP_VELOCITY = -360;
    this.BASE_GRAVITY = 750;
    this.FALL_GRAVITY_MULTIPLIER = 1.45; // Gravidade extra na queda
    this.MIN_JUMP_TIME = 100; // ms mínimos para pulo variável

    // Coyote Time e Jump Buffering
    this.COYOTE_TIME = 120; // ms após deixar uma beirada
    this.JUMP_BUFFER_TIME = 140; // ms para antecipar o pulo
    this.lastOnGroundTime = 0;
    this.jumpBufferingTime = 0;
    this.isJumping = false;
    this.jumpStartTime = 0;

    // Estados
    this.isSkidding = false;
    this.isEnteringPipe = false;
    this.isExitingPipe = false;
    this.controlsLocked = false;

    // Configuração inicial de gravidade
    this.body.setGravityY(this.BASE_GRAVITY);

    // Inicialização das animações
    this.initAnimations(scene);

    // Input do teclado
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Suporte para controles virtuais externos (Mobile)
    this.virtualInput = {
      left: false,
      right: false,
      down: false,
      jump: false,
      run: false
    };
  }

  /**
   * Cria todas as animações do personagem no Animation Manager
   */
  initAnimations(scene) {
    if (scene.anims.exists('player_idle')) return;

    // Parado (Idle)
    scene.anims.create({
      key: 'player_idle',
      frames: [
        { key: 'player_idle1', duration: 350 },
        { key: 'player_idle2', duration: 350 }
      ],
      repeat: -1
    });

    // Caminhando (Walk)
    scene.anims.create({
      key: 'player_walk',
      frames: [
        { key: 'player_walk1' },
        { key: 'player_walk2' },
        { key: 'player_walk3' },
        { key: 'player_walk4' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Correndo (Run)
    scene.anims.create({
      key: 'player_run',
      frames: [
        { key: 'player_run1' },
        { key: 'player_run2' },
        { key: 'player_run3' },
        { key: 'player_run4' }
      ],
      frameRate: 12,
      repeat: -1
    });

    // Derrapando (Skid)
    scene.anims.create({
      key: 'player_skid',
      frames: [{ key: 'player_skid' }],
      frameRate: 1
    });

    // Pulando (Jump)
    scene.anims.create({
      key: 'player_jump',
      frames: [{ key: 'player_jump' }],
      frameRate: 1
    });

    // Caindo (Fall)
    scene.anims.create({
      key: 'player_fall',
      frames: [{ key: 'player_fall' }],
      frameRate: 1
    });

    // Entrando/Saindo do cano
    scene.anims.create({
      key: 'player_pipe',
      frames: [{ key: 'player_pipe' }],
      frameRate: 1
    });
  }

  /**
   * Ciclo de atualização de física e animações
   */
  update(time, delta) {
    if (this.controlsLocked) return;

    const onGround = this.body.blocked.down || this.body.touching.down;

    // Atualiza timers de Coyote Time e Jump Buffer
    if (onGround) {
      this.lastOnGroundTime = time;
      this.isJumping = false;
      this.body.setGravityY(this.BASE_GRAVITY);
    }

    // Leitura das entradas (Teclado + Touch)
    const leftPressed = this.cursors.left.isDown || this.keyA.isDown || this.virtualInput.left;
    const rightPressed = this.cursors.right.isDown || this.keyD.isDown || this.virtualInput.right;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                        Phaser.Input.Keyboard.JustDown(this.keyW) ||
                        Phaser.Input.Keyboard.JustDown(this.keySpace) ||
                        this.virtualInput.justJump;
    
    // Consome o justJump virtual
    if (this.virtualInput.justJump) {
      this.virtualInput.justJump = false;
    }

    const jumpHolding = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown || this.virtualInput.jump;
    const runPressed = this.cursors.shift.isDown || this.keyShift.isDown || this.virtualInput.run;

    // Armazena no buffer caso aperte pulo antes de tocar o chão
    if (jumpPressed) {
      this.jumpBufferingTime = time;
    }

    // --- MOVIMENTAÇÃO HORIZONTAL ---
    const acceleration = runPressed ? this.ACCELERATION_RUN : this.ACCELERATION_WALK;
    const maxSpeed = runPressed ? this.MAX_SPEED_RUN : this.MAX_SPEED_WALK;
    this.body.setMaxVelocity(maxSpeed, 700);

    // Ajusta o atrito (drag) dependendo se está no chão ou no ar
    this.body.setDragX(onGround ? this.DRAG_GROUND : this.DRAG_AIR);

    if (leftPressed && !rightPressed) {
      // Inverte a direção com derrapagem se estava correndo para o lado oposto
      if (onGround && this.body.velocity.x > 80) {
        this.isSkidding = true;
        this.body.setAccelerationX(-this.ACCELERATION_RUN * 1.5);
      } else {
        this.isSkidding = false;
        this.body.setAccelerationX(-acceleration);
      }
      this.setFlipX(true);
    } else if (rightPressed && !leftPressed) {
      // Inverte a direção com derrapagem se estava correndo para o lado oposto
      if (onGround && this.body.velocity.x < -80) {
        this.isSkidding = true;
        this.body.setAccelerationX(this.ACCELERATION_RUN * 1.5);
      } else {
        this.isSkidding = false;
        this.body.setAccelerationX(acceleration);
      }
      this.setFlipX(false);
    } else {
      this.body.setAccelerationX(0);
      this.isSkidding = false;
    }

    // --- PULO E COYOTE TIME ---
    const canCoyoteJump = (time - this.lastOnGroundTime) < this.COYOTE_TIME;
    const hasBufferedJump = (time - this.jumpBufferingTime) < this.JUMP_BUFFER_TIME;

    if (hasBufferedJump && canCoyoteJump && !this.isJumping) {
      this.executeJump(time);
    }

    // Altura variável do pulo: soltou o botão cedo => corte da velocidade vertical
    if (this.isJumping && !jumpHolding && this.body.velocity.y < -80) {
      this.body.setVelocityY(this.body.velocity.y * 0.55);
    }

    // Gravidade mais intensa durante a queda (super Mario / Celeste feel)
    if (!onGround && this.body.velocity.y > 0) {
      this.body.setGravityY(this.BASE_GRAVITY * this.FALL_GRAVITY_MULTIPLIER);
    }

    // --- SELEÇÃO DE ANIMAÇÕES ---
    this.updateAnimations(onGround, runPressed);
  }

  /**
   * Dispara o pulo inicial
   */
  executeJump(time) {
    this.body.setVelocityY(this.JUMP_VELOCITY);
    this.isJumping = true;
    this.jumpStartTime = time;
    this.lastOnGroundTime = 0; // Gasta o coyote time
    this.jumpBufferingTime = 0; // Gasta o buffer de pulo

    // Efeito sonoro do salto (Jump 3.wav)
    audioManager.playJump();
  }

  /**
   * Decide qual animação reproduzir de acordo com velocidade e estado
   */
  updateAnimations(onGround, runPressed) {
    const absVx = Math.abs(this.body.velocity.x);

    if (!onGround) {
      if (this.body.velocity.y < 0) {
        this.anims.play('player_jump', true);
      } else {
        this.anims.play('player_fall', true);
      }
    } else if (this.isSkidding) {
      this.anims.play('player_skid', true);
    } else if (absVx > 20) {
      if (runPressed && absVx > this.MAX_SPEED_WALK * 0.8) {
        this.anims.play('player_run', true);
      } else {
        this.anims.play('player_walk', true);
      }
    } else {
      this.anims.play('player_idle', true);
    }
  }

  /**
   * Trava movimentação para transição de cano
   */
  lockControls() {
    this.controlsLocked = true;
    this.body.setVelocity(0, 0);
    this.body.setAcceleration(0, 0);
    this.body.setAllowGravity(false);
  }

  /**
   * Restaura o controle do jogador
   */
  unlockControls() {
    this.controlsLocked = false;
    this.body.setAllowGravity(true);
    this.body.setGravityY(this.BASE_GRAVITY);
    this.anims.play('player_idle', true);
  }
}

