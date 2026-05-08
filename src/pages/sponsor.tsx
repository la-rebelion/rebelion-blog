import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Reveal from '@site/src/components/Reveal';
import {useSiteData} from '@site/src/components/site';

type SponsorMethod = {
  name: string;
  href: string;
  cta: string;
  note: string;
};

type TierKind = 'recurring' | 'one-time';

type SponsorTier = {
  name: string;
  price: string;
  kind: TierKind;
  tagline: string;
  featured?: boolean;
  href: string;
};

type DebtQuadrant = {
  title: string;
  focus: string;
  move: string;
};

const sponsorMethods: SponsorMethod[] = [
  {
    name: 'Stripe',
    href: 'https://donate.stripe.com/8x200i6id7WfgGq4EJ7Vm01',
    cta: 'Support via Stripe',
    note: 'One-time or recurring — Stripe handles cards, Apple Pay, and bank transfers globally.',
  },
  {
    name: 'PayPal',
    href: 'https://www.paypal.com/donate?hosted_button_id=7CV28AHGL9ZZY',
    cta: 'Support via PayPal',
    note: 'Quick donation path if PayPal is already your default payment flow.',
  },
  {
    name: 'GitHub Sponsors',
    href: 'https://github.com/sponsors/la-rebelion',
    cta: 'Sponsor on GitHub',
    note: 'Recurring support directly inside GitHub, where most of our work lives.',
  },
  {
    name: 'Buy Me a Coffee',
    href: 'https://www.buymeacoffee.com/larebelion',
    cta: 'Buy Me a Coffee',
    note: 'One-time or recurring support with a platform built for creators.',
  }
];

const recurringTiers: SponsorTier[] = [
  {
    name: 'Infiltrator',
    price: '$5 / mo',
    kind: 'recurring',
    tagline: 'Stay close to the experiments, no noise. The undercover reader who shows up every week.',
    href: 'https://github.com/sponsors/la-rebelion',
  },
  {
    name: 'Dissident',
    price: '$10 / mo',
    kind: 'recurring',
    tagline: 'Read early, influence what gets written next. You question defaults by nature.',
    href: 'https://github.com/sponsors/la-rebelion',
  },
  {
    name: 'Rebel',
    price: '$25 / mo',
    kind: 'recurring',
    tagline: 'Aligned with the vision. You believe engineering clarity beats engineering fear.',
    featured: true,
    href: 'https://github.com/sponsors/la-rebelion',
  },
  {
    name: 'Field Commander',
    price: '$50 / mo',
    kind: 'recurring',
    tagline: 'Priority Q&A, direct feedback loop. You lead from the trenches, not the slides.',
    href: 'https://github.com/sponsors/la-rebelion',
  },
  {
    name: 'Manifesto',
    price: '$100 / mo',
    kind: 'recurring',
    tagline: 'Patron of the rebellion. Fund work that organizations are too scared to commission.',
    href: 'https://github.com/sponsors/la-rebelion',
  },
];

const oneTimeTiers: SponsorTier[] = [
  {
    name: 'Ammo Drop',
    price: '$9',
    kind: 'one-time',
    tagline: 'Quick fuel for the next lab experiment. Covers one late night of research.',
    href: 'https://donate.stripe.com/6oU4gybCxgsLduec7b7Vm00',
  },
  {
    name: 'Field Ration',
    price: '$20',
    kind: 'one-time',
    tagline: 'Keep the labs running between deployments. The post that saved you an afternoon was worth this.',
    featured: true,
    href: 'https://donate.stripe.com/8x200i6id7WfgGq4EJ7Vm01',
  },
  {
    name: 'Break Glass',
    price: '$50',
    kind: 'one-time',
    tagline: 'The one you reach for when something we wrote saved a production incident.',
    href: 'https://donate.stripe.com/28E00icGB5O72PA7QV7Vm02',
  },
  {
    name: 'Force Push',
    price: '$100',
    kind: 'one-time',
    tagline: 'The rebel move. All-in support for independent, no-compromise engineering writing.',
    href: 'https://donate.stripe.com/eVq6oGcGBfoH1Lw7QV7Vm03',
  },
  {
    name: 'The Override',
    price: '$250+',
    kind: 'one-time',
    tagline: 'Sponsor a specific essay, guide, or experiment. Your name in the acknowledgements.',
    href: 'https://buy.stripe.com/dRm00icGB6Sb9dYgnr7Vm04',
  },
];

const debtQuadrants: DebtQuadrant[] = [
  {
    title: 'Known Knowns',
    focus: 'Intentional debt',
    move: 'We expose shortcuts early, document tradeoffs, and turn pressure into conscious decisions.',
  },
  {
    title: 'Unknown Knowns',
    focus: 'Inevitable debt',
    move: 'We track shifts in AI, platform tooling, and architecture so teams can prepare before the bill arrives.',
  },
  {
    title: 'Known Unknowns',
    focus: 'Unintentional debt',
    move: 'We publish playbooks that reduce avoidable mistakes before they become production gravity.',
  },
  {
    title: 'Unknown Unknowns',
    focus: 'Strategic debt',
    move: "We test bold ideas safely so innovation does not silently become tomorrow's incident queue.",
  },
];

export default function SponsorPage() {
  const {brand} = useSiteData();

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
                {/* <div className="lr-stat-row">
                  <div className="lr-stat-card">
                    <strong>20h</strong>
                    <span>Saved per platform team, per month</span>
                  </div>
                  <div className="lr-stat-card">
                    <strong>4</strong>
                    <span>Debt quadrants translated into practical delivery moves</span>
                  </div>
                  <div className="lr-stat-card">
                    <strong>0</strong>
                    <span>VC money. No paywalls. No algorithmic capture.</span>
                  </div>
                </div> */}
              </div>
            </Reveal>

            {/* ── Payment platforms ────────────────────────────────── */}
            <Reveal className="lr-sponsor-methods lr-sponsor-tier-grid" delay={80}>
              {sponsorMethods.map((method) => (
                <article className="lr-sponsor-method lr-surface-card" key={method.name}>
                  {/* <span className="lr-eyebrow lr-sponsor-tier__price">{method.name}</span> */}
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
