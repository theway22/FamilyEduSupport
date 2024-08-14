<template>
    <div class="mypanel">

        <div class="hd">
           预定订单管理

        </div>

        <div class="bd">
        <!-- 搜索控件开始 -->
        <div class="search-options">


            <table cellspacing="0" width="100%">
                <tbody>

                <tr>
                    <td>


                        订单号: <input name="ddno" @keyup.enter="search" v-model="ddno" class="input-txt" type="text"/>


                        <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
        <!-- 搜索控件结束 -->

        <div class="action-details">
            <el-button-group>
                <!--{{export-view}}-->
                <el-button type="danger" icon="el-icon-delete" @click="deleteRec">删除</el-button>

            </el-button-group>
        </div>

        <table id="appointorder" width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
            <thead>
            <tr>
                <th>
                    <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                </th>


                <th><b>订单编号</b></th>
                <th><b>教育服务称</b></th>


                <th><b>预定日期</b></th>



                <th><b>预定人</b></th>
                <th><b>联系电话</b></th>


                <th><b>金额</b></th>

                <th><b>状态</b></th>



                <th>
                    操作
                </th>

            </tr>

            </thead>
            <tbody>


            <tr v-for="(appointorder,index) in  listAppointorder" :key="appointorder.id">
                <td>
                    <input class="check" name="ids" type="checkbox" v-model="appointorder.rowSelected"/>


                </td>


                <td>
                    {{appointorder.ddno}}
                </td>

                <td>
                    {{appointorder.pname}}
                </td>

                <td>
                    {{appointorder.yydate}}
                </td>




                <td>
                    {{appointorder.hyname}}--{{appointorder.hyaccount}}
                </td>


                <td>
                    {{appointorder.mobile}}
                </td>

                <td>
                    {{appointorder.fee}}¥
                </td>


                <td>
                    <span v-if="appointorder.state==1">等待付款</span>
                    <span v-if="appointorder.state==2">已付款</span>
                    <span v-if="appointorder.state==3">已服务</span>
                    <span v-if="appointorder.state==4">已评价</span>
                    <span v-if="appointorder.state==5">已取消</span>
                </td>




                <td>
                    <el-button-group >
                        <el-button type="warning" @click.native="showOrderInfo(appointorder)" icon="el-icon-info">详细</el-button>
                        <el-button v-if="appointorder.state==2" type="primary" @click.native="overHandler(appointorder)" icon="el-icon-arrow-right">服务完成</el-button>
                        <el-button v-if="appointorder.state==1" type="primary" @click.native="cancelHandler(appointorder)" icon="el-icon-arrow-right">取消</el-button>
                    </el-button-group>
                </td>
            </tr>

            <tr v-if="listAppointorder.length==0">
                <td colspan="20">
                    没有相关健身订单信息
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


        <el-dialog title="订单查看" :visible.sync="orderinfodlg">
            <table class="smart-table" border="1" cellspacing="1" width="100%">


                <tr>
                    <td class="tlabel" width="15%" align="right">订单编号:</td>
                    <td width="*">
                        {{appointorder.ddno}}
                    </td>
                </tr>

                <tr>
                    <td class="tlabel" width="10%" align="right">服务景点:</td>
                    <td width="*">
                        {{appointorder.pname}}
                    </td>
                </tr>


                <tr>
                    <td class="tlabel" align="right">预定日期:</td>
                    <td>
                        {{appointorder.yydate}}
                    </td>
                </tr>




                <tr>
                    <td class="tlabel" width="10%" align="right">预定人:</td>
                    <td width="*">
                        {{appointorder.hyname}}--{{appointorder.hyaccount}}
                    </td>
                </tr>


                <tr>
                    <td class="tlabel" width="10%" align="right">联系电话:</td>
                    <td width="*">
                        {{appointorder.mobile}}
                    </td>
                </tr>

                <tr>
                    <td class="tlabel" width="10%" align="right">金额:</td>
                    <td width="*">
                        {{appointorder.fee}}¥
                    </td>
                </tr>

                <tr>
                    <td class="tlabel" width="10%" align="right">人数:</td>
                    <td width="*">
                        {{appointorder.count}}人
                    </td>
                </tr>


                <tr>
                    <td class="tlabel" width="10%" align="right">状态:</td>
                    <td width="*">
                        <span v-if="appointorder.state==1">待付款</span>
                        <span v-if="appointorder.state==2">已通过</span>
                        <span v-if="appointorder.state==5">已取消</span>
                        <span v-if="appointorder.state==3">已服务</span>
                        <span v-if="appointorder.state==4">已评价</span>
                    </td>
                </tr>





                <tr>
                    <td class="tlabel" align="right">说明:</td>
                    <td>
                        <div v-html="appointorder.des"></div>
                    </td>
                </tr>





            </table>


        </el-dialog>



    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "appointordermanager",
        data() {
            return {
                "ddno": "",
                hostHead: this.$app.contextPath,
                selectedAll: false,
                listAppointorder: [],
                pageindex: 1, //初始页
                pagesize: 10,
                total: 10,
                orderinfodlg:false,
                appointorder:{},
                spdlg:false,
                state:2
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
                let url = "admin/appointorder/list";
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    "ddno": this.ddno,
                };
                let util = new VueUtil(this);
                console.log("this.pageindex=" + this.pageindex);
                let res = await util.http.post(url, param);
                if (res.data != null) {
                    let pageInfo = res.data.data;
                    this.total = pageInfo.total;
                    this.listAppointorder = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/appointorder/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listAppointorder.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listAppointorder.filter(c => c.rowSelected).map(c => c.id);
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

            showOrderInfo(order){
                this.appointorder=order;
                this.orderinfodlg=true;
            },
            showSpdlg(order){
                this.appointorder=order;
                this.spdlg=true;
            },
            async cancelHandler(order){
                let util = new VueUtil(this);
                let res = util.confirm('确定要取消?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post("admin/appointorder/cancel", {
                        id:order.id,

                    }, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {

                            this.search();
                        }
                    });
                }).catch(() => {
                });

            },
            async overHandler(order){
                let util = new VueUtil(this);
                let res = util.confirm('服务完成?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post("admin/appointorder/over", {
                        id:order.id,

                    }, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {

                            this.search();
                        }
                    });
                }).catch(() => {
                });

            },
            selectedAllHandler() {
                console.log(this.selectedAll);
                if (this.listAppointorder != null) {
                    this.listAppointorder.forEach(c => {
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
