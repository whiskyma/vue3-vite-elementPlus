import { createRouter, createWebHashHistory} from 'vue-router'
// import store from '@/utils/store'
const routerHistory = createWebHashHistory() //普通模式
import layout from '@comp/layout'

export const mainRoutes = [
    {path: '/login', meta: {title: '登录'}, component:() => import('@comp/login')},
    {path: '/404', meta: {title: '404'},component:() => import('@comp/404')},
    {
        path: '/',
        component: layout,
        redirect: '/home',
        meta: { title: '首页', icon: 'Comment'},
        children: [
            { path: 'home', meta: {title: '首页', icon: 'Comment'}, component:() => import('@comp/home')},
            // { path: 'activity/banner', component:() => import('@views/activity/banner'), meta: { title: '首页活动', icon: 'Calendar'}},
        ]
    },
    // {path: '/:pathMatch(.*)*/', redirect: '/home'} //vue-router4路由重定向的匹配规则
];
const router = createRouter({
    history: routerHistory,
    scrollBehavior: () => {
        y: 0
    },
    routes: mainRoutes
})

export default router