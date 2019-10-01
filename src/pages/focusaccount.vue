<template>
  <div class="focus">
    <vant-nav title="请关注公众号" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="img">
      <img :src="cimgurl" alt="">
    </div>
    <div class="tip">
      {{cimgurl}} 长按扫描二维码即可关注
    </div>
  </div>
</template>

<script>
import { NavBar } from "vant";

export default {
  components: {
    "vant-nav": NavBar
  },
  mounted() {
    Toast.clear();
    
  },
  computed: {
    cimgurl() {
      const gd_focus_img = `http://m.88888163.com:81/client/weixin/Save_Tempurl.asp?TP=顾问永久&id=${
        this.uid
      }&STP=3`;
      const wd_focus_img = `http://m.jswandaly.com:85/Mobile/weixin/Save_Tempurl.asp?TP=顾问永久&id=${
        this.uid
      }&STP=3`;
      const jt_focus_img = `http://m.gdjtly.com:85/Mobile/weixin/Save_Tempurl_JT.asp?TP=顾问永久&id=${
        this.uid
      }&STP=3`;
      switch (window.location.host) {
        case "m.czgdly.com":
          return gd_focus_img;
        case "m.wandaly.net":
          return wd_focus_img;
        default:
          return gd_focus_img;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // Toast.clear();
      vm.uid = to.query.uid || 4425;
    });
  },
  data() {
    return {
      imgurl: "",
      uid: 4425
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style>
</style>
