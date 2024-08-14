<template>
    <div class="mypanel">

        <div class="hd">
           系统设置管理
        </div>

        <div class="bd">


        <!-- 搜索控件开始 -->
        <div class="search-options">


            <table cellspacing="0" width="100%">
                <tbody>

                <tr>
                    <td>


                        名称: <input name="name" @keyup.enter="search" v-model="name" class="input-txt" type="text"/>


                        <el-button type="primary" icon="el-icon-search" @click="search">
                            搜索
                        </el-button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>

        <div class="action-details">
            <el-button-group>
                <el-button @click="deleteRec"  type="danger" icon="el-icon-delete"> 删除</el-button>
                <route-button url="/admin/sysconfigadd" icon="el-icon-plus">新增介绍</route-button>

            </el-button-group>
        </div>

        <table  width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr>
                <th>
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>


                <th><b>名称</b></th>


                <th>
                    操作
                </th>

            </tr>

            </thead>
            <tbody>


            <tr v-for="(sysconfig) in  listSysconfig" :key="sysconfig.id">
                <td>
                    <input class="check" name="ids" type="checkbox" v-model="sysconfig.rowSelected"/>


                </td>


                <td>
                    <el-tag><router-link :to="'/admin/sysconfigadd?id='+sysconfig.id">{{sysconfig.name}}</router-link></el-tag>
                </td>


                <td>
                    <el-button-group>
                        <route-button :url="`/admin/sysconfigdetails?id=${sysconfig.id}`">编辑</route-button>
                    </el-button-group>

                </td>
            </tr>

            <tr v-if="listSysconfig.length==0">
                <td colspan="20">
                    没有相关系统设置信息
                </td>
            </tr>


            </tbody>
        </table>
        <el-pagination
            @size-change="pagesizeChange"
            @current-change="pageindexChange"
            :current-page="pageindex"
            :page-sizes="[pagesize]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "sysconfigmanager",
        data() {
            return {
                "name": "",
                hostHead:this.$app.contextPath,
                selectedAll: false,
                listSysconfig: [],
                pageindex: 1, //初始页
                pagesize: 10,
                total: 10
            }

        },
        methods: {
            pagesizeChange: function (pagesize) {
                this.pagesize = pagesize;
            },
            pageindexChange: function (pageindex) {
                this.pageindex = pageindex;
                console.log(this.pageindex);
                this.search();
            },
            async search() {
                let url = "admin/sysconfig/list";
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    "name": this.name,
                };
                let util = new VueUtil(this);
                console.log("this.pageindex=" + this.pageindex);
                let res = await util.http.post(url, param);
                if (res.data != null) {
                    let pageInfo = res.data.data;
                    this.total = pageInfo.total;
                    this.listSysconfig = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/sysconfig/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listSysconfig.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listSysconfig.filter(c => c.rowSelected).map(c => c.id);
                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post(url, {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            this.search();
                        }
                    });
                }).catch(() => {
                });
            },
            selectedAllHandler() {
                console.log(this.selectedAll);
                if (this.listSysconfig != null) {
                    this.listSysconfig.forEach(c => {
                        c.rowSelected = !this.selectedAll;
                    });
                }
            }
        },
        created() {
            this.search();
        }
    }
</script>

<style scoped>

</style>
