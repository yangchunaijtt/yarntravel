<template>
  <div id="app">
    <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')" :name="viewTransition" :css="!!direction">
      <router-view class="routerview" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Button } from "vant";
export default {
  name: "App",
  components: {
    "van-button": Button
  },
  data(){
    return{
      _uid:0,
    }
  },
  mounted() {
    if (location.hostname == "m.wandaly.net") {
      this.$cookie.set("WHERE", "21", 99);
    } else {
      this.$cookie.set("WHERE", "11", 99);
    }
    
  },
  beforeRouteEnter (to, from, next) {
    
   
  },
  computed: {
    viewTransition() {
      if (!this.direction) return "";
      console.log("vux-pop-" + (this.direction === "forward" ? "in" : "out"));
      return "vux-pop-" + (this.direction === "forward" ? "in" : "out");
    },
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction
    })
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-size: 15px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
img {
  width: 100%;
  height: auto !important;
}
body,
html {
  height: 100%;
  width: 100%;
}
body {
  // max-width: 540px;
  margin: 0 auto;
}
#app {
  // position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  // max-width: 640px;
  overflow: scroll;
  box-sizing: border-box;
  min-height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f4f4f4;
  position: relative;
  .routerview {
    width: 100%;
    min-height: 100%;
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  /* transform: translateX(-100%); */
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 0px;
  width: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
