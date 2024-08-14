<template>
    <div >
        <div :style="{'width': isCollapse?'64px' : '200px'}" class="sidebar-container">
            <div class="logo-container">
                <transition name="el-fade-in-linear">
                    <div v-show="!isCollapse"  class="title">
                        <router-link to="/e/index">家庭教育救助网站</router-link>
                    </div>
                </transition>
            </div>

            <div class="content theme-dark">

                <el-menu background-color="#304156"
                         text-color="#fff"

                         @select="selectedHandler"
                         unique-opened
                         :collapse="isCollapse"
                         :router="false"
                         :default-active="activePage"
                         active-text-color="#ffd04b">

                    <el-submenu popper-class="mymenu-item" index="8">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>教育服务</span>
                    </template>

                    <el-menu-item index="/admin/shangpinmanager"><i class="el-icon-date"></i>教育服务管理</el-menu-item>
                    <el-menu-item index="/admin/shangpinadd"><i class="el-icon-plus"></i>发布教育服务</el-menu-item>
                    <el-menu-item index="/admin/appointordermanager"><i class="el-icon-date"></i>订单管理</el-menu-item>

                    <el-menu-item index="/admin/yuyuemanager"><i class="el-icon-date"></i>预约信息</el-menu-item>

                </el-submenu>
                    <el-submenu popper-class="mymenu-item" index="7">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>课程文章</span>
                        </template>

                        <el-menu-item index="/admin/yingpianmanager"><i class="el-icon-date"></i>讲座管理</el-menu-item>
                        <el-menu-item index="/admin/lanmumanager"><i class="el-icon-date"></i>栏目管理</el-menu-item>
                        <el-menu-item index="/admin/xinximanager"><i class="el-icon-date"></i>文章管理</el-menu-item>
                        <el-menu-item index="/admin/xinxiadd"><i class="el-icon-plus"></i>发布文章</el-menu-item>
                        <el-menu-item index="/admin/noticemanager"><i class="el-icon-date"></i>公告管理</el-menu-item>
                        <el-menu-item index="/admin/sysconfigmanager"><i class="el-icon-date"></i>系统介绍</el-menu-item>
                        <el-menu-item index="/admin/jiaodiantumanager"><i class="el-icon-date"></i>轮播图设置</el-menu-item>
                    </el-submenu>
                    <el-submenu popper-class="mymenu-item" index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>人员管理</span>
                        </template>


                        <el-menu-item index="/admin/teachermanager"><i class="el-icon-date"></i>指导师管理</el-menu-item>
                        <el-menu-item index="/admin/huiyuanmanager"><i class="el-icon-date"></i>会员管理</el-menu-item>
                        <el-menu-item index="/admin/usersmanager"><i class="el-icon-date"></i>管理员管理</el-menu-item>
                        <el-menu-item index="/admin/usersadd"><i class="el-icon-date"></i>新增用户</el-menu-item>

                    </el-submenu>


                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>账户设置</span>
                        </template>
                        <el-menu-item index="/admin/modifypw"><i class="el-icon-date"></i>修改密码</el-menu-item>
                        <el-menu-item index="/admin/modifyinfo"><i class="el-icon-date"></i>编辑账户</el-menu-item>
                        <el-menu-item index="/admin/accountinfo"><i class="el-icon-date"></i>账户信息</el-menu-item>

                    </el-submenu>


                </el-menu>

            </div>
        </div>
        <div :style="{'margin-left':isCollapse?'64px' : '200px'}" class="main-container">
            <div class="header">
                <div class="fleft">
                    <div style="padding-top:12px;padding-left:22px;">
                        <i style="font-size: 22px; cursor: pointer"
                           :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="handleCollapse"></i>
                    </div>

                </div>
                <div class="hright">
                    <div class="user-con">
                        <div class="btn-fullscreen" @click="handleFullScreen">
                            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                                <i class="el-icon-rank"></i>
                            </el-tooltip>
                        </div>
                        <div class="user-avator">
                            <img :src="hostHead+accountInfo.xiangpian" class="image"/>
                        </div>
                        <el-dropdown class="username" trigger="click" @command="handleCommand">
                      <span class="el-dropdown-link">
                          {{accountInfo.username}}-{{accountInfo.realname}}(管理员)
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                            <el-dropdown-menu slot="dropdown">
                                <router-link to="/admin/accountinfo">
                                    <el-dropdown-item>用户信息</el-dropdown-item>
                                </router-link>
                                <router-link to="/admin/modifypw">
                                    <el-dropdown-item>修改密码</el-dropdown-item>
                                </router-link>

                                <el-dropdown-item divided command="exit">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                </div>

            </div>

            <router-view :accountInfo="accountInfo"></router-view>

        </div>

    </div>

</template>

<script>

    import {VueUtil} from "../util/vueutil";

    export default {
        name: "index",
        data(){
           return {
              hostHead:this.$app.contextPath,
              activePage:"/admin/accountinfo",
              accountInfo:{},
              fullscreen: false,
               isCollapse: false,
           }
        },
        methods:{
            handleFullScreen () {
                let element = document.documentElement
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen()
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen()
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen()
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen()
                    }
                }
                this.fullscreen = !this.fullscreen
            },
            handleCollapse () {
                this.isCollapse = !this.isCollapse
            },

            selectedHandler(page){
              if(page!=null&&this.$route.path!=page)
                  this.$router.push(page);
            },
            //
            handleCommand (command) {

                console.log("command",command);
                if (command != 'exit') {
                    return
                }
                let url = 'admin/exit'
                let util=new VueUtil(this);
                let res = util.confirm('是否要退出?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$app.mycas.logout(this.$app.mycas.users_key);
                    this.$router.push("/admin/login");
                });

            },
        },
        created() {
            this.accountInfo=this.$app.mycas.getAccount(this.$app.mycas.users_key);
        },


    }
</script>

<style scoped>
    @import "css/index.css";


</style>
