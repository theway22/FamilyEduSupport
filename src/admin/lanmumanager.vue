<template>


    <div >
        <div class="panel panel-default">
            <div class="panel-heading">
                栏目管理
            </div>
            <div class="panel-body">

                <!-- 搜索控件开始 -->
                <div class="search-options">

                    <table cellspacing="0" width="100%">
                        <tbody>
                        <tr>
                            <td>
                                名称
                                <input name="name" @keyup.enter="search" v-model="name" class="input-txt" type="text" id="name"/>

                                <el-button icon="el-icon-search" @click="search" type="primary">
                                    搜索
                                </el-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
                <!-- 搜索控件结束 -->
                <div class="action-details">
                    <el-button-group>
                        <el-button @click="showLanmudlg()" type="primary"><i class="el-icon-plus"></i>新增栏目</el-button>
                    </el-button-group>
                </div>



                <div class="tree-block">

                    <el-tree
                        :data="listLanmu"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false">
                        <div class="custom-tree-node" slot-scope="{node, data}">
                    <span class="tname">{{node.label}}
                        <span v-if="data.type===1">（文章）</span>
                        <span v-if="data.type===2">（教育服务）</span>
                        <span v-if="data.type===3">（讲座）</span>
                   </span>
                            <div class="ttoolbar">
                                <el-button-group>
                                    <el-button  class="mr10" v-if="data.datatype==1" @click="showSubtypedlg(data,'save')" type="text"  icon="el-icon-plus">
                                        新增子栏目
                                    </el-button>
                                    <el-button class="mr10"  v-if="data.datatype==1" type="text" @click="showLanmudlg(data)" icon="el-icon-edit">
                                        编辑
                                    </el-button>
                                    <el-button class="mr10"  v-if="data.datatype==2" type="text" @click="showSubtypedlg(data,'update')" icon="el-icon-edit">
                                        编辑
                                    </el-button>

                                    <el-button type="text" v-if="data.datatype==1" class="mr10" @click="deleteLanmu(data.id)" icon="el-icon-delete">
                                        删除
                                    </el-button>
                                    <el-button type="text" v-if="data.datatype==2" class="mr10" @click="deleteSubtype(data.id)" icon="el-icon-delete">
                                        删除
                                    </el-button>
                                </el-button-group>
                            </div>
                        </div>
                    </el-tree>
                </div>


                <el-dialog :visible.sync="subtypedlg" :title="subtypeTitle">

                    <table class="smart-table" border="1" cellspacing="1" width="100%">


                        <tr>
                            <td class="tlabel" width="30%" align="right">名称:</td>
                            <td width="*">
                                {{lanmu.name}}
                            </td>
                        </tr>
                        <tr>
                            <td  class="tlabel" align="right" >子栏目:</td>
                            <td width="*">
                                <input name="name" v-model="subtype.name"  placeholder="名称"   class="input-txt" type="text"   />
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">
                                <el-button type="primary" @click="saveSubtypeHandler">确 定</el-button>
                                <el-button @click="subtypedlg= false">取 消</el-button>
                            </td>
                        </tr>


                    </table>


                </el-dialog>


                <el-dialog :visible.sync="lanmudlg" :title="lmTitle">

                    <table class="smart-table" border="1" cellspacing="1" width="100%">



                        <tr>
                            <td width="10%" align="right">名称:</td>
                            <td width="*">
                                <input name="name"  v-model="lanmu.name" placeholder="名称"
                                       class="input-txt" type="text"/>

                            </td>
                        </tr>

                        <tr>
                            <td align="right">类型:</td>
                            <td>
                                <el-radio-group v-model="lanmu.type">
                                    <el-radio-button label="1">文章</el-radio-button>
                                    <el-radio-button label="2">家庭教育</el-radio-button>
                                    <el-radio-button label="3">讲座</el-radio-button>

                                </el-radio-group>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">
                                <el-button type="primary" @click="saveLanmuHandler">确 定</el-button>
                                <el-button @click="lanmudlg= false">取 消</el-button>
                            </td>
                        </tr>


                    </table>


                </el-dialog>

            </div>

        </div>
    </div>

