import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


/**
 *
 * @param page 必选
 * @param path 可选
 * @returns {{path: string, component: (function(): *), name: string}}
 */
function routeItem(page,path){
    if(path==null){
        path=page;
    }
    let startPos=page.toLowerCase().lastIndexOf("/");
    let endPos=page.toLowerCase().indexOf(".vue");
    if(startPos==-1)
        return{
            path:`${path}`,
            name: `${page}`,
            component: ()=>import(`@/${page}`)
        };
    let name=page.toLowerCase();
    if(endPos!=-1)
          name=page.toLowerCase().substring(0,endPos);
    let url=name.substring(1);
    let t="@/admin/login";
    return {
        path:`${path}`,
        name: `${path}`,
        component: ()=>import(`@/${url}.vue`)
    };

}




const adminRoutes = [
    {
        path: "/",
        name: "Index",
        redirect: "/e/index"
    },
    routeItem("/admin/login"),
    {
        path: "/admin",
        name: "AdminIndex",
        component: () => import('@/admin/index.vue'),
        redirect: "/admin/index",
        children: [
            routeItem("/admin/accountinfo","index"),
            routeItem("/admin/usersmanager","usersmanager"),
            routeItem("/admin/usersadd","usersadd"),
            routeItem("/admin/accountinfo","accountinfo"),
            routeItem("/admin/modifypw","modifypw"),
            routeItem("/admin/modifyinfo","modifyinfo"),
            routeItem("/admin/sysrolemanager","sysrolemanager"),
            routeItem("/admin/sysroleadd","sysroleadd"),
            routeItem("/admin/huiyuanmanager","huiyuanmanager"),
            routeItem("/admin/huiyuanadd","huiyuanadd"),
            routeItem("/admin/lanmumanager","lanmumanager"),
            routeItem("/admin/lanmuadd","lanmuadd"),
            routeItem("/admin/subtypeadd","subtypeadd"),
            routeItem("/admin/xinximanager","xinximanager"),
            routeItem("/admin/xinxiadd","xinxiadd"),
            routeItem("/admin/xinxidetails","xinxidetails"),
            routeItem("/admin/noticemanager","noticemanager"),
            routeItem("/admin/noticeadd","noticeadd"),
            routeItem("/admin/xxtongji","xxtongji"),
            routeItem("/admin/leavewordmanager","leavewordmanager"),
            routeItem("/admin/jiaodiantumanager","jiaodiantumanager"),
            routeItem("/admin/jiaodiantuadd","jiaodiantuadd"),
            routeItem("/admin/sitenavmanager","sitenavmanager"),
            routeItem("/admin/sitenavadd","sitenavadd"),
            routeItem("/admin/pagesettingmanager","pagesettingmanager"),
            routeItem("/admin/pagesettingadd","pagesettingadd"),
            routeItem("/admin/psitemmanager","psitemmanager"),
            routeItem("/admin/psitemadd","psitemadd"),
            routeItem("/admin/sysconfigmanager","sysconfigmanager"),
            routeItem("/admin/sysconfigadd","sysconfigadd"),
            routeItem("/admin/sysconfigdetails","sysconfigdetails"),
            routeItem("/admin/sysconfigitemadd","sysconfigitemadd"),
            routeItem("/admin/shangpinmanager","shangpinmanager"),
            routeItem("/admin/shangpinadd","shangpinadd"),
            routeItem("/admin/shangpindetails","shangpindetails"),
            routeItem("/admin/appointordermanager","appointordermanager"),
            routeItem("/admin/teachermanager","teachermanager"),
            routeItem("/admin/teacheradd","teacheradd"),
            routeItem("/admin/yuyuemanager","yuyuemanager"),
            routeItem("/admin/yuyuedetail","yuyuedetail"),
            routeItem("/admin/yuyuespnext","yuyuespnext"),
            routeItem("/admin/yingpianmanager","yingpianmanager"),
            routeItem("/admin/yingpianadd","yingpianadd"),

        ],

    }
];

const huiyuanRoutes=[
    {
        path: "/huiyuan",
        name: "huiyuanIndex",
        redirect: "/huiyuan/index",
        component:()=>import("@/huiyuan/index"),
        children:[
           routeItem("/huiyuan/accountinfo","index"),
           routeItem("/huiyuan/accountinfo","accountinfo"),
           routeItem("/huiyuan/modifypw","modifypw"),
           routeItem("/huiyuan/modifypaypw","modifypaypw"),
           routeItem("/huiyuan/modifyinfo","modifyinfo"),
           routeItem("/huiyuan/xinxiadd","xinxiadd"),
           routeItem("/huiyuan/xinximanager","xinximanager"),
           routeItem("/huiyuan/xinxidetails","xinxidetails"),
           routeItem("/huiyuan/mydes","mydes"),
           routeItem("/huiyuan/yue","yue"),
           routeItem("/huiyuan/shoucangmanager","shoucangmanager"),

           routeItem("/huiyuan/mystar","mystar"),
           routeItem("/huiyuan/myask","myask"),
           routeItem("/huiyuan/appointordermanager","appointordermanager"),
           routeItem("/huiyuan/yuyuemanager","yuyuemanager"),

           routeItem("/huiyuan/yuyuedetail","yuyuedetail"),

        ]
    }
];

const eRoutes=[
    routeItem("/e/index"),
    routeItem("/e/xinxiinfo"),
    routeItem("/e/search"),
    routeItem("/e/register"),
    routeItem("/e/myspace"),
    routeItem("/e/xinxilist"),
    routeItem("/e/articlelist"),
    routeItem("/e/lanmuinfo"),
    routeItem("/e/noticelist"),
    routeItem("/e/noticeinfo"),
    routeItem("/e/leavewordinfo"),
    routeItem("/e/sysconfiginfo"),
    routeItem("/e/shangpinlist"),
    routeItem("/e/shangpininfo"),
    routeItem("/e/userspace"),
    routeItem("/e/teacherlist"),
    routeItem("/e/teacherinfo"),
    routeItem("/e/yingpianlist"),
    routeItem("/e/yingpianinfo"),
    routeItem("/e/playyp"),

];

const router = new VueRouter({
    mode: 'hash',//history
    base: process.env.BASE_URL

})
router.addRoutes(adminRoutes);
router.addRoutes(huiyuanRoutes);


router.addRoutes(eRoutes);
router.beforeEach((to, from, next) => {
    console.log('to.path=' + to.path)
    document.title="家庭教育救助网站";
    if (to.path === '/admin/login') {
        return next()
    }
    let path=to.path;
    let $this=router.app;
    if(path.startsWith("/admin")){
        let key=$this.$app.mycas.users_key;
        let strUsers = window.sessionStorage.getItem(key);
        if (strUsers == null) {
            return next('/admin/login')
        }
    }
    if(path.startsWith("/huiyuan")){
        let key=$this.$app.mycas.huiyuan_key;
        let strHuiyuan = window.sessionStorage.getItem(key);
        if (strHuiyuan == null) {
            return next('/admin/login')
        }
    }


    next();
});

export default router
