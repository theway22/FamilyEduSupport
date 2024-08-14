<template>
    <div class="panel panel-default">
        <div class="panel-heading">预约信息</div>
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
                <td class="tlabel" align="right">状态:</td>
                <td>
                    <span v-if="yuyue.state==1">等待审核</span>
                    <span v-if="yuyue.state==2">审核通过</span>
                    <span v-if="yuyue.state==3">暂时无时间安排</span>
                </td>
            </tr>


            <tr>
                <td class="tlabel" align="right">预约人:</td>
                <td>
                    {{yuyue.hyname}}
                </td>
            </tr>


            <tr>
                <td class="tlabel" align="right">导游:</td>
                <td>
                    {{yuyue.tname}}({{yuyue.taccount}})
                </td>
            </tr>


        </table>
        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yuyuedetail",
        data() {
            return {
                actiontype: 'save',
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

        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
