<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            预约审核
        </div>
        <div class="panel-body">

            <table cellpadding="0" cellspacing="1" border="1" class="smart-table" width="100%">


                <tr>
                    <td class="tlabel" width="10%" align="right">标题:</td>
                    <td width="*">

                        {{yuyue.title}}

                    </td>
                </tr>


                <tr>
                    <td class="tlabel" align="right">预约日期:</td>
                    <td>
                        {{yuyue.yydate}}
                    </td>
                </tr>


                <tr>
                    <td class="tlabel" align="right">电话:</td>
                    <td>

                        {{yuyue.mobile}}

                    </td>
                </tr>


                <tr>
                    <td align="right">预约人:</td>
                    <td>


                        {{yuyue.hyname}}({{yuyue.hyaccount}})

                    </td>
                </tr>


                <tr>
                    <td align="right">预约教育导师:</td>
                    <td>

                        {{yuyue.tname}}

                    </td>
                </tr>


                <tr>
                    <td align="right">说明:</td>
                    <td>
                        <div v-html="yuyue.dcontent"></div>

                    </td>
                </tr>


                <tr>
                    <td align="right">审核结果:</td>
                    <td>

                        <el-radio-group v-model="state">
                            <el-radio-button label="2">审批通过</el-radio-button>
                            <el-radio-button label="3">暂时不能处理</el-radio-button>

                        </el-radio-group>


                    </td>
                </tr>


                <tr>
                    <td align="right">处理说明:</td>
                    <td colspan="3">
                        <textarea name="reply" v-model="replydes" style="width:48%;height:80px;"></textarea>
                    </td>
                </tr>

                <tr>
                    <td colspan="4">
                        <el-button @click="submitCheck" type="danger"><i class="fa fa-plus"></i>提交审批
                        </el-button>
                    </td>
                </tr>


            </table>
        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yuyuespnext",
        data() {
            return {
                "state": "2",
                replydes: "",
                hostHead: this.$app.contextPath,
                "yuyue": {},
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/yuyue/load";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.yuyue = res.data;
                }
            },//end load
            async submitCheck() {

                let util = new VueUtil(this);

                let id = this.$route.query.id;
                let url = "admin/yuyue/shenpi";
                let {data: res} = await util.http.post(url, {
                    id: id,
                    "state": this.state,
                    replydes: this.replydes
                });
                console.log("res", res);
                if (res != null && res.stateCode < 0) {
                    util.message({
                        message: defaultOptions.actionTip,
                        type: 'error',
                        duration: 2000
                    });
                    return;
                }

                this.$router.push("/admin/yuyuemanager");

            }

        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
