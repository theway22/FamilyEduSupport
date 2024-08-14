<template>
    <div  class="mypanel">
        <div class="hd">
            [{{ psColumn.pageName }}]板块管理
        </div>

        <div class="bd">
        <!-- 搜索控件结束 -->
        <div class="action-details">
            <el-button-group>
                <el-button @click="deleteRec"><i class="el-icon-delete"></i>删除</el-button>
                <route-button icon="el-icon-setting" type="primary" :url="`/admin/psitemadd?pageid=${psColumn.pageId}`"><i class="el-icon-plus"></i>添加板块</route-button>
            </el-button-group>
        </div>
        <table  width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr>
                <th>
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>

                <th><b>板块名</b></th>
                <th><b>板块类型</b></th>
                <th>
                    操作
                </th>
            </tr>
            </thead>
            <tbody>

            <tr v-show="listPsitem.length==0">
                <td colspan="20">
                    没有相关页面信息
                </td>
            </tr>

            <tr v-for="psitem in listPsitem" :key="psitem.id">
                <td>
                    <input class="check" name="ids" type="checkbox" v-model="psitem.rowSelected"
                           :value="psitem.id"/>
                </td>
                <td>{{psitem.lmName}}</td>
                <td>
                    <span v-if="psitem.lmType==1">资讯</span>
                    <span v-if="psitem.lmType==2">教育服务板块</span>
                    <span v-if="psitem.lmType==3">课程</span>

                </td>

                <td>
                    <span  title="删除" @click="deleteOne(psitem.id)" class="el-button el-button--danger" ><i class="fa fa-trash-o"></i></span>

                </td>
            </tr>

            </tbody>
        </table>
        </div>
    </div>

</template>

<script>
export default {
    name: "psitemmanager",
    data () {
        return {
            hostHead:this.$app.contextPath,
            name:"",
            selectedAll:false,
            listPsitem:[],
            psColumn:{}

        }
    },
    created () {
        this.search();
    },
    methods:{
        async search(){
            let url="admin/psitem/list";
            let pageid=this.$route.query.pageid;
            let param={
                pageid
            };
            let { data:res }=await this.$http.post(url,param);
            if(res!=null&&res.data!=null){
                this.psColumn=res.data;
                this.listPsitem=this.psColumn.psItemVos;
            }
        },
        selectedAllHandler(){
            console.log(this.selectedAll);
            if(this.listPsitem!=null){
                this.listPsitem.forEach(c=>{
                    c.rowSelected=!this.selectedAll;
                });
            }
        },
        deleteRec(){
            let hasChecked=this.listPsitem.some(c=>{
                return c.rowSelected==true;
            });
            if(!hasChecked){
                this.$alert('请选择需要删除的记录', '系统提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            let ids=this.listPsitem.filter(c=>c.rowSelected).map(c=>c.id);
            console.log("ids",ids);
            this._doDelete({ids});
        },
        deleteOne(id){
            let ids=[];
            ids.push(id);
            this._doDelete({ids});
        },
        async _doDelete(options){
            let defaultOptions={
                ids:[]
            };
            Object.assign(defaultOptions,options);
            let url="admin/psitem/delete";
            let confirm= await this.$confirm('是否要删除信息?', '系统提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            });
            if(defaultOptions.ids==null||defaultOptions.ids.length<=0)
                return;
            let {data:res}=await this.$http.post(url, {ids:defaultOptions.ids},{emulateJSON:false});
            if (res.stateCode > 0) {
                this.$message({
                    message:"删除成功",
                    type:'success',
                    duration:3000
                });
                this.search();
            }
        }
    }
}
</script>

<style scoped>

</style>
