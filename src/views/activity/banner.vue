<template lang="pug">
div
    //- 搜索栏
    el-form(:inline="true")
        el-form-item(label="活动ID")
            el-input.put-130(v-model="options.activityId" placeholder="请输入活动ID" clearable)
        el-form-item(label="活动标题")
            el-input.put-180(v-model="options.activityTitle" placeholder="请输入活动标题" clearable)
        el-form-item(label="活动类型")
            el-select.put-150(v-model="options.activityType" placeholder="请输入活动类型")
                el-option(label="全部类型" value='')
                el-option(label="最新活动" value=1)
                el-option(label="优惠活动" value=2)
        el-form-item(label="活动状态")
            el-select.put-150(v-model="options.status" placeholder="请输入活动状态")
                el-option(label="全部状态" value='')
                el-option(label="已上架" value=1)
                el-option(label="已下架" value=2)
        el-form-item(label="")
            el-button(type="primary" @click="search") 搜索
            el-button(@click="dialogVisible=true") 新增
    //- 表格
    el-table(:data="tableData" border style="width: 100%",v-if="tableData")
        el-table-column(prop="activityId" label="活动ID" width="90")
        el-table-column(prop="imageUrl" label="主图片" width="160")
            template(v-slot:default="scope")
                el-popover(:width="500" placement="right" v-if="scope.row.imageUrl")
                    template(#reference)
                        .imgbg(:style="imgBg(scope.row.imageUrl)")
                    template(#default)
                        img(:src="scope.row.imageUrl" style="width: 700px;border-radius: 8px;")
                .imgbg(:style="imgBg(scope.row.imageUrl)" v-else)
        el-table-column(prop="activityTitle" label="活动标题" width="180")
        el-table-column(prop="content" label="活动内容")
        el-table-column(prop="activityType" label="类型" width="120")
            template(v-slot:default="scope")
                p {{scope.row.activityType==1?'最新活动':'优惠活动'}}
        el-table-column(prop="status" label="状态" width="120")
            template(v-slot:default="scope")
                p {{scope.row.status==1?'已上架':'已下架'}}
        el-table-column(prop="createTime" label="创建时间" width="180")
            template(v-slot:default="scope")
                p {{$formatDate(scope.row.createTime)}}
        el-table-column(label="操作" width="200")
            template(v-slot:default="scope")
                el-button(link type="primary" size="small" @click="changeStatus(scope.row)") {{scope.row.status==1?'下架':'上架'}}
                el-button(link type="primary" size="small" @click="openDel(scope.row.activityId)") 删除
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
            el-form-item(prop="activityTitle" label="活动标题")
                el-input(v-model="ruleForm.activityTitle" placeholder="请输入活动标题" clearable)
            el-form-item(prop="content" label="活动内容")
                el-input(v-model="ruleForm.content" placeholder="请输入活动内容" clearable)
            el-form-item(prop="imageUrl" label="上传图片")
                el-upload(action="/adminapi/activity/upload/" :show-file-list="false" :on-success="onSuccess" :before-upload="upload" :on-remove="handleRemove")
                    img(v-if="imgUrl" :src="imgUrl")
                    Plus(v-else)
            el-form-item(prop="activityType" label="活动类型")
                el-select(v-model="ruleForm.activityType" placeholder="请输入活动类型")
                    el-option(label="最新活动" value=1)
                    el-option(label="优惠活动" value=2)
            el-form-item(prop="status" label="活动状态")
                el-select(v-model="ruleForm.status" placeholder="请输入活动状态")
                    el-option(label="上架" value=1)
                    el-option(label="下架" value=2)
            el-form-item
                el-button.put-90(type="primary" @click="onSubmit") 确定

    //--删除
    el-dialog(v-model="delId" title="提示" width='35%')
        h3 你确定要删除吗？
        template(#footer)
            span.dialog-footer(v-if="delId")
                el-button(@click="delId=null") 取消
                el-button(type="primary" @click="del") 确定
    
</template>

<script setup>
// import { imgBg } from '@js/com'
// import { da } from 'element-plus/es/locale';
import zhcn from 'element-plus/lib/locale/lang/zh-cn'
import { ref, getCurrentInstance, onMounted } from 'vue'
const { proxy } = getCurrentInstance();
const local = ref(zhcn);
// status -当前活动状态(1---上架，2---下架)
// activityType -当前活动类型(1---最新活动，2---优惠活动)
// console.log(import.meta.env.VITE_BASIC_API)
const options = ref({
    activityId: '',
    activityTitle: '',
    activityType: '',
    status: '',
    page: 1,
    pageSize: 10
})
const ruleForm = ref({
    activityTitle: null,
    content: null,
    imageUrl: null,
    activityType: null,
    status: null
})
const rules = ref({
    activityTitle: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
    activityType: [{ required: true, message: '请输入活动类型', trigger: 'blur' }],
    imageUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
    status: [{ required: true, message: '请输入活动状态', trigger: 'blur' }],
})

const tableData = ref(null)
const dialogVisible = ref(false)
const ruleFormRef = ref(null)
// const dialogDet = ref(false)
// const detOptions = ref(null)
const delId = ref(null)
const imgUrl = ref(null)

const page = ref(1)
const pageSize = ref(10)
const total = ref(null)

const handleCurrentChange = (val) =>
{
    // console.log(val)
    options.value.page = val
    // console.log(options.value.page)
    search()
}

const handleSizeChange = (val) =>
{
    options.value.pageSize = val
    search()
}

onMounted(() =>
{
    getData()
})

const getData = function ()
{
    proxy.$get('activity/getActivity', options.value).then(res =>
    {
        tableData.value = res.list
        total.value = res.total;
        // console.log(res.list)
    });
}
const onSubmit = () =>
{
    ruleFormRef.value.validate(valid =>
    {
        if (!valid) return false
        console.log(ruleForm.value)
        proxy.$post('activity/add', ruleForm.value).then((res) =>
        {
            proxy.$message('添加成功', 'success')
            ruleFormRef.value.resetFields()
            imgUrl.value = ""
            dialogVisible.value = false;
            getData()
        })
    });
};
const handleClose = function ()
{
    imgUrl.value = ""
    ruleFormRef.value.resetFields()
    dialogVisible.value = false
}

const search = () =>
{
    // console.log(options.value)
    proxy.$get('activity/search', options.value).then((res) =>
    {
        tableData.value = res.list
        total.value = res.total;
    })
}

const openDel = (id) =>
{
    // detOptions.value = null;
    // dialogDet.value = true;
    delId.value = id;
}
const del = () =>
{
    proxy.$post('activity/delete', { activityId: delId.value }).then((res) =>
    {
        proxy.$message('删除成功', 'success')
        delId.value = null;
        getData()
    })
}

const changeStatus = (it) =>{
    var data = {
        activityId: it.activityId,
        status: it.status
    }
    proxy.$post('activity/update', data).then((res) =>{
        proxy.$message('修改成功', 'success')
        getData()
    })

}

const onSuccess = (res, uploadFile) => {
    // console.log(res.data.imgUrl)
    console.log(uploadFile)
    let _imgUrl = import.meta.env.VITE_BASIC_API + res.data.imgUrl
    imgUrl.value = _imgUrl
    ruleForm.value.imageUrl = _imgUrl
}

const upload = (file) =>{
    // console.log(file.size)
    if (!/^(image\/png||image\/jpeg)$/.test(file.type) || file.type==''){
        proxy.$message('请上传jpeg和png格式的图片', 'warning')
        return false;
    }
    if (file.size / 1024 / 1024 > 2){
        proxy.$message('请上传图片不能超过2M', 'warning')
        return false;
    }
}

const handleRemove = () => {
    imgUrl.value = null
}

</script>
<style scoped>

</style>