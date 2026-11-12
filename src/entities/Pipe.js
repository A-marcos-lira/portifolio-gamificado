import Phaser from 'phaser';
import { audioManager } from '../audio/AudioManager.js';

/**
 * Classe que gerencia um Cano Verde interativo, sua hitbox, placa e animações
 */
export class Pipe {
  constructor(scene, x, y, options = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Suporte a chamada com objeto options ou callback legada
    if (typeof options === 'function') {
      this.id = 'about';
      this.signKey = 'pipe_sign';
      this.onEnterCallback = options;
    } else {
      this.id = options.id || 'about';
      this.signKey = options.signKey || 'pipe_sign';
      this.onEnterCallback = options.onEnter || null;
    }

    this.isPlayerOverPipe = false;
    this.isBusy = false;
    this.isCompleted = false;

    // Sprite do Cano (48x64 px)
    // O cano é um corpo estático na física Arcade (o player pousa em cima dele)
    this.sprite = scene.physics.add.staticSprite(x, y, 'pipe_green');
    this.sprite.setOrigin(0.5, 1); // Origem na base do cano
    this.sprite.refreshBody();
    this.sprite.setDepth(50); // Camada 50: Frente do terreno (40), montanhas e árvores

    // Letreiro com o nome da seção posicionado acima do cano (Camada 60)
    this.sign = scene.add.image(x, y - 76, this.signKey);
    this.sign.setOrigin(0.5, 0.5);
    this.sign.setDepth(60);

    // Efeito sutil de flutuação no letreiro
    scene.tweens.add({
      targets: this.sign,
      y: y - 80,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Detalhe visual de seção visitada (bandeirinha dourada na lateral do cano)
    this.flag = scene.add.image(x - 20, y - 60, 'pipe_visited_flag');
    this.flag.setOrigin(0.5, 1);
    this.flag.setDepth(55);
    this.flag.setVisible(false);

    // Balão de prompt "Pressione S ou ↓" (Camada 65)
    this.prompt = scene.add.image(x, y - 104, 'pipe_prompt');
    this.prompt.setOrigin(0.5, 0.5);
    this.prompt.setDepth(65);
    this.prompt.setVisible(false);
    this.prompt.setAlpha(0);

    // Tecla para descer no cano
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.cursorDown = scene.input.keyboard.createCursorKeys().down;
  }

  /**
   * Conclui visualmente a seção no retorno ao mapa:
   * Altera a placa de verde para dourado com o símbolo ✓ e brilho curto (0.7s)
   */
  markCompleted() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    // Também exibe a bandeirinha lateral decorativa
    if (this.flag && !this.flag.visible) {
      this.flag.setVisible(true);
      this.flag.setScale(0);
      this.scene.tweens.add({
        targets: this.flag,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut'
      });
    }

    if (!this.sign || !this.scene) return;

    const completedKey = `${this.signKey}_completed`;

    // Animação de conclusão da placa:
    // 1. Escala sutil (pulso suave de 1.0 para 1.25)
    // 2. Transição para a textura dourada com o símbolo ✓
    // 3. Brilho dourado curto (#FDE68A)
    // 4. Retorno ao tamanho normal mantendo a placa dourada
    this.scene.tweens.add({
      targets: this.sign,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 350,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Altera a textura da placa para a versão dourada com ✓
        this.sign.setTexture(completedKey);

        // Flash de brilho dourado translúcido
        const flash = this.scene.add.rectangle(
          this.sign.x,
          this.sign.y,
          this.sign.width,
          this.sign.height,
          0xfde68a,
          0.65
        );
        flash.setDepth(62);

        this.scene.tweens.add({
          targets: flash,
          alpha: 0,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 400,
          ease: 'Sine.easeOut',
          onComplete: () => flash.destroy()
        });

        // Retorna ao tamanho normal mantendo a placa dourada
        this.scene.tweens.add({
          targets: this.sign,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 350,
          ease: 'Sine.easeOut'
        });
      }
    });
  }

