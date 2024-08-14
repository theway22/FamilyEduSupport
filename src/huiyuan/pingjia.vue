<template>
    <table class="smart-table" border="1" cellspacing="1" width="100%">


        <tr>
            <td class="tlabel" width="15%" align="right">订单编号:</td>
            <td width="*">
                {{appointorder.ddno}}
            </td>
        </tr>

        <tr>
            <td class="tlabel" width="10%" align="right">产品名称:</td>
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
            <td class="tlabel" align="right">单价:</td>
            <td>
                {{appointorder.price}}元/Kg
            </td>
        </tr>





        <tr>
            <td class="tlabel" width="10%" align="right">预约人:</td>
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
            <td class="tlabel" width="10%" align="right">状态:</td>
            <td width="*">
                <span v-if="appointorder.state==1">待接单</span>
                <span v-if="appointorder.state==2">待上门</span>
                <span v-if="appointorder.state==3">已完成</span>
                <span v-if="appointorder.state==4">已评价</span>
                <span v-if="appointorder.state==5">已取消</span>
            </td>
        </tr>


        <tr>
            <td class="tlabel" align="right">说明:</td>
            <td>
                <div v-html="appointorder.des"></div>
            </td>
        </tr>

        <tr>
            <td class="tlabel">评价:</td>
            <td colspan="3">
                <el-rate v-model="star"></el-rate>
            </td>
        </tr>
        <tr>
            <td class="tlabel">描述</td>
            <td colspan="3">
                <div  style="width: 300px;" >
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="des"
                        clearable>
                    </el-input>
                </div>

            </td>
        </tr>


        <tr>
            <td colspan="2">
                <el-button @click="pingjiaHandler" type="primary" icon="el-icon-check">提交</el-button>
            </td>
        </tr>



    </table>
</template>

<script>
    import {VueUtil} from "../util/vueutil";

    export default {
        name: "pingjia",
        data() {
            return {

                hostHead: this.$app.contextPath,
                "appointorder": {},
                weight:10,
                listZhiyuan:[],
                replydes:"",
                star: 0,
                des: '',
            }
        },
        props:{
          params:{type:Object}
        },
        methods: {

            async load() {
                let id =this.params.id;
                let util = new VueUtil(this);
                if (id != null) {
                    let url = "admin/appointorder/load";
                    let {data: res} = await util.http.post(url, {id: id});
                    console.log("res", res);
                    if (res != null && res.data != null)
                        this.appointorder = res.data;
                }
            },

            async pingjiaHandler(){
                let util=new VueUtil(this);
                let url="admin/appointorder/pingjia";
                let {data:res}=await util.http.post(url,{
                    id:this.appointorder.id,
                    "star":this.star,
                    des:this.des
                });
                console.log("res",res);
                if (res != null && res.stateCode < 0){
                    this.$message.error(res.des);
                    return;
                }
                this.$message.success("成功");
                this.$emit("close",false);
            }

        },
       async created() {
            await this.load();
            await this.getZhiyuan();
        }


    }
</script>

<style scoped>

</style>
