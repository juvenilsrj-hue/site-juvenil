const STORAGE_KEY = "jr_diagnostic_leads_v2";
const DRAFT_KEY = "jr_diagnostic_draft_v2";
const ADMIN_SESSION_KEY = "jr_admin_authenticated_v1";
const ADMIN_EMAIL = "juvenilsrj@gmail.com";
const ADMIN_PASSWORD_HASH = "ece061a5bfe20a935705ec1d4dc8e38d204533708a4c54caef269fc79ebad130";

// === Supabase: armazenamento dos leads na nuvem ===
const SUPABASE_URL = "https://mkhzsynndqnljczkggia.supabase.co";
const SUPABASE_KEY = "sb_publishable_d_Vjkmbj3g6JHO64W3iVOQ_vUq_Xqn0";
const supabaseClient =
  window.supabase && SUPABASE_URL
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
let adminAuthed = false;
let remoteLeads = [];

const scaleLabels = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];
const diagnosticDisclaimer =
  "Este diagnóstico apresenta uma fotografia inicial do momento atual. Ele não define uma pessoa ou uma empresa de forma isolada. O resultado foi construído a partir de critérios estruturados e precisa ser interpretado em conjunto com o contexto, os desafios e os objetivos de evolução.";

const methodologyTexts = {
  leadership:
    "O resultado foi construído a partir de critérios estruturados para identificar tendências de comportamento, pontos fortes e oportunidades de desenvolvimento. Ele oferece uma base inicial para reflexão e aprofundamento, sem substituir uma análise contextual da rotina, do momento profissional e dos desafios reais.",
  business:
    "O resultado consolida dimensões essenciais da operação para apresentar uma leitura inicial da maturidade empresarial. A análise considera padrões de gestão, liderança, cultura, atendimento, desenvolvimento e desempenho comercial. A interpretação completa depende do contexto e das prioridades da empresa."
};

const finalReflectionTexts = {
  leadership:
    "Existe uma diferença importante entre reconhecer um padrão e compreender como ele impacta os seus resultados. Qual aspecto deste diagnóstico merece uma análise mais profunda?",
  business:
    "Empresas não atingem um novo patamar apenas identificando gargalos. O avanço acontece quando as prioridades corretas são transformadas em método e execução. Qual dimensão pode estar impedindo o próximo salto da sua empresa?"
};

const consultantContact = {
  name: "Juvenill Ribêiro",
  email: "juvenilsrj@gmail.com",
  phone: "(49) 99964-7004",
  site: "juvenillribeiro.com.br"
};

const diagnostics = {
  leadership: {
    label: "Liderança e Perfil Profissional",
    dimensions: {
      execucao: "Execução",
      comunicacao: "Comunicação",
      conflitos: "Gestão de conflitos",
      influencia: "Influência",
      adaptabilidade: "Adaptabilidade",
      emocional: "Inteligência emocional"
    },
    questions: [
      ["execucao", "Eu transformo objetivos em prioridades claras para mim e para a equipe."],
      ["execucao", "Tenho disciplina para acompanhar prazos, entregas e responsabilidades."],
      ["execucao", "Costumo agir rapidamente quando uma decisão precisa ser tomada."],
      ["execucao", "Mantenho foco mesmo quando existem muitas demandas simultâneas."],
      ["comunicacao", "Comunico expectativas de forma objetiva e compreensível."],
      ["comunicacao", "Adapto minha comunicação conforme o perfil da pessoa ou equipe."],
      ["comunicacao", "Dou feedbacks de forma frequente, respeitosa e prática."],
      ["comunicacao", "Escuto antes de concluir ou direcionar uma conversa importante."],
      ["conflitos", "Consigo mediar conflitos sem evitar conversas difíceis."],
      ["conflitos", "Busco fatos e impactos antes de reagir emocionalmente a problemas."],
      ["conflitos", "Trato desalinhamentos de comportamento com clareza e rapidez."],
      ["conflitos", "Procuro construir acordos sustentáveis após situações de tensão."],
      ["influencia", "Consigo engajar pessoas em torno de metas e mudanças."],
      ["influencia", "Minha postura inspira confiança em pares, liderados e superiores."],
      ["influencia", "Reconheço conquistas e uso isso para fortalecer o desempenho."],
      ["influencia", "Tenho facilidade para mobilizar pessoas sem depender apenas do cargo."],
      ["adaptabilidade", "Ajusto planos quando o cenário muda sem perder a direção."],
      ["adaptabilidade", "Aprendo com erros e transformo aprendizados em novas práticas."],
      ["adaptabilidade", "Lido bem com mudanças de prioridade, mercado ou estratégia."],
      ["adaptabilidade", "Consigo trabalhar com perfis diferentes sem reduzir a qualidade da relação."],
      ["emocional", "Reconheço meus gatilhos emocionais em momentos de pressão."],
      ["emocional", "Mantenho equilíbrio ao lidar com cobranças, metas e conflitos."],
      ["emocional", "Tenho consciência do impacto do meu comportamento sobre outras pessoas."],
      ["emocional", "Consigo pedir ajuda ou rever uma posição quando necessário."]
    ],
    classify(scores) {
      const top = topDimension(scores);
      const map = {
        execucao: "Executor",
        comunicacao: "Desenvolvedor",
        conflitos: "Construtor de Equipes",
        influencia: "Influenciador",
        adaptabilidade: "Estrategista",
        emocional: "Desenvolvedor"
      };
      return map[top.key] || "Executor";
    }
  },
  business: {
    label: "Maturidade Empresarial",
    dimensions: {
      lideranca: "Liderança",
      comercial: "Comercial",
      atendimento: "Atendimento e experiência",
      gestao: "Gestão",
      desenvolvimento: "Desenvolvimento",
      cultura: "Cultura"
    },
    questions: [
      ["lideranca", "A empresa possui direção estratégica clara e comunicada ao time."],
      ["lideranca", "As lideranças tomam decisões com consistência e alinhamento."],
      ["lideranca", "Existe clareza sobre responsabilidades, prioridades e metas."],
      ["lideranca", "A rotina da liderança fortalece execução, acompanhamento e correção de rota."],
      ["comercial", "O processo de vendas está documentado e é seguido pela equipe."],
      ["comercial", "A prospecção é feita de forma consistente, planejada e mensurável."],
      ["comercial", "A empresa acompanha conversão por etapa do funil comercial."],
      ["comercial", "O CRM é usado como ferramenta de gestão, não apenas como cadastro."],
      ["atendimento", "A experiência do cliente é acompanhada antes, durante e depois da venda."],
      ["atendimento", "A empresa mede satisfação, reclamações, retenção ou NPS."],
      ["atendimento", "Existem padrões claros de atendimento e relacionamento com clientes."],
      ["atendimento", "O pós-venda gera recompra, indicação e oportunidades comerciais."],
      ["gestao", "Os principais indicadores são acompanhados em uma rotina definida."],
      ["gestao", "Reuniões de gestão geram decisões, responsáveis e prazos."],
      ["gestao", "O planejamento é revisado periodicamente com base em dados."],
      ["gestao", "A empresa identifica gargalos operacionais antes que eles virem crises."],
      ["desenvolvimento", "Existe treinamento contínuo para vendas, atendimento, liderança ou operação."],
      ["desenvolvimento", "A empresa forma novas lideranças de maneira intencional."],
      ["desenvolvimento", "Há planos de crescimento para pessoas-chave ou áreas críticas."],
      ["desenvolvimento", "As competências necessárias para crescer estão claras para a equipe."],
      ["cultura", "A cultura desejada aparece em atitudes, rituais e decisões do dia a dia."],
      ["cultura", "A empresa reconhece comportamentos alinhados aos seus valores."],
      ["cultura", "Problemas de comportamento são tratados com objetividade."],
      ["cultura", "As equipes colaboram entre áreas para melhorar resultados."]
    ],
    classify(scores, overall) {
      if (overall < 40) return "Nível 1 - Operação Reativa";
      if (overall < 56) return "Nível 2 - Operação Estruturada";
      if (overall < 72) return "Nível 3 - Gestão Orientada por Indicadores";
      if (overall < 86) return "Nível 4 - Alta Performance";
      return "Nível 5 - Excelência Operacional";
    }
  }
};

