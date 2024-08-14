<template>

    <div>
        <shead :headid="$route.query.headid"></shead>
        <div class="wrap com-panel">
            <div class="line-title">
                当前位置:>>首页
                &gt;&gt; {{lanmu.name}}
            </div>



            <div class="filter-box">

                <div class="item">

                    <div class="title">{{lanmu.name}}:</div>
                    <div class="content-list">
                        <ul v-if="lanmu.subtypes!=null">

                            <li   v-for="(subtype,index) in lanmu.subtypes" :key="subtype.id">
                                <span class="subtype" :class="{active:index==selectedIndex}"  @click="getXinxi(lanmu.id,subtype.id,index)">{{subtype.name}}</span>
                            </li>


                        </ul>
                    </div>
                </div>

            </div>


            <div class="two-split">
                <div class="split-left">

                    <div class="picture-list">
                        <ul>

                            <li v-for="xinxi in listXinxi" :key="xinxi.id">
                                <div class="item">

                                    <div class="img">
                                        <router-link :to="'/e/xinxiinfo?id='+xinxi.id">
                                            <img :src="hostHead+xinxi.images[0]"/>
                                        </router-link>
                                    </div>
                                    <div class="name">{{xinxi.title}}</div>
                                    <div class="price"></div>
                                    <div class="discount">{{xinxi.lmname}}</div>
                                </div>
                            </li>

                        </ul>
                    </div>


                    <div v-if="listXinxi.length==0" class="no-record-tip">

                        <div class="content">
                            <i class="fa fa-warning"></i>没有找到相关信息
                        </div>

                    </div>

                    <div class="clear"></div>



                </div>
                <div style="width:260px; " class="split-right">
                    <div class="vm-sidebar">
                        <div class="hd">热门信息</div>
                        <div class="bd">


                            <div v-for="xinxi in listHot" :key="xinxi.id" class="item">
                                <a :href="hostHead+'/e/xinxiinfo.jsp?id='+xinxi.id">
                                    <div class="image-wrap">
                                        <img :src="hostHead+xinxi.images[0]"/>
                                    </div>
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
        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom from "./bottom";
    import Shead from "./shead";

    export default {
        name: "xinxilist",
        data(){
            return{

                hostHead:this.$app.contextPath,
                listXinxi:[],
                listHot:[],
                pageindex:1,
                lanmuid:this.$route.query.lanmuid,
                lanmu:{},
                pagesize:10,
                total:10,
                selectedIndex:0,
                name:""
            }
        },
        async created() {

            this.getXinxi(this.lanmuid);
            this.getHot();
            this.getLanmu();

        },

        components: {Bottom, Shead},
        methods: {
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.getXinxi();
            },
            getXinxi(lmid,subtypeid,index) {
                if(index!=null)
                    this.selectedIndex=index;
                let param={
                    currentpageindex:this.pageindex,
                    pagesize:this.pagesize,
                    state:2,
                    tuijian:1
                };
                if(lmid!="")
                    param.lmid=lmid;
                if(subtypeid!=null)
                    param.subtypeid=subtypeid;

                let url = "admin/xinxi/list";
                this.$http.post(url,param).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        let pageInfo=res.data.data;
                        this.total=pageInfo.total;
                        this.listXinxi = pageInfo.list;
                    }
                });
            },

            getLanmu(){
                let url = "admin/lanmu/info";
                this.$http.post(url,{
                    id:this.lanmuid
                }).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        this.lanmu =res.data.data;
                    }
                });
            },
            getHot(){
                let url = "admin/xinxi/hot";
                this.$http.post(url).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        this.listHot =res.data.data;
                    }
                });
            }

        }
    }
</script>

<style scoped>

</style>
