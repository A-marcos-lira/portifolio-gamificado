import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.js';

/**
 * Calcula as dimensões nativas da área visível acompanhando a proporção da janela do navegador.
 * Mantém a altura base de 360px para preservar os sprites e física 16-bit nítidos (sem esticar),
 * adaptando a largura visível para cobrir 100% da tela sem barras pretas laterais.
 */
export function calculateGameDimensions() {
  const baseHeight = 360;
  const aspect = window.innerWidth > 0 && window.innerHeight > 0
    ? window.innerWidth / window.innerHeight
    : 16 / 9;

  // A largura adapta-se dinamicamente à proporção do navegador
  // Garantimos um mínimo de 640px para boa visibilidade em qualquer dispositivo
  const calculatedWidth = Math.round(baseHeight * aspect);
  const width = Math.max(640, Math.min(1400, calculatedWidth));

  return { width, height: baseHeight };
}

const initialDims = calculateGameDimensions();

/**
 * Configuração Principal do Jogo Phaser 3
 */
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: initialDims.width,
  height: initialDims.height,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#60a5fa', // Céu azul contínuo
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Cada entidade gerencia sua gravidade personalizada
      debug: false
    }
  },
  scene: [MainScene]
};

// Inicializa a instância do jogo
export const game = new Phaser.Game(config);

// Redimensionamento responsivo sem distorção e sem barras pretas
window.addEventListener('resize', () => {
  if (!game || !game.scale) return;
  const newDims = calculateGameDimensions();
  game.scale.resize(newDims.width, newDims.height);
});
