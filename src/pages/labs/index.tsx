import {useState, useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Reveal from '@site/src/components/Reveal';

// ── Types ─────────────────────────────────────────────────────────────────────

type ProjectStatus =
  | 'stable'
  | 'beta'
  | 'labs'
  | 'alpha'
  | 'coming-soon'
  | 'deprecated'
  | 'on-hold';

type LicenseType = 'Open Source' | 'LR Community' | 'Commercial' | 'SaaS ToS';

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  type: string;
  version: string | null;
  tags: string[];
  license?: LicenseType | null;
  featured?: boolean;
  githubUrl?: string | null;
  docsUrl?: string | null;
  saasUrl?: string | null;
  installCommand?: string | null;
  icon?: string | null;
};

type LabsData = {
  meta: {updated_at: string; version: string};
  projects: Project[];
};

type TierFeature = {text: string; included: boolean | 'partial'};

type PricingTier = {
  id: string;
  alias: string;
  alias_color: string;
  name: string;
  price: {
    display: string;
    period: string | null;
    note: string | null;
    yearly: string | null;
    yearly_save: string | null;
  };
  everything_in: string | null;
  features: TierFeature[];
  cta: {label: string; href: string; variant: string};
  badge: string | null;
  secondary_badge: string | null;
  highlighted: boolean;
};

type PricingData = {
  meta: {updated_at: string; version: string};
  tiers: PricingTier[];
  feature_table: {
    tiers: string[];
    features: Array<{name: string; access: string[]}>;
  };
  saas_tos: {
    title: string;
    conditions: Array<{label: string; value: string}>;
  };
};

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProjectStatus,
  {label: string; color: string; bg: string; border: string}
> = {
  stable:       {label: 'Stable',     color: '#69cb52', bg: 'rgba(105,203,82,0.12)',  border: 'rgba(105,203,82,0.28)'},
  beta:         {label: 'Beta',       color: '#00ae79', bg: 'rgba(0,174,121,0.12)',   border: 'rgba(0,174,121,0.28)'},
  labs:         {label: 'Labs',       color: '#008d89', bg: 'rgba(0,141,137,0.12)',   border: 'rgba(0,141,137,0.28)'},
  alpha:        {label: 'Alpha',      color: '#006a7c', bg: 'rgba(0,106,124,0.12)',   border: 'rgba(0,106,124,0.28)'},
  'coming-soon':{label: 'Coming Soon',color: '#d0de0b', bg: 'rgba(208,222,11,0.12)', border: 'rgba(208,222,11,0.28)'},
  deprecated:   {label: 'Deprecated', color: '#9da29f', bg: 'rgba(157,162,159,0.08)', border: 'rgba(157,162,159,0.18)'},
  'on-hold':    {label: 'On Hold',    color: '#9da29f', bg: 'rgba(157,162,159,0.06)', border: 'rgba(157,162,159,0.14)'},
};

const ACTIVE_STATUSES: ProjectStatus[] = ['stable', 'beta', 'labs', 'alpha', 'coming-soon'];
const ARCHIVE_STATUSES: ProjectStatus[] = ['deprecated', 'on-hold'];

const FILTER_TABS = [
  {value: 'all',          label: 'All'},
  {value: 'beta',         label: 'Beta'},
  {value: 'alpha',        label: 'Alpha'},
  {value: 'labs',         label: 'Labs'},
  {value: 'stable',       label: 'Stable'},
  {value: 'coming-soon',  label: 'Coming Soon'},
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function StatusBadge({status}: {status: ProjectStatus}) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.labs;
  return (
    <span
      className="lr-labs-badge"
      style={{color: cfg.color, background: cfg.bg, borderColor: cfg.border}}>
      {cfg.label}
    </span>
  );
}

