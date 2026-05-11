import Layout from '@theme/Layout';
import Reveal from '@site/src/components/Reveal';
import ContactForm from '@site/src/components/ContactForm';
import {useSiteData} from '@site/src/components/site';

export default function ContactPage() {
  const {social} = useSiteData();

  return (
    <Layout
      title="Contact"
      description="Get in touch with La Rebelion Labs for enterprise licensing, partnerships, or technical questions.">
      <main className="lr-contact-page">
        <div className="lr-site-shell">
          <div className="lr-contact-stack">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <Reveal className="lr-contact-hero lr-surface-card">
              <div className="lr-contact-hero__content">
                <span className="lr-eyebrow">Contact</span>
                <h1>Let's talk.</h1>
                <p>
                  Whether you're evaluating enterprise licensing, exploring a partnership,
                  or have a technical question — send a message and we'll respond within
                  one business day.
                </p>
              </div>
            </Reveal>

            {/* ── Form + sidebar ─────────────────────────────────────── */}
            <div className="lr-contact-grid">
              <Reveal className="lr-surface-card lr-contact-form-wrap" delay={60}>
                <span className="lr-eyebrow">Send a message</span>
                <ContactForm />
              </Reveal>

              <div className="lr-contact-sidebar">
                <Reveal className="lr-surface-card" delay={100}>
                  <span className="lr-eyebrow">Enterprise</span>
                  <h3>Commercial licensing</h3>
                  <p>
                    Need air-gapped deployment, a custom SLA, or a whitelabel arrangement?
                    Select <strong>Enterprise inquiry</strong> in the form or reach out
                    directly.
                  </p>
                </Reveal>

                <Reveal className="lr-surface-card" delay={140}>
                  <span className="lr-eyebrow">Other channels</span>
                  <h3>Find us elsewhere</h3>
                  <ul className="lr-contact-links">
                    <li>
                      <a href={social.github} target="_blank" rel="noreferrer noopener">
                        GitHub
                      </a>
                      {' '}— issues, PRs, and discussions
                    </li>
                    <li>
                      <a href={social.linkedin} target="_blank" rel="noreferrer noopener">
                        LinkedIn
                      </a>
                      {' '}— professional inquiries
                    </li>
                    <li>
                      <a href={social.x} target="_blank" rel="noreferrer noopener">
                        X / Twitter
                      </a>
                      {' '}— quick questions and updates
                    </li>
                  </ul>
                </Reveal>
              </div>
            </div>

          </div>
        </div>
      </main>
    </Layout>
  );
}
