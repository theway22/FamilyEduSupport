<template>
    <div  class="panel panel-default">
        <div class="panel-heading">视频课程管理</div>
        <!-- 搜索控件开始 -->
        <div class="search-options">

            <table cellspacing="0" width="100%">
                <tbody>
                <tr>
                    <td>
                        标题:
                        <div style="width:200px;display: inline-block;">
                            <el-input placeholder="标题" v-model="title"/>
                        </div>

                        类别:
                        <el-cascader v-model="lmvalue"
                                     :options="options"
                                     :props="{ checkStrictly: true }"
                                     clearable></el-cascader>


                        <el-button type="primary" icon="el-icon-search"  @click="search">查找</el-button>

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
                <el-button @click="selectedAllHandler" type="success" icon="el-icon-check">选择</el-button>
                <el-button @click="deleteRec"  type="danger" icon="el-icon-delete"> 删除</el-button>
                <router-link class="el-button el-button--primary el-icon-warning" to="/admin/yingpianadd">发布课程</router-link>
            </el-button-group>

        </div>

        <div class="image-text-box3">


            <div class="bd">


                <div v-for="yingpian in listYingpian" class="item">
                    <div class="image-ar">
                        <router-link :to="'/admin/yingpiandetails?id='+yingpian.id">
                            <img :src="hostHead+yingpian.tupian"/>
                            <input type="checkbox" v-model="yingpian.rowSelected" :value="yingpian.id"/>
                            {{yingpian.title}}
                        </router-link>
                    </div>
                    <div class="text-ar">
                        <div class="title"><router-link :to="'/admin/yingpianadd?id='+yingpian.id">{{yingpian.title}}</router-link>
                        </div>
                        <div class="subtitle">
                            <el-tag>{{yingpian.typename}}/{{yingpian.subtypename}}</el-tag>
                        </div>
                        <div class="time">{{yingpian.pubtime}}</div>
                        <div class="abstract">
                            <router-link v-if="yingpian.state==1" title="审核"
                               :to="'/admin/yingpianspnext?id='+yingpian.id" class="btn btn-danger"><i
                                class="fa fa-check"></i>审核</router-link>
                        </div>
                    </div>
                    <div class="toolbar-op">
                        <div class="btn-group">
                        <span title="删除" @click="deleteOne(yingpian.id)" class="btn btn-danger"><i
                            class="fa fa-trash"></i></span>
                            <router-link title="编辑" :to="'/admin/yingpianadd?id='+yingpian.id" class="btn btn-primary"><i
                                class="fa fa-edit"></i></router-link>
                            <router-link v-if="yingpian.state==1" title="审核"
                               :to="'/admin/yingpianspnext.jsp?id='+yingpian.id" class="btn btn-primary"><i
                                class="fa fa-check"></i></router-link>

                        </div>
                    </div>

                </div>


                <div v-if="listYingpian.length==0" style="width: 100%;" class="no-record-tip white-paper">
                    <div class="content">
                        <i class="fa fa-warning"></i> 没有相关内容
                    </div>
                </div>

            </div>

        </div>

        <div class="clear"></div>
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
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yingpianmanager",
        data(){
            return {
                hostHead:this.$app.contextPath,
                listYingpian: [],
                options: [],
                lmvalue: [],
                pageindex: 1,
                pagesize: 10,
                total: 10,
                selectedAll: false,
                title: ""
            }

        },
        async created() {
            console.log("created");
            this.search();
            this.getLanmus();

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
            search() {

                let param = {
                    currentpageindex: this.pageindex,
                    pagesize: this.pagesize,
                    title: this.title
                };
                if (this.lmvalue != null && this.lmvalue.length > 0)
                    param.typeid = this.lmvalue[0];
                if (this.lmvalue != null && this.lmvalue.length >= 2)
                    param.subtypeid = this.lmvalue[1];

                let url = "admin/yingpian/list";
                this.$http.post(url, param).then(res => {
                    console.log(res.data);
                    if (res.data != null && res.data.data != null) {
                        let pageInfo = res.data.data;
                        this.total = pageInfo.total;
                        if (pageInfo.list != null) {
                            pageInfo.list.forEach(c => {
                                c.rowSelected = false;
                            });
                            this.listYingpian = pageInfo.list;
                        }
                    }
                });
            },

            async getLanmus() {
                let url = "admin/yingpian/cascadelanmu";
                let {data: res} = await this.$http.post(url, {
                    id: this.lanmuid
                });
                if (res.stateCode < 0) {
                    this.$message.error(res.des);
                    return;
                }
                this.options = res.data;
            },
            selectedAllHandler() {

                this.selectedAll = !this.selectedAll;
                if (this.listYingpian != null) {
                    this.listYingpian.forEach(c => {
                        c.rowSelected = this.selectedAll;
                    });
                }
            },
            async deleteOne(id) {
                let util = new VueUtil(this);
                if (id == null)
                    return;
                let ids = [];
                ids.push(id);
                let url = "admin/yingpian/delete";
                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post(url, {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            util.message.success("删除成功");
                            this.search();
                        }
                    });
                }).catch(() => {
                });
            },
            async deleteRec() {
                let url = "admin/yingpian/delete";
                let util = new VueUtil(this);
                let ids = this.listYingpian.filter(c => c.rowSelected).map(c => c.id);
                if (ids != null && ids.length <= 0) {
                    util.alert('请选择需要删除的记录', '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }


                let res = util.confirm('是否要删除数据?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    util.http.post(url, {ids}, {emulateJSON: false}).then(res => {
                        if (res.data != null && res.data.stateCode > 0) {
                            util.message.success("删除成功");
                            this.search();
                        }
                    });
                }).catch(() => {
                });
            },

        }
    }
</script>

<style scoped>

</style>
