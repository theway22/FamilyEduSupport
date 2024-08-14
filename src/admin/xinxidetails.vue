<template>

    <div   class="wrap  round-block">


        <div style="overflow: hidden" class="split-left white-paper">
            <div class="show-details">
                <div class="picture-box">
                    <img v-if="xinxi.images!=null" :src="hostHead+xinxi.images[0]" />

                </div>
                <div class="text-box">
                    <div class="title">{{xinxi.title}}</div>
                    <div class="sub-title"></div>
                    <div>
                        <ul>

                            <li><strong>发布人:</strong>{{xinxi.pubren}}
                            </li>
                            <li><strong>发布时间:</strong>{{xinxi.pubtime}}</li>
                            <li><strong>点击次数:</strong> {{xinxi.clickcount}}
                            </li>
                            <li><strong>所属分类:</strong> {{xinxi.lmname}}</li>

                            <li v-if="xinxi.state==1">
                                <el-radio-group v-model="state">
                                    <el-radio :label="2">审核通过</el-radio>
                                    <el-radio :label="3">不通过</el-radio>
                                </el-radio-group>
                            </li>
                            <li v-if="xinxi.state==1">
                                <el-button type="danger" @click="spHandler" class="el-button el-button-danger" ><i class="el-icon-arrow-right"></i>审核</el-button>
                            </li>


                        </ul>
                    </div>

                </div>
            </div>

            <div v-html="xinxi.dcontent" class="brief-content">

            </div>

            <!--评论区域-->
            <comment :delete-comment="true" :belongid="this.id" :with-comment="false" xtype="xinxi"></comment>

        </div>



    </div>
</template>

<script>
    import Comment from "../e/comment";
    export default {
        name: "xinxidetails",
        data(){
            return {
                hostHead:this.$app.contextPath,
                listHotXinxi:[],
                id:0,
                openLogin:false,
                state:2,
                xinxi:{},
                swiperOptions: {
                    pagination: {
                        el: '.swiper-pagination',    //与slot="pagination"处 class 一致
                        clickable: true            //轮播按钮支持点击
                    },
                    navigation: { // 左右箭头
                        nextEl:'.swiper-button-next',
                        prevEl:'.swiper-button-prev'
                    },
                    loop: true,		// 循环回路
                    slidesPerView: "auto",	// 设置slider容器能够同时显示的slides数量; 设置为auto则自动根据slides的宽度来设定数量
                    centeredSlides: true,	// 设定为true时，active slide会居中，而不是默认状态下的居左
                    spaceBetween: 30

                },

            }
        },
        methods:{

            async getInfo(){
                this.id=this.$route.query.id;
                let {data:res}=await this.$http.post("admin/xinxi/info",{id:this.id});
                if(res!=null&&res.stateCode>0) {
                    this.xinxi = res.data;
                    console.log(this.xinxi);

                }
            },

            async spHandler(){

                let res = this.$confirm('是否要提交?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    let {data: res} = await this.$http.post("admin/xinxi/shenpi", {
                        id: this.xinxi.id,
                        state: this.state
                    });
                    if (res != null && res.stateCode < 0) {
                        this.$message.error(res.des);
                        return;
                    }
                    this.$message.success("成功");
                    this.getInfo();
                }).catch(() => {
                });
            }


        },
        created () {
            this.id="${param.id}";
            this.getInfo();
        },

        components: {Comment}
    }
</script>

<style scoped>

</style>