function LicenseCTA({project}: {project: Project}) {
  const {license} = project;
  if (!license || license === 'SaaS ToS') return null;

  if (license === 'Open Source') {
    return (
      <div className="lr-labs-license-ctas">
        <Link
          href="https://github.com/sponsors/la-rebelion"
          className="lr-labs-oss-btn"
          target="_blank"
          rel="noreferrer noopener">
          ⭐ Sponsor
        </Link>
        <Link
          href="https://buymeacoffee.com/larebelion"
          className="lr-labs-oss-btn"
          target="_blank"
          rel="noreferrer noopener">
          ☕ Coffee
        </Link>
      </div>
    );
  }

  if (license === 'LR Community') {
    return (
      <div className="lr-labs-license-ctas">
        <Link
          href="https://github.com/sponsors/la-rebelion"
          className="lr-labs-community-btn"
          target="_blank"
          rel="noreferrer noopener">
          Join Community →
        </Link>
      </div>
    );
  }

  if (license === 'Commercial') {
    return (
      <div className="lr-labs-license-ctas">
        <Link
          href="https://rebelion.la"
          className="lr-labs-oss-btn"
          target="_blank"
          rel="noreferrer noopener">
          Commercial License
        </Link>
      </div>
    );
  }

  return null;
}

function CollapsibleSection({
  title,
  count,
  children,
  open,
  onToggle,
  sectionId,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  sectionId?: string;
}) {
  return (
    <section id={sectionId} className="lr-labs-section">
      <button
        className={`lr-labs-collapsible${open ? ' lr-labs-collapsible--open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}>
        <span className="lr-eyebrow">{title}</span>
        {count !== undefined && (
          <span className="lr-labs-collapsible__count">{count}</span>
        )}
        <span className="lr-labs-collapsible__chevron" aria-hidden>
          ▾
        </span>
      </button>
      {open && <div className="lr-labs-collapsible__body">{children}</div>}
    </section>
  );
}

// ── Project cards ─────────────────────────────────────────────────────────────

function ProjectCard({project}: {project: Project}) {
  const isComingSoon = project.status === 'coming-soon';
  const icon = project.icon ?? project.name.charAt(0);

  return (
    <article
      className={[
        'lr-labs-card lr-surface-card',
        project.featured ? 'lr-labs-card--featured' : '',
        isComingSoon ? 'lr-labs-card--dim' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      {project.featured && (
        <span className="lr-labs-card__star" aria-label="Featured">
          ★
        </span>
      )}

      <div className="lr-labs-card__header">
        <div className="lr-labs-card__icon" aria-hidden>
          {icon}
        </div>
        <div className="lr-labs-card__meta">
          <h3 className="lr-labs-card__name">{project.name}</h3>
          {project.version && (
            <span className="lr-labs-card__version">v{project.version}</span>
          )}
        </div>
      </div>

      <div className="lr-labs-card__badges">
        <StatusBadge status={project.status} />
        <span className="lr-labs-badge lr-labs-badge--type">{project.type}</span>
      </div>

      <p className="lr-labs-card__desc">{project.description}</p>

      {project.tags.length > 0 && (
        <div className="lr-labs-card__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="lr-tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {project.installCommand && !isComingSoon && (
        <div className="lr-labs-card__install">
          <code>{project.installCommand}</code>
        </div>
      )}

      <div className="lr-labs-card__actions">
        {isComingSoon ? (
          <span className="lr-labs-card__soon">Launching soon…</span>
        ) : (
          <>
            {project.saasUrl && (
              <Link
                href={project.saasUrl}
                className="lr-button lr-button--primary"
                target="_blank"
                rel="noreferrer noopener">
                Open App →
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                className="lr-button"
                target="_blank"
                rel="noreferrer noopener">
                GitHub
              </Link>
            )}
            {project.docsUrl && (
              <Link
                href={project.docsUrl}
                className="lr-button"
                target="_blank"
                rel="noreferrer noopener">
                Docs
              </Link>
            )}
          </>
        )}
      </div>

      <LicenseCTA project={project} />
    </article>
  );
}

function ArchiveCard({project}: {project: Project}) {
  return (
    <article className="lr-labs-archive-card lr-surface-card">
      <div className="lr-labs-archive-card__header">
        <span className="lr-labs-archive-card__icon" aria-hidden>
          {project.icon ?? project.name.charAt(0)}
        </span>
        <div className="lr-labs-archive-card__info">
          <h4 className="lr-labs-archive-card__name">{project.name}</h4>
          {project.version && (
            <span className="lr-labs-card__version">v{project.version}</span>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>
      <p className="lr-labs-archive-card__desc">{project.description}</p>
      {(project.githubUrl || project.docsUrl || project.saasUrl) && (
        <div className="lr-labs-card__actions">
          {project.saasUrl && (
            <Link
              href={project.saasUrl}
              className="lr-button"
              target="_blank"
              rel="noreferrer noopener">
              Visit
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              className="lr-button"
              target="_blank"
              rel="noreferrer noopener">
              GitHub
            </Link>
          )}
          {project.docsUrl && (
            <Link
              href={project.docsUrl}
              className="lr-button"
              target="_blank"
              rel="noreferrer noopener">
              Docs
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

function FeatureCheck({value}: {value: string}) {
  if (value === '✓') return <span className="lr-ft-yes" aria-label="Included">✓</span>;
  if (value === '-') return <span className="lr-ft-no" aria-label="Not included">−</span>;
  if (value === '~') return <span className="lr-ft-partial" aria-label="Partial">~</span>;
  return <span className="lr-ft-note">{value}</span>;
}

function FeatureIcon({included}: {included: boolean | 'partial'}) {
  if (included === true)      return <span className="lr-tier-feat-yes" aria-hidden>✓</span>;
  if (included === 'partial') return <span className="lr-tier-feat-partial" aria-hidden>~</span>;
  return <span className="lr-tier-feat-no" aria-hidden>−</span>;
}

function PricingSection({pricing}: {pricing: PricingData}) {
  return (
    <Reveal className="lr-labs-pricing-wrap" delay={40}>
      <div className="lr-labs-section__heading lr-labs-pricing__heading">
        <span className="lr-eyebrow">Membership</span>
        <h2 className="lr-labs-pricing__title">
          Plans for every stage of the rebellion.
        </h2>
        <p className="lr-labs-pricing__sub">
          All plans include the community newsletter and OSS tooling. Upgrade to
          unlock source access to private repos, AI skills, and managed infrastructure.
        </p>
      </div>

      {/* Tier cards */}
      <div className="lr-labs-tiers">
        {pricing.tiers.map((tier) => (
          <article
            key={tier.id}
            className={`lr-labs-tier lr-surface-card${
              tier.highlighted ? ' lr-labs-tier--highlighted' : ''
            }`}>
            {tier.badge && (
              <span className="lr-labs-tier__badge">{tier.badge}</span>
            )}

            <span
              className="lr-labs-tier__alias"
              style={{color: tier.alias_color, borderColor: `${tier.alias_color}44`}}>
              {tier.alias}
            </span>

            <h3 className="lr-labs-tier__name">{tier.name}</h3>

            <div className="lr-labs-tier__price-block">
              <div className="lr-labs-tier__price-row">
                <span className="lr-labs-tier__price-num">{tier.price.display}</span>
                {tier.price.period && (
                  <span className="lr-labs-tier__price-period">
                    /{tier.price.period}
                  </span>
                )}
              </div>
              {tier.price.note && (
                <p className="lr-labs-tier__price-note">{tier.price.note}</p>
              )}
              {tier.price.yearly && (
                <p className="lr-labs-tier__yearly">
                  {tier.price.yearly}
                  {tier.price.yearly_save && (
                    <span> ({tier.price.yearly_save})</span>
                  )}
                </p>
              )}
            </div>

            {tier.everything_in && (
              <p className="lr-labs-tier__everything-in">
                Everything in {tier.everything_in} +
              </p>
            )}

            <ul className="lr-labs-tier__features">
              {tier.features.map((f) => (
                <li
                  key={f.text}
                  className={`lr-labs-tier__feature${
                    f.included === true
                      ? ' lr-labs-tier__feature--yes'
                      : f.included === 'partial'
                      ? ' lr-labs-tier__feature--partial'
                      : ' lr-labs-tier__feature--no'
                  }`}>
                  <FeatureIcon included={f.included} />
                  {f.text}
                </li>
              ))}
            </ul>

            <Link
              href={tier.cta.href}
              className={`lr-button${
                tier.highlighted ? ' lr-button--primary' : ''
              } lr-labs-tier__cta`}
              target="_blank"
              rel="noreferrer noopener">
              {tier.cta.label}
            </Link>
          </article>
        ))}
      </div>

      {/* Feature access table */}
      <div className="lr-labs-ft-card lr-surface-card">
        <h3 className="lr-labs-ft__title">Feature access by tier</h3>
        <div className="lr-labs-ft-scroll">
          <table className="lr-labs-ft">
            <thead>
              <tr>
                <th className="lr-labs-ft__feat-col">Feature</th>
                {pricing.feature_table.tiers.map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing.feature_table.features.map((row) => (
                <tr key={row.name}>
                  <td className="lr-labs-ft__feat-col">{row.name}</td>
                  {row.access.map((v, i) => (
                    <td key={i} className="lr-labs-ft__access">
                      <FeatureCheck value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SaaS ToS note */}
        <div className="lr-labs-saas-tos">
          <p className="lr-labs-saas-tos__title">{pricing.saas_tos.title}</p>
          <div className="lr-labs-saas-tos__conditions">
            {pricing.saas_tos.conditions.map((c) => (
              <div key={c.label} className="lr-labs-saas-tos__condition">
                <span className="lr-labs-saas-tos__label">{c.label}</span>
                <strong className="lr-labs-saas-tos__value">{c.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LabsPage() {
  const [labsData, setLabsData] = useState<LabsData | null>(null);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [allProjectsOpen, setAllProjectsOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archiveSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/labs.json').then((r) => r.json()),
      fetch('/pricing.json').then((r) => r.json()),
    ])
      .then(([labs, pricingData]) => {
        setLabsData(labs);
        setPricing(pricingData);
      })
      .catch(() => {});
  }, []);

  const projects = labsData?.projects ?? [];
  const active = projects.filter((p) => ACTIVE_STATUSES.includes(p.status));
  const archive = projects.filter((p) => ARCHIVE_STATUSES.includes(p.status));

  const counts = {
    labs:      active.filter((p) => p.status === 'labs' || p.status === 'alpha').length,
    stable:    active.filter((p) => p.status === 'stable').length,
    beta:      active.filter((p) => p.status === 'beta').length,
    comingSoon:active.filter((p) => p.status === 'coming-soon').length,
    deprecated:archive.length,
  };

  const filtered = active.filter((p) => {
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const isFiltering = activeFilter !== 'all' || search !== '';
  const featured = isFiltering ? [] : filtered.filter((p) => p.featured);
  const rest = isFiltering ? filtered : filtered.filter((p) => !p.featured);

  const handleDeprecatedClick = () => {
    setArchiveOpen(true);
    setTimeout(() => {
      archiveSectionRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 60);
  };

  return (
    <Layout
      title="Labs"
      description="Explore La Rebelion Labs — CLIs, SaaS tools, and experiments in cloud-native, AI, and platform engineering.">
      <main className="lr-labs-page">
        <div className="lr-site-shell">
          <div className="lr-labs-stack">

            {/* ── Hero ────────────────────────────────────────────── */}
            <Reveal className="lr-labs-hero lr-surface-card">
              <div className="lr-labs-hero__content">
                <span className="lr-eyebrow">La Rebelion Labs</span>
                <h1>Tools built in the field, shipped from the trenches.</h1>
                <p>
                  CLIs, SaaS platforms, and experiments born from real
                  infrastructure work. Every project here solves a problem we
                  have actually hit in production.
                </p>
              </div>
              <div className="lr-stat-row">
                <button
                  className={`lr-stat-card lr-labs-stat-btn${
                    activeFilter === 'labs' || activeFilter === 'alpha'
                      ? ' lr-labs-stat-btn--active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveFilter(activeFilter === 'labs' ? 'all' : 'labs')
                  }>
                  <strong style={{color: STATUS_CONFIG.labs.color}}>
                    {counts.labs}
                  </strong>
                  <span>Labs</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${
                    activeFilter === 'stable' ? ' lr-labs-stat-btn--active' : ''
                  }`}
                  onClick={() =>
                    setActiveFilter(activeFilter === 'stable' ? 'all' : 'stable')
                  }>
                  <strong style={{color: STATUS_CONFIG.stable.color}}>
                    {counts.stable}
                  </strong>
                  <span>Stable</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${
                    activeFilter === 'beta' ? ' lr-labs-stat-btn--active' : ''
                  }`}
                  onClick={() =>
                    setActiveFilter(activeFilter === 'beta' ? 'all' : 'beta')
                  }>
                  <strong style={{color: STATUS_CONFIG.beta.color}}>
                    {counts.beta}
                  </strong>
                  <span>Beta</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${
                    activeFilter === 'coming-soon'
                      ? ' lr-labs-stat-btn--active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveFilter(
                      activeFilter === 'coming-soon' ? 'all' : 'coming-soon',
                    )
                  }>
                  <strong style={{color: STATUS_CONFIG['coming-soon'].color}}>
                    {counts.comingSoon}
                  </strong>
                  <span>Coming Soon</span>
                </button>
                <button
                  className="lr-stat-card lr-labs-stat-btn"
                  onClick={handleDeprecatedClick}>
                  <strong style={{color: STATUS_CONFIG.deprecated.color}}>
                    {counts.deprecated}
                  </strong>
                  <span>Deprecated</span>
                </button>
              </div>
            </Reveal>

            {/* ── Filters ─────────────────────────────────────────── */}
            <Reveal className="lr-labs-filters" delay={60}>
              <div className="lr-labs-search-wrap">
                <input
                  className="lr-labs-search"
                  type="search"
                  placeholder="Search projects…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="lr-labs-tabs" role="tablist">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    role="tab"
                    aria-selected={activeFilter === tab.value}
                    className={`lr-labs-tab${
                      activeFilter === tab.value ? ' lr-labs-tab--active' : ''
                    }`}
                    onClick={() => setActiveFilter(tab.value)}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* ── Featured (non-collapsible) ──────────────────────── */}
            {featured.length > 0 && (
              <Reveal className="lr-labs-section" delay={100}>
                <div className="lr-labs-section__heading">
                  <span className="lr-eyebrow">Featured</span>
                </div>
                <div className="lr-labs-grid">
                  {featured.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </Reveal>
            )}

            {/* ── All Projects (collapsible) ──────────────────────── */}
            {filtered.length === 0 ? (
              <div className="lr-labs-empty lr-surface-card">
                <span className="lr-eyebrow">No results</span>
                <p>
                  No projects match your current filter.{' '}
                  <button
                    className="lr-labs-reset"
                    onClick={() => {
                      setSearch('');
                      setActiveFilter('all');
                    }}>
                    Clear filters
                  </button>
                </p>
              </div>
            ) : (
              rest.length > 0 && (
                <CollapsibleSection
                  title={isFiltering ? 'Results' : 'All Projects'}
                  count={rest.length}
                  open={allProjectsOpen}
                  onToggle={() => setAllProjectsOpen((o) => !o)}>
                  <div className="lr-labs-grid">
                    {rest.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                </CollapsibleSection>
              )
            )}

            {/* ── Pricing ─────────────────────────────────────────── */}
            {pricing && (
              <section className="lr-labs-section">
                <PricingSection pricing={pricing} />
              </section>
            )}

            {/* ── Archive: Deprecated & On-Hold ──────────────────── */}
            {archive.length > 0 && (
              <CollapsibleSection
                title="Archive"
                count={archive.length}
                open={archiveOpen}
                onToggle={() => setArchiveOpen((o) => !o)}
                sectionId="lr-labs-archive">
                <div
                  ref={(el) => {
                    archiveSectionRef.current = el as HTMLElement | null;
                  }}
                  className="lr-labs-archive-grid">
                  {archive.map((p) => (
                    <ArchiveCard key={p.id} project={p} />
                  ))}
                </div>
              </CollapsibleSection>
            )}

          </div>
        </div>
      </main>
    </Layout>
  );
}
