<template>
  <div class="list">
    <van-nav-bar title="订单列表" left-arrow @click-left="onClickLeft" />
    <div class="dd-list">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <orderitem v-for="(item, index) in orderlist" :order="item" :key="index"></orderitem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { $axios } from "../utils/axios";
import Cookie from "../utils/cookie.js";
import { NavBar, List } from "vant";
import orderitem from "../components/orderitem";
export default {
  name: "ticketorderList",
  components: {
    "van-nav-bar": NavBar,
    orderitem: orderitem,
    vanList: List
  },
  data() {
    return {
      orderlist: [],
      totalpage: 1,
      currentPage: 0,
      loading: false,
      finished: false
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getListbypage(page = 1) {
      const tokenparams = () => {
        return `?token=${Cookie.get("USERIDGDLY")}|${Cookie.get(
          "usersecret"
        )}|${Cookie.get("gdmobileuserphone")}|${Cookie.get("WHERE")}`;
      };
      return $axios.post(
        // api/LvmamaScenicTickets/ScenicLocalOrders/GetScenicOrdersByMember/{customerId}-{customerSource}
        `api/LvmamaScenicTickets/ScenicLocalOrders/GetScenicOrdersByMember/${Cookie.get(
          "USERIDGDLY"
        )}-${Cookie.get("WHERE")}${tokenparams()}`,

        {
          pageSize: 6,
          pageIndex: this.currentPage,
          sort:"desc"
        }
      );
    },
    async onLoad() {
      this.currentPage++;
      
      const list = await this.getListbypage(this.currentPage);
      console.log("loading", list);
      this.totalpage =
        list.data.data.count % 6 != 0
          ? Math.floor(list.data.data.count / 6) + 1
          : Math.floor(list.data.data.count / 6);
      this.orderlist.push(...list.data.data.scenicOrders);
      this.loading = false;

      if (this.currentPage+1 > this.totalpage) {
        this.finished = true;
        // return;
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next();
    // const tokenparams = () => {
    //   return `?token=${Cookie.get("USERIDGDLY")}|${Cookie.get(
    //     "usersecret"
    //   )}|${Cookie.get("gdmobileuserphone")}|${Cookie.get("WHERE")}`;
    // };

    // $axios
    //   .post(
    //     // api/LvmamaScenicTickets/ScenicLocalOrders/GetScenicOrdersByMember/{customerId}-{customerSource}
    //     `api/LvmamaScenicTickets/ScenicLocalOrders/GetScenicOrdersByMember/${Cookie.get(
    //       "USERIDGDLY"
    //     )}-${Cookie.get("WHERE")}${tokenparams()}`,

    //     {
    //       pageSize: 6,
    //       pageIndex: this.currentPage
    //     }
    //   )
    //   .then(orderList => {
    //     console.log("订单列表", orderList);
    //     next(vm => {
    //       vm.totalpage =
    //         orderList.data.data.count % 6 != 0
    //           ? Math.floor(orderList.data.data.count / 6) + 1
    //           : Math.floor(orderList.data.data.count / 6);
    //       vm.orderlist = orderList.data.data.scenicOrders;
    //       console.log("订单list", vm.orderlist);
    //       console.log("totalpage", vm.totalpage);
    //     });
    //   });
  }
};
</script>

<style lang="scss">
.dd-list {
  margin-top: 10px;
}
</style>
