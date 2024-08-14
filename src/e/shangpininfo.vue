<template>

    <div >
        <shead :headid="this.$route.query.headid"></shead>
        <div v-if="!over" class="wrap round-block">

            <div class="line-title">
                当前位置：<router-link to="/e/index">首页</router-link> >> 教育服务信息>>{{shangpin.name }}
            </div>

            <div class="fn-clear"></div>
            <div class="shangpin-info clearfix">
                <div class="pic-area">
                    <div class="big-img">
                        <img :src="hostHead+bigPic"/>
                    </div>
                    <div class="small-imgs owl-carousel">
                        <div @click="select(item,index)" v-for="(item,index) in shangpin.images "
                             :class="index==selectedIndex?'active item':'item'">
                            <img :src="hostHead+item"/>
                        </div>
                    </div>
                </div>


                <div class="props">
                    <div class="title">

                        {{shangpin.name}}
                    </div>
                    <div class="subtitle">
                        {{shangpin.subtitle}}
                    </div>
                    <div class="price-block clearfix">


                        <div class="mall-price clearfix">
                            <div class="label">价格</div>
                            <div class="price"> ¥ {{shangpin.hyjia}}</div>

                        </div>
                    </div>

                    <div style="margin-top:20px " class="prop">
                        <dl class="clearfix">
                            <dt>教育指导师</dt>
                            <dd>
                                <router-link :to="`/e/teacherspace?id=${shanghu.id}`">{{shanghu.tno}}({{shanghu.name}})</router-link>

                            </dd>
                        </dl>
                    </div>


                    <div style="margin-top:20px " class="prop">
                        <dl class="clearfix">
                            <dt>课时</dt>
                            <dd>{{shangpin.chandi}}课程</dd>
                        </dl>
                    </div>




                    <div class="prop">


                        <el-button-group>
                            <el-button type="primary" @click="shoucangHandler" ><i class="fa fa-star"></i>收藏</el-button>


                            <el-button v-if="shangpin.kucun>0" @click="showAppointdlg" type="danger">
                                <i class="fa fa-plus"></i>预订课程
                            </el-button>


                        </el-button-group>

                    </div>


                </div>
            </div>

            <div v-if="listRecomment!=null&&listRecomment.length>0" class="video-list">
                <div class="hd">
                    猜你喜欢教育服务
                </div>
                <div class="bd">

                    <div v-for="item in listRecomment" class="item">
                        <div class="card">
                            <router-link :to="'/e/shangpininfo.jsp?id='+item.id">
                                <div class="pic">
                                    <img class="image" :src="hostHead+item.images[0]"/>

                                </div>
                                <div class="name">
                                    {{item.name}}--({{item.tagname}})
                                </div>
                                <div class="discount"></div>
                                <div class="price">¥{{item.hyjia}}</div>
                            </router-link>
                        </div>
                    </div>

                </div>
            </div>

            <el-tabs value="first">
                <el-tab-pane label="教育服务介绍" name="first">
                    <div class="brief-content" v-html="shangpin.jieshao"></div>
                </el-tab-pane>
                <el-tab-pane label="教育服务评价" name="second">
                    <div class="spcomment-list">

                        <div v-for="comment in listComment" class="item clearfix">
                            <div class="lfar">
                                <img :src="hostHead+comment.touxiang" class="photo"/>
                            </div>
                            <div class="rgar">
                                <div class="trow">
                                    {{comment.accountname}}({{comment.name}})
                                </div>
                                <div class="trow">
                                    <el-rate :value="comment.cresult"></el-rate>
                                    {{comment.des}}
                                </div>
                            </div>


                        </div>
                        <div v-if="listComment.length==0" class="no-record-tip">
                            <div class="content">
                                <i class="fa fa-warning"></i>暂无相关评论
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>


            <loginmodal :show.sync="openLogin"></loginmodal>

            <el-dialog title="预订服务" :visible.sync="appointdlg">


                <table width="100%" class="smart-table" border="1">


                    <tr>
                        <td class="tlabel">名称</td>
                        <td>
                            {{shangpin.name}}
                        </td>
                    </tr>

                    <tr>
                        <td class="tlabel">金额(元)</td>
                        <td>
                            {{shangpin.hyjia}}¥
                        </td>
                    </tr>


                <template v-if="huiyuan!=null">

                    <tr >
                        <td class="tlabel">姓名</td>
                        <td>{{huiyuan.name}}</td>
                    </tr>

                    <tr>
                        <td class="tlabel">电话</td>
                        <td>{{huiyuan.mobile}}</td>
                    </tr>
                </template>


                    <tr>
                        <td width="20%" class="tlabel">数量</td>
                        <td>
                            <el-input-number v-model="appointorder.count"  :min="1" :max="10" label="数量"></el-input-number>
                        </td>
                    </tr>



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
        <div class="wrap round-block" v-else>
            <div class="no-record-tip">
                <div class="content">
                    <i class="el-icon-check"></i>下单成功<router-link to="/huiyuan/appointordermanager">我的订单</router-link>
                </div>
            </div>
        </div>

        <bottom></bottom>


    </div>
