<template>

    <div id="app">


        <table cellpadding="0" cellspacing="1" class="smart-table" border="1" width="100%">
            <tr>
                <td class="tlabel" align="right">名称:</td>
                <td>{{shangpin.name}}</td>
                <td colspan="2" rowspan="5"><img id="imgTupian" width="200px"
                                                 height="200px" :src="hostHead+shangpin.images[0]" />
                </td>
            </tr>

            <tr>
                <td class="tlabel" align="right">价格:</td>
                <td>{{shangpin.jiage}}￥</td>
            </tr>


            <tr>
                <td class="tlabel" align="right">物品库存:</td>
                <td colspan="3">{{shangpin.kucun}}{{shangpin.danwei }}</td>
            </tr>

            <tr>
                <td class="tlabel" align="right">采购数量:</td>
                <td><input name="shuliang" style="width:120px;"
                           v-validate="{required:true,digits:true,messages:{required:'请输入数量',digits:'请输入正确数量'}}"
                           v-model="shuliang" class="input-txt" type="text" />
                    <input
                        name="danwei" style="width:80px;" v-model="danwei"
                        v-validate="{required:true,messages:{required:'请输入单位'}}"
                        class="input-txt"
                        type="text"  />
                </td>
            </tr>

            <tr>
                <td colspan="4">
                    <el-button @click="addStockHandler" type="danger" icon="el-icon-plus">补充库存</el-button>
                </td>
            </tr>

        </table>

    </div>

</template>

<script>
    export default {
        name: "kucunadd",
        data(){

           return {
               count: 1,
               hostHead: this.$app.contextPath,
               shangpin: {},
               shuliang: 100,
               danwei: "",
               cgren: ""
           }

        },
        created(){


            this.getShangpin(this.params.id);


        },
        props:{
            accountInfo:{
                type:Object
            },
            params:{
                type:Object,
                default:{}
            },
        },
        methods:{

            async getShangpin(id){
                let url="admin/shangpin/load";
                let {data:res}=await this.$http.post(url, {id});
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.shangpin=res.data;
                this.danwei=this.shangpin.danwei;
            },
            async addStockHandler(){
                let url="admin/shangpin/addstock";
                const  validRes=this.myValidator.valid(this);
                console.log("valRes",validRes);
                if (!validRes)
                    return ;
                let {data:res}=await this.$http.post(url, {
                    id:this.shangpin.id,
                    shuliang:this.shuliang,
                    danwei:this.danwei
                });
                if (res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return ;
                }
                this.$message.success("库存更新成功");
                this.$emit("close",false);
            }


        }

    }
</script>

<style scoped>

</style>
