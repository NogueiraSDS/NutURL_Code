# Especificação de Implementação: Reformulação de Hero, Copywriting & SEO Programático (NutURL.com & wnet.me)

> **Instrução para o Agente (Antigravity):** 
> Analise a estrutura atual do projeto **NutURL (`nuturl.com`)** e implemente as alterações detalhadas abaixo. O objetivo é otimizar a conversão da Landing Page principal (foco na tríade: Link na Bio, Encurtador via domínio `wnet.me` e Downloader de Mídias), implementar SEO técnico avançado (Meta Tags, Open Graph, JSON-LD) e estruturar rotas de SEO Programático para atrair tráfego orgânico de alta intenção. Preserve o Design System, paleta de cores e componentes de UI existentes no projeto.

---

## 1. Reformulação da Landing Page Principal (`nuturl.com`)

### 1.1. Hero Section (Acima da Dobra)
Substitua ou atualize os textos da seção principal (Hero) para refletir a proposta de valor unificada:

* **Badge / Tag Superior:** `🚀 3 Ferramentas Essenciais em 1 Só Plataforma`
* **Headline (H1):** `Sua Bio, Links Ultra-Curtos e Download de Vídeos em um só lugar.`
* **Subheadline (Descrição):** `Substitua múltiplas assinaturas. Crie sua página de links de alta conversão, encurte URLs com nosso domínio exclusivo (wnet.me) e baixe vídeos das redes sociais sem anúncios invasivos.`
* **CTAs Principais:**
  * **Botão Primário:** `Criar Minha Conta Grátis` (Destaque visual máximo)
  * **Botão Secundário:** `Testar Ferramentas Agora` (Scroll suave para um componente interativo rápido ou abas das ferramentas)
* **Elemento Interativo no Hero (Quick-Action Tabs):**
  * Se já existir um input rápido na Home, estruture-o em **3 Abas (Tabs)** rápidas para engajamento imediato (Product-Led Growth):
    1. **🔗 Encurtar URL (`wnet.me`):** Input para colar URL longa $\rightarrow$ Gera preview `wnet.me/xyz`.
    2. **📥 Baixar Vídeo:** Input para colar link (TikTok/Reels/Shorts) $\rightarrow$ Botão "Baixar Mídia".
    3. **📱 Criar Bio:** Input prefixado `nuturl.com/` + `seu-nome` $\rightarrow$ Botão "Reivindicar Link".

---

### 1.2. Seção: Os 3 Pilares (Features Grid)
Atualize a seção de funcionalidades destacando a sinergia do ecossistema:

1. **Agrupador de Links (Link na Bio):**
   * **Título (H3):** `Uma Bio que realmente converte`
   * **Texto:** `Centralize seus links importantes, redes sociais e produtos em uma página rápida e personalizável (nuturl.com/voce). Sem marcas d'água intrusivas e com carregamento instantâneo.`
2. **Encurtador Inteligente (`wnet.me`):**
   * **Título (H3):** `Links ultra-curtos com domínio dedicado (wnet.me)`
   * **Texto:** `Aumente sua taxa de cliques (CTR) no WhatsApp, SMS e campanhas de tráfego pago com links curtos, limpos e confiáveis usando nosso domínio exclusivo wnet.me com rastreamento de cliques em tempo real.`
3. **Downloader de Mídias:**
   * **Título (H3):** `Baixe vídeos e referências em segundos`
   * **Texto:** `Salve vídeos, áudios e conteúdos das principais plataformas em alta qualidade. Uma ferramenta limpa, rápida e livre daqueles pop-ups irritantes para agilizar a rotina de criadores de conteúdo.`

---

### 1.3. Seção de Comparação (Por que escolher o NutURL?)
Adicione uma seção ou tabela comparativa simples demonstrando a economia e praticidade:
* **Abordagem Tradicional:** Pagar em dólar por um Linktree + usar encurtadores cheios de limites + acessar sites duvidosos de download cheios de vírus e pop-ups.
* **Com o NutURL:** Tudo centralizado no mesmo painel, seguro, rápido e pensado para criadores, afiliados e gestores de tráfego.

---

### 1.4. FAQ Otimizado para SEO (Perguntas Frequentes)
Implemente ou atualize o componente de Accordion na Home com as seguintes perguntas (essenciais para *Rich Snippets* no Google):

