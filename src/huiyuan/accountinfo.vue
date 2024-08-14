<template>

    <div class="mypanel">

        <div class="hd">
            账户信息
        </div>
        <div class="bd">

            <table cellpadding="0" cellspacing="1" border="1" class="smart-table" width="100%">
            <tr>
                <td width="15%" align="right" class="tlabel">账号:</td>
                <td width="35%">{{huiyuan.accountname}}({{huiyuan.nickname}})</td>
                <td width="*" colspan="2" rowspan="6">

                    <img :src="hostHead+huiyuan.touxiang" width="200" height="200"/>

                </td>
            </tr>

            <tr>
                <td align="right" class="tlabel">姓名:</td>
                <td>{{huiyuan.name}}</td>
            </tr>

            <tr>
                <td align="right" class="tlabel">性别:</td>
                <td>{{huiyuan.sex}}</td>
            </tr>

            <tr>
                <td align="right" class="tlabel">注册时间:</td>
                <td>
                    {{huiyuan.regdate}}
                </td>
            </tr>

            <tr>
                <td align="right" class="tlabel">手机:</td>
                <td>{{huiyuan.mobile}}</td>
            </tr>
                <tr>
                <td width="15%" align="right" class="tlabel">邮箱:</td>
                <td width="35%">{{huiyuan.email}}</td>
            </tr>


        </table>
        </div>
    </div>

</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "accountinfo",
        data() {
            return {
                actiontype: 'save',
                hostHead: this.$app.contextPath,
                "huiyuan": {},
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
                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/huiyuan/load";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.huiyuan = res.data;
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
