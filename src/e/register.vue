<template>
    <div class="full-wrapper">
        <div class="center-wrapper">

            <div class="wrapper-title">
                会员注册
            </div>
            <div></div>


            <div v-if="!over" class="wrapper-content">



                <div class="stdrow">
                    <div style="width:120px;" class="tb">账户:</div>
                    <div class="ct">
                        <div class="input-pack">
                            <input  type="text" placeholder="账户名" v-model="huiyuan.accountname" v-validate="{required:true,messages:{required:'请输入账户名'}}" name="accountname" />
                        </div>
                    </div>
                </div>



                <div class="stdrow">
                    <div style="width:120px;" class="tb">密码:</div>
                    <div class="ct">
                        <div class="input-pack">
                            <input  type="password"  placeholder="密码" v-model="huiyuan.password" v-validate="{required:true,messages:{required:'请输入密码'}}" name="password" />
                        </div>
                    </div>
                </div>

                <div class="stdrow">
                    <div style="width:120px;" class="tb">确认密码:</div>
                    <div class="ct">
                        <div class="input-pack">
                            <input  type="password" placeholder="确认密码"  v-model="huiyuan.password2"  v-validate="{required:true,messages:{required:'请再次输入密码'}}" name="password2" />
                        </div>
                    </div>
                </div>

                <div class="stdrow">
                    <div style="width:120px;" class="tb">姓名:</div>
                    <div class="ct">

                        <div class="input-pack">
                            <input  type="text" placeholder="姓名" v-model="huiyuan.name" v-validate="{required:true,messages:{required:'请输入姓名'}}"  name="name" />
                        </div>

                    </div>
                </div>

                <div class="stdrow">
                    <div style="width:120px;" class="tb">邮箱:</div>
                    <div class="ct">


                        <div class="input-pack">
                            <input  type="text" placeholder="邮箱" v-model="huiyuan.email" v-validate="{required:true,email:true,messages:{required:'请输入邮箱',email:'请输入正确邮箱'}}"   name="email" />
                        </div>

                    </div>
                </div>




                <div class="agree-protocol">
                    点击注册，表示您同意 <a href="#">《服务协议》</a>

                </div>
                <button @click="registerHandler" class="register-btn">同意并注册</button>
                <div style="position:relative;"></div>
                <div class="agree-protocol">
                    <router-link to="/admin/login">登录系统</router-link>

                </div>

            </div>

            <div v-else class="result-guide-box">
                <div class="content clearfix">
                    <div class="icon-area">
                        <i class="fa fa-check-circle"></i>
                    </div>
                    <div class="text-area">
                        <strong>注册成功！</strong>
                        <router-link to="/admin/login">登录系统</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "register",
        data() {
            return {

                actiontype: 'save',
                over:false,
                errors: {},
                hostHead: this.$app.contextPath,
                "huiyuan": {
                    "accountname": "",
                    "password": "",
                    "email": "",
                    "sex":"男",
                    "idcardno": "",
                    "nickname": "",
                    "name": "",
                    "touxiang": "/upload/nopic.jpg",
                    "des": ""
                },

            }
        },
        methods: {

            async registerHandler() {

                let defaultOptions = {
                    url: "admin/huiyuan/save",
                    actionTip: "注册成功"
                };

                const  validRes=this.myValidator.valid(this,{isShowErrors:true});
                console.log("valRes",validRes);
                if (!validRes)
                    return ;
                let util = new VueUtil(this);
                let params = {...this.huiyuan};
                let {data: res} = await util.http.post(defaultOptions.url, params);
                if (res.stateCode <= 0) {
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                util.message({
                    message: defaultOptions.actionTip,
                    type: 'success',
                    duration: 2000
                });
                this.over=true;
            }
        },
        created() {
            console.log("注册创建");
        }

    }
</script>

<style >
    @import "./css/register.css";

</style>
