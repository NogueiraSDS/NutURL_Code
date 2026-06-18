'use client';

import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import styles from './privacy.module.css';

export default function PrivacyPolicy() {
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
        {locale === 'pt' ? (
          <>
            <h1 className={styles.title}>Política de Privacidade e Cookies</h1>
            <p className={styles.meta}>Última atualização: 18 de Junho de 2026</p>

            <section className={styles.section}>
              <h2>1. Informações Gerais</h2>
              <p>
                Esta Política de Privacidade descreve como o <strong>NutURL</strong> coleta, usa, compartilha e protege as informações dos usuários que utilizam nossa plataforma de encurtamento de links, agregador de links na bio e serviços relacionados. Nós operamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) no Brasil e com o Regulamento Geral de Proteção de Dados (GDPR) na União Europeia.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Coleta de Dados e Finalidades</h2>
              <p>Nós coletamos as seguintes categorias de informações:</p>
              <ul>
                <li><strong>Informações da Conta:</strong> Nome, endereço de e-mail e identificadores de autenticação (via Firebase Auth) fornecidos por você ao se cadastrar.</li>
                <li><strong>Dados de Links e Mídias:</strong> URLs que você encurta, aliases personalizados, títulos e links de redes sociais que você configura para sua página de perfil.</li>
                <li><strong>Métricas de Acesso (Analytics):</strong> Cliques nos seus links e visitas ao seu perfil público (registrando data, hora e dados de referenciador anônimos) para exibição de estatísticas no seu dashboard.</li>
              </ul>
            </section>

            <section className={sectionStyle(styles)}>
              <h2>3. Cookies e Google AdSense</h2>
              <p>
                Utilizamos cookies e tecnologias de rastreamento semelhantes para garantir o funcionamento técnico da plataforma, analisar o tráfego do site e exibir anúncios.
              </p>
              <div className={styles.adsBox}>
                <h3>Divulgação de Anúncios de Terceiros:</h3>
                <p>
                  O <strong>Google AdSense</strong> e outros parceiros de publicidade de terceiros utilizam cookies para veicular anúncios com base em visitas anteriores dos usuários a este ou a outros sites na Internet.
                </p>
                <p>
                  O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para os usuários com base nas visitas feitas a seus sites e/ou a outros sites na Internet.
                </p>
                <p>
                  <strong>Como desativar a publicidade personalizada:</strong> Você pode optar por desativar a publicidade personalizada acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Configurações de anúncios do Google</a>. Alternativamente, você pode desativar o uso de cookies de terceiros para publicidade personalizada visitando <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>4. Direitos dos Usuários sob a LGPD</h2>
              <p>
                Em conformidade com a LGPD, você possui os seguintes direitos relativos aos seus dados pessoais:
              </p>
              <ul>
                <li>Confirmar a existência de tratamento dos seus dados.</li>
                <li>Acessar seus dados pessoais e solicitar correção de dados incompletos, inexatos ou desatualizados.</li>
                <li>Solicitar a exclusão definitiva dos seus dados (deletando sua conta nas configurações do dashboard).</li>
                <li>Revogar o consentimento de cookies a qualquer momento limpando os cookies do seu navegador.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>5. Compartilhamento e Segurança de Dados</h2>
              <p>
                Nós não vendemos nem alugamos seus dados pessoais a terceiros. As informações de tráfego são processadas para fins analíticos, e informações agregadas anônimas podem ser compartilhadas com parceiros de anúncios como o Google AdSense. Empregamos firewalls e criptografia SSL para garantir a integridade das suas informações.
              </p>
            </section>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Privacy & Cookies Policy</h1>
            <p className={styles.meta}>Last updated: June 18, 2026</p>

            <section className={styles.section}>
              <h2>1. General Information</h2>
              <p>
                This Privacy Policy describes how <strong>NutURL</strong> collects, uses, shares, and protects information from users of our link-shortening platform, link-in-bio aggregator, and related services. We operate in full compliance with the General Data Protection Regulation (GDPR) in the European Union and the Brazilian General Data Protection Law (LGPD - Law No. 13,709/2018).
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Data Collection and Purposes</h2>
              <p>We collect the following categories of information:</p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, and authentication identifiers (via Firebase Auth) provided by you during registration.</li>
                <li><strong>Link & Media Data:</strong> URLs you shorten, custom aliases, titles, and social network links you configure for your profile page.</li>
                <li><strong>Access Metrics (Analytics):</strong> Clicks on your links and visits to your public profile (recording date, time, and anonymous referrer data) to compile stats for your dashboard.</li>
              </ul>
            </section>

            <section className={sectionStyle(styles)}>
              <h2>3. Cookies and Google AdSense</h2>
              <p>
                We use cookies and similar tracking technologies to ensure the technical operation of the platform, analyze site traffic, and display advertising.
              </p>
              <div className={styles.adsBox}>
                <h3>Third-Party Ad Disclosure:</h3>
                <p>
                  <strong>Google AdSense</strong> and other third-party advertising partners use cookies to serve ads based on users' prior visits to this or other websites on the Internet.
                </p>
                <p>
                  Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to your sites and/or other sites on the Internet.
                </p>
                <p>
                  <strong>How to opt-out of personalized advertising:</strong> You can choose to opt out of personalized ads by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>. Alternatively, you can opt out of third-party vendors' cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>4. User Rights under GDPR & LGPD</h2>
              <p>
                In compliance with GDPR and LGPD, you possess the following rights regarding your personal data:
              </p>
              <ul>
                <li>Confirm the existence of processing of your data.</li>
                <li>Access your personal data and request corrections of incomplete or inaccurate data.</li>
                <li>Request permanent deletion of your data (by deleting your account in the dashboard settings).</li>
                <li>Withdraw your cookie consent at any time by clearing your browser cookies.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>5. Sharing and Data Security</h2>
              <p>
                We do not sell or rent your personal data to third parties. Access traffic metrics are processed for analytics, and anonymized aggregate data may be shared with ad partners like Google AdSense. We deploy SSL encryption and secure firewalls to ensure data safety.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// Helper to keep CSS modules simple
function sectionStyle(styles: any) {
  return styles.section;
}
