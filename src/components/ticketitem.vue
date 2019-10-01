<template>
  <div class="ticketitem">
    <div class="item" @click="getmoretickets">
      <div class="test-name" style="max-width: 70%;
      ">
        <slot name="title">title</slot>
      </div>
      <div class="t-more-price">
        <span class=" prcie pro-price">
          <i class="tag1">￥</i>{{lowestprice}}
          <i class="tag2">起</i>
        </span>
        <icon class="vant-icon " :class="{'ralote':detailsshow,'ralote-f':!detailsshow}" name="arrow-cri" scale="2"></icon>
      </div>

    </div>
    <transition name="more" >
      <div class="moredetails" v-show="detailsshow" ref="moredetails">
        <div class="moredetails-item" @click="getticketInfo(item)" v-for="(item,index) in tickettypeList" :key="index">
          <div class="text">
            <p>
              {{item.goodsName}}
            </p>
            <p>
              <span class="tip" v-if="item.rules">{{item.rules.rule.isChange=='true'?'可退':'不可退'}}</span>
            </p>
            <p class="tip" v-if="item.notice">
              {{item.notice.effectiveDesc}}
            </p>
            <p class="tip">订票须知
              <icon class="vant-icon " name="angle-right" /> </p>
          </div>
          <div class="price-butt">
            <p>
              <span class=" prcie pro-price">
                <i class="tag1">￥</i>{{item.nowPrice}}
                <i class="tag2">起</i>
              </span>
              <span class="discount" v-if="item.activityInfo.shortName">{{item.activityInfo.shortName}}</span>
            </p>
            <div class="orderbutton" @click.stop="toformorder(item)">预定</div>
          </div>
        </div>
      </div>
    </transition>

    <van-popup v-model="ticketinfopopshow" class="ticketinfopop" position="bottom">
      <div class="tiketinfo">
        <div class="p-titleee">

        </div>
        <div class="sc" v-if="ticketmoredetails">
          <div class="notice">
            <p class="p-ttt">费用包含</p>
            <p>{{ticketmoredetails.costInclude}}</p>

          </div>
          <div class="notice">
            <p class="p-ttt">费用不包含</p>
            <p>{{costNoInclude}}</p>

          </div>
          <div class="notice">
            <p class="p-ttt">预定时间</p>
            <p>{{passTimeLimit}}</p>
          </div>
          <div class="notice">
            <p class="p-ttt">
              入圆须知
            </p>
            <div>

              <p>入园时间：{{ticketmoredetails.notice.enterLimit.limitTime}}</p>
              <p>入园地点：{{ticketmoredetails.notice.getTicketPlace}}</p>
              <p>取票时间:{{ticketmoredetails.notice.getTicketTime}}</p>
              <p>取票地点:{{ticketmoredetails.notice.getTicketPlace}}</p>
              <p>入园方式：{{ticketmoredetails.notice.ways}}</p>
            </div>
          </div>
          <div class="notice">
            <p class="p-ttt">
              重要提示
            </p>
            <p>{{ticketmoredetails.importantNotice}}</p>

          </div>
          <div class="notice">
            <p class="p-ttt">
              退票规则
            </p>
            <p>{{ticketmoredetails.refundRuleNotice}}</p>

          </div>
          <div class="notice">
            <p class="p-ttt">
              改期规则
            </p>
            <p>本商品一经过预订不支持改期（可退款的商品可申请退款后重新下单）</p>

          </div>
        </div>
        <van-submit-bar v-if="ticketmoredetails" label="在线付" :price="ticketmoredetails.nowPrice*100" button-text="立即预定" @submit="toformorder(ticketmoredetails)">
          <div class="more-info" slot="default">
           <span class="share-bar"  @click="handleshareTicketItem(ticketmoredetails)">
            分享
          </span>
          <span  class="marketprice">
            原价:￥{{ticketmoredetails.nowMPrice}}
          </span>
         
          </div>
        </van-submit-bar>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Validator } from "vee-validate";

