<template>

    <div id="app">
        <div class="search-panel">
            <div class="bd">

                <el-input style="width:320px;" placeholder="请输入内容" @keyup.enter.native="searchHandler" v-model="title"  class="input-with-select">
                    <el-button slot="append" type="primary" @click="searchHandler" icon="el-icon-search"></el-button>
                </el-input>

                <div class="item">
                    <router-link to="/e/index">首页</router-link>

                </div>


            </div>

        </div>


        <div v-if="listSearch!=null&&listSearch.length>0" class="wrap round-block">

            <div class="video-list">

                <div class="bd">

                    <div v-if="listSearch!=null&&listSearch.length>0" v-for="si in listSearch" :key="si.id" class="item">
                        <div class="card">
                            <router-link :to="si.href">
                                <div class="pic">
                                    <img class="image" :src="hostHead+si.tupian"/>

                                    <span v-if="si.xtype==3" class="play-trigger"></span>


                                </div>
                                <div class="name">
                                    {{si.name}}
                                </div>

                            </router-link>
                        </div>
                    </div>



                </div>
            </div>

        </div>


        <div v-if="search&&listSearch!=null&&listSearch.length<=0" class="no-record-tip">
            <div class="content"><i class="fa fa-warning"></i>暂无相关<span class="red">{{title}}</span>信息</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "search",
        data() {
            return {
                hostHead: this.$app.contextPath,
                listSearch: [],
                title: this.$route.query.title,
                search:false
            }
        },
        methods: {

            async searchHandler(){
                if (this.title==""){
                    this.$message.error("请输入关键词");
                    return ;
                }
                this.search =true;

                let {data:res}=await this.$http.post("admin/sitesearch/list",{title:this.title});
                console.log(res);
                if (this.stateCode<0){
                    this.$message.error("失败");
                    return ;
                }
                this.listSearch=res.data;

            }

        },
        created() {

            if (this.title!="")
                this.searchHandler();

        }

    }
</script>

<style scoped>
    .search-panel {
        width: 670px;
        margin: 100px auto 0;

    }

    .search-panel .bd {

        background-color: #eeeeee;
        padding: 50px 30px;
        margin: 80px 0;
        position: relative;
        -moz-border-radius: 16px;
        -webkit-border-radius: 16px;
        border-radius: 16px;
        display: flex;
    }
    .search-panel .bd .item{
        width: 52px;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;

    }

    .red {
        color: red;
    }
</style>
