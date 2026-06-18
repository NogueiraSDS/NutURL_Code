'use client';

import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import styles from '@/app/privacy/privacy.module.css';

export default function TermsOfUse() {
  const { locale, setLocale } = useI18n();
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
            <h1 className={styles.title}>Termos de Uso</h1>
            <p className={styles.meta}>Última atualização: 18 de Junho de 2026</p>

            <section className={styles.section}>
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o <strong>NutURL</strong>, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer termo ou condição, não deverá utilizar nossos serviços.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Cadastro e Segurança da Conta</h2>
              <p>
                Para utilizar determinados recursos, como a criação de páginas de Link na Bio, acesso ao dashboard analítico ou encurtamento com aliases personalizados, você precisará se cadastrar na plataforma. Você é responsável por manter a confidencialidade das credenciais de acesso da sua conta e por todas as atividades realizadas sob ela.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Diretrizes de Uso Aceitável</h2>
              <p>
                O NutURL preza pela segurança de seus visitantes. Você concorda em <strong>NÃO</strong> utilizar nossos serviços de encurtador de links ou páginas de perfil para:
              </p>
              <ul>
                <li>Hospedar, compartilhar ou redirecionar para conteúdos ilícitos, violentos, pornográficos não autorizados ou que promovam ódio e discriminação.</li>
                <li>Realizar atividades de phishing, engenharia social, espalhar vírus, malwares ou spywares.</li>
                <li>Enviar spams, correntes de mensagens ou links massivos indesejados.</li>
                <li>Violar direitos autorais, marcas registradas ou propriedade intelectual de terceiros.</li>
                <li>Redirecionar para páginas com conteúdo sensível ou para maiores de 18 anos sem marcar explicitamente a configuração de "restrição de idade" correspondente no painel.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Limitação de Responsabilidade</h2>
              <p>
                O NutURL funciona apenas como um facilitador técnico de redirecionamento de links e agrupador de informações. Nós não possuímos controle nem nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas dos sites externos redirecionados. O acesso a tais links é de inteira responsabilidade do visitante.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Suspensão de Conta e Bloqueio de Links</h2>
              <p>
                Reservamo-nos o direito de desativar, suspender ou excluir qualquer link ou conta de usuário, a qualquer momento e sem aviso prévio, caso identifiquemos qualquer violação a estas diretrizes de uso aceitável ou em resposta a ordens judiciais e denúncias de abuso comprovadas.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Contato e Suporte</h2>
              <p>
                Se você tiver alguma dúvida sobre estes Termos de Uso ou se identificar qualquer link abusivo criado em nossa plataforma, entre em contato conosco através do repositório oficial no GitHub ou pelo e-mail de suporte.
              </p>
            </section>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Terms of Use</h1>
            <p className={styles.meta}>Last updated: June 18, 2026</p>

            <section className={styles.section}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using <strong>NutURL</strong>, you agree to comply with and be bound by these Terms of Use. If you do not agree to any term or condition, you must not use our services.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Account Security</h2>
              <p>
                To use certain features, such as creating Link-in-Bio pages, accessing the analytics dashboard, or custom link aliases, you must register. You are solely responsible for maintaining the confidentiality of your account access credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Acceptable Use Guidelines</h2>
              <p>
                NutURL values user safety. You agree <strong>NOT</strong> to use our link-shortening or bio page services to:
              </p>
              <ul>
                <li>Host, share, or redirect to illegal, violent, unauthorized adult content, or material promoting hate and discrimination.</li>
                <li>Conduct phishing, social engineering, spread viruses, malware, or spyware.</li>
                <li>Send spam, massive unsolicited links, or participate in scam operations.</li>
                <li>Violate copyright, trademarks, or third-party intellectual property rights.</li>
                <li>Redirect to age-sensitive pages or content intended for audiences over 18 without enabling the "Age Restricted" setting in your dashboard dashboard.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Limitation of Liability</h2>
              <p>
                NutURL functions solely as a technical routing tool and information aggregator. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. Accessing external links is done at the visitor's own risk.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Account Suspension & Link Blocking</h2>
              <p>
                We reserve the right to deactivate, suspend, or delete any short link or user account, at any time and without prior notice, if we identify violations of these acceptable use guidelines or in response to valid abuse reports and court orders.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Support & Contact</h2>
              <p>
                If you have any questions regarding these Terms of Use or if you wish to report an abusive link created on our platform, please reach out to us through our official GitHub repository or support email.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
