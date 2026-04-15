import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '小红书二奢商家服务助手',
  description: '二奢商家入驻、运营、案例一站式查询平台',
  lang: 'zh-CN',
  base: process.env.VERCEL ? '/' : '/xhs-merchant-hub/',
  appearance: false,

  themeConfig: {
    siteTitle: '小红书二奢商家服务助手',

    nav: [
      { text: '首页', link: '/' },
      { text: '入驻指南', link: '/入驻指南/index' },
      { text: '优秀案例', link: '/优秀案例/index' },
      { text: '运营玩法', link: '/运营玩法/index' },
      { text: '常见问题', link: '/常见问题/index' },
      { text: 'AI 助手', link: '/ai-assistant' },
    ],

    sidebar: {
      '/入驻指南/': [
        {
          text: '入驻指南',
          items: [
            { text: '入驻概览', link: '/入驻指南/index' },
            { text: '资质要求', link: '/入驻指南/资质要求' },
            { text: '入驻流程', link: '/入驻指南/入驻流程' },
            { text: '注意事项', link: '/入驻指南/注意事项' },
          ]
        }
      ],
      '/优秀案例/': [
        { text: '优秀案例', items: [{ text: '案例概览', link: '/优秀案例/index' }] }
      ],
      '/运营玩法/': [
        { text: '运营玩法', items: [{ text: '玩法概览', link: '/运营玩法/index' }] }
      ],
      '/常见问题/': [
        { text: '常见问题', items: [{ text: '问题总览', link: '/常见问题/index' }] }
      ],
    },

    footer: {
      message: '小红书二奢商家服务助手',
      copyright: '© 2026 可爱的RED小助理 · 持续更新中'
    },

    search: { provider: 'local' },

    outline: { label: '本页目录', level: [2, 3] },

    lastUpdated: { text: '最近更新' },
  }
})
