<template>
    <div>


        <shead headid="$route.query.headid"></shead>
        <div  class="wrap round-block">
            <div class="line-title">
                当前位置：><router-link to="/e/index">首页</router-link>
                &gt;&gt; 我的空间
            </div>

            <el-row>

                <el-col :span="6">

                    <div class="photo-area">
                        <div class="img-box">

                            <img :src="hostHead+author.photo"/>
                            <div class="action-box">
                                <div style="height:30px;line-height: 30px;margin-bottom: 12px;">
                                    ({{author.tno}}){{author.name}}
                                    <span>{{listFan.length}}粉丝</span>
                                </div>
                                <el-button @click="showInfodlg(author)" icon="el-icon-info"  type="primary" circle></el-button>
                                <el-button @click="attentionHandler(author.id)" icon="el-icon-plus"  type="danger" circle></el-button>

                                <pop-dialog-button width="70%" title="咨询" :visible="lwdlg" @click.native="showLwdlg" css-class="el-button el-button--warning is-circle" :xdata="{'sendor':huiyuan}" :url="'/e/chat?targetid='+author.id"><i class="el-icon-s-comment"></i></pop-dialog-button>


                            </div>
                        </div>

                    </div>

                    <div v-if="listFan.length>0" class="fans-box">
                        <div class="hd">
                            <div class="title">他的粉丝</div></div>
                        <div class="bd">
                            <div v-for="fan in listFan" class="item">
                                <div class="pic">
                                    <img class="image" :src="hostHead+fan.touxiang"/>
                                </div>
                                <div class="name">
                                    {{fan.name}}({{fan.accountname}})
                                </div>


                            </div>
                        </div>
                    </div>



            </el-col>
                <el-col :span="18">


                    <div class="video-list">
                        <div class="hd">
                            <div class="title">我的教育服务</div>
                        </div>

                        <div class="bd">

                            <div v-for="item in listShangpin" :key="item.id" class="item">
                                <div  class="card">

                                    <div class="pic">
                                        <router-link :to="'/e/shangpininfo?id='+item.id">
                                            <img class="image" :src="hostHead+item.images[0]"/>
                                        </router-link>

                                    </div>
                                    <div class="name">
                                        <router-link :to="'/e/shangpininfo?id='+item.id">{{item.name}}</router-link>
                                    </div>

                                </div>
                            </div>
                            <div style="width: 100%;" v-if="listShangpin.length==0" class="no-record-tip">
                                <div  class="content">
                                    <i class="fa fa-warning"></i>暂无信息
                                </div>
                            </div>

                        </div>
                    </div>

                    <el-pagination
                        background
                        @size-change="pagesizeChange"
                        @current-change="pageindexChange"
                        :current-page="pageindex"
                        :page-sizes="[pagesize]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>


                </el-col>

            </el-row>



            <el-dialog title="他的资料" :visible.sync="infodlg">

                <el-tabs value="first">
                    <el-tab-pane label="账户信息" name="first">
                        <table cellpadding="0" cellspacing="1" border="1" class="smart-table" width="100%">


                            <tr>
                                <td width="10%" align="right">工号:</td>
                                <td width="*">
                                    {{author.tno}}
                                </td>
                                <td colspan="2" rowspan="6" width="*">
                                    <img :src="hostHead+author.photo" width="200" height="200"/>
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">姓名:</td>
                                <td width="*">
                                    {{author.name}}
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">性别:</td>
                                <td width="*">
                                    {{author.sex}}
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">籍贯:</td>
                                <td width="*">
                                    {{author.jiguan}}
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">学历:</td>
                                <td width="*">
                                    {{author.xueli}}
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">民族:</td>
                                <td width="*">
                                    {{author.nation}}
                                </td>
                            </tr>




                            <tr>
                                <td width="10%" align="right">邮箱:</td>
                                <td width="*">
                                    {{author.email}}
                                </td>

                                <td width="10%" align="right">电话:</td>
                                <td width="*">
                                    {{author.tel}}
                                </td>
                            </tr>


                            <tr>
                                <td width="10%" align="right">职称:</td>
                                <td width="*">
                                    {{author.zhicheng}}
                                </td>

                                <td width="10%" align="right">特长:</td>
                                <td width="*">
                                    {{author.major}}
                                </td>
                            </tr>




                        </table>


                    </el-tab-pane>
                    <el-tab-pane label="个人简介" name="second">
                        <div v-html="author.jieshao"></div>
                    </el-tab-pane>

                </el-tabs>

            </el-dialog>


            <loginmodal :show.sync="openLogin"></loginmodal>

        </div>

        <bottom></bottom>

    </div>
</template>

<script>
    import Shead from "./shead";
    import Bottom from "./bottom";
    import Loginmodal from "./loginmodal";
    import PopDialogButton from "../common/mydialog/PopDialogButton";
    export default {
        name: "myspace",
        data(){
            return {
                hostHead: this.$app.contextPath,
                listXinxi: [],
                openLw: false,
                author: {},
                dcontent: "",
                openLogin: false,
                pageindex: 1,
                pagesize: 10,
                total: 10,
                lwdlg:false,
                listFan:[],
                listShangpin:[],
                infodlg: false,
            }

        },
        async created(){
            await this.getAuthor();
            await this.getShangpins();
            await this.getFans();
        },
        methods:{
            async showLwdlg(){
                if(!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                this.lwdlg=true;
            },

            async getFans(){
                let url="admin/fans/myfans";
                let {data:res}=await this.$http.post(url,{
                    userid:this.$route.query.id
                });
                this.listFan=res.data;

            },
            async getShangpins(){
                let url="admin/shangpin/list";
                let {data:res}=await this.$http.post(url,{
                    pubren:this.author.id,
                    pbtype:1,
                    currentpageindex:this.pageindex,
                    pagesize:this.pagesize
                });
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                let pageInfo=res.data;
                this.total=pageInfo.total;
                this.listShangpin = pageInfo.list;

            },

            showInfodlg(author){
                this.infodlg = true;
            },

            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.getShangpins();
            },
            async getAuthor(){
                let id=this.$route.query.id;
                let url="admin/teacher/info";
                let {data:res}=await this.$http.post(url,{id});
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.author = res.data;

            },
            async attentionHandler(targetId){

                if (!this.isLogin){

                    this.openLogin=true;
                    return ;
                }
                let actionid=this.huiyuan.id;
                let url="admin/fans/save";
                let {data:res}=await this.$http.post(url, {
                    "targetid":targetId,
                    "actionid":actionid
                });
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.$message.success("关注成功");
                this.getFans();

            }
        },
        computed:{
            huiyuan(){
                return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
            },
            isLogin(){
                return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },
        },
        components: {PopDialogButton, Loginmodal, Bottom, Shead}
    }
</script>

<style scoped>

</style>
