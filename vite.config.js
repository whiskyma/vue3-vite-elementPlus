import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression';
import unocss from 'unocss/vite'  //引入unocss

function getDay() {
    const myDate = new Date();
    return 'admin' + myDate.getFullYear() +
        bu0(myDate.getMonth() + 1) +
        bu0(myDate.getDate()) +
        bu0(myDate.getHours()) +
        bu0(myDate.getMinutes());
}
function bu0(t) {
    return t<10?'0'+t:t
}
const distTime = getDay()

export default defineConfig(({command, mode}) => {
    // const env = loadEnv(mode, process.cwd(), '')
    // 获取当前环境的配置
    const config = loadEnv(mode, './')
    return {
        plugins: [
            vue(),
            // 自动引入组件和自动注册 new add
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'gzip',
                ext: '.gz',
            }),
            unocss() //引入unocss
        ],
        base: loadEnv(mode, process.cwd()).DEV ? './':'./',
        publicDir: "public",
        server: {
            host:'0.0.0.0', //自动获取本地ip
            port: '8888',
            open: false,
            proxy: {
                '/adminapi': {
                    // target: 'http://127.0.0.1:3000/',
                    // target: 'http://mqy5878.cn/',
                    target: config.VITE_BASIC_API,
                    changeOrigin: true,
                },
            }
        },
        cors: true, // 默认启用并允许任何源
        resolve: {
            // 配置别名
            alias: {
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                "@": resolve(__dirname, "src"),
                "@comp": resolve(__dirname, "src/components"), //公共组件
                "@views": resolve(__dirname, "src/views"), //视图组件
                "@styl": resolve(__dirname, "src/assets/styl"), //样式
                "@img": resolve(__dirname, "src/views/images"), //图片
                "@js": resolve(__dirname, "src/utils"), //js
            },
            // 导入时想要省略的扩展名列表
            extensions:['.mjs','.js','.ts','.jsx','.tsx','.json','.vue']
        },
        build: {
            target: "modules", //浏览器兼容性  "esnext"|"modules"
            // outDir: `dist/${ distTime }`,
            outDir: 'admin',
            assetsDir: "assets",
            assetsInlineLimit: 4096,
            cssCodeSplit: true, //启用/禁用 CSS 代码拆分
            sourcemap: false,
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: { //静态资源分拆打包
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            }
        }
    }
})
