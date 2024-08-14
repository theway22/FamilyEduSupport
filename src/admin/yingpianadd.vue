<template>
    <div class="panel panel-default">
        <div class="panel-heading">

                <div v-if="actiontype=='save'"><i class="el-icon-plus"></i>发布视频</div>
                <div v-if="actiontype=='update'"><i class="el-icon-edit"></i>编辑视频</div>

        </div>


        <table class="smart-table" border="1" cellspacing="1" width="100%">


            <tr>
                <td class="tlabel" width="10%" align="right">标题:</td>
                <td width="*">
                    <input name="title" v-model="yingpian.title" placeholder="标题"
                           v-validate="{required:true,messages:{required:'请输入标题'}}" class="input-txt" type="text"/>

                </td>
            </tr>


            <tr>
                <td class="tlabel" width="10%" align="right">图片:</td>
                <td width="*">
                    <dw-upload  :host-head="hostHead" v-model="yingpian.tupian"></dw-upload>
                </td>
            </tr>



            <tr>
                <td class="tlabel" align="right">分类:</td>
                <td>
                    <el-cascader
                        v-model="lmvalue"
                        :options="cascadeData"
                        :props="{ expandTrigger: 'hover' }"></el-cascader>
                </td>
            </tr>



            <tr>
                <td class="tlabel" align="right">视频：</td>
                <td>
                    <el-radio-group v-model="yingpian.xshowtype">
                        <el-radio :label="1">外部视频</el-radio>
                        <el-radio :label="2">上传视频</el-radio>

                    </el-radio-group>
                    <div v-if="yingpian.xshowtype==1">
                   <textarea v-model="yingpian.remoteurl"   style="width:54%;height:50px;">
                   </textarea>
                    </div>
                    <div v-if="yingpian.xshowtype==2">
                        <el-upload
                            class="document-upload-wrapper"
                            :file-list="fileList"
                            :limit="1"
                            accept="*.avi;*.rmbv;*.wmv;*.rm;*.mp4;*.m4v;*.flv"
                            :on-remove="removeHandler"
                            :on-change="changeHandler"
                            :action="hostHead+'/admin/upload'"
                            multiple>
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div class="el-upload__tip" slot="tip">只能上传视频文件*.avi;*.rmbv;*.wmv;*.rm;*.mp4;*.m4v;*.flv</div>
                        </el-upload>

                    </div>


                </td>
            </tr>



            <tr>
                <td class="tlabel" width="10%" align="right">说明:</td>
                <td width="*">
                    <quill-editor  v-model="yingpian.des" :options="{placeholder: '说明'}"></quill-editor>
                </td>
            </tr>


            <tr>
                <td colspan="4">

                    <button @click="submitHandler" class="btn btn-danger"><i class="fa fa-check"></i>提交</button>

                </td>
            </tr>


        </table>


    </div>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "yingpianadd",
        data() {
            return {
                actiontype: 'save',
                hostHead: this.$app.contextPath,
                errors: {},
                cascadeData: [],
                fileList: [],
                lmvalue:[],
                "yingpian": {
                    "title": "",
                    "tupian":"/upload/nopic.jpg",
                    "pubren": this.accountInfo.id,
                    "subtitle": "",
                    xshowtype:1,
                    "typeid": "",
                    "jifen":0,
                    "subtypeid": "",
                    "state": "2",
                    "tags": "",
                    "alphabetindex": "",
                    "remoteurl": "",
                    "des": ""
                },
            }
        },
        props:{
          accountInfo:{
              type:Object
          }
        },
        methods: {
            //begin load
            async load() {
                let id = this.$route.query.id;
                if (id !=null) {
                    this.actiontype = "update";
                    this.pageTitle = "编辑视频";
                    let url = "admin/yingpian/load";
                    let util = new VueUtil(this);
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null) {
                        this.yingpian = res.data;

                        if (this.yingpian.xshowtype==2&&this.yingpian.fileName!=null&&this.yingpian.fileName!="")
                            this.fileList.push({name:this.yingpian.fileName,id:this.yingpian.id,url:this.hostHead+this.yingpian.remoteurl});
                    }
                }
            },//end load
            async submitHandler() {

                let defaultOptions = {
                    url: "admin/yingpian/save",
                    actionTip: "视频新增成功"
                };
                if (this.actiontype == "update") {
                    defaultOptions.url = "admin/yingpian/update";
                    defaultOptions.actionTip = "视频更新成功";
                }
                const validRes = this.myValidator.valid(this);
                console.log("valRes", validRes);
                if (!validRes)
                    return;
                let util = new VueUtil(this);
                this.yingpian.typeid=this.lmvalue[0];
                this.yingpian.subtypeid=this.lmvalue[1];
                if (this.yingpian.xshowtype==2){
                    if (this.fileList!=null&&this.fileList.length>0&&this.fileList[0].response!=null)
                        this.yingpian.remoteurl=this.fileList[0].response.data[0].relativeUrl;
                    else
                        this.yingpian.remoteurl="";
                }
                let params = {...this.yingpian};

                let {data: res} = await util.http.post(defaultOptions.url, params);
                if (res.stateCode <= 0) {
                    util.alert(res.des, '系统提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                util.message({
                    message: defaultOptions.actionTip,
                    type: 'success',
                    duration: 2000
                });
                this.$router.push("/admin/yingpianmanager");
            },
            async getLanmus(){
                let url = "admin/yingpian/cascadelanmu";
                let {data:res}=await this.$http.post(url,{
                    id:this.lanmuid
                });
                if (res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.cascadeData=res.data;

                if (this.cascadeData!=null&&this.cascadeData.length>0){
                    this.lmvalue.push(this.cascadeData[0].value)
                    if (this.cascadeData[0].children!=null&&this.cascadeData[0].children.length>0){
                        this.lmvalue.push(this.cascadeData[0].children[0].value);
                    }

                }
            },
            changeHandler(file, fileList) {
                console.log("file=",file);
                this.fileList = fileList;
            },
            removeHandler(file, fileList) {
                console.log("remove file=",file);
                console.log("remove fileList=",fileList);
                this.fileList=fileList;
            },
        },
        created() {
            this.load();
            this.getLanmus();
        }
    }
</script>

<style scoped>

</style>
