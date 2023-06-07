import DefaultTheme from 'vitepress/theme'
import { EnhanceAppContext } from "vitepress";
import ClickToIFrame from "./ClickToIFrame.vue";
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.component('click-to-iframe', ClickToIFrame)
  }
}
