<template>

    <div class="mypanel">

        <div class="hd">
             我的关注
        </div>

        <div class="bd">
            <div class="video-list">

            <div class="bd">

                <div class="item" :key="star.id" v-for="star in listStars">
                    <div class="card">

                        <div class="pic">
                            <router-link :to="'/e/teacherspace.jsp?id='+star.id">
                                <img class="image" :src="hostHead+star.photo"/>
                            </router-link>

                        </div>
                        <div class="name">
                            {{star.name}} <span style="cursor: pointer" @click="cancelHandler(star.gzid)" class="cancel"><i class="el-icon-close"></i>取消关注</span>
                        </div>

                    </div>
                </div>


                <div v-if="listStars!=null&&listStars.length==0" style="width: 100%;" class="no-record-tip">
                    <div class="content">
                        <i class="fa fa-warning"></i>
                        暂无关注对象
                    </div>
                </div>

            </div>
        </div>
        </div>
    </div>

</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "mystar",
        data(){
            return {
                actiontype:'save',
                hostHead:this.$app.contextPath,

                listStars:[]
            }
        },
        props:{
            accountInfo:{
                type:Object
            }
        },
        methods:{
            //begin load
            async getStars(){
                let id=this.accountInfo.id;
                let util=new VueUtil(this);
                if(id!=null){
                    let url="admin/fans/mystars";
                    let {data:res}=await util.http.post(url,{id:id});
                    console.log("res",res);
                    if(res!=null&&res.data!=null)
                        this.listStars=res.data;
                }
            },
            async cancelHandler(id) {


                let util=new VueUtil(this);
                if(id!=""){
                    let url="admin/fans/delete";
                    let {data:res}=await util.http.post(url,{id});
                    if (res!=null&&res.stateCode<0) {
                        this.$message.error(res.des);
                        return;
                    }
                    this.getStars();
                }

            }

        },
        created(){
            this.getStars();
        }
    }
</script>

<style scoped>

</style>
