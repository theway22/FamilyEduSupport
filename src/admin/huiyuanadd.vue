<template>
    <div class="mypanel">
        <div class="hd">

                <div v-if="actiontype=='save'">新建会员</div>
                <div v-if="actiontype=='update'">编辑会员</div>


        </div>
        <div class="bd">


            <table class="smart-table" border="1" cellspacing="1" width="100%">





            <tr>
                <td width="10%" align="right">账号:</td>
                <td width="*">

                    <input v-if="actiontype=='save'"  name="accountname" v-model="huiyuan.accountname" placeholder="账号"
                           v-validate="{required:true,messages:{required:'请输入账号'}}" class="input-txt" type="text"/>

                    <div v-if="actiontype=='update'">{{huiyuan.accountname}}</div>

                </td>

                <td colspan="2" rowspan="6">

                    <dw-upload :host-head="hostHead" v-model="huiyuan.touxiang"></dw-upload>
                </td>
            </tr>


            <tr>
                <td align="right">密码:</td>
                <td>
                    <input name="password" v-model="huiyuan.password" placeholder="密码"
                           v-validate="{required:true,messages:{required:'请输入密码'}}" class="input-txt" type="password"/>

                </td>
            </tr>


            <tr>
                <td align="right">邮箱:</td>
                <td>
                    <input name="email" v-model="huiyuan.email" placeholder="邮箱"
                           v-validate="{required:true,email:true,messages:{required:'请输入邮箱',email:'请输入正确邮箱'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td align="right">身份证号:</td>
                <td>
                    <input name="idcardno" v-model="huiyuan.idcardno" placeholder="身份证号"
                           v-validate="{required:true,messages:{required:'请输入身份证号'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td align="right">昵称:</td>
                <td>
                    <input name="nickname" v-model="huiyuan.nickname" placeholder="昵称"
                           v-validate="{required:true,messages:{required:'请输入昵称'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td align="right">姓名:</td>
                <td>
                    <input name="name" v-model="huiyuan.name" placeholder="姓名"
                           v-validate="{required:true,messages:{required:'请输入姓名'}}" class="input-txt" type="text"/>

                </td>
            </tr>




            <tr>
                <td align="right">性别:</td>
                <td>
                    <el-radio-group v-model="huiyuan.sex">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>

                </td>
            </tr>




            <tr>
                <td align="right">说明:</td>
                <td colspan="3">
                    <quill-editor v-model="huiyuan.des" :options="{placeholder: '说明'}"></quill-editor>
                </td>
            </tr>


            <tr>
                <td colspan="4">

                    <button @click="submitHandler" class="my-btn my-btn-primary"><i class="el-icon-check"></i>提交</button>

                </td>
            </tr>


        </table>

        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "huiyuanadd",
        data() {
            return {

                actiontype: 'save',
                errors:"",
                hostHead: this.$app.contextPath,
                "huiyuan": {
                    "accountname": "",
                    "password": "",
                    "email": "",
                    "idcardno": "",
                    "nickname": "",
                    "name": "",
                    "sex": "男",
                    "touxiang": "/upload/nopic.jpg",
                    "des": ""
                },
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id != null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑会员";
                    let url = "admin/huiyuan/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.huiyuan = res.data;
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/huiyuan/save",
                    actionTip: "会员新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/huiyuan/update";
                    defaultOptions.actionTip = "会员更新成功";
                }
                const  validRes=this.myValidator.valid(this);
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
                this.$router.push("/admin/huiyuanmanager");

            }
        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
