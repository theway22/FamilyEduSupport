<template>
    <div class="mypanel">
        <div class="hd">
           新建页面设置
        </div>

         <div class="bd">
              <table class="smart-table" border="1" cellspacing="1" width="100%">


            <tr>
                <td class="tlabel" width="10%" align="right">名称:</td>
                <td width="*">
                    <input name="name" v-model="pagesetting.name" placeholder="名称"
                           v-validate="{required:true,messages:{required:'请输入名称'}}" class="input-txt" type="text"/>
                </td>
            </tr>


            <tr>
                <td colspan="4">

                    <el-button @click="submitHandler" type="danger"><i class="el-icon-check"></i>提交</el-button>

                </td>
            </tr>


        </table>

         </div>
    </div>

</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "pagesettingadd",
        data() {
            return {

                actiontype: 'save',
                hostHead: this.$app.contextPath,
                errors: {},
                "pagesetting": {
                    "name": "",
                },
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id !=null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑页面设置";
                    let url = "admin/pagesetting/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.pagesetting = res.data;
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/pagesetting/save",
                    actionTip: "页面设置新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/pagesetting/update";
                    defaultOptions.actionTip = "页面设置更新成功";
                }
                const  validRes=this.myValidator.valid(this);
                if (!validRes)
                    return ;
                let util = new VueUtil(this);
                let params = {...this.pagesetting};
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
                this.$router.push("/admin/pagesettingmanager");

            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped>

</style>
