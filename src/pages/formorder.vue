<template>
  <div class="formorder"
       ref="formorder">
    <van-nav-bar title="订单填写"
                 fixed
                 left-arrow
                 @click-left="onClickLeft" />

    <div class="content"
         v-show="!dateListIsshow">
      <div class="ticket-info"
           v-if="goodinfo">

        <div class="ticket-it tic">
          <div class="left">
            <p class="title "
               style=" ">
              {{goodinfo.goodsName}}
            </p>
          </div>
          <div class="price pro-price">
            <i>￥</i>
            {{salePrice.payprice}}
          </div>
          <p class="ordertokonw"
             @click="handleopenticketdetails">
            <span>订票须知</span>
            <popticketInfo :ticketinfo="goodinfo"
                           :popshow="mypopshow_father"
                           @handlepopshow="myhandlepopshow"
                           :eleHeight="eleHeight" />
            <icon name="angle-right"
                  style="color:#666" />
          </p>
        </div>
        <div class="ticket-it">
          <div class="leftd">
            <p class="title "
               style=" ">
              数量
            </p>

          </div>
          <div class="price pro-price">
            <van-stepper v-model="ticketnum"
                         @overlimit="handleoverlimt"
                         :min="goodinfo.minimum"
                         :max="goodinfo.maximum"></van-stepper>
          </div>
        </div>
      </div>
      <p style="background:#fff; text-align:left;padding-top:5px;padding-left:10px;">游玩日期</p>
      <div class="choosedate">

        <div class="dateitem"
             @click="chooseCurrentDate(0)"
             :class="{'choosedateitem':currentChooseIndex==0,'unable':getcorrespondingPrice(p_formatDate(0,'YYYY-MM-DD'))=='不可订'}">
          <p>今天{{p_formatDate(0)}}</p>
          <p>￥{{getcorrespondingPrice(p_formatDate(0,'YYYY-MM-DD')) }}</p>
        </div>
        <div class="dateitem"
             @click="chooseCurrentDate(1)"
             :class="{'choosedateitem':currentChooseIndex==1,'unable':getcorrespondingPrice(p_formatDate(1,'YYYY-MM-DD'))=='不可订'}">
          <p>明天{{p_formatDate(1)}}</p>
          <p>￥{{getcorrespondingPrice(p_formatDate(1,'YYYY-MM-DD')) }}</p>
        </div>
        <div class="dateitem"
             @click="chooseCurrentDate(2)"
             :class="{'choosedateitem':currentChooseIndex==2,'unable':getcorrespondingPrice(p_formatDate(2,'YYYY-MM-DD'))=='不可订'}">
          <p>后天{{p_formatDate(2)}}</p>
          <p>￥{{getcorrespondingPrice(p_formatDate(2,'YYYY-MM-DD')) }}</p>
        </div>
        <div class="dateitem moredate"
             @click="showCalendar"
             :class="{'choosedateitem':currentChooseIndex==3}">
          <p>{{currentshowChoose.date}}</p>
          <p>{{currentshowChoose.price}}</p>
        </div>
      </div>

      <!-- {{traversInfo}} -->
      <!-- <div class="peopleinfo">
        <p>预定人信息</p>
        <van-field v-model="passenger.name" required label="用户名"  placeholder="请输入联系人姓名"></van-field>
        <van-field v-model="passenger.mobile" required label="手机号" placeholder="请输入手机号"></van-field>
        <van-field v-model="passenger.credentials" required label="身份证" placeholder="请输入证件号码"></van-field>
      </div> -->
      <div class="discountactivity"
           v-if="activityInfoShow">
        <p class="title"> <span>优惠</span></p>
        <div class="cont">
          <span class="tip">减</span>
          <span class="countdetails">下单立减{{goodinfo.activityInfo.number}}元</span>
        </div>
      </div>
      <div class="travelpeople"
           v-if="goodinfo">
        <travelpeopleList @isError="getisErrors"
                          :traveller="goodinfo.traveller"
                          :travelpeoplenums="ticketnum" />
      </div>
      <van-submit-bar :disabled="canSubmit"
                      label="折扣价"
                      :price="discountPrice"
                      button-text="提交订单"
                      @submit="onSubmit">
        <div class="le">
          <span>原价：</span>
          <span class="org-price">&nbsp;￥{{totalPrice/100+"&nbsp;"}}</span>
        </div>
      </van-submit-bar>
    </div>
    <p-calendar :priceList="priceList"
                :choosedArray="pdate"
                :visable="dateListIsshow"
                @hiddencandendar="hiddenCandendar"
                @getClickDate="getDate"></p-calendar>
  </div>