const scoreBands = [
  { min: 0, max: 39, label: "Fase prioritária de desenvolvimento", meaning: "há oportunidades importantes de evolução; pede priorização, método e acompanhamento próximo." },
  { min: 40, max: 55, label: "Fase de estruturação", meaning: "existem iniciativas, mas ainda há dependência de esforço individual e pouca previsibilidade." },
  { min: 56, max: 71, label: "Fase de consolidação", meaning: "boas práticas aparecem, mas precisam virar rotina, indicador e padrão repetível." },
  { min: 72, max: 85, label: "Alta performance", meaning: "o comportamento ou processo já é consistente e pode ser usado como base para o próximo salto." },
  { min: 86, max: 100, label: "Excelência operacional", meaning: "maturidade elevada; o desafio passa a ser escala, sucessão e melhoria contínua." }
];

const discFactors = {
  D: {
    label: "Dominância",
    dimensions: ["execucao", "conflitos"],
    style: "direto, firme, orientado a resultado e decisão.",
    strength: "acelera movimento, enfrenta problemas e cobra entrega.",
    risk: "pode parecer impaciente, duro ou excessivamente focado em tarefa sob pressão.",
    development: "equilibrar velocidade com escuta, contexto e alinhamento emocional."
  },
  I: {
    label: "Influência",
    dimensions: ["influencia", "comunicacao"],
    style: "comunicativo, mobilizador, relacional e persuasivo.",
    strength: "engaja pessoas, vende ideias e cria energia no ambiente.",
    risk: "pode perder profundidade ou acompanhamento se depender apenas de entusiasmo.",
    development: "transformar carisma em combinados, indicadores e rituais de continuidade."
  },
  S: {
    label: "Estabilidade",
    dimensions: ["emocional", "comunicacao"],
    style: "acolhedor, constante, cuidadoso e colaborativo.",
    strength: "cria segurança, escuta, sustenta relações e reduz tensões.",
    risk: "pode evitar conversas difíceis ou demorar para tomar decisões impopulares.",
    development: "aumentar assertividade, velocidade de decisão e clareza de limites."
  },
  C: {
    label: "Conformidade",
    dimensions: ["adaptabilidade", "execucao"],
    style: "analítico, criterioso, organizado e orientado a qualidade.",
    strength: "estrutura, reduz erros, analisa cenários e cria método.",
    risk: "pode travar por excesso de análise, perfeccionismo ou baixa tolerância a improviso.",
    development: "separar o que exige precisão do que exige movimento."
  }
};

const profileLibrary = {
  Executor: {
    summary: "Perfil de alta orientação à entrega. Busca velocidade, decisão e clareza sobre o que precisa ser feito.",
    strengths: ["foco consistente em resultado", "energia para resolver problemas", "boa resposta sob pressão", "capacidade de cobrar execução"],
    risks: ["acelerar antes de alinhar expectativas", "dar pouco espaço para escuta", "centralizar decisões", "gerar tensão quando a equipe precisa de desenvolvimento"],
    recommendations: ["criar checkpoints de escuta antes de decisões críticas", "delegar com critério de sucesso definido", "acompanhar clima e engajamento além das metas"],
    learning: "aprende melhor por experiência, desafio real, tentativa controlada e aplicação prática.",
    task: "executa com urgência, foco e disposição para assumir responsabilidade por resultados.",
    relationships: "relaciona-se de forma direta; tende a valorizar objetividade, autonomia e pessoas eficientes.",
    environment: "ambientes dinâmicos, com metas claras, autonomia e pouco excesso de burocracia.",
    pressure: "sob pressão tende a acelerar, cobrar mais e reduzir paciência com lentidão.",
    change: "costuma ver mudança como desafio e oportunidade de avançar.",
    avoid: "rotina excessiva, perda de autonomia, lentidão decisória e falta de reconhecimento.",
    decision: "racional, rápida e orientada a impacto."
  },
  Desenvolvedor: {
    summary: "Perfil voltado a pessoas, aprendizagem e amadurecimento da equipe. Gera crescimento quando combina apoio com exigência.",
    strengths: ["escuta ativa em conversas importantes", "feedback orientado ao crescimento", "formação de pessoas", "capacidade de criar confiança"],
    risks: ["proteger demais a equipe", "adiar conversas difíceis", "aceitar baixa performance por tempo excessivo", "perder velocidade em momentos críticos"],
    recommendations: ["usar matriz de desempenho e potencial", "transformar feedback em plano com data", "separar acolhimento de tolerância a desalinhamento"],
    learning: "aprende bem com troca, mentoria, exemplos práticos e reflexão sobre pessoas e contexto.",
    task: "executa melhor quando enxerga sentido, impacto humano e possibilidade de desenvolvimento.",
    relationships: "valoriza vínculo, confiança, colaboração e conversas de crescimento.",
    environment: "ambientes com segurança psicológica, liderança acessível e espaço para desenvolvimento.",
    pressure: "sob pressão pode absorver problemas demais ou evitar confronto para preservar relações.",
    change: "adere melhor a mudanças quando entende impacto nas pessoas e no processo.",
    avoid: "ambientes frios, liderança agressiva, conflito constante e ausência de reconhecimento.",
    decision: "ponderada, relacional e orientada a consequências para pessoas e resultados."
  },
  Estrategista: {
    summary: "Perfil orientado à leitura de cenário, adaptação e direção. Ganha força quando conecta visão com execução cotidiana.",
    strengths: ["visão sistêmica para conectar variáveis", "adaptabilidade diante de mudanças", "planejamento", "capacidade de antecipar riscos"],
    risks: ["ficar distante da operação", "mudar prioridades demais", "comunicar estratégia de forma pouco concreta", "subestimar resistências humanas"],
    recommendations: ["traduzir estratégia em três prioridades por ciclo", "definir indicadores de avanço", "repetir a mensagem até virar direção compartilhada"],
    learning: "aprende melhor quando conecta conceito, cenário, experiência e aplicação em decisões reais.",
    task: "atua bem em problemas complexos, mudanças, planejamento e definição de caminhos.",
    relationships: "pode alternar entre proximidade e distância conforme a relevância estratégica do tema.",
    environment: "ambientes com autonomia, desafio intelectual, dados e espaço para construir solução.",
    pressure: "sob pressão tende a analisar cenários rapidamente e buscar alternativas.",
    change: "costuma se motivar com novos cenários, desde que exista direção clara.",
    avoid: "microgestão, tarefas repetitivas sem sentido e ausência de espaço para pensar.",
    decision: "analítica, contextual e orientada a consequências futuras."
  },
  Influenciador: {
    summary: "Perfil mobilizador, comunicativo e persuasivo. Tem facilidade para gerar adesão, energia e movimento coletivo.",
    strengths: ["facilidade para mobilizar pessoas", "capacidade de criar conexão", "construção natural de relacionamentos", "comunicação que gera envolvimento"],
    risks: ["assumir mais compromissos do que consegue acompanhar de perto", "concentrar resultados excessivamente na própria capacidade de relacionamento", "decidir com rapidez sem aprofundar suficientemente os dados", "gerar boas ideias, mas perder consistência na etapa de execução"],
    recommendations: ["registrar combinados após reuniões", "usar dados para sustentar narrativas", "acompanhar entregas com cadência e responsáveis"],
    learning: "aprende por interação, exemplos, histórias, troca social e temas que geram entusiasmo.",
    task: "inicia movimentos com energia e tende a performar bem quando precisa mobilizar pessoas.",
    relationships: "constrói conexões com facilidade e usa comunicação como alavanca de resultado.",
    environment: "ambientes com movimento, visibilidade, reconhecimento e interação frequente.",
    pressure: "sob pressão pode falar demais, dispersar ou buscar aprovação para reduzir tensão.",
    change: "adere bem quando a mudança traz novidade, possibilidade de influência e crescimento.",
    avoid: "isolamento, tarefas longas sem interação, falta de reconhecimento e excesso de rotina.",
    decision: "rápida, intuitiva e influenciada por pessoas, energia e oportunidade."
  },
  "Construtor de Equipes": {
    summary: "Perfil com potencial para integrar pessoas, mediar tensões e fortalecer colaboração. Cria valor ao transformar conflito em acordo produtivo.",
    strengths: ["mediação de conversas sensíveis", "colaboração entre perfis diferentes", "coesão de equipe", "segurança relacional"],
    risks: ["buscar consenso demais", "evitar confrontos necessários", "demorar a corrigir baixa performance", "confundir harmonia com alinhamento"],
    recommendations: ["definir acordos de equipe por escrito", "tratar conflitos com fatos e impactos", "combinar indicadores coletivos e individuais"],
    learning: "aprende por observação, troca, repetição, exemplos e aplicação em relações reais.",
    task: "executa melhor quando há clareza de papel, estabilidade mínima e cooperação entre pessoas.",
    relationships: "valoriza confiança, respeito, previsibilidade e acordos claros dentro do grupo.",
    environment: "ambientes colaborativos, organizados e com conflitos tratados de forma madura.",
    pressure: "sob pressão pode tentar pacificar antes de enfrentar a raiz do problema.",
    change: "adere a mudanças quando entende motivos, impactos e passos de transição.",
    avoid: "ambientes caóticos, conflitos constantes, ambiguidade extrema e lideranças incoerentes.",
    decision: "ponderada, colaborativa e orientada a estabilidade do grupo."
  }
};

