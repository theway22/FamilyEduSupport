<template>

    <div  >
        <div class="panel panel-default">
            <!-- 搜索控件开始 -->

            <!-- 搜索控件结束 -->
            <div class="panel-heading">服务信息</div>
            <div class="shangpin-info clearfix">
                <div style="width:246px;" class="pic-area">
                    <div class="big-img">
                        <img :src="hostHead+bigPic"/>
                    </div>
                    <div class="small-imgs owl-carousel">
                        <div @click="select(item,index)"  v-for="(item,index) in shangpin.images " :class="index==selectedIndex?'active item':'item'">
                            <img  :src="hostHead+item"/>
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
                            <dt>所在地区</dt>
                            <dd>{{shangpin.chandi}}</dd>
                        </dl>
                    </div>

                </div>
            </div>

            <el-tabs  value="first" >
                <el-tab-pane label="课程介绍" name="first">
                    <div class="brief-content" v-html="shangpin.jieshao"></div>
                </el-tab-pane>

            </el-tabs>



        </div>





    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "shangpindetails",
        data(){
            return {

                bigPic: "",
                count: 1,
                hostHead: this.$app.contextPath,
                listJingpai:[],
                jingpai:{},
                selectedIndex: 0,
                infodlg:false,
                shangpin: {},
                shanghu:{},
                openLogin: false,
                idcardno:"",
                over:false,
                zhdlg:false,

            }

        },
        created(){


            this.getShangpin();


        },
        methods:{


            async getTarget(id) {
                let url = "admin/jingpai/target";

                let {data:res} = await this.$http.post(url, {id});
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.shanghu=res.data;
            },

           async showInfodlg(jingpai){
                this.jingpai=jingpai;
                await this.getTarget(jingpai.id);
                this.infodlg = true;
            },

            select(item,index){
                this.bigPic=item;
                this.selectedIndex=index;
            },

            async getShangpin(id){
                let url="admin/shangpin/info";
                let p1={id:this.$route.query.id};

                if(this.hyid!="")
                    p1.hyid=this.hyid;
                let {data:res}=await this.$http.post(url,p1);
                this.shangpin=res.data;
                this.bigPic=this.shangpin.images[0];


            },


        },

    }
</script>

<style scoped>

</style>
