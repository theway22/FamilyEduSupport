<template>
    <div class="mypanel">

        <div class="hd">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path:'/admin/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a :href="'/admin/pagesettingmanager'">页面管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>新增板块</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="bd">
           <table  width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr>

                <th><b>板块</b></th>
                <th><b>类型</b></th>
                <th><b>是否加入</b></th>
                <th>
                    操作
                </th>
            </tr>
            </thead>
            <tbody>

            <tr v-show="listLanmu.length==0">
                <td colspan="20">
                    没有相关板块信息
                </td>
            </tr>

            <tr v-for="lanmu in listLanmu" :key="lanmu.id">

                <td>{{lanmu.lmname}}</td>
                <td>
                    <span v-if="lanmu.lmtype==1">文章</span>
                    <span v-if="lanmu.lmtype==2">教育服务</span>
                    <span v-if="lanmu.lmtype==3">视频</span>
                    <span v-if="lanmu.lmtype==6">期刊</span>
                </td>
                <td>
                    <span v-if="lanmu.pageid==null">未加入</span>
                    <span v-else>已加入</span>
                </td>
                <td>
                    <span v-if="lanmu.pageid==null" title="加入板块" @click="addToPage(lanmu.lmid,pageid)" class="btn btn-danger" ><i class="fa fa-plus"></i>加入</span>

                </td>
            </tr>

            </tbody>
        </table>
        </div>
    </div>

</template>

<script>
export default {
    name: "psitemadd",
    data(){
        return{
            hostHead:this.$app.contextPath,
            name:"",
            pageid:0,
            listLanmu:[]
        }
    },
    created(){
        this.search();
    },

    methods:{
        async  search(){
            this.pageid=this.$route.query.pageid;
            console.log("pageid=",this.pageid);
            if(this.pageid!=null){
                let url="admin/psitem/load";
                let {data:res}=await this.$http.post(url,{pageid:this.pageid});
                console.log("res",res);
                if(res!=null&&res.data!=null)
                    this.listLanmu=res.data;
            }
        },
        async addToPage(lmid,pageid){

            let url="admin/psitem/save";
            let {data:res}= await this.$http.post(url, {pageid,lmid},{emulateJSON:false});
            if(res.stateCode<=0){
                this.$alert('提交异常', '系统提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.search();

        }


    }
}
</script>

<style scoped>

</style>
