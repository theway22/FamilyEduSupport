<template>

    <div >
        <shead headid="$route.query.headid"></shead>
        <div class="wrap com-panel">
            <el-row>

                <el-col :span="18">
                    <div class="panel panel-default">

                        <div class="panel-heading">

                            <div class="news-title1">
                                {{xinxi.title}}
                                <ul>
                                    <li>
                                        <i class="fa fa-calendar"></i>
                                        {{xinxi.pubtime}}
                                    </li>
                                    <li v-if="xinxi.pbtype==2">
                                        <i class="fa fa-user"></i>
                                        {{author.realname}}--{{author.username}}
                                    </li>
                                    <li v-if="xinxi.pbtype==1">
                                        <i class="fa fa-user"></i>
                                        {{author.name}}--{{author.accountname}}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div style="min-height: 600px;" class="panel-body">

                            <div class="toolbar-group">
                                <div @click="agreeClick" class="like">
                                    <i class="fa fa-thumbs-o-up"></i>
                                    <div class="count">{{xinxi.agreecount}}</div>
                                </div>
                                <div @click="shoucangClick" class="like">
                                    <i class="fa fa-clone"></i>
                                    <div class="count">收藏</div>
                                </div>
                            </div>

                            <div style="overflow: hidden;" v-html="xinxi.dcontent"></div>

                        </div>


                    </div>
                    <div v-if="listRecomment.length>0" class="com-panel">

                        <div  class="video-list">
                            <div class="hd">
                                猜你喜欢
                            </div>
                            <div class="bd">

                                <div v-for="item in listRecomment" :key="item.id" class="item">
                                    <div class="card">
                                        <a :href="'/e/xinxiinfo?id='+item.id">
                                            <div class="pic">
                                                <img class="image" :src="hostHead+item.images[0]"/>

                                            </div>
                                            <div class="name">
                                                {{item.title}}
                                            </div>
                                            <div class="price">{{item.lmname}}</div>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                    <comment xtype="xinxi" :belongid="this.$route.query.id"  :delete-self="true"></comment>
                </el-col>
                <el-col :span="6">
                    <div class="side-pane">
                        <hotnews></hotnews>
                    </div>

                </el-col>
            </el-row>
        </div>

        <loginmodal :show.sync="openLogin"></loginmodal>
        <bottom></bottom>
    </div>
</template>

<script>
    import Shead from "./shead";
    import Loginmodal from "./loginmodal";
    import Comment from "./comment"
    import Bottom from "./bottom";
    import Hotnews from "./hotnews";
    export default {
        name: "xinxiinfo",
        data(){

           return  {
               hostHead: this.$app.contextPath,
                xinxi: {},
                lanmu: {},
                listXinxi:[],
                openLogin:false,
                listRecomment:[],
                author:{},
                subtype: {}
            }

        },
        async created() {

            await this.getInfo();
            await this.getAuthor(this.xinxi);
            await this.getLanmu(this.xinxi.lmid);
            await this.getSubtype(this.xinxi.subtypeid);
            await this.getRecomment();
        },
        methods: {

            async getInfo() {
                let data={id:this.$route.query.id};
                if(this.huiyuan!=null)
                    data.hyid=this.huiyuan.id;
                let {data:res} = await this.$http.post("admin/xinxi/info", data);
                if (res != null && res.data != null) {
                    this.xinxi = res.data;
                }
            },


            isLogin() {
               return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },
            async getLanmu(id) {
                let res = await this.$http.post("admin/lanmu/info", {id: id});
                if (res.data != null && res.data.data != null) {
                    this.lanmu = res.data.data;
                }
            },
            async downloadHandler() {

                if (!this.isLogin()) {
                    this.openLogin = true;
                    return;
                }

                window.location=this.hostHead+'/admin/download?url='+this.xinxi.fileurl;


            },
            async getAuthor(xinxi) {
                if (xinxi==null)
                    return ;
                let url="admin/users/load";
                if (xinxi.pbtype==1)
                    url = "admin/huiyuan/load";
                let {data:res} = await this.$http.post(url, {id: xinxi.pubren});
                if (res!=null&&res.state<0){
                    this.$message.error(res.des);
                    return ;
                }
                if (res!= null && res.data!= null) {
                    this.author = res.data;
                }
            },
            async getSubtype(id) {
                let {data:res} = await this.$http.post("admin/subtype/load", {
                    id: id
                });
                if (res!= null && res.data != null) {
                    this.subtype = res.data;
                }
            },
            async shoucangClick() {

                if (!this.isLogin()) {
                    this.openLogin=true;
                    return;
                }
                let params = {
                    "targetid": this.xinxi.id,
                    "targetname": this.xinxi.title,
                    "tupian": this.xinxi.tupian,
                    "hyid": this.huiyuan==null?0:this.huiyuan.id,
                    "xtype": "xinxi",
                    "href": "/e/xinxiinfo?id=" + this.xinxi.id
                };
                let {data:res} = await this.$http.post("admin/shoucang/save", params);
                if (res!= null) {
                    if (res.stateCode <0) {
                        this.$message.error(res.des);
                        return;
                    }
                    this.$message.success("成功收藏...");

                }


            },//end shoucang
            async agreeClick() {

                if (!this.isLogin()) {
                    this.openLogin=true;
                    return;
                }
                let params = {
                    "targetid": this.xinxi.id,
                    "commentator": this.huiyuan==null?"":this.huiyuan.accountname,
                };
                let res = await this.$http.post("admin/xinxi/agree", params);
                if (res.data != null) {
                    if (res.data.stateCode == -2) {
                        this.$message.error("你已经赞过不能再赞...");
                        return;
                    }
                    this.$message.success("完成...");
                    this.getInfo();
                }


            },
            getRecomment(){
                let url="admin/xinxi/recomment";
                if(this.huiyuan==null)
                    return;

                let data={id:this.xinxi.id};
                if(this.huiyuan!=null)
                    data.hyid=this.huiyuan.id;
                this.$http.post(url,data).then(res=>{
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null)
                        this.listRecomment=res.data.data;
                });


            }

        },
        computed:{
           huiyuan(){
              return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
           }

        },
        components: {Hotnews, Bottom, Loginmodal, Shead,Comment}
    }
</script>

<style scoped>
   .side-pane{
       padding-left: 20px;
   }
</style>