1. **O que é o NutURL?**
   * *Resposta:* O NutURL é uma plataforma tudo-em-um para criadores digitais, afiliados e empresas. Reunimos criador de página de links para a bio (alternativa ao Linktree), encurtador de URLs com domínio curto exclusivo (`wnet.me`) e ferramenta de download de vídeos e mídias em um único painel.
2. **O domínio wnet.me é seguro? Quem é o dono?**
   * *Resposta:* Sim, o domínio `wnet.me` é o encurtador oficial operado exclusivamente pela plataforma NutURL (`nuturl.com`). Utilizamos um domínio separado e ultra-curto de apenas 7 caracteres para garantir que seus links ocupem menos espaço e tenham maior taxa de cliques no WhatsApp, redes sociais e SMS.
3. **O NutURL é gratuito?**
   * *Resposta:* Sim! Você pode criar sua página de bio, encurtar links com `wnet.me` e utilizar o downloader gratuitamente. Também oferecemos recursos avançados para quem busca métricas detalhadas e personalização extra.
4. **Como verificar para onde um link wnet.me aponta antes de clicar?**
   * *Resposta:* Basta acessar a página de verificação no NutURL ou adicionar um sinal de `+` ao final do link curto (`wnet.me/codigo+`) para visualizar o destino final com total segurança.

---

## 2. SEO Técnico & Metadados Globais (`nuturl.com`)

Configure as Meta Tags padrão e dados estruturados (JSON-LD) no `<head>` da aplicação principal:

### 2.1. Meta Tags da Home
```html
<title>NutURL — Link na Bio, Encurtador de URL (wnet.me) e Downloader de Vídeos</title>
<meta name="description" content="A plataforma completa para criadores e afiliados: crie sua página de Link na Bio grátis, encurte links com o domínio exclusivo wnet.me e baixe vídeos sem anúncios." />
<meta name="keywords" content="link na bio, alternativa ao linktree, encurtador de url, encurtador de link whatsapp, wnet.me, nuturl, baixar videos, downloader de midia" />
<link rel="canonical" href="https://nuturl.com/" />

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://nuturl.com/" />
<meta property="og:title" content="NutURL — Bio Link, Encurtador (wnet.me) e Downloader em 1 só lugar" />
<meta property="og:description" content="Crie sua página de links, encurte URLs com domínio ultra-curto (wnet.me) e baixe vídeos das redes sociais rapidamente." />
<meta property="og:site_name" content="NutURL" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="NutURL — Bio Link, Encurtador (wnet.me) e Downloader" />
<meta name="twitter:description" content="Substitua 3 ferramentas por 1. Link na Bio, encurtador wnet.me e download de vídeos sem anúncios." />
```

