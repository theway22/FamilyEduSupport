<template>
    <div class="panel panel-default">
        <div class="panel-heading">

                <div v-if="actiontype=='save'">新建教育服务</div>
                <div v-if="actiontype=='update'">编辑教育服务</div>


        </div>

       <div class="panel-body">
        <table class="smart-table" border="1" cellspacing="1" width="100%">


            <tr>
                <td width="10%" align="right">教育服务名:</td>
                <td width="*">
                    <input name="name" v-model="shangpin.name" placeholder="教育服务名"
                           v-validate="{required:true,messages:{required:'请输入教育服务名'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td width="10%" align="right">价格:(元)</td>
                <td width="*">
                    <input name="jiage" v-model="shangpin.jiage" placeholder="价格"
                           v-validate="{required:true,number:true,messages:{required:'请输入价格',number:'请输入正确的价格'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td align="right">图片:</td>
                <td>

                    <dw-upload :mutiple="true" :host-head="hostHead" v-model="shangpin.tupian"></dw-upload>
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">单位:</td>
                <td width="*">
                    <input name="danwei" v-model="shangpin.danwei" placeholder="单位"
                           v-validate="{required:true,messages:{required:'请输入单位'}}" class="input-txt" type="text"/>

                </td>
            </tr>

            <tr>
                <td width="10%" align="right">课时:</td>
                <td width="*">
                    <input name="chandi" v-model="shangpin.chandi" placeholder="课时"
                           v-validate="{required:true,messages:{required:'请输入课时'}}" class="input-txt" type="text"/>

                </td>
            </tr>
            <tr>
                <td width="10%" align="right">所属类别:</td>
                <td width="*">
                    <el-cascader
                        v-model="lmvalue"
                        :options="cascadeData"
                        :props="{ expandTrigger: 'hover' }"></el-cascader>
                </td>
            </tr>


            <tr>
                <td align="right">介绍:</td>
                <td colspan="3">
                    <quill-editor v-model="shangpin.jieshao" :options="{placeholder: '介绍'}"></quill-editor>
                </td>
            </tr>


            <tr>
                <td colspan="4">

                    <el-button @click="submitHandler" type="primary"><i class="el-icon-check"></i>提交</el-button>

                </td>
            </tr>


        </table>
       </div>

    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "shangpinadd",
        data() {
            return {

                actiontype: 'save',
                hostHead: this.$app.contextPath,
                errors: {},
                lmvalue:[],
                listStag:[],
                cascadeData: [],
                "shangpin": {
                    "name": "",
                    "jiage": "",
                    "tupian": "/upload/nopic.jpg",
                    "pubren":this.accountInfo.id,
                    "kucun": "",
                    "danwei": "",
                    "subtitle": "",
                    "typeid": "",
                    "subtypeid": "",
                    "changdi": "",
                    "tuijian": "1",
                    "jieshao": ""
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
                let id = this.$route.query.id;
                if (id !=null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑教育服务";
                    let url = "admin/shangpin/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null) {
                        this.shangpin = res.data;
                        this.lmvalue=[];
                        this.lmvalue.push(this.shangpin.typeid,this.shangpin.subtypeid);
                        console.log("lmvalue=",this.lmvalue)
                    }
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/shangpin/save",
                    actionTip: "教育服务新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/shangpin/update";
                    defaultOptions.actionTip = "教育服务更新成功";
                }
                const validRes = this.myValidator.valid(this);
                console.log("valRes", validRes);
                if (!validRes)
                    return;
                this.shangpin.typeid=this.lmvalue[0];
                this.shangpin.subtypeid=this.lmvalue[1];
                let util = new VueUtil(this);
                let params = {...this.shangpin};
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
                this.$router.push("/admin/shangpinmanager");

            },
            async getLanmus(){
                let url = "admin/shangpin/cascadelanmu";
                let {data:res}=await this.$http.post(url);
                if (res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.cascadeData=res.data;

                if (this.cascadeData!=null&&this.cascadeData.length>0){
                    this.lmvalue.push(this.cascadeData[0].value)
                    if (this.cascadeData[0].children!=null&&this.cascadeData[0].children.length>0){
                        this.lmvalue.push(this.cascadeData[0].children[0].value);
                    }

                }
            },
            async getTags(){
                let url = "admin/stag/list";
                let {data:res}=await this.$http.post(url,{ispaged:"-1"});
                if (res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.listStag=res.data;
                if (this.listStag&&this.listStag.length>0)
                    this.xinxi.tagid=this.listStag[0].id;

            }
        },
        async created() {
           await this.getLanmus();
           await this.load();

        }
    }
</script>

<style scoped>

</style>
