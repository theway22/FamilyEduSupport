<template>

    <div>

        <shead :headid="$route.query.headid"></shead>

        <div   class="wrap  round-block">

            <div class="two-split ">
                <div class="white-paper">

                    <div class="show-details">
                        <div class="picture-box">
                            <img id="imgTupian"  :src="hostHead+teacher.photo" />
                            <div class="operation">

                            </div>
                        </div>
                        <div class="text-box">
                            <div class="title" >
                                {{teacher.name}}

                            </div>
                            <div class="sub-title">

                            </div>

                            <div>
                                <ul>

                                    <li>
                                        <strong>工号</strong>
                                        {{teacher.tno}}
                                    </li>
                                    <li>
                                        <strong>姓名</strong>
                                        {{teacher.name}}
                                    </li>


                                    <li>
                                        <strong>性别</strong>
                                        {{teacher.sex}}
                                    </li>

                                    <li>
                                        <strong>籍贯</strong>
                                        {{teacher.jiguan}}
                                    </li>


                                    <li>
                                        <strong>民族</strong>
                                        {{teacher.nation}}
                                    </li>



                                    <li>
                                        <strong>邮箱</strong>
                                        {{teacher.email}}
                                    </li>

                                    <li>
                                        <strong>电话</strong>
                                        {{teacher.tel}}
                                    </li>

                                    <li>
                                        <strong>服务等级</strong>
                                        {{teacher.zhicheng}}
                                    </li>

                                    <li>
                                        <strong>服务区域</strong>
                                        {{teacher.major}}
                                    </li>
                                    <li>
                                        <el-button @click="showYuyue" type="warning" icon="el-icon-plus">预约</el-button>

                                        <span @click="shoucangHandler"    class="el-button el-button--primary"><i class="fa fa-plus"></i>关注</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <el-tabs value="first">
                        <el-tab-pane name="first" label="介绍">
                            <div v-html="teacher.jieshao" class="brief-content">

                            </div>

                        </el-tab-pane>
                        <el-tab-pane name="second" label="评论">

                            <comment :belongid="$route.query.id" xtype="teacher"></comment>

                        </el-tab-pane>
                    </el-tabs>

                    <loginmodal :show.sync="openLogin"></loginmodal>

                </div>


            </div>

        </div>


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
    import Shead from "./shead";
    import Bottom from "./bottom";
    import {VueUtil} from "../util/vueutil";
    import Comment from "./comment";
    import Loginmodal from "./loginmodal";

    export default {
        name: "teacherinfo",

        data() {

            return {
                hostHead: this.$app.contextPath,
                teacher: {},
                listHotXinxi: [],
                openLogin: false,
                name: "",
                yuyuedlg: false,
                dcontent: "",
                lwdlg: false,
                "yuyue": {
                    "title": "",
                    "yydate": new Date().format("yyyy-MM-dd"),
                    "mobile":"",
                    "hyid":"",
                    "targetid": "",
                    "dcontent": "",
                }
            }

        },
        async created() {
            console.log("created");
            this.getInfo();
            this.getHotXinxis();
        },
        async mounted() {
        },
        methods: {

            async getInfo() {
                let util=new VueUtil(this);
                let url = "admin/teacher/info";
                let id=this.$route.query.id;
                let {data:res}=await util.http.post(url,{id});
                if(res!=null&res.stateCode<0){
                    util.message.error(res.des);
                    return;
                }
                if(res.data!=null){
                    this.teacher = res.data;
                }
            },
            async getHotXinxis(){
                let util=new VueUtil(this);
                let { data:res }=await util.http.post("admin/xinxi/hot");
                if(res!=null&&res.stateCode>0) {
                    this.listHotXinxi = res.data;
                    console.log(this.listHotXinxi);
                }
            },
            async shoucangHandler(){
                if(!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                let url="admin/shoucang/save";
                let util=new VueUtil(this);

                let {data:res}=await util.http.post(url,{
                    targetid:this.teacher.id,
                    targetname:this.teacher.title,
                    tupian:this.teacher.photo,
                    hyid:this.huiyuan.id,
                    xtype:"teacher",
                    href:"/e/teacherinfo?id="+this.teacher.id
                });
                if(res!=null&&res.stateCode<0){
                    util.message.error(res.des);
                    return;
                }
                util.message.success("收藏成功");
            },
            async showYuyue(){
                if (!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                this.yuyue.mobile=this.huiyuan.mobile;
                this.yuyue.hyid=this.huiyuan.id;
                this.yuyuedlg=true;


            },
            async yuyueHandler(){

                let defaultOptions={
                    url:"admin/yuyue/save",
                    actionTip:"预约新增成功"
                };

                const  validRes=this.myValidator.valid(this);
                console.log("valRes",validRes);
                if (!validRes)
                    return;
                this.yuyue.targetid=this.teacher.id;

                let util=new VueUtil(this);
                let params={...this.yuyue};

                let {data:res}= await util.http.post(defaultOptions.url,params);
                if(res.stateCode<=0){
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                util.message({
                    message:defaultOptions.actionTip,
                    type:'success',
                    duration:2000
                });
                this.yuyuedlg=false;
            },
            showLwdlg(){
                if (this.hyid==""){

                    this.openLogin=true;
                    return ;
                }
                this.lwdlg=true;
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
        components: {Loginmodal, Comment, Bottom, Shead}
    }
</script>

<style scoped>

</style>