</template>

<script>
Number.prototype.toCeil = function(num) {
  return Math.ceil(this * Math.pow(10, num)) / Math.pow(10, num);
};
Number.prototype.toRound = function(num) {
  return Math.round(this * Math.pow(10, num)) / Math.pow(10, num);
};
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import moment from "moment";
import popticketInfo from "../components/popticketInfo";
import travelpeopleList from "../components/travelpeopleList";
import pcalendar from "../components/pcalendar.vue";
import {
  Icon,
  Toast,
  NavBar,
  Popup,
  DatetimePicker,
  SubmitBar,
  Field,
  Cell,
  CellGroup,
  Stepper,
  Dialog
} from "vant";
import { $axios } from "../utils/axios";
moment.locale("zh-cn", {
  weekdays: "周日_周一_周二_周三_周四_周五_周六".split("_")
});

export default {
  name: "formorder",
  components: {
    "van-nav-bar": NavBar,
    "van-cell": Cell,
    "van-cell-group": CellGroup,
    "van-stepper": Stepper,
    "van-field": Field,
    "van-submit-bar": SubmitBar,
    "van-popup": Popup,
    "van-datetime-picker": DatetimePicker,
    "p-calendar": pcalendar,
    travelpeopleList: travelpeopleList,
    "van-icon": Icon,
    popticketInfo: popticketInfo
  },
  data() {
    return {
      istravelError: false,
      mypopshow_father: false,
      eleHeight: 0,
      currentshowChoose: {
        date: "更多日期",
        price: ""
      },
      currentChooseIndex: -1, //选择日期框
      // traveldate: "",
      salePrice: null, //提交给对象
      dateListIsshow: false, //日历显示
      pdate: {
        start: {
          year: moment().format("YYYY"),
          month: moment().format("MM"),
          date: moment().format("DD")
        },
        end: {
          year: -1,
          month: -1,
          date: -1
        }
      },
      priceList: null,
      proId: "",
      goodinfo: null,
      ticketDate: moment().format("YYYY-MM-DD"),
      // canSubmit: false,
      chooseDate: "",
      datepopshow: false,
      ticketnum: 1,
      traveldate: "",
      passengername: "",
      minDate: new Date(),
      passenger: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    Toast.loading({ duration: 0, forbidClick: true, message: "加载中...." });
    // const goodinfo = JSON.parse(to.query.goods);
    const _id = to.query.id;
    const goodsid = to.query.goodsid;
    const proId = to.query.product;
    console.log("商品信息", to);
    //const goodinfo=res_goodinfo.data.data;
    const getalldateList = function() {
      const firstmonth = {
        startdate: moment("2018-07-16")
          // .subtract(1, "days")
          // .startOf("month")
          .format("YYYY-MM-DD"),
        enddate: moment()
          .endOf("month")
          .format("YYYY-MM-DD")
      };
      const secondmonth = {
        startdate: moment()
          .add(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD"),
        enddate: moment()
          .add(1, "months")
          .startOf("month")
          .endOf("month")
          .format("YYYY-MM-DD")
      };
      const threadmonth = {
        startdate: moment()
          .add(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD"),
        enddate: moment()
          .add(2, "months")
          .startOf("month")
          .endOf("month")
          .format("YYYY-MM-DD")
      };
      return [firstmonth, secondmonth, threadmonth];
    };

    console.log("before");

    const all_a = getalldateList();

    const getPricelist = function() {
      const axiosList = [];
      if (goodsid != null) {
        for (let item of all_a) {
          axiosList.push(
            $axios.get(
              `api/LvmamaScenicTickets/ScenicAllXml/GetGoodsPricesByDateRange/${proId}-${goodsid}/${
                item.enddate
              }`
            )
          );
        }
      }
      return axiosList;
    };
    const getgoodinfo = $axios.get(
      `api/LvmamaScenicTickets/GoodsLocalInfos/GetGoodsInfos/${_id}`
    );
    $axios.all([...getPricelist(), getgoodinfo]).then(
      $axios.spread((...d) => {
        const pricelist = [...d];
        const res_goodinfo = pricelist.pop();
        const goodinfo = res_goodinfo.data.data;
        console.log("获取的价格", pricelist);
        console.log("获取的商品信息", goodinfo);
        const dd = [];
        for (let it of pricelist) {
          console.log("批量获取价格", it.data);
          if (it.data) {
            if (it.data.goods.prices) {
              dd.push(...it.data.goods.prices.price);
            }
          }
        }
        console.log(dd); //这里是价格数组==》变成map方便调用;
        const m = new Map();
        for (let ii of dd) {
          m.set(ii.date, {
            aheadHour: ii.aheadHour,
            // b2bPrice: ii.b2bPrice,
            sellPrice: ii.sellPrice,
            stock: ii.stock,
            marketPrice: ii.marketPrice,
            price: ii.onlinePrice
          });
        }
        next(vm => {
          vm.priceList = m;
          vm.proId = proId;
          vm.goodinfo = goodinfo;
          vm.salePrice = { payprice: goodinfo.nowPrice };
          console.log("批量价格", vm.priceList);
          const pricedatelist = [...vm.priceList.keys()];
          console.log("99999999", pricedatelist[0]);
          vm.pdate = {
            start: {
              year: parseInt(moment(pricedatelist[0]).format("YYYY")),
              month: parseInt(moment(pricedatelist[0]).format("MM")),
              date: parseInt(moment(pricedatelist[0]).format("DD"))
            },
            end: {
              year: -1,
              month: -1,
              date: -1
            }
          };
          Toast.clear();
        });
      })
    );
  },
  mounted() {
    this.clearTravelinfo(); //清除旅游人数信息
    console.log("DDDDD", this.$refs.formorder.offsetHeight);
    this.eleHeight = this.$refs.formorder.offsetHeight;
  },
  computed: {
    canSubmit() {
      return !this.istravelError;
    },
    tokenparams() {
      return `?token=${this.$cookie.get("USERIDGDLY")}|${this.$cookie.get(
        "usersecret"
      )}|${this.$cookie.get("gdmobileuserphone")}|${this.$cookie.get("WHERE")}`;
    },

    ...mapState({
      traversinfo: "traversInfo"
    }),
    totalPrice() {
      //没有打折的价格
      if (this.salePrice) {
        //市场价
        return this.salePrice.payprice * this.ticketnum * 100;
      } else {
        return 0;
      }
    },
    activityInfoShow() {
      if (!this.goodinfo) {
        return false;
      }
      if (this.goodinfo.activityInfo.number) {
        return true;
      } else {
        return false;
      }
    },
    discountPrice() {
      //折扣价
      if (!this.goodinfo) {
        return 0;
      }
      const officaldispirice = this.goodinfo.activityInfo.number || 0;
      // console.log('csPrice',(
      //   (this.totalPrice - officaldispirice * this.ticketnum * 100) *
      //   0.997
      // ).toCeil(0)/100)
      let tmpPrice =
        ((this.salePrice.payprice - officaldispirice) * 100 * 0.997).toRound(
          0
        ) * this.ticketnum;
      return tmpPrice;
      // return 1;
    },
    orderAmount() {
      //提交给驴妈妈的价格
      if (this.salePrice) {
        return this.salePrice.sellprice * this.ticketnum * 100;
      } else {
        return 0;
      }
    }
  },
  methods: {
    getisErrors(err) {
      console.log("验证", err);
      this.istravelError = err;
    },
    ...mapMutations({
      clearTravelinfo: "CLEARTRAVELERS"
    }),
    myhandlepopshow(v) {
      this.mypopshow_father = v;
      console.log("父组件", this.mypopshow_father);
      console.log("父组件", this);
    },
    getSalePrice(o) {
      // const dd = o.b2bPrice - o.sellPrice;
      // if (dd > 0) {
      //   return { payprice: o.b2bPrice, sellprice: o.sellPrice };
      // } else {
      //   return { payprice: o.marketPrice, sellprice: o.sellPrice };
      // }
      return {
        payprice: o.price,
        sellprice: o.sellprice,
        marketPrice: o.marketPrice
      };
    },
    handleopenticketdetails() {
      this.mypopshow_father = true;
    },
    handleoverlimt() {
      console.log(this.traversinfo);
      Toast(
        `最少预定${this.goodinfo.minimum}张,最多预定${this.goodinfo.maximum}张`
      );
    },
    chooseCurrentDate(n) {
      if (
        this.getcorrespondingPrice(this.p_formatDate(n, "YYYY-MM-DD")) ==
        "不可订"
      ) {
        return;
      }
      this.currentChooseIndex = n;
      this.currentshowChoose = {
        date: "更多日期",
        price: ""
      };
      this.pdate = {
        start: {
          year: parseInt(
            moment()
              .add(n, "days")
              .format("YYYY")
          ),
          month: parseInt(
            moment()
              .add(n, "days")
              .format("MM")
          ),
          date: parseInt(
            moment()
              .add(n, "days")
              .format("DD")
          )
        },
        end: {
          year: -1,
          month: -1,
          date: -1
        }
      };
      this.salePrice = this.getSalePrice(
        this.priceList.get(
          moment()
            .add(n, "days")
            .format("YYYY-MM-DD")
        )
      );
      this.traveldate = moment()
        .add(n, "days")
        .format("YYYY-MM-DD");
      // 需要验证价格的哦
    },
    getDate(d) {
      console.log("获取价格", d);
      //判读当前 的选择时间是否是今/明/后
      const traveldate = moment(
        `${d.start.year}/${d.start.month}/${d.start.date}`
      ); //当前选择的日期；
      console.log("是否今天", traveldate.isSame(moment(), "day"));
      if (traveldate.isSame(moment(), "day")) {
        this.currentChooseIndex = 0;
        this.currentshowChoose = {
          date: "更多日期",
          price: ""
        };
      } else if (traveldate.isSame(moment().add(1, "days"), "day")) {
        this.currentChooseIndex = 1;
        this.currentshowChoose = {
          date: "更多日期",
          price: ""
        };
      } else if (traveldate.isSame(moment().add(2, "days"), "day")) {
        this.currentChooseIndex = 2;
        this.currentshowChoose = {
          date: "更多日期",
          price: ""
        };
      } else {
        // console.log("更多日期",this.getSalePrice(
        //       this.priceList.get(traveldate.format("YYYY-MM-DD"))
        //     ))
        this.currentChooseIndex = 3;
        this.currentshowChoose = {
          date: traveldate.format("dddd MM-DD"),
          price:
            "￥" +
            this.getSalePrice(
              this.priceList.get(traveldate.format("YYYY-MM-DD"))
            ).payprice
          // this.priceList.get(traveldate.format("YYYY-MM-DD")).marketPrice
        };
      }
      this.traveldate = traveldate.format("YYYY-MM-DD");
      this.salePrice = this.getSalePrice(
        this.priceList.get(traveldate.format("YYYY-MM-DD"))
      ); // .marketPrice;
      console.log(this.traveldate);
    },
    hiddenCandendar() {
      this.dateListIsshow = false;
      // this.totashohw = true;
    },
    showCalendar() {
      //显示日历
      this.dateListIsshow = true;
      // this.currentChooseIndex = 3;
    },
    getcorrespondingPrice(date) {
      if (this.priceList) {
        return this.priceList.get(date)
          ? this.getSalePrice(this.priceList.get(date)).payprice //.marketPrice
          : "不可订";
      } else {
        return "不可订";
      }
    },
    p_formatDate(n, style = "MM-DD") {
      return moment()
        .add(n, "days")
        .format(style);
    },
    enterDate(v) {
      this.datepopshow = false;
      this.ticketDate = moment(v).format("YYYY-MM-DD");
    },
    tochooseDate() {
      this.datepopshow = true;
    },
    async onSubmit() {
      for (let item of this.istravelError) {
        await item.validate();
        if (item.errors.any()) {
          Toast("请正确填写游客信息");
          return;
        }
      }
      if (this.traveldate === "") {
        Toast("请选择游玩日期");
        return;
      }

      console.log("travelers", this.traveldate);
      const creatorderparams = {};
      creatorderparams.orderAmount = this.orderAmount / 100; //提交给驴妈妈的总价
      // creatorderparams.partnerOrderNo="tst10086";

      creatorderparams.product = {
        productId: this.proId,
        goodsId: this.goodinfo.goodsId,
        quantity: this.ticketnum,
        sellPrice: this.salePrice.sellprice, //提交给驴妈妈的单价
        visitDate: this.traveldate
      };
      creatorderparams.booker = this.traversinfo[0];
      creatorderparams.travellers = this.traversinfo;

      console.log("========================");
      console.log(creatorderparams);
      console.log("========================");
      // return;
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      console.log("提交参数", JSON.stringify({ orderInfo: creatorderparams }));
      // return;
      const _userid = this.$cookie.get("userid") || 0;
      this.$axios
        .post(
          `api/LvmamaScenicTickets/ScenicOrders/ScenicCreateOrder/${_userid}${
            this.tokenparams
          }`,
          { orderInfo: creatorderparams }
        )
        .then(res => {
          console.log(res);
          //提交订单的结果
          if (res.data.code === "1000") {
            //创建订单成功 ==>支付
            Toast.clear();
            // this.$router.push({
            //   name: "pay",
            //   query: {
            //     goodsname: this.goodinfo.goodsName,
            //     payprice: this.totalPrice / 100,
            //     orderno: res.data.data.partnerOrderNo,
            //     eid: res.data.data.orderId, //驴妈妈返回的订单id
            //     traveldate: this.traveldate,
            //     lastpaytime: res.data.data.waitPaymentTime
            //   }
            // });
            window.location.href = `../pay/ticketpay.html?#/?goodsname=${
              this.goodinfo.goodsName
            }&payprice=${(this.discountPrice / 100).toRound(2)}&orderno=${
              res.data.data.partnerOrderNo
            }&eid=${res.data.data.orderId}&traveldate=${
              this.traveldate
            }&lastpaytime=${res.data.data.waitPaymentTime}`;
          } else {
            //创建订单失败
            Toast.clear();
            Dialog.alert({
              title: "错误",
              message: res.data.errorMessage
            });
          }
        })
        .catch(err => {
          Toast.clear();
          Dialog.alert({
            title: "错误",
            message: "下单失败，请检查网络。"
          });
        });

      // {
      //     "orderInfo":{
      //         "partnerOrderNo":"4545455",
      //         "orderAmount":"124.0",
      //         "product":{
      //             "productId":"89355",
      //             "goodsId":"567249",
      //             "quantity":"2",
      //             "sellPrice":"100",
      //             "visitDate":"2012-05-04"
      //         },
      //         "booker":{
      //             "name":"测试",
      //             "mobile":"13800000000",
      //             "email":"test@lvmama.com"
      //         },
      //         "travellers":[
      //             {
      //                 "name":"测试",
      //                 "enName":"ceshi",
      //                 "mobile":"13800000000",
      //                 "email":"test@lvmama.com",
      //                 "birthday":"2000-12-12",
      //                 "credentials":"411522219883423782",
      //                 "credentialsType":"ID_CARD"
      //             }
      //         ]
      //     }
      // }
    },
    onClickLeft() {
      if (this.dateListIsshow) {
        this.dateListIsshow = false;
        // this.currentChooseIndex=-1;
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.formorder {
  padding-top: 45px;
  box-sizing: border-box;
  .content {
    padding: 10px;
    padding-bottom: 80px;
  }
  .choosedate {
    font-size: 0.4rem /* 15/37.5 */;
    padding: 10px 10px;
    background-color: #fff;
    // margin-top: 5px;
    height: 1.76rem /* 66/37.5 */;
    @include flexbox(row, flex-start, center);

    .dateitem {
      &:last-child {
        margin-right: 0;
      }
      height: 100%;
      flex: 1;
      margin-right: 5px;
      border-radius: 5px;
      padding: 3px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      p {
        font-size: 0.32rem /* 12/37.5 */;
      }
    }
    .choosedateitem {
      border: 1px solid orange;
    }
    .unable {
      color: #ddd;
    }
    .moredate {
      // line-height: 40px;
      flex: 1.25;
    }
  }
  .ticket-info {
    background-color: #fff;
    margin-top: 10px;
    .ordertokonw {
      color: #666;
      span {
        font-size: 12px;
      }
      i {
        line-height: 10px;
      }
    }
    .tic {
      flex-wrap: wrap;
      .left {
        width: 50%;
      }
      .price {
        // width: 50%;
      }
    }
    .ticket-it {
      padding: 5px 20px;
      border-bottom: 1px solid #ddd;
      @include flexbox(row, space-between, center);
      text-align: left;
      .left {
        width: 70%;
        .title {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .price {
        font-weight: 700;
        font-size: 0.533333rem;
      }
    }
  }
  .peopleinfo {
    margin-top: 20px;
    text-align: left;
    p {
      margin-left: 10px;
      margin-bottom: 10px;
    }
  }
}
.le {
  .org-price {
    text-decoration: line-through;
  }
}
.discountactivity {
  border-radius: 5px;
  background-color: #fff;
  margin-top: 10px;
  padding: 10px;
  .title {
    text-align: left;
    color: #333;
  }
  .cont {
    text-align: left;
    margin: 15px 0;
    .tip {
      color: orange;
      border: 1px solid orange;
      font-size: 12px;
      padding: 2px;
      border-radius: 3px;
    }
    .countdetails {
      margin-left: 10px;
      color: #444;
    }
  }
}
</style>
