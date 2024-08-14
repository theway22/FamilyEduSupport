<template>
    <div class="vm-sidebar">
        <div class="hd">热门信息</div>
        <div class="bd">
            <div v-for="xinxi in listHot" :key="xinxi.id" class="item">
                <router-link :to="'/e/xinxiinfo?id='+xinxi.id">
                    <div class="image-wrap">
                        <img :src="hostHead+xinxi.images[0]"/>
                    </div>
                    <div class="text-wrap">
                        <div class="name">{{xinxi.title}}</div>
                        <div class="muted">{{xinxi.pubtime}}</div>
                        <div class="bm-wrap">{{xinxi.clickcount}}人点击</div>
                    </div>
                </router-link>
            </div>


        </div>
    </div>
</template>

<script>
    import  {VueUtil} from "../util/vueutil";

    export default {
        name: "hotnews",
        data(){
            return{
                hostHead: this.$app.contextPath,
                listHot:[],
            }
        },
        created() {
            this.getHot();
        },
        methods:{
            getHot(){
                let url = "admin/xinxi/hot";
                this.$http.post(url).then(res => {
                    console.log(res.data);
                    if(res.data!=null&&res.data.data!=null) {
                        this.listHot =res.data.data;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
