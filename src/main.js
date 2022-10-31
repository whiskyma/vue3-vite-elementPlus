import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@js/store'
const app = createApp(App)
import i18n from '@/lang'
import * as ELIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { menuData, setLocal, getLocal } from '@js/com.js'
import * as directives from '@comp/directives'
// console.log(directives)

Object.keys(directives).forEach(key => {  //Object.keys() 返回一个数组，值是所有可遍历属性的key名
    app.directive(key, directives[key])  //key是自定义指令名字；后面应该是自定义指令的值，值类型是string
})


// 引入公共样式
import '@styl/app.styl'
// 引入工具类
import comUtils from '@js/index.js'

// 统一注册Icon图标 
for (let key in ELIcons) {
    app.component(key, ELIcons[key])
}


// 路由导航守卫beforeEach---控制路由权限
const whiteList = ['/login']
let registerRouteFresh = true  //记录动态路由是否被添加
router.beforeEach((to, from, next) => {
    if(store.getters.token){
        if(/^\/login$/.test(to.path)){
            next('/home')
        }
        console.log(123456)
        console.log(store.getters.routers)
        if(store.getters.routers.length==0){
            console.log('首次加载。。。')
            let arr = [];
            menuData.filter((it, inx) => {
                console.log(123)
                let child = [];
                if(it.children&&it.children.length){
                    it.children.filter((item, index) => {
                        child.push({
                            path: item.path,
                            buttons: ['added'],
                            meta:{title: item.meta.title, icon: item.meta.icon},
                            component:() => import(`./views/${item.path}`),
                        })
                    })
                }
                arr.push({
                    path: it.path,
                    buttons: ['add'],
                    meta:{title: it.meta.title, icon: it.meta.icon},
                    component:()=> import('@comp/layout'),
                    children: child
                })
            })
            if(registerRouteFresh){
                arr.forEach((it,inx) => {
                    router.addRoute(it); //addRoute是router4.0的用法，addRoutes已废弃
                    next({...to, replace: true});
                    registerRouteFresh = false
                })
            }
            store.commit('SET_MENULIST', arr)
            store.commit('SET_ROUTERS', arr);
            next()
        }else{
            next()
        }
    }else{
        if(whiteList.indexOf(to.path) !== -1){
            next()
        }else{
            next(`/login`)
        }
    }
    if(to.meta.title){
        document.title = to.meta.title + '-' + '后台管理系统' || '后台管理系统'
    }
})

window.vm = app.use(router).use(store).use(comUtils).use(i18n).mount('#app')
