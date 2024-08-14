<template>

    <div class="site-footer2">
          <div class="bd">
               <div class="logo"></div>
               <ul>
                   <li><router-link to="/e/index">首页</router-link></li>
                   <li><router-link to="/admin/login">后台登录</router-link></li>
               </ul>
          </div>

    </div>

</template>

<script>
    export default {
        name: "bottom",
        data(){
          return {
              hostHead: this.$app.contextPath
          }
        }

    }
</script>

<style scoped>

    .site-footer2{
        height: 108px;
        margin-top:22px;
        background: #fff;
        padding-top: 30px;
    }
    .site-footer2 .bd{
        width: 1380px;
        margin: 0 auto;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .site-footer2 .bd .logo{

        width: 53px;
        height: 46px;
        background: url(./images/flogo.png) no-repeat;
        margin-left: 20px;
        margin-top: 10px;
        float: left;

    }
    .site-footer2 .bd ul{
        float: left;
        padding-left: 25px;
        padding-top: 10px;
    }
    .site-footer2 .bd ul li{
        float: left;
        margin-right: 28px;
        line-height: 30px;

    }
    .site-footer2 .bd ul li a{
        color: #808080;
    }

</style>
