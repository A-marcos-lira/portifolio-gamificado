import Phaser from 'phaser';
import { generateGameAssets } from '../assets/assetGenerator.js';
import { Player } from '../entities/Player.js';
import { Pipe } from '../entities/Pipe.js';
import { SectionModal } from '../ui/SectionModal.js';
import { VirtualControls } from '../ui/VirtualControls.js';
import { audioManager } from '../audio/AudioManager.js';
import { AudioController } from '../ui/AudioController.js';

/**
 * Cena Principal do Jogo — Portfólio Gamificado 2.0
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Carrega/Gera todos os gráficos procedurais 16-bit nativos
    generateGameAssets(this);
  }

  create() {
    // Dimensões Ampliadas do Mundo do Jogo (Exploração Livre de 4800px)
    this.worldWidth = 4800;
    this.worldHeight = 480;
    const worldWidth = this.worldWidth;
    const worldHeight = this.worldHeight;

    // Configura os limites físicos do mundo
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 1. FUNDO (Céu azul suave estilo 16-bit)
    this.cameras.main.setBackgroundColor('#60a5fa');

    // 2. CAMADAS DECORATIVAS DE CENÁRIO (Parallax e profundidade sutil)
    this.createScenery(worldWidth, worldHeight);

    // 3. TERRENO E PLATAFORMAS (Grupos estáticos de colisão)
    this.createTerrain(worldWidth, worldHeight);

    // 4. REGISTRO E DISTRIBUIÇÃO DOS 4 CANOS
    const groundY = worldHeight - 64; // Altura onde o chão começa
    // Fonte única de verdade do progresso na sessão atual (apenas em memória, sem persistência)
    this.completedSections = new Set();
    this.currentActivePipe = null;

    const pipesConfig = [
      { id: 'about', x: 850, signKey: 'pipe_sign_about' },
      { id: 'projects', x: 1950, signKey: 'pipe_sign_projects' },
      { id: 'skills', x: 3050, signKey: 'pipe_sign_skills' },
      { id: 'contact', x: 4150, signKey: 'pipe_sign_contact' }
    ];

    this.pipes = pipesConfig.map(cfg => {
      const pipe = new Pipe(this, cfg.x, groundY, {
        id: cfg.id,
        signKey: cfg.signKey,
        onEnter: (enteredPipe) => {
          this.currentActivePipe = enteredPipe;
          this.handlePipeEntered(enteredPipe);
        }
      });
      return pipe;
    });

    // 5. PERSONAGEM PRINCIPAL (Camada 50: à frente do terreno, montanhas e árvores)
    this.player = new Player(this, 160, groundY - 40);
    this.player.setDepth(50);

    // Colisões do jogador com o terreno e com os 4 canos
    this.physics.add.collider(this.player, this.groundGroup);
    this.pipes.forEach(pipe => {
      this.physics.add.collider(this.player, pipe.sprite);
    });

    // 6. CÂMERA SUAVE ACOMPANHANDO O JOGADOR COM ZOOM RESPONSIVO
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Configuração inicial do zoom e enquadramento responsivo
    this.updateCameraResponsive();

    // Adaptação dinâmica de câmera e limites em caso de redimensionamento ou rotação da tela
    this.scale.on('resize', () => {
      this.updateCameraResponsive();
    });

    window.addEventListener('resize', () => {
      this.updateCameraResponsive();
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updateCameraResponsive(), 100);
    });

    // 7. GERENCIADOR DE TELAS MODAIS DAS 4 SEÇÕES
    this.sectionModal = new SectionModal((sectionId, isFirstCompletion) => {
      // Callback quando o usuário clica em "Voltar ao mapa"
      if (this.virtualControls) {
        this.virtualControls.reset();
      }
      const activePipe = this.currentActivePipe || this.pipes.find(p => p.id === sectionId) || this.pipes[0];
      activePipe.startExitAnimation(this.player);

      // Conclusão visual da seção SOMENTE no primeiro retorno ao mapa:
      if (isFirstCompletion && !this.completedSections.has(sectionId)) {
        // 1. Marca como concluída (Fonte única de verdade)
        this.completedSections.add(sectionId);

        // 2. Atualiza o contador de seções visitadas (ex: 0/4 -> 1/4)
        this.updateProgressUI();

        // 3. Altera a placa de verde para dourado com animação de conclusão e ✓
        activePipe.markCompleted();

        // 4. Reproduz o som de conquista (Coin 3.wav)
        audioManager.playAchievement();
      }
    });

    // 8. CONTROLES VIRTUAIS TOUCH (MOBILE)
    this.virtualControls = new VirtualControls(this.player);

    // 9. CONTROLE DE ÁUDIO NO HUD
    this.audioController = new AudioController();

    // Atualiza o indicador inicial de progresso na interface (inicia em 0/4)
    this.updateProgressUI();
  }

  /**
   * Entrada na tubulação: abre a seção correspondente sem registrar conclusão imediata
   */
  handlePipeEntered(pipe) {
    if (this.virtualControls) {
      this.virtualControls.reset();
    }
    const isAlreadyCompleted = this.completedSections.has(pipe.id);

    // Na entrada da tubulação, toca apenas o som do cano (Exit 3.wav).
    // O progresso (contador, placa dourada, ✓ e som de conquista) ocorre
    // apenas quando o jogador retornar ao mapa pela primeira vez!
    this.sectionModal.open(pipe.id, !isAlreadyCompleted);
  }

  /**
   * Atualiza o contador de progresso visual "Seções visitadas: X/4"
   */
  updateProgressUI() {
    const countEl = document.getElementById('progress-count');
    if (countEl) {
      countEl.textContent = `${this.completedSections.size}/4`;
    }
  }

  /**
   * Ajusta o zoom e o enquadramento vertical da câmera dinamicamente.
   * Aplica zoom responsivo moderado no mobile para aumentar o personagem,
   * tubulações, placas e plataformas de maneira proporcional, reduzindo o excesso de céu.
   * No desktop, preserva rigorosamente o enquadramento original (zoom 1.0).
   */
  updateCameraResponsive() {
    if (!this.cameras || !this.cameras.main) return;

    const cam = this.cameras.main;
    const worldWidth = this.worldWidth || 4800;
    const worldHeight = this.worldHeight || 480;

    // Detecta se o dispositivo é mobile / tablet ou viewport de teste mobile
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    const isMobile = (isTouch && isSmallScreen) || window.innerWidth <= 820;

    if (!isMobile) {
      // 1. DESKTOP: Preserva zoom 1.0 e enquadramento padrão sem alterações
      cam.setZoom(1.0);
      cam.setFollowOffset(0, 0);
      cam.setBounds(0, 0, worldWidth, worldHeight);
      return;
    }

    // 2. MOBILE / TABLET:
    const isPortrait = window.innerHeight > window.innerWidth;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let zoom = 1.0;
    let offsetY = 0;

    if (isPortrait) {
      // Modo Retrato (celular em pé / telas estreitas e altas)
      // Zoom moderado e proporcional: 1.45x (ou 1.50x em telas estreitas <= 380px)
      zoom = screenWidth <= 380 ? 1.50 : 1.45;
      // Offset vertical ajustado para manter o personagem e o chão bem enquadrados,
      // cortando o excesso de céu superior e mantendo folga para os controles
      offsetY = -28;
    } else {
      // Modo Paisagem (celular deitado / telas horizontais)
      const isTablet = Math.min(screenWidth, screenHeight) >= 600;
      // Zoom em paisagem: 1.20x para tablets, 1.32x para smartphones
      zoom = isTablet ? 1.20 : 1.32;
      // Offset vertical sutil em paisagem
      offsetY = -18;
    }

    // Aplica o zoom e o offset vertical na câmera principal
    cam.setZoom(zoom);
    cam.setFollowOffset(0, offsetY);
    cam.setBounds(0, 0, worldWidth, worldHeight);
  }

  /**
   * Cria nuvens, montanhas e árvores respeitando a hierarquia de camadas explícita:
   * 1. Céu (fundo da câmera)
   * 2. Montanhas distantes (depth: 10)
   * 3. Nuvens (depth: 20)
   * 4. Árvores decorativas (depth: 30)
   * 5. Terreno e plataformas (depth: 40)
   * 6. Canos e Personagem (depth: 50)
   */
  createScenery(worldWidth, worldHeight) {
    const groundY = worldHeight - 64;

    // 2. Montanhas Distantes (Camada 10 - Fundo do horizonte)
    // Silhuetas baixas, suaves e em azul com baixo contraste distribuídas por 4800px
    const farMountainX = [340, 1100, 1850, 2600, 3400, 4200];
    farMountainX.forEach(x => {
      const mFar = this.add.image(x, groundY + 12, 'scenery_mountain_far');
      mFar.setOrigin(0.5, 1);
      mFar.setScrollFactor(0.05, 1); // Ancorado perfeitamente no Y do terreno, parallax suave no X
      mFar.setDepth(10);
    });

    // Montanhas médias complementares
    const midMountainX = [720, 1500, 2250, 3000, 3800, 4600];
    midMountainX.forEach(x => {
      const mMid = this.add.image(x, groundY + 12, 'scenery_mountain_mid');
      mMid.setOrigin(0.5, 1);
      mMid.setScrollFactor(0.08, 1);
      mMid.setDepth(10);
    });

    // 3. Nuvens no Céu (Camada 20 - À frente das montanhas, no topo da tela)
    // scrollFactorY = 0 garante que permaneçam sempre visíveis no céu limpo
    const cloudConfigs = [
      { x: 120, y: 35, key: 'scenery_cloud' },
      { x: 380, y: 60, key: 'scenery_cloud_small' },
      { x: 740, y: 40, key: 'scenery_cloud' },
      { x: 1080, y: 65, key: 'scenery_cloud_small' },
      { x: 1450, y: 35, key: 'scenery_cloud' },
      { x: 1780, y: 55, key: 'scenery_cloud_small' },
      { x: 2150, y: 40, key: 'scenery_cloud' },
      { x: 2520, y: 60, key: 'scenery_cloud_small' },
      { x: 2900, y: 35, key: 'scenery_cloud' },
      { x: 3280, y: 65, key: 'scenery_cloud_small' },
      { x: 3650, y: 40, key: 'scenery_cloud' },
      { x: 4020, y: 55, key: 'scenery_cloud_small' },
      { x: 4400, y: 35, key: 'scenery_cloud' },
      { x: 4720, y: 60, key: 'scenery_cloud_small' }
    ];

    cloudConfigs.forEach(cfg => {
      const cloud = this.add.image(cfg.x, cfg.y, cfg.key);
      cloud.setScrollFactor(0.12, 0); // Fixo no eixo Y da tela, parallax horizontal suave
      cloud.setAlpha(0.95);
      cloud.setDepth(20);
    });

    // 4. Elementos decorativos: Árvores (Camada 30)
    const treePositions = [
      240, 580, 1180, 1620, 2280, 2740, 3350, 3850, 4420
    ];
    treePositions.forEach(x => {
      const tree = this.add.image(x, groundY, 'scenery_tree');
      tree.setOrigin(0.5, 1);
      tree.setDepth(30);
    });
  }

  /**
   * Constrói o solo contínuo e plataformas espaçadas por todo o mapa (Camada 40)
   */
  createTerrain(worldWidth, worldHeight) {
    this.groundGroup = this.physics.add.staticGroup();

    const groundY = worldHeight - 64;
    const tileSize = 32;

    // Solo contínuo por toda a extensão de 4800px (Camada 40)
    for (let x = 0; x < worldWidth; x += tileSize) {
      // Camada de grama superficial
      const grass = this.groundGroup.create(x + tileSize / 2, groundY + tileSize / 2, 'tile_grass');
      grass.setDepth(40);
      grass.refreshBody();

      // Camada de terra subterrânea
      const dirt = this.groundGroup.create(x + tileSize / 2, groundY + tileSize + tileSize / 2, 'tile_dirt');
      dirt.setDepth(40);
      dirt.refreshBody();
    }

    // Distribuição de plataformas variadas e planejadas por setor (Camada 40)
    // Todas as plataformas com altura suficiente para o personagem passar por baixo sem bater a cabeça
    
    // --- Setor 1: Início até Cano 1 (Sobre Mim em 850) ---
    // Duas plataformas suaves em alturas elevadas para passagem livre
    this.createFloatingPlatform(340, groundY - 72, 3);
    this.createFloatingPlatform(550, groundY - 76, 4);

    // --- Setor 2: Entre Cano 1 (850) e Cano 2 (Desenvolvido por Mim em 1950) ---
    // Progressão em escada com ilha superior de observação e descida
    this.createFloatingPlatform(1120, groundY - 72, 3);
    this.createFloatingPlatform(1320, groundY - 105, 3);
    this.createFloatingPlatform(1520, groundY - 145, 4);
    this.createFloatingPlatform(1750, groundY - 75, 3);

    // --- Setor 3: Entre Cano 2 (1950) e Cano 3 (Habilidades em 3050) ---
    // Passarela elevada conectada pela nova plataforma intermediária
    this.createFloatingPlatform(2190, groundY - 74, 3);
    this.createFloatingPlatform(2390, groundY - 120, 4);
    // ⭐ NOVA PLATAFORMA FLUTUANTE (Altura intermediária conectando a descida de forma harmoniosa)
    this.createFloatingPlatform(2590, groundY - 95, 3);
    this.createFloatingPlatform(2780, groundY - 72, 3);

    // --- Setor 4: Entre Cano 3 (3050) e Cano 4 (Contato em 4150) ---
    // Ondulação rítmica e alternada com folga total para passagem inferior
    this.createFloatingPlatform(3280, groundY - 76, 4);
    this.createFloatingPlatform(3510, groundY - 72, 2);
    this.createFloatingPlatform(3690, groundY - 110, 3);
    this.createFloatingPlatform(3920, groundY - 74, 3);

    // --- Setor 5: Após Cano 4 (4150) até o Fim do Mapa (4800) ---
    // Grande mirante final largo de contemplação
    this.createFloatingPlatform(4410, groundY - 85, 5);
  }

  /**
   * Cria uma plataforma flutuante com blocos conectados (Camada 40)
   */
  createFloatingPlatform(startX, y, blockCount) {
    for (let i = 0; i < blockCount; i++) {
      let textureKey = 'tile_platform';
      if (blockCount > 1) {
        if (i === 0) {
          textureKey = 'tile_platform_left';
        } else if (i === blockCount - 1) {
          textureKey = 'tile_platform_right';
        }
      }
      const block = this.groundGroup.create(startX + i * 32 + 16, y, textureKey);
      block.setDepth(40);
      block.refreshBody();
    }
  }

  update(time, delta) {
    // Atualiza física e movimentação do jogador
    this.player.update(time, delta);

    // Atualiza verificação de proximidade e interação em cada um dos 4 canos
    this.pipes.forEach(pipe => pipe.update(this.player));
  }
}
