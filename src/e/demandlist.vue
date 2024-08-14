<template>

    <div >
        <shead :headid="$route.query.headid"></shead>
        <div>
            <img :src="hostHead+'/images/banner02.jpg'" width="100%" height="300"/>
        </div>
        <div class="wrap round-block">
            <div class="filter-box">

                <div class="item">
                    <div class="title">分类:</div>
                    <div class="content-list">
                        <ul>

                            <li v-for="(item,idx) in listDemandtype">
                                <span @click="list(item.id,idx)" :class="{active:idx==selectedIndex}" class="subtype">{{item.name}}</span>
                            </li>

                        </ul>
                    </div>
                </div>

            </div>

            <div class="video-list">


                <div class="bd">

                    <div v-for="demand in listDemand" class="item">
                        <div class="card">
                            <div class="pic">
                                <router-link :to="'/e/demandinfo?id='+demand.id">

                                    <img class="image" :src="hostHead+demand.tupian"/>
                                </router-link>
                            </div>

                            <div class="name">{{demand.title}}</div>

                        </div>
                    </div>
                </div>

            </div>

            <div v-if=" listDemand.length==0" class="no-record-tip">
                <div class="content">
                    <i class="fa fa-warning"></i>没有找到相关需求
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
    import {VueUtil} from "../util/vueutil";
    import Shead from "./shead";
    import Bottom from "./bottom";

    export default {
        name: "demandlist",
        data() {

            return {
                hostHead: this.$app.contextPath,
                listDemand: [],
                listDemandtype: [],
                pageindex: 1,
                pagesize: 10,
                total: 10,
                selectedIndex: 0,
                name: ""
            }

        },
        async created() {
            console.log("created");
            this.getTypelist();
            this.list();
        },
        async mounted() {
        },
        methods: {
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function (pageindex) {
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.list();
            },
            async list(typeid, idx) {
                if (idx != null)
                    this.selectedIndex = idx;
                let util = new VueUtil(this);
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize

                };
                if (typeid != null)
                    param.typeid = typeid;
                let url = "admin/demand/list";
                let {data: res} = await util.http.post(url, param);
                if (res != null && res.stateCode < 0) {
                    util.message.error(res.des);
                    return;
                }
                if (res.data != null) {
                    this.total = res.data.total;
                    this.listDemand = res.data.list;
                }
            },
            async getTypelist() {
                let util = new VueUtil(this);
                let url = "admin/subtype/list";
                let {data: res} = await util.http.post(url, {ispaged: "-1",parentid:3});
                if (res != null && res.stateCode < 0) {
                    util.message.error(res.des);
                    return;
                }
                if (res.data != null) {
                    this.listDemandtype = res.data;
                }
            },
        },
        components: {Bottom, Shead}
    }
</script>

<style scoped>

</style>