</template>

<script>
    import Shead from "./shead";
    import Bottom from "./bottom";
    import Loginmodal from "./loginmodal";

    import {VueUtil} from "../util/vueutil";
    import PopDialogButton from "../common/mydialog/PopDialogButton";

    export default {
        name: "shangpininfo",
        data(){
            return {
                listComment: [],
                bigPic: "",
                count: 1,
                hostHead: this.$app.contextPath,
                listRecomment: [],
                selectedIndex: 0,
                shangpin: {},
                openLogin: false,
                appointdlg:false,
                idcardno:"",
                over:false,
                lwdlg:false,
                shanghu:{},
                appointorder:{
                    yydate:new Date().format("yyyy-MM-dd"),
                    mobile:"",
                    hyid:"",
                    fee:10,
                    count:1,
                    danjia:100,
                    targetid:1,
                }


            }

        },
        created(){

            let id=this.$route.query.id;
            this.getShangpin(id);
            this.getComment(id);


        },
        methods:{
           async  getComment(id){
                let url="admin/spcomment/list";
                let {data:res}=await this.$http.post(url,{
                    id,
                    "ispaged":"-1"
                });
               console.log(res);
               this.listComment=res.data;
            },
            async showLwdlg(){
                if(!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                this.lwdlg=true;
            },



            getRecomment(){
                let url="admin/shangpin/recomment";
                this.$http.post(url).then(res=>{
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null)
                        this.listRecomment=res.data.data;
                });

            },
            select(item,index){
                this.bigPic=item;
                this.selectedIndex=index;
            },
            async getShangpin(id){
                let url="admin/shangpin/info";
                let p1={id:id};

                if(this.hyid!="")
                    p1.hyid=this.hyid;
                let {data:res}=await this.$http.post(url,p1);
                this.shangpin=res.data;
                this.bigPic=this.shangpin.images[0];
                this.getShanghu(this.shangpin.pubren);


            },

            async getShanghu(id) {

                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/teacher/info";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.shanghu = res.data;
                }
            },//end load


            async shoucangHandler(){
                if(!this.isLogin) {
                    this.openLogin = true;
                    return;
                }
                let url="admin/shoucang/save";
                console.log("shanppin.id=",this.shangpin.id);

                let {data:res}=await this.$http.post(url,{
                    targetid:this.shangpin.id,
                    targetname:this.shangpin.name,
                    tupian:this.shangpin.images[0],
                    hyid:this.huiyuan.id,
                    xtype:"shangpin",
                    href:"/e/shangpininfo?id="+this.shangpin.id
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.$message.success("收藏成功");
            },

            async showAppointdlg(){
                if(this.huiyuan==null) {
                    this.openLogin = true;
                    return;
                }
                this.appointdlg=true;
                this.appointorder.targetid = this.shangpin.id;
                this.appointorder.hyid = this.huiyuan.id;
                this.appointorder.mobile = this.huiyuan.mobile;
                this.appointorder.danjia = this.shangpin.hyjia;
                this.appointorder.fee=this.appointorder.count*this.appointorder.danjia;
            },
            async submitHandler(){
                if (this.huiyuan==null){
                    this.$message.error("登录后再预定");
                    return;
                }
                if (this.huiyuan.idcardno==""){
                    this.$message.error("请完善个人信息报名");
                    return;
                }
                let util=new VueUtil(this);
                this.appointorder.fee=this.appointorder.count*this.appointorder.danjia;
                let params={...this.appointorder};
                let {data:res}= await util.http.post("admin/appointorder/save",params);
                if(res.stateCode<=0){
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                util.message({
                    message:"缴费成功",
                    type:'success',
                    duration:2000
                });
                this.appointdlg = false;
                this.over=true;

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
        components: {PopDialogButton, Bottom,Shead,Loginmodal},

    }
</script>

<style scoped>

</style>
