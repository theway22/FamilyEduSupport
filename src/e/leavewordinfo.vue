<template>
    <div >

        <shead :headid="$route.query.headid"></shead>
        <div class="wrap com-panel" >
            <div class="stdrow">
                <img style="width: 1200px;" src="./images/liuyan.jpg"/>
            </div>
            <div v-if="huiyuan!=null">
                <div class="stdrow">
                    <textarea  name="dcontent"  maxlength="500" class="lwta" v-model="dcontent"   placeholder="在线留言" ></textarea>
                </div>
                <div class="stdrow">
                    <span @click="submitLw" class="lw-btn">在线留言</span>
                </div>
            </div>


            <div v-else style="font-size:18px;padding:20px 120px;">
                登录后才能进行留言  ,<span @click="openLogin=true" style="cursor:pointer;color:#e9ab32;" >登录</span>
            </div>

        </div>
        <div class="wrap com-panel" style="min-height: 600px;background-color:#fff;">
            <div class="lw-ct-wrap">
                <div class="hd">
                    <div class="title">全部留言</div>
                    <div class="subtitle">{{listLeaveword.length}}条</div>
                </div>
                <div v-if="listLeaveword!=null&&listLeaveword.length>0" class="bd">
                    <div v-for="lw in listLeaveword" class="lw-item">
                        <div class="img-area">
                            <img  :src="hostHead+lw.pbrphoto" class="image"/>
                        </div>
                        <div class="txt-area">
                            <div class="title">
                                <div class="prop">{{lw.pbrname}}</div>
                                <div class="prop">{{lw.pubtime}}</div>
                            </div>
                            <div class="data">
                                {{lw.dcontent}}
                            </div>

                        </div>
                        <div v-if="lw.state==2" class="reply-area">
                            <div class="hd">
                                <div class="prop">
                                    {{lw.rpname}}
                                </div>
                                <div class="prop">
                                    {{lw.replytime}}
                                </div>
                            </div>
                            <div class="bd">
                                <div class="img-area">
                                    <img :src="hostHead+lw.rpphoto" class="image"/>
                                </div>
                                <div class="txt-area">
                                    {{lw.replycontent}}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loginmodal :show.sync="openLogin"></loginmodal>
        <bottom></bottom>

    </div>
</template>

<script>
    import Loginmodal from "./loginmodal";
    import shead from "./shead";
    import Bottom from "./bottom";
    export default {
        name: "leavewordinfo",
        data(){
            return {
                hostHead: this.$app.contextPath,
                listLeaveword: [],
                dcontent: "",
                openLogin: false
            }
        },
        created(){
            this.getLeaveword()
        },
        methods:{
            async getLeaveword(){
                let url = "admin/leaveword/list";
                let res=await this.$http.post(url);
                console.log(res.data);
                this.listLeaveword=res.data.data;
            },
            isLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },
            async submitLw(){
                if(!this.isLogin()) {
                    this.$message.error("登录后在留言");
                    this.openLogin=true;
                    return;
                }
                if(this.dcontent.trim()==""){
                    this.$message.error("请输入留言信息");
                    return ;
                }

                let url="admin/leaveword/save";
                let res=await  this.$http.post(url,{
                    dcontent:this.dcontent,
                    hyid:this.huiyuan.id
                });
                if(res.data.stateCode>0){
                    this.dcontent="";
                    this.getLeaveword();
                }

            }
        },
        computed:{
            huiyuan(){
                return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
            }

        },
        components: {Bottom, Loginmodal,shead}
    }
</script>

<style scoped>

</style>
