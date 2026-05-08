import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Reveal from '@site/src/components/Reveal';

type ProjectStatus = 'stable' | 'beta' | 'labs' | 'coming-soon' | 'deprecated';

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  type: string;
  version: string | null;
  tags: string[];
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

const STATUS_CONFIG: Record<
  ProjectStatus,
  {label: string; color: string; bg: string; border: string}
> = {
  stable: {
    label: 'Stable',
    color: '#69cb52',
    bg: 'rgba(105,203,82,0.12)',
    border: 'rgba(105,203,82,0.28)',
  },
  beta: {
    label: 'Beta',
    color: '#00ae79',
    bg: 'rgba(0,174,121,0.12)',
    border: 'rgba(0,174,121,0.28)',
  },
  labs: {
    label: 'Labs',
    color: '#008d89',
    bg: 'rgba(0,141,137,0.12)',
    border: 'rgba(0,141,137,0.28)',
  },
  'coming-soon': {
    label: 'Coming Soon',
    color: '#d0de0b',
    bg: 'rgba(208,222,11,0.12)',
    border: 'rgba(208,222,11,0.28)',
  },
  deprecated: {
    label: 'Deprecated',
    color: '#9da29f',
    bg: 'rgba(157,162,159,0.08)',
    border: 'rgba(157,162,159,0.18)',
  },
};

const FILTER_TABS: {value: string; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'labs', label: 'Labs'},
  {value: 'stable', label: 'Stable'},
  {value: 'beta', label: 'Beta'},
  {value: 'coming-soon', label: 'Coming Soon'},
  {value: 'deprecated', label: 'Deprecated'},
];

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
    </article>
  );
}

export default function LabsPage() {
  const [data, setData] = useState<LabsData | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('/labs.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const projects = data?.projects ?? [];

  const counts = {
    labs: projects.filter((p) => p.status === 'labs').length,
    stable: projects.filter((p) => p.status === 'stable').length,
    beta: projects.filter((p) => p.status === 'beta').length,
    comingSoon: projects.filter((p) => p.status === 'coming-soon').length,
    deprecated: projects.filter((p) => p.status === 'deprecated').length,
  };

  const filtered = projects.filter((p) => {
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

  return (
    <Layout
      title="Labs"
      description="Explore La Rebelion Labs — CLIs, SaaS tools, and experiments in cloud-native, AI, and platform engineering.">
      <main className="lr-labs-page">
        <div className="lr-site-shell">
          <div className="lr-labs-stack">

            {/* ── Hero ──────────────────────────────────────────────── */}
            <Reveal className="lr-labs-hero lr-surface-card">
              <div className="lr-labs-hero__content">
                <span className="lr-eyebrow">La Rebelion Labs</span>
                <h1>Tools built in the field, shipped from the trenches.</h1>
                <p>
                  CLIs, SaaS platforms, and experiments born from real infrastructure work.
                  Every project here solves a problem we have actually hit in production.
                </p>
              </div>
              <div className="lr-stat-row">
                <button
                  className={`lr-stat-card lr-labs-stat-btn${activeFilter === 'labs' ? ' lr-labs-stat-btn--active' : ''}`}
                  onClick={() => setActiveFilter(activeFilter === 'labs' ? 'all' : 'labs')}>
                  <strong style={{color: STATUS_CONFIG.labs.color}}>{counts.labs}</strong>
                  <span>Labs</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${activeFilter === 'stable' ? ' lr-labs-stat-btn--active' : ''}`}
                  onClick={() => setActiveFilter(activeFilter === 'stable' ? 'all' : 'stable')}>
                  <strong style={{color: STATUS_CONFIG.stable.color}}>{counts.stable}</strong>
                  <span>Stable</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${activeFilter === 'beta' ? ' lr-labs-stat-btn--active' : ''}`}
                  onClick={() => setActiveFilter(activeFilter === 'beta' ? 'all' : 'beta')}>
                  <strong style={{color: STATUS_CONFIG.beta.color}}>{counts.beta}</strong>
                  <span>Beta</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${activeFilter === 'coming-soon' ? ' lr-labs-stat-btn--active' : ''}`}
                  onClick={() =>
                    setActiveFilter(activeFilter === 'coming-soon' ? 'all' : 'coming-soon')
                  }>
                  <strong style={{color: STATUS_CONFIG['coming-soon'].color}}>
                    {counts.comingSoon}
                  </strong>
                  <span>Coming Soon</span>
                </button>
                <button
                  className={`lr-stat-card lr-labs-stat-btn${activeFilter === 'deprecated' ? ' lr-labs-stat-btn--active' : ''}`}
                  onClick={() =>
                    setActiveFilter(activeFilter === 'deprecated' ? 'all' : 'deprecated')
                  }>
                  <strong style={{color: STATUS_CONFIG.deprecated.color}}>
                    {counts.deprecated}
                  </strong>
                  <span>Deprecated</span>
                </button>
              </div>
            </Reveal>

            {/* ── Filters ───────────────────────────────────────────── */}
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
                    className={`lr-labs-tab${activeFilter === tab.value ? ' lr-labs-tab--active' : ''}`}
                    onClick={() => setActiveFilter(tab.value)}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* ── Featured ──────────────────────────────────────────── */}
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

            {/* ── All Projects ──────────────────────────────────────── */}
            <Reveal className="lr-labs-section" delay={featured.length > 0 ? 140 : 100}>
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
                  <>
                    {!isFiltering && featured.length > 0 && (
                      <div className="lr-labs-section__heading">
                        <span className="lr-eyebrow">All Projects</span>
                      </div>
                    )}
                    <div className="lr-labs-grid">
                      {rest.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                      ))}
                    </div>
                  </>
                )
              )}
            </Reveal>

          </div>
        </div>
      </main>
    </Layout>
  );
}
