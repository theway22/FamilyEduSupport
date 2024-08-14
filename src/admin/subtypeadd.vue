<template>
    <div class="mypanel">
        <div class="hd">

           新建子栏目

        </div>

        <div class="bd">

           <table class="smart-table" border="1" cellspacing="1" width="100%">



            <tr>
                <td class="tlabel" width="20%" align="right">栏目:</td>
                <td width="*">
                    {{lanmu.name}}
                </td>
            </tr>
            <tr>
                <td  class="tlabel" align="right">名称:</td>
                <td width="*">
                    <input name="name" @keyup.enter="submitHandler" v-model="subtype.name" placeholder="名称"
                           v-validate="{required:true,messages:{required:'请输入名称'}}" class="input-txt" type="text"/>

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
    import  {VueUtil} from "../util/vueutil";

    export default {
        name: "subtypeadd",
        data() {
            return {
                actiontype: 'save',
                hostHead:this.$app.contextPath,
                errors: {},
                lanmu:{},
                "subtype": {
                    "name": ""
                },
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id != null) {
                    this.actiontype="update";
                    this.pageTitle="编辑子板块";
                    let url = "admin/subtype/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.subtype = res.data;
                }
            },//end load
            async loadLanmu(){
                let id=this.$route.query.parentid;
                console.log("parentid",id);
                if (id != null) {
                    let url = "admin/lanmu/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.lanmu = res.data;
                }
            },
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/subtype/save",
                    actionTip: "子板块新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/subtype/update";
                    defaultOptions.actionTip = "子板块更新成功";
                }

                const  validRes=this.myValidator.valid(this);
                if (!validRes)
                    return ;
                let util = new VueUtil(this);
                let params = {...this.subtype,parentid:this.lanmu.id};
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
                this.$router.push( "/admin/lanmumanager");
            }
        },
        async created() {
            await this.loadLanmu();
            await this.load();

        }

    }
</script>

<style scoped>

</style>
