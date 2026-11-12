/**
 * Centralização dos dados e conteúdos das seções do Portfólio
 * Facilmente editável sem alterar a lógica do jogo
 */

// Base URL do Vite para garantir compatibilidade com GitHub Pages e subpastas
const BASE_URL = import.meta.env.BASE_URL || './';
const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

/**
 * Dados das Missões do Diário (Projetos Desenvolvidos)
 * Facilmente editável para adicionar novos projetos ou configurar URLs de repositório
 */
export const MISSIONS_DATA = [
  {
    id: 'mission-01',
    missionNumber: 'MISSÃO 01',
    status: 'Concluída',
    title: 'Gerenciamento de Artigos',
    category: 'Desenvolvimento Web — Projeto Acadêmico',
    description: 'Sistema web para gerenciar artigos, permitindo cadastrar, visualizar e editar informações por meio de uma interface integrada a um banco de dados.',
    objective: 'Criar uma aplicação funcional que conectasse o front-end ao back-end e permitisse realizar operações sobre os dados armazenados.',
    equipments: ['HTML', 'PHP', 'MySQL', 'Bootstrap'],
    // URL do repositório no GitHub
    repoUrl: 'https://github.com/A-marcos-lira/site-artigo',
    liveUrl: null, // Sem opção "Visualizar Projeto" especificamente para esta missão
    centerRepoBtn: true
  },
  {
    id: 'mission-02',
    missionNumber: 'MISSÃO 02',
    status: 'Concluída',
    title: 'Site para Igreja — ADSM Shekinah',
    category: 'Desenvolvimento Web',
    description: 'Site desenvolvido com auxílio de Inteligência Artificial para apresentar a igreja ADSM Shekinah, seus cultos e horários, a Escola Bíblica Dominical (EBD) e sua agenda. Também oferece um espaço para que os visitantes enviem mensagens, como pedidos de oração, testemunhos, solicitações de aconselhamento, orientações bíblicas ou outros assuntos que desejem compartilhar com a igreja.',
    objective: 'Criar um ambiente digital acessível e organizado, onde as pessoas possam conhecer a igreja, acompanhar suas atividades e entrar em contato por meio do envio de mensagens.',
    equipments: ['HTML', 'CSS', 'PHP', 'MySQL', 'Bootstrap'],
    // URL do site configurada
    liveUrl: 'https://adsmshekinah.com.br/',
    repoUrl: null, // Sem opção "Ver Repositório" especificamente para esta missão
    centerLiveBtn: true
  },
  {
    id: 'mission-03',
    missionNumber: 'MISSÃO 03',
    status: 'Concluída',
    title: 'Portfólio de Designer',
    category: 'Desenvolvimento Web com IA',
    description: 'Portfólio web desenvolvido com o auxílio do Google Antigravity, uma ferramenta de desenvolvimento baseada em agentes de Inteligência Artificial. Por meio de prompts e solicitações de ajustes, conduzi a criação de um site para apresentar os trabalhos, serviços e informações de contato de um amigo designer.',
    objective: 'Criar um portfólio digital moderno e responsivo para divulgar os trabalhos do designer, apresentar seus serviços e facilitar o contato com potenciais clientes.',
    equipments: ['Google Antigravity'],
    // URL do projeto configurada
    liveUrl: 'https://bielzinhodesign.github.io/bielzinho-designer-portifolio/',
    repoUrl: null, // Sem opção "Ver Repositório" especificamente para esta missão
    centerLiveBtn: true
  }
];

/**
 * Gera a classe CSS correspondente a cada tecnologia para estilização temática individual
 */
function getTechClass(tech) {
  const slug = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `tag-${slug}`;
}

