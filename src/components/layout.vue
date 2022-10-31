<template lang="pug">
.layout(:class="coll?'openSidebar':'closeSidebar'")
    .left
        .logo(@click="proxy.$link('/home')")
            h2 平台
        .menu
            el-menu(:default-active="act",:collapse="!coll")
                el-menu-item(index="/home", @click="$link('/home')")
                    el-icon
                        House
                    span 首页
                template(v-if="store.getters.menuList", v-for="it in store.getters.menuList")
                    el-sub-menu(v-if="it.children", :index="it.path")
                        template(#title)
                            el-icon
                                component(:is="it.meta.icon")
                            span {{it.meta.title}}
                        .el-menu-item-group(v-for="item in it.children", @click="tabClick(item)")
                            el-menu-item(:index="item.path")
                                el-icon
                                    component(:is="item.meta.icon")
                                span {{item.meta.title}}
                    
    .right
        .view-head
            .head-left
                el-icon(:size="25")
                    Fold(@click="coll=!coll")
                span {{navName}}
            .head-right
                el-icon(:size="28",@click="screenClick")
                    FullScreen
                el-dropdown(v-if="state")
                    span() {{state.username}}
                        el-icon(:size="20")
                            arrow-down
                    template(#dropdown)
                        el-dropdown-menu(@click="proxy.$message('功能未开发,敬请期待!!!', 'error')") 更换主题
                        el-dropdown-menu(@click="dialogAmend=true") 修改密码
                        el-dropdown-menu(@click="dialogVisible=true") 退出登录
        .view-con
            // router-view
            router-view(v-slot="{Component}")
                transition(name="fade",mode="out-in")
                    component(:is="Component")
    // 修改密码
    el-dialog(v-model="dialogAmend" title="修改密码" width="28%" :close-on-click-modal='false' :close-on-press-escape='false' :before-close="handleClose")
        el-form(:model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px")
            el-form-item(prop="password" label="原密码")
                el-input(v-model="ruleForm.password" placeholder="请输入原密码" clearable show-password)
            el-form-item(prop="newPassword" label="新密码")
                el-input(v-model="ruleForm.newPassword" placeholder="请输入新密码(6位数字)" clearable show-password)
            el-form-item(prop="confirmPwd" label="确认新密码")
                el-input(v-model="ruleForm.confirmPwd" placeholder="请确认新密码" clearable show-password)
            el-form-item
                el-button(type="primary" @click="onSubmit") 确定
// 退出登录框
el-dialog(v-model="dialogVisible", title="提示",width="30%")
    p 你确定要退出吗?
    template(#footer)
        span.dialog-footer
            el-button(@click="dialogVisible = false") 取消
            el-button(type="primary",@click="logout") 确定



</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import { validaDrawPwd } from '@js/validate.js'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import screenfull from 'screenfull'
import { menuData } from '@js/com'

const { proxy } = getCurrentInstance()
const store = useStore()
const state = store.getters.getInfo
const router = useRouter()

const coll = ref(true)
const dialogVisible = ref(false)
const navName = ref(router.currentRoute.value.name)
const act = ref(router.currentRoute.value.path)
const dialogAmend = ref(false)
const ruleFormRef = ref(null)
const ruleForm = ref({
    password: null,
    newPassword: null,
    confirmPwd: null,
})
const newPassFn = (rule, value, callback) =>{
    if (!value || !validaDrawPwd(value)) { callback(new Error('请输入新密码(6位数字)')) } else { callback() }
}
const confirmPassFn = (rule, value, callback) =>{
    if (value != ruleForm.value.newPassword) { callback(new Error('两次输入密码不一致!')) } else { callback() }
}
const rules = ref({
    password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
    newPassword: [{ required: true, validator: newPassFn, trigger: 'blur' }],
    confirmPwd: [{ required: true, validator: confirmPassFn, trigger: 'blur' }],
})

// 初始化数据
onMounted(() => {

})

const tabClick = (it) => {
    proxy.navName = it.title
    proxy.act = it.path
    proxy.$link(it)
}
// 点击是否全屏，使用screenfull插件
const screenClick = () => {
    if(!screenfull.isEnabled){
        proxy.$message('你的浏览器不支持', 'warning')
        return false
    }
    screenfull.toggle()
}
const logout = () => {
    store.dispatch('Logout').then((res) =>{
        dialogVisible.value = false
    })
}

const onSubmit = () =>{
    ruleFormRef.value.validate(valid =>{
        if (!valid) return false
        var data = {
            username: state.username,
            password: ruleForm.value.password,
            newPassword: ruleForm.value.newPassword,
        }
        proxy.$post('password/updatePwd', data).then((res) =>{
            if (res&&res.code==200){
                store.dispatch('Logout').then((res) => {})
            }
        })
    });
}
const handleClose = () =>{
    ruleFormRef.value.resetFields()
    dialogAmend.value = false
}

</script>
<style scoped lang="stylus">
.el-dropdown-menu
    width: 100px;
    height: 45px;
    border: none;
    color: #666;
    border-radius: 0;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    cursor: pointer;
    &:hover
        background-color: #d5e0ea61
    &:last-child
        border-top: 1px solid #f2f2f2

</style>