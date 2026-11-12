# 🎮 Portfólio Gamificado 2D — Protótipo 1.0

Protótipo funcional de um portfólio pessoal interativo no formato de jogo de plataforma 2D retrô 16-bit, construído com **Phaser 3**, **Vite** e **JavaScript Modular**.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).

### Passo a Passo

1. Abra o terminal na pasta do projeto:
   ```bash
   cd portifolio-gamificado
   ```

2. Caso ainda não tenha instalado as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. O terminal exibirá o link local (geralmente `http://localhost:5173`). Abra esse link no seu navegador.

5. Para gerar uma versão otimizada de produção:
   ```bash
   npm run build
   ```

---

## 🕹️ Controles

### No Computador (Teclado)
| Ação | Teclas |
|---|---|
| **Mover para a Esquerda** | `A` ou `Seta Esquerda (←)` |
| **Mover para a Direita** | `D` ou `Seta Direita (→)` |
| **Pular** | `Espaço` ou `Seta para Cima (↑)` ou `W` |
| **Correr** | `Shift` (segure enquanto anda) |
| **Entrar no Cano** | `S` ou `Seta para Baixo (↓)` (quando estiver sobre o cano) |

### No Celular / Tablet (Touch)
- **Botões Esquerda / Direita**: Movimentação horizontal.
- **Botão ▼**: Entrar no cano quando estiver posicionado no topo.
- **Botão RUN**: Ativa a velocidade de corrida.
- **Botão PULO**: Executa o salto (com pulo variável conforme o toque).

---

## 📁 Estrutura de Arquivos Criados

```
portifolio-gamificado/
├── index.html                  # Estrutura HTML, containers do jogo, modal e botões touch
├── style.css                   # Estilização visual (retro 16-bit + modal responsivo)
├── package.json                # Dependências (Phaser 3, Vite)
├── IMG_01.jpg                  # Foto de referência do perfil
├── IMG_02.jpg                  # Foto de referência secundária
└── src/
    ├── main.js                 # Inicialização do Phaser, escala responsiva e configuração
    ├── assets/
    │   └── assetGenerator.js   # Gerador nativo em Canvas de pixel art 16-bit autônomo
    ├── entities/
    │   ├── Player.js           # Física clássica (coyote time, jump buffer, corrida, inércia)
    │   └── Pipe.js             # Lógica e animações de descida e subida do cano verde
    ├── scenes/
    │   └── MainScene.js        # Montagem do mapa, câmera suave e ciclo principal
    └── ui/
        ├── AboutModal.js       # Interface da janela "Sobre Mim" e retorno ao mapa
        └── VirtualControls.js  # Controles touch para dispositivos móveis
```

---

## 🎨 Como Substituir os Sprites Provisórios pelos Definitivos

O protótipo utiliza um gerador procedural em Canvas (`src/assets/assetGenerator.js`) para desenhar os gráficos em pixel art nítido sem depender de imagens de terceiros.

Quando você tiver suas imagens ou spritesheets definitivas (feitas no Aseprite, Photoshop, etc.), siga estes passos:

### 1. Substituir os Sprites do Personagem
- Salve sua spritesheet (ex: `hero.png`) na pasta `public/` ou `src/assets/images/`.
- No arquivo `src/scenes/MainScene.js`, no método `preload()`:
  ```javascript
  this.load.spritesheet('player', 'assets/hero.png', {
    frameWidth: 32,
    frameHeight: 48
  });
  ```
- No arquivo `src/entities/Player.js`, no método `initAnimations()`, aponte os números dos frames da sua nova spritesheet:
  ```javascript
  scene.anims.create({
    key: 'player_walk',
    frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });
  ```

### 2. Substituir o Cano e o Cenário
- Basta carregar as imagens na cena:
  ```javascript
  this.load.image('pipe_green', 'assets/meu_cano.png');
  this.load.image('tile_grass', 'assets/meu_chao.png');
  ```
- O Phaser automaticamente usará a nova textura substituindo o gerador procedural.

---

## ⚙️ Destaques da Física Implementada
- **Pulo Variável:** Se soltar o botão no ar, o pulo é interrompido suavemente.
- **Coyote Time:** Permite pular mesmo até 120ms após sair de uma borda.
- **Jump Buffer:** Registra comandos de pulo 140ms antes de tocar o chão para saltar imediatamente ao aterrissar.
- **Gravidade Acentuada na Queda:** Sensação ágil e precisa similar aos melhores jogos de plataforma dos anos 90.
- **Transição Não Destrutiva:** O cano preserva a cena e a posição exata do jogador ao voltar do modal "Sobre Mim".

