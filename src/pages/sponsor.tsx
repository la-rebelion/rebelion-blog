import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Reveal from '@site/src/components/Reveal';
import {useSiteData} from '@site/src/components/site';

// ── Types ─────────────────────────────────────────────────────────────────────

type SponsorMethod = {
  name: string;
  href: string;
  cta: string;
  note: string;
};

type SponsorTier = {
  name: string;
  price: string;
  kind: 'recurring' | 'one-time';
  tagline: string;
  featured?: boolean;
  href: string;
};

type DebtQuadrant = {
  title: string;
  focus: string;
  move: string;
};

type SponsorData = {
  meta: {updated_at: string; version: string};
  methods: SponsorMethod[];
  recurring_tiers: SponsorTier[];
  one_time_tiers: SponsorTier[];
  debt_quadrants: DebtQuadrant[];
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SponsorPage() {
  const {brand} = useSiteData();
  const [data, setData] = useState<SponsorData | null>(null);

  useEffect(() => {
    fetch('/sponsor-tiers.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const methods = data?.methods ?? [];
  const recurringTiers = data?.recurring_tiers ?? [];
  const oneTimeTiers = data?.one_time_tiers ?? [];
  const debtQuadrants = data?.debt_quadrants ?? [];

  return (
    <Layout
      title="Sponsor"
      description="Support La Rebelion Labs with Stripe, PayPal, or GitHub Sponsors to accelerate practical AI and platform engineering content.">
      <main className="lr-sponsor-page">
        <div className="lr-site-shell">
          <div className="lr-sponsor-stack">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <Reveal className="lr-sponsor-hero lr-surface-card">
              <div className="lr-sponsor-hero__content">
                <span className="lr-eyebrow">Support The Rebellion</span>
                <h1>Help us keep engineering debt from becoming engineering fear.</h1>
                <p>
                  AI-generated software debt is exploding, and engineering organizations are scared.
                  We are Rebels so that does not happen. {brand.summary}
                </p>
                <p className="lr-sponsor-quote">
                  "If this helped you to save time, improve, or learn something new,
                  your recognition and support will be appreciated"
                </p>
              </div>
            </Reveal>

            {/* ── Payment platforms ────────────────────────────────── */}
            <Reveal className="lr-sponsor-methods lr-sponsor-tier-grid" delay={80}>
              {methods.map((method) => (
                <article className="lr-sponsor-method lr-surface-card" key={method.name}>
                  <h2>{method.name}</h2>
                  <p>{method.note}</p>
                  <Link
                    className="lr-button lr-button--primary"
                    href={method.href}
                    target="_blank"
                    rel="noreferrer noopener">
                    {method.cta} →
                  </Link>
                </article>
              ))}
            </Reveal>

            {/* ── Recurring tiers ──────────────────────────────────── */}
            <Reveal delay={140}>
              <div className="lr-sponsor-tier-block">
                <div className="lr-sponsor-tier-header">
                  <span className="lr-eyebrow">Recurring</span>
                  <h2>Join the Rebellion — Monthly</h2>
                  <p>Sustain the mission. Cancel anytime. No lock-in, no ceremonies.</p>
                </div>
                <div className="lr-sponsor-tier-grid">
                  {recurringTiers.map((tier) => (
                    <article
                      className={`lr-sponsor-tier lr-surface-card${tier.featured ? ' lr-sponsor-tier--featured' : ''}`}
                      key={tier.name}>
                      {tier.featured && (
                        <span className="lr-sponsor-tier__badge">Most popular</span>
                      )}
                      <span className="lr-eyebrow">{tier.kind}</span>
                      <h3>{tier.name}</h3>
                      <p className="lr-sponsor-tier__price">{tier.price}</p>
                      <p>{tier.tagline}</p>
                      <Link
                        className="lr-button lr-button--primary"
                        href={tier.href}
                        target="_blank"
                        rel="noreferrer noopener">
                        Become a {tier.name} →
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── One-time tiers ───────────────────────────────────── */}
            <Reveal delay={190}>
              <div className="lr-sponsor-tier-block">
                <div className="lr-sponsor-tier-header">
                  <span className="lr-eyebrow">One-time</span>
                  <h2>Drop Ammo — One-Time</h2>
                  <p>No subscription needed. Support whenever something lands for you.</p>
                </div>
                <div className="lr-sponsor-tier-grid">
                  {oneTimeTiers.map((tier) => (
                    <article
                      className={`lr-sponsor-tier lr-surface-card${tier.featured ? ' lr-sponsor-tier--featured' : ''}`}
                      key={tier.name}>
                      {tier.featured && (
                        <span className="lr-sponsor-tier__badge">Recommended</span>
                      )}
                      <span className="lr-eyebrow">{tier.kind}</span>
                      <h3>{tier.name}</h3>
                      <p className="lr-sponsor-tier__price">{tier.price}</p>
                      <p>{tier.tagline}</p>
                      <Link
                        className="lr-button lr-button--primary"
                        href={tier.href}
                        target="_blank"
                        rel="noreferrer noopener">
                        Send {tier.name} →
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── Vision narrative ─────────────────────────────────── */}
            <Reveal className="lr-sponsor-narrative" delay={230}>
              <div className="lr-surface-card">
                <span className="lr-eyebrow">La Rebelion Labs Vision</span>
                <h2>Question defaults. Reduce debt. Build what is next.</h2>
                <p>
                  La Rebelion Labs exists to help platform teams, product engineers, and technical leaders
                  move from panic to clarity. We translate complex AI and cloud-native changes into practical
                  essays, architecture guidance, and implementation patterns that teams can apply this week.
                </p>
                <p>
                  Every contribution keeps the publishing independent, technical, and candid — free of
                  the incentives that turn engineering content into vendor marketing.
                </p>
              </div>
            </Reveal>

            {/* ── Debt quadrant moves ──────────────────────────────── */}
            <Reveal className="lr-sponsor-quadrants" delay={270}>
              {debtQuadrants.map((quadrant) => (
                <article className="lr-sponsor-quadrant lr-surface-card" key={quadrant.title}>
                  <span className="lr-eyebrow lr-sponsor-tier__price">{quadrant.focus}</span>
                  <h3>{quadrant.title}</h3>
                  <p>{quadrant.move}</p>
                </article>
              ))}
            </Reveal>

            {/* ── Close ────────────────────────────────────────────── */}
            <Reveal className="lr-sponsor-close" delay={310}>
              <div className="lr-surface-card">
                <p>
                  Sponsor La Rebelion Labs if you want practical rebellion over passive consumption,
                  systems thinking over hype, and outcomes over noise.
                </p>
                <p>
                  Prefer inbox-first updates? Join the <Link to="/subscribe">newsletter</Link> instead.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </main>
    </Layout>
  );
}
