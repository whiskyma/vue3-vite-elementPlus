import { createApp } from 'vue';
import App from '../App.vue'
const app = createApp(App)

import { 
    formatDate, 
    trim, 
    link, 
    imgBg, 
    setLocal, 
    getLocal, 
    remLocal,
    get,
    post,
    message,
    messageBox
} from './com';

export default {
    install:(app) =>{
        app.config.globalProperties.$formatDate = formatDate;
        app.config.globalProperties.$trim = trim;
        app.config.globalProperties.$link = link;
        app.config.globalProperties.imgBg = imgBg;
        app.config.globalProperties.$setLocal = setLocal;
        app.config.globalProperties.$getLocal = getLocal;
        app.config.globalProperties.$remLocal = remLocal;
        app.config.globalProperties.$get = get;
        app.config.globalProperties.$post = post;
        app.config.globalProperties.$message = message;
        app.config.globalProperties.$messageBox = messageBox;

    }
}