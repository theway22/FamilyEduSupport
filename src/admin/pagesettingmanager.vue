<template>
    <div class="mypanel">

        <div class="hd">
            页面设置管理

        </div>

        <div class="bd">
        <!-- 搜索控件开始 -->
        <div class="search-options">


            <table cellspacing="0" width="100%">
                <tbody>

                <tr>
                    <td>


                       名称: <input name="name" @keyup.enter="search" v-model="name" class="input-txt" type="text"/>


                        <el-button type="primary" @click="search">
                            <i class="el-icon-search"></i>搜索
                        </el-button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
        <!-- 搜索控件结束 -->

        <div class="clear">
        </div>


        <div class="action-details">
            <el-button-group>
                <!--{{export-view}}-->
                <el-button  @click="deleteRec" type="danger" ><i class="el-icon-delete"></i>删除</el-button>
            </el-button-group>

        </div>

        <table id="pagesetting" width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
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


            <tr v-for="(pagesetting) in  listPagesetting" :key="pagesetting.id">
                <td>
                    <input class="check" name="ids" type="checkbox" v-model="pagesetting.rowSelected"/>


                </td>


                <td>
                    {{pagesetting.name}}
                </td>


                <td>
                    <el-button-group>
                        <route-button icon="el-icon-edit" :url="`/admin/pagesettingadd?id=${pagesetting.id}`">编辑</route-button>
                        <route-button icon="el-icon-setting" type="danger" :url="`/admin/psitemmanager?pageid=${pagesetting.id}`">设置</route-button>

                    </el-button-group>

                </td>
            </tr>

            <tr v-if="listPagesetting.length==0">
                <td colspan="20">
                    没有相关页面设置信息
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
        <div class="clear"></div>
    </div>
    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "pagesettingmanager",
        data() {
            return {
                "name": "",
                hostHead: this.$app.contextPath,
                selectedAll: false,
                listPagesetting: [],
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
                let url = "admin/pagesetting/list";
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
                    this.listPagesetting = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/pagesetting/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listPagesetting.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listPagesetting.filter(c => c.rowSelected).map(c => c.id);
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
                if (this.listPagesetting != null) {
                    this.listPagesetting.forEach(c => {
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
