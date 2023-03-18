// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const config = {
        title: 'reev',
        tagline: '⛪️ reactive event state manager',
        url: 'https://reev.tsei.jp/',
        baseUrl: '/',
        onBrokenLinks: 'warn',
        onBrokenMarkdownLinks: 'warn',
        favicon: 'img/favicon.ico',
        organizationName: 'tseijp',
        projectName: 'tseijp',
        i18n: {
                defaultLocale: "en",
                locales: ["en", "ja"],
                localeConfigs: {
                        en: { label: 'English', },
                        ja: { label: '日本語', },
                },
        },
        // themes: ['@docusaurus/theme-mermaid'], // @TODO
        presets: [
                ['classic', { docs: {
                        path: 'docs/',
                        routeBasePath: 'docs',
                        editUrl: 'https://github.com/tseijp/reev/tree/main/examples/docs/docs',
                },}],
        ],
        plugins: [
                ['@docusaurus/plugin-content-docs', {
                        id: 'api',
                        path: 'api/',
                        routeBasePath: 'api',
                        editUrl: 'https://github.com/tseijp/reev/tree/main/examples/docs/api',
                }],
                ['@docusaurus/plugin-content-docs', {
                        id: 'guide',
                        path: 'guide/',
                        routeBasePath: 'guide',
                        editUrl: 'https://github.com/tseijp/reev/tree/main/examples/docs/guide',
                }],
        ],
        themeConfig: {
                metadata: [{
                        name: 'reev',
                        content: 'tech, blog'
                }],
                navbar: {
                        title: 'reev',
                        logo: { alt: '', src: 'img/favicon.ico', },
                        items: [
                                { position: 'left', to: '/docs', label: 'Docs', },
                                { position: 'left', to: '/api', label: 'API', },
                                { position: 'left', to: '/guide', label: 'Guide', },
                                { position: 'right', type: 'localeDropdown', },
                                { position: 'right', label: 'GitHub', href: 'https://github.com/tseijp/reev', },
                        ],
                },
                footer: {
                        style: 'dark',
                        links: [
                                { title: 'Docs', items: [
                                        { label: 'Tutorial', to: '/docs/', },
                                ], },
                                { title: 'Community', items: [
                                        { label: 'Twitter', href: 'https://twitter.com/tseijp', },
                                ], },
                                { title: 'More', items: [
                                        { label: 'GitHub', href: 'https://github.com/tseijp/tseijp', },
                                ], },
                        ],
                        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
                },
                // prism: {
                //         theme: lightCodeTheme,
                //         darkTheme: darkCodeTheme,
                // },
        },
};

module.exports = config;
