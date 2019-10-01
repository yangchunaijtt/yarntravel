<template>
  <div class="rec-item" @click="gotodetails">
    <div class="prodic">
      <div class="imgwrap" v-lazy:background-image="getimgShow(recommendpro.images)">
      </div>
      <div class="cc">
        <div class="left">
          <p class="van-ellipsis p-title" v-html="recommendpro.productName"/>
          <p class="property">
            <span class="tag-1" v-if="recommendpro.productTheme[0]">{{recommendpro.productTheme[0]}}</span>
            <span class="tag-2" v-if="recommendpro.productTheme[1]">{{recommendpro.productTheme[1]}}</span>
          </p>
          <p class="evaluate">95%满意度</p>
          <!-- <p class="loc" v-if="recommendpro.scenicInfos">{{recommendpro.scenicInfos.placeProvince+' '+recommendpro.scenicInfos.placeCity}}</p> -->
        </div>
        <div class="right">
          <p class="pro-price">
            <i>￥</i>
            {{recommendpro.minPrice}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Card } from "vant";
export default {
  name: "recommendpro",
  data() {
    return {
      imageURL:
        "https://pics.lvjs.com.cn/pics//uploads/pc/place2/2016-08-23/d816fb18-a02d-45c9-84d7-08acc0e33bdd_480_320.jpg"
    };
  },
  components: {
    "van-card": Card
  },
  props: {
    recommendpro: {
      type: Object
    }
  },
  mounted() {
    console.log("产品信息", this.recommendpro);
  },
  methods: {
    
    getimgShow(imgs){
      const count=imgs.length;
      if(count==0){
        return ''
      }else {
        // const num=(Math.random()*(count-1)).toFixed(0);
        // console.log("随机的数",num);
       return imgs[(new Date()).getDate()%(count-1)];

        // return imgs[num];
      }
    },
    gotodetails() {
      // console.log(this.recommendpro);
      // debugger;
      this.$router.push({
        name: "ticket",
        query: {
          id: this.recommendpro.id
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.rec-item{
  border-bottom: 1px solid #ddd;
}
.prodic {
  box-sizing: content-box;
  padding: 0.266667rem;
  height: 2.053333rem;
  position: relative;
  padding-left: 3.066667rem;
  .imgwrap {
    width: 2.533333rem;
    height: 100%;
    // height: 2.053333rem;
    background-size: 2.533333rem 2.053333rem;
    background-repeat: no-repeat;
    position: absolute;
    top: 0.266667rem;
    left: 0.266667rem;
  }
  .cc {
    height: 100%;
    // height: 2.053333rem;
    text-align: left;
    @include flexbox(row, space-between, center);
    .left {
      // float: left;
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 100%;
      .p-title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .property {
        font-size: 0.346667rem;
        padding-top: 0.133333rem;
        //  margin-bottom: .133333rem /* 5/37.5 */;
      }
      .evaluate {
        padding-top: 0.106667rem;
        font-size: 0.346667rem;
      }
      .tag-1 {
        padding: 0.053333rem 0.106667rem;
        font-size: 0.32rem;
        color: #ff740d;
        border: 0.026667rem solid #ff740d;
      }
      .tag-2 {
        padding: 0.053333rem 0.106667rem;
        font-size: 0.32rem;
        color: #d30775;
        border: 0.026667rem solid #d30775;
      }
      @include flexbox(column, space-around, flex-start);
      .loc {
        color: #aaa;
        font-size: 0.32rem;
      }
    }
    .right {
      // float: left;
      // flex: 1;
      .pro-price {
        white-space: nowrap;
      }
    }
  }
}
</style>