const competencyLibrary = {
  execucao: ["orientação para resultado", "proatividade", "dinamismo", "automotivação"],
  comunicacao: ["capacidade de ouvir", "clareza de comunicação", "empatia", "relacionamento interpessoal"],
  conflitos: ["dominância madura", "assertividade", "tolerância", "gestão de tensão"],
  influencia: ["sociabilidade", "extroversão", "persuasão", "orientação por relacionamento"],
  adaptabilidade: ["flexibilidade", "multitarefas", "planejamento adaptativo", "resposta a mudanças"],
  emocional: ["autocontrole", "autoavaliação", "maturidade emocional", "consistência sob pressão"],
  lideranca: ["direção", "priorização", "responsabilização", "tomada de decisão"],
  comercial: ["processo comercial", "prospecção", "conversão", "gestão de CRM"],
  atendimento: ["experiência do cliente", "retenção", "NPS", "pós-venda"],
  gestao: ["indicadores", "rotina de gestão", "planejamento", "correção de rota"],
  desenvolvimento: ["treinamento", "formação de líderes", "matriz de competências", "sucessão"],
  cultura: ["valores praticados", "comportamento", "colaboração", "padrão de decisão"]
};

const maturityLibrary = {
  "Nível 1 - Operação Reativa": {
    summary: "A empresa opera muito dependente de urgências, pessoas-chave e correção de problemas depois que eles aparecem.",
    risks: ["gestão por urgência", "baixa previsibilidade comercial", "retrabalho", "clientes percebendo inconsistências"],
    priorities: ["mapear processos críticos", "definir indicadores mínimos", "criar rotina semanal de gestão", "corrigir gargalos comerciais e de atendimento"]
  },
  "Nível 2 - Operação Estruturada": {
    summary: "Já existem processos e alguma organização, mas a consistência ainda depende de disciplina, liderança presente e melhor uso de dados.",
    risks: ["processos existirem no papel, mas não na rotina", "CRM subutilizado", "treinamento pontual", "indicadores sem decisão"],
    priorities: ["padronizar funil e atendimento", "implantar reuniões com pauta fixa", "criar plano de treinamento", "definir responsáveis por indicadores"]
  },
  "Nível 3 - Gestão Orientada por Indicadores": {
    summary: "A empresa começa a decidir melhor porque já mede pontos importantes. O desafio é transformar dados em cultura de execução.",
    risks: ["excesso de métricas sem foco", "indicadores atrasados", "baixa responsabilização", "lideranças intermediárias pouco preparadas"],
    priorities: ["definir poucos indicadores-chave", "criar planos de ação por desvio", "formar líderes", "acompanhar conversão, retenção e produtividade"]
  },
  "Nível 4 - Alta Performance": {
    summary: "A operação mostra consistência e boa capacidade de entrega. O próximo salto depende de escala, sucessão e refinamento de experiência.",
    risks: ["acomodação", "dependência de líderes fortes", "crescimento mais rápido que a cultura", "perda de padrão entre unidades ou áreas"],
    priorities: [
      "identificar as três rotinas que mais contribuem para os resultados e documentar o padrão",
      "mapear posições críticas e preparar profissionais para novas responsabilidades",
      "escolher processos repetitivos que consomem tempo e podem ser automatizados",
      "revisar papéis, responsabilidades e cadência de acompanhamento da liderança"
    ]
  },
  "Nível 5 - Excelência Operacional": {
    summary: "A empresa opera com alto nível de maturidade. O foco passa a ser inovação, vantagem competitiva e multiplicação do modelo.",
    risks: ["complexidade excessiva", "distância entre liderança e operação", "lentidão para inovar", "perda de simplicidade"],
    priorities: ["criar universidade corporativa para sustentar escala", "comparar benchmark externo", "testar novas alavancas comerciais", "desenvolver lideranças para expansão"]
  }
};

const profileLabelAliases = {
  "Nivel 1 - Operacao Reativa": "Nível 1 - Operação Reativa",
  "Nivel 2 - Operacao Estruturada": "Nível 2 - Operação Estruturada",
  "Nivel 3 - Gestao Orientada por Indicadores": "Nível 3 - Gestão Orientada por Indicadores",
  "Nivel 4 - Alta Performance": "Nível 4 - Alta Performance",
  "Nivel 5 - Excelencia Operacional": "Nível 5 - Excelência Operacional"
};

const diagnosticLabelAliases = {
  "Lideranca e Perfil Profissional": "Liderança e Perfil Profissional"
};

const dimensionLibrary = {
  execucao: "Capacidade de transformar direção em prioridade, ritmo e entrega. Score alto indica tração; score baixo indica dispersão.",
  comunicacao: "Clareza, escuta, feedback e adaptação da mensagem. Score alto fortalece alinhamento; score baixo cria ruído e retrabalho.",
  conflitos: "Disposição para enfrentar tensões com maturidade. Score alto mostra coragem gerencial; score baixo pode indicar evitação.",
  influencia: "Capacidade de engajar e mobilizar sem depender apenas de autoridade formal. Score alto acelera adesão; score baixo reduz tração.",
  adaptabilidade: "Resposta a mudanças, aprendizagem e leitura de contexto. Score alto favorece estratégia; score baixo aumenta rigidez.",
  emocional: "Consciência de impacto, autocontrole e maturidade sob pressão. Score alto gera confiança; score baixo amplia risco comportamental.",
  lideranca: "Direção, papéis, decisão e cadência da liderança. Mostra se a empresa tem comando ou apenas esforço.",
  comercial: "Funil, prospecção, conversão e uso de CRM. Mostra a previsibilidade de receita.",
  atendimento: "Experiência do cliente, pós-venda, NPS e retenção. Protege margem, recompra e indicação.",
  gestao: "Indicadores, rotinas, planejamento e correção de rota. Transforma dados em execução.",
  desenvolvimento: "Treinamento, formação de líderes e plano de crescimento. Sustenta escala.",
  cultura: "Comportamentos, valores praticados e colaboração. Define o jeito real de operar."
};

const recommendations = {
  execucao: "Definir metas semanais, responsáveis, prazos e uma rotina curta de acompanhamento.",
  comunicacao: "Implantar feedback com exemplos concretos, combinados objetivos e checagem de entendimento.",
  conflitos: "Tratar desalinhamentos cedo, separando fatos, impactos e expectativa de comportamento.",
  influencia: "Mapear pessoas-chave, reforçar comunicação de propósito e mostrar ganhos práticos.",
  adaptabilidade: "Criar ciclos curtos de revisão de prioridade e registrar aprendizados das mudanças.",
  emocional: "Identificar gatilhos de pressão e criar pausas conscientes antes de decisões sensíveis.",
  lideranca: "Reforçar direção, prioridades, papéis e cadência de acompanhamento da execução.",
  comercial: "Documentar o funil, medir conversões e transformar o CRM em pauta de gestão.",
  atendimento: "Padronizar atendimento, medir satisfação e criar planos de retenção e recompra.",
  gestao: "Implantar painel de indicadores com decisões, responsáveis, prazos e correção de rota.",
  desenvolvimento: "Criar trilhas de treinamento, matriz de competências e plano de formação de líderes.",
  cultura: "Traduzir valores em comportamentos observáveis, reconhecidos, cobrados e discutidos."
};

