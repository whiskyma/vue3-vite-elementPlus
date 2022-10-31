<template lang="pug">
div.container_404(@click="proxy.$link('/home')")
    el-button(type="primary") 返回home
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

</script>
<style scoped>

</style>