<template>

        <div >

            <div class="panel panel-default">
                <div class="panel-heading">我的预约教育导师</div>
                <div class="panel-body">

                    <!-- 搜索控件开始 -->
                    <div class="search-options">


                        <table cellspacing="0" width="100%">
                            <tbody>

                            <tr>
                                <td>


                                    标题:<input name="title" @keyup.enter="search" v-model="title" class="input-txt"
                                              type="text"/>


                                    <el-button @click="search" type="danger" icon="el-icon-search">搜索</el-button>

                                </td>
                            </tr>
                            </tbody>
                        </table>


                    </div>
                    <!-- 搜索控件结束 -->

                    <div class="clear">
                    </div>


                    <div class="action-details">
                        <div class="btn-group">

                            <!--{{export-view}}-->
                            <el-button type="danger" @click="deleteRc" icon="el-icon-delete">删除</el-button>
                        </div>
                    </div>

                    <table id="yuyue" width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
                        <thead>
                        <tr>
                            <th>
                                <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                            </th>


                            <th><b>标题</b></th>


                            <th><b>预约日期</b></th>


                            <th><b>电话</b></th>


                            <th><b>状态</b></th>


                            <th><b>预约人</b></th>


                            <th><b>导游</b></th>


                            <th>
                                操作
                            </th>

                        </tr>

                        </thead>
                        <tbody>


                        <tr v-for="(yuyue,index) in  listYuyue" :key="yuyue.id">
                            <td>
                                <input class="check" name="ids" type="checkbox" v-model="yuyue.rowSelected"/>


                            </td>


                            <td>
                                {{yuyue.title}}
                            </td>


                            <td>
                                {{yuyue.yydate}}
                            </td>


                            <td>
                                {{yuyue.mobile}}
                            </td>


                            <td>
                                <span v-if="yuyue.state==1">等待审核</span>
                                <span v-if="yuyue.state==2">审核通过</span>
                                <span v-if="yuyue.state==3">暂时无时间安排</span>
                            </td>


                            <td>
                                {{yuyue.hyname}}
                            </td>


                            <td>
                                {{yuyue.tname}}({{yuyue.taccount}})
                            </td>


                            <td>
                                <div class="el-button-group">

                                    <router-link v-if="yuyue.state==1" class="el-button el-button--primary el-button--small":to="'/admin/yuyuespnext?id='+yuyue.id"><i class="el-icon-info"></i>审批</router-link>
                                    <router-link class="el-button el-button--warning el-button--small":to="'/admin/yuyuedetail?id='+yuyue.id"><i class="el-icon-info"></i>详细</router-link>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="listYuyue.length==0">
                            <td colspan="20">
                                没有相关预约信息
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


        </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yuyuemanger",
        data() {
            return {


                "title": "",
                hostHead: this.$app.contextPath,
                selectedAll: false,
                listYuyue: [],
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
                let url = "admin/yuyue/list";
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
                    this.listYuyue = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/yuyue/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listYuyue.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listYuyue.filter(c => c.rowSelected).map(c => c.id);
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
                if (this.listYuyue != null) {
                    this.listYuyue.forEach(c => {
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
