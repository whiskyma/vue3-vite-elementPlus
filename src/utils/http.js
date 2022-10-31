import axios from 'axios'
import store from '@js/store'
import { message, messageBox } from './com'
import qs from 'qs'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const service = axios.create({
    baseURL: '/adminapi',
    timeout: 50000
});
service.interceptors.request.use(
    config => {
        // console.log(config)
        const token = store.state.token;
        token && (config.headers.Authorization = token);
        config.data = config.data?qs.stringify(config.data):'';
        NProgress.start();
        return config;
    },
    err => {
        NProgress.done();
        return Promise.reject(err);
    }
);

service.interceptors.response.use(
    response => {
        NProgress.done()
        let _res = response.data;
        // console.log(_res);
        // console.log(_res.code);
        // token失效处理及用户登录未授权处理（状态码需与后台人员保持一致）
        if(/^(401|-1003|-1009)$/.test(_res.code)){
            store.dispatch('Logout');
        }
        if(_res.code==200){
            return Promise.resolve(_res.data || _res);
        }else{
            if(_res.errMsg) message(_res.errMsg, 'warning');
            return Promise.resolve(_res.data || _res);
        }
    },
    error => {
        console.log(error)
        let _status = error.response.status
        if(_status){
            switch(_status) {
                case 400:
                    message('错误请求', 'warning');
                    break;
                case 401:
                    messageBox('未授权,或登录已过期,请重新登录。',() =>{
                        store.dispatch('Logout');
                    })
                    break;
                case 403:
                    messageBox('未授权,或登录已过期,请重新登录。',() =>{
                        store.dispatch('Logout');
                    })
                    break;
                case 404:
                    message('请求地址不存在', 'warning');
                    break;
                case 500:
                    message('服务器内部错误', 'warning');
                    break;
                default:
                    message(error.message?error.message:'服务器通讯故障', 'warning');
            }
        }else{
            message('服务器通讯故障', 'warning');
        }
        NProgress.done()
        return Promise.reject(error)
	}
);


export default service;
