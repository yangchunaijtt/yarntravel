<template>
  <div class="ticket"
       v-if="ticketDetails">
    <div class="swipe">
      <div class="backicon"
           @click="goback">
        <van-icon name="arrow"
                  scale="2"></van-icon>
      </div>
      <van-swipe :autoplay="3000"
                 class="swipe-c">
        <van-swipe-item v-for="(image, index) in imgList"
                        :key="index">
          <div class="imgwrao"
               v-lazy:background-image="image">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="scenicspot-trans">
      <div class="scenicname">
        <p>{{ticketDetails.productName}}</p>
        <i>{{ticketDetails.scenicInfos==true?ticketDetails.scenicInfos.placeLevel:''}}</i>
      </div>
      <div class="sceniclocati"
           v-if="ticketDetails.scenicInfos"
           @click="handlenav">
        <van-icon name="location"></van-icon>
        <span>{{ticketDetails.scenicInfos.placeToAddr}}</span>
        <van-icon name="arrow"></van-icon>

      </div>
    </div>
    <div class="tickets">
      <div class="error"
           v-if="!ticketDetails.goodsList.goods">

      </div>
      <!-- {{ticketclassify2(ticketDetails.goodsList.goods)}} -->
      <div class="ticket_type"
           v-for="(item,index) in ticketclassify2(ticketDetails.goodsList.goods)"
           :key="index">
        <p v-if="item.type">{{formatTickettype(item.type)}}</p>

        <ticketitem @share="handleshare"
                    v-for="(iitem,iindex) in item.standardName"
                    :tickettypeList="iitem.list"
                    :productId="ticketDetails.productId"
                    :key="iindex">
          <p class="goodstitle"
             slot="title">
            {{iitem.name}}
          </p>
        </ticketitem>
      </div>

    </div>
    <div class="toknow">
      <p class="title">景区介绍</p>
      <div class="tokonw-st">
        <p>
          <icon name="notice"
                scale="1.5"></icon> 开放时间
        </p>
        <div class="cccc">
          <p v-for="(item, index) in openTime"
             :key="index">
            <span>
              {{`${item.openTimeInfo?item.openTimeInfo+" ":''}`}}
            </span>
            <span v-if="item.sightStart">
              {{`${item.sightStart}-${item.sightEnd}`}}
            </span>
          </p>

        </div>
      </div>
      <div class="tokonw-st">
        <p>
          <icon name="notice"
                scale="1.5"></icon> 免票政策
        </p>
        <div class="cccc"
             v-if="ticketDetails.bookingInfo">
          <p>{{ticketDetails.bookingInfo.freePolicy}}</p>
        </div>
      </div>
      <div class="includetoknow-cc">
        <span>包括</span>
        <div class="includetoknow">
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>开放时间
          </div>
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>免票政策
          </div>
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>优惠人群
          </div>
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>开具发票
          </div>
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>入园须知
          </div>
          <div class="konwitem">
            <icon name="notice"
                  scale="1.5"></icon>温馨提示
          </div>
        </div>
        <div class="complete-know"
             @click="gotoToknow">
          <span>查看全部介绍</span>
        </div>
      </div>

    </div>
    <div class="share">
      <sharepic :currentShareItem='currentShareItem'
                :coverimg="imgList"
                :ticketDetails="ticketDetails"
                :agencyinfo="agencyinfo"></sharepic>
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions,mapMutations } from 'vuex';
import { $axios } from "../utils/axios";
import { Swipe, Toast, SwipeItem, Popup, Icon, Dialog, NoticeBar } from "vant";
import ticketitem from "../components/ticketitem.vue";
import sharepic from "../components/sharepic.vue";
import moment from "moment";

