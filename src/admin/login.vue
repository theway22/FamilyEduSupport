<template>

    <div   class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">家庭教育救助网站</h3>
            <el-form-item prop="username">
                <el-input prefix-icon="fa fa-user"
                          v-model="loginForm.username"
                          type="text"
                          auto-complete="off"
                          placeholder="账号">

                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input prefix-icon="fa fa-lock"
                          v-model="loginForm.password"
                          type="password"
                          auto-complete="off"
                          placeholder="密码"
                          @keyup.enter.native="handleLogin">

                </el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="password">
                <el-radio-group v-model="loginForm.usertype">
                    <el-radio-button label="2">普通用户</el-radio-button>

                    <el-radio-button label="1">管理员</el-radio-button>

                </el-radio-group>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input
                    v-model="loginForm.code"
                    type="text"
                    style="width:140px"
                    auto-complete="off"
                    placeholder="验证码"
                    @keyup.enter.native="handleLogin">

                </el-input>
                <div class="login-code">
                    <span style="width: 80px;border: 1px solid #ddd8ce;padding:8px 12px;cursor: pointer; " @click="getCode"> {{code}}</span>
                </div>
            </el-form-item>


            <el-form-item style="width:100%;">
                <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleLogin"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>

            </el-form-item>
            <el-form-item>
                <div style="width:100%;text-align: center">
                    <router-link to="/e/index">首页</router-link>
                </div>

            </el-form-item>


        </el-form>



        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright 2023 Zyd All Rights Reserved.</span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loginForm: {
                    username: "",
                    password: "",
                    usertype:2,
                    code:"",
                    rememberMe: false
                },
                code:"",
                loading: false,
                loginRules: {
                    username: [
                        { required: true, trigger: "blur", message: "请输入您的账号" }
                    ],
                    password: [
                        { required: true, trigger: "blur", message: "请输入您的密码" }
                    ],
                    code: [{ required: true, trigger: "change", message: "请输入验证码" }]

                },
            };
        },
        watch: {

        },
        created() {
            this.getCode();
        },
        methods: {
            handleLogin() {
                this.$refs.loginForm.validate(async valid => {
                    if (valid) {
                        console.log("loginForm.code=",this.loginForm.code);
                        if(this.code.toLowerCase()!=this.loginForm.code.toLowerCase()){
                            this.$message.error("验证码不正确");
                            return;
                        }
                        this.loading = true;
                        let url = "admin/admin/login";
                        let {data:res}=await this.$http.post(url,{
                            username:this.loginForm.username,
                            password:this.loginForm.password,
                            usertype:this.loginForm.usertype
                        });
                        console.log("res=",res);
                        if(res.stateCode<0){
                            this.$message.error(res.des);
                            this.loading=false;
                            return;
                        }
                        if(this.loginForm.usertype==1) {

                            this.$app.mycas.login(this.$app.mycas.users_key, res.data);
                            window.sessionStorage.removeItem(this.$app.mycas.huiyuan_key);
                            this.$router.push("/admin/index");
                        }
                        if(this.loginForm.usertype==2){
                            this.$app.mycas.login(this.$app.mycas.huiyuan_key, res.data);
                            window.sessionStorage.removeItem(this.$app.mycas.users_key);

                            this.$router.push("/huiyuan/index");
                        }



                    }
                });
            },
            getCode() {

                let arrays = new Array(
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                    'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                    'U', 'V', 'W', 'X', 'Y', 'Z'
                );
                let codes = '';// 重新初始化验证码
                for (var i = 0; i < 4; i++) {
                    // 随机获取一个数组的下标
                    var r = parseInt(Math.random() * arrays.length);
                    codes += arrays[r];
                }
                this.code=codes;
                return codes;

            },
        }
    }
</script>
<style scoped>
     @import "css/login.css";
     .login{
         height: 100%;
         width: 100%;
         background-color: #00a0e9;

     }
</style>