const form = document.querySelector("#lead-form");
const questionList = document.querySelector("#question-list");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const resultView = document.querySelector("#result-view");
const leadTable = document.querySelector("#lead-table");
const adminDashboard = document.querySelector("#admin-dashboard");
const adminSearch = document.querySelector("#admin-search");
const themeToggle = document.querySelector("#theme-toggle");
const adminLink = document.querySelector(".admin-link");
const adminLoginForm = document.querySelector("#admin-login-form");
const adminLoginError = document.querySelector("#admin-login-error");
const adminLogout = document.querySelector("#admin-logout");

function getLeads() {
  if (adminAuthed) return remoteLeads;
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

async function saveLeadRemote(lead) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient.from("diagnostico_leads").insert({
      id: lead.id,
      name: lead.data.name,
      email: lead.data.email,
      phone: lead.data.phone,
      company: lead.data.company || null,
      role: lead.data.role || null,
      diagnostic: lead.diagnostic,
      diagnostic_label: lead.diagnosticLabel,
      score: lead.score,
      profile_label: displayProfileFor(lead.profile),
      payload: lead
    });
    if (error) console.warn("Supabase insert:", error.message || error);
  } catch (err) {
    console.warn("Supabase insert exception:", err);
  }
}

async function loadRemoteLeads() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from("diagnostico_leads")
      .select("payload")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase select:", error.message || error);
      return;
    }
    remoteLeads = (data || []).map((row) => row.payload).filter(Boolean);
  } catch (err) {
    console.warn("Supabase select exception:", err);
  }
}

function getDraft() {
  return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
}

function saveDraft() {
  const data = Object.fromEntries(new FormData(form).entries());
  const answers = {};
  document.querySelectorAll("input[data-question]:checked").forEach((input) => {
    answers[input.dataset.question] = Number(input.value);
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, answers }));
}

async function hashText(value) {
  const encoded = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isAdminAuthenticated() {
  return adminAuthed;
}

function syncAdminAccess() {
  if (adminLink) adminLink.hidden = !isAdminAuthenticated();
}

function setScreen(screen) {
  const targetScreen = screen === "admin" && !isAdminAuthenticated() ? "admin-login" : screen;
  const target = document.querySelector(`#screen-${targetScreen}`);
  if (!target) return;
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  target.classList.add("active");
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", targetScreen !== "admin-login" && button.dataset.screen === targetScreen);
  });
  if (targetScreen === "admin") renderAdmin();
}

function updateRouteForScreen(screen) {
  const base = `${location.pathname}${location.search}`;
  if (screen === "diagnostics") history.replaceState(null, "", `${base}#diagnostico`);
  if (screen === "admin") history.replaceState(null, "", `${base}#admin`);
  if (screen === "start") history.replaceState(null, "", base);
}

function applyRouteFromHash() {
  const hash = location.hash.toLowerCase();
  if (hash === "#admin") setScreen("admin");
  if (hash === "#diagnostico" || hash === "#diagnosticos") setScreen("diagnostics");
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const data = new FormData(adminLoginForm);
  const email = String(data.get("adminEmail") || "").trim().toLowerCase();
  const password = String(data.get("adminPassword") || "");

  if (!supabaseClient) {
    adminLoginError.textContent = "Conexão indisponível. Tente novamente.";
    return;
  }

  adminLoginError.textContent = "Entrando...";
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    adminLoginError.textContent = "E-mail ou senha incorretos.";
    return;
  }

  adminAuthed = true;
  adminLoginForm.reset();
  adminLoginError.textContent = "";
  await loadRemoteLeads();
  syncAdminAccess();
  setScreen("admin");
  updateRouteForScreen("admin");
}

async function logoutAdmin() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  adminAuthed = false;
  remoteLeads = [];
  syncAdminAccess();
  adminSearch.value = "";
  adminDashboard.innerHTML = "";
  leadTable.innerHTML = "";
  setScreen("start");
  updateRouteForScreen("start");
}

function currentDiagnosticKey() {
  return new FormData(form).get("diagnostic") || "leadership";
}

function renderQuestions() {
  const key = currentDiagnosticKey();
  const diagnostic = diagnostics[key];
  const draft = getDraft();
  questionList.innerHTML = diagnostic.questions
    .map(([dimension, text], index) => {
      const selected = draft.data?.diagnostic === key ? draft.answers?.[index] : undefined;
      const options = scaleLabels
        .map((label, optionIndex) => {
          const value = optionIndex + 1;
          const checked = Number(selected) === value ? "checked" : "";
          return `<label><input data-question="${index}" name="q-${index}" type="radio" value="${value}" ${checked}>${value}<small>${label}</small></label>`;
        })
        .join("");
      return `<article class="question-card" data-dimension="${dimension}"><p>${index + 1}. ${text}</p><div class="scale">${options}</div></article>`;
    })
    .join("");
  updateProgress();
}

function updateProgress() {
  const total = diagnostics[currentDiagnosticKey()].questions.length;
  const answered = document.querySelectorAll("input[data-question]:checked").length;
  progressLabel.textContent = `${answered} de ${total} respondidas`;
  progressBar.style.width = `${Math.round((answered / total) * 100)}%`;
}

function restoreDraft() {
  const draft = getDraft();
  if (!draft.data) return;
  Object.entries(draft.data).forEach(([key, value]) => {
    const input = form.elements[key];
    if (!input) return;
    if (input instanceof RadioNodeList) input.value = value;
    else input.value = value;
  });
}

function collectAssessment() {
  const data = Object.fromEntries(new FormData(form).entries());
  const diagnostic = diagnostics[data.diagnostic];
  const answers = diagnostic.questions.map((_, index) => {
    const checked = document.querySelector(`input[name="q-${index}"]:checked`);
    return checked ? Number(checked.value) : null;
  });
  return { data, diagnostic, answers };
}

function scoreAssessment(diagnostic, answers) {
  const buckets = {};
  diagnostic.questions.forEach(([dimension], index) => {
    buckets[dimension] ||= [];
    buckets[dimension].push(answers[index]);
  });

  const dimensionScores = Object.fromEntries(
    Object.entries(buckets).map(([dimension, values]) => {
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return [dimension, Math.round((average / 5) * 100)];
    })
  );

  const overall = Math.round(
    Object.values(dimensionScores).reduce((sum, value) => sum + value, 0) /
      Object.values(dimensionScores).length
  );

  return { overall, dimensionScores };
}

function topDimension(scores) {
  return Object.entries(scores).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value)[0];
}

function lowDimensions(scores) {
  return Object.entries(scores).map(([key, value]) => ({ key, value })).sort((a, b) => a.value - b.value).slice(0, 2);
}

function getBand(score) {
  return scoreBands.find((band) => score >= band.min && score <= band.max) || scoreBands[0];
}

function getDiscPattern(scores) {
  const factors = Object.entries(discFactors).map(([key, factor]) => {
    const value = Math.round(factor.dimensions.reduce((sum, dimension) => sum + scores[dimension], 0) / factor.dimensions.length);
    return { key, value, ...factor };
  });
  return factors.sort((a, b) => b.value - a.value);
}

function averageDimensions(scores, keys) {
  return Math.round(keys.reduce((sum, key) => sum + scores[key], 0) / keys.length);
}

function getLeadershipIndicators(scores, overall) {
  return [
    {
      label: "Energia de execução",
      value: averageDimensions(scores, ["execucao", "influencia", "adaptabilidade"]),
      meaning: "pique para agir, iniciar movimentos e sustentar ritmo."
    },
    {
      label: "Aproveitamento de potencial",
      value: overall,
      meaning: "quanto as competências aparecem de forma aproveitável na prática."
    },
    {
      label: "Flexibilidade comportamental",
      value: averageDimensions(scores, ["adaptabilidade", "emocional", "comunicacao"]),
      meaning: "capacidade de ajustar comportamento conforme contexto, pressão e pessoas."
    },
    {
      label: "Pressão percebida",
      value: averageDimensions(scores, ["execucao", "conflitos"]),
      meaning: "intensidade com que o perfil tende a lidar com cobrança, urgência e enfrentamento."
    },
    {
      label: "Sustentação relacional",
      value: averageDimensions(scores, ["comunicacao", "influencia", "emocional"]),
      meaning: "capacidade de manter confiança, vínculo e alinhamento durante a execução."
    }
  ];
}

