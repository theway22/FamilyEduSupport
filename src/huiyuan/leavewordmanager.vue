<template>

    <div class="mypanel">
        <div class="hd">
            我发送的消息
        </div>


        <div  class="bd">
            <div class="clear"></div>
            <div class="action-details">
                <el-button-group>
                    <el-button  @click="selectedAllHandler" type="success"><i class="el-icon-check"></i>选择</el-button>
                    <el-button  @click="deleteRc" type="danger"><i class="el-icon-delete"></i>删除</el-button>
                </el-button-group>

            </div>
            <div class="lw-ct-wrap">
                <div class="hd">
                    <div class="title">全部留言</div>
                    <div class="subtitle">{{listLeaveword.length}}条</div>
                </div>
                <div class="bd">
                    <div v-for="lw in listLeaveword" :key="lw.id" class="lw-item">
                        <div class="img-area">
                            <img :src="hostHead+lw.pbrphoto" class="image"/>
                            <span><input type="checkbox" name="id" :value="lw.id"  v-model="lw.rowSelected"/> </span>
                        </div>
                        <div class="txt-area">
                            <div class="title">
                                <div class="prop">{{lw.pbrname}}</div>
                                <div class="prop">{{lw.pubtime}}</div>
                            </div>
                            <div class="data">
                                {{lw.dcontent}}
                            </div>


                        </div>
                        <div v-if="lw.state==2" class="reply-area">
                            <div class="hd">
                                <div class="prop">
                                    {{lw.rpname}}
                                </div>
                                <div class="prop">
                                    {{lw.replytime}}
                                </div>
                            </div>
                            <div class="bd">

                                <div class="img-area">
                                    <img :src="hostHead+lw.rpphoto" class="image"/>
                                </div>
                                <div class="txt-area">
                                    {{lw.replycontent}}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="listLeaveword.length==0" class="no-record-tip">
                    <div class="content">
                        <i class="el-icon-warning"></i>没有留言记录</div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        name: "leavewordmanager",
        data() {
            return {
                listLeaveword: [],
                hostHead:this.$app.contextPath,
                selectedAll: false,
                checkedIds: []
            }
        },
        created() {
            this.getLeaveword()
        },
        props:{
            accountInfo:{
                type:Object
            }
        },
        methods: {
            async getLeaveword() {
                let url = "admin/leaveword/list";
                let {data:res} = await this.$http.post(url,{
                    hyid:this.accountInfo.id
                });
                if (res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                console.log(res.data);
                res.data.forEach(c=> {
                    c.rowSelected=false;
                })
                this.listLeaveword = res.data;
            },

            async deleteRc(){
                let url = "admin/leaveword/delete";
                if(this.listLeaveword.length==0){
                    alert("删毛线,没有记录");
                    return;
                }
                let ids=this.listLeaveword.filter(c=>c.rowSelected).map(c=>c.id);
                if (ids.length<=0){
                    this.$message.error("删除毛线,先选择再删除");
                    return;
                }
                let {data:res} = await this.$http.post(url,{
                    ids
                });
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.getLeaveword();

            },
            selectedAllHandler(){
                this.selectedAll=!this.selectedAll;
                if(this.listLeaveword!=null){
                    this.listLeaveword.forEach(c=>{
                        c.rowSelected=this.selectedAll;
                    });
                }
            },

        }
    }
</script>

<style scoped>

</style>