### 2.2. Dados Estruturados (Schema.org JSON-LD)
Injete este script JSON-LD na Home page para indexação rica no Google (`SoftwareApplication` + `FAQPage`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "NutURL",
      "url": "https://nuturl.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Plataforma unificada de Agrupador de Links (Link na Bio), Encurtador de URLs (via domínio wnet.me) e Downloader de mídias sociais.",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "BRL"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "O que é o NutURL?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O NutURL é uma plataforma tudo-em-um que reúne criador de Link na Bio, encurtador de URLs com domínio exclusivo (wnet.me) e downloader de mídias sociais."
          }
        },
        {
          "@type": "Question",
          "name": "O domínio wnet.me é seguro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim, o wnet.me é o domínio oficial de links curtos da plataforma NutURL (nuturl.com), projetado para oferecer links ultra-curtos e seguros."
          }
        }
      ]
    }
  ]
}
```

---

## 3. SEO Programático: Rotas de Ferramentas (Topo de Funil)

> **Instrução Arquitetural:** 
> Crie páginas estáticas/SSR (ou rotas dedicadas indexáveis no `sitemap.xml`) que reutilizem os componentes de **Encurtador** e **Downloader**, mas com `<h1>`, `<title>`, `<meta description>` e textos explicativos ("Como funciona em 3 passos") customizados para capturar buscas exatas no Google.

Implemente um template reutilizável abastecido por um dicionário/configuração de rotas com os seguintes *slugs*:

### 3.1. Rotas para o Downloader e Encurtador
| URL Slug | `<title>` (SEO) | `<h1>` da Página | Foco da Copy / CTA Pós-Uso |
| :--- | :--- | :--- | :--- |
| `/encurtador-de-url` | Encurtador de URL Grátis e Rápido (wnet.me) \| NutURL | Encurtador de Links Inteligente com Domínio Ultra-Curto | Destaque para links `wnet.me` com estatísticas de cliques. |
| `/encurtador-link-whatsapp` | Encurtador de Link para WhatsApp Grátis \| NutURL | Encurte e Personalize Links para WhatsApp | Foco em afiliados e vendas no X1 com links `wnet.me` confiáveis. |
| `/link-na-bio` | Criar Link na Bio Grátis (Alternativa ao Linktree) \| NutURL | Crie sua Página de Links na Bio em Menos de 1 Minuto | Comparativo mostrando a vantagem de ter encurtador e downloader juntos. |
| `/baixar-videos` | Downloader de Vídeos Online Grátis e Sem Anúncios \| NutURL | Baixe Vídeos e Mídias de Sites em Alta Qualidade | Após iniciar o download, exibir banner: *"Criador de conteúdo? Crie sua página de bio grátis no NutURL"*. |

*(Nota: Caso o downloader suporte plataformas específicas, gere páginas dedicadas adicionais baseadas nas plataformas suportadas pelo backend, mantendo o mesmo template limpo).*

---

## 4. Integração de Crescimento entre `wnet.me` e `nuturl.com` (Growth Loops)

Implemente as seguintes regras de roteamento no controlador/servidor que gerencia os redirecionamentos do domínio `wnet.me`:

1. **Redirecionamento da Raiz (`GET wnet.me/`):**
   * Quando um usuário acessar `https://wnet.me` sem nenhum código de link curto na rota, redirecione (`301` ou `302`) para `https://nuturl.com/?utm_source=wnet_root&utm_medium=referral`.
   * *Opcional na UI do NutURL:* Se a URL tiver `?utm_source=wnet_root`, exiba um pequeno banner/toast amigável no topo: *"👋 Você veio pelo wnet.me! Este é o encurtador oficial do NutURL. Crie seus próprios links curtos gratuitamente abaixo."*
2. **Modo de Inspeção de Link Seguro (`GET wnet.me/:code+`):**
   * Se o `code` terminar com o caractere `+` (ex.: `wnet.me/abc123+`), **não** faça o redirecionamento imediato.
   * Redirecione o usuário para `https://nuturl.com/preview/:code` (ou renderize uma página de inspeção) exibindo:
     * A URL de destino original completa.
     * Título da página de destino.
     * Botão: **"Prosseguir para o site"**.
     * Card de conversão (PLG): **"Este link foi encurtado com o NutURL (wnet.me). Crie links curtos, páginas de bio e baixe vídeos gratuitamente!"** com botão para cadastro.
3. **Página de Link Não Encontrado / Expirado (`404` no `wnet.me`):**
   * Se um código `wnet.me/:code` não existir no banco de dados, redirecione para `https://nuturl.com/link-nao-encontrado` contendo uma busca/ferramenta rápida e um convite para conhecer a plataforma, evitando uma tela de erro morta.
4. **Rodapé Viral nas Páginas de Agrupador de URL (`nuturl.com/:username`):**
   * No final de todas as páginas públicas de Link na Bio dos usuários (no plano gratuito), garanta a presença de um badge discreto, moderno e clicável:
   * Texto: `⚡ Criado com NutURL — Crie o seu grátis` apontando para `https://nuturl.com/?utm_source=bio_footer&utm_campaign=viral_loop`.

---

## 5. Checklist Final de Entrega (Para o Agente)
- [ ] Atualizar textos do Hero, Features e FAQ na Landing Page principal (`nuturl.com`).
- [ ] Inserir Meta Tags completas (SEO, Open Graph, Twitter) e JSON-LD (`SoftwareApplication` + `FAQPage`).
- [ ] Criar/atualizar `sitemap.xml` e `robots.txt` garantindo que as páginas da plataforma sejam indexadas, mas evitando indexar redirecionamentos dinâmicos privados se não desejado.
- [ ] Implementar as rotas de SEO Programático (`/encurtador-de-url`, `/link-na-bio`, `/baixar-videos`, etc.).
- [ ] Configurar os fluxos de redirecionamento inteligente do `wnet.me` (Raiz, Preview com `+` e fallback de `404`) apontando para o `nuturl.com`.