function getBusinessIndicators(scores, overall) {
  return [
    {
      label: "Comando e direção",
      value: averageDimensions(scores, ["lideranca", "gestao"]),
      meaning: "clareza estratégica, decisão, ritmo e capacidade de correção de rota."
    },
    {
      label: "Previsibilidade comercial",
      value: averageDimensions(scores, ["comercial", "gestao"]),
      meaning: "capacidade de gerar receita com funil, processo, indicadores e CRM."
    },
    {
      label: "Experiência e retenção",
      value: averageDimensions(scores, ["atendimento", "cultura"]),
      meaning: "consistência percebida pelo cliente e potencial de recompra, indicação e lealdade."
    },
    {
      label: "Escalabilidade",
      value: averageDimensions(scores, ["desenvolvimento", "gestao", "lideranca"]),
      meaning: "capacidade de crescer sem depender apenas de pessoas específicas."
    },
    {
      label: "Maturidade geral",
      value: overall,
      meaning: "nível médio de organização, método e consistência entre as dimensões avaliadas."
    }
  ];
}

function renderIndicatorGrid(indicators) {
  return `<div class="indicator-grid">${indicators
    .map((item) => `<div><strong>${item.label}</strong><span>${item.value}</span><small>${getBand(item.value).label}</small><p>${item.meaning}</p></div>`)
    .join("")}</div>`;
}

function renderCompetencyCloud(lead, diagnostic) {
  const ordered = Object.entries(lead.dimensions)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
  return ordered
    .map(({ key }) => `<div class="competency-block"><strong>${diagnostic.dimensions[key]}</strong><span>${competencyLibrary[key].join(" | ")}</span></div>`)
    .join("");
}

function generateResult() {
  const { data, diagnostic, answers } = collectAssessment();
  const missingLead = !data.name || !data.email || !data.phone;
  const missingAnswers = answers.some((answer) => answer === null);

  if (missingLead || missingAnswers) {
    alert("Preencha nome, e-mail, WhatsApp e responda todas as perguntas para gerar o resultado.");
    return;
  }

  const scored = scoreAssessment(diagnostic, answers);
  const profile = diagnostic.classify(scored.dimensionScores, scored.overall);
  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    data,
    answers,
    diagnostic: data.diagnostic,
    diagnosticLabel: diagnostic.label,
    score: scored.overall,
    profile,
    dimensions: scored.dimensionScores
  };

  const leads = getLeads();
  leads.unshift(lead);
  saveLeads(leads);
  localStorage.removeItem(DRAFT_KEY);
  saveLeadRemote(lead);
  renderResult(lead);
  setScreen("result");
}

