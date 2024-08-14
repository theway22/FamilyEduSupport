<template>

    <div >

        <shead headid="$route.query.headid"></shead>

        <div  class="wrap round-block">

            <div class="course-detail">

                <div class="course-box">
                    <div class="c-thumbnail">
                        <img class="image" :src="hostHead+yingpian.tupian"/>
                    </div>
                    <div class="oper-wrap">

                        <span @click="shoucangHandler" class="cst-btn cst-success required-login"><i class="fa fa-play-circle-o"></i>收藏</span>
                    </div>
                </div>

                <div class="course-ct">
                    <div class="title">
                        {{yingpian.title}}
                        <span @click="agreeHandler"  class="btn btn-default"><i class="fa fa-thumbs-up"></i> <span name="count">{{yingpian.agreecount}}</span></span>

                    </div>
                    <div class="subtitle">
                        {{yingpian.subtitle}}
                    </div>
                    <div class="item">
                        <div class="tb">发布时间:</div>
                        <div class="content">
                            {{yingpian.pubtime}}
                        </div>
                    </div>

                    <div v-if="yingpian.jifen>0" class="item">
                        <div class="tb">费用:（元）</div>
                        <div class="content">
                            {{yingpian.jifen}}¥
                        </div>
                    </div>

                    <div v-if="yingpian.pbtype==2" class="item">
                        <div class="tb">发布人:</div>
                        <div class="content">
                            <a :href="hostHead+'/e/myspace.jsp?id='+yingpian.pubren">{{author.name}}</a>
                        </div>
                    </div>

                    <div class="item">
                        <div class="tb">视频:</div>
                        <div class="content">{{yingpian.typename}}</div>
                    </div>

                    <div class="explain">
                        <div class="hd">

                        </div>
                        <div class="bd">
                            <el-button @click="playHandler" type="danger"><i class="fa fa-play-circle-o"></i>播放</el-button>
                            <el-button v-if="yingpian.xshowtype==2" @click="downloadHandler" type="primary"><i class="el-icon-download"></i>下载</el-button>
                        </div>

                    </div>
                </div>


            </div>

            <div class="brief-title">说明</div>
            <div v-html="yingpian.des" class="brief-content">

            </div>



            <div >

                <div v-if="listLove!=null&&listLove.length>0" class="video-list">
                    <div class="hd">
                        猜你喜欢
                    </div>
                    <div class="bd">

                        <div v-for="item in listLove" class="item">
                            <div class="card">
                                <a :href="hostHead+'/e/yingpianinfo.jsp?id='+item.id">
                                    <div class="pic">
                                        <img class="image" :src="hostHead+item.tupian"/>

                                    </div>
                                    <div class="name">
                                        {{item.title}}
                                    </div>
                                    <div class="price">{{item.typename}}</div>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <div class="brief-content">

                <comment :belongid="id" :delete-self="true" type="yingpian"></comment>
            </div>

            <loginmodal :show.sync="openLogin"></loginmodal>




            <el-dialog title="购买课程" :visible.sync="appointdlg">


                <table width="100%" class="smart-table" border="1">


                    <tr>
                        <td class="tlabel">名称</td>
                        <td>
                            {{yingpian.title}}
                        </td>
                    </tr>

                    <tr>
                        <td class="tlabel">金额(元)</td>
                        <td>
                            {{yingpian.jifen}}¥
                        </td>
                    </tr>


                  <template v-if="huiyuan!=null">

                    <tr>
                        <td class="tlabel">姓名</td>
                        <td>{{huiyuan.name}}</td>
                    </tr>


                    <tr>
                        <td class="tlabel">电话</td>
                        <td>{{huiyuan.mobile}}</td>
                    </tr>

                  </template>

                    <tr>
                        <td class="tlabel">说明</td>
                        <td>
                            <el-input  type="textarea" v-model="appointorder.des"/>
                        </td>
                    </tr>

                </table>


                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitHandler">确 定</el-button>
                    <el-button @click="appointdlg= false">取 消</el-button>
                </div>

            </el-dialog>

        </div>
        <bottom></bottom>
    </div>
</template>

