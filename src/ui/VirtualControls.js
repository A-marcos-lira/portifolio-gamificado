/**
 * Gerenciador de Controles Virtuais Touch (Mobile e Tablets)
 */
export class VirtualControls {
  constructor(player) {
    this.player = player;
    this.container = document.getElementById('virtual-controls');
    this.btnLeft = document.getElementById('btn-left');
    this.btnRight = document.getElementById('btn-right');
    this.btnDown = document.getElementById('btn-down');
    this.btnRun = document.getElementById('btn-run');
    this.btnJump = document.getElementById('btn-jump');

    this.checkVisibility();
    this.bindEvents();

    window.addEventListener('resize', () => this.checkVisibility());
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
    this.bindButton(this.btnLeft, 'left');
    this.bindButton(this.btnRight, 'right');
    this.bindButton(this.btnDown, 'down');
    this.bindButton(this.btnRun, 'run');

    // Botão de pulo com suporte a 'justJump' para trigger instantâneo
    if (this.btnJump) {
      const startJump = (e) => {
        e.preventDefault();
        this.player.virtualInput.jump = true;
        this.player.virtualInput.justJump = true;
        this.btnJump.classList.add('pressed');
      };
      const endJump = (e) => {
        e.preventDefault();
        this.player.virtualInput.jump = false;
        this.btnJump.classList.remove('pressed');
      };

      this.btnJump.addEventListener('touchstart', startJump, { passive: false });
      this.btnJump.addEventListener('touchend', endJump, { passive: false });
      this.btnJump.addEventListener('touchcancel', endJump, { passive: false });
      this.btnJump.addEventListener('mousedown', startJump);
      this.btnJump.addEventListener('mouseup', endJump);
      this.btnJump.addEventListener('mouseleave', endJump);
    }
  }

  bindButton(element, inputKey) {
    if (!element) return;

    const startAction = (e) => {
      e.preventDefault();
      this.player.virtualInput[inputKey] = true;
      element.classList.add('pressed');
    };

    const endAction = (e) => {
      e.preventDefault();
      this.player.virtualInput[inputKey] = false;
      element.classList.remove('pressed');
    };

    element.addEventListener('touchstart', startAction, { passive: false });
    element.addEventListener('touchend', endAction, { passive: false });
    element.addEventListener('touchcancel', endAction, { passive: false });
    element.addEventListener('mousedown', startAction);
    element.addEventListener('mouseup', endAction);
    element.addEventListener('mouseleave', endAction);
  }
}

