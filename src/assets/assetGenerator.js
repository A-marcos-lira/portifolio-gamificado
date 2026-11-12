/**
 * Gerador de Texturas Procedurais em Pixel Art 16-bit
 * Cria os gráficos diretamente em Canvas para garantir que o projeto seja
 * totalmente autônomo, nítido (pixel-perfect) e livre de assets de terceiros.
 */

export function generateGameAssets(scene) {
  generateTerrainTiles(scene);
  generateSceneryElements(scene);
  generatePipeAssets(scene);
  generatePlayerSprites(scene);
}

/**
 * Cria os tiles do terreno (grama e terra) 32x32
 */
function generateTerrainTiles(scene) {
  // Tile de Grama (Superfície)
  const grassCanvas = scene.textures.createCanvas('tile_grass', 32, 32);
  const ctxG = grassCanvas.getContext();
  
  // Terra base
  ctxG.fillStyle = '#8b5a2b';
  ctxG.fillRect(0, 0, 32, 32);
  
  // Detalhes da terra (pedrinhas e sombras)
  ctxG.fillStyle = '#6b421a';
  ctxG.fillRect(4, 16, 4, 4);
  ctxG.fillRect(18, 22, 6, 4);
  ctxG.fillRect(10, 26, 4, 3);
  ctxG.fillRect(24, 14, 4, 4);
  
  ctxG.fillStyle = '#a6723e';
  ctxG.fillRect(8, 18, 3, 2);
  ctxG.fillRect(22, 24, 2, 2);

  // Camada de grama (verde vibrante com destaques e sombra)
  ctxG.fillStyle = '#22c55e';
  ctxG.fillRect(0, 0, 32, 10);
  
  // Destaque de luz no topo da grama
  ctxG.fillStyle = '#86efac';
  ctxG.fillRect(0, 0, 32, 2);
  ctxG.fillRect(2, 2, 8, 2);
  ctxG.fillRect(14, 2, 10, 2);

  // Borda inferior da grama (folhas caindo sobre a terra)
  ctxG.fillStyle = '#15803d';
  ctxG.fillRect(0, 8, 32, 2);
  ctxG.fillRect(2, 10, 4, 3);
  ctxG.fillRect(10, 10, 3, 4);
  ctxG.fillRect(18, 10, 4, 3);
  ctxG.fillRect(26, 10, 4, 4);

  grassCanvas.refresh();

  // Tile de Terra Pura (Subterrâneo / Blocos internos)
  const dirtCanvas = scene.textures.createCanvas('tile_dirt', 32, 32);
  const ctxD = dirtCanvas.getContext();
  ctxD.fillStyle = '#784b23';
  ctxD.fillRect(0, 0, 32, 32);
  
  ctxD.fillStyle = '#593414';
  ctxD.fillRect(4, 6, 6, 5);
  ctxD.fillRect(18, 14, 5, 5);
  ctxD.fillRect(8, 22, 4, 4);
  ctxD.fillRect(22, 24, 6, 4);

  ctxD.fillStyle = '#946132';
  ctxD.fillRect(10, 8, 3, 3);
  ctxD.fillRect(24, 16, 3, 3);
  ctxD.fillRect(12, 24, 2, 2);

  dirtCanvas.refresh();

  // Plataforma Flutuante Consistente com o Terreno (Grama verde no topo e terra/pedra marrom)
  // 1. Bloco Central (tile_platform_mid / tile_platform)
  const platMidCanvas = scene.textures.createCanvas('tile_platform', 32, 20);
  const ctxPM = platMidCanvas.getContext();
  
  // Base de terra/pedra marrom consistente com tile_grass
  ctxPM.fillStyle = '#8b5a2b';
  ctxPM.fillRect(0, 0, 32, 20);
  
  // Detalhes da terra e pedrinhas
  ctxPM.fillStyle = '#6b421a';
  ctxPM.fillRect(6, 11, 4, 3);
  ctxPM.fillRect(20, 13, 5, 3);
  ctxPM.fillStyle = '#a6723e';
  ctxPM.fillRect(14, 12, 3, 2);

  // Contorno inferior escuro bem definido em pixel art
  ctxPM.fillStyle = '#451a03';
  ctxPM.fillRect(0, 18, 32, 2);

  // Camada de grama verde no topo
  ctxPM.fillStyle = '#22c55e';
  ctxPM.fillRect(0, 0, 32, 7);
  
  // Luz no topo da grama
  ctxPM.fillStyle = '#86efac';
  ctxPM.fillRect(0, 0, 32, 2);
  
  // Sombra e pontinhas da grama sobre a terra
  ctxPM.fillStyle = '#15803d';
  ctxPM.fillRect(0, 6, 32, 2);
  ctxPM.fillRect(3, 8, 3, 2);
  ctxPM.fillRect(11, 8, 4, 3);
  ctxPM.fillRect(21, 8, 3, 2);
  ctxPM.fillRect(27, 8, 3, 3);

  platMidCanvas.refresh();

  // 2. Bloco da Esquerda com borda definida (tile_platform_left)
  const platLeftCanvas = scene.textures.createCanvas('tile_platform_left', 32, 20);
  const ctxPL = platLeftCanvas.getContext();
  
  ctxPL.fillStyle = '#8b5a2b';
  ctxPL.fillRect(2, 0, 30, 20);
  ctxPL.fillStyle = '#451a03';
  ctxPL.fillRect(0, 2, 2, 17);
  ctxPL.fillRect(0, 18, 32, 2);
  ctxPL.fillStyle = '#6b421a';
  ctxPL.fillRect(6, 12, 4, 3);
  ctxPL.fillRect(18, 14, 5, 3);

  // Grama esquerda
  ctxPL.fillStyle = '#22c55e';
  ctxPL.fillRect(2, 0, 30, 7);
  ctxPL.fillRect(0, 1, 2, 4);
  ctxPL.fillStyle = '#86efac';
  ctxPL.fillRect(1, 0, 31, 2);
  ctxPL.fillStyle = '#15803d';
  ctxPL.fillRect(2, 6, 30, 2);
  ctxPL.fillRect(6, 8, 4, 3);
  ctxPL.fillRect(18, 8, 3, 2);
  ctxPL.fillRect(26, 8, 4, 3);

  platLeftCanvas.refresh();

  // 3. Bloco da Direita com borda definida (tile_platform_right)
  const platRightCanvas = scene.textures.createCanvas('tile_platform_right', 32, 20);
  const ctxPR = platRightCanvas.getContext();
  
  ctxPR.fillStyle = '#8b5a2b';
  ctxPR.fillRect(0, 0, 30, 20);
  ctxPR.fillStyle = '#451a03';
  ctxPR.fillRect(30, 2, 2, 17);
  ctxPR.fillRect(0, 18, 32, 2);
  ctxPR.fillStyle = '#6b421a';
  ctxPR.fillRect(10, 12, 5, 3);

  // Grama direita
  ctxPR.fillStyle = '#22c55e';
  ctxPR.fillRect(0, 0, 30, 7);
  ctxPR.fillRect(30, 1, 2, 4);
  ctxPR.fillStyle = '#86efac';
  ctxPR.fillRect(0, 0, 31, 2);
  ctxPR.fillStyle = '#15803d';
  ctxPR.fillRect(0, 6, 30, 2);
  ctxPR.fillRect(5, 8, 3, 2);
  ctxPR.fillRect(14, 8, 4, 3);
  ctxPR.fillRect(24, 8, 3, 2);

  platRightCanvas.refresh();
}

