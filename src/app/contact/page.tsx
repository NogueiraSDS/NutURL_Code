'use client';

import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import styles from './contact.module.css';

export default function ContactUs() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBack = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setIsSending(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      setIsSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top navigation */}
      <div className={styles.topNav}>
        <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className={styles.navBtn}>
          {locale === 'pt' ? '🇺🇸 English' : '🇧🇷 Português'}
        </button>
        <button onClick={handleBack} className={styles.navBtn}>
          {locale === 'pt' ? '← Voltar para Home' : '← Back to Home'}
        </button>
      </div>

      <div className={styles.contentWrapper}>
        {/* Info section */}
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{t('contact.title') || 'Fale Conosco'}</h1>
          <p className={styles.subtitle}>
            {t('contact.subtitle') || 'Tem alguma dúvida, feedback ou proposta? Preencha o formulário e responderemos em breve.'}
          </p>

          <div className={styles.infoCards}>
            <div className={`glass ${styles.infoCard}`}>
              <span className={styles.infoIcon}>✉</span>
              <div>
                <h4>Support Email</h4>
                <p>suporte@nuturl.com</p>
              </div>
            </div>
            <div className={`glass ${styles.infoCard}`}>
              <span className={styles.infoIcon}>⏱</span>
              <div>
                <h4>{locale === 'pt' ? 'Tempo de Resposta' : 'Response Time'}</h4>
                <p>{locale === 'pt' ? 'Em até 24 horas úteis' : 'Within 24 business hours'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className={styles.formCol}>
          <div className={`glass ${styles.formCard}`}>
            {isSuccess ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3>{locale === 'pt' ? 'Enviado!' : 'Sent!'}</h3>
                <p>{t('contact.success') || 'Mensagem enviada com sucesso! Responderemos o mais breve possível.'}</p>
                <button onClick={() => setIsSuccess(false)} className="btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  {locale === 'pt' ? 'Enviar Nova Mensagem' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>{t('contact.name') || 'Nome'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('contact.email') || 'E-mail'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('contact.subject') || 'Assunto'}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input"
                    placeholder={locale === 'pt' ? 'Dúvida, Proposta Comercial, Parceria...' : 'Question, Proposal, Partnership...'}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('contact.message') || 'Mensagem'}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="input"
                    rows={5}
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                    placeholder={locale === 'pt' ? 'Digite sua mensagem aqui...' : 'Type your message here...'}
                  />
                </div>
                <button type="submit" disabled={isSending} className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
                  {isSending ? (t('contact.sending') || 'Enviando...') : (t('contact.send') || 'Enviar Mensagem')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
