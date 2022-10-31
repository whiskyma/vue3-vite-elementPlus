// permission.js

//1,定义权限按钮---permission指令
export const permission = { 
    // mounted是指令的一个生命周期
    mounted(el, binding){
        const { value } = binding;
        // 获取用户的按钮权限
        const permissionBtn = sessionStorage.getItem('permissionBtn') || ['auto.add','auto.delete','auto.update']
        // console.log(permissionBtn)
        // 判断当前用户的按钮权限值是否符合数组类型，字符串类型也可以。
        if(value&&value.length>0&&value instanceof Array){
            const permissionFunc = value;
            //Array.some(), 数组中有一个结果是true返回true，剩下的元素不会再检测
            const hasPermission = permissionBtn.some((val) =>{
                return permissionFunc.includes(val)
            })
            // if(!hasPermission){
            //     el.style.display = 'none'
            // }
            if(!hasPermission){
                el.parentNode && el.parentNode.removeChild(el);
            }
        }else{
            // 如果后台配置按钮权限值不是数组，则抛出异常
            throw new Error(`配置权限的格式不对，例如 v-permission="['auto.add']" `)
        }
    }
}