
export default{
  install(Vue,options){
    Vue.prototype.$checkphone=function(phonenum){
      if (!/^1[34578]\d{9}$/.test(phonenum)) {
        return false;
      } else {
        return true;
      }
    }
  }
}