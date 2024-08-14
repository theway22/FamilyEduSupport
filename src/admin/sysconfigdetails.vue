<template>
    <div  class="panel panel-default">
        <div class="panel-heading">
            {{sysconfig.name}}
        </div>
        <div class="panel-body">
        <div class="action-details">

            <el-button-group>
                <el-button @click="deleteRec"  type="danger" icon="el-icon-delete"> 删除</el-button>
                <route-button icon="el-icon-plus" :url="`/admin/sysconfigitemadd?cfgid=${sysconfig.id}`">新增</route-button>

            </el-button-group>

        </div>

        <table  width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr >
                <th >
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>
                <th><b>标题</b></th>
                <th><b>类型</b></th>
                <th>
                    操作
                </th>

            </tr>

            </thead>
            <tbody>
            <tr v-for="(sysconfigitem) in  sysconfig.cfgitems" :key="sysconfigitem.id">
                <td>
                    <input  class="check" name="ids" type="checkbox" v-model="sysconfigitem.rowSelected" />
                </td>
                <td>
                    {{sysconfigitem.title}}
                </td>
                <td>
                    <el-tag v-if="sysconfigitem.type==1">内部显示</el-tag>
                    <el-tag v-if="sysconfigitem.type==2">外部显示</el-tag>
                </td>

                <td >
                    <el-button-group>
                        <route-button icon="el-icon-edit" :url="`/admin/sysconfigitemadd?id=${sysconfigitem.id}`">编辑</route-button>
                    </el-button-group>

                </td>
            </tr>

            <tr v-if="sysconfig.cfgitem!=null&&sysconfig.cfgitems.length==0">
                <td colspan="20">
                    没有相关设置项信息
                </td>
            </tr>


            </tbody>
        </table>

        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "sysconfigdetails",
        data() {
            return {

                hostHead: this.$app.contextPath,
                "sysconfig": {},
                selectedAll: false,
            }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/sysconfig/load";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.sysconfig = res.data;
                }
            },//end load

            async deleteRec() {
                let url = "admin/sysconfigitem/delete";
                let util = new VueUtil(this);
                let hasChecked = this.sysconfig.cfgitems.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.sysconfig.cfgitems.filter(c => c.rowSelected).map(c => c.id);
                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post(url, {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            this.load();
                        }
                    });
                }).catch(() => {
                });
            },
            selectedAllHandler() {
                console.log(this.selectedAll);
                if (this.sysconfig.cfgitems != null) {
                    this.sysconfig.cfgitems.forEach(c => {
                        c.rowSelected = !this.selectedAll;
                    });
                }
            }

        },
        created() {
            this.load();
        }

    }
</script>

<style scoped>

</style>
