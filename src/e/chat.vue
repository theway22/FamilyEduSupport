<template>
    <div class="chat-box">
        <div class="panel panel-default">
            <div class="panel-heading">{{target.tno}}--{{target.name}}在线交流</div>
            <div class="panel-body">
                <div class="messages-content">
                   <template  v-for="item in listLeaveword" >
                        <div    class="item">
                            <div class="message-user">
                                <div class="avatar">
                                    <img :src="hostHead+item.pbrphoto"/>
                                </div>
                                <div class="name">{{item.pbrname}}--{{item.pubtime}}</div>
                            </div>
                            <div class="message-wrap">{{item.dcontent}}</div>

                        </div>
                        <div v-if="item.state==2"  class="item outgoing">

                            <div class="message-user">
                                <div class="avatar">
                                    <img :src="hostHead+item.rpphoto"/>
                                </div>
                                <div class="name">{{item.rpname}}--{{item.replytime}}</div>
                            </div>
                            <div class="message-wrap">{{item.replycontent}}</div>

                        </div>
                   </template>
                </div>

            </div>
            <div class="panel-footer">
                <el-input v-model="dcontent" type="textarea" :rows="2" placeholder="在此输入文字信息..."></el-input>
                <span @click="sendHandler" class="el-button--danger el-button">
                    发送<i class="el-icon-arrow-right"></i>
                </span>
            </div>
        </div>
    </div>

</template>

<script>

    import "../admin/css/chat.css"
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "chat",
        data() {
            return {

                hostHead: this.$app.contextPath,
                listLeaveword:[],
                dcontent:"",
                target:{},
                listNotice:[]

            }
        },
        props:{
            params:{
                type:Object
            }
        },
        methods: {
            //begin load
            async sendHandler(){
                if(this.dcontent==""){
                    this.$message.error("请输入留言内容");
                    return ;
                }
                let url="admin/leaveword/save";
                let {data:res}=await  this.$http.post(url,{
                    "dcontent":this.dcontent,
                    "targetid":this.target.id,
                    "sendorid":this.params.sendor.id
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                //this.$message.success("发送成功");
                this.dcontent="";
                this.getLeaveword();
            },

            async getLeaveword(){
                let url = "admin/leaveword/list";
                let {data:res}=await this.$http.post(url,{
                    sendorid:this.params.sendor.id,
                    targetid:this.target.id,
                    "ispaged":"-1"
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.listLeaveword=res.data;
            },

            async getTarget(){
                let url = "admin/teacher/load";
                let {data:res}=await this.$http.post(url,{id:this.params.targetid});
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.target=res.data;
            },


        },
       async created() {
            console.log("执行create");
            await this.getTarget();
            await this.getLeaveword();
        }

    }
</script>

<style scoped>

</style>
