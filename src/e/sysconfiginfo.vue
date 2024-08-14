<template>
    <div >
        <shead  :headid="$route.query.headid"></shead>

        <div  class="wrap round-block clearfix">

            <div style="width:280px;float:left;min-height:600px; overflow:hidden;background:#fff;">
                <div  class="menu-wrap2">
                    <div class="hd">{{sysconfig.name}}</div>
                    <div class="bd">

                        <div class="item" v-for="item in sysconfig.cfgitems" :key="item.id">

                                <a v-if="item.type==1"  @click="switchItem(sysconfig.id,item.id)">{{item.title}}</a>
                                <a v-if="item.type==2" :href="item.href">{{item.title}}</a>


                        </div>


                    </div>
                </div>

            </div>
            <div style="min-height:800px;width:900px;float:left;" class="sysconfig">
                <div class="hd">
                    <div class="title">
                        {{ cfgItem.title }}
                    </div>

                </div>

                <div  class="bd">
                    <div style="width: 100%;">
                        <div v-html=" cfgItem.dcontent"></div>
                    </div>

                </div>

            </div>


        </div>

        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom from "./bottom";
    import Shead from "./shead";
    export default {
        name: "sysconfiginfo",
        data(){
            return {
                sysconfig:{},
                cfgItem:{},
                hostHead:this.$app.contextPath
            }
        },
        methods:{

           async switchItem(id,itemId){

                let url="admin/sysconfig/load";
                let {data:res}=await this.$http.post(url,{id:id});
                if(res!=null&&res.stateCode<0){
                    this.$message.error(res.des);
                    return;
                }
                this.sysconfig=res.data;
                console.log("itemId=",itemId);
                if(itemId==null){
                    this.cfgItem=this.sysconfig.cfgitems[0];
                    return;
                }
                this.cfgItem=this.sysconfig.cfgitems.find(c=>{
                    if(c!=null){
                        return c.id==itemId;
                    }
                    return false;
                });

                console.log("this.cfgItem",this.cfgItem);
                if(this.cfgItem==null)
                    this.cfgItem=this.sysconfig.cfgitems[0]
            }
        },
        created(){
           this.switchItem(this.$route.query.id,this.$route.query.itemid);
        },
        components: {Shead,Bottom}
    }
</script>

<style scoped>

</style>
