/**
 * AudioManager.js — Sistema Central de Áudio do Portfólio Gamificado
 * Gerencia Trilha Sonora (Loop Contínuo), Efeitos Sonoros (Zero Latência via Web Audio),
 * Persistência no localStorage e Políticas de Autoplay de Navegadores.
 */
export class AudioManager {
  constructor() {
    this.STORAGE_KEY_MUSIC = 'portfolio_music_vol';
    this.STORAGE_KEY_SFX = 'portfolio_sfx_vol';
    this.STORAGE_KEY_MUTED = 'portfolio_audio_muted';

    // Volumes padrão
    this.musicVolume = 0.25; // 25% inicial
    this.sfxVolume = 0.40;   // 40% inicial
    this.isMuted = false;
    this.isUnlocked = false;

    // Carrega preferências salvas
    this.loadPreferences();

    // Base URL do Vite para compatibilidade com GitHub Pages e subpastas
    const BASE_URL = import.meta.env.BASE_URL || './';
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    const getAudioUrl = (file) => `${cleanBase}assets/audio/${file}`;

    // 1. Trilha Sonora de Fundo (HTML5 Audio Streaming para baixo consumo de memória)
    this.bgMusic = new Audio(getAudioUrl('bg_music.ogg'));
    this.bgMusic.loop = true;
    this.bgMusic.preload = 'auto';
    this.applyMusicVolume();

    // 2. Web Audio API para Efeitos Sonoros com Zero Latência
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      try {
        this.ctx = new AudioContextClass();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.connect(this.ctx.destination);
        this.applySfxVolume();
      } catch (err) {
        console.warn('Web Audio API não inicializada:', err);
      }
    }

    // Mapa de arquivos de efeitos sonoros aprovados
    this.sfxUrls = {
      jump: getAudioUrl('jump.wav'),
      pipe: getAudioUrl('pipe.wav'),
      modal_open: getAudioUrl('modal_open.ogg'),
      modal_close: getAudioUrl('modal_close.ogg'),
      achievement: getAudioUrl('achievement.wav'),
      button_click: getAudioUrl('button_click.ogg')
    };

    this.sfxBuffers = {};
    this.preloadSfx();

    // Desbloqueio de autoplay no primeiro gesto do usuário
    this.setupAutoplayUnlock();
  }

  /**
   * Carrega preferências do localStorage
   */
  loadPreferences() {
    try {
      const savedMusic = localStorage.getItem(this.STORAGE_KEY_MUSIC);
      if (savedMusic !== null) {
        const val = parseFloat(savedMusic);
        if (!isNaN(val) && val >= 0 && val <= 1) this.musicVolume = val;
      }

      const savedSfx = localStorage.getItem(this.STORAGE_KEY_SFX);
      if (savedSfx !== null) {
        const val = parseFloat(savedSfx);
        if (!isNaN(val) && val >= 0 && val <= 1) this.sfxVolume = val;
      }

      const savedMuted = localStorage.getItem(this.STORAGE_KEY_MUTED);
      if (savedMuted !== null) {
        this.isMuted = (savedMuted === 'true');
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage:', e);
    }
  }

  /**
   * Salva preferências no localStorage
   */
  savePreferences() {
    try {
      localStorage.setItem(this.STORAGE_KEY_MUSIC, this.musicVolume.toString());
      localStorage.setItem(this.STORAGE_KEY_SFX, this.sfxVolume.toString());
      localStorage.setItem(this.STORAGE_KEY_MUTED, this.isMuted.toString());
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }

  /**
   * Pré-carrega buffers de áudio para reprodução instantânea
   */
  async preloadSfx() {
    if (!this.ctx) return;
    for (const [key, url] of Object.entries(this.sfxUrls)) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const arrayBuffer = await res.arrayBuffer();
        this.ctx.decodeAudioData(arrayBuffer, (decoded) => {
          this.sfxBuffers[key] = decoded;
        }, (err) => {
          console.warn(`Erro ao decodificar ${key}:`, err);
        });
      } catch (err) {
        console.warn(`Falha ao carregar SFX ${key}:`, err);
      }
    }
  }

  /**
   * Configura desbloqueio de áudio para compatibilidade com políticas de navegadores
   */
  setupAutoplayUnlock() {
    const unlock = () => {
      this.unlockAudio();
      ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['click', 'keydown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  /**
   * Desbloqueia o contexto de áudio e inicia a música caso permitido
   */
  unlockAudio() {
    this.isUnlocked = true;

    // Retoma o AudioContext se estiver suspenso
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Inicia a música de fundo se não estiver mutada
    if (!this.isMuted && this.bgMusic.paused) {
      this.bgMusic.play().catch(err => {
        console.warn('Autoplay bloqueado pelo navegador:', err);
      });
    }
  }

  /**
   * Ajusta o volume da música
   * @param {number} vol - 0.0 a 1.0
   */
  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.applyMusicVolume();
    this.savePreferences();

    if (!this.isMuted && this.musicVolume > 0 && this.isUnlocked && this.bgMusic.paused) {
      this.bgMusic.play().catch(() => {});
    }
  }

  applyMusicVolume() {
    if (!this.bgMusic) return;
    this.bgMusic.volume = this.isMuted ? 0 : this.musicVolume;
  }

  /**
   * Ajusta o volume dos efeitos sonoros
   * @param {number} vol - 0.0 a 1.0
   */
  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this.applySfxVolume();
    this.savePreferences();
  }

  applySfxVolume() {
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
    }
  }

  /**
   * Alterna ou define o estado de mudo geral
   * @param {boolean|null} forceMute - Opcional para forçar true/false
   */
  toggleMute(forceMute = null) {
    this.isMuted = (forceMute !== null) ? forceMute : !this.isMuted;
    this.applyMusicVolume();
    this.applySfxVolume();
    this.savePreferences();

    if (!this.isMuted && this.isUnlocked && this.bgMusic.paused && this.musicVolume > 0) {
      this.bgMusic.play().catch(() => {});
    }

    return this.isMuted;
  }

  /**
   * Reproduz um efeito sonoro
   * @param {string} key - 'jump', 'pipe', 'modal_open', 'modal_close', 'achievement', 'button_click'
   */
  play(key) {
    if (this.isMuted || this.sfxVolume <= 0) return;

    // Desbloqueia caso seja a primeira ação
    if (!this.isUnlocked) {
      this.unlockAudio();
    }

    // 1. Tenta via Web Audio Buffer (Zero Latência)
    if (this.ctx && this.sfxBuffers[key]) {
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        const source = this.ctx.createBufferSource();
        source.buffer = this.sfxBuffers[key];
        source.connect(this.sfxGain);
        source.start(0);
        return;
      } catch (e) {
        console.warn('Erro ao reproduzir via Web Audio:', e);
      }
    }

    // 2. Fallback resiliente via HTML5 Audio se o buffer ainda não carregou
    const url = this.sfxUrls[key];
    if (url) {
      try {
        const audio = new Audio(url);
        audio.volume = this.sfxVolume;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }

  // Atalhos semânticos para cada ação
  playJump() { this.play('jump'); }
  playPipe() { this.play('pipe'); }
  playModalOpen() { this.play('modal_open'); }
  playModalClose() { this.play('modal_close'); }
  playAchievement() { this.play('achievement'); }
  playButtonClick() { this.play('button_click'); }
}

// Instância Singleton exportada
export const audioManager = new AudioManager();