function renderList(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderDimensionRows(lead, diagnostic) {
  return Object.entries(lead.dimensions)
    .map(([key, value]) => {
      const band = getBand(value);
      return `<div class="dimension-detail">
        <div class="dimension-row"><span>${diagnostic.dimensions[key]}</span><div class="bar"><span style="width:${value}%"></span></div><strong>${value}</strong></div>
        <p><strong>${band.label}:</strong> ${dimensionLibrary[key]} ${recommendations[key]}</p>
      </div>`;
    })
    .join("");
}

function displayNameFor(lead) {
  return lead.diagnostic === "business" ? businessSubjectFor(lead) : personNameFor(lead);
}

function personNameFor(lead) {
  return (lead.data.name || "Participante").trim();
}

function companyNameFor(lead) {
  return (lead.data.company || "").trim();
}

function businessSubjectFor(lead) {
  const company = companyNameFor(lead);
  return company ? `A ${company}` : "Sua empresa";
}

function reportOwnerFor(lead) {
  return lead.diagnostic === "business" ? companyNameFor(lead) || personNameFor(lead) : personNameFor(lead);
}

function displayProfileFor(profile) {
  return profileLabelAliases[profile] || profile;
}

function displayDiagnosticLabelFor(label) {
  return diagnosticLabelAliases[label] || label;
}

function getMaturityProfile(profile) {
  return maturityLibrary[profile] || maturityLibrary[displayProfileFor(profile)];
}

function scoreOutOf100(score) {
  return `${score} de 100`;
}

function challengeNoteFor(lead) {
  const challenge = (lead.data.challenge || "").trim();
  return challenge ? `<div class="report-note challenge-note"><strong>Desafio informado:</strong> ${challenge}</div>` : "";
}

function screenChallengeNoteFor(lead) {
  const challenge = (lead.data.challenge || "").trim();
  return challenge ? `<p class="result-disclaimer"><strong>Desafio informado:</strong> ${challenge}</p>` : "";
}

function evolutionLeverFor(lead, diagnostic) {
  const dimension = lowDimensions(lead.dimensions)[0];
  return { ...dimension, label: diagnostic.dimensions[dimension.key] };
}

function currentDifferentialFor(lead, diagnostic) {
  const dimension = topDimension(lead.dimensions);
  return { ...dimension, label: diagnostic.dimensions[dimension.key] };
}

function methodologyBlockFor(type) {
  return `
    <div class="methodology-block">
      <h3>Sobre este diagnóstico</h3>
      <p>${methodologyTexts[type]}</p>
    </div>`;
}

function reflectionBlockFor(type) {
  return `
    <div class="reflection-block">
      <h3>Um ponto para reflexão</h3>
      <p>${finalReflectionTexts[type]}</p>
    </div>`;
}

function renderReportFooter() {
  return `
    <footer class="report-footer">
      <strong>${consultantContact.name}</strong>
      <span>E-mail: ${consultantContact.email}</span>
      <span>WhatsApp: ${consultantContact.phone}</span>
      <span>Site: ${consultantContact.site}</span>
    </footer>`;
}

function renderSimpleBars(lead, diagnostic) {
  return Object.entries(lead.dimensions)
    .map(([key, value]) => `<div class="print-bar-row"><span>${diagnostic.dimensions[key]}</span><div><i style="width:${value}%"></i></div><strong>${value}</strong></div>`)
    .join("");
}

function renderPrintReport(lead, diagnostic, displayName) {
  const weak = lowDimensions(lead.dimensions);
  const band = getBand(lead.score);

  if (lead.diagnostic === "leadership") {
    const profile = profileLibrary[lead.profile];
    const disc = getDiscPattern(lead.dimensions);
    const primary = disc[0];
    const secondary = disc[1];
    const actionPlan = [...profile.recommendations, ...weak.map(({ key }) => recommendations[key])].slice(0, 3);
    const resultProfile = displayProfileFor(lead.profile);
    const differential = currentDifferentialFor(lead, diagnostic);
    const lever = evolutionLeverFor(lead, diagnostic);

    return `
      <section class="print-report">
        <article class="report-page report-hero-page">
          <div class="compact-report-head">
            <div class="pdf-brand">Juvenill <span>Ribêiro.</span></div>
            <p>Diagnóstico Individual de Liderança e Performance</p>
          </div>
          <p class="report-kicker">Resultado principal</p>
          <h2>${displayName}, seu resultado indica uma predominância do perfil <span>${resultProfile}</span></h2>
          <p class="report-intro">Uma leitura inicial sobre a forma como você tende a liderar, se comunicar e reagir diante dos desafios.</p>
          <p class="report-lead">${profile.summary}</p>
          <div class="result-highlight">
            <div><strong>${scoreOutOf100(lead.score)}</strong><span>Score geral</span></div>
            <div><strong>${primary.key} - ${primary.label}</strong><span>Tendência DISC predominante</span></div>
            <div><strong>${secondary.key} - ${secondary.label}</strong><span>Tendência de apoio</span></div>
            <div><strong>${lever.label}</strong><span>Principal alavanca de evolução</span></div>
          </div>
          <p class="plain-meaning"><strong>Em linguagem simples:</strong> este resultado indica como você tende a liderar, decidir, se comunicar e reagir sob pressão. Ele mostra um ponto de partida para desenvolvimento.</p>
          <p class="report-disclaimer">${diagnosticDisclaimer}</p>
          ${challengeNoteFor(lead)}
          <div class="report-two-columns">
            <div>
              <h3>Pontos fortes percebidos</h3>
              <ul>${renderList(profile.strengths.slice(0, 3))}</ul>
            </div>
            <div>
              <h3>Pontos de atenção</h3>
              <ul>${renderList(profile.risks.slice(0, 3))}</ul>
            </div>
          </div>
          <div class="report-note">
            <strong>Principal força atual:</strong> ${differential.label} (${differential.value}).<br>
            <strong>Principal risco:</strong> ${primary.risk}
          </div>
          <h2>Scores por dimensão</h2>
          <div class="print-bars">${renderSimpleBars(lead, diagnostic)}</div>
          <div class="report-note">
            <strong>Principal alavanca de evolução:</strong> ${lever.label} (${lever.value}).<br>
            <strong>Prioridades de desenvolvimento:</strong> ${weak.map(({ key }) => diagnostic.dimensions[key]).join(" e ")}.
          </div>
          <div class="report-two-columns compact-bottom">
            <div>
              <h3>Plano inicial</h3>
              <ol class="report-steps">${renderList(actionPlan)}</ol>
            </div>
            <div>
              <h3>Próxima conversa</h3>
              <ol class="report-questions">
                <li>Qual ponto do resultado mais confirma algo que você já percebia?</li>
                <li>Onde a sua principal força pode estar se transformando em risco?</li>
                <li>Qual comportamento deveria aparecer com mais frequência nos próximos 30 dias?</li>
              </ol>
            </div>
          </div>
          ${reflectionBlockFor("leadership")}
          <p class="technical-line"><strong>Nota técnica:</strong> faixa ${band.label}; DISC predominante ${primary.key}-${primary.label}; apoio ${secondary.key}-${secondary.label}.</p>
          ${renderReportFooter()}
        </article>
        ${renderPrintGuide(lead.diagnostic)}
      </section>`;
  }

  const maturity = getMaturityProfile(lead.profile);
  const resultProfile = displayProfileFor(lead.profile);
  const actionPlan = [...maturity.priorities, ...weak.map(({ key }) => recommendations[key])].slice(0, 4);
  const differential = currentDifferentialFor(lead, diagnostic);
  const lever = evolutionLeverFor(lead, diagnostic);

  return `
    <section class="print-report">
      <article class="report-page report-hero-page">
        <div class="compact-report-head">
          <div class="pdf-brand">Juvenill <span>Ribêiro.</span></div>
          <p>Diagnóstico de Maturidade Empresarial</p>
        </div>
        <p class="report-kicker">Resultado principal</p>
        <h2>${displayName} está no <span>${resultProfile}</span></h2>
        <p class="report-intro">Uma leitura inicial sobre a capacidade da empresa de crescer com método, consistência e menor dependência de pessoas específicas.</p>
        <p class="report-lead">${maturity.summary}</p>
        <div class="result-highlight">
          <div><strong>${scoreOutOf100(lead.score)}</strong><span>Score geral</span></div>
          <div><strong>${band.label}</strong><span>Faixa de maturidade</span></div>
          <div><strong>${differential.label}</strong><span>Principal diferencial atual</span></div>
          <div><strong>${lever.label}</strong><span>Principal alavanca de evolução</span></div>
        </div>
        <p class="plain-meaning"><strong>Em linguagem simples:</strong> este resultado mostra o quanto a empresa consegue repetir desempenho com método, pessoas preparadas, indicadores e cultura de execução.</p>
        <p class="report-disclaimer">${diagnosticDisclaimer}</p>
        ${challengeNoteFor(lead)}
        <div class="report-two-columns">
          <div>
            <h3>Riscos do nível atual</h3>
            <ul>${renderList(maturity.risks.slice(0, 3))}</ul>
          </div>
          <div>
            <h3>Prioridades recomendadas</h3>
            <ul>${renderList(actionPlan)}</ul>
          </div>
        </div>
        <h2>Scores por dimensão</h2>
        <div class="print-bars">${renderSimpleBars(lead, diagnostic)}</div>
        <div class="report-note">
          <strong>Principal diferencial atual:</strong> ${differential.label} (${differential.value}).<br>
          <strong>Principal alavanca de evolução:</strong> ${lever.label} (${lever.value}).
        </div>
        <div class="report-two-columns compact-bottom">
          <div>
            <h3>Plano inicial de 90 dias</h3>
            <ol class="report-steps">${renderList(actionPlan)}</ol>
          </div>
          <div>
              <h3>Próxima conversa</h3>
              <ol class="report-questions">
                <li>Qual dimensão mais limita o crescimento atualmente?</li>
                <li>Onde a operação ainda depende de pessoas específicas?</li>
                <li>Qual rotina poderia gerar maior impacto nos próximos 90 dias?</li>
              </ol>
          </div>
        </div>
        ${reflectionBlockFor("business")}
        <p class="technical-line"><strong>Nota técnica:</strong> faixa ${band.label}; diferencial ${differential.label}; foco inicial em ${weak.map(({ key }) => diagnostic.dimensions[key]).join(" e ")}.</p>
        ${renderReportFooter()}
      </article>
      ${renderPrintGuide(lead.diagnostic)}
    </section>`;
}

function renderPrintGuide(type) {
  if (type === "leadership") {
    return `
      <article class="report-page guide-print-page">
        <div class="compact-report-head">
          <div class="pdf-brand">Juvenill <span>Ribêiro.</span></div>
          <p>Guia de interpretação | Liderança + DISC</p>
        </div>
        <p class="report-intro">Este guia ajuda a interpretar o resultado com linguagem simples. Use como apoio para entender os blocos do relatório e preparar a próxima conversa.</p>
        ${methodologyBlockFor("leadership")}
        <div class="guide-print-grid">
          <div><h3>Score geral</h3><p>Mostra a consistência percebida da liderança. Quanto maior o score, mais sólido tende a ser o comportamento avaliado.</p></div>
          <div><h3>Perfil predominante</h3><p>Traduz o estilo principal de atuação. Ele não define a pessoa; indica uma tendência de comportamento.</p></div>
          <div><h3>Leitura DISC</h3><p>D indica Dominância, I Influência, S Estabilidade e C Conformidade. A combinação mostra como a pessoa tende a agir.</p></div>
          <div><h3>Dimensões</h3><p>Mostram onde a liderança aparece mais forte e onde há oportunidade de desenvolvimento.</p></div>
        </div>
        <h2>Leitura rápida DISC</h2>
        <div class="guide-print-grid">
          <div><strong>D - Dominância:</strong><p>Decisão, velocidade e cobrança. Risco: impaciência e baixa escuta.</p></div>
          <div><strong>I - Influência:</strong><p>Comunicação e engajamento. Risco: baixa profundidade ou pouco acompanhamento.</p></div>
          <div><strong>S - Estabilidade:</strong><p>Constância e colaboração. Risco: evitar conflitos e decisões impopulares.</p></div>
          <div><strong>C - Conformidade:</strong><p>Método e qualidade. Risco: perfeccionismo e lentidão decisória.</p></div>
        </div>
        <h2>Perguntas para aprofundar</h2>
        <ol class="report-questions">
          <li>Onde o resultado confirma o que você já percebia?</li>
          <li>Qual ponto de atenção mais impacta sua liderança hoje?</li>
          <li>Qual comportamento precisa aparecer nos próximos 30 dias?</li>
        </ol>
        <div class="final-call">
          <strong>Este resultado é apenas o começo.</strong>
          <p>A pergunta agora não é apenas onde você está. É o que pode estar impedindo o seu próximo salto.</p>
        </div>
        ${renderReportFooter()}
      </article>`;
  }

  return `
    <article class="report-page guide-print-page">
      <div class="compact-report-head">
        <div class="pdf-brand">Juvenill <span>Ribêiro.</span></div>
        <p>Guia de interpretação | Maturidade empresarial</p>
      </div>
      <p class="report-intro">Este guia ajuda a interpretar o resultado da empresa com foco em decisão, prioridade e plano de evolução.</p>
      ${methodologyBlockFor("business")}
      <div class="guide-print-grid">
        <div><h3>Liderança</h3><p>Direção, prioridades, papéis e decisão.</p></div>
        <div><h3>Comercial</h3><p>Processo de vendas, prospecção, conversão e CRM.</p></div>
        <div><h3>Atendimento</h3><p>Experiência do cliente, NPS, retenção e pós-venda.</p></div>
        <div><h3>Gestão</h3><p>Indicadores, reuniões, planejamento e correção de rota.</p></div>
        <div><h3>Desenvolvimento</h3><p>Treinamento, formação de líderes e sucessão.</p></div>
        <div><h3>Cultura</h3><p>Valores praticados, comportamento e colaboração.</p></div>
      </div>
      <h2>Níveis de maturidade</h2>
      <div class="guide-print-list">
        <p><strong>Nível 1:</strong> operação reativa e dependente de urgências.</p>
        <p><strong>Nível 2:</strong> operação estruturada, mas ainda inconsistente.</p>
        <p><strong>Nível 3:</strong> gestão por indicadores em consolidação.</p>
        <p><strong>Nível 4:</strong> alta performance com desafio de escala.</p>
        <p><strong>Nível 5:</strong> excelência operacional e melhoria contínua.</p>
      </div>
      <h2>Perguntas para aprofundar</h2>
      <ol class="report-questions">
        <li>Qual dimensão mais limita crescimento hoje?</li>
        <li>Onde ainda há dependência de pessoas específicas?</li>
        <li>Que rotina mudaria o resultado nos próximos 90 dias?</li>
      </ol>
      <div class="final-call">
        <strong>Este resultado é apenas o começo.</strong>
        <p>A pergunta agora não é apenas onde a empresa está. É o que pode estar impedindo o próximo salto.</p>
      </div>
      ${renderReportFooter()}
    </article>`;
}

function renderLeadershipResult(lead, diagnostic) {
  const profile = profileLibrary[lead.profile];
  const disc = getDiscPattern(lead.dimensions);
  const primary = disc[0];
  const secondary = disc[1];
  const weak = lowDimensions(lead.dimensions);
  const indicators = getLeadershipIndicators(lead.dimensions, lead.score);
  const differential = currentDifferentialFor(lead, diagnostic);
  const lever = evolutionLeverFor(lead, diagnostic);

  return `
    <div class="result-grid">
      <article class="result-card">
        <div class="score-ring" style="--score:${lead.score}%"><strong>${lead.score}</strong></div>
        <p><span class="tag">${displayDiagnosticLabelFor(lead.diagnosticLabel)}</span></p>
        <p><strong>${lead.data.name}</strong><br>${lead.data.company || "Empresa não informada"}<br>${lead.data.role || "Cargo não informado"}</p>
        <p><strong>Score geral:</strong><br>${scoreOutOf100(lead.score)}</p>
        <p><strong>Leitura DISC:</strong><br>${primary.key} - ${primary.label} predominante, com ${secondary.key} - ${secondary.label} como apoio.</p>
      </article>
      <div class="result-card">
        <h3>Diagnóstico Individual de Liderança e Performance</h3>
        <p><strong>${personNameFor(lead)}, seu resultado indica uma predominância do perfil ${displayProfileFor(lead.profile)}.</strong></p>
        <p>${profile.summary}</p>
        <div class="quick-read-grid">
          <div><strong>${scoreOutOf100(lead.score)}</strong><span>Score geral</span></div>
          <div><strong>${primary.label}</strong><span>Tendência predominante</span></div>
          <div><strong>${secondary.label}</strong><span>Tendência de apoio</span></div>
          <div><strong>${lever.label}</strong><span>Principal alavanca de evolução</span></div>
        </div>
        <h3>Como decifrar este resultado</h3>
        <p>Este diagnóstico combina dimensões de liderança com uma leitura comportamental inspirada em DISC. Ele mostra tendências, não rótulos definitivos.</p>
        <p class="result-disclaimer">${diagnosticDisclaimer}</p>
        ${screenChallengeNoteFor(lead)}
        <div class="disc-grid">${disc.map((item) => `<div><strong>${item.key} ${item.label}</strong><span>${item.value}</span><small>${item.style}</small></div>`).join("")}</div>
        <h3>Indicadores complementares</h3>
        ${renderIndicatorGrid(indicators)}
        <h3>Devolutiva comportamental</h3>
        <div class="debrief-grid">
          <div><strong>Como absorve conhecimento</strong><p>${profile.learning}</p></div>
          <div><strong>Desempenho em tarefas</strong><p>${profile.task}</p></div>
          <div><strong>Relacionamento com outros</strong><p>${profile.relationships}</p></div>
          <div><strong>Ambiente favorável</strong><p>${profile.environment}</p></div>
          <div><strong>Reação sob pressão</strong><p>${profile.pressure}</p></div>
          <div><strong>Relação com mudanças</strong><p>${profile.change}</p></div>
          <div><strong>Fatores de afastamento</strong><p>${profile.avoid}</p></div>
          <div><strong>Tomada de decisão</strong><p>${profile.decision}</p></div>
        </div>
        <h3>Dicionário de competências relacionado</h3>
        <div class="competency-list">${renderCompetencyCloud(lead, diagnostic)}</div>
        <h3>Pontos fortes percebidos</h3>
        <ul>${renderList(profile.strengths)}</ul>
        <h3>Riscos comportamentais</h3>
        <ul>${renderList(profile.risks)}<li>${primary.risk}</li></ul>
        <h3>Scores por dimensão</h3>
        <div class="dimension-list">${renderDimensionRows(lead, diagnostic)}</div>
        <h3>Principal oportunidade de evolução</h3>
        <p>Você não precisa perder suas forças para evoluir. O próximo passo é transformar o que já funciona em mais consistência. Neste resultado, a principal alavanca inicial é <strong>${lever.label}</strong>.</p>
        <h3>Plano inicial de desenvolvimento</h3>
        <p>Estas recomendações são geradas automaticamente a partir dos pontos de maior atenção. Elas servem como primeira direção de ação, não como respostas adicionais do participante.</p>
        <ol>${renderList([...profile.recommendations, ...weak.map(({ key }) => recommendations[key])])}</ol>
        ${methodologyBlockFor("leadership")}
        <h3>Perguntas para a próxima conversa</h3>
        <p>Estas perguntas devem ser usadas em uma sessão de devolutiva, mentoria ou diagnóstico aprofundado. O participante não precisa respondê-las para receber este resultado.</p>
        <ol>
          <li>Em quais situações esse perfil ajuda você a gerar resultado mais rápido?</li>
          <li>Qual risco aparece quando você está sob pressão ou cobrança?</li>
          <li>Que comportamento a equipe mais precisa que você fortaleça nos próximos 30 dias?</li>
          <li>Qual indicador mostraria que sua liderança evoluiu de forma concreta?</li>
        </ol>
        ${reflectionBlockFor("leadership")}
      </div>
    </div>`;
}

function renderBusinessResult(lead, diagnostic) {
  const maturity = getMaturityProfile(lead.profile);
  const weak = lowDimensions(lead.dimensions);
  const indicators = getBusinessIndicators(lead.dimensions, lead.score);
  const differential = currentDifferentialFor(lead, diagnostic);
  const lever = evolutionLeverFor(lead, diagnostic);

  return `
    <div class="result-grid">
      <article class="result-card">
        <div class="score-ring" style="--score:${lead.score}%"><strong>${lead.score}</strong></div>
        <p><span class="tag">${displayDiagnosticLabelFor(lead.diagnosticLabel)}</span></p>
        <p><strong>${lead.data.name}</strong><br>${lead.data.company || "Empresa não informada"}<br>${lead.data.role || "Cargo não informado"}</p>
        <p><strong>Score geral:</strong><br>${scoreOutOf100(lead.score)}</p>
        <p><strong>Principal diferencial atual:</strong><br>${differential.label} (${differential.value})</p>
      </article>
      <div class="result-card">
        <h3>Diagnóstico de Maturidade Empresarial</h3>
        <p><strong>${businessSubjectFor(lead)} está no ${displayProfileFor(lead.profile)}.</strong></p>
        <p>${maturity.summary}</p>
        <div class="quick-read-grid">
          <div><strong>${scoreOutOf100(lead.score)}</strong><span>Score geral</span></div>
          <div><strong>${getBand(lead.score).label}</strong><span>Faixa de maturidade</span></div>
          <div><strong>${differential.label}</strong><span>Principal diferencial atual</span></div>
          <div><strong>${lever.label}</strong><span>Principal alavanca de evolução</span></div>
        </div>
        <h3>O que este resultado indica</h3>
        <p>O score geral indica que ${getBand(lead.score).meaning} A leitura mais importante é comparar o que já funciona bem com o que precisa ganhar método para sustentar o próximo salto.</p>
        <h3>Como decifrar este resultado</h3>
        <p>A maturidade empresarial não mede apenas se a empresa vende ou entrega. Ela mostra se existem direção, processos, indicadores, cultura e pessoas preparadas para repetir resultado com menos dependência de improviso.</p>
        <p class="result-disclaimer">${diagnosticDisclaimer}</p>
        ${screenChallengeNoteFor(lead)}
        <h3>Indicadores complementares</h3>
        ${renderIndicatorGrid(indicators)}
        <h3>Dicionário de competências empresariais</h3>
        <div class="competency-list">${renderCompetencyCloud(lead, diagnostic)}</div>
        <h3>Riscos do nível atual</h3>
        <ul>${renderList(maturity.risks)}</ul>
        <h3>Scores por dimensão</h3>
        <div class="dimension-list">${renderDimensionRows(lead, diagnostic)}</div>
        <h3>Principal alavanca de evolução</h3>
        <p>O principal foco inicial é <strong>${lever.label}</strong>. Trabalhar essa dimensão com método pode reduzir dependências, aumentar previsibilidade e transformar boas práticas em padrão replicável.</p>
        <h3>Prioridades recomendadas</h3>
        <p>Estas prioridades são sugestões automáticas para orientar a primeira conversa e o plano de ação. Elas não são novas perguntas do diagnóstico.</p>
        <ol>${renderList([...maturity.priorities, ...weak.map(({ key }) => recommendations[key])])}</ol>
        ${methodologyBlockFor("business")}
        <h3>Roteiro para a próxima conversa consultiva</h3>
        <p>Este roteiro é para a reunião seguinte, quando você quiser aprofundar causas, contexto, urgências e oportunidades comerciais.</p>
        <ol>
          <li>Qual dimensão mais limita crescimento hoje: vendas, pessoas, atendimento ou gestão?</li>
          <li>Quais indicadores são acompanhados semanalmente e quais geram decisão?</li>
          <li>Onde a empresa ainda depende de pessoas específicas para funcionar bem?</li>
          <li>Que rotina precisaria existir nos próximos 90 dias para subir um nível de maturidade?</li>
        </ol>
        ${reflectionBlockFor("business")}
      </div>
    </div>`;
}

function renderResult(lead) {
  const diagnostic = diagnostics[lead.diagnostic];
  const body = lead.diagnostic === "leadership" ? renderLeadershipResult(lead, diagnostic) : renderBusinessResult(lead, diagnostic);
  const displayName = displayNameFor(lead);
  const reportOwner = reportOwnerFor(lead);
  const resultProfile = displayProfileFor(lead.profile);
  const resultHeading =
    lead.diagnostic === "business"
      ? `${displayName}, este é o diagnóstico de maturidade`
      : `${displayName}, aqui está o seu diagnóstico`;
  resultView.innerHTML = `
    <section class="pdf-cover">
      <div class="pdf-brand">Juvenill <span>Ribêiro.</span></div>
      <p class="pdf-kicker">Diagnóstico de Liderança e Performance</p>
      <h1>Relatório consultivo de ${reportOwner}</h1>
      <p>Este documento foi preparado para transformar respostas em clareza, prioridades e próximos passos práticos.</p>
      <div class="pdf-cover-grid">
        <div><strong>${scoreOutOf100(lead.score)}</strong><span>Score geral</span></div>
        <div><strong>${resultProfile}</strong><span>Resultado identificado</span></div>
        <div><strong>${displayDiagnosticLabelFor(lead.diagnosticLabel)}</strong><span>Diagnóstico aplicado</span></div>
      </div>
    </section>
    <header class="section-header">
      <div>
        <p class="eyebrow">Resultado consultivo</p>
        <h2>${resultHeading}</h2>
        <p class="result-subtitle">O resultado identificado foi <strong>${resultProfile}</strong>. Gere um único PDF com o resultado e o guia de interpretação incorporado ao final do documento.</p>
      </div>
      <div class="admin-actions">
        <button class="secondary-action" onclick="window.print()" type="button">Gerar PDF completo</button>
        <button class="primary-action" data-screen="diagnostics" type="button">Novo diagnóstico</button>
      </div>
    </header>
    <div class="screen-result-content">${body}</div>
    ${renderPrintReport(lead, diagnostic, displayName)}
    <section class="next-step-panel">
      <h3>Depois do resultado</h3>
      <p>Este diagnóstico gera um documento único: primeiro vem o resultado individual ou empresarial, e em seguida o guia de interpretação para facilitar a leitura e apoiar a próxima conversa consultiva.</p>
      <div class="intro-actions">
        <button class="primary-action" onclick="window.print()" type="button">Gerar PDF completo</button>
      </div>
    </section>
  `;
}

function renderAdmin() {
  if (!isAdminAuthenticated()) return;
  const query = (adminSearch.value || "").toLowerCase();
  const leads = getLeads().filter((lead) => {
    const text = `${lead.data.name} ${lead.data.company} ${lead.data.challenge} ${displayDiagnosticLabelFor(lead.diagnosticLabel)} ${displayProfileFor(lead.profile)}`.toLowerCase();
    return text.includes(query);
  });
  const leadership = leads.filter((lead) => lead.diagnostic === "leadership").length;
  const business = leads.filter((lead) => lead.diagnostic === "business").length;
  const average = leads.length ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0;

  adminDashboard.innerHTML = `
    <div class="admin-stat"><strong>${leads.length}</strong><span>Leads</span></div>
    <div class="admin-stat"><strong>${leadership}</strong><span>Liderança</span></div>
    <div class="admin-stat"><strong>${business}</strong><span>Empresarial</span></div>
    <div class="admin-stat"><strong>${average}</strong><span>Score médio</span></div>
  `;

  leadTable.innerHTML =
    leads
      .map((lead) => {
        const date = new Date(lead.createdAt).toLocaleString("pt-BR");
        return `<tr>
          <td>${date}</td>
          <td><strong>${lead.data.name}</strong><br>${lead.data.email}<br>${lead.data.phone}</td>
          <td>${lead.data.company || "-"}</td>
          <td>${displayDiagnosticLabelFor(lead.diagnosticLabel)}</td>
          <td><span class="tag">${displayProfileFor(lead.profile)}</span></td>
          <td>${lead.score}</td>
          <td><button class="secondary-action" data-result-id="${lead.id}" type="button">Abrir</button></td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="7">Nenhum lead registrado ainda.</td></tr>`;
}

function exportCsv() {
  if (!isAdminAuthenticated()) {
    setScreen("admin");
    updateRouteForScreen("admin");
    return;
  }

  const leads = getLeads();
  const header = ["Data", "Nome", "Email", "WhatsApp", "Empresa", "Cargo", "Principal desafio", "Diagnóstico", "Resultado", "Score"];
  const rows = leads.map((lead) => [
    new Date(lead.createdAt).toLocaleString("pt-BR"),
    lead.data.name,
    lead.data.email,
    lead.data.phone,
    lead.data.company,
    lead.data.role,
    lead.data.challenge,
    displayDiagnosticLabelFor(lead.diagnosticLabel),
    displayProfileFor(lead.profile),
    lead.score
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leads-diagnostico-jr.csv";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    const screen = screenButton.dataset.screen;
    setScreen(screen);
    updateRouteForScreen(screen);
  }

  const resultButton = event.target.closest("[data-result-id]");
  if (resultButton) {
    const lead = getLeads().find((item) => item.id === resultButton.dataset.resultId);
    if (lead) {
      renderResult(lead);
      setScreen("result");
    }
  }
});

form.addEventListener("input", (event) => {
  if (event.target.name === "diagnostic") renderQuestions();
  saveDraft();
});

questionList.addEventListener("change", () => {
  updateProgress();
  saveDraft();
});

document.querySelector("#finish-assessment").addEventListener("click", generateResult);
document.querySelector("#clear-draft").addEventListener("click", () => {
  localStorage.removeItem(DRAFT_KEY);
  form.reset();
  renderQuestions();
});
document.querySelector("#export-csv").addEventListener("click", exportCsv);
adminSearch.addEventListener("input", renderAdmin);
adminLoginForm.addEventListener("submit", handleAdminLogin);
adminLogout.addEventListener("click", logoutAdmin);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme") ? "Modo escuro" : "Modo claro";
});
window.addEventListener("hashchange", applyRouteFromHash);

syncAdminAccess();
restoreDraft();
renderQuestions();
applyRouteFromHash();

// Restaura a sessão do admin (caso já esteja logado pelo Supabase)
if (supabaseClient) {
  supabaseClient.auth.getSession().then(async ({ data }) => {
    if (data && data.session) {
      adminAuthed = true;
      await loadRemoteLeads();
      syncAdminAccess();
      if (location.hash.toLowerCase() === "#admin") setScreen("admin");
    }
  });
}
