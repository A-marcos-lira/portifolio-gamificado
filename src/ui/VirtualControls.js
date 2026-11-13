/**
 * Gerenciador de Controles Virtuais Touch (Mobile e Tablets)
 * Implementa mecânica de "Double Tap Run" (toque duplo para correr)
 * com suporte completo a multi-touch via Pointer Events.
 */
export class VirtualControls {
  constructor(player) {
    this.player = player;
    this.container = document.getElementById('virtual-controls');
    this.btnLeft = document.getElementById('btn-left');
    this.btnRight = document.getElementById('btn-right');
    this.btnDown = document.getElementById('btn-down');
    this.btnJump = document.getElementById('btn-jump');

    // Configurações da mecânica de Double Tap Run
    this.DOUBLE_TAP_DELAY = 300;       // Intervalo máx (ms) entre soltar o 1º toque e pressionar o 2º toque
    this.MAX_FIRST_TAP_DURATION = 280;  // Duração máx (ms) do 1º toque para ser considerado tap rápido

    // Estados internos
    this.lastTapDir = null;             // 'left' | 'right' | null
    this.lastReleaseTime = 0;           // Timestamp (ms) de quando o último toque rápido foi solto
    this.pressStartTime = { left: 0, right: 0, down: 0 };
    this.isRunning = false;

    this.checkVisibility();
    this.bindEvents();

    window.addEventListener('resize', () => this.checkVisibility());
    window.addEventListener('blur', () => this.reset());
  }

  checkVisibility() {
    // Exibe controles virtuais em telas touch ou com largura inferior a 1024px
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;

    if (isTouchDevice || isSmallScreen) {
      this.container.classList.remove('hidden');
    } else {
      this.container.classList.add('hidden');
    }
  }

  bindEvents() {
    // Vincula direcionais com suporte a Double Tap Run
    this.bindDirectionButton(this.btnLeft, 'left');
    this.bindDirectionButton(this.btnRight, 'right');

    // Vincula botão de descida / tubulação
    this.bindDownButton(this.btnDown);

    // Vincula botão de pulo (PULO)
    this.bindJumpButton(this.btnJump);
  }

  /**
   * Vincula botão direcional (esquerda/direita) com detecção de Double Tap Run
   */
  bindDirectionButton(element, dir) {
    if (!element) return;

    const onPointerDown = (e) => {
      e.preventDefault();
      try {
        element.setPointerCapture(e.pointerId);
      } catch (_) {}

      const now = performance.now();
      this.pressStartTime[dir] = now;

      // Verifica se é o segundo toque rápido na MESMA direção (Double Tap)
      const isSameDir = this.lastTapDir === dir;
      const timeSinceLastRelease = now - this.lastReleaseTime;
      const isQuickSecondTap = isSameDir && (timeSinceLastRelease <= this.DOUBLE_TAP_DELAY);

      if (isQuickSecondTap) {
        // ATIVA CORRIDA: o jogador mantém o 2º toque pressionado para correr
        this.isRunning = true;
        this.player.virtualInput.run = true;
        element.classList.add('running');
        // Consome o registro do tap para evitar alternâncias em toques subsequentes
        this.lastTapDir = null;
      } else {
        // ANDAR NORMAL: primeiro toque ou toque após tempo limite
        this.isRunning = false;
        this.player.virtualInput.run = false;
        element.classList.remove('running');

        // Se tocou na direção oposta, cancela qualquer tap pendente da outra direção
        if (!isSameDir) {
          this.lastTapDir = null;
        }
      }

      // Ativa movimento direcional
      this.player.virtualInput[dir] = true;
      element.classList.add('pressed');
    };

    const onPointerUp = (e) => {
      e.preventDefault();
      try {
        if (element.hasPointerCapture(e.pointerId)) {
          element.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      const now = performance.now();
      const pressDuration = now - (this.pressStartTime[dir] || 0);

      if (this.isRunning) {
        // Ao soltar enquanto corria, desativa imediatamente a corrida
        this.isRunning = false;
        this.player.virtualInput.run = false;
        this.lastTapDir = null; // Próximo toque começará do zero (caminhando)
      } else if (pressDuration <= this.MAX_FIRST_TAP_DURATION) {
        // Toque rápido concluído: registra como 1º tap para possível double tap
        this.lastTapDir = dir;
        this.lastReleaseTime = now;
      } else {
        // Toque longo (caminhada sustentada): não qualifica como 1º tap de double tap
        this.lastTapDir = null;
      }

      // Desativa movimento direcional
      this.player.virtualInput[dir] = false;
      element.classList.remove('pressed');
      element.classList.remove('running');
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
  }

  /**
   * Vincula botão de descida / tubulação (▼)
   * Isola comandos verticais para evitar interferência com o double tap horizontal
   */
  bindDownButton(element) {
    if (!element) return;

    const onPointerDown = (e) => {
      e.preventDefault();
      try {
        element.setPointerCapture(e.pointerId);
      } catch (_) {}

      // Tocar em 'baixo' anula qualquer double tap horizontal pendente
      this.lastTapDir = null;
      this.player.virtualInput.down = true;
      element.classList.add('pressed');
    };

    const onPointerUp = (e) => {
      e.preventDefault();
      try {
        if (element.hasPointerCapture(e.pointerId)) {
          element.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      this.player.virtualInput.down = false;
      element.classList.remove('pressed');
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
  }

  /**
   * Vincula botão de pulo (PULO)
   * Suporta multi-touch com direção para permitir pular enquanto corre
   */
  bindJumpButton(element) {
    if (!element) return;

    const onPointerDown = (e) => {
      e.preventDefault();
      try {
        element.setPointerCapture(e.pointerId);
      } catch (_) {}

      this.player.virtualInput.jump = true;
      this.player.virtualInput.justJump = true;
      element.classList.add('pressed');
    };

    const onPointerUp = (e) => {
      e.preventDefault();
      try {
        if (element.hasPointerCapture(e.pointerId)) {
          element.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      this.player.virtualInput.jump = false;
      element.classList.remove('pressed');
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
  }

  /**
   * Reseta todos os estados dos controles virtuais (usado ao abrir/fechar modais ou perder foco)
   */
  reset() {
    this.isRunning = false;
    this.lastTapDir = null;
    this.lastReleaseTime = 0;

    if (this.player && this.player.virtualInput) {
      this.player.virtualInput.left = false;
      this.player.virtualInput.right = false;
      this.player.virtualInput.down = false;
      this.player.virtualInput.jump = false;
      this.player.virtualInput.run = false;
      this.player.virtualInput.justJump = false;
    }

    [this.btnLeft, this.btnRight, this.btnDown, this.btnJump].forEach((btn) => {
      if (btn) {
        btn.classList.remove('pressed', 'running');
      }
    });
  }
}