function renderMissionCard(mission) {
  // Botão Ver Repositório com ícone do GitHub (apenas quando mission.repoUrl !== null)
  let repoButtonHtml = '';
  if (mission.repoUrl !== null && mission.repoUrl !== undefined) {
    const isRepoConfigured = Boolean(mission.repoUrl && mission.repoUrl.trim() !== '' && mission.repoUrl !== '#');
    repoButtonHtml = isRepoConfigured
      ? `<a href="${mission.repoUrl}" target="_blank" rel="noopener noreferrer" class="proj-btn repo-btn" aria-label="Ver Repositório no GitHub">
           <svg class="github-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
           </svg>
           <span>Ver Repositório</span>
         </a>`
      : `<button class="proj-btn repo-btn disabled" disabled aria-disabled="true" title="Link do repositório a ser configurado">
           <svg class="github-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
           </svg>
           <span>Ver Repositório (Em breve)</span>
         </button>`;
  }

  // Botão Visualizar Projeto com ícone de link externo (apenas quando mission.liveUrl !== null)
  let liveButtonHtml = '';
  if (mission.liveUrl !== null && mission.liveUrl !== undefined) {
    const isLiveConfigured = Boolean(mission.liveUrl && mission.liveUrl.trim() !== '' && mission.liveUrl !== '#');
    const externalLinkIcon = `
      <svg class="external-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    `;

    liveButtonHtml = isLiveConfigured
      ? `<a href="${mission.liveUrl}" target="_blank" rel="noopener noreferrer" class="proj-btn primary" aria-label="Visualizar Projeto ${mission.title}">
           <span>Visualizar Projeto</span>
           ${externalLinkIcon}
         </a>`
      : `<button class="proj-btn primary disabled" disabled aria-disabled="true" title="Aguardando link do site">
           <span>Visualizar Projeto</span>
           ${externalLinkIcon}
         </button>`;
  }

  const isSingleButton = (Boolean(liveButtonHtml) !== Boolean(repoButtonHtml));
  const actionsClass = (isSingleButton || mission.centerRepoBtn || mission.centerLiveBtn)
    ? 'mission-actions center'
    : 'mission-actions';

  return `
    <article class="mission-card">
      <div class="mission-header-bar">
        <span class="mission-badge">${mission.missionNumber}</span>
        <span class="mission-status-pill ${mission.status === 'Concluída' ? 'completed' : 'ongoing'}">
          <span class="status-dot"></span> ${mission.status}
        </span>
      </div>

      <div class="mission-title-area">
        <h4 class="mission-title">${mission.title}</h4>
        <span class="mission-category">${mission.category}</span>
      </div>

      <div class="mission-body-section">
        <div class="mission-field">
          <strong class="field-label">Descrição da missão:</strong>
          <p class="field-desc">${mission.description}</p>
        </div>

        <div class="mission-field">
          <strong class="field-label">Objetivo da missão:</strong>
          <p class="field-desc">${mission.objective}</p>
        </div>

        <div class="mission-field">
          <strong class="field-label">Equipamentos utilizados:</strong>
          <div class="equipments-tags">
            ${mission.equipments.map(eq => `<span class="equipment-tag ${getTechClass(eq)}">${eq}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="${actionsClass}">
        ${liveButtonHtml}
        ${repoButtonHtml}
      </div>
    </article>
  `;
}

export const CONTACT_DATA = {
  email: 'antoniomarlb15@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marcos-liira',
  github: 'https://github.com/A-marcos-lira',
  whatsapp: '5598984187549' // DDI 55 (Brasil) + DDD 98 + Número 984187549
};

function renderContactCard({ type, title, subtitle, iconSvg, href, colorClass, rawValue }) {
  const isConfigured = Boolean(href && href.trim() !== '' && href !== '#' && href !== 'mailto:' && href !== 'https://wa.me/');
  
  if (isConfigured) {
    const isExternal = !href.startsWith('mailto:');
    const copyButtonHtml = (type === 'email' && rawValue)
      ? `
        <button type="button" class="copy-email-btn" data-email="${rawValue}" title="Copiar e-mail" aria-label="Copiar endereço de e-mail">
          <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="copy-tooltip">E-mail copiado!</span>
        </button>
      `
      : '';

    return `
      <a href="${href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="contact-card ${colorClass}" aria-label="${title} — ${subtitle}">
        <div class="contact-icon-wrapper ${colorClass}">
          ${iconSvg}
        </div>
        <div class="contact-details">
          <span class="contact-type">${title}</span>
          <span class="contact-subtitle">${subtitle}</span>
        </div>
        <div class="contact-actions-right">
          ${copyButtonHtml}
          <span class="contact-action-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </a>
    `;
  }

  return `
    <div class="contact-card ${colorClass} disabled" title="Link a ser configurado">
      <div class="contact-icon-wrapper ${colorClass}">
        ${iconSvg}
      </div>
      <div class="contact-details">
        <span class="contact-type">${title}</span>
        <span class="contact-subtitle">${subtitle}</span>
      </div>
      <span class="contact-status-tag">Aguardando link</span>
    </div>
  `;
}

export const SECTIONS_DATA = {
  about: {
    id: 'about',
    title: 'PLAYER PROFILE — PERFIL DO JOGADOR',
    badge: 'PROTAGONISTA',
    renderContent: () => `
      <div class="rpg-profile-container">
        <!-- 1. Perfil do Jogador (Foto + Atributos) -->
        <div class="rpg-profile-header">
          <div class="rpg-avatar-wrapper">
            <div class="avatar-frame">
              <img src="${cleanBase}foto-perfil.jpg" alt="Foto de Antonio Marcos" id="profile-pic" class="profile-pic" />
            </div>
            <div class="pixel-badge">PROTAGONISTA</div>
          </div>

          <div class="rpg-stats-sheet">
            <div class="rpg-stat-row">
              <span class="rpg-stat-label">Nome:</span>
              <strong class="rpg-stat-value">Antonio Marcos</strong>
            </div>
            <div class="rpg-stat-row">
              <span class="rpg-stat-label">Classe:</span>
              <strong class="rpg-stat-value">Desenvolvedor em formação</strong>
            </div>
            <div class="rpg-stat-row">
              <span class="rpg-stat-label">Formação:</span>
              <strong class="rpg-stat-value">Ciência da Computação</strong>
            </div>
            <div class="rpg-stat-row">
              <span class="rpg-stat-label">Status:</span>
              <span class="rpg-status-badge">
                <span class="status-pulse-dot"></span> Em evolução
              </span>
            </div>
          </div>
        </div>

        <!-- 2. Origem da Jornada -->
        <article class="rpg-quest-card quest-origin">
          <div class="rpg-card-header">
            <div class="rpg-card-icon icon-compass">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"></polygon>
              </svg>
            </div>
            <h4 class="rpg-card-title">ORIGEM DA JORNADA</h4>
          </div>
          <p class="rpg-card-text">
            Meu interesse pela programação começou ainda no ensino médio, quando descobri a área de Ciência da Computação. Desde então, venho aprimorando meus conhecimentos e desenvolvendo projetos que me permitem colocar em prática o que aprendo.
          </p>
        </article>

        <!-- 3. Missões Concluídas -->
        <article class="rpg-quest-card quest-completed">
          <div class="rpg-card-header">
            <div class="rpg-card-icon icon-trophy">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <h4 class="rpg-card-title">MISSÕES CONCLUÍDAS</h4>
          </div>
          <p class="rpg-card-text">
            Minha jornada já passou por diferentes desafios: desenvolver sites, criar aplicações web e construir sistemas com integração a banco de dados.
          </p>
          <p class="rpg-card-text secondary-text">
            Durante a minha trajetória, aprendi que programar vai além de escrever código. É investigar problemas, testar possibilidades, corrigir erros e encontrar soluções que funcionem.
          </p>
        </article>

        <!-- 4. Missão Atual -->
        <article class="rpg-quest-card quest-current">
          <div class="rpg-card-header">
            <div class="rpg-card-icon icon-target">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h4 class="rpg-card-title">MISSÃO ATUAL</h4>
          </div>
          <p class="rpg-card-text">
            Meu próximo objetivo é conquistar uma oportunidade de estágio em desenvolvimento de software.
          </p>
          <p class="rpg-card-text secondary-text">
            Quero aprender com profissionais experientes, enfrentar novos desafios e continuar evoluindo, transformando conhecimento em soluções reais.
          </p>
        </article>

        <!-- 5. Mensagem Final -->
        <div class="rpg-final-message">
          <div class="rpg-gamepad-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="6" y1="12" x2="10" y2="12"></line>
              <line x1="8" y1="10" x2="8" y2="14"></line>
              <line x1="15" y1="13" x2="15.01" y2="13"></line>
              <line x1="18" y1="11" x2="18.01" y2="11"></line>
              <rect x="2" y="6" width="20" height="12" rx="4"></rect>
            </svg>
          </div>
          <span class="rpg-quote">"A jornada está só começando..."</span>
        </div>
      </div>
    `
  },

  projects: {
    id: 'projects',
    title: 'DESENVOLVIDO POR MIM',
    badge: 'DIÁRIO DE MISSÕES',
    renderContent: () => `
      <div class="section-full-content">
        <div class="missions-diary-header">
          <div class="diary-subtitle-wrapper">
            <span class="diary-bullet">▶</span>
            <h3 class="diary-subtitle">DIÁRIO DE MISSÕES</h3>
          </div>
          <p class="diary-desc">Projetos e desafios da minha jornada como desenvolvedor.</p>
        </div>
        <div class="missions-container">
          ${MISSIONS_DATA.map(renderMissionCard).join('')}
        </div>
      </div>
    `
  },

  skills: {
    id: 'skills',
    title: 'HABILIDADES',
    badge: 'ÁRVORE DE HABILIDADES',
    renderContent: () => `
      <div class="skills-tree-section">
        <!-- 1. Cabeçalho da Seção -->
        <div class="skills-tree-header">
          <div class="skills-subtitle-wrapper">
            <span class="skills-bullet">▶</span>
            <h3 class="skills-subtitle">ÁRVORE DE HABILIDADES</h3>
          </div>
          <p class="skills-desc">Competências desenvolvidas ao longo da minha jornada.</p>
        </div>

        <!-- 2. Abas de Navegação -->
        <div class="skill-tabs-nav" role="tablist" aria-label="Categorias de Habilidades">
          <button class="skill-tab-btn active" data-tab="dev" role="tab" aria-selected="true" aria-controls="tree-panel-dev">
            <span class="tab-indicator">◆</span>
            <span>Desenvolvimento</span>
          </button>
          <button class="skill-tab-btn" data-tab="tools" role="tab" aria-selected="false" aria-controls="tree-panel-tools">
            <span class="tab-indicator">◆</span>
            <span>Ferramentas e IA</span>
          </button>
          <button class="skill-tab-btn" data-tab="soft" role="tab" aria-selected="false" aria-controls="tree-panel-soft">
            <span class="tab-indicator">◆</span>
            <span>Habilidades Pessoais</span>
          </button>
        </div>

        <!-- 3. Árvore 1: Desenvolvimento -->
        <div class="skill-tree-panel active" id="tree-panel-dev" role="tabpanel">
          <!-- Legenda explicativa das cores -->
          <div class="tree-legend">
            <div class="legend-item">
              <span class="legend-dot gold"></span>
              <span class="legend-text">Em aprendizado</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot purple"></span>
              <span class="legend-text">Experiência anterior</span>
            </div>
          </div>

          <!-- Estrutura da Árvore de Desenvolvimento -->
          <div class="tree-structure">
            <!-- Nó Raiz -->
            <div class="tree-root-container">
              <div class="tree-node root-node root-dev">DESENVOLVIMENTO</div>
              <div class="tree-trunk-line"></div>
              <div class="tree-bus-bar dev-bar"></div>
            </div>

            <!-- Ramos da Árvore -->
            <div class="tree-branches-row dev-grid">
              <!-- Ramo Web & Front-End -->
              <div class="tree-branch-col">
                <div class="branch-connector-top"></div>
                <div class="branch-header">WEB & FRONT-END</div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-gold"><span class="node-name">HTML</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">CSS</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">JavaScript</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">Bootstrap</span></div>
                </div>
              </div>

              <!-- Ramo Linguagens & Lógica -->
              <div class="tree-branch-col">
                <div class="branch-connector-top"></div>
                <div class="branch-header">LINGUAGENS & LÓGICA</div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-gold"><span class="node-name">Python</span></div>
                  <div class="tree-chain-line purple"></div>
                  <div class="tree-node status-purple"><span class="node-name">PHP</span></div>
                  <div class="tree-chain-line purple"></div>
                  <div class="tree-node status-purple"><span class="node-name">C++</span></div>
                </div>
              </div>

              <!-- Ramo Banco de Dados -->
              <div class="tree-branch-col">
                <div class="branch-connector-top"></div>
                <div class="branch-header">BANCO DE DADOS</div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-gold" title="Linguagem de consulta estruturada"><span class="node-name">SQL</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold" title="Sistema de gerenciamento de banco de dados"><span class="node-name">MySQL</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Árvore 2: Ferramentas e IA -->
        <div class="skill-tree-panel" id="tree-panel-tools" role="tabpanel">
          <div class="tree-structure">
            <!-- Nó Central -->
            <div class="tree-root-container">
              <div class="tree-node root-node root-tools">FERRAMENTAS E IA</div>
              <div class="tree-trunk-line ai-line"></div>
              <div class="tree-bus-bar ai-bar"></div>
            </div>

            <!-- Conexões e Nós de Ferramentas e IA (2 Colunas) -->
            <div class="tree-branches-row tools-grid">
              <!-- Coluna 1 -->
              <div class="tree-branch-col tools-col">
                <div class="branch-connector-top ai"></div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-ai"><span class="node-name">Google Gemini</span></div>
                  <div class="tree-chain-line ai"></div>
                  <div class="tree-node status-ai"><span class="node-name">Google Antigravity</span></div>
                </div>
              </div>

              <!-- Coluna 2 -->
              <div class="tree-branch-col tools-col">
                <div class="branch-connector-top ai"></div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-ai"><span class="node-name">ChatGPT</span></div>
                  <div class="tree-chain-line ai"></div>
                  <div class="tree-node status-ai"><span class="node-name">Claude</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Árvore 3: Habilidades Pessoais -->
        <div class="skill-tree-panel" id="tree-panel-soft" role="tabpanel">
          <div class="tree-structure">
            <!-- Nó Central -->
            <div class="tree-root-container">
              <div class="tree-node root-node root-soft">HABILIDADES PESSOAIS</div>
              <div class="tree-trunk-line gold-line"></div>
              <div class="tree-bus-bar gold-bar"></div>
            </div>

            <!-- Conexões e Nós de Habilidades Pessoais (2 Colunas) -->
            <div class="tree-branches-row soft-grid">
              <!-- Coluna 1 -->
              <div class="tree-branch-col soft-col">
                <div class="branch-connector-top gold"></div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-gold"><span class="node-name">Curiosidade</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">Persistência</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">Organização</span></div>
                </div>
              </div>

              <!-- Coluna 2 -->
              <div class="tree-branch-col soft-col">
                <div class="branch-connector-top gold"></div>
                <div class="tree-nodes-chain">
                  <div class="tree-node status-gold"><span class="node-name">Comunicação</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">Trabalho em equipe</span></div>
                  <div class="tree-chain-line gold"></div>
                  <div class="tree-node status-gold"><span class="node-name">Resolução de problemas</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Mensagem Final: Personagem em Evolução -->
        <div class="skills-footer-highlight">
          <div class="highlight-badge-wrapper">
            <span class="status-pulse-dot"></span>
            <strong class="highlight-title">PERSONAGEM EM EVOLUÇÃO</strong>
          </div>
          <p class="highlight-desc">"Novas habilidades são desenvolvidas a cada projeto, desafio e aprendizado."</p>
        </div>
      </div>
    `
  },

  contact: {
    id: 'contact',
    title: 'CENTRAL DE COMUNICAÇÃO',
    badge: 'ESTABELECER CONTATO',
    renderContent: () => {
      const waPrefill = encodeURIComponent('Olá, Marcos! Conheci seu portfólio gamificado e gostaria de conversar com você.');
      const cleanWaNum = (CONTACT_DATA.whatsapp || '').replace(/[^0-9]/g, '');
      const waLink = cleanWaNum ? `https://wa.me/${cleanWaNum}?text=${waPrefill}` : '';
      const emailLink = CONTACT_DATA.email ? `mailto:${CONTACT_DATA.email}` : '';
      const linkedinLink = CONTACT_DATA.linkedin || '';
      const githubLink = CONTACT_DATA.github || '';

      const emailIconSvg = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      `;

      const linkedinIconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      `;

      const githubIconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      `;

      const whatsappIconSvg = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 0C5.398 0 .017 5.381.017 12.014c0 2.119.553 4.186 1.604 6.009L0 24l6.167-1.619a11.968 11.968 0 0 0 5.864 1.523h.005c6.633 0 12.014-5.381 12.014-12.014 0-3.208-1.25-6.224-3.518-8.494C18.264 1.226 15.243 0 12.031 0zm-.005 21.996h-.004a9.98 9.98 0 0 1-5.088-1.393l-.365-.216-3.774.99 1.007-3.678-.238-.378a9.96 9.96 0 0 1-1.528-5.307c0-5.526 4.496-10.022 10.027-10.022 2.677 0 5.194 1.043 7.086 2.936a9.97 9.97 0 0 1 2.936 7.088c0 5.528-4.496 10.024-10.067 10.024zm5.492-7.498c-.301-.151-1.782-.88-2.058-.98-.276-.1-.477-.151-.678.151-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.076-.301-.151-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.679-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.528-.075-.151-.678-1.633-.929-2.236-.245-.588-.494-.508-.678-.518-.176-.008-.377-.01-.578-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.151.201 2.124 3.243 5.145 4.548.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.578-.086 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z"/>
        </svg>
      `;

      return `
        <div class="contact-section-container">
          <!-- 1. Cabeçalho RPG da Central de Comunicação -->
          <div class="contact-station-header">
            <div class="station-meta-row">
              <span class="station-badge">CENTRAL DE COMUNICAÇÃO</span>
              <span class="station-status-pill online">
                <span class="status-pulse-dot"></span> ONLINE
              </span>
            </div>
            <h3 class="station-title">MISSÃO: ESTABELECER CONTATO</h3>
            <p class="station-desc">
              "Tem uma oportunidade, projeto ou ideia? Entre em contato e vamos conversar!"
            </p>
          </div>

          <!-- 2. Meios de Contato (Cards em 2 Colunas) -->
          <div class="contacts-grid-rpg">
            ${renderContactCard({
              type: 'email',
              title: 'E-mail',
              subtitle: 'Mensagem direta',
              iconSvg: emailIconSvg,
              href: emailLink,
              colorClass: 'color-blue',
              rawValue: CONTACT_DATA.email
            })}

            ${renderContactCard({
              type: 'linkedin',
              title: 'LinkedIn',
              subtitle: 'Perfil profissional',
              iconSvg: linkedinIconSvg,
              href: linkedinLink,
              colorClass: 'color-blue'
            })}

            ${renderContactCard({
              type: 'github',
              title: 'GitHub',
              subtitle: 'Meus repositórios',
              iconSvg: githubIconSvg,
              href: githubLink,
              colorClass: 'color-purple'
            })}

            ${renderContactCard({
              type: 'whatsapp',
              title: 'WhatsApp',
              subtitle: 'Conversar comigo',
              iconSvg: whatsappIconSvg,
              href: waLink,
              colorClass: 'color-green'
            })}
          </div>

          <!-- 3. Mensagem de Encerramento -->
          <div class="contact-final-unlock">
            <div class="unlock-trophy-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <strong class="unlock-title">MISSÃO FINAL DESBLOQUEADA!</strong>
          </div>
        </div>
      `;
    }
  }
};

