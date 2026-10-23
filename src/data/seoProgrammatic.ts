export interface SeoProgrammaticPage {
  slug: string;
  toolType: 'shortener' | 'downloader' | 'bio';
  title: string;
  h1: string;
  description: string;
  focusText: string;
  ctaText: string;
  ctaLink: string;
  steps: {
    title: string;
    desc: string;
  }[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const seoPagesData: Record<string, SeoProgrammaticPage> = {
  'encurtador-de-url': {
    slug: 'encurtador-de-url',
    toolType: 'shortener',
    title: 'Encurtador de URL Grátis e Rápido (wnet.me) | NutURL',
    h1: 'Encurtador de Links Inteligente com Domínio Ultra-Curto',
    description: 'Encurte links longos gratuitamente com o domínio ultra-curto oficial wnet.me. Monitore cliques, geo-localização e aumente seu CTR com máxima segurança.',
    focusText: 'Destaque para links wnet.me com estatísticas de cliques em tempo real, sem expiração forçada e com carregamento instantâneo para suas campanhas.',
    ctaText: 'Criar Minha Conta Grátis no NutURL',
    ctaLink: '/login',
    steps: [
      {
        title: '1. Cole sua URL Longa',
        desc: 'Insira o link de destino que deseja encurtar no campo da ferramenta acima.'
      },
      {
        title: '2. Gere o Link wnet.me',
        desc: 'Clique em encurtar para receber instantaneamente um link limpo de apenas 7 caracteres.'
      },
      {
        title: '3. Compartilhe e Monitore',
        desc: 'Envie nas redes sociais, WhatsApp e acompanhe estatísticas de cliques em tempo real.'
      }
    ],
    faq: [
      {
        q: 'O encurtador de links com wnet.me é gratuito?',
        a: 'Sim, o encurtador é 100% gratuito para começar. Você pode encurtar URLs e acompanhar métricas diretamente na plataforma NutURL.'
      },
      {
        q: 'Por que usar o domínio wnet.me em vez de outros encurtadores?',
        a: 'O wnet.me é um domínio ultra-curto e limpo, livre de bloqueios frequentes de spam, o que aumenta a taxa de cliques (CTR) no WhatsApp, SMS e anúncios.'
      }
    ]
  },

  'encurtador-link-whatsapp': {
    slug: 'encurtador-link-whatsapp',
    toolType: 'shortener',
    title: 'Encurtador de Link para WhatsApp Grátis | NutURL',
    h1: 'Encurte e Personalize Links para WhatsApp com Domínio wnet.me',
    description: 'Transforme links longos de WhatsApp em URLs curtas e confiáveis (wnet.me/seu-link). Aumente suas conversões em vendas no X1, tráfego pago e redes sociais.',
    focusText: 'Projetado especialmente para afiliados, infoprodutores e times comerciais que precisam de links curtos confiáveis no WhatsApp que não espantem os clientes.',
    ctaText: 'Começar a Encurtar Links para WhatsApp',
    ctaLink: '/login',
    steps: [
      {
        title: '1. Gere ou Cole o Link do WhatsApp',
        desc: 'Cole o link api.whatsapp.com ou wa.me com seu número e mensagem pré-definida.'
      },
      {
        title: '2. Encurte com wnet.me',
        desc: 'Obtenha um link curto, limpo e profissional pronto para colar na bio do Instagram ou campanhas.'
      },
      {
        title: '3. Acompanhe a Taxa de Conversão',
        desc: 'Veja exatamente quantos cliques vieram de cada campanha em tempo real.'
      }
    ],
    faq: [
      {
        q: 'Funciona com links gerados pelo Gerador de Link do WhatsApp?',
        a: 'Sim! Qualquer link padrão wa.me ou api.whatsapp.com com mensagens personalizadas é suportado perfeitamente.'
      },
      {
        q: 'O link do WhatsApp encurtado abre o aplicativo direto?',
        a: 'Sim, quando o usuário clica no link wnet.me, o aplicativo do WhatsApp é acionado instantaneamente no celular do cliente.'
      }
    ]
  },

  'link-na-bio': {
    slug: 'link-na-bio',
    toolType: 'bio',
    title: 'Criar Link na Bio Grátis (Alternativa ao Linktree) | NutURL',
    h1: 'Crie sua Página de Links na Bio em Menos de 1 Minuto',
    description: 'Reúna todos os seus links, redes sociais, produtos e contatos em uma página rápida e personalizável (nuturl.com/@voce). A melhor alternativa ao Linktree.',
    focusText: 'Tenha uma página de Link na Bio que carrega em milissegundos, com temas elegantes, sem marcas d’água intrusivas e integrada ao encurtador wnet.me e downloader de vídeos.',
    ctaText: 'Criar Minha Página de Bio Grátis',
    ctaLink: '/login',
    steps: [
      {
        title: '1. Escolha seu Nome de Usuário',
        desc: 'Garanta seu endereço exclusivo (nuturl.com/@seunome) antes que outra pessoa registre.'
      },
      {
        title: '2. Personalize com Temas Incríveis',
        desc: 'Adicione foto de perfil, biografia, redes sociais e botões ilimitados com temas pré-configurados.'
      },
      {
        title: '3. Coloque na Bio do Instagram e TikTok',
        desc: 'Compartilhe uma única URL profissional em todas as suas redes para centralizar sua audiência.'
      }
    ],
    faq: [
      {
        q: 'O NutURL substitui o Linktree?',
        a: 'Sim! Com o NutURL você cria uma página de Bio elegante com temas modernos, botões ilimitados e ainda ganha de bônus o encurtador wnet.me e o downloader de mídias.'
      },
      {
        q: 'Posso remover a marca d\'água?',
        a: 'Sim, os assinantes do plano Premium contam com a opção de ocultar completamente qualquer menção ao NutURL e usar links personalizados.'
      }
    ]
  },

  'baixar-videos': {
    slug: 'baixar-videos',
    toolType: 'downloader',
    title: 'Downloader de Vídeos Online Grátis e Sem Anúncios | NutURL',
    h1: 'Baixe Vídeos e Mídias de Sites em Alta Qualidade',
    description: 'Baixe vídeos, áudios e imagens do TikTok, Instagram Reels, YouTube Shorts e outras plataformas sem marcas d’água e livre de pop-ups invasivos.',
    focusText: 'Uma ferramenta limpa, rápida e segura para criadores de conteúdo baixarem referências e reutilizarem mídias sem anúncios suspeitos.',
    ctaText: 'Criador de Conteúdo? Crie sua Bio no NutURL',
    ctaLink: '/login',
    steps: [
      {
        title: '1. Copie o Link do Vídeo',
        desc: 'Copie a URL do vídeo no TikTok, Instagram, YouTube Shorts ou Twitter/X.'
      },
      {
        title: '2. Cole no Downloader NutURL',
        desc: 'Cole o link no campo acima e aguarde o processamento automático.'
      },
      {
        title: '3. Baixe em Alta Definição',
        desc: 'Selecione a resolução desejada ou baixe apenas o áudio MP3 em um clique.'
      }
    ],
    faq: [
      {
        q: 'O download de vídeos tem limite de uso?',
        a: 'Não! Você pode baixar quantos vídeos e mídias precisar para seus projetos e referências.'
      },
      {
        q: 'Preciso instalar algum aplicativo ou extensão?',
        a: 'Não, tudo funciona 100% online direto pelo seu navegador no celular ou computador.'
      }
    ]
  }
};
