<template>
    <div >

        <table cellpadding="0" cellspacing="1" border="1" class="smart-table" width="100%">


            <tr>
                <td width="10%" align="right">工号:</td>
                <td width="*">
                    {{teacher.tno}}
                </td>
                <td colspan="2" rowspan="6" width="*">
                    <img :src="hostHead+teacher.photo" width="200" height="200"/>
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">姓名:</td>
                <td width="*">
                    {{teacher.name}}
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">性别:</td>
                <td width="*">
                    {{teacher.sex}}
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">籍贯:</td>
                <td width="*">
                    {{teacher.jiguan}}
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">学历:</td>
                <td width="*">
                    {{teacher.xueli}}
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">民族:</td>
                <td width="*">
                    {{teacher.nation}}
                </td>
            </tr>




            <tr>
                <td width="10%" align="right">邮箱:</td>
                <td width="*">
                    {{teacher.email}}
                </td>

                <td width="10%" align="right">电话:</td>
                <td width="*">
                    {{teacher.tel}}
                </td>
            </tr>


            <tr>
                <td width="10%" align="right">职称:</td>
                <td width="*">
                    {{teacher.zhicheng}}
                </td>

                <td width="10%" align="right">特长:</td>
                <td width="*">
                    {{teacher.major}}
                </td>
            </tr>


            <tr>
                <td align="right">介绍:</td>
                <td colspan="3">
                    <div v-html="teacher.jieshao"></div>
                </td>
            </tr>


        </table>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "teacherdetails",
        data() {
            return {
                actiontype: 'save',
                hostHead: this.$app.contextPath,
                "teacher": {},
            }
        },
        props:{
            params:{
                type:Object
            },
            accountInfo:{
                type:Object
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.params.id;
                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/teacher/load";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.teacher = res.data;
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