export default {
  name: "ticket",
  components: {
    "van-swipe-item": SwipeItem,
    "van-swipe": Swipe,
    "van-icon": Icon,
    ticketitem: ticketitem,
    "van-NoticeBar": NoticeBar,
    sharepic: sharepic
  },
  data() {
    return {
      currentShareItem: null,
      ticketDetails: null,
      agencyinfo: null
      // imgList: [
      //   "https://pics.lvjs.com.cn//uploads/pc/place2/2015-03-12/e681327c-ed60-47a3-b653-9987840cb1bb_1280_.jpg",
      //   "https://pics.lvjs.com.cn//uploads/pc/place2/2015-03-12/e681327c-ed60-47a3-b653-9987840cb1bb_1280_.jpg",
      //   "https://pics.lvjs.com.cn//uploads/pc/place2/2015-03-12/e681327c-ed60-47a3-b653-9987840cb1bb_1280_.jpg",
      //   "https://pics.lvjs.com.cn//uploads/pc/place2/2015-03-12/e681327c-ed60-47a3-b653-9987840cb1bb_1280_.jpg",
      //   "https://pics.lvjs.com.cn//uploads/pc/place2/2015-03-12/e681327c-ed60-47a3-b653-9987840cb1bb_1280_.jpg"
      // ]
    };
  },
  computed: {
    openTime() {
      let opentime = [];
      if (this.ticketDetails.scenicInfos.openTimes) {
        console.log(
          "开放时间",
          this.ticketDetails.scenicInfos.openTimes.openTime
        );
        // if(isArray()
        if (Array.isArray(this.ticketDetails.scenicInfos.openTimes.openTime)) {
          return this.ticketDetails.scenicInfos.openTimes.openTime;
        } else {
          return [this.ticketDetails.scenicInfos.openTimes.openTime];
        }
      } else {
        return "";
      }
    },
    imgList() {
      let arr = [];
      const img_arr = this.ticketDetails.images.image;
      try {
        return Array.isArray(img_arr) ? img_arr : [img_arr];
      } catch (error) {
        return [1];
      }
    }
    // imgList(){
    //   // this.ticketDetails.images
    // }
    // ...mapState({
    //   productID:state=>state.productID,
    // }),
  },
  beforeRouteEnter: (to, from, next) => {
    Toast.loading({ duration: 0, forbidClick: true, message: "加载中...." });
    const t_info = to.query;
    const _uid = t_info.uid || -1;
    console.log(t_info);
    const GetProductInfos = () => {
      //请求产品信息
      return $axios.get(
        `api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfos/${t_info.id}`
      );
    };
    const GetGoodsInfos = goods => {
      //请求价格数据
      return $axios.all(getreqArr(goods));
    };
    const Getagencyinfo = uid => {
      return $axios.get(
        `http://m.czgdly.com/transportation/getagencyinfo.asp?uid=${uid}`
      );
    };
    (async () => {
      try {
        const proinfo = await GetProductInfos();
        if (proinfo.data.code == "-1") {
          Toast.clear();
          Dialog.alert({
            title: "出错啦",
            message: proinfo.data.errorMessage
          });
        }
        const goodinfo = await GetGoodsInfos(proinfo.data.data.goodsList.goods);
        const p_arr = [...goodinfo].map(item => {
          return item.data.data;
        });
        let agencyinfores = null;
        if (_uid != -1) {
          //[_tmpUid, openid] = _uid.split("?");
          //alert(_uid);
          //alert(_tmpUid);
          agencyinfores = await Getagencyinfo(_uid);
        }
        console.log("获取的详细价格", p_arr);
        next(vm => {
          Toast.clear();
          vm.ticketDetails = proinfo.data.data;
          vm.ticketDetails.goodsList.goods = p_arr;
          vm.agencyinfo = agencyinfores.data.data;
          console.log("详细信息", vm.ticketDetails);
        });
      } catch (error) {
        Toast.clear();
        Dialog.alert({
          title: "出错啦",
          message: error //"系统错误"
        });
      }
    })();
    //执行查询价格的东西
    const getgoodListprice = id => {
      return $axios.get(
        `api/LvmamaScenicTickets/GoodsLocalInfos/GetGoodsInfos/${id}`
      );
    };
    const getreqArr = goodslist => {
      //获得并发数组
      return goodslist.map((item, index) => {
        return getgoodListprice(item.id);
      });
    };
  },
  mounted() {
    // this.setproductId('98989898');
  },
  methods: {
    handleshare(item) {
      console.log("====share");
      // document.querySelector
      document.querySelector("#sharepicc").click();
      this.currentShareItem = item;
    },
    handlenav() {
      window.location.href = `https://apis.map.qq.com/uri/v1/search?keyword=${
        this.ticketDetails.scenicInfos.placeToAddr
      }&region=${
        this.ticketDetails.scenicInfos.placeCity
      }&referer=WE3BZ-OY7LD-IZW4M-PLRHU-SOMWH-MOFSI`;
    },
    // ...mapMutations({
    //   setproductId:'SETPRODUCTID',
    // }),
    gotoToknow() {
      this.$router.push({
        name: "needtoknow",
        query: { id: this.ticketDetails.id }
      });
    },
    formatTickettype(a) {
      switch (a) {
        //         PARENTAGE 亲子票
        // FAMILY 家庭票
        // LOVER 情侣票
        // COUPE 双人票
        // ADULT 成人票
        // CHILDREN 儿童票
        // OLDMAN 老人票
        // STUDENT 学生票
        // ACTIVITY 活动票
        // SOLDIER 军人票
        // MAN 男士票
        // WOMAN 女士票
        // TEACHER 教师票
        // DISABILITY 残疾票
        // GROUP 团体票
        // FREE 自定义
        case "FAMILY":
          return "家庭票";
        case "PARENTAGE":
          return "亲子票";
          break;
        case "LOVER":
          return "情侣票";
          break;
        case "COUPE":
          return "双人票";
          break;
        case "ADULT":
          return "成人票";
          break;
        case "CHILDREN":
          return "儿童票";
          break;
        case "OLDMAN":
          return "老人票";
          break;
        case "STUDENT":
          return "学生票";
          break;
        case "MAN":
          return "男士票";
          break;
        case "WOMAN":
          return "女士票";
          break;
        case "TEACHER":
          return "教师票";
          break;
        case "DISABILITY":
          return "残疾票";
          break;
        case "GROUP":
          return "团体票";
          break;
        case "FREE":
          return "相关票";
          break;
        case "ACTIVITY":
          return "活动票";
        case "SOLDIER":
          return "军人票";
        default:
          return "";
      }
    },
    arrayclassify(arr) {
      const arr_c = [];

      arr_c.push({
        name: arr[0].standardName,
        list: arr.filter(item => {
          return item.standardName == arr[0].standardName;
        })
      });
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          if (arr[i].standardName != arr[i - 1].standardName) {
            arr_c.push({
              name: arr[i].standardName,
              list: arr.filter(item => {
                return item.standardName == arr[i].standardName;
              })
            });
          }
        }
      }
      console.log("分类", arr);
      return arr_c;
    },
    ticketclassify(arr) {
      //票据分类
      //返回一个种类的数组
      const self = this;
      const classify_arr = [];
      const format_arr = [];
      if (Array.isArray(arr)) {
        classify_arr.push({
          type: arr[0].ticketType,
          standardName: self.arrayclassify(
            arr.filter(item => {
              return item.ticketType == arr[0].ticketType;
            })
          )
        });
        for (let i = 1; i < arr.length; i++) {
          if (arr[i].ticketType != arr[i - 1].ticketType) {
            //成人 儿童
            classify_arr.push({
              type: arr[i].ticketType,
              standardName: self.arrayclassify(
                arr.filter(item => {
                  return item.ticketType == arr[i].ticketType;
                })
              )
            });
          }
        }
      } else {
        classify_arr.push({
          type: arr.ticketType,
          standardName: self.arrayclassify([arr])
        });
      }
      console.log("票的种类", classify_arr);

      return classify_arr;
    },
    ticketclassify2(arr) {
      const arr_set = new Set();
      const standarname_set = new Set();
      arr.forEach(item => {
        arr_set.add(item.ticketType);
        standarname_set.add(item.standardName);
      });
      const type_arr = Array.from(arr_set);
      const standarname_arr = Array.from(standarname_set);
      console.log("standarname_arr", standarname_arr);
      console.log("type_arr", type_arr);
      const classify_arr = [];
      type_arr.forEach(item => {
        classify_arr.push({
          type: item,
          standardName: this.classify_arr2(arr, item, standarname_arr)
        });
      });
      console.log("去重2", classify_arr);
      return classify_arr;
    },
    classify_arr2(arr, ticket_type, standardNamearr) {
      const arr2 = [];
      const type_list = arr.filter(item => {
        //所有 成人票的arr
        return ticket_type == item.ticketType;
      });
      standardNamearr.forEach(item => {
        //单日
        const rr = type_list.filter(ttitem => {
          return ttitem.standardName == item;
        });
        if (rr.length > 0) {
          arr2.push({ name: item || "组合套票", list: rr });
        }
      });
      return arr2;
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.ticket {
  .swipe {
    position: relative;
    .backicon {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      text-align: center;
      line-height: 60px;
      background-color: rgba(0, 0, 0, 0.55);
      color: #fff;
      transform: rotate(180deg);
      font-size: 20px;
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }
    .imgwrao {
      padding-bottom: 65.7%;
      background-size: 100%;
      -webkit-background-size: 100%;
    }
  }
  .scenicspot-trans {
    position: relative;
    z-index: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin: -10px 10px 10px 10px;
    background-color: #fff;
    padding: 10px;
    .scenicname {
      &::after {
        content: "";
        clear: both;
        display: block;
      }
      p {
        float: left;
        text-align: left;
        font-size: 20px;
        height: auto;
        color: #333;
        font-weight: 600;
        overflow: initial;
        white-space: inherit;
        text-overflow: initial;
      }
      i {
        margin-left: 10px;
        float: left;
        line-height: 37px;
      }
    }
    .sceniclocati {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      width: 80%;
      span {
        word-break: normal;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        //  color:#0066CC;
      }
    }
  }
  .tickets {
    .ticket_type {
      background-color: #fff;
      margin-top: 10px;
      & > p {
        padding: 5px;
        font-size: 15px;
        font-weight: 600;
        text-align: left;
        border-bottom: 1px solid #ddd;
        margin: 0px 5px;
      }
    }
  }
  .toknow {
    padding: 10px;
    margin-top: 10px;
    background-color: #fff;
    text-align: left;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .tokonw-st {
      margin-top: 10px;
      .cccc {
        margin-left: 15px;
        p {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
  .includetoknow-cc {
    color: #999;
    margin: 10px 15px 24px;
    border-top: 1px solid #ddd;
    position: relative;
    & > span {
      box-sizing: border-box;
      position: absolute;
      padding: 0 10px;
      top: -10px;
      left: 42%;
      background-color: #fff;
    }
    .complete-know {
      margin-top: 10px;
      text-align: center;
      span {
        color: #5ca2f8;
        position: relative;
        font-size: 13px;
        padding: 8px 15px;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          border: 1px solid #5ca2f8;
          box-sizing: border-box;
          width: 200%;
          height: 200%;
          border-radius: 40px;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
      }
    }
  }
  .includetoknow {
    padding-top: 10px;
    @include flexbox(row, flex-start, center);
    flex-wrap: wrap;
    .konwitem {
      &:nth-child(3n + 1) {
        text-align: left;
      }
      &:nth-child(3n) {
        text-align: right;
      }
      text-align: center;
      box-sizing: border-box;
      padding: 5px 0;
      width: 33%;
    }
  }
  .share {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
.goodstitle {
  text-align: left;
}
</style>
