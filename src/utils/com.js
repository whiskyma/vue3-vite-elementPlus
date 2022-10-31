import router from '@/router'
import request from './http'
import { ElMessage, ElMessageBox } from 'element-plus'

// 时间戳转换
export const formatDate = ((value) => {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
})

// 清除首尾空的字符串
export const trim = ((val) => {
    return val&&val.replace(/\s/g, "").toLowerCase();
})

// 路由跳转
export const link = ((url) => {
    if(!url){return}
    if(/^http/.test(url)){
        window.open(url);
    }else{
        router.push(url);
    }
})

// 图片
export const imgBg = ((url) => {
    if (!url) return false
    return 'background-image:url(' + url + ')'
})

// 存值
export const setLocal = ((key, value) =>{
    if(typeof value === 'string'){
        localStorage.setItem(key, value);
    }else{
        localStorage.setItem(key, JSON.stringify(value));
    }
})

// 取值
export const getLocal = ((key) =>{
    return key&&JSON.parse(localStorage.getItem(key))|| null;
})

// 删值
export const remLocal = ((key) =>{
    if(key){
        localStorage.removeItem(key);
    }else{
        localStorage.clear();
    }
})

// get
export const get = ((url, param) =>{
    if(param){
        let nd="?";
        let xx = Object.entries(param);
        xx.forEach((val) => {
            if(val[1] || val[1] == 0){
                nd+=val[0]+'='+val[1]+'&'
            }
        });
        url = url+nd.replace(/&$/,'');
    }
    return request({url: url, method: 'get'})
})

// post
export const post = ((url, param) =>{
    if(param){
        return request({url: url, method: 'post',data: param})
    }
})

// message
export const message = ((msg, type='success') => {
    if(msg){
        ElMessage({
            message: msg,
            type: type,
        })
    }
})

// ElMessageBox
export const messageBox = ((msg, fun) => {
    if(msg){
        ElMessageBox.alert(msg, '提示', {
            confirmButtonText: /重新登录/.test(msg)?'重新登录':'确定',
            callback: fun
        })
    }
})

// 菜单mock数据
export const menuData = [
    {
        path: '/activity',
        meta: {title: '活动管理', icon: 'Present'},
        buttons: [],
        children: [{
            path: '/activity/banner',
            meta: {title: '首页活动', icon: 'Calendar'},
            buttons: ['auto.add']
        }]
    },{
        path: '/notice',
        meta: {title: '消息中心', icon: 'Comment'},
        children: [{
            path: '/notice/history',
            meta: {title: '消息管理', icon: 'ChatLineRound'},
            buttons: ['auto.delete']
        }]
    }
]