<template>
    <div class="mypanel">
        <div class="hd">
            新建站点导航
        </div>

       <div class="bd">
          <table class="smart-table" border="1" cellspacing="1" width="100%">





            <tr>
                <td class="tlabel" align="right">名称:</td>
                <td>
                    <input name="title" v-model="sitenav.title" placeholder="名称"
                           v-validate="{required:true,messages:{required:'请输入名称'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td class="tlabel" align="right">链接:</td>
                <td>
                    <input name="href" v-model="sitenav.href" placeholder="链接"
                           validate="{required:true,messages:{required:'请输入链接'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td class="tlabel" align="right">权重:</td>
                <td>
                    <el-input-number v-model="sitenav.sindex" :min="1" :max="100"></el-input-number>

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
        name: "sitenavadd",
        data() {
            return {
                actiontype: 'save',
                hostHead: '${pageContext.request.contextPath}',
                errors: {},
                "sitenav": {
                    "title": "",
                    "href": "",
                    "sindex":1,
                },
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id != null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑站点导航";
                    let url = "admin/sitenav/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.sitenav = res.data;
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/sitenav/save",
                    actionTip: "站点导航新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/sitenav/update";
                    defaultOptions.actionTip = "站点导航更新成功";
                }
                const  validRes=this.myValidator.valid(this);
                if (!validRes)
                    return ;
                let util = new VueUtil(this);
                let params = {...this.sitenav};
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
                this.$router.push("/admin/sitenavmanager");

            }
        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
