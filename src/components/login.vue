<template lang="pug">
.login
    .model
        h1 {{$t('docuTitle')}}
        .box
            h3 {{$t('login.titleSub')}}
            el-dropdown(trigger="click")
                .i18n
                span.el-dropdown-link 阿斯蒂芬
                template(#dropdown)
                    el-dropdown-item(@click="store.commit('SET_LOCALE', 'zh_CN')",:disabled="i18n.global.locale.value=='zh_CN'") 中文
                    el-dropdown-item(@click="store.commit('SET_LOCALE', 'en_US')",:disabled="i18n.global.locale.value=='en_US'") 英文
            el-form(:model="ruleForm",:rules="rules",ref="ruleFormRef",@submit.native.prevent)
                el-form-item(prop="username")
                    el-input(v-model="ruleForm.username",:placeholder="$t('login.namePlace')",clearable,:prefix-icon="User")
                el-form-item(prop="password")
                    el-input(v-model="ruleForm.password",:placeholder="$t('login.pwdPlace')",clearable,show-password,:prefix-icon="Lock")
                el-form-item.checkbox
                    el-checkbox(:label="$t('login.auto')",v-model="checked")
                    p(@click="proxy.$message($t('login.noka'), 'error')") {{$t('login.forget')}}
                el-form-item
                    el-button(type="primary",round,:loading="loading",@click.native.prevent="onSubmit") {{$t('login.log')}}
    .login-footer
        p {{$t('login.beian')}}
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import i18n from '@/lang'
import { useRouter } from 'vue-router'
const store = useStore();
const { proxy } = getCurrentInstance()
const router = useRouter()


const ruleForm = ref({
    username: null,
    password: null,
})
const getInfoes = ref({
    username: null,
    loginIp: '192.168.1.4',
    loginTime: Date.now(),
})
const ruleFormRef = ref(null)
const loading = ref(false)
const checked = ref(false)


// 初始化调用
onMounted(() => {
    // 监听键盘enter事件
    window.addEventListener('keydown', keyDown)
    
    // 登录状态禁止路由到登录页
    // let _path = proxy.$router.currentRoute.value.path
    // if (store.state.token && (/^\/login$/).test(_path)){
    //     proxy.$link('/home')
    // }
})

const rules = ref ({
    username: [{ required: true, message: i18n.global.t('login.namePlace'), trigger: 'blur' }],
    password: [{ required: true, message: i18n.global.t('login.pwdPlace'), trigger: 'blur' }]
})

const onSubmit = () =>{
    ruleFormRef.value.validate(valid =>{
        if (!valid){
            return false
        }
        loading.value = true
        proxy.$link('/home')
        store.dispatch('Login', ruleForm.value).then(res =>{
            if (res&&res.code==200){
                proxy.$message('登录成功');
                loading.value = false
                router.push('/home')
            }
        }).finally(_ =>{
            loading.value = false
        });
    });
};
const keyDown = (e) =>{
    if(e.keyCode == 13){
        onSubmit()
    }
}
</script>
<style scoped>

</style>