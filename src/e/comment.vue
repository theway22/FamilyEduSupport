<template>
    <div class="comment-box">
        <div class="comment-list">

            <h4>评论信息</h4>
            <ul>

                <li v-for="(item,index) in listComment" :key="item.id">
                    <div class="hd">第{{index+1}}楼回帖</div>
                    <div class="comment-item">
                        <div class="comment-user">
                            <div class="pic">
                                <img class="image" width="48" height="48" :src="hostHead+item.photo">
                            </div>
                            <div class="subtitle">
                                <div>{{item.createtime}}</div>
                                <div>{{item.hyaccount}}({{item.hyname}})</div>
                            </div>
                        </div>
                        <div class="item-content">
                            <div v-html="item.cdata"></div>
                            <div class="action-row">
								<span v-if="deleteComment" style="cursor: pointer;" @click="deleteHandler(item.id)" class="btn-sm btn-danger">
									<i class="fa fa-trash"></i>
								</span>

                            </div>

                        </div>
                    </div>
                </li>


            </ul>

        </div>
        <div v-if="withComment">
            <div v-if="isLogin" class="comment-container">
                <div class="inner-container">

                    <div class="comment-message">
                        <quill-editor v-model="cdata" :options="{placeholder: '说点啥吧'}"></quill-editor>
                    </div>
                    <div class="comment-action-box">

						<span class="white-color"><span id="hasInputedCount">0</span>/<strong
                            id="removeCount">210</strong>字</span>
                        <el-button @click="submitComment" type="success"><i class="el-icon-plus"></i>发布</el-button>
                    </div>

                </div>

            </div>
            <div v-else style="font-size:18px;padding:20px 120px;">
                登录后才能进行回复 ,<span style="color:#e9ab32;cursor: pointer;" @click="openLogin=true">登录</span>
            </div>

            <loginmodal :show.sync="openLogin"></loginmodal>
        </div>
    </div>
</template>

<script>
    import Loginmodal from "./loginmodal";
    export default {
        name: "comment",
        components: {Loginmodal},
        data() {
            return {
                listComment: [],
                cdata: "",
                openLogin: false,
                hostHead: this.$app.contextPath
            }
        },
        created() {

            this.getComment();
        },
        methods: {

            async deleteHandler(id) {

                let url="admin/comment/delete";
                this.$confirm('是否要删除评论?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(()=>{
                    this.$http.post(url, {id},{emulateJSON:false}).then(res=>{
                        if (res.data != null && res.data.stateCode > 0) {
                            this.getComment();
                        }
                    });
                }).catch(()=>{});
            },
            async getComment() {
                let params = {};
                console.log("this.belongid="+this.belongid);
                console.log("this.xtype="+this.xtype);
                if (this.belongid != "")
                    params.belongid = this.belongid;
                if (this.xtype != "")
                    params.xtype = this.xtype;
                let url = "admin/comment/list";
                let defaultOption = {};
                Object.assign(defaultOption, params);
                let res = await this.$http.post(url, defaultOption);
                if (res.data != null && res.data.data != null) {
                    this.listComment = res.data.data;
                    console.log(res.data);
                }
                this.$nextTick(() => {


                });

            },
            async submitComment() {
                if (this.cdata == "") {
                    this.$message.error("请输入评论内容");
                    return;
                }
                let url = "admin/comment/save";
                let defaultOption = {
                    hyid: this.huiyuan==null?0:this.huiyuan.id,
                    cdata: this.cdata,
                    istopic: 1,
                    topicid: 0,
                    xtype: this.xtype,
                    belongid: this.belongid
                };
                let {data:res} = await this.$http.post(url, defaultOption);
                if (res != null && res.stateCode > 0) {
                    let params = {};
                    if (this.belongid != "")
                        params.belongid = this.belongid;
                    if (this.xtype != "")
                        params.xtype = this.xtype;
                    this.$message.success("发布成功");
                    this.getComment(params);
                    this.cdata = "";
                }

            }

        },

        computed:{
           isLogin(){
               return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
           },
           huiyuan(){
               return this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
           }
        },
        props: {
            belongid: {

                required: true
            },
            withComment: {
                type: Boolean,
                default: true
            },
            xtype: {
                type: String,
                default: "xinxi"
            },
            deleteComment:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            belongid(newVal){
              //this.getComment()
            }
        }

    }
</script>

<style scoped>

</style>
