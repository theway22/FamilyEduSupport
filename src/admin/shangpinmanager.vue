<template>
    <div class="panel panel-default">
        <div class="panel-heading">
           教育服务管理

        </div>
        <div class="panel-body">
        <!-- 搜索控件开始 -->
        <div class="search-options">

            <table cellspacing="0" width="100%">
                <tbody>
                <tr>
                    <td>
                        名称:
                        <div style="width:200px;display: inline-block;">
                            <el-input placeholder="标题" v-model="name" />
                        </div>

                        类别:
                        <el-cascader v-model="lmvalue"
                                     :options="options"
                                     :props="{ checkStrictly: true }"
                                     clearable></el-cascader>

                        <el-button type="primary" icon="el-icon-search" @click="search">
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
                <el-button type="success" icon="el-icon-check" @click="selectedAllHandler">选择</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteRec">删除</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="shangjiaHandler">上架</el-button>
                <el-button type="warning" icon="el-icon-download" @click="xiajiaHandler">下架</el-button>
            </el-button-group>
        </div>

        <div class="image-text-box3">


            <div class="bd">


                <div v-for="shangpin in listShangpin" class="item">
                    <div class="image-ar">
                        <a :href="hostHead+'/admin/shangpindetails.jsp?id='+shangpin.id">
                            <img :src="hostHead+shangpin.images[0]"/>
                        </a>
                        <span class="name"><input type="checkbox" v-model="shangpin.rowSelected" :value="shangpin.id" />{{shangpin.name}}</span>

                    </div>
                    <div class="text-ar">
                        <div class="title"><a :href="hostHead+'/admin/shangpinadd.jsp?id='+shangpin.id">{{shangpin.name}}</a></div>
                        <div class="subtitle"><el-tag>{{shangpin.typename}}/{{shangpin.subtypename}}</el-tag></div>
                        <div class="time">{{shangpin.pubtime}}</div>
                        <div class="time">{{shangpin.kucun}}{{shangpin.danwei}}</div>
                        <div>
                            <pop-dialog-button title="加库存" :xdata="{userid:accountInfo.id}" @refresh="search" css-class="el-button el-button--danger" :url="'/admin/kucunadd?id='+shangpin.id"><i class="el-icon-plus"></i>加库存</pop-dialog-button>
                        </div>

                    </div>
                    <div class="toolbar-op">
                        <div class="el-button-group">
                            <el-button @click="deleteOne(shangpin.id)" type="danger" icon="el-icon-delete"></el-button>
                            <route-button :url="`/admin/shangpinadd?id=${shangpin.id}`" icon="el-icon-edit"></route-button>

                            <route-button :url="`/admin/shangpindetails?id=${shangpin.id}`" title="教育服务详情" type="success" icon="el-icon-info"></route-button>
                        </div>
                    </div>
                    <div class="tag">
                        <div class="name">
                            <span v-if="shangpin.state==1">上架</span>
                            <span v-if="shangpin.state==2">下架</span>
                        </div>
                    </div>
                </div>


                <div v-if="listShangpin.length==0" style="width: 100%;" class="no-record-tip white-paper">
                    <div class="content">
                        <i class="fa fa-warning"></i> 没有相关内容
                    </div>
                </div>

            </div>

        </div>

        <div class="clear"></div>
        <el-pagination
            @size-change="pagesizeChange"
            @current-change="pageindexChange"
            :current-page="pageindex"
            :page-sizes="[pagesize]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        </div>

    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";
    import PopDialogButton from "../common/mydialog/PopDialogButton";
    export default {
        name: "shangpinmanager",
        data() {

           return {
               hostHead: this.$app.contextPath,
               listShangpin: [],
               options: [],
               lmvalue: [],
               pageindex: 1,
               pagesize: 10,
               total: 10,
               selectedAll: false,
               name: ""
           }

        },
        async created() {

            this.search();
            this.getLanmus();

        },
        props:{
            accountInfo:{
                type:Object
            }
        },
        components:{PopDialogButton},
        computed:{

        },
        methods: {


            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.search();
            },
            async search() {

                let param={
                    currentpageindex:this.pageindex,
                    pagesize:this.pagesize,
                    spname:this.name
                };
                if(this.lmvalue!=null&&this.lmvalue.length>0)
                    param.lmid=this.lmvalue[0];
                if(this.lmvalue!=null&&this.lmvalue.length>=2)
                    param.subtypeid=this.lmvalue[1];

                let url = "admin/shangpin/list";
                let {data:res}=await this.$http.post(url,param);
                //console.log("data=",res);
                if(res!=null&&res.data!=null) {
                    this.total=res.data.total;
                    if (res.data.list!=null) {
                        res.data.list.forEach(c => {
                            c.rowSelected = false;
                        });
                        this.listShangpin = res.data.list;

                        //console.log("listShangpin=",this.listShangpin);
                    }
                }

            },

            async getLanmus(){
                let url = "admin/shangpin/cascadelanmu";
                let {data:res}=await this.$http.post(url,{
                    id:this.lanmuid
                });
                //console.log("data=",res);
                if (res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.options=res.data;
            },
            selectedAllHandler() {

                this.selectedAll=!this.selectedAll;
                if (this.listShangpin != null) {
                    this.listShangpin.forEach(c => {
                        c.rowSelected = this.selectedAll;
                    });
                }
            },
            async deleteOne(id){
                let util=new VueUtil(this);
                if (id==null)
                    return ;
                let ids=[id];
                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post("admin/shangpin/delete", {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            util.message.success("删除成功");
                            this.search();
                        }
                    });
                }).catch(() => {
                });
            },
            async deleteRec() {
                let url = "admin/shangpin/delete";
                let util = new VueUtil(this);
                let ids = this.listShangpin.filter(c => c.rowSelected).map(c => c.id);
                if (ids!=null&&ids.length<=0) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }


                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post(url, {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            util.message.success("删除成功");
                            this.search();
                        }
                    });
                }).catch(() => {
                });
            },
            async shangjiaHandler(){
                let url = "admin/shangpin/shangjia";
                let util = new VueUtil(this);
                let ids = this.listShangpin.filter(c => c.rowSelected).map(c => c.id);
                if (ids!=null&&ids.length<=0) {
                    util.alert('请选择需要上架的教育服务', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                let {data:res}=await util.http.post(url, {ids}, {emulateJSON: false});
                if (res!=null&&res.stateCode<0){
                    util.message.error(res.des);
                    return ;
                }
                util.message.success("上架成功");
                this.search();
            },
            async xiajiaHandler(){
                let url = "admin/shangpin/xiajia";
                let util = new VueUtil(this);
                let ids = this.listShangpin.filter(c => c.rowSelected).map(c => c.id);
                if (ids!=null&&ids.length<=0) {
                    util.alert('请选择需要下架的教育服务', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                let {data:res}=await util.http.post(url, {ids}, {emulateJSON: false});
                if (res!=null&&res.stateCode<0){
                    util.message.error(res.des);
                    return ;
                }
                util.message.success("下架成功");
                this.search();
            }

        }
    }
</script>

<style scoped>

</style>
