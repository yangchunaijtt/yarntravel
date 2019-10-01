import axios from 'axios';
import qs from 'qs';
axios.defaults.baseURL = 'http://58.216.175.118:86/';
// http://192.168.1.8:3999/
//http://58.216.175.118:86/
// axios.defaults.baseURL = 'http://192.168.1.8:3999/';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use( (req)=> {
  // 在发送请求之前做些什么
  // console.log(req);
  if (req.method === 'post') {
    req.data=qs.stringify(req.data)
  }
  // console.log('req',qs.stringify(req.data) )
  return req;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么

  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default{
  install(Vue,options){
    Vue.prototype.$axios=axios;
  }
}
export  const $axios=axios;