import {app}  from "./app.js"
import axios  from "axios";
//console.log("native axios=",axios);
axios.defaults.baseURL = app.contextPath;
axios.interceptors.request.use(config=>{
    //console.log(config);
    let adminUserStr=window.sessionStorage.getItem("adminUser");
    if(adminUserStr!=null) {
        let adminUser = JSON.parse(adminUserStr);
        if (adminUser!=null&&adminUser.token != null)
            config.headers.token = adminUser.token;
    }
    return config;
});

// module.exports=axios;
export  {axios}







