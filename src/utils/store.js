import { createStore } from 'vuex'
import router from '@/router'
import i18n from '@/lang'
import { post, get, setLocal, getLocal, remLocal, menuData } from '@/utils/com'

const store = new createStore({
    state: {
        token: localStorage.getItem('token') || null,
        getInfo: JSON.parse(localStorage.getItem('getInfo')) || null,
        menuList: JSON.parse(localStorage.getItem('menuList')) || null,
        locale: localStorage.getItem('lang') || 'zh_CN',
        routers: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_GETINFO: (state, getInfo) => {
            state.getInfo = getInfo
        },
        SET_BGCOLOR: (state, bgColor) => {
            state.bgColor = bgColor
        },
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList
        },
        SET_LOCALE: (state, locale) => {
            state.locale = locale
            setLocal('lang', locale)
            i18n.global.locale.value = locale
        },
        SET_ROUTERS: (state, routers) => {
            state.routers = routers; //设置动态路由表
        }
	},
    getters:{
        token: state => state.token,
        getInfo: state => state.getInfo,
        menuList: state => state.menuList,
        bgColor: state => state.bgColor,
        routers: state => state.routers
    },
    actions: {
        // 账户登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                post('admin/login', userInfo).then(res => {
                    if(res&&res.code===200){
                        // console.log(res)
                        commit('SET_TOKEN',res.token)
                        setLocal('token',res.token)
                        commit('SET_GETINFO',res)
                        setLocal('getInfo',res)
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 拉取菜单列表
        MenuList({ commit }, id) {
            return new Promise((resolve, reject) => {
                post('user/listMenu', id).then(res => {
                    if(res&&res.resCode==1){
                        setLocal('menuList',res.resObj)
                        commit('SET_MENULIST',res.resObj)
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 清除所有的本地缓存
        Logout({ commit }) {
            return new Promise((resolve) => {
                remLocal();
                commit('SET_TOKEN', null)
                commit('SET_GETINFO', null)
                // commit("SET_MENULIST", null)
                router.push('/login')
                resolve()
                window.location.reload()
            })
        }
    }
})

export default store
