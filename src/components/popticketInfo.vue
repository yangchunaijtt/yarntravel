<template>
  <van-pop v-model="mypopshow" :lock-scroll="true" position="bottom" class="pop_ticket_info">
    <div class="cont">
      <van-icon name="close" class="pop-close-icon" @click="handleclose"></van-icon>
      <div class="title">
        <p>{{ticketinfo.standardName}}</p>
      </div>
      <div class="scroll-c" :style="{'height':scrollHeight+'px'}">
        <div class="sroll-item">
          <p>
            <span>今日票</span>
            <span>今日18”00前可定今日票</span>
          </p>
        </div>
        <div class="sroll-item">
          <p class="tit">
            费用包含
          </p>
          <p class="details">
            {{ticketinfo.costInclude?ticketinfo.costInclude:'暂无'}}
          </p>

        </div>
        <div class="sroll-item">
          <p class="tit">
            费用不包含
          </p>
          <p class="details">
            暂无
          </p>

        </div>
        <div class="sroll-item">
          <p class="tit">
            入园须知:
          </p>
          <div class="details" v-if="ticketinfo.notice">
            <p v-if="ticketinfo.notice.enterLimit.limitTime">
              <span>入园时间：</span>
              <span>{{ticketinfo.notice.enterLimit.limitTime}}</span>
            </p>
            <p v-if="ticketinfo.visitAddress">
              <span>入园地点：</span>
              <span>
                {{ticketinfo.visitAddress}}
              </span>
            </p>
            <p v-if="ticketinfo.notice.getTicketTime">
              <span>取票时间：</span>
              <span>{{ticketinfo.notice.getTicketTime}}</span>
            </p>
            <p v-if="ticketinfo.notice.ways">
              <span>入园方式：</span>
              <span>{{ticketinfo.notice.ways}}</span>
            </p>
            <p v-if="ticketinfo.notice.effectiveDesc">
              <span>有效期：</span>
              <span>{{ticketinfo.notice.effectiveDesc}}</span>
            </p>
          </div>

        </div>
        <div class="sroll-item">
          <p class="tit">
            重要提示：
          </p>
          <div class="details">
            <p>
              {{ticketinfo.importentPoint}}
            </p>
            <p>
              {{ticketinfo.importantNotice}}
            </p>
          </div>

        </div>
        <div class="sroll-item">
          <p class="tit">
            退票规则
          </p>
          <p class="details">
            {{ticketinfo.refundRuleNotice}}
          </p>

        </div>
        <!-- <div class="sroll-item"></div>
        <div class="sroll-item"></div>
        <div class="sroll-item"></div>
        <div class="sroll-item"></div>
        <div class="sroll-item"></div> -->
      </div>
    </div>
  </van-pop>
</template>

<script>
import { Popup, Icon } from "vant";
export default {
  components: {
    "van-pop": Popup,
    "van-icon": Icon
  },
  props: {
    popshow: {
      type: Boolean,
      required: true,
      default: false
    },
    eleHeight: {
      type: Number,
      required: true
    },
    ticketinfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mypopshow: this.popshow
    };
  },
  computed: {
    scrollHeight() {
      return this.eleHeight * 0.8 - 120;
    }
  },
  watch: {
    popshow(nv, ov) {
      this.mypopshow = nv;
    },
    mypopshow(nv, ov) {
      console.log("watch", nv);
      // this.popshow=nv;
      this.$emit("handlepopshow", nv);
    }
  },
  methods: {
    handleclose() {
      this.mypopshow = false;
    }
  }
};
</script>

<style lang="scss">
.pop_ticket_info {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 80%;
  background-color: #fff;
  .cont {
    position: relative;
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    .pop-close-icon {
      position: absolute;
      top: 15px;
      right: 10px;
    }
    .title {
      text-align: center;
    }
    .scroll-c {
      overflow-y: auto;
      .sroll-item {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        .tit{
          color:#333;
          padding-bottom: 5px;
        }
        .details {
          font-size: 13px;
          p {
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
