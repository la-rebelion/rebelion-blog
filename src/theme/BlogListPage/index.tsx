import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import Reveal from '@site/src/components/Reveal';
import {ArrowTipIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function getTopTags(props: Props) {
  const byTag = new Map<string, {label: string; permalink: string; count: number}>();

  props.items.forEach(({content}) => {
    content.metadata.tags.forEach((tag) => {
      const current = byTag.get(tag.permalink);
      byTag.set(tag.permalink, {
        label: tag.label,
        permalink: tag.permalink,
        count: (current?.count ?? 0) + 1,
      });
    });
  });

  return [...byTag.values()].sort((left, right) => right.count - left.count).slice(0, 6);
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items} = props;
  const {brand} = useSiteData();
  const latestPost = items[0]?.content;
  const topTags = getTopTags(props);

  const projects = [
    {
      index: '01',
      name: 'HAPI MCP',
      description: 'Turn API contracts into tools that AI systems can actually use.',
      href: 'https://hapi.mcp.com.ai',
      signal: 'Open source + cloud',
    },
    {
      index: '02',
      name: 'Qontent Tube',
      description: 'A local-first voiceover workspace built for scripts that keep changing.',
      href: 'https://qontent.tube',
      signal: 'Desktop product',
    },
    {
      index: '03',
      name: 'APICove',
      description: 'A sharper workbench for designing, testing, and shipping APIs.',
      href: 'https://apicove.com',
      signal: 'Developer platform',
    },
  ];

  return (
    <BlogLayout>
      <div className="lr-home lr-home--landing">
        <section className="lr-home-hero" aria-labelledby="lr-home-title">
          <Reveal className="lr-home-hero__copy">
            <div className="lr-hero-status">
              <span className="lr-status-dot" aria-hidden="true" />
              <span>Independent product lab</span>
              <span aria-hidden="true">/</span>
              <span>Est. {brand.foundedYear}</span>
            </div>
            <h1 id="lr-home-title">
              <span>Question</span>
              <span>defaults.</span>
              <span className="lr-home-hero__accent">Build what’s next.</span>
            </h1>
            <p>
              La Rebelion Labs is where stubborn questions become useful software. We explore AI,
              APIs, and developer infrastructure—then ship the tools we wish already existed.
            </p>
            <div className="lr-hero-actions">
              <Link className="lr-button lr-button--primary" to="/labs">
                <span>Enter the labs</span>
                <ArrowTipIcon width={16} height={16} />
              </Link>
              <Link className="lr-button" to="/archive">
                Read the field notes
              </Link>
            </div>
            <div className="lr-hero-principles" aria-label="Our operating principles">
              <span>Own the stack</span>
              <span>Show the work</span>
              <span>Ship the argument</span>
            </div>
          </Reveal>
          <Reveal className="lr-home-hero__stage" delay={120}>
            <div className="lr-signal-card">
              <div className="lr-signal-card__topline">
                <span>LRL / SIGNAL 001</span>
                <span>TRANSMITTING</span>
              </div>
              <div className="lr-signal-card__grid" aria-hidden="true" />
              <div className="lr-signal-card__orbit" aria-hidden="true">
                <span />
              </div>
              <img
                className="lr-signal-card__mark"
                src="/img/brand/la-rebelion-precision-transparent.png"
                alt="La Rebelion Labs"
              />
              <span className="lr-signal-card__label lr-signal-card__label--ai">AI systems</span>
              <span className="lr-signal-card__label lr-signal-card__label--api">API craft</span>
              <span className="lr-signal-card__label lr-signal-card__label--tools">
                Tools for builders
              </span>
              {latestPost ? (
                <div className="lr-signal-card__preview">
                  <span className="lr-eyebrow">Latest dispatch</span>
                  <Link to={latestPost.metadata.permalink}>{latestPost.metadata.title}</Link>
                  <span className="lr-signal-card__preview-action">
                    Read the argument <ArrowTipIcon width={15} height={15} />
                  </span>
                </div>
              ) : null}
            </div>
          </Reveal>
        </section>

        <div className="lr-manifesto-ticker" aria-label="How we work">
          <span>We question</span>
          <i aria-hidden="true">✦</i>
          <span>We prototype</span>
          <i aria-hidden="true">✦</i>
          <span>We break things</span>
          <i aria-hidden="true">✦</i>
          <span>We ship</span>
        </div>

        <section className="lr-thesis" aria-labelledby="lr-thesis-title">
          <Reveal className="lr-thesis__intro">
            <span className="lr-eyebrow">The operating thesis</span>
            <h2 id="lr-thesis-title">Default paths are optimized for yesterday.</h2>
          </Reveal>
          <Reveal className="lr-thesis__body" delay={100}>
            <p>
              The status quo is useful—right up until it becomes invisible. We make assumptions
              visible, test them in public, and turn the useful discoveries into products.
            </p>
            <ol className="lr-thesis__steps">
              <li>
                <b>01</b>
                <span>Find the constraint everyone learned to tolerate.</span>
              </li>
              <li>
                <b>02</b>
                <span>Build a smaller, sharper alternative.</span>
              </li>
              <li>
                <b>03</b>
                <span>Document the scars and release the work.</span>
              </li>
            </ol>
          </Reveal>
        </section>

        <section className="lr-projects" aria-labelledby="lr-projects-title">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">Projects in orbit</span>
              <h2 id="lr-projects-title">The rebellion is a portfolio.</h2>
            </div>
            <div className="lr-section-heading__aside">
              <p>Independent products, open tools, and experiments sharing one point of view.</p>
              <Link className="lr-inline-link" to="/labs">
                Explore every project <ArrowTipIcon width={15} height={15} />
              </Link>
            </div>
          </Reveal>
          <div className="lr-project-grid">
            {projects.map((project, projectIndex) => (
              <Reveal
                key={project.name}
                as="article"
                className="lr-project-card"
                delay={projectIndex * 80}>
                <div className="lr-project-card__meta">
                  <span>{project.index}</span>
                  <span>{project.signal}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <Link href={project.href} className="lr-project-card__link">
                  Visit project <ArrowTipIcon width={15} height={15} />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="latest" className="lr-section">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">Field notes</span>
              <h2>Ideas with dirt under their nails.</h2>
            </div>
            <div className="lr-section-heading__aside">
              <p>Architecture, AI, APIs, and the uncomfortable work of making systems better.</p>
              <Link className="lr-inline-link" to="/archive">
                Browse the archive <ArrowTipIcon width={15} height={15} />
              </Link>
            </div>
          </Reveal>
          {topTags.length ? (
            <div className="lr-topic-strip">
              {topTags.map((tag) => (
                <Link key={tag.permalink} className="lr-topic-chip" to={tag.permalink}>
                  {tag.label}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="lr-post-grid">
            <BlogPostItems items={items} />
          </div>
        </section>

        <NewsletterPanel />
        <BlogListPaginator metadata={metadata} />
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={[
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      ].join(' ')}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
