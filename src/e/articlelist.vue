<template>

    <div>
        <shead :headid="$route.query.headid"></shead>
        <div class="wrap">
            <el-card>
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


                <el-row >
                    <el-col :span="18"> <div class="article-list">
                        <div v-for="xinxi in listXinxi" :key="xinxi.id" class="item">
                            <div class="picar">
                                <router-link :to="'/e/xinxiinfo?id='+xinxi.id">
                                    <img class="image" :src="hostHead+xinxi.images[0]"/>
                                </router-link>
                            </div>
                            <div style="width:720px;" class="textar">
                                <div class="title"><router-link :to="'/e/xinxiinfo?id='+xinxi.id">{{xinxi.title}}</router-link></div>
                                <div class="brief">{{xinxi.abstact}}</div>
                                <div class="props">
                                    <div class="time">
                                        <i class="el-icon-time"></i>{{xinxi.pubtime}}
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-set-up"></i>{{xinxi.clickcount}}次
                                    </div>
                                </div>

                            </div>



                        </div>
                    </div>

                        <div v-if="listXinxi.length==0" class="no-record-tip">

                            <div class="content">
                                <i class="fa fa-warning"></i>没有找到相关信息
                            </div>

                        </div>
                    </el-col>
                    <el-col :offset="1" :span="5">
                        <hotnews></hotnews>
                    </el-col>
                </el-row>


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
            </el-card>
        </div>

        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom from "./bottom";
    import Shead from "./shead";
    import Hotnews from "./hotnews";

    export default {
        name: "articlelist",
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
            console.log("created");

            this.getXinxi(this.lanmuid);
            this.getHot();
            this.getLanmu();

        },
        async mounted() {


        },
        components: {Hotnews, Bottom, Shead},
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
