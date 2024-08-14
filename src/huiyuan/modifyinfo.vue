<template>
    <div class="mypanel">
        <div class="hd">
            编辑账户
        </div>

        <div class="bd">

             <table class="smart-table"  cellspacing="1" border="1" width="100%">

            <tr>
                <td class="tlabel" align="right">用户名:</td>
                <td>{{huiyuan.accountname}}</td>
                <td  rowspan="6" colspan="2">
                    <dw-upload :host-head="hostHead" v-model="huiyuan.touxiang"></dw-upload>
                </td>
            </tr>

            <tr>
                <td class="tlabel" align="right">姓名:</td>
                <td>

                    <input name="name" v-model="huiyuan.name" v-validate="{required:true,messages:{required:'请输入名称'}}"
                           class="input-txt" type="text"  /></td>
            </tr>
            <tr>
                <td class="tlabel" align="right">身份证号:</td>
                <td>

                    <input name="idcardno" v-model="huiyuan.idcardno" v-validate="{required:true,idcardno:true,messages:{required:'请输入身份证号',idcardno:'请输入正确的身份证号'}}"
                           class="input-txt" type="text"  /></td>
            </tr>
            <tr>
                <td class="tlabel" align="right">昵称:</td>
                <td><input name="nickname"
                           v-model="huiyuan.nickname" validate="{required:true,messages:{required:'请输入昵称'}}" class="input-txt"
                           type="text"  /></td>
            </tr>


            <tr>
                <td class="tlabel" align="right">邮箱:</td>
                <td><input name="email"
                           v-model="huiyuan.email" validate="{required:true,email:true,messages:{required:'请输入邮箱',email:'请输入正确的邮箱'}}" class="input-txt"
                           type="text" id="txtEmail" /></td>
            </tr>


            <tr>
                <td class="tlabel" align="right">性别:</td>
                <td>
                    <el-radio-group v-model="huiyuan.sex">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td class="tlabel" align="right">地址:</td>
                <td><input name="address"
                           v-model="huiyuan.address" class="input-txt"
                           type="text"  /></td>

                <td class="tlabel" align="right">移动电话:</td>
                <td><input name="mobile"
                           v-model="huiyuan.mobile" validate="{required:true,mobile:true,messages:{required:'请输入名称'}}" class="input-txt"
                           type="text" /></td>
            </tr>

            <tr>
                <td colspan="4">
                    <el-button @click="submitHandler" type="danger" icon="el-icon-check">提交</el-button>
                </td>
            </tr>



        </table>
        </div>

    </div>

</template>

<script>
    import  {VueUtil} from "../util/vueutil";

    export default {
        name: "modifyinfo",
        data() {
            return {

                actiontype: 'save',
                errors:"",
                hostHead:this.$app.contextPath,
                "huiyuan": {
                    "accountname": "",
                    "address": "",
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
        props:{
            accountInfo:{
               type:Object
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.accountInfo.id;
                if (id !=null) {
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
                this.$router.push("/huiyuan/accountinfo");

            }
        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
