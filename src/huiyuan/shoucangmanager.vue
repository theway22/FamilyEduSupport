<template>
    <div class="panel-default panel">
        <div class="panel-heading">
           我的收藏夹
        </div>


        <div class="panel-body">


            <!-- 搜索控件开始 -->
            <div class="search-options">


                <table cellspacing="0" width="100%">
                    <tbody>

                    <tr>
                        <td>


                            <input name="targetname" @keyup.enter="search" v-model="targetname" class="input-txt"
                                   type="text"/>


                            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        </td>
                    </tr>
                    </tbody>
                </table>


            </div>
            <!-- 搜索控件结束 -->

            <el-button-group class="action-details">
                <el-button-group>
                    <el-button type="danger" @click="deleteRec" icon="el-icon-delete">删除</el-button>
                </el-button-group>
            </el-button-group>

            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
                <thead>
                <tr>
                    <th>
                        <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                    </th>


                    <th><b>名称</b></th>


                    <th><b>图片</b></th>


                    <th><b>收藏时间</b></th>


                    <th>
                        操作
                    </th>

                </tr>

                </thead>
                <tbody>


                <tr v-for="(shoucang) in  listShoucang" :key="shoucang.id">
                    <td>
                        <input class="check" name="ids" type="checkbox" v-model="shoucang.rowSelected"/>


                    </td>


                    <td>
                        {{shoucang.targetname}}
                    </td>


                    <td>
                        <img width="80" height="80" :src="hostHead+shoucang.tupian"/>
                    </td>


                    <td>
                        {{shoucang.sctime}}
                    </td>


                    <td>

                        <el-button-group>
                            <router-link class="el-button el-button--primary" :to="shoucang.href"><i class="el-icon-info"></i>查看</router-link>
                        </el-button-group>

                    </td>
                </tr>

                <tr v-if="listShoucang.length==0">
                    <td colspan="20">
                        没有相关收藏信息
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
        name: "shoucangmanager",
        data() {
            return {
                "targetname": "",
                hostHead:this.$app.contextPath,
                selectedAll: false,
                listShoucang: [],
                pageindex: 1, //初始页
                pagesize: 10,
                total: 10
            }

        },
        props:{
           accountInfo:{
               type:Object
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
                let url = "admin/shoucang/list";
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    hyid: this.accountInfo.id,
                    "targetname": this.targetname,
                };
                let util = new VueUtil(this);
                console.log("this.pageindex=" + this.pageindex);
                let res = await util.http.post(url, param);
                if (res.data != null) {
                    let pageInfo = res.data.data;
                    this.total = pageInfo.total;
                    this.listShoucang = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/shoucang/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listShoucang.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listShoucang.filter(c => c.rowSelected).map(c => c.id);
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
                if (this.listShoucang != null) {
                    this.listShoucang.forEach(c => {
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
