import DefaultTheme from 'vitepress/theme'
import './custom.css'
import AiChat from './AiChat.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AiChat', AiChat)
  }
} satisfies Theme
