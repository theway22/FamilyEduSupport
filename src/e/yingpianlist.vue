<template>
    <div id="app" >


        <shead :headid="$route.query.headid"></shead>

        <div style="min-height:600px;" class="wrap">

            <el-card>

            <div class="filter-box">
                <div class="item">

                    <div class="title">{{lanmu.name}}:</div>
                    <div class="content-list">
                        <ul v-if="lanmu.subtypes!=null">

                            <li   v-for="(subtype,index) in lanmu.subtypes">
                                <span class="subtype" :class="{active:index==selectedIndex}"  @click="getYingpian({typeid:lanmu.id,subtypeid:subtype.id,index:index})">{{subtype.name}}</span>
                            </li>


                        </ul>
                    </div>
                </div>
            </div>



            <div class="video-list">

                <div v-if="listYingpian.length>0" class="bd">

                    <div v-for="(item,index) in listYingpian" class="item">
                        <div class="card">
                            <router-link :to="'/e/yingpianinfo?id='+item.id">
                                <div class="pic">
                                    <img class="image" :src="hostHead+item.tupian"/>
                                    <span class="play-trigger"></span>
                                </div>
                                <div class="name">
                                    {{item.title}}
                                </div>
                                <div v-if="item.jifen>0" class="price">
                                    {{item.jifen}}¥
                                </div>
                                <div v-else class="price">
                                    免费
                                </div>
                            </router-link>
                        </div>
                    </div>

                </div>
                <div v-else  class="no-record-tip">
                    <div class="content">
                        <i class="fa fa-warning"></i>没有找到相关视频信息
                    </div>

                </div>


            </div>



            <div class="clear"></div>
            <el-pagination
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
    import {VueUtil} from "../util/vueutil";
    import Shead from "./shead";
    import Bottom from "./bottom";

    export default {
        name: "yingpianlist",
        data() {

            return {
                hostHead: this.$app.contextPath,
                listYingpian: [],
                listHot: [],
                pageindex: 1,
                typeid: 0,
                lanmu: {},
                pagesize: 10,
                total: 10,
                selectedIndex: 0,
                name: ""
            }

        },
        async created() {

            let typeid=this.$route.query.typeid;

            this.getYingpian({typeid});
            this.getLanmu();

        },

        methods: {
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.getYingpian({typeid:this.typeid,index:0});
            },
            getYingpian(options) {
                if(options.index!=null)
                    this.selectedIndex=options.index;
                let param={
                    currentpageindex:this.pageindex,
                    pagesize:this.pagesize,
                    state:2
                };
                if(options.typeid!=null) {
                    param.typeid = options.typeid;
                    this.typeid=options.typeid;
                }
                if(options.subtypeid!=null)
                    param.subtypeid=options.subtypeid;

                let url = "admin/yingpian/list";
                this.$http.post(url,param).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        let pageInfo=res.data.data;
                        this.total=pageInfo.total;
                        this.listYingpian = pageInfo.list;
                    }
                });
            },
           async getLanmu(){
                let url = "admin/lanmu/load";
                let {data:res}=await this.$http.post(url,{
                    id:this.typeid
                });
               if(res.data!=null) {
                 this.lanmu =res.data;
               }
            },
            getHot(){
                let url = "admin/yingpian/hot";
                this.$http.post(url).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        this.listHot =res.data.data;
                    }
                });
            }

        },

        components: {Bottom, Shead}
    }
</script>

<style scoped>

</style>
