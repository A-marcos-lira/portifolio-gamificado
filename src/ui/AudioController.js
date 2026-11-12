import { audioManager } from '../audio/AudioManager.js';

/**
 * AudioController.js — Interface do Usuário para Controle de Áudio
 * Gerencia o botão do HUD, popover de volumes e estado de mudo.
 */
export class AudioController {
  constructor() {
    this.container = document.getElementById('audio-control-container');
    this.toggleBtn = document.getElementById('audio-toggle-btn');
    this.iconEl = document.getElementById('audio-icon');
    this.panelEl = document.getElementById('audio-panel');
    this.closeBtn = document.getElementById('audio-panel-close');

    this.musicSlider = document.getElementById('music-volume');
    this.sfxSlider = document.getElementById('sfx-volume');
    this.musicValLabel = document.getElementById('music-vol-val');
    this.sfxValLabel = document.getElementById('sfx-vol-val');
    this.muteCheckbox = document.getElementById('mute-all-checkbox');

    this.isOpen = false;
    this.initUI();
    this.bindEvents();
  }

  initUI() {
    // Sincroniza estado inicial com o AudioManager (restaurado do localStorage)
    const musicPct = Math.round(audioManager.musicVolume * 100);
    const sfxPct = Math.round(audioManager.sfxVolume * 100);

    if (this.musicSlider) this.musicSlider.value = musicPct;
    if (this.sfxSlider) this.sfxSlider.value = sfxPct;
    if (this.musicValLabel) this.musicValLabel.textContent = `${musicPct}%`;
    if (this.sfxValLabel) this.sfxValLabel.textContent = `${sfxPct}%`;
    if (this.muteCheckbox) this.muteCheckbox.checked = audioManager.isMuted;

    this.updateIcon();
  }

  updateIcon() {
    if (!this.iconEl) return;
    if (audioManager.isMuted || (audioManager.musicVolume === 0 && audioManager.sfxVolume === 0)) {
      this.iconEl.textContent = '🔇';
      if (this.toggleBtn) this.toggleBtn.classList.add('muted');
    } else {
      this.iconEl.textContent = '🔊';
      if (this.toggleBtn) this.toggleBtn.classList.remove('muted');
    }
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        audioManager.playButtonClick();
        this.togglePanel();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        audioManager.playButtonClick();
        this.closePanel();
      });
    }

    // Slider de Volume da Música
    if (this.musicSlider) {
      const updateMusic = (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.musicValLabel) this.musicValLabel.textContent = `${val}%`;
        audioManager.setMusicVolume(val / 100);
        this.updateIcon();
      };
      this.musicSlider.addEventListener('input', updateMusic);
      this.musicSlider.addEventListener('change', (e) => {
        updateMusic(e);
        audioManager.playButtonClick();
      });
      this.musicSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Slider de Volume dos Efeitos
    if (this.sfxSlider) {
      const updateSfx = (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.sfxValLabel) this.sfxValLabel.textContent = `${val}%`;
        audioManager.setSfxVolume(val / 100);
        this.updateIcon();
      };
      this.sfxSlider.addEventListener('input', updateSfx);
      this.sfxSlider.addEventListener('change', (e) => {
        updateSfx(e);
        audioManager.playButtonClick();
      });
      this.sfxSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Checkbox Mute All
    if (this.muteCheckbox) {
      this.muteCheckbox.addEventListener('change', (e) => {
        const isMuted = e.target.checked;
        audioManager.toggleMute(isMuted);
        this.updateIcon();
        audioManager.playButtonClick();
      });
      this.muteCheckbox.addEventListener('click', (e) => e.stopPropagation());
    }

    // Evita propagação de cliques dentro do painel para o jogo
    if (this.panelEl) {
      this.panelEl.addEventListener('click', (e) => e.stopPropagation());
      this.panelEl.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    }

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (this.isOpen && this.container && !this.container.contains(e.target)) {
        this.closePanel();
      }
    });

    // Fechar com tecla Escape
    window.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.closePanel();
      }
    });
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel() {
    this.isOpen = true;
    if (this.panelEl) {
      this.panelEl.classList.remove('hidden');
    }
  }

  closePanel() {
    this.isOpen = false;
    if (this.panelEl) {
      this.panelEl.classList.add('hidden');
    }
  }
}

