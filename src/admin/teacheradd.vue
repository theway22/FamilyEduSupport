<template>

    <div class="panel panel-default">
        <div class="panel-heading">

            <div v-if="actiontype=='save'">新建教育指导师</div>
            <div v-if="actiontype=='update'">编辑教育指导师</div>

        </div>
        <div class="panel-body">

            <div class="alert alert-warning">
                <i class="el-icon-warning"></i>账户默认密码为123456
            </div>

            <table class="smart-table" border="1" cellspacing="1" width="100%">


                <tr>
                    <td width="10%" align="right">工号:</td>
                    <td width="*">
                        <input name="tno" v-model="teacher.tno" placeholder="工号"
                               v-validate="{required:true,messages:{required:'请输入工号'}}" class="input-txt" type="text"/>


                    </td>
                    <td colspan="2" rowspan="6">

                        <dw-upload :host-head="hostHead" v-model="teacher.photo"></dw-upload>
                    </td>
                </tr>

                <tr>
                    <td width="10%" align="right">姓名:</td>
                    <td width="*">
                        <input name="name" v-model="teacher.name" placeholder="姓名"
                               v-validate="{required:true,messages:{required:'请输入姓名'}}" class="input-txt" type="text"/>


                    </td>
                </tr>



                <tr>
                    <td width="10%" align="right">性别:</td>
                    <td width="*">


                        <el-radio-group v-model="teacher.sex">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                        </el-radio-group>


                    </td>
                </tr>


                <tr>
                    <td width="10%" align="right">籍贯:</td>
                    <td width="*">
                        <input name="jiguan" v-model="teacher.jiguan" placeholder="籍贯"
                               v-validate="{required:true,messages:{required:'请输入籍贯'}}" class="input-txt" type="text"/>


                    </td>
                </tr>


                <tr>
                    <td width="10%" align="right">学历:</td>
                    <td width="*">

                        <el-select v-model="teacher.xueli">
                            <el-option  value="博士"></el-option>
                            <el-option  value="硕士"></el-option>
                            <el-option  value="本科"></el-option>
                            <el-option  value="大专"></el-option>
                        </el-select>


                    </td>
                </tr>




                <tr>
                    <td width="10%" align="right">民族:</td>
                    <td width="*">
                        <input name="nation" v-model="teacher.nation" placeholder="民族"
                               v-validate="{required:true,messages:{required:'请输入民族'}}" class="input-txt" type="text"/>


                    </td>
                </tr>





                <tr>
                    <td width="10%" align="right">邮箱:</td>
                    <td width="*">
                        <input name="email" v-model="teacher.email" placeholder="邮箱"
                               v-validate="{required:true,messages:{required:'请输入邮箱'}}" class="input-txt" type="text"/>


                    </td>

                    <td width="10%" align="right">电话:</td>
                    <td width="*">
                        <input name="tel" v-model="teacher.tel" placeholder="电话"
                               v-validate="{required:true,messages:{required:'请输入电话'}}" class="input-txt" type="text"/>


                    </td>
                </tr>


                <tr>
                    <td width="10%" align="right">职称:</td>
                    <td width="*">
                        <input name="zhicheng" v-model="teacher.zhicheng" placeholder="职称"
                               v-validate="{required:true,messages:{required:'请输入职称'}}" class="input-txt" type="text"/>


                    </td>

                    <td width="10%" align="right">特长:</td>
                    <td width="*">
                        <input name="major" v-model="teacher.major" placeholder="特长"
                               v-validate="{required:true,messages:{required:'请输入特长'}}" class="input-txt" type="text"/>


                    </td>
                </tr>


                <tr>
                    <td align="right">介绍:</td>
                    <td colspan="3">
                        <quill-editor v-model="teacher.jieshao" :options="{placeholder: '介绍'}"></quill-editor>
                    </td>
                </tr>


                <tr>
                    <td colspan="4">

                        <el-button type="primary" icon="el-icon-check" @click="submitHandler">提交</el-button>

                    </td>
                </tr>


            </table>

        </div>

    </div>

</template>

<script type="text/javascript">

    import {VueUtil} from "../util/vueutil";


    export default {
        name: "teacheradd",
        data() {
            return {
                actiontype: 'save',
                hostHead: this.$app.contextPath,
                fileList: [],
                errors: {},
                "teacher": {
                    "tno": "",
                    "password": "123456",
                    "sex": "男",
                    "jiguan": "",
                    "xueli": "硕士",
                    "photo": "/upload/nopic.jpg",
                    "nation": "",
                    "name": "",
                    "email": "",
                    "tel": "",
                    "zhicheng": "",
                    "major": "",
                    "jieshao": "",
                },
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id != null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑教育指导师";
                    let url = "admin/teacher/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null) {
                        this.teacher = res.data;
                    }
                }
            },//end load
            async submitHandler() {
                let defaultOptions = {
                    url: "admin/teacher/save",
                    actionTip: "教育指导师新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/teacher/update";
                    defaultOptions.actionTip = "教育指导师更新成功";
                }
                const validRes = this.myValidator.valid(this);
                console.log("valRes", validRes);
                if (!validRes)
                    return;
                let util = new VueUtil(this);
                let params = {...this.teacher};
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
                this.$router.push("/admin/teachermanager");
            },


        },
        created() {
            this.load();
        }

    }

</script>
