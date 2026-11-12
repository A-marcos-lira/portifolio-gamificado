import { SECTIONS_DATA } from '../data/sectionsData.js';
import { audioManager } from '../audio/AudioManager.js';

/**
 * Gerenciador Unificado de Telas Modais para as 4 Seções do Portfólio
 */
export class SectionModal {
  constructor(onCloseCallback) {
    this.onCloseCallback = onCloseCallback;
    this.modalEl = document.getElementById('about-modal');
    this.titleEl = document.getElementById('modal-title');
    this.bodyEl = document.getElementById('modal-body');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.backBtn = document.getElementById('back-to-game-btn');
    this.currentSectionId = null;
    this.isFirstVisitSection = false;
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

    // Eventos delegados do corpo do modal (Abas de Habilidades e Copiar E-mail)
    if (this.bodyEl) {
      this.bodyEl.addEventListener('click', (e) => {
        // 1. Botão de Copiar E-mail (evita disparar o link mailto do card)
        const copyBtn = e.target.closest('.copy-email-btn');
        if (copyBtn) {
          e.preventDefault();
          e.stopPropagation();
          audioManager.playButtonClick();
          const email = copyBtn.getAttribute('data-email');
          if (email) {
            const doFeedback = () => {
              copyBtn.classList.add('copied');
              if (copyBtn._copyTimeout) {
                clearTimeout(copyBtn._copyTimeout);
              }
              copyBtn._copyTimeout = setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn._copyTimeout = null;
              }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(email)
                .then(doFeedback)
                .catch(() => {
                  this.copyFallback(email);
                  doFeedback();
                });
            } else {
              this.copyFallback(email);
              doFeedback();
            }
          }
          return;
        }

        // 2. Alternância de Abas na Árvore de Habilidades
        const tabBtn = e.target.closest('.skill-tab-btn');
        if (tabBtn) {
          audioManager.playButtonClick();
          const tabId = tabBtn.getAttribute('data-tab');
          this.switchSkillTab(tabId);
          return;
        }

        // 3. Botões interativos de missões / links
        const actionBtn = e.target.closest('.mission-btn, .contact-card');
        if (actionBtn) {
          audioManager.playButtonClick();
        }
      });
    }

    // Fechar com a tecla ESC
    window.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    });
  }

  /**
   * Alterna as abas e árvores da seção de Habilidades
   * @param {string} tabId - 'dev', 'tools' ou 'soft'
   */
  switchSkillTab(tabId) {
    if (!this.bodyEl) return;
    const tabButtons = this.bodyEl.querySelectorAll('.skill-tab-btn');
    const treePanels = this.bodyEl.querySelectorAll('.skill-tree-panel');

    tabButtons.forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    treePanels.forEach(panel => {
      const isTarget = panel.getAttribute('id') === `tree-panel-${tabId}`;
      panel.classList.toggle('active', isTarget);
    });
  }

  /**
   * Fallback de cópia para navegadores ou contextos sem clipboard API
   * @param {string} text - Texto a ser copiado
   */
  copyFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Falha ao copiar:', err);
    }
    document.body.removeChild(textarea);
  }

  /**
   * Abre o modal injetando o conteúdo da seção solicitada
   * @param {string} sectionId - 'about', 'projects', 'skills' ou 'contact'
   * @param {boolean} isFirstVisit - Indica se é a primeira visita para recompensar no retorno
   */
  open(sectionId = 'about', isFirstVisit = false) {
    const wasClosed = !this.isOpen;
    this.currentSectionId = sectionId;
    this.isFirstVisitSection = Boolean(isFirstVisit);
    const section = SECTIONS_DATA[sectionId] || SECTIONS_DATA.about;

    if (this.titleEl) {
      this.titleEl.textContent = section.title;
    }

    if (this.bodyEl) {
      this.bodyEl.innerHTML = section.renderContent();
      // Reseta rolagem para o topo
      this.bodyEl.scrollTop = 0;
    }

    this.isOpen = true;
    this.modalEl.classList.remove('hidden');
    this.modalEl.setAttribute('aria-hidden', 'false');

    // Som de abertura de menu discreto (open_002.ogg)
    if (wasClosed) {
      audioManager.playModalOpen();
    }

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

    const sectionId = this.currentSectionId;
    const isFirstVisit = this.isFirstVisitSection;
    this.isFirstVisitSection = false;

    // Se NÃO for primeira visita, toca o som discreto de fechamento (close_002.ogg).
    // Se for primeira visita, prioriza o som de conquista (Coin 3.wav) que tocará
    // no momento do retorno ao mapa, evitando qualquer sobreposição sonora!
    if (!isFirstVisit) {
      audioManager.playModalClose();
    }

    this.modalEl.classList.add('hidden');
    this.modalEl.setAttribute('aria-hidden', 'true');

    // Aguarda a transição suave de CSS antes de avisar o jogo
    setTimeout(() => {
      if (this.onCloseCallback) {
        this.onCloseCallback(sectionId, isFirstVisit);
      }
    }, 280);
  }
}

// Alias para manter compatibilidade com códigos legados
export { SectionModal as AboutModal };

