import Vue from "vue";
import Router from "vue-router";
import Cookie from "../utils/cookie";
import {
  howtogo
} from '../utils/agencytool';
//pages
const search = () => import("@/pages/search.vue");
const allprodet = () => import("@/pages/allprodect.vue");
const ticket = () => import("@/pages/ticket.vue");
const formorder = () => import("@/pages/formorder.vue");
const login = () => import("@/pages/login.vue");
const needtoknow = () => import("@/pages/tickettoknow.vue");
const orderList = () => import("@/pages/ticketsList.vue");
const orderdetails = () => import("@/pages/orderdetails.vue");
const pay = () => import("@/pages/pay.vue");
const focusacc = () => import('@/pages/focusaccount.vue');
Vue.use(Router);
// export default
const router = new Router({
  routes: [{
      path: "/",
      name: "search",
      component: search
    },
    {
      path: "/all",
      name: "allprodet",
      component: allprodet
    },
    {
      path: "/ticket",
      name: "ticket",
      component: ticket
    },
    {
      path: "/formorder",
      name: "formorder",
      component: formorder
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/toknow",
      name: "needtoknow",
      component: needtoknow
    },
    {
      path: "/orderList",
      name: "orderList",
      component: orderList
    },
    {
      path: "/orderdetails",
      name: "orderdetails",
      component: orderdetails
    },
    {
      path: "/pay",
      name: "pay",
      component: pay
    },
    {
      path: "/focus",
      name: "focusacc",
      component: focusacc
    },
  ]
});

router.beforeEach((to, from, next) => {
  console.log("全局路由守卫to", to);
  console.log("全局路由守卫from", from);
  // window.scroll(0, 0);
  const torouter = to.name;
  const secret = Cookie.get("usersecret");
  const gdmobileusername = Cookie.get("gdmobileusername");
  const gdmobileuserphone = Cookie.get("gdmobileuserphone");
  const USERIDGDLY = Cookie.get("USERIDGDLY");
  const userid = Cookie.get("userid");

  // agency = localStorage.getItem('agency')
  let agency = to.query.uid || userid || localStorage.getItem("agency"); //代理;
  console.log('agency')
  if (agency !== '' && typeof agency !== 'undefined' && agency !== localStorage.getItem('agency')) {
    localStorage.setItem("agency", agency);
  }
  // if (typeof agency !== "undefined" || agency !== "") {
  //   //存在代理
  //   localStorage.setItem("agency", agency);
  // } else {
  //   //获取历史代理；
  //   agency = localStorage.getItem("agency");
  // }

  //to.query.uid = 111;


  switch (torouter) {
    case "formorder": //needlogin
    case "orderList": //needlogin
    case "orderdetails": //needlogin
    case "pay": //needlogin
      console.log("needtologin");
      if (secret && gdmobileusername && gdmobileuserphone) {
        howtogo(router, to, agency, next);
      } else {
        next("/login");
        // alert('登陆');
      }
      break;
    default:
      howtogo(router, to, agency, next);
      break;
  }
});
export default router;