/**
 * Cria elementos visuais decorativos (nuvens, montanhas e árvores)
 */
function generateSceneryElements(scene) {
  // 1. Nuvem Média em Pixel Art 16-bit (64x24)
  const cloudCanvas = scene.textures.createCanvas('scenery_cloud', 64, 24);
  const ctxC = cloudCanvas.getContext();
  // Base branca sólida e bem definida
  ctxC.fillStyle = '#ffffff';
  ctxC.fillRect(10, 8, 44, 12);
  ctxC.fillRect(6, 11, 52, 9);
  ctxC.fillRect(16, 4, 20, 8);
  ctxC.fillRect(32, 2, 16, 10);
  // Sombra suave inferior clássica de pixel art
  ctxC.fillStyle = '#dbeafe';
  ctxC.fillRect(8, 17, 48, 3);
  ctxC.fillRect(12, 19, 40, 2);
  cloudCanvas.refresh();

  // 2. Nuvem Pequena em Pixel Art 16-bit (44x18)
  const cloudSmallCanvas = scene.textures.createCanvas('scenery_cloud_small', 44, 18);
  const ctxCS = cloudSmallCanvas.getContext();
  ctxCS.fillStyle = '#ffffff';
  ctxCS.fillRect(6, 6, 32, 9);
  ctxCS.fillRect(3, 8, 38, 7);
  ctxCS.fillRect(12, 3, 14, 6);
  ctxCS.fillRect(22, 2, 12, 7);
  ctxCS.fillStyle = '#dbeafe';
  ctxCS.fillRect(4, 13, 36, 2);
  cloudSmallCanvas.refresh();

  // 3. Montanhas Distantes (Baixas, suaves e discretas no horizonte) - 280x65
  // Altura reduzida para não ocupar a área jogável e tons azuis suaves com baixo contraste
  const mountainFarCanvas = scene.textures.createCanvas('scenery_mountain_far', 280, 65);
  const ctxMF = mountainFarCanvas.getContext();
  
  // Face principal em azul suave pastel (baixo contraste com o céu #60a5fa)
  ctxMF.fillStyle = '#7caed6';
  ctxMF.beginPath();
  ctxMF.moveTo(0, 65);
  ctxMF.quadraticCurveTo(55, 26, 100, 30);
  ctxMF.quadraticCurveTo(145, 34, 185, 16);
  ctxMF.quadraticCurveTo(230, 24, 280, 65);
  ctxMF.closePath();
  ctxMF.fill();

  // Sombra suave na encosta
  ctxMF.fillStyle = '#6b9bc2';
  ctxMF.beginPath();
  ctxMF.moveTo(185, 16);
  ctxMF.quadraticCurveTo(220, 26, 245, 42);
  ctxMF.lineTo(280, 65);
  ctxMF.lineTo(185, 65);
  ctxMF.closePath();
  ctxMF.fill();

  mountainFarCanvas.refresh();

  // 4. Montanhas Médias (Baixas e suaves em azul-esverdeado pastel) - 220x50
  const mountainMidCanvas = scene.textures.createCanvas('scenery_mountain_mid', 220, 50);
  const ctxMM = mountainMidCanvas.getContext();

  ctxMM.fillStyle = '#6fa4a8';
  ctxMM.beginPath();
  ctxMM.moveTo(0, 50);
  ctxMM.quadraticCurveTo(50, 18, 95, 22);
  ctxMM.quadraticCurveTo(140, 12, 175, 20);
  ctxMM.quadraticCurveTo(200, 32, 220, 50);
  ctxMM.closePath();
  ctxMM.fill();

  ctxMM.fillStyle = '#5c9094';
  ctxMM.beginPath();
  ctxMM.moveTo(140, 12);
  ctxMM.quadraticCurveTo(175, 20, 195, 32);
  ctxMM.lineTo(220, 50);
  ctxMM.lineTo(140, 50);
  ctxMM.closePath();
  ctxMM.fill();

  mountainMidCanvas.refresh();

  // Árvore pequena 48x64
  const treeCanvas = scene.textures.createCanvas('scenery_tree', 48, 64);
  const ctxT = treeCanvas.getContext();
  
  // Tronco
  ctxT.fillStyle = '#78350f';
  ctxT.fillRect(20, 36, 8, 28);
  ctxT.fillStyle = '#451a03';
  ctxT.fillRect(24, 36, 4, 28);

  // Copa da árvore (folhagem em camadas)
  ctxT.fillStyle = '#15803d';
  ctxT.fillRect(8, 16, 32, 22);
  ctxT.fillRect(12, 6, 24, 14);

  // Destaque de luz na folhagem
  ctxT.fillStyle = '#22c55e';
  ctxT.fillRect(10, 14, 24, 18);
  ctxT.fillRect(14, 8, 18, 10);
  ctxT.fillStyle = '#86efac';
  ctxT.fillRect(16, 10, 10, 6);
  ctxT.fillRect(12, 16, 12, 6);
  treeCanvas.refresh();
}

