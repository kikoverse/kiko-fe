import axios from "axios";
import utilsTool from "@utils/tool.js";

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_ENV === "development" ? "/center" : "", // url = base url + request url
  baseURL: process.env.VUE_APP_CENTER_SERVE_URL,
  timeout: 50000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const reg = new RegExp("(^/v1)", "g");
    if (reg.test(config.url)) {
      config.headers["X-Token"] = utilsTool.setJWT();
    }
    // config.headers["Content-Type"] = "application/json";
    // do something before request is sent

    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    // console.log("===response===", response);

    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    if (res.error) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   ElMessageBox.confirm(
      //     'You have been logged out, you can cancel to stay on this page, or log in again',
      //     'Confirm logout',
      //     {
      //       confirmButtonText: 'Re-Login',
      //       cancelButtonText: 'Cancel',
      //       type: 'warning',
      //     }
      //   ).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload();
      //     });
      //   });
      // }

      // return Promise.reject(new Error(res.message || "Error"));
      return "error";
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug

    return Promise.reject(error);
  }
);

export default service;