</template>

<script>
    import {VueUtil} from "../util/vueutil";


    export default {
        name: "lanmumanger",
        data(){
            return {
                "name":"",
                hostHead:this.$app.contextPath,
                listLanmu:[],
                lanmu:{},
                subtype:{},
                lanmudlg:false,
                subtypeAction:"update",
                lanmuAction:"update",
                subtypedlg:false,
                lmTitle:"新增栏目",
                subtypeTitle:"新增子栏目"
            }

        },
        methods:{
            async search(){
                let url="admin/lanmu/cascadelist";
                let param={
                    "name":this.name,
                };
                let util=new VueUtil(this);
                console.log("this.pageindex="+this.pageindex);
                let {data:res}=await util.http.post(url,param);
                if(res!=null){
                    this.listLanmu=res.data;
                    console.log(this.listLanmu);
                }
            },
            async showSubtypedlg(data,action) {
                if(data==null)
                    return;
                if(action==null)
                    return;
                if(action=="save")
                    this.subtypeTitle="新增子栏目";
                else
                    this.subtypeTitle="编辑子栏目";
                this.subtypeAction=action;
                if(data.datatype==2) {
                    this.subtype = data;

                    let url = "admin/lanmu/info";
                    let param = {
                        "id": data.parentid,
                    };
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, param);
                    if (res != null && res.stateCode > 0)
                        this.lanmu = res.data;
                }
                if(data.datatype==1) {
                    this.lanmu = data;
                    this.subtype.name="";
                    this.subtype.parentid=data.id;
                }
                this.subtypedlg = true;
            },
            async showLanmudlg(data) {
                if(data==null) {
                    this.lanmuAction = "save";
                    this.lmTitle="新增栏目";
                    this.lanmu={name:"",type:2};
                }
                else {
                    this.lanmuAction = "update";
                    this.lmTitle="编辑栏目";
                    this.lanmu=data;
                }
                this.lanmudlg = true;
            },
            async deleteLanmu(id){
                let url="admin/lanmu/delete";
                let util=new VueUtil(this);

                let res= util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(()=>{
                    util.http.post(url, {id},{emulateJSON:false}).then(res=>{
                        if (res.data != null && res.data.stateCode > 0) {
                            this.search();
                        }
                    });
                }).catch(()=>{});
            },
            async deleteSubtype(id){
                let url="admin/subtype/delete";
                let util=new VueUtil(this);

                let res= util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(()=>{
                    util.http.post(url, {id},{emulateJSON:false}).then(res=>{
                        if (res.data != null && res.data.stateCode > 0) {
                            this.search();
                        }
                    });
                }).catch(()=>{});
            },
            async saveLanmuHandler() {
                let url="admin/lanmu/save";
                if(this.lanmuAction=="update")
                    url="admin/lanmu/update";
                if(this.lanmu.name==null||this.lanmu.name==""){
                    this.$message.error("请输入栏目名称");
                    return;
                }
                let util = new VueUtil(this);
                let params = {...this.lanmu};
                let {data: res} = await util.http.post(url, params);
                if (res.stateCode <= 0) {
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                this.$message.success("成功");
                this.lanmudlg=false;
                this.search();


            },
            async saveSubtypeHandler() {

                let url="admin/subtype/save";
                if(this.subtypeAction=="update")
                    url="admin/subtype/update";
                if(this.subtype.name==null||this.subtype.name==""){
                    this.$message.error("请输子栏目名称");
                    return;
                }
                let util = new VueUtil(this);
                let params = {...this.subtype};
                let {data: res} = await util.http.post(url, params);
                if (res.stateCode <= 0) {
                    this.$message.error(res.des);
                    return;
                }
                this.$message.success("成功");
                this.subtypedlg=false;
                this.search();


            }

        },
        created(){
            this.search();
        }
    }
</script>

<style >

    .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .tname{
        width: 300px;
    }
    .ttoolbar{
        margin-left: 50px;
    }
    .tree-block{
        width: 100%;
        background: #DCDFE6;
        border: 1px solid #DCDFE6;
    }
    .mr10{
        margin-right:30px !important;

    }

</style>
