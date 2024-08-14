<template>

    <div >
        <shead :headid="$route.query.headid"></shead>

        <div class="wrap round-block">
            <div class="line-title">
                当前位置：<router-link to="/e/index">首页</router-link>
                &gt;&gt;  课程信息
            </div>

            <div class="two-split">
                <div   style="width:250px;" class="split-right">
                    <div class="catebox">
                        <div class="title">课程类别</div>
                        <div class="content">

                            <dl v-for="lanmu in listLanmu">
                                <dt><span @click="getShangpin({typeid:lanmu.id})">{{lanmu.name}}</span></dt>

                                <dd>
                                    <span class="item" v-for="subtype in lanmu.subtypes"  @click="getShangpin({typeid:lanmu.id,subtypeid:subtype.id})" >{{subtype.name}}</span>
                                </dd>
                            </dl>


                        </div>

                    </div>


                </div>



                <div style="width:960px;" v-if="listShangpin.length>0" class="rich-list split-left">
                    <div class="bd">
                        <div v-for="item in listShangpin" class="imgtext-item b-line">
                            <div class="imgar">
                                <router-link :to="`/e/shangpininfo?headid=${$route.query.headid}&id=${item.id}`"><img :src="hostHead+item.images[0]"  class="image"/></router-link>
                            </div>
                            <div class="textar">
                                <div class="title">
                                    <router-link :to="`/e/shangpininfo?headid=${$route.query.headid}&id=${item.id}`">{{item.name}}</router-link>
                                    <div class="price">价格:{{item.hyjia}}¥</div>
                                </div>
                                <div  class="des">
                                    {{item.absrtact}}
                                </div>
                                <div class="it">
								<span class="tag">
									{{item.subtypename}}
								</span>
                                <span class="tag">
									{{item.chandi}}
								</span>
                                    <span class="tag">
									{{item.hyjia}}¥
								</span>
                                    <router-link class="tag" :to="`/e/shangpininfo?headid=${$route.query.headid}&id=${item.id}`">详细</router-link>

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

                <div v-else class="no-record-tip">
                    <div class="content">
                        <i class="fa fa-warning"></i>没有找到相关信息
                    </div>

                </div>


            </div>



    </div>

        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom from "./bottom";
    import Shead from "./shead";
    export default {
        name: "shangpinlist",
        data(){
            return {
                hotSales:[],
                hostHead: this.$app.contextPath,
                listShangpin:[],
                pageindex:1,
                typeid:this.$route.query.typeid,
                typeid:"0",
                listLanmu:[],

                selectedIndex:0,
                pagesize:10,
                total:10,
            }
        },
        async created(){
            await this.getLanmu();
            await this.getShangpin(this.typeid);

        },
        components: {Bottom, Shead},
        methods:{


            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function(pageindex){
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.getShangpin({typeid:this.typeid});
            },
            getShangpin(options) {
                if (options.subtypeIndex!=null)
                    this.selectedIndex=options.subtypeIndex;

                let param={
                    currentpageindex:this.pageindex,
                    state:1,
                    pagesize:this.pagesize
                };
                if(options.typeid!=null)
                    param.typeid=options.typeid;
                if(options.subtypeid!=null)
                    param.subtypeid=options.subtypeid;
                if (options.pubren!=null)
                    param.pubren=options.pubren;

                let url = "admin/shangpin/list";
                this.$http.post(url,param).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        let pageInfo=res.data.data;
                        this.total=pageInfo.total;
                        this.listShangpin = pageInfo.list;
                    }
                });
            },

            async getLanmu(){
                let url = "admin/shangpin/mylanmu";
                let {data:res}=await this.$http.post(url);
                if(res!=null&&res.data!=null) {
                    this.listLanmu =res.data;
                    if (this.listLanmu.length>0)
                        this.typeid=this.listLanmu[0].id;
                }
            },

        }

    }
</script>

<style scoped>

</style>
