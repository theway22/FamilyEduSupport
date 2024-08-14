<template>
    <div>
        <shead></shead>

        <div style="display: flex" class="wrap com-panel clearfix">
            <div class="carousel-panel  ">
                <div class="carousel" style="background-color: rgb(238, 238, 238);">
                    <div class="car-big-picture">
                        <router-link v-for="(jdt) in listJiaodiantu" :key="jdt.id"  :to="jdt.href"><img
                            :src="hostHead+jdt.tupian " style="display: none;"></router-link>
                    </div>
                    <div class="car_click">
                        <div class="car_c_title">
                            <p v-for="(jdt,index) in listJiaodiantu" :key="jdt.id"
                               :style="index==0?'display: block;':'display: none;'">{{jdt.title}}</p>
                        </div>
                        <div class="car_c_smallpic">
                            <input type="button" class="car_c_inpt1">
                            <a v-for="(jdt) in listJiaodiantu" :key="jdt.id" target="_blank">
                                <img :src="hostHead+jdt.tupian" style="display: block;"/>
                            </a>

                            <input type="button" class="car_c_inpt2">
                        </div>
                    </div>
                </div>

            </div>
            <div class="plat-notice-panel ">
                <div class="title">
                    <i class="fa fa-volume-up"></i>系统公告
                    <div class="more">
                        <router-link to="/e/noticelist"><i
                            class="fa fa-chevron-right"></i></router-link>
                    </div>
                </div>

                <ul>
                    <li v-for="notice in listNotice" :key="notice.id">

                        <router-link :to="'/e/noticeinfo?id='+notice.id">{{notice.title}}</router-link>
                    </li>

                </ul>
            </div>
        </div>


        <div v-if="textArea!=null&&textArea.length>0"  class="wrap com-panel">

            <el-row :gutter="20">
                <el-col  :span="19">

                    <div v-for="lanmu in textArea.listLanmuContent" class="topic-panel">
                        <div class="hd">
                            {{lanmu.name}}
                            <div class="more"><a :href="hostHead+'/e/atriclelist.jsp?lanmuid='+lanmu.id">更多</a></div>
                        </div>
                        <div  class="bd">
                            <div v-for="(item,index) in lanmu.content" class="item">
                                <div class="imgar">
                                    <img class="image" :src="hostHead+item.tupian" alt="贤心"/>
                                </div>
                                <div class="textar">
                                    <div class="title">
                                        <a :href="hostHead+item.href">{{item.name}}</a>
                                    </div>
                                    <div class="subtitle">
                                        <span class="textfield">{{item.author}}</span>
                                        <span class="textfield">{{item.press}}</span>
                                        <span class="textfield">{{item.pubren}}</span>
                                        <span class="textfield">{{item.pubtime}}</span>
                                        <span class="textfield">
								 <i class="el-icon-chat-dot-round"></i>{{item.clickCount}}
							 </span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </el-col>
                <el-col :span="5">

                    <div class="simple-panel">
                        <div class="hd">本周热议</div>
                        <div class="bd">
                            <ul>
                                <li v-for="(xinxi,idx) in listHot">
                                    <div class="text"><span :class="{top:idx<3}" class="index">{{idx+1}}</span><a :href="hostHead+'/e/xinxiinfo.jsp?id='+xinxi.id">{{xinxi.title}}</a></div>
                                    <div class="subtext">
                                        <div class="field">{{xinxi.pubtime}}</div>
                                        <div class="field">
                                            <i class="el-icon-chat-dot-round"></i>
                                            {{xinxi.clickcount}}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>

                </el-col>
            </el-row>

        </div>



        <div class="wrap com-panel clearfix">

            <template v-for="lanmu in imagetextArea.listLanmuContent">
                <div v-if="lanmu.type==1"  class="article-lanmu">
                <div class="hd">{{lanmu.name}}</div>
                <div class="bd">
                    <div v-for="item in lanmu.content" class="article2 clearfix">
                        <div class="left">
                            <router-link :to="item.href">
                                <img  :src="hostHead+item.tupian"/>
                            </router-link>

                        </div>
                        <div class="right">
                            <div class="title">
                                <router-link :to="item.href">{{item.name}}</router-link>
                            </div>
                            <div class="abstract">
                                {{item.abstact}}
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="footer">
                            <span class="item"><i class="fa fa-clock-o"></i>&nbsp;&nbsp;{{item.pubtime}}</span>

                        </div>
                    </div>

                </div>
            </div>


                <div v-if="lanmu.type==2" class="image-text-box">

                    <div class="hd">
                        <div class="text">{{lanmu.name}}</div>
                    </div>

                    <div class="bd">

                        <div v-for="item in lanmu.content" class="item2">
                            <div class="image-wrap">
                                <router-link :to="item.href">
                                    <img :src="hostHead+item.tupian"/>

                                </router-link>

                            </div>
                            <div class="name">
                                {{item.name}}
                            </div>

                        </div>


                        <div v-if="lanmu.content.length<=0" class="no-record-tip">
                            <div class="content"><i class="fa fa-warning"></i>暂无{{lanmu.name}}信息</div>
                        </div>
                    </div>


                </div>



                <div v-if="lanmu.type==3" class="image-text-box">

                    <div class="hd">
                        <div class="text">{{lanmu.name}}</div>
                    </div>

                    <div class="bd">

                        <div v-for="item in lanmu.content" class="item2">
                            <div class="image-wrap">
                                <router-link :to="item.href">
                                    <img :src="hostHead+item.tupian"/>
                                    <div v-if="lanmu.type==3" class="video-tag"></div>
                                </router-link>

                            </div>
                            <div class="name">
                                {{item.name}}
                            </div>

                        </div>


                        <div v-if="lanmu.content.length<=0" class="no-record-tip">
                            <div class="content"><i class="fa fa-warning"></i>暂无{{lanmu.name}}信息</div>
                        </div>
                    </div>


                </div>

            </template>



        </div>

        <bottom></bottom>
    </div>