  /**
   * Verifica o alinhamento do jogador sobre o topo do cano
   */
  update(player) {
    if (this.isBusy || player.controlsLocked) {
      this.hidePrompt();
      return;
    }

    // Topo do cano em coordenadas globais
    const pipeTopY = this.y - 64;
    const playerFeetY = player.body.bottom;
    const dx = Math.abs(player.x - this.x);
    const dy = Math.abs(playerFeetY - pipeTopY);

    // O jogador deve estar razoavelmente centralizado no topo do cano (distância horizontal <= 16px e pés sobre o topo)
    const isGroundedOnPipe = (player.body.touching.down || player.body.blocked.down) &&
                             dx <= 16 &&
                             dy <= 8;

    if (isGroundedOnPipe) {
      this.isPlayerOverPipe = true;
      this.showPrompt();

      // Checa se o comando de entrar foi acionado (S, Seta Baixo ou botão virtual)
      const wantsToEnter = Phaser.Input.Keyboard.JustDown(this.keyS) ||
                           Phaser.Input.Keyboard.JustDown(this.cursorDown) ||
                           player.virtualInput.down;

      if (wantsToEnter) {
        player.virtualInput.down = false; // consome o clique virtual
        this.startEnterAnimation(player);
      }
    } else {
      this.isPlayerOverPipe = false;
      this.hidePrompt();
    }
  }

  showPrompt() {
    if (!this.prompt.visible) {
      this.prompt.setVisible(true);
      this.scene.tweens.add({
        targets: this.prompt,
        alpha: 1,
        y: this.y - 106,
        duration: 180,
        ease: 'Cubic.easeOut'
      });
    }
  }

  hidePrompt() {
    if (this.prompt.visible && this.prompt.alpha > 0) {
      this.scene.tweens.add({
        targets: this.prompt,
        alpha: 0,
        duration: 120,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.prompt.setVisible(false);
          this.prompt.y = this.y - 104;
        }
      });
    }
  }

  /**
   * Executa a descida animada no cano
   */
  startEnterAnimation(player) {
    this.isBusy = true;
    this.hidePrompt();
    player.lockControls();

    // Efeito sonoro de entrada no cano (Exit 3.wav)
    audioManager.playPipe();

    // Alinha o jogador no centro horizontal exato do cano
    player.x = this.x;
    player.anims.play('player_pipe', true);

    // Ajusta o depth do player para ficar atrás da borda do cano (50), mas na frente do terreno (40)
    player.setDepth(45);

    // Anima o player descendo para dentro do cano
    this.scene.tweens.add({
      targets: player,
      y: this.y - 20,
      duration: 750,
      ease: 'Power1',
      onComplete: () => {
        // Fade out curto da câmera
        this.scene.cameras.main.fadeOut(350, 0, 0, 0);
        this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          player.setVisible(false);
          if (this.onEnterCallback) {
            this.onEnterCallback(this);
          }
        });
      }
    });
  }

  /**
   * Executa o retorno animado saindo do cano
   */
  startExitAnimation(player, onFinished) {
    // Posiciona o player dentro do cano
    player.setVisible(true);
    player.x = this.x;
    const pipeTopY = this.y - 64;
    // Posição inicial oculta dentro do cano
    player.y = this.y - 20;
    player.setDepth(45);
    player.anims.play('player_pipe', true);

    // Fade in da câmera
    this.scene.cameras.main.fadeIn(350, 0, 0, 0);

    // Calcula o Y exato para pousar no topo do cano de acordo com o tamanho do player
    const targetY = pipeTopY - (player.body.halfHeight || (player.body.height / 2)) - 4;

    // Anima o player subindo até o topo do cano
    this.scene.tweens.add({
      targets: player,
      y: targetY,
      duration: 750,
      ease: 'Power1',
      onComplete: () => {
        // Restaura profundidade original (Camada 50) e libera controle
        player.setDepth(50);
        this.isBusy = false;
        player.unlockControls();
        if (onFinished) {
          onFinished();
        }
      }
    });
  }
}
