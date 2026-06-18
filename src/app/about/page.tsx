'use client';

import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import styles from '@/app/privacy/privacy.module.css';

export default function AboutUs() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* Header buttons */}
      <div className={styles.topNav}>
        <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className={styles.navBtn}>
          {locale === 'pt' ? '🇺🇸 English' : '🇧🇷 Português'}
        </button>
        <button onClick={handleBack} className={styles.navBtn}>
          {locale === 'pt' ? '← Voltar para Home' : '← Back to Home'}
        </button>
      </div>

      <div className={`glass ${styles.card}`}>
        <h1 className={styles.title}>{t('about.title') || 'Sobre o NutURL'}</h1>
        <p className={styles.meta} style={{ marginBottom: '2rem' }}>
          {t('about.subtitle') || 'A evolução da gestão de links rápidos e páginas profissionais na bio.'}
        </p>

        {locale === 'pt' ? (
          <>
            <section className={styles.section}>
              <h2>Nossa Missão</h2>
              <p>
                O <strong>NutURL</strong> nasceu com um propósito claro: simplificar a forma como criadores de conteúdo, influenciadores, profissionais liberais e empresas compartilham sua presença digital. Nós acreditamos que um link não deve ser apenas uma URL fria, mas sim um canal inteligente de conexão, branding e conversão.
              </p>
              <p>
                Nossa missão é democratizar ferramentas premium de gestão de links, oferecendo encurtamento rápido com estatísticas robustas e páginas de destino de altíssimo nível estético sem qualquer complexidade técnica.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Por Que Escolher o NutURL?</h2>
              <p>
                Diferente de encurtadores genéricos e geradores de link na bio tradicionais que oferecem designs estáticos e sem graça, nós focamos na excelência visual e na liberdade de customização:
              </p>
              <ul>
                <li><strong>Estética Premium:</strong> Entregamos presets de design incríveis como Glassmorphism (efeito vidro fosco), Aurora Glow (gradientes dinâmicos) e Cyberpunk, permitindo que sua página reflita sua verdadeira identidade de marca.</li>
                <li><strong>Monetização & Flexibilidade:</strong> Usuários do plano gratuito contam com redirecionamentos monetizados com anúncios rápidos e limpos, enquanto assinantes premium contam com redirecionamento direto ultra veloz e aliases customizados.</li>
                <li><strong>Decisões baseadas em Dados:</strong> Nosso dashboard integrado fornece estatísticas precisas em tempo real sobre cliques de links e visitas de página para guiar sua estratégia de tráfego.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Nossa História e Tecnologia</h2>
              <p>
                Desenvolvido por uma equipe de entusiastas de marketing e tecnologia, o NutURL foi construído utilizando as tecnologias de ponta do desenvolvimento web moderno, garantindo velocidade de carregamento instantânea em celulares (onde ocorre mais de 90% do tráfego de redes sociais) e segurança robusta de dados em conformidade com as diretrizes da LGPD.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className={styles.section}>
              <h2>Our Mission</h2>
              <p>
                <strong>NutURL</strong> was born with a clear purpose: to simplify how digital creators, influencers, freelancers, and businesses share their digital footprint. We believe that a link should not be just a cold string of text, but a smart bridge for connection, branding, and conversion.
              </p>
              <p>
                Our mission is to democratize premium link management tools, providing rapid shortening with robust analytics and high-end aesthetic landing pages without any technical complexity.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Why Choose NutURL?</h2>
              <p>
                Unlike generic URL shorteners and basic link-in-bio services that offer static, bland layouts, we focus on visual excellence and customization freedom:
              </p>
              <ul>
                <li><strong>Premium Aesthetics:</strong> We deliver cutting-edge presets such as Glassmorphism, Aurora Glow, and Cyberpunk, allowing your landing page to mirror your actual brand identity.</li>
                <li><strong>Monetization & Flexibility:</strong> Free tier users benefit from clean, monetized redirect pages, while premium members enjoy ultra-fast direct routing and customized aliases.</li>
                <li><strong>Data-Driven Insights:</strong> Our integrated analytics dashboard delivers real-time statistics on link clicks and profile page views to inform your digital strategy.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Our Story & Technology</h2>
              <p>
                Developed by a group of passionate marketers and engineers, NutURL was built utilizing modern web tech, securing lightning-fast loading speeds on mobile devices (where over 90% of social media traffic lives) and secure data processing in full compliance with global privacy standards.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
