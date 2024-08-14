<template>
    <div class="mypanel">

        <div class="hd">
             站点导航管理
        </div>

        <div class="bd">
        <!-- 搜索控件开始 -->
        <div class="search-options">


            <table cellspacing="0" width="100%">
                <tbody>

                <tr>
                    <td>


                        标题：  <input name="title" @keyup.enter="search" v-model="title" class="input-txt" type="text"/>


                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
        <!-- 搜索控件结束 -->

        <div class="action-details">
            <el-button-group>

                <el-button @click="deleteRec"  type="danger" icon="el-icon-delete"> 删除</el-button>
                <route-button url="/admin/sitenavadd" type="primary" icon="el-icon-plus">新增导航</route-button>

            </el-button-group>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr>
                <th>
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>


                <th><b>名称</b></th>


                <th><b>链接</b></th>


                <th><b>权重</b></th>


                <th>
                    操作
                </th>

            </tr>

            </thead>
            <tbody>


            <tr v-for="(sitenav) in  listSitenav" :key="sitenav.id">
                <td>
                    <input class="check" name="ids" type="checkbox" v-model="sitenav.rowSelected"/>


                </td>


                <td>
                    {{sitenav.title}}
                </td>


                <td>
                    {{sitenav.href}}
                </td>


                <td>
                    {{sitenav.sindex}}
                </td>


                <td>
                    <el-button-group>
                        <route-button :url="`/admin/sitenavadd?id=${sitenav.id}`" icon="el-icon-edit">编辑</route-button>
                    </el-button-group>

                </td>
            </tr>

            <tr v-if="listSitenav.length==0">
                <td colspan="20">
                    没有相关站点导航信息
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
    import  {VueUtil} from "../util/vueutil";

    export default {
        name: "sitenavmanager",
        data() {
            return {
                "title": "",
                hostHead: this.$app.contextPath,
                selectedAll: false,
                listSitenav: [],
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
                let url = "admin/sitenav/list";
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    "title": this.title,
                };
                let util = new VueUtil(this);
                console.log("this.pageindex=" + this.pageindex);
                let res = await util.http.post(url, param);
                if (res.data != null) {
                    let pageInfo = res.data.data;
                    this.total = pageInfo.total;
                    this.listSitenav = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/sitenav/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listSitenav.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listSitenav.filter(c => c.rowSelected).map(c => c.id);
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
                if (this.listSitenav != null) {
                    this.listSitenav.forEach(c => {
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
