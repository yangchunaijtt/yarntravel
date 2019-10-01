import Cookie from "./cookie";
import { $axios } from "./axios";
const gd_GetOpenidInfo_url =
  "http://m.czgdly.com:81/Client/Weixin/Get_OpenidInfo.asp";
const wd_GetOpenidInfo_url =
  "http://m.wandaly.net:85/Mobile/Weixin/Get_OpenidInfo.asp";
const jt_GetOpenidInfo_url =
  "http://m.gdjtly.com:84/Weixin/Get_OpenidInfo.asp?cha=7";
const iswechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isWeixin = ua.indexOf("micromessenger") != -1;
  return isWeixin;
};
const currenturl = window.location.href; //当前的url;
const domainname = `http://m.czgdly.com`;
let atype = 0;
let getopenidinfourl = gd_GetOpenidInfo_url;
if (window.location.host == "m.czgdly.com"||window.location.host == "m.czly001.com"||window.location.host=='jt.czly001.com') {
    atype = 0;
    getopenidinfourl = gd_GetOpenidInfo_url;
} else {
    atype = 1;
    getopenidinfourl = wd_GetOpenidInfo_url;
}

export const getopenid = () => {
  if (iswechat()) {
    //是否在微信
    const urlparam_openid = getUrlKey("openid");
    // alert("在微信:" + urlparam_openid);
    if (urlparam_openid) {
      Cookie.set("WXOPID", urlparam_openid, {expires:30});
    }
    const openid = Cookie.get("WXOPID") || null;
    // alert('openid'+openid);

    if (!openid) {
      //没有openid；跳转
      // alert('没有openid');

      window.location.href = `${domainname}/transportation/wxlogin/getcode.asp?fromurl=${encodeURIComponent(
        currenturl
      )}&type=${atype}`;
      return;
    }
    // alert('没有微信cookie')
  }
  console.log(
    `${domainname}/transportation/wxlogin/getcode.asp?fromurl=${encodeURIComponent(
      currenturl
    )}&type=${atype}`
  );

  // alert('不在微信中');
};
export const isFocuson = (openid,successf,errorf) => {
    if(iswechat()){
        $axios.post(getopenidinfourl, { Openid: openid }).then(res => {
            successf(res);
            // console.log(res);
        }).catch((error) => {
            errorf(error)
        })
    }
}
const getUrlKey = name => {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
        location.href
      ) || [, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
};