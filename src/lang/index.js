import { createI18n } from 'vue-i18n'
import elementEnLocale from 'element-plus/es/locale/lang/en'
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from './en'
import zhLocale from './zh'

const messages = {
    zh_CN: {
        ...zhLocale,
        ...elementZhLocale
    },
    en_US: {
        ...enLocale,
        ...elementEnLocale
    }
}

// 创建 i18n
const i18n = createI18n({
    legacy: false,
    globalInjection: true, // 全局模式，可以直接使用 $t
    locale: localStorage.getItem('lang') || 'zh_CN',
    messages,
})


export default i18n