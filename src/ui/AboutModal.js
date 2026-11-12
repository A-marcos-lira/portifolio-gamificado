/**
 * Gerenciador da Seção "Sobre Mim" (Modal HTML/CSS)
 */
export class AboutModal {
  constructor(onCloseCallback) {
    this.onCloseCallback = onCloseCallback;
    this.modalEl = document.getElementById('about-modal');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.backBtn = document.getElementById('back-to-game-btn');
    this.isOpen = false;

    this.bindEvents();
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.close());
    }

    // Fechar com a tecla ESC
    window.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modalEl.classList.remove('hidden');
    this.modalEl.setAttribute('aria-hidden', 'false');

    // Foca o botão principal para navegação por teclado
    setTimeout(() => {
      if (this.backBtn) {
        this.backBtn.focus();
      }
    }, 100);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modalEl.classList.add('hidden');
    this.modalEl.setAttribute('aria-hidden', 'true');

    // Aguarda a transição CSS antes de avisar o jogo
    setTimeout(() => {
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    }, 280);
  }
}

