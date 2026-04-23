import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Hubspot account id
const hubspot = {
  accountId: '21339207',
};

const config: Config = {
  title: 'La Rebelion Labs',
  tagline: "Question defaults. Build what's next.",
  favicon: 'img/brand/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://rebelion.la',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'la-rebelion',
  projectName: 'rebelion-blog',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          archiveBasePath: 'archive',
          tagsBasePath: 'tags',
          authorsMapPath: 'authors.yml',
          blogTitle: 'La Rebelion Labs',
          blogDescription:
            'Essays on AI, DevOps, cloud-native systems, developer tooling, and the discipline of building what is next.',
          postsPerPage: 9,
          blogSidebarTitle: 'Archive',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          feedOptions: {
            type: ['rss'],
            xslt: true,
            async createFeedItems({blogPosts, defaultCreateFeedItems, ...params}) {
              const validPosts = blogPosts.filter(
                (post) => !Number.isNaN(new Date(post.metadata.date).getTime()),
              );

              return defaultCreateFeedItems({
                ...params,
                blogPosts: validPosts,
              });
            },
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/brand/og-cover.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    blog: {
      sidebar: {
        groupByYear: true,
      },
    },
    navbar: {
      title: 'La Rebelion Labs',
      logo: {
        alt: 'La Rebelion Labs',
        src: 'img/brand/logo-wordmark.svg',
        srcDark: 'img/brand/logo-wordmark.svg',
      },
      items: [
        {to: '/', label: 'Latest', position: 'left'},
        {to: '/tags', label: 'Topics', position: 'left'},
        {to: '/archive', label: 'Archive', position: 'left'},
        {to: '/subscribe', label: 'Newsletter', position: 'right'},
        {
          href: 'https://github.com/la-rebelion',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {name: 'theme-color', content: '#000000'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
  } satisfies Preset.ThemeConfig,
  scripts: [
    {
      src: 'https://js.hsforms.net/forms/embed/v2.js',
      async: true,
    },
  ],
  headTags: [
    {
      tagName: 'script',
      attributes: {
        async: "true",
        defer: "true",
        type: 'text/javascript',
        id: 'hs-script-loader',
        src: `//js.hs-scripts.com/${hubspot.accountId}.js`,
      },
    },
  ],
  themes: ['@docusaurus/theme-mermaid'],

  customFields: {
    brand: {
      phrase: 'Question defaults. Explore everything. Create what’s next.',
      summary:
        'A content-first field guide for AI systems, DevOps, cloud-native architecture, and product-minded engineering.',
      foundedYear: 2021,
    },
    newsletter: {
      subscribeUrl: 'https://go.rebelion.la/subscribe',
      emailParam: 'email',
      title: 'Stay close to the experiments',
      description:
        'Get new essays, practical guides, and hands-on field notes from La Rebelion Labs.',
      cooldownDays: 14,
    },
    social: {
      rss: 'https://rebelion.la/rss.xml',
      github: 'https://github.com/la-rebelion',
      linkedin: 'https://www.linkedin.com/in/adrianescutia/',
      x: 'https://twitter.com/LaRebelionLabs',
      youtube: 'https://www.youtube.com/@LaRebelion',
    },
  },
};

export default config;
