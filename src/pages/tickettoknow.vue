<template>
  <div class="needtoknow" v-if="ticketinfo">
    <van-nav-bar title="景区须知" left-arrow @click-left="onClickLeft" />
    <van-tabs sticky>
      <van-tab :title="'预定须知'" v-if="ticketinfo.bookingInfo">
        <div class="konw-cc">
          <div class="title">
            预定须知
          </div>
          <div class="list">
            <div class="item">
              <p class="item-title">开放时间</p>
              <p class="item-cc">
                {{openTime}}
                <!-- {{ticketinfo.scenicInfos}} -->
              </p>
            </div>
            <div class="item" v-if="ticketinfo.bookingInfo">
              <p class="item-title">免票政策</p>
              <p class="item-cc">
                {{ticketinfo.bookingInfo.freePolicy}}
              </p>
            </div>
            <div class="item" v-if="ticketinfo.bookingInfo">
              <p class="item-title">优惠人群</p>
              <p class="item-cc">
                {{ticketinfo.bookingInfo.offerCrowd}}
              </p>
            </div>
            <div class="item" v-if="ticketinfo.bookingInfo">
              <p class="item-title">说明</p>
              <p class="item-cc">
                {{ticketinfo.bookingInfo.explanation}}
              </p>
            </div>
            <div class="item">
              <p class="item-title">开具发票</p>
              <p class="item-cc">
                景区规定统一
              </p>
            </div>
            <div class="item">
              <p class="item-title">入园须知</p>
              <p class="item-cc">
                景区规定统一
              </p>
            </div>
            <div class="item">
              <p class="item-title">温馨提示</p>
              <p class="item-cc">
                景区规定统一
              </p>
            </div>
            <div class="item">
              <p class="item-title">交通信息</p>
              <p class="item-cc">
                景区规定统一
              </p>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="'景区介绍'">
        <div class="ccc">
          <div class="konw-cc">
            <div class="title">
              景区介绍
            </div>
            <div class="list">
              <div class="item" v-for="(item, index) in playAttraction" :key="index">
                <p class="item-title">{{item.playName}}</p>
                <p class="item-cc">
                  {{item.playInfo}}
                </p>
                <img :src="item.playImages.url" alt="">
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import { Tab, Tabs, Toast, NavBar, Button } from "vant";
import { $axios } from "../utils/axios";

export default {
  name: "toknowpage",
  components: {
    "van-tabs": Tabs,
    "van-tab": Tab,
    "van-button": Button,
    "van-nav-bar": NavBar
  },
  data() {
    return {
      active: 2,
      ticketinfo: null
    };
  },
  beforeRouteEnter: (to, from, next) => {
    Toast.loading({ duration: 0, forbidClick: true, message: "加载中...." });
    // ...
    // console.log('景区知识',to.query.info);
    // $axios.get
    $axios
      .get(
        `api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfos/${
          to.query.id
        }`
      )
      .then(res => {
        console.log("景区的信息", res);
        next(vm => {
          vm.ticketinfo = res.data.data;
          Toast.clear();
        });
      })
      .catch(err => {});
    // const inf = JSON.parse(to.query.info);

    // next(vm => {
    //   Toast.clear();

    //   console.log("景区知识", vm.ticketinfo);
    // });
  },
  computed: {
    playAttraction() {
      if(this.ticketinfo.playAttractions){
        return this.ticketinfo.playAttractions.playAttraction;

      }else{
        return [];
      }
    },
    noticedata() {
      //入园须知
      return;
    },
    openTime() {
      let s = "";
      const opentime = this.ticketinfo.scenicInfos.openTimes.openTime;
      if (Array.isArray(opentime)) {
        opentime.forEach(item => {
          s += `${item.openTimeInfo} ${item.sightStart}-${item.sightEnd} `;
        });
      } else {
        s += `${opentime.sightEnd}-${opentime.sightEnd}`;
      }
      return s;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
.needtoknow {
  background-color: #fff;
  .konw-cc {
    text-align: left;
    padding: 10px;
    .title {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      font-size: 17px;
      font-weight: 600;
    }
    .list {
      .item {
        padding-left: 20px;
        margin-bottom: 5px;
        font-size: 12px;
        p {
          padding: 5px 0;
        }
        .item-title {
          font-weight: 600;
        }
        .item-cc {
          font-size: 13px;
          color: #666;
        }
      }
    }
  }
}
</style>