/**
 * Cria o cano verde, as placas das seções e o detalhe visual de cano visitado
 */
function generatePipeAssets(scene) {
  // Cano Verde Clássico (48px de largura, 64px de altura)
  const pipeCanvas = scene.textures.createCanvas('pipe_green', 48, 64);
  const ctxP = pipeCanvas.getContext();

  // 1. Corpo inferior do cano (X: 4 a 44 = 40px de largura, Y: 18 a 64)
  ctxP.fillStyle = '#15803d'; // Sombra base
  ctxP.fillRect(4, 18, 40, 46);

  ctxP.fillStyle = '#22c55e'; // Verde médio
  ctxP.fillRect(8, 18, 30, 46);

  ctxP.fillStyle = '#86efac'; // Brilho de reflexo
  ctxP.fillRect(12, 18, 6, 46);

  ctxP.fillStyle = '#14532d'; // Sombra escura direita
  ctxP.fillRect(38, 18, 6, 46);

  // 2. Anel superior do cano (Boca do cano, X: 0 a 48, Y: 0 a 18)
  ctxP.fillStyle = '#15803d';
  ctxP.fillRect(0, 0, 48, 18);

  ctxP.fillStyle = '#22c55e';
  ctxP.fillRect(3, 2, 42, 14);

  ctxP.fillStyle = '#86efac';
  ctxP.fillRect(8, 2, 8, 14);

  ctxP.fillStyle = '#14532d';
  ctxP.fillRect(40, 2, 8, 14);

  // Abertura interna escura no topo (para dar sensação de profundidade)
  ctxP.fillStyle = '#052e16';
  ctxP.fillRect(4, 0, 40, 3);
  pipeCanvas.refresh();

  // Função geradora de placas em estilo pixel art 16-bit (Estado Inicial Verde e Concluído Dourado com ✓)
  const makeSignPair = (textureKey, text, width) => {
    // 1. PLACA NÃO VISITADA (Verde Original)
    const signCanvas = scene.textures.createCanvas(textureKey, width, 26);
    const ctxS = signCanvas.getContext();
    
    // Borda externa escura
    ctxS.fillStyle = '#0f172a';
    ctxS.fillRect(0, 0, width, 26);

    // Moldura verde
    ctxS.fillStyle = '#22c55e';
    ctxS.fillRect(2, 2, width - 4, 22);

    // Brilho no topo da moldura
    ctxS.fillStyle = '#86efac';
    ctxS.fillRect(2, 2, width - 4, 2);

    // Sombra inferior da moldura
    ctxS.fillStyle = '#14532d';
    ctxS.fillRect(2, 22, width - 4, 2);

    // Fundo interno verde escuro
    ctxS.fillStyle = '#052e16';
    ctxS.fillRect(4, 4, width - 8, 18);

    // Texto verde neon centralizado
    ctxS.font = 'bold 8.5px "Press Start 2P", monospace, sans-serif';
    ctxS.fillStyle = '#4ade80';
    ctxS.textAlign = 'center';
    ctxS.textBaseline = 'middle';
    ctxS.fillText(text, width / 2, 14);
    signCanvas.refresh();

    // 2. PLACA CONCLUÍDA (Dourada com Símbolo ✓)
    const completedCanvas = scene.textures.createCanvas(`${textureKey}_completed`, width, 26);
    const ctxC = completedCanvas.getContext();

    // Borda externa escura
    ctxC.fillStyle = '#0f172a';
    ctxC.fillRect(0, 0, width, 26);

    // Moldura amarelo-dourada (#FACC15)
    ctxC.fillStyle = '#FACC15';
    ctxC.fillRect(2, 2, width - 4, 22);

    // Brilho dourado no topo (#FDE68A)
    ctxC.fillStyle = '#FDE68A';
    ctxC.fillRect(2, 2, width - 4, 2);

    // Sombra inferior da moldura (#B45309)
    ctxC.fillStyle = '#B45309';
    ctxC.fillRect(2, 22, width - 4, 2);

    // Fundo interno dourado principal (#D4A017)
    ctxC.fillStyle = '#D4A017';
    ctxC.fillRect(4, 4, width - 8, 18);

    ctxC.font = 'bold 8px "Press Start 2P", monospace, sans-serif';
    const textWidth = ctxC.measureText(text).width;
    const checkWidth = 10;
    const checkGap = 6;
    const totalContentWidth = checkWidth + checkGap + textWidth;
    const startX = Math.round((width - totalContentWidth) / 2);

    // Desenha o pequeno símbolo de confirmação (✓) em pixel art (10x8 px)
    const checkmarkPixels = [
      [0, 3], [0, 4],
      [1, 4], [1, 5],
      [2, 5], [2, 6],
      [3, 6], [3, 7],
      [4, 5], [4, 6],
      [5, 4], [5, 5],
      [6, 3], [6, 4],
      [7, 2], [7, 3],
      [8, 1], [8, 2],
      [9, 0], [9, 1]
    ];
    // Sombra do checkmark
    ctxC.fillStyle = '#78350f';
    checkmarkPixels.forEach(([px, py]) => {
      ctxC.fillRect(startX + px + 1, 9 + py + 1, 1.8, 1.8);
    });
    // Checkmark verde escuro clássico com alto contraste
    ctxC.fillStyle = '#052e16';
    checkmarkPixels.forEach(([px, py]) => {
      ctxC.fillRect(startX + px, 9 + py, 1.8, 1.8);
    });

    // Texto com alto contraste sobre dourado (#0f172a com relevo #FDE68A)
    const textCenterX = startX + checkWidth + checkGap + (textWidth / 2);
    ctxC.textAlign = 'center';
    ctxC.textBaseline = 'middle';

    // Relevo inferior suave
    ctxC.fillStyle = '#FDE68A';
    ctxC.fillText(text, textCenterX, 15);

    // Texto frontal escuro nítido
    ctxC.fillStyle = '#0f172a';
    ctxC.fillText(text, textCenterX, 14);

    completedCanvas.refresh();
  };

  // Placas dos 4 canos (Larguras adaptadas com espaço balanceado para texto e ✓)
  makeSignPair('pipe_sign', 'SOBRE MIM', 120);
  makeSignPair('pipe_sign_about', 'SOBRE MIM', 120);
  makeSignPair('pipe_sign_projects', 'DESENVOLVIDO POR MIM', 208);
  makeSignPair('pipe_sign_skills', 'HABILIDADES', 138);
  makeSignPair('pipe_sign_contact', 'CONTATO', 108);

  // Detalhe visual de seção visitada: Bandeirinha Dourada Pixel Art (16x20)
  const flagCanvas = scene.textures.createCanvas('pipe_visited_flag', 16, 20);
  const ctxF = flagCanvas.getContext();
  // Haste/mastro
  ctxF.fillStyle = '#94a3b8';
  ctxF.fillRect(2, 2, 2, 18);
  ctxF.fillStyle = '#cbd5e1';
  ctxF.fillRect(1, 0, 4, 2); // Ponta esférica

  // Flâmula dourada
  ctxF.fillStyle = '#f59e0b';
  ctxF.fillRect(4, 2, 11, 8);
  ctxF.fillStyle = '#fbbf24';
  ctxF.fillRect(4, 3, 9, 6);
  ctxF.fillStyle = '#fef08a';
  ctxF.fillRect(6, 4, 4, 3);
  // Recorte da ponta da flâmula
  ctxF.clearRect(13, 2, 2, 2);
  ctxF.clearRect(12, 4, 3, 4);
  ctxF.clearRect(13, 8, 2, 2);
  flagCanvas.refresh();

  // Balão de dica "Pressione S ou ↓ para entrar"
  const hintCanvas = scene.textures.createCanvas('pipe_prompt', 150, 24);
  const ctxH = hintCanvas.getContext();
  ctxH.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctxH.fillRect(0, 0, 150, 24);
  ctxH.fillStyle = '#38bdf8';
  ctxH.strokeRect(1, 1, 148, 22);
  ctxH.font = '8px "Press Start 2P", monospace, sans-serif';
  ctxH.fillStyle = '#f8fafc';
  ctxH.textAlign = 'center';
  ctxH.textBaseline = 'middle';
  ctxH.fillText('Pressione S ou ↓', 75, 12);
  hintCanvas.refresh();
}

