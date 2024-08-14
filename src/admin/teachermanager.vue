<template>
    <div class="panel panel-default">

        <div class="panel-heading">
            教育指导师管理
        </div>

        <div class="panel-body">
            <div class="search-options">


                <table cellspacing="0" width="100%">
                    <tbody>

                    <tr>
                        <td>


                            工号: <input name="tno" @keyup.enter="search" v-model="tno" class="input-txt" type="text"/>


                            <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
                        </td>
                    </tr>
                    </tbody>
                </table>


            </div>


            <div class="action-details">
                <el-button-group>
                    <!--{{export-view}}-->
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRec">删除</el-button>
                    <router-link class="el-button el-button--primary el-button--mini" to="/admin/teacheradd">新增
                    </router-link>

                </el-button-group>
            </div>



            <table id="teacher" width="100%" border="0" cellspacing="0" cellpadding="0" class="ui-record-table">
                <thead>
                <tr>
                    <th>
                        <input type="checkbox" @click="selectedAllHandler" v-model="selectedAll"/>
                    </th>


                    <th><b>工号</b></th>


                    <th><b>姓名</b></th>


                    <th><b>性别</b></th>


                    <th><b>籍贯</b></th>


                    <th><b>学历</b></th>



                    <th><b>民族</b></th>


                    <th><b>邮箱</b></th>


                    <th><b>电话</b></th>


                    <th><b>职称</b></th>


                    <th><b>特长</b></th>


                    <th>
                        操作
                    </th>

                </tr>

                </thead>
                <tbody>


                <tr v-for="(teacher,index) in  listTeacher" :key="teacher.id">
                    <td>
                        <input class="check" name="ids" type="checkbox" v-model="teacher.rowSelected"/>


                    </td>


                    <td>
                        {{teacher.tno}}
                    </td>


                    <td>
                        {{teacher.name}}
                    </td>


                    <td>
                        {{teacher.sex}}
                    </td>


                    <td>
                        {{teacher.jiguan}}
                    </td>


                    <td>
                        {{teacher.xueli}}
                    </td>





                    <td>
                        {{teacher.nation}}
                    </td>




                    <td>
                        {{teacher.email}}
                    </td>


                    <td>
                        {{teacher.tel}}
                    </td>


                    <td>
                        {{teacher.zhicheng}}
                    </td>


                    <td>
                        {{teacher.major}}
                    </td>


                    <td>
                        <div class="el-button-group">

                            <router-link class="el-button el-button--small el-button--primary" :to="'/admin/teacheradd?id='+teacher.id"><i
                                class="fa fa-edit"></i>修改</router-link>
                            <pop-dialog-button :url="'/admin/teacherdetails?id='+teacher.id" title="教育指导师信息" css-class="el-button el-button--success el-button--small"><i class="el-icon-info"></i>详细</pop-dialog-button>

                        </div>
                    </td>
                </tr>

                <tr v-if="listTeacher.length==0">
                    <td colspan="20">
                        没有相关教育指导师信息
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


<script type="text/javascript">

    import {VueUtil} from "../util/vueutil";
    import PopDialogButton from "../common/mydialog/PopDialogButton";

    export default {

        name: "teachermanager",
        components: {PopDialogButton},
        data() {
            return {


                "tno": "",


                hostHead: this.$app.contextPath,
                selectedAll: false,
                listTeacher: [],
                pageindex: 1, //初始页
                pagesize: 10,
                total: 10,
                infodlg: false,
                teacher: {}

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
                let url = "admin/teacher/list";
                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    "tno": this.tno,
                };
                let util = new VueUtil(this);
                console.log("this.pageindex=" + this.pageindex);
                let res = await util.http.post(url, param);
                if (res.data != null) {
                    let pageInfo = res.data.data;
                    this.total = pageInfo.total;
                    this.listTeacher = pageInfo.list;
                    console.log(pageInfo);
                }
            },
            async deleteRec() {
                let url = "admin/teacher/delete";
                let util = new VueUtil(this);
                let hasChecked = this.listTeacher.some(c => {
                    return c.rowSelected == true;
                });
                if (!hasChecked) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }

                let ids = this.listTeacher.filter(c => c.rowSelected).map(c => c.id);
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
            exportHandler() {
                window.location.href = this.hostHead + "/admin/teacher/expor";
            },
            selectedAllHandler() {
                console.log(this.selectedAll);
                if (this.listTeacher != null) {
                    this.listTeacher.forEach(c => {
                        c.rowSelected = !this.selectedAll;
                    });
                }
            },
            showInfodlg(teacher) {
                this.teacher = teacher;
                this.infodlg = true;
            },
        },
        created() {
            this.search();
        }
    };

</script>
