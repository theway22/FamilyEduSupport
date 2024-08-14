<template>
    <div class="panel panel-default">
        <div class="panel-heading">我的聊天记录</div>
        <div class="panel-body">
            <el-row v-if="listTarget!=null&&listTarget.length>0">
                <el-col :span="6">
                    <div class="target-list">
                        <div class="hd">
                            聊天记录
                        </div>
                        <div class="bd">
                            <ul>
                               <li :class="{active:index==selectedIndex}" v-for="(item,index) in listTarget">
                                   <div class="figure">
                                       <img :src="hostHead+item.photo"/>
                                   </div>
                                   <div class="info">
                                       <div @click="showChat(item,index)" class="chatbtn">
                                           <div class="title">{{item.name}}</div>
                                           <div class="subtitle">{{item.tno}}</div>
                                       </div>

                                   </div>
                                   <el-badge :value="messageCount(item.id)" class="item">
                                       <el-button>消息</el-button>
                                   </el-badge>

                               </li>
                            </ul>
                        </div>

                    </div>

                </el-col>
                <el-col :span="18">
                    <div class="chat-box">
                        <div class="panel panel-default">
                            <div class="panel-heading">与{{target.name}}聊天记录</div>
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
                                            <div class="message-wrap">
                                                <div  class="toolbar">
                                                    <el-button circle type="danger" icon="el-icon-delete" size="small" @click="deleteRc(item.id)"></el-button>
                                                </div>
                                                {{item.dcontent}}
                                            </div>

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

                        </div>
                    </div>
                </el-col>
            </el-row>
            <div v-else class="no-record-tip">
                <div class="content">
                    <i class="el-icon-warning"></i>暂无聊天记录
                </div>
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
                "selectedIndex":0,
                listTarget:[],
                listNotice:[]

            }
        },
        props:{
            accountInfo:{
                type:Object
            }
        },
        methods: {
            //begin load

            async deleteRc(id){

                let url = "admin/leaveword/delete";
                let ids=[id];
                this.$confirm('是否要删除聊天记录?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    let {data:res} = await this.$http.post(url,{
                        ids
                    });
                    if(res!=null&&res.stateCode<0){
                        this.$message.error(res.des);
                        return;
                    }
                    this.getLeaveword();
                }).catch(() => {
                });

            },
            async showChat(target,index){

                this.target=target;
                this.selectedIndex=index;
                console.log("target=",target);
                //获取记录
                this.getLeaveword(target.id);
            },
            async getLeaveword(targetid){
                let url = "admin/leaveword/list";
                let params={
                    sendorid:this.accountInfo.id,
                    "ispaged":"-1"
                };
                if(targetid!=null)
                    params.targetid=targetid;
                else
                    params.targetid=this.target.id;
                let {data:res}=await this.$http.post(url,params);
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.listLeaveword=res.data;
            },

            async getTargets(){
                let url = "admin/leaveword/targets";
                let {data:res}=await this.$http.post(url,{
                    "sendorid":this.accountInfo.id,
                    "ispaged":"-1"
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.listTarget=res.data;
                if(this.listTarget!=null&&this.listTarget.length>0){
                    this.target=this.listTarget[0];
                }
            },
            messageCount(targetid){
                if(this.listLeaveword==null)
                    return  0;
                if(targetid==null)
                    return this.listLeaveword.length;
               let newLw= this.listLeaveword.filter(c=>c.targetid==targetid);
               if(newLw==null)
                  return  0;
               return newLw.length;

            }


        },
       async created() {
            await  this.getTargets();
            await this.getLeaveword();
        }

    }
</script>

<style scoped>

</style>
