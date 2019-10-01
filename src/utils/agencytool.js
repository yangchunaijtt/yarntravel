import Cookie from "./cookie";
export const howtogo = (router, to, agency, next) => {
  const org_id = Cookie.get('originalid');
  console.log('代理===',agency)
  console.log('代理===', org_id)
  
  if (typeof org_id !== 'undefined' && org_id !==""+agency) {//如果uid 变化了清除登陆信息
    Cookie.remove('gdmobileusername');
    Cookie.remove('gdmobileusername');
    Cookie.remove('usersecret');
    Cookie.set('originalid', agency, {expires:7});
  }
  if (typeof org_id === 'undefined') {
    Cookie.set('originalid',agency,{expires:7});
  } 
  if (!agency ) {
    console.log('没有代理')
    next();
    return;
  }
  if (typeof to.query.uid != "undefined") {
    next();
  } else {
    to.query.uid = agency;
    // router.replace({ path: to.path, query: to.query });
    next({ path: to.path, query: to.query });
  }
}