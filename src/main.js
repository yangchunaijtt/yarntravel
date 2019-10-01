// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import VueTouch from "vue-touch";
import VueCookie from "vue-cookie";
import { Lazyload,Toast } from "vant";
import axios from "./utils/axios";
import checkpone from "./utils/phonecheck";
// import Icon from 'vue-awesome/components/Icon';
import Icon from "vue-svg-icon/Icon.vue";
import BusPlugin from "./utils/bus";

//=================================
import VeeValidate from "./utils/validaor";
import { getopenid, isFocuson } from "./utils/wechat.js";
//==================
getopenid();
isFocuson(VueCookie.get('WXOPID'), (res) => {
  console.log('是否关注公众号', res);
  if (res.data.subscribe !=1) {
    //没有关注
    // alert("请关注公众号");
    router.push('/focus')
  }
}, error => {
  console.log('网络错误',error);
});
//==================================
Vue.use(VeeValidate);

//================
Vue.config.productionTip = false;
Vue.use(BusPlugin);
Vue.use(VueTouch, {
  name: "v-touch"
});
Vue.use(Lazyload, {
  name: "v-lazy",
  error: "./static/errorpic.png",
  loading: "./static/loading.png"
});
Vue.use(axios);
Vue.use(VueCookie);
Vue.use(checkpone);
Vue.component("icon", Icon);

const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem("count") * 1 || 0;
history.setItem("/", 0);

let isPush = false;
let endTime = Date.now();
let methods = ["push", "go", "replace", "forward", "back"];

document.addEventListener("touchend", () => {
  endTime = Date.now();
});
methods.forEach(key => {
  let method = router[key].bind(router);
  router[key] = function(...args) {
    isPush = true;
    method.apply(null, args);
  };
});

store.registerModule("vux", {
  state: {
    demoScrollTop: 0,
    isLoading: false,
    direction: "forward"
  },
  mutations: {
    updateDemoPosition(state, payload) {
      state.demoScrollTop = payload.top;
    },
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading;
    },
    updateDirection(state, payload) {
      state.direction = payload.direction;
    }
  },
  actions: {
    updateDemoPosition({ commit }, top) {
      commit({
        type: "updateDemoPosition",
        top: top
      });
    }
  }
});

router.beforeEach((to, from, next) => {
  store.commit("updateLoadingStatus", {
    isLoading: true
  });

  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (
      !fromIndex ||
      parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
      (toIndex === "0" && fromIndex === "0")
    ) {
      store.commit("updateDirection", {
        direction: "forward"
      });
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && Date.now() - endTime < 377) {
        store.commit("updateDirection", {
          direction: ""
        });
      } else {
        store.commit("updateDirection", {
          direction: "reverse"
        });
      }
    }
  } else {
    ++historyCount;
    history.setItem("count", historyCount);
    to.path !== "/" && history.setItem(to.path, historyCount);
    store.commit("updateDirection", {
      direction: "forward"
    });
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split("http")[1];
    window.location.href = `http${url}`;
  }
  // to and from are both route objects
  next();
});

router.afterEach(function(to) {
  console.log('离开');
  Toast.clear();
  isPush = false;
  store.commit("updateLoadingStatus", {
    isLoading: false
  });
});
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
