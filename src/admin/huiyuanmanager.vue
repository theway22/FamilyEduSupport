<template>
    <div class="mypanel">

        <div class="hd">
           会员管理
        </div>

        <div class="bd">
        <!-- 搜索控件开始 -->
        <div class="search-options">


            <table  cellspacing="0" width="100%">
                <tbody>

                <tr>
                    <td>



                        账号:<input name="accountname" @keyup.enter="search"  v-model="accountname"  class="input-txt" type="text"   />

                        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
        <!-- 搜索控件结束 -->

        <div class="action-details">
            <el-button-group>

                <el-button @click="deleteRec"  type="danger" icon="el-icon-delete"> 删除</el-button>

                <router-link class="el-button el-button--warning" to="/admin/huiyuanadd">新增会员</router-link>
            </el-button-group>
        </div>

        <table  width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr >
                <th >
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>



                <th><b>账号</b></th>
                <th><b>邮箱</b></th>
                <th><b>姓名</b></th>
                <th><b>办卡时间</b></th>
                <th><b>性别</b></th>
                <th><b>余额</b></th>

                <th>
                    操作
                </th>

            </tr>

            </thead>
            <tbody>


            <tr v-for="(huiyuan) in  listHuiyuan" :key="huiyuan.id">
                <td>
                    <input  class="check" name="ids" type="checkbox" v-model="huiyuan.rowSelected" />


                </td>
                <td>
                    {{huiyuan.accountname}}
                </td>
                <td>
                    {{huiyuan.email}}
                </td>

                <td>
                    {{huiyuan.name}}
                </td>
                <td>
                    {{huiyuan.regdate}}
                </td>

                <td>
                    {{huiyuan.sex}}
                </td>
                <td>
                    {{huiyuan.yue}}¥
                </td>

                <td >
                    <div class="el-button-group">

                        <route-button icon="el-icon-edit" :url="`/admin/huiyuanadd?id=${huiyuan.id}`">编辑</route-button>
                        <span class="el-button el-button--warning" @click="showInfo(huiyuan)" ><i class="el-icon-info"></i>查看</span>

                    </div>
                </td>
            </tr>

            <tr v-if="listHuiyuan.length==0">
                <td colspan="20">
                    没有相关会员信息
                </td>
            </tr>


            </tbody>
        </table>


        <el-pagination
            @size-change="pagesizeChange"
            @current-change="pageindexChange"
            :current-page="pageindex"
            :page-sizes="[pagesize]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>


            <el-dialog title="查看会员信息" :visible.sync="infodlg">

                <table cellpadding="0" cellspacing="1" class="smart-table" border="1" width="100%">
                    <tr>
                        <td align="right" class="title">用户名:</td>
                        <td>
                            {{huiyuan.accountname}}
                        </td>
                        <td colspan="2" rowspan="6"><img  width="200px"
                                                          height="200px" :src="hostHead+huiyuan.touxiang" /></td>
                    </tr>
                    <tr>
                        <td align="right" class="title">姓名:</td>
                        <td>{{huiyuan.name}}</td>
                    </tr>


                    <tr>
                        <td align="right" class="title">申请时间:</td>
                        <td>
                            {{huiyuan.regdate}}
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="title">身份证号:</td>
                        <td>{{huiyuan.idcardno}}</td>
                    </tr>



                    <tr>
                        <td align="right" class="title">邮箱:</td>
                        <td>{{huiyuan.email}}</td>
                    </tr>
                    <tr>
                        <td align="right" class="title">移动电话:</td>
                        <td>{{huiyuan.mobile}}</td>
                    </tr>
                    <tr>
                        <td align="right" class="title">账户余额:</td>
                        <td>{{huiyuan.yue}}¥</td>
                    </tr>


                    <tr>
                        <td align="right" class="title">说明:</td>
                        <td colspan="3">
                        <div v-html="huiyuan.des"></div>
                        </td>
                    </tr>

                </table>


            </el-dialog>


        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "huiyuanmanager",
        data(){
            return {
                "accountname":"",
                hostHead:this.$app.contextPath,
                selectedAll:false,
                listHuiyuan:[],
                pageindex:1, //初始页
                pagesize:10,
                total:10,
                spdlg:false,
                infodlg:false,
                "status":2,
                "spdes":"",
                huiyuan:{}
            }

        },
        methods:{
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.search();
            },
            async search(){
                let url="admin/huiyuan/list";
                let param={
                    currentpageindex:this.pageindex,
                    pagesize:this.pagesize,
                    "accountname":this.accountname,
                };
                let util=new VueUtil(this);
                console.log("this.pageindex="+this.pageindex);
                let res=await util.http.post(url,param);
                if(res.data!=null){
                    let pageInfo=res.data.data;
                    this.total=pageInfo.total;
                    this.listHuiyuan=pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec(){
                let url="admin/huiyuan/delete";
                let util=new VueUtil(this);
                let hasChecked=this.listHuiyuan.some(c=>{
                    return c.rowSelected==true;
                });
                if(!hasChecked){
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids=this.listHuiyuan.filter(c=>c.rowSelected).map(c=>c.id);
                let res= util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(()=>{
                    util.http.post(url, {ids},{emulateJSON:false}).then(res=>{
                        if (res.data != null && res.data.stateCode > 0) {
                            this.search();
                        }
                    });
                }).catch(()=>{});
            },
            selectedAllHandler(){
                console.log(this.selectedAll);
                if(this.listHuiyuan!=null){
                    this.listHuiyuan.forEach(c=>{
                        c.rowSelected=!this.selectedAll;
                    });
                }
            },
            showSpdlg(huiyuan){
                this.huiyuan=huiyuan;
                this.spdlg=true;
            },
            showInfo(huiyuan){
                this.huiyuan=huiyuan;
                this.infodlg=true;
            },
            async submitHandler(){

                let util = new VueUtil(this);
                let url="admin/huiyuan/shenhe";
                let {data: res} = await util.http.post(url, {
                    id: this.huiyuan.id,
                    status:this.status,
                    spdes:this.spdes
                });
                if (res != null && res.stateCode<0) {
                    util.message.error(res.des);
                    return;
                }
                this.spdlg=false;
                this.$message.success("成功");
                this.search();
            }
        },
        created(){
            this.search();
        }
    }
</script>

<style scoped>

</style>
