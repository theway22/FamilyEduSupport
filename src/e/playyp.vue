<template>

    <div >
        <shead headid="$route.query.headid"></shead>




        <div v-if="yingpian.xshowtype==2" class="player-box">
            <div class="hd">{{yingpian.title}} </div>
            <video width="99%" height="600" :src="hostHead+yingpian.remoteurl" controls :poster="hostHead+yingpian.tupian"></video>
        </div>


        <div v-if="yingpian.xshowtype==1" class="wrap white-paper com-panel">

            <div class="embed-video">
                <div class="hd">{{yingpian.title}}</div>

                <div v-html="yingpian.remoteurl"></div>

            </div>

        </div>




    </div>
</template>

<script>
    import Shead from "./shead";
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "playyp",
        data(){
            return {

                hostHead: this.$app.contextPath,
                yingpian: {},
            }
        },
        async created() {
            await this.getInfo();
        },

        methods: {
            async getInfo() {
                let util=new VueUtil(this);
                let url = "admin/yingpian/info";
                let id=this.$route.query.id;
                let {data:res}=await util.http.post(url,{id});
                if(res!=null&res.stateCode<0){
                    util.message.error(res.des);
                    return;
                }
                if(res.data!=null){
                    this.yingpian = res.data;
                }


            }
        },
        components: {Shead}
    }
</script>

<style scoped>
    .player-box {
        margin: 30px auto 0;
        width: 1100px;
        height: 620px;
        background: #999;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }


    .player-box .hd {
        width: calc(100% - 20px);
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background: #353535;
        color: #fff;
        font-size: 12px;
    }
</style>
