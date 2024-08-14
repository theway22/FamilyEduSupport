<template>
    <div>
        <el-dialog width="30%"  :close-on-click-modal="false" :visible="show" @update:visible="closeHandler">

            <span slot="title">会员登录</span>

            <el-form ref="form"  label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="accountname" prefix-icon="el-icon-user" ></el-input>
                    </el-form-item>


                    <el-form-item label="密码">
                        <el-input v-model="password" type="password" prefix-icon="el-icon-lock"></el-input>
                    </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="loginHandler">确 定</el-button>
                <el-button @click="cancelHandler">取 消</el-button>
                <el-divider></el-divider>
                <router-link to="/e/register">注册</router-link>

            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "loginmodal",
        data(){
            return{
                accountname: '',
                password: '',
                hostHead:this.$app.contextPath
            }
        },
        methods:{
            cancelHandler(){
                this.$emit("update:show",false);
            },
            async loginHandler(){
                let url="admin/admin/login";
                let {data:res}=await this.$http.post(url,{
                    username:this.accountname,
                    password:this.password,
                    usertype:2
                });
                if(res!=null&&res.stateCode<0) {
                    this.$message.error(res.des);
                    return;
                }
                if(res!=null&&res.stateCode>0){
                    console.log("登录成功");
                    this.$emit("update:show",false);

                    this.$app.mycas.login(this.$app.mycas.huiyuan_key,res.data);
                    this.$emit("afterLogin",true);
                    window.location.reload();

                }
            },
            closeHandler (val) {
                console.log("执行关闭");
                this.$emit("update:show",val);
            }
        },
        props:{
            show:{
                type:Boolean,
                default:false
            }
        },
    }
</script>

<style scoped>

</style>
