<template>


    <div >

        <shead :headid="$route.query.id"></shead>
        <div  class="wrap  round-block">


        <div class="two-split ">
            <div class="split-left white-paper">

                <div class="show-details">
                    <div class="picture-box">
                        <img id="imgTupian" :src="hostHead+demand.tupian"/>
                        <div class="operation">

                        </div>
                    </div>
                    <div class="text-box">
                        <div class="title">
                            {{demand.title}}

                        </div>
                        <div class="sub-title">

                        </div>

                        <div>
                            <ul>



                                <li>
                                    <strong>发布时间</strong>
                                    {{demand.pubtime}}
                                </li>

                                <li>
                                    <strong>发布人</strong>
                                    {{demand.hyname}}--{{demand.hyaccount}}
                                </li>

                                <li>
                                    <strong>状态</strong>

                                    <span v-if="demand.state==1">寻找中</span>
                                    <span v-if="demand.state==2">已完成</span>

                                </li>

                                <li>
                                    <strong>点击次数</strong>
                                    {{demand.clickcount}}
                                </li>


                                <li>
                                    <strong>类别</strong>
                                    {{demand.typename}}
                                </li>
                                <li>
                                    <span @click="shoucangHandler" class="el-button el-button--primary"><i class="el-icon-folder-add"></i>关注</span>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                <el-tabs value="first">
                    <el-tab-pane name="first" label="介绍">

                        <div v-html="demand.dcontent" class="brief-content">

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="评论" name="second">

                        <!--评论-->
                        <comment :belongid="$route.query.id" xtype="demand"></comment>
                    </el-tab-pane>
                </el-tabs>


                <loginmodal :show.sync="openLogin"></loginmodal>


            </div>

            <div class="split-right">
                <div class="vm-sidebar">
                    <div class="hd">热门信息</div>
                    <div class="bd">
                        <div v-for="xinxi in listHotXinxi" :key="xinxi.id" class="item">
                            <a :href="'/e/xinxiinfo?id='+xinxi.id">
                                <div class="image-wrap">
                                    <img :src="hostHead+xinxi.images[0]"/>
                                </div>
                                <div class="tag">{{xinxi.lmname}}</div>
                                <div class="text-wrap">
                                    <div class="name">{{xinxi.title}}</div>
                                    <div class="muted">{{xinxi.pubtime}}</div>
                                    <div class="bm-wrap">{{xinxi.clickcount}}人点击</div>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
        <bottom></bottom>

    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";
    import Bottom from "./bottom";
    import Shead from "./shead";
    import Comment from "./comment";
    import Loginmodal from "./loginmodal";

    export default {
        name: "demandinfo",
        data() {

            return {
                hostHead: this.$app.contextPath,
                demand: {},
                hyid: "",
                listHotXinxi: [],
                openLogin: false,
                name: ""
            }

        },
        async created() {
            console.log("created");
            this.getInfo();
            this.getHotXinxis();
        },

        methods: {

            async getInfo() {
                let util = new VueUtil(this);
                let url = "admin/demand/info";
                let id = this.$route.query.id;
                let {data: res} = await util.http.post(url, {id});
                if (res != null & res.stateCode < 0) {
                    util.message.error(res.des);
                    return;
                }
                if (res.data != null) {
                    this.demand = res.data;
                }
            },
            async getHotXinxis() {
                let util = new VueUtil(this);
                let {data: res} = await util.http.post("admin/xinxi/hot");
                if (res != null && res.stateCode > 0) {
                    this.listHotXinxi = res.data;
                    console.log(this.listHotXinxi);
                }
            },
            async shoucangHandler() {
                if (this.hyid == "") {
                    this.openLogin = true;
                    return;
                }
                let url = "admin/shoucang/save";
                let util = new VueUtil(this);

                let {data: res} = await util.http.post(url, {
                    targetid: this.demand.id,
                    targetname: this.demand.title,
                    tupian: this.demand.images[0],
                    hyid: this.huiyuan.id,
                    xtype: "demand",
                    href: "/e/demandinfo?id=" + this.demand.id
                });
                if (res != null && res.stateCode < 0) {
                    util.message.error(res.des);
                    return;
                }
                util.message.success("收藏成功");
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

        components: {Loginmodal, Comment, Shead, Bottom}
    }
</script>

<style scoped>

</style>