<script>
    import Shead from "./shead";
    import Bottom from "./bottom";
    import comment from "./comment";
    import loginmodal from "./loginmodal";
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yingpianinfo",
        data() {
           return {
               id: this.$route.query.id,
               hostHead:this.$app.contextPath,
               yingpian: {},
               openLogin: false,
               name: "",
               listLove: [],
               author: {},
               appointdlg:false,
               appointorder:{
                   mobile:"",
                   hyid:"",
                   fee:10,
                   count:1,
                   danjia:100,
                   targetid:1,
               },
           }

        },

        async created() {
        },
        async mounted() {
            await this.getInfo();

            //this.getRecomment();
        },
        methods: {

            async getInfo() {
                let util=new VueUtil(this);
                let url = "admin/yingpian/info";
                let id=this.$route.query.id;
                let {data:res}=await util.http.post(url,{id});
                if(res!=null&res.stateCode<0){
                    util.message.error(res.des);
                    return;
                }
                if(res.data!=null){
                    this.yingpian = res.data;
                }
            },
            async submitHandler(){

                if (this.idcardno==""){
                    this.$message.error("请完善个人信息报名");
                    return;
                }
                let util=new VueUtil(this);
                let params={...this.appointorder};
                let {data:res}= await util.http.post("admin/appointorder/save",params);
                if(res.stateCode<=0){
                    this.$message.error(res.des);
                    return;
                }
                this.$message.success("预定成功");
                this.appointdlg = false;
                this.$router.push("/huiyuan/appointordermanager")
            },
            isLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },
            async getRecomment(){
                let url="admin/yingpian/recomment";
                let {data:res}=await this.$http.post(url);
                if (res!=null&&res.stateCode<0) {
                    this.$message.error(res.des);
                    return;
                }
                if (res!=null&&res.data!=null)
                    this.listLove=res.data;
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
                if(!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }
                let url="admin/shoucang/save";
                let util=new VueUtil(this);

                let {data:res}=await util.http.post(url,{
                    targetid:this.yingpian.id,
                    targetname:this.yingpian.title,
                    tupian:this.yingpian.tupian,
                    hyid:this.id==null?0:this.hyid,
                    xtype:"yingpian",
                    href:"/e/yingpianinfo?id="+this.yingpian.id
                });
                if(res!=null&&res.stateCode<0){
                    util.message.error(res.des);
                    return;
                }
                util.message.success("收藏成功");
            },
            async playHandler(){
                if(!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }
                if(this.yingpian.jifen==0) {
                    this.$router.push("/e/playyp?id=" + this.$route.query.id);
                    return ;
                }

                let {data:res}=await this.$http.post("admin/appointorder/list",{
                    "ispaged":"-1",
                    "hyid":this.huiyuan.id,
                    "state":2,
                    "targetid":this.yingpian.id
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                if(res.data!=null&&res.data.length==0) {
                    this.appointdlg = true;
                    this.appointorder.hyid=this.huiyuan.id;
                    this.appointorder.targetid = this.yingpian.id;
                    this.appointorder.danjia = this.yingpian.jifen;
                    this.appointorder.mobile=this.huiyuan.mobile;
                    this.appointorder.fee = this.appointorder.count * this.appointorder.danjia;
                    return;
                }
                this.$router.push("/e/playyp?id="+this.id);
            },
            async agreeHandler(){
                if(!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }
                let url="admin/yingpian/agree";
                let commentator=this.huiyuan.accountname;
                let {data:res}=await this.$http.post(url,{
                    "id":this.yingpian.id,
                    commentator
                });
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.getInfo();
                this.$message.success("成功");
            },
            async againstHandler() {


                if(!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }
                let url="admin/yingpian/against";
                let commentator=this.huiyuan.accountname;
                let {data:res}=await this.$http.post(url,{
                    "id":this.yingpian.id,
                    commentator
                });
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.getInfo();
                this.$message.success("成功");



            },
            async getAuthor(){

                let url="admin/huiyuan/load";
                let id=this.yingpian.pubren;
                if(this.yingpian.pbtype==1)
                    url="admin/users/load";
                else
                    url="admin/huiyuan/load";
                let {data:res}=await this.$http.post(url,{id});
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.author = res.data;

            },

            async downloadHandler() {

                if(!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }

                window.location=this.hostHead+'/admin/download?url='+this.yingpian.remoteurl;


            },

        },

        components: {Bottom, Shead,comment,loginmodal},
        computed:{
            huiyuan(){
                return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
            }

        }
    }
</script>

<style scoped>


</style>
