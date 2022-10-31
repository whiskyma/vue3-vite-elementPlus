<template lang="pug">
div
    div.tb-form
        el-form-item(label="标题")
            el-input(v-model="options.title" placeholder="请输入标题" clearable)
        el-form-item(label="消息类型")
            el-select(v-model="options.type" placeholder="请输入消息类型")
                el-option(label="全部类型" value='')
                el-option(label="系统公告" value=1)
                el-option(label="站内信" value=2)
                el-option(label="公告" value=3)
        el-form-item(label="")
            el-button(type="primary" @click="search") 搜索
            el-button(@click="dialogVisible=true" v-permission="['auto.add']") 新增
    el-table(:data="tableData" border style="width: 100%",v-if="tableData")
        el-table-column(prop="title" label="标题" width="180")
        el-table-column(prop="content" label="内容")
        el-table-column(prop="type" label="消息类型" width="160")
            template(v-slot:default="scope")
                p {{scope.row.type==1?'系统公告':scope.row.type==2?'站内信':'公告'}}
        el-table-column(prop="time" label="创建时间" width="240")
            template(v-slot:default="scope")
                p {{$formatDate(scope.row.time)}}
        el-table-column(label="操作" width="200")
            template(v-slot:default="scope")
                el-button(link type="primary" size="small" @click="openDet(scope.row)") 详情
                el-button(link type="primary" size="small" @click="openDel(scope.row.id)") 删除
    //- 分页
    div.pagination(v-if="tableData")
        el-config-provider(:locale="local")
            el-pagination(
            v-model:currentPage="page"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange")

    //- 新增
    el-dialog(v-model="dialogVisible" title="新增" width="32%" :close-on-click-modal='false' :close-on-press-escape='false' :before-close="handleClose")
        el-form(:model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px")
            el-form-item(prop="title" label="标题")
                el-input(v-model="ruleForm.title" placeholder="请输入标题" clearable)
            el-form-item(prop="content" label="内容")
                el-input(v-model="ruleForm.content" placeholder="请输入内容" clearable)
            el-form-item(prop="type" label="消息类型")
                el-select(v-model="ruleForm.type" placeholder="请输入消息类型")
                    el-option(label="系统公告" value=1)
                    el-option(label="站内信" value=2)
                    el-option(label="公告" value=3)
            el-form-item(prop="time" label="时间")
                el-config-provider(:locale="local")
                    el-date-picker(v-model="ruleForm.time" type="datetime" placeholder="请选择日期" value-format="YYYY-MM-DD HH-mm-ss")
            el-form-item
                el-button(type="primary" @click="onSubmit") 确定

    //- 详情或删除
    el-dialog(v-model="dialogDet" title="提示" width='35%')
        div(v-if="detOptions")
            h3 {{detOptions.content}}
            br
            p(style="text-align: right;") {{$formatDate(detOptions.time)}}
        h3(v-else) 你确定要删除吗？
        template(#footer)
            span.dialog-footer
                el-button(v-if="!detOptions" @click="dialogDet=false") 取消
                el-button(v-if="!detOptions" type="primary" @click="del") 确定
    
</template>

<script setup>
import zhcn from 'element-plus/lib/locale/lang/zh-cn'
import { ref, getCurrentInstance, onMounted } from 'vue'
const { proxy } = getCurrentInstance();
const local = ref(zhcn);
const options = ref({
    title: '',
    type: '',
    page: 1,
    pageSize: 10
})
const ruleForm = ref({
    title: null,
    content: null,
    type: null,
    time: null
})
const rules = ref({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    type: [{ required: true, message: '请输入消息类型', trigger: 'blur' }],
    time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
})

const tableData = ref(null)
const dialogVisible = ref(false)
const ruleFormRef = ref(null)
const dialogDet = ref(false)
const detOptions = ref(null)
const delId = ref(null)


const page = ref(1)
const pageSize = ref(10)
const total = ref(null)

const handleCurrentChange = (val) =>{
    // console.log(val)
    options.value.page = val
    // console.log(options.value.page)
    search()
}

const handleSizeChange = (val) =>{
    options.value.pageSize = val
    search()
}

onMounted(() => {
    getData()
})

const getData = function(){
    proxy.$get('notice/getNotice', options.value).then(res =>{
        tableData.value = res.list
        total.value = res.total;
        // console.log(res.list)
    });
}
const onSubmit = () => {
    ruleFormRef.value.validate(valid =>{
        if(!valid) return false
        // console.log(proxy.ruleForm)
        proxy.$post('notice/add', ruleForm.value).then((res) =>{
            proxy.$message('添加成功', 'success')
            ruleFormRef.value.resetFields()
            dialogVisible.value = false;
            getData()
        })
    });
};
const handleClose = function(){
    ruleFormRef.value.resetFields()
    dialogVisible.value = false
}

const search  = () =>{
    // console.log(options.value)
    proxy.$get('notice/search', options.value).then((res) => {
        tableData.value = res.list
        total.value = res.total;
    })
}

const openDel = (id) =>{
    detOptions.value = null;
    dialogDet.value = true;
    delId.value = id;
}
const del = () => {
    proxy.$post('notice/delete', { id: delId.value }).then((res) =>{
        proxy.$message('删除成功', 'success')
        dialogDet.value = false;
        getData()
    })
}

const openDet = (it) => {
    dialogDet.value = true;
    detOptions.value = it;
}
</script>
<style scoped>


</style>