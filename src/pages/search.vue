<template>
  <div class="main">
    <van-nav-bar class="topbar" left-text="" :right-text="isLogin?'我的':'登陆'" left-arrow fixed @click-left="onClickLeft" @click-right="onClickRight">
      <p class="title" v-show="!canCitylistshow" slot="title" @click="toChoosecity">
        {{title}}
        <icon name="angle-down" scale="2" color="red"></icon>
      </p>
      <p v-show="canCitylistshow" slot="title" @click="toChoosecity">
        选择城市
      </p>
    </van-nav-bar>
    <div class="content" v-show="!canCitylistshow">
      <van-search placeholder="景点名称" readonly="readonly" @click="toSearch" />
      <!-- <van-swipe :autoplay="3000" class="swipe">
        <van-swipe-item v-for="(image, index) in imgList" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe> -->
      <div class="hotProduct">
        <div class="hottitle">
          <span>人气必选</span>
          <span style="color:#aaa;" @click="toAllproduct">{{title!='景点门票'?title:''}}全部景点
            <icon name="angle-right" scale="1" color="red"></icon>
          </span>
        </div>
        <div class="hot-list">
          <hot-product :product="item" v-for="(item, index) in sentimentList" :key="index"></hot-product>
        </div>
      </div>

      <!-- <div class="classictheme">
        <p>精选主题</p>
        <ul>
          <li>
            <p>
              <icon name="mount" scale="5" color="red"></icon>
            </p>
            <p>天天特价</p>
          </li>
        </ul>
      </div> -->
      <div class="recommend-product " v-if="scenicList.length>0">
        <p>
          <span>热门景点</span>
          <!-- <span style="color:#aaa;">附近景点
            <icon name="angle-right" scale="1" color="red"></icon>
          </span> -->
        </p>

        <recommend v-for="(item,index) in scenicList.slice(0,4)" :key="index" :recommendpro="item"></recommend>
      </div>
    </div>

    <IndexList @setlocation="getLocationCity" v-if="canCitylistshow"></IndexList>
    <div class="lib">
      <van-popup v-model="searchPopshow" position="right" class="searh-pop">
        <van-search placeholder="景点名称" show-action @search="onSearch" @cancel="onPopsearchcancel" v-model="searchtext" />
        <p>热门搜索</p>
        <ul>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('迪士尼')">迪士尼</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('天目湖')">天目湖</li>
          <li class="van-hairline--bottom " @click="handlesearch('恐龙园')">恐龙园</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('上海')">上海</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('南京')">南京</li>
          <li class="van-hairline--bottom" @click="handlesearch('常州')">常州</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('苏州')">苏州</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('杭州')">杭州</li>
          <!-- <li class="van-hairline--bottom">重庆</li> -->
        </ul>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { isLogin, getToken } from "../utils/login.js";
import { NavBar, Swipe, SwipeItem, Search, Popup, Toast } from "vant";
import IndexList from "../components/IndexList.vue";
import hotProduct from "../components/hotproduct.vue";
import recommend from "../components/recommentpro.vue";
import { $axios } from "../utils/axios";
import Cookie from "../utils/cookie.js";
import hash from "object-hash";
import moment from "moment";
export default {
  name: "search",
  components: {
    IndexList: IndexList,
    "van-nav-bar": NavBar,
    "van-search": Search,
    "van-popup": Popup,
    "van-swipe-item": SwipeItem,
    "van-swipe": Swipe,
    hotProduct: hotProduct,
    recommend: recommend
  },
  data() {
    return {
      scenicList: [],
      imgList: [
        //图片轮播
        "https://pics.lvjs.com.cn/pics/super/2018/03/1522318161_97962.jpg",
        "https://pics.lvjs.com.cn/pics/super/2018/03/1520917933_15008.jpg",
        "https://pics.lvjs.com.cn/pics/super/2018/03/1522133950_33951.jpg"
      ], //轮播图片列表;
      searchtext: "",
      searchPopshow: false, //搜索的组件展示,
      canCitylistshow: false, //城市列表
      title: "景点门票"
    };
  },
  computed: {
    isLogin() {
      return isLogin();
    },
    sentimentList() {
      const sl = this.scenicList.slice();
      sl.sort((a, b) => {
        return a.minPrice - b.minPrice;
      });
      return sl.slice(0, 6);
    }
  },
  beforeRouteEnter: (to, from, next) => {
    Toast.loading({ duration: 0, forbidClick: true, message: "定位中.." });
    //===============微信分享================
    let wd_signurl =
      "http://m.wandaly.net/wx_transportation/gdtrain/wx/wechatparams.asp";
    let gd_signurl =
      "http://m.czgdly.com/transportation/gdtrain/wx/wechatparams.asp";
    let wd_shareLink =
      "http://m.wandaly.net/wx_transportation/scenicspotsTickets/wd/scenic.asp";
    let gd_shareLink =
      "http://m.czgdly.com/transportation/scenicspotsTickets/gd/scenic.asp";
    let wd_shareImg = "http://m.wandaly.net/images/wdly.jpg";
    let gd_shareImg = "http://m.czgdly.com/images/wxlogo.jpg";
    let wd_descTxt =
      "万达门票,畅游全世界,放心在万达!万达国际旅行社,您身边的旅游专家!";
    let gd_descTxt =
      "光大门票,畅游全世界,放心在光大!常州光大国旅,您身边的旅游专家!";

    let wd_appid = "wx971a5f9c96529f7e";
    let gd_appid = "wxdf167727f26b3fad";
    let shareLink = "";
    let shareImg = "";
    let appid = "";
    let signurl = "";
    let descTxt = "";
    if (location.hostname == "m.wandaly.net") {
      shareLink = wd_shareLink;
      shareImg = wd_shareImg;
      appid = wd_appid;
      signurl = wd_signurl;
      descTxt = wd_descTxt;
    } else {
      shareLink = gd_shareLink;
      shareImg = gd_shareImg;
      appid = gd_appid;
      signurl = gd_signurl;
      descTxt = gd_descTxt;
    }
    let com_url = window.location.href;
    let wxSigbn = function getWxSing(c_com_url) {
      return $axios.get(signurl, {
        params: {
          u: c_com_url
        }
      });
    };

    // $axios
    //   .all([wxSigbn(com_url)])
    //   .then(
    //     $axios.spread(wxsing => {
    //       // Indicator.close();
    //       next(vm => {
    //         console.log("wxconfig", wxsing.data);
    //         vm.wxconfig(
    //           appid,
    //           wxsing.data.timestamp,
    //           wxsing.data.nonceStr,
    //           wxsing.data.signature,
    //           shareLink,
    //           shareImg,
    //           descTxt
    //         );
    //       });
    //     })
    //   )
    //   .catch(error => {
    //     // Indicator.close();
    //   });

    //=====================================
    const getLocationfunc = function() {
      const geolocation = new BMap.Geolocation();
      return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(r => {
          if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            console.log("定位", r);
            resolve(r.address.city);
            // alert("您的位置：" + r.point.lng + "," + r.point.lat);
          } else {
            console.log("定位失败", r);
            reject("error");
            // alert("failed" + this.getStatus());
          }
        });
      });
    };
    (async () => {
      let locationcity = "";
      const cookiecity = Cookie.get("currentcity");
      console.log("开始定位", cookiecity);
      locationcity = cookiecity;
      // locationcity = "常州";
      if (
        typeof locationcity === "undefined" ||
        locationcity === "" ||
        locationcity === "景点门票"
      ) {
        try {
          locationcity = await getLocationfunc();
        } catch (error) {
          console.log("定位失败", locationcity);
          locationcity = "常州";
        }
        if (locationcity.indexOf("市") !== -1) {
          locationcity = locationcity.match(/(\S+)市/)[1];
        }
        Cookie.set("currentcity", locationcity);
      }
      console.log("定位1", locationcity);
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "获取门票中.."
      });
      const cachekey = hash.MD5(
        `api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList_${JSON.stringify(
          locationcity
        )}`
      );
      let productinfo_res = null;
      const localcache = window.localStorage[cachekey];
      if (
        localcache !== "" &&
        localcache !== null &&
        typeof localcache !== "undefined"
      ) {
        const localcachejson = JSON.parse(localcache);
        const dff = moment().diff(moment(localcachejson.time));
        console.log("缓存的时间", localcachejson);
        console.log("现在的时间", moment().format("HH:mm:ss"));
        console.log("相差的时间(毫秒)", dff);
        if (dff <= 300000) {
          productinfo_res = localcachejson.data;
        } else {
          productinfo_res = await $axios.post(
            "api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList",
            {
              placeCity: locationcity,
              hasPrice: true,
              pageIndex: 1,
              productStatus: 1,
              pageSize: 10
            }
          );
        }
      } else {
        productinfo_res = await $axios.post(
          "api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList",
          {
            placeCity: locationcity,
            hasPrice: true,
            pageIndex: 1,
            productStatus: 1,
            pageSize: 10
          }
        );
      }

      window.localStorage[cachekey] = JSON.stringify({
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        data: productinfo_res
      });
      console.log("定位", cachekey);
      const wxsing = await wxSigbn(com_url);
      next(vm => {
        Toast.clear();
        vm.wxconfig(
          appid,
          wxsing.data.timestamp,
          wxsing.data.nonceStr,
          wxsing.data.signature,
          shareLink,
          shareImg,
          descTxt
        );
        vm.title = locationcity;
        if (productinfo_res.data.code === "0") {
          vm.scenicList = productinfo_res.data.data.productInfos;
        } else {
          Toast("没有查找到数据");
          vm.scenicList = [];
        }
      });
    })();
  },
  created() {},
  beforeDestroy() {
    console.log("销毁了");
    this.$cookie.set("currentcity", this.title);
  },
  methods: {
    wxconfig(appid, time, nonce, sign, shareLink, shareImg, descTxt) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appid, // "wxdf167727f26b3fad", // 必填，公众号的唯一标识
        timestamp: time, // 必填，生成签名的时间戳
        nonceStr: nonce, // 必填，生成签名的随机串
        signature: sign, // 必填，签名，见附录1
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "hideMenuItems",
          "hideAllNonBaseMenuItem",
          "hideOptionMenu"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function() {
        wx.onMenuShareTimeline({
          title: descTxt, // 分享标题
          link: shareLink, // 分享链接
          imgUrl: shareImg, // 分享图标
          success: function() {
            alert("感谢您的分享!");
          }
        });

        wx.onMenuShareAppMessage({
          title: descTxt, // 分享标题
          link: shareLink, // 分享链接
          desc: "一站式旅游服务,专业旅游顾问.",
          imgUrl: shareImg, // 分享图标
          type: "",
          dataUrl: "",
          success: function() {
            // 用户确认分享后执行的回调函数
            alert("感谢您的分享!");
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQQ({
          title: descTxt, // 分享标题
          desc: "一站式旅游服务,专业旅游顾问.", // 分享描述
          link: shareLink, // 分享链接
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
            alert("感谢您的分享!");
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQZone({
          title: descTxt, // 分享标题
          desc: "一站式旅游服务,专业旅游顾问.", // 分享描述
          link: shareLink, // 分享链接
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
            alert("感谢您的分享!");
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
    },
    handlesearch(ttt) {
      this.$router.push({
        name: "allprodet",
        query: {
          search: ttt
        }
      });
    },
    routerTallproduct(searchtext) {
      this.$router.push({
        name: "allprodet",
        query: {
          search: searchtext
        }
      });
    },
    toAllproduct() {
      this.routerTallproduct(this.title);
    },
    onSearch() {
      console.log("搜索");
      this.routerTallproduct(this.searchtext);
    },
    onPopsearchcancel() {
      //取消搜索;
      this.searchPopshow = false;
    },
    toSearch() {
      console.log("search");
      this.searchPopshow = true;
    },
    async getLocationCity(n) {
      Toast.loading({ duration: 0, forbidClick: true, message: "加载中...." });
      this.title = n;
      this.canCitylistshow = false;

      const productlist = await $axios.post(
        "api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList",
        {
          placeCity: n,
          hasPrice: true,
          productStatus: 1,
          pageSize: 6
        }
      );
      Toast.clear();
      if (productlist.data.code === "0") {
        this.scenicList = productlist.data.data.productInfos;
      } else {
        Toast("没有查询到相关产品");
        this.scenicList = [];
      }
      // .then(res => {
      //   Toast.clear();
      //   console.log("所有的景区:" + n, res);
      //   if (res.data.code === "0") {
      //     this.scenicList = res.data.data.productInfos;
      //   } else {
      //     Toast("没有查询到相关产品");
      //     this.scenicList = [];
      //   }
      // });
    },
    toChoosecity() {
      this.canCitylistshow = true;
    },
    onClickLeft() {
      if (this.canCitylistshow) {
        this.canCitylistshow = false;
      } else {
        this.$router.go(-1);
      }
    },
    onClickRight() {
      //登陆 或者 进入个人中心;
      if (this.isLogin) {
        //个人中心
        this.$router.push("/orderList");
      } else {
        //登陆
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.main {
  min-height: 100% !important;
  padding-top: 45px;
  // position: relative;
  .topbar {
    z-index: 10 !important;
  }
  .title {
    @include flexbox(row, center, center);
  }
  .lib {
    .searh-pop {
      @include maxPop();
      p {
        text-align: left;
        padding: 0.266667rem 0px 0.266667rem 0.4rem;
        background-color: $pupbaccolor;
      }
      ul {
        @include flexbox(row, flex-start, center);
        flex-wrap: wrap;
        li {
          width: 33%;
          box-sizing: border-box;
          padding: 0.133333rem;
        }
      }
    }
  }
  .content {
    .swipe {
      height: 2.666667rem;
    }
    .hotProduct {
      margin-top: 0.266667rem;
      background-color: #fff;
      padding: 0 10px;
      .hottitle {
        padding: 0.133333rem 0;
        border-bottom: 0.026667rem solid $pupbaccolor;
        @include flexbox(row, space-between, center);
      }
      .hot-list {
        white-space: nowrap;
        box-sizing: border-box;
        padding: 0.266667rem;
        overflow-y: auto;
        &::after {
          content: "";
          display: block;
          clear: both;
        }
      }
    }
    .recommend-product {
      margin-top: 0.266667rem;
      background-color: #fff;
      > p {
        padding: 0.266667rem;
        border-bottom: 1px solid #ddd;
        @include flexbox(row, space-between, center);
      }
    }
  }
}
</style>

