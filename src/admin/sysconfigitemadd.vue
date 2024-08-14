<template>
    <div class="mypanel">
        <div class="hd">

                新建设置项

        </div>

       <div class="bd">
           <table class="smart-table" border="1" cellspacing="1" width="100%">


            <tr>
                <td width="10%" class="tlabel" align="right">标题:</td>
                <td width="*">
                    <input name="title" v-model="sysconfigitem.title" placeholder="标题"
                           v-validate="{required:true,messages:{required:'请输入标题'}}" class="input-txt" type="text"/>
                </td>
            </tr>



            <tr  v-if="sysconfigitem.type==2">
                <td class="tlabel"  align="right">链接:</td>
                <td width="*">
                    <input name="href" v-model="sysconfigitem.href" placeholder="链接"
                           v-validate="{required:true,messages:{required:'请输入链接'}}" class="input-txt" type="text"/>
                </td>
            </tr>


            <tr v-if="sysconfigitem.type==1">
                <td class="tlabel" align="right">内容:</td>
                <td colspan="3">
                    <quill-editor v-model="sysconfigitem.dcontent" :options="{placeholder: '内容'}"></quill-editor>
                </td>
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
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "sysconfigitemadd",
        data() {
            return {

                actiontype: 'save',
                hostHead: this.$app.contextPath,
                errors: {},
                sysconfigitem: {
                    "title": "",
                    "dcontent": "",
                    "type":1,
                    "href":"",
                    "cfgid": "",
                }
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                let cfgid=this.$route.query.cfgid;
                if (cfgid!=null)
                    this.sysconfigitem.cfgid=cfgid;
                if (id != null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑设置项";
                    let url = "admin/sysconfigitem/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.sysconfigitem = res.data;
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/sysconfigitem/save",
                    actionTip: "设置项新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/sysconfigitem/update";
                    defaultOptions.actionTip = "设置项更新成功";
                }
                const  validRes=this.myValidator.valid(this);
                if (!validRes)
                    return ;
                let util = new VueUtil(this);
                let params = {...this.sysconfigitem};
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
                this.$router.push("/admin/sysconfigdetails?id="+this.sysconfigitem.cfgid);

            }
        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
