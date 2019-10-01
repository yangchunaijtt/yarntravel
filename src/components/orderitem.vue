<template>
  <div class="orderitem" @click="gotodetails">
    <div class="titlebar">
      <div class="left">
        <icon name="tickets" scale="2.5"></icon>
        <span>门票</span>
      </div>
      <div class="right">
        {{orderShowstatus}}
      </div>
    </div>
    <div class="ccc">
      <div class="left">
        <h2>{{order.productName}}</h2>
        <p>数量：
          <span>{{order.product.quantity}}份</span>
        </p>
        <p>游玩日期:
          <span>{{order.product.visitDate}}</span>
        </p>
      </div>
      <div class="right">
        <div class="price">
          ￥
          <span>{{order.needPayPrice}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderitem",
  components: {},
  data() {
    return {};
  },
  props: ["order"],
  computed: {
    insertDate() {
      if (this.order) {
        return this.order.insertDate;
      }
    },
    orderShowstatus(){
      if(this.order.status=='CANCEL'){
        return '已取消'
      }

      return this.paymentStatus;
    },
    paymentStatus() {
      if (!this.order) {
        return "未知";
      }
      switch (this.order.paymentStatus) {
        case "UNPAY":
          return "未支付";
          break;
        case "PAYED":
          return "已支付";
      }
    }
  },
  methods: {
    gotodetails() {
      this.$router.push({
        name: "orderdetails",
        query: {
          partnerOrderNo: this.order.partnerOrderNo
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.orderitem {
  background-color: #fff;
  margin-bottom: 10px;
  .titlebar {
    margin: 0 10px;
    border-bottom: 1px solid #ddd;
    padding: 5px 0;
    @include flexbox(row, space-between, center);
    .left {
      @include flexbox(row, space-between, center);
      font-size: 18px;
      span {
        margin-left: 10px;
      }
    }
  }
  .ccc {
    padding: 10px;
    @include flexbox(row, space-between, flex-start);
    .left {
      text-align: left;
      font-size: 18px;
      h2 {
        font-weight: 700;
        padding-bottom: 5px 0;
      }
      p {
        padding-bottom: 5px 0;
        color: #999;
        font-size: 15px;
      }
    }
    .right {
      .price {
        color: orange;
        font-size: xx-small;
        span {
          font-size: 17px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
