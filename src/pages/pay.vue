<template>
  <div class="pay" v-if="payqueryinfo">
    <van-nav-bar title="订单支付" left-arrow @click-left="onClickLeft" />
    <div class="brief">
      <p class="price">
        <span>在线支付:</span>
        <span class="num">￥{{payqueryinfo.payprice}}</span>
      </p>
      <p class="time">
        <span>剩余支付时间:</span>
        <span class="left">{{countTime}}</span>
      </p>
    </div>
    <div class="details">
      <p class="info">
        <span>订单号：</span>
        <span>{{payqueryinfo.orderno}}</span>
      </p>
      <p class="info">
        <span>产品名称：</span>
        <span>{{payqueryinfo.goodsname}}</span>
      </p>
      <p class="info">
        <span>游玩时间：</span>
        <span>{{payqueryinfo.traveldate}}</span>
      </p>
      <p class="info">
        <span>订单金额：</span>
        <span>￥{{payqueryinfo.payprice}}(在线支付)</span>
      </p>
    </div>
    <van-submit-bar :price="payqueryinfo.payprice*100" button-text="支付" @submit="onSubmit" />
  </div>
</template>

<script>
import { $axios } from "../utils/axios";
import { NavBar, SubmitBar } from "vant";
import moment from "moment";
export default {
  components: {
    "van-nav-bar": NavBar,
    "van-submit-bar": SubmitBar
  },
  data() {
    return {
      
      timid: "-1", //循环的id;
      countTime: "HH:MM:SS", //倒计时
      paytitle: "门票预定",
      // orderno:'',//自己订单号，
      sign: "",
      guestIp: "",
      payqueryinfo: null
    };
  },
  methods: {
    onSubmit(){
      //支付
      BC.click({
        title: this.paytitle,
        amount:this.payqueryinfo.payprice*100, 
        out_trade_no: this.payqueryinfo.orderno,
        sign: this.sign,
        debug:true,
        return_url:
          "http://m.czgdly.com/transportation/airplane/Beecloud/html/paysuccess.html", //需要替换//http://m.czgdly.com/airplane/FlightTickets/#/list
        optional: {
          customerId: this.$cookie.get("USERIDGDLY"),
          customerSource: this.$cookie.get("WHERE"),
          orderId: this.payqueryinfo.eid,
            // mainOrderNo: this.mainorderno
        },
        analysis: {
          ip: this.guestIp
        },
        openid: this.$cookie.get('WXOPID'),
      });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    countDown(time) {
      //倒计时
      if (moment().diff(time) / 1000 >= 0) {
        clearInterval(this.timid);
        console.log("订单已经超时");
      }
      let sec = Math.floor(Math.abs(moment().diff(time) / 1000)); //获得秒数
      let hh =
        Math.floor(sec / 3600) >= 10
          ? Math.floor(sec / 3600)
          : "0" + Math.floor(sec / 3600);
      let mm =
        Math.floor((sec % 3600) / 60) >= 10
          ? Math.floor((sec % 3600) / 60)
          : "0" + Math.floor((sec % 3600) / 60);
      let ss =
        (sec % 3600) % 60 >= 10 ? (sec % 3600) % 60 : "0" + (sec % 3600) % 60;
      // console.log("ss", sec);
      this.countTime = `${hh}:${mm}:${ss}`;
      return `${hh}:${mm}:${ss}`;
    }
  },
  beforeDestroy(){
    clearInterval(this.timid);
  },
  beforeRouteEnter: (to, from, next) => {
    const payquery = to.query;
    console.log(payquery);
    const title = "门票预定";
    const orderno = payquery.orderno; //自己订单号码
    // let eid = to.query.OrderId;
    const amount = payquery.payprice*100; // to.query.price ; //价格
    console.log('金额',amount);
    const gd_paysignurl =
      "http://m.czgdly.com/transportation/airplane/Beecloud/gettestsign.asp"; //光大的
    const wd_paysignurl =
      "http://m.czgdly.com/transportation/gdtrain/Beecloud/getsign.asp"; //万达的
    let paysignurl = "";
    if (location.hostname == "m.wandaly.net") {
      paysignurl = wd_paysignurl;
    } else {
      paysignurl = gd_paysignurl;
    }
    const getIp = function() {
      return $axios.get(
        "http://m.czgdly.com/transportation/airplane/beecloud/getCurrentIp.asp"
      );
    };
    const getSign = function(t_title, t_orderno, t_price) {
      return $axios.get(paysignurl, {
        params: {
          title: t_title,
          amount: amount, //amount
          orderno: t_orderno
        }
      });
    };

    $axios.all([getIp(), getSign(title, orderno, amount)]).then(
      $axios.spread((ip, sig) => {
        console.log("ip", ip.data);
        console.log("sign", sig);
        next(vm => {
          // Indicator.close();
          // vm.eid = eid;
          // vm.orderno = orderno;
          vm.sign = sig.data;
          vm.guestIp = ip.data;
          vm.payqueryinfo = payquery;
          console.log(vm.countDown(payquery.lastpaytime));
          // vm.createtime = parseInt(to.query.createtime);
          // console.log("时间",vm.createtime);
          vm.timid = setInterval(() => {
            vm.countDown(payquery.lastpaytime);
          }, 1000);
        });
      })
    );
  }
};
</script>

<style lang="scss">
.pay {
  // background-color: #fff;
  color: #999;
  p {
    text-align: left;
  }
  .brief {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    p {
      margin-bottom: 10px;
    }
    .price {
      span {
        font-size: 18px;
      }
      .num {
        color: orange;
      }
    }
    .time {
      .left {
        color: orange;
      }
    }
  }
  .details {
    background-color: #fff;
    padding: 10px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