import { Icon, Toast, Popup, SubmitBar } from "vant";
import { $axios } from "../utils/axios";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "ticket-item",
  data() {
    return {
      ticketinfopopshow: false,
      detailsshow: false,
      ticketmoredetails: null
    };
  },
  props: {
    tickettypeList: {
      type: Array
    },
    productId: {
      type: String,
      default: ""
    }
  },

  components: {
    "van-icon": Icon,
    "van-popup": Popup,
    "van-submit-bar": SubmitBar
  },
  computed: {
    // ...mapState({
    //   productId:state=>state.productID,
    // }),
    passTimeLimit() {
      try {
        return `预定${
          this.ticketmoredetails.passTimeLimit.passLimit.passLimitTime
        }分后才可入园`;
      } catch (err) {
        return "";
      }
    },
    costNoInclude() {
      try {
        return this.ticketmoredetails.costNoInclude;
      } catch (error) {
        return "暂无";
      }
    },
    canbuyToday() {
      // $axios
      //   .post(
      //     `api/LvmamaScenicTickets/ScenicAllXml/GetGoodsPricesByDateRange/${
      //       this.productId
      //     }-${goodsId}/${beginDate}-${endDate}`,
      //     {}
      //   )
      //   .then(res => {});
    },
    lowestprice() {
      this.tickettypeList.sort((a, b) => {
        return a.nowPrice - b.nowPrice;
      });
      return this.tickettypeList[0].nowPrice;
    }
  },
  mounted() {},
  methods: {
    // canChange(item){
    //   item.
    // },
    handleshareTicketItem(item){
      console.log(item);
      this.$emit('share',item);
    },
    toformorder(it) {
      console.log("门票的信息", it.productId);
      console.log("门票的信息", it.goodsId);
      this.$router.push({
        name: "formorder",
        query: {
          id: it.id,
          goodsid: it.goodsId,
          product: it.productId
        }
      });
    },
    getticketInfo(ytt) {
      console.log("订票须知", ytt);
      this.ticketmoredetails = ytt;
      this.ticketinfopopshow = true;
      console.log("ticketmoredetails", this.ticketmoredetails);
    },
    getmoretickets() {
      this.detailsshow = !this.detailsshow;
      const ele = this.$refs.moredetails;
      if(this.detailsshow){
        // ele.style.height='0px';
      }
      // if (this.detailsshow) {

      //   const ff=window.getComputedStyle(ele).height;
      //   // this.$refs.moredetails.style.height = "200px";
      //   // ele.style.height='0px';
      //   ele.style.height='0px';
      //   ele.style.height='auto';
      //   setTimeout(() => {
      //   const targetheight=window.getComputedStyle(ele).height;
      //   console.log('ff',targetheight);
      //     ele.style.height ='0px';
      //     ele.offsetWidth
      //     ele.style.height =targetheight;
      //   // ele.style.height='auto';
      //   }, 0);
      //   console.log('ff',ff);
      // }
      // this.funTransitionHeight(this.$refs.moredetails,1000)
    },
    // beforeEnter(el){
    //   // el.style.height='0px';
    //   // console.log(window.getComputedStyle(el).height );
     
    // },
    // enter(el){
    //   el.style.transition=`all 0.5s ease 0s`;
    //   // console.log(window.getComputedStyle(el).height );
    //   el.style.maxHeight='0';
    // },
    // afterEnter(el){
    //   // console.log(window.getComputedStyle(el).height );
    //   // const target=window.getComputedStyle(el).height;
    //   //  el.style.height=window.getComputedStyle(el).height;
    //    el.style.maxHeight='500px';
    //   // console.log('2');
    // },
    // beforeLeave(el){
    //   // el.style.height='0px';
    // }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.ticketitem {
  background-color: #fff;
  .item {
    position: relative;
    box-sizing: border-box;
    padding: 0.266667rem 0.133333rem;
    @include flexbox(row, space-between, center);
    .t-more-price {
      @include flexbox(row, center, center);
    }
  }
  .vant-icon {
    margin-left: 0.266667rem;
    // transform: rotate(90deg);
  }
  .moredetails {
    overflow: hidden;
    background-color: #fbfbfd;
  }
  .moredetails-item {
    padding: 0.266667rem;
    @include flexbox(row, space-between, center);
    .text {
      text-align: left;
      flex: 2;
      .tip {
        margin: 0.133333rem 0;
        color: #666;
        font-size: 0.346667rem;
      }
    }
    .price-butt {
      text-align: right;
      flex: 1;
      // padding: .133333rem /* 5/37.5 */ .266667rem /* 10/37.5 */;
      color: #fff;
      .orderbutton {
        float: right;
        width: 1.6776rem;

        // margin-left: 1.6776rem /* 62.91/37.5 */ /* 57/37.5 */;
        text-align: center;
        padding: 0.08rem 0.133333rem;
        border-radius: 0.133333rem;
        background: orange;
      }
    }
  }
}
.ticketinfopop {
  text-align: left;
  background-color: #fff;
  width: 100%;
  height: 80%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  .tiketinfo {
    padding: 20px;
    padding-bottom: 60px;
    height: 100%;
    box-sizing: border-box;
  }
  .sc {
    padding-bottom: 20px;
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 50px;
    .notice {
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }
    p {
      margin: 3px 0;
      font-size: 12px;
      color: #666;
      line-height: 0.4rem;
      position: relative;
    }
    .p-ttt {
      font-size: 13px;
      color: #333;
      margin-bottom: 3px;
      font-weight: 600;
    }
  }
}
.prcie {
  display: block;
  font-weight: 700;
  font-size: 0.533333rem;
  i {
    font-size: 0.32rem;
  }
  .tag2 {
    color: #999;
  }
}
.discount {
  color: #d30775;
  font-size: 13px;
}
.ralote {
  transform: rotate(180deg);
  transition: all 0.5s;
}
.ralote-f {
  transform: rotate(0deg);
  transition: all 0.5s;
}

//===================================
.movedown-enter-active,
.movedown-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
}
.movedown-enter {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
  transition: opacity 0.5s;
}
.movedown-leave-active {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}
.marketprice {
  color: #999;
  font-size: 12px;
}

.more-enter,.more-leave-to{
  max-height: 0px;
}
.more-enter-to,.more-leave{
  max-height: 500px;
}
.more-enter-active,.more-leave-active{
  transition: all 0.5s ease;
}
.more-info{
  height: 100%;
  line-height: 50px;
  .share-bar{
    font-size: .533333rem /* 20/37.5 */;
    color: orange;
    // margin-left: 10px;
    border:1px solid orange;
   padding:  .133333rem /* 5/37.5 */;
   border-radius: 3px;
   box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
}
</style>