/**
 * Cria os sprites do Personagem Principal com base nas características:
 * - Cabelo curto, escuro e cacheado
 * - Óculos redondos com armação escura
 * - Bigode e cavanhaque
 * - Camiseta preta
 * - Bermuda preta
 * - Tênis brancos com detalhes escuros
 * 
 * Tamanho do sprite: 32x48 px
 */
function generatePlayerSprites(scene) {
  // Lista de estados para gerar: idle1, idle2, walk1, walk2, walk3, walk4, run1, run2, run3, run4, skid, jump, fall, pipe
  const states = ['idle1', 'idle2', 'walk1', 'walk2', 'walk3', 'walk4', 'run1', 'run2', 'run3', 'run4', 'skid', 'jump', 'fall', 'pipe'];

  states.forEach(state => {
    const canvas = scene.textures.createCanvas(`player_${state}`, 32, 48);
    const ctx = canvas.getContext();
    drawCharacter(ctx, state);
    canvas.refresh();
  });
}

function drawCharacter(ctx, state) {
  ctx.clearRect(0, 0, 32, 48);

  // Variações de offset por estado
  let headY = 4;
  let bodyY = 20;
  let legY = 32;
  let legLeftOffset = 0;
  let legRightOffset = 0;
  let armLeftY = 22;
  let armRightY = 22;
  let isSkidding = state === 'skid';
  let isPipe = state === 'pipe';

  if (state === 'idle2') {
    headY += 1;
    bodyY += 1;
  } else if (state === 'walk1') {
    legLeftOffset = -3;
    legRightOffset = 3;
    armLeftY = 20;
    armRightY = 24;
  } else if (state === 'walk2') {
    legLeftOffset = 0;
    legRightOffset = 0;
  } else if (state === 'walk3') {
    legLeftOffset = 3;
    legRightOffset = -3;
    armLeftY = 24;
    armRightY = 20;
  } else if (state === 'walk4') {
    legLeftOffset = 0;
    legRightOffset = 0;
  } else if (state.startsWith('run')) {
    const runFrame = parseInt(state.replace('run', ''));
    if (runFrame === 1 || runFrame === 3) {
      legLeftOffset = runFrame === 1 ? -6 : 6;
      legRightOffset = runFrame === 1 ? 6 : -6;
      headY += 1;
    } else {
      legLeftOffset = 0;
      legRightOffset = 0;
      headY -= 1;
    }
  } else if (state === 'jump') {
    legY -= 2;
    armLeftY -= 4;
    armRightY -= 4;
    legLeftOffset = -2;
    legRightOffset = 2;
  } else if (state === 'fall') {
    armLeftY -= 6;
    armRightY -= 6;
    legLeftOffset = -4;
    legRightOffset = 4;
  }

  // Cor da pele
  const skinColor = '#d29668';
  const skinShadow = '#b07548';
  const hairColor = '#1c1917';
  const shirtColor = '#18181b';
  const shortsColor = '#09090b';
  const shoeColor = '#f8fafc';
  const shoeDetail = '#27272a';
  const glassesColor = '#0f172a';
  const lensColor = '#bae6fd';

  // --- CABELO E CABEÇA ---
  // Cachos no topo e laterais (cabelo curto, escuro e cacheado)
  ctx.fillStyle = hairColor;
  // Volume do cabelo cacheado
  ctx.fillRect(8, headY - 3, 16, 8);
  ctx.fillRect(6, headY - 1, 4, 8);
  ctx.fillRect(22, headY - 1, 4, 8);
  // Detalhes de textura cacheada
  ctx.fillStyle = '#292524';
  ctx.fillRect(9, headY - 2, 3, 2);
  ctx.fillRect(14, headY - 3, 3, 2);
  ctx.fillRect(19, headY - 2, 3, 2);

  // Rosto
  ctx.fillStyle = skinColor;
  ctx.fillRect(9, headY + 3, 14, 12);
  // Orelhas
  ctx.fillRect(7, headY + 6, 2, 4);
  ctx.fillRect(23, headY + 6, 2, 4);

  // Sombra do queixo/pescoço
  ctx.fillStyle = skinShadow;
  ctx.fillRect(12, headY + 13, 8, 3);

  // Óculos redondos com armação escura
  ctx.fillStyle = glassesColor;
  // Armação olho esquerdo
  ctx.strokeRect(10.5, headY + 4.5, 4, 4);
  // Armação olho direito
  ctx.strokeRect(17.5, headY + 4.5, 4, 4);
  // Ponte dos óculos
  ctx.fillRect(14, headY + 6, 4, 1.5);
  // Reflexo na lente
  ctx.fillStyle = lensColor;
  ctx.fillRect(12, headY + 5, 2, 2);
  ctx.fillRect(19, headY + 5, 2, 2);

  // Nariz
  ctx.fillStyle = skinShadow;
  ctx.fillRect(15, headY + 8, 2, 2);

  // Bigode e cavanhaque
  ctx.fillStyle = hairColor;
  // Bigode
  ctx.fillRect(13, headY + 10, 6, 2);
  // Cavanhaque (abaixo do lábio até a ponta do queixo)
  ctx.fillRect(14, headY + 12, 4, 3);

  // --- TRONCO (Camiseta Preta) ---
  ctx.fillStyle = shirtColor;
  ctx.fillRect(9, bodyY, 14, 12);
  // Gola
  ctx.fillStyle = '#27272a';
  ctx.fillRect(13, bodyY, 6, 2);

  // Braços (Camiseta curta + antebraço de pele)
  if (!isPipe) {
    // Braço Esquerdo
    ctx.fillStyle = shirtColor;
    ctx.fillRect(6, armLeftY, 3, 5);
    ctx.fillStyle = skinColor;
    ctx.fillRect(6, armLeftY + 5, 3, 5);

    // Braço Direito
    ctx.fillStyle = shirtColor;
    ctx.fillRect(23, armRightY, 3, 5);
    ctx.fillStyle = skinColor;
    ctx.fillRect(23, armRightY + 5, 3, 5);
  } else {
    // Modo cano: braços rentes ao corpo
    ctx.fillStyle = shirtColor;
    ctx.fillRect(7, bodyY + 1, 2, 6);
    ctx.fillRect(23, bodyY + 1, 2, 6);
  }

  // --- PERNAS (Bermuda Preta) ---
  ctx.fillStyle = shortsColor;
  ctx.fillRect(10, legY, 12, 6);

  // Pernas / Joelhos (pele)
  ctx.fillStyle = skinColor;
  ctx.fillRect(10 + legLeftOffset, legY + 6, 4, 4);
  ctx.fillRect(18 + legRightOffset, legY + 6, 4, 4);

  // --- CALÇADOS (Tênis Brancos com detalhes escuros) ---
  // Tênis Esquerdo
  ctx.fillStyle = shoeColor;
  ctx.fillRect(9 + legLeftOffset, legY + 10, 6, 4);
  ctx.fillStyle = shoeDetail;
  ctx.fillRect(11 + legLeftOffset, legY + 11, 2, 2);
  ctx.fillRect(9 + legLeftOffset, legY + 13, 6, 1);

  // Tênis Direito
  ctx.fillStyle = shoeColor;
  ctx.fillRect(17 + legRightOffset, legY + 10, 6, 4);
  ctx.fillStyle = shoeDetail;
  ctx.fillRect(19 + legRightOffset, legY + 11, 2, 2);
  ctx.fillRect(17 + legRightOffset, legY + 13, 6, 1);

  // Efeito de poeira na derrapagem (skid)
  if (isSkidding) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(2, 42, 4, 3);
    ctx.fillRect(0, 44, 3, 2);
    ctx.fillRect(26, 43, 3, 3);
  }
}

