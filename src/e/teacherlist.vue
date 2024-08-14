<template>

    <div>

        <shead :headid="$route.query.headid"></shead>

        <div class="wrap round-block">
            <div class="line-title">
                当前位置：
                <router-link to="/e/index">首页</router-link>
                &gt;&gt; 导游
            </div>


            <div v-if="listTeacher!=null&&listTeacher.length>0" class="video-list">


                <div class="bd">

                    <div v-for="teacher in listTeacher" class="item">
                        <div class="card">
                            <div class="pic">
                                <router-link :to="`/e/teacherinfo?id=${teacher.id}`">
                                    <img class="image" :src="hostHead+teacher.photo"/>
                                </router-link>

                            </div>

                            <div class="name">{{teacher.name}}{{teacher.tno}}</div>
                            <div class="el-button-group">


                                <span @click="showYuyue(teacher)" class="el-button el-button--small el-button--success"><i class="el-icon-plus"></i>预约教育导师</span>

                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <div v-if="listTeacher!=null&&listTeacher.length==0" class="no-record-tip">
                <div class="content">
                    <i class="fa fa-warning"></i>没有任教老师
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


        </div>
        <loginmodal :show.sync="openLogin"></loginmodal>

        <el-dialog title="预约教育导师" :visible.sync="yuyuedlg">


            <table class="smart-table" border="1" cellspacing="1" width="100%">


                <tr>
                    <td width="10%" align="right">标题:</td>
                    <td width="*">
                        <input name="title" v-model="yuyue.title" placeholder="标题"
                               v-validate="{required:true,messages:{required:'请输入标题'}}" class="input-txt" type="text"/>


                    </td>
                </tr>


                <tr>
                    <td width="10%" align="right">预约日期:</td>
                    <td width="*">
                        <el-date-picker v-model="yuyue.yydate" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </td>
                </tr>


                <tr>
                    <td width="10%" align="right">电话:</td>
                    <td width="*">
                        <input name="mobile" v-model="yuyue.mobile" placeholder="电话"
                               v-validate="{required:true,messages:{required:'请输入电话'}}" class="input-txt" type="text"/>


                    </td>
                </tr>

                <tr>
                    <td align="right" >说明:</td>
                    <td colspan="3">
                        <textarea   name="dcontent" rows="4" v-model="yuyue.dcontent"   style="width:48%;height:100px;"  v-validate="{required:true}" ></textarea>

                    </td>
                </tr>




            </table>


            <div slot="footer" class="dialog-footer">
                <el-button @click="yuyuedlg = false">取 消</el-button>
                <el-button @click="yuyueHandler" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <bottom></bottom>

    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";
    import PopDialogButton from "../common/mydialog/PopDialogButton";
    import Shead from "./shead";
    import Bottom from "./bottom";
    import Loginmodal from "./loginmodal";

    export default {
        name: "teacherlist",
        components: {Loginmodal, Bottom, Shead, PopDialogButton},
        data() {
            return {
                "tno": "",
                hostHead: this.$app.contextPath,
                listTeacher: [],
                pageindex: 1, //初始页
                pagesize: 10,
                total: 10,
                lwdlg:false,
                openLogin:false,
                "yuyue":{
                    "title":"",
                    "yydate":new Date().format("yyyy-MM-dd"),
                    "mobile":"",
                    "hyid":"",
                    "targetid":"",
                    "dcontent":"",
                },
                yuyuedlg:false,
                teacher:{}
            }
        },

        methods: {
            async showLwdlg(){
                if(!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                this.lwdlg=true;
            },
            async showYuyue(teacher){
                if (!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                this.teacher=teacher;
                this.yuyuedlg=true;
            },
            async yuyueHandler(){


                const  validRes=this.myValidator.valid(this);
                console.log("valRes",validRes);
                if (!validRes)
                    return;
                this.yuyue.targetid=this.teacher.id;
                this.yuyue.hyid=this.huiyuan.id;
                this.yuyue.mobile=this.huiyuan.mobile;

                let util=new VueUtil(this);
                let params={...this.yuyue};

                let {data:res}= await util.http.post("admin/yuyue/save",params);
                if(res.stateCode<=0){
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                util.message({
                    message:"预约成功",
                    type:'success',
                    duration:2000
                });
                this.yuyuedlg=false;

            },
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function (pageindex) {
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.search();
            },
            async search() {
                let url = "admin/teacher/list";
                let param = {
                    "ispaged":"-1",
                };
                let {data:res} = await this.$http.post(url, param);
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.listTeacher = res.data;
            },


        },
        computed:{
            huiyuan(){
                return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
            },
            isLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },


        },
        created() {
            this.search();
        }

    }
</script>

<style scoped>

</style>
