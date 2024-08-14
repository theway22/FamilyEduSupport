<template>
    <div>

        <div class="p-head2">
            <div class="cont">

                <div class="site-name">
                    家庭教育救助网站
                </div>
                <div class="navigation">
                    <ul>
                        <li v-for="sn in listSitenav" :key="sn.id"  >

                            <span v-if="withParam(sn.href)" :class="{current:sn.id==headid,item:true}"  @click="navigatePage(sn.href+'&headid='+sn.id)" >{{sn.title}}</span>
                            <span v-else :id="sn.id" :class="{current:sn.id==headid,item:true}" @click="navigatePage(sn.href+'?headid='+sn.id)" >{{sn.title}}</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="oper-con">


                <router-link to="/e/search" class="el-button el-button--primary is-circle" ><i class="el-icon-search"></i></router-link>
                <template v-if="!isLogin()">

                    <router-link title="登录" to="/admin/login" class="el-button el-button--waring is-circle" ><i class="el-icon-user"></i></router-link>
                    <router-link title="注册" to="/e/register" class="el-button el-button--success is-circle" ><i class="el-icon-plus"></i></router-link>


                </template>

                <template v-if="isLogin()">
                    <el-dropdown style="padding:2px 10px;cursor: pointer; ">
                      <span class="el-dropdown-link">
                         {{huiyuan.accountname}}--{{huiyuan.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/huiyuan/index"><i class="fa fa-user"></i>进入后台</router-link></el-dropdown-item>
                            <el-dropdown-item divided></el-dropdown-item>
                            <el-dropdown-item @click.native="exitHandler(2)"><span class="exit">退出</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>



                <template v-if="isAdminLogin()">
                    <el-dropdown style="padding:2px 10px;cursor: pointer; ">
                      <span class="el-dropdown-link">
                           {{users.username}}--{{users.realname}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/admin/index"><i class="fa fa-user"></i>进入后台</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item divided></el-dropdown-item>
                            <el-dropdown-item @click.native="exitHandler(1)"><span class="exit">退出</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>

                <template v-if="isTeacherLogin()">
                    <el-dropdown style="padding:2px 10px; ">
                                  <span class="el-dropdown-link">
                                    {{teacher.tno}}--{{teacher.name}}(教育指导师)<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><router-link to="/teacher/index"><i class="fa fa-user"></i>我的账户</router-link></el-dropdown-item>
                            <el-dropdown-item divided></el-dropdown-item>

                            <el-dropdown-item @click.native="exitHandler(3)"><span class="exit">退出</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>




            </div>

        </div>
        <div style="height: 70px;"></div>


    </div>
</template>

<script>

    export default {
        name: "shead",
        data() {
            return {
                listSitenav: [],
                keyword:"",
                logindlg: false,
                hostHead: this.$app.contextPath
            }
        },
        methods: {

            withParam(href){
                if(href==null)
                    return  false;
                return  href.split("?").length>1
            },
            async list() {
                let url = "admin/sitenav/list";
                let param = {
                    "ispaged": "-1",
                    "order": " order by id desc"
                };
                let {data: res} = await this.$http.post(url, param);
                if (res.data != null) {
                    console.log("header res=", res);
                    this.listSitenav = res.data;
                }
            },
            navigatePage(url){
                if(url==null||url=="")
                    return ;
                this.$router.push(url);
                this.$app.key=url;

            },
            isLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.huiyuan_key);
            },
            isAdminLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.users_key);
            },
            isTeacherLogin() {
                return this.$app.mycas.isLogin(this.$app.mycas.teacher_key);
            },

            async exitHandler(type) {
                this.$confirm('确定要离开?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async (r) => {

                    if(type==2)
                        this.$app.mycas.logout(this.$app.mycas.huiyuan_key);
                    if(type==1)
                        this.$app.mycas.logout(this.$app.mycas.users_key);
                    if(type==3)
                        this.$app.mycas.logout(this.$app.mycas.teacher_key);

                    window.location.reload();

                }).catch(e => {
                });
            },
            searchHandler() {
                if (this.keyword==""){
                    this.$message.error("请输入搜索内容");
                    return;
                }
                this.$router.push(`/e/search?title=${this.keyword}`);

            }

        },
        created() {
            this.list();
        },
        props: {
            headid: {
                type: String,
                default: "1"
            }
        },
        computed:{
           huiyuan(){
              return  this.$app.mycas.getAccount(this.$app.mycas.huiyuan_key);
           },
           users(){
               return this.$app.mycas.getAccount(this.$app.mycas.users_key);
           },
          teacher(){
                return this.$app.mycas.getAccount(this.$app.mycas.teacher_key);
            }

        }
    }
</script>

<style scoped>


    .p-head2{
        position: fixed;

        display: flex;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        width: 100%;
        height: 70px;
        line-height: 70px;
        padding: 0 80px;
        margin: 0;
        background-color: #fefefe;
        -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.4);
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;

        z-index: 100;
        /*background-color: rgba(0, 0, 0, 0.9);*/
        border-bottom: 2px solid #fefefe;
    }
    .p-head2 .cont{
        position: relative;
        display: flex;
        justify-content:flex-start ;
        margin: 0 auto;
        width: 1260px;
        box-sizing: content-box;
    }
    .p-head2   .navigation{
        width: 800px;
        height: 60px;
        margin: 0;
    }

    .p-head2 .oper-con .lb{
        text-align: center;
        font-size: 12px;
        display: block;
        width: 65px;
        height: 28px;
        line-height: 28px;
        color: #acacac;
        transition: all 0.3s ease 0s;
        border-radius: 2px;
    }
    .p-head2 .oper-con  .account-info{
        color:#444400;
    }
    .p-head2 .oper-con{

        height: 100%;
        position: absolute;
        right: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .p-head2 .oper-con  .lb-success{
        background: #6BC30D;
        color: #fff;
    }
    .p-head2 .oper-con  .lb-primary{
        background: #505050;
    }

    .p-head2:after{content:""; display:block;}


    .navigation ul{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
    }
    .navigation ul li{
        list-style: none;
    }
    .navigation ul li a, .navigation ul li .item{

        display: block;
        color: #67757f;
        font-size: 16px;
        padding: 0 24px;
        line-height: 60px;
        height: 60px;
        margin-right: 5px;
        transition: all 0.3s ease 0s;
        text-decoration: none;
        cursor: pointer;
    }

    .navigation ul li a:hover,.navigation ul li a.current,.navigation ul li .item.current{
        background-color: #f56c6c;
        color:#fff;
        font-size: 16px;
    }

    .site-name{
        font-size: 18px;
        color:#00ba8b;
        font-weight: bold;
        width:300px;
        line-height:30px;
        font-family:tahoma, arial, Microsoft YaHei, Hiragino Sans GB;
        padding: 15px 10px;
    }
</style>