</template>

<script>

    import Shead from "./shead";
    import Bottom from "./bottom";
    import $ from "jquery";
    import SuperSlide from "./js/jquery.SuperSlide.2.1.1.js"
    import carouse from "./js/carousel"
    export default {
        name: "index",
        data() {
            return {
                imagetextArea: {},
                hostHead: this.$app.contextPath,
                textArea: {},
                listLanmu:[],
                listHot: [],
                listNotice: [],
                listJiaodiantu: []
            }
        },
        async created() {
            this.getNotice();
            this.getJiaodiantu();
            this.getHot();
            this.imagetextArea = await this.getAreaContent(1);
            this.textArea=await this.getAreaContent(2);
        },
        methods: {

            getHot() {
                let url = "admin/xinxi/hot";
                this.$http.post(url).then(res => {
                    console.log(res.data);
                    if (res.data != null && res.data.data != null) {
                        this.listHot = res.data.data;
                    }
                });
            },
            async getAreaContent(areaId) {
                let url = "admin/pagesetting/content?areaid=" + areaId;
                let {data:res} = await this.$http.get(url);
                console.log(res);
                return res.data;
            },
            getNotice() {
                let url = "admin/notice/list";
                this.$http.post(url, {ispaged: "-1"}).then(res => {
                    console.log(res.data);
                    this.listNotice = res.data.data;
                });
            },
            getJiaodiantu() {
                let url = "admin/jiaodiantu/list";
                this.$http.post(url, {ispaged: "-1"}).then(res => {
                    console.log(res.data);
                    this.listJiaodiantu = res.data.data;
                    this.$nextTick(() => {
                        $(".carousel").fullCaroursel();
                    });
                });
            },


            getLanmu(){
                let url = "admin/lanmu/list";
                this.$http.post(url).then(res => {
                    console.log(res.data);
                    this.listLanmu = res.data.data;

                });
            }


        },
        components: {Bottom, Shead}
    }
</script>

<style scoped>

    @import "./css/carousel.css";
</style>
