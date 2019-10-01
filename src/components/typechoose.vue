<template>
  <div class="card">
    <div class="cc">
      <div class="details" @click="handelshowlist">
        {{cardNameList[currentIndex]}} <icon name="angle-down" scale="1"></icon>
      </div>
      <div class="morelist">
        <div class="css_ab">
          <van-popup v-model="morelistshow" position="bottom" class="pop_div">
            <div class="pop_cc">
              <p 
              :class="{'active':index==currentIndex}"
              v-for="(item,index) in cardNameList" @click="handleCardtype(index)">{{item}}</p>
            </div>
          </van-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Popup,Icon } from "vant";
export default {
  components: {
    "van-popup": Popup,
    "van-icon":Icon
  },
  data() {
    return {
      currentIndex:0,//默认显示0
      morelistshow: false,
    };
  },
  props: {
    cardList: {
      type: Array,
      required: true
    }
  },
  computed: {
    cardNameList() {
      const list= this.cardList.map((item,index) => {
        switch (item) {
          case "ID_CARD":
            return "身份证";
            break;
          case "HUZHAO":
            return "护照";

            break;
          case "GANGAO":
            return "港澳通行证";
            break;
          case "TAIBAO":
            return "台湾通行证";
            break;
        }
      });
      return list;
    }
  },
  methods: {
    handleCardtype(i){ //
      this.currentIndex=i;
      this.$emit('typechanged',i);
      this.morelistshow=false;
    },
    handelshowlist() {
      this.morelistshow = !this.morelistshow;
    }
  }
};
</script>

<style lang="scss">
.pop_div {
  background-color: #fff;
  .pop_cc {
    background-color: #fff;
    p{
      text-align: center;
      padding: 10px 0px;
      border-bottom: 1px solid #ddd;
    }
    .active{
      color: orange;
    }
  }
}
</style>
