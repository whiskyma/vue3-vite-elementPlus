<template lang="pug">
.home
    .avatar
    .userName(v-if="state") {{state.username}}
    ul(v-if="state")
        li 登录时间: 
        li {{state.loginTime}}
        li 登录地点: 
        li {{state.ip}}
        li 登录IP: 
        li {{state.ip}}
    p(v-for="it in 20") 阿斯蒂芬阿斯蒂芬
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance();
const store = useStore()
const state = store.getters.getInfo
// console.log(state)
onMounted(() => {
    // getBanner()
});

const getBanner = () => {
    proxy.$get('notice/getNotice').then(res => {
        console.log(res)
    });
}
</script>
<style scoped>

</style>