<template>
  <div class="allproduct">
    <div class="top">

      <div class="heard-dd">

        <div class="back-button" @click="goback">
          <icon name="arrow-left" scale="2.5"></icon>
        </div>
        <div class="searchbar">
          <div class="searchcont" @click="searchpopfun">
            <icon name="search" scale="2" class="dd-ic"> </icon>
            <div class="search-right"> {{searchquery}} </div>
          </div>
        </div>

      </div>
      <div class="select">
        <div class="list">
          <div class="tag" @click="showsort">综合排序</div>
          <div class="tag" @click="showfilter">筛选</div>
        </div>

      </div>

      <transition name="movedown">
        <selectcom @disappear="handledisappear" :currentsort="currentsort" @change="handlechange" v-if="sortpopshow"></selectcom>
      </transition>

      <transition name="movedown">
        <type-com @disappear="handledisappear2" @change="hanglechange2" :theme="themeList" :currentchoose="currenttheme" v-if="fileterpopshow"></type-com>
      </transition>
    </div>
    <div class="list">
      <vant-list v-model="loading" :finished="finished" @load="onLoad">
        <!-- @click.native="toTicketdetails" -->
        <recommend  :recommendpro="item" v-for="(item, index) in productList_c" :key="index"></recommend>
      </vant-list>

    </div>

    <van-popup v-model="searchPopshow" position="right" class="searh-pop">
      <van-search placeholder="景点名称" show-action @search="onSearch" @cancel="onPopsearchcancel" v-model="searchtext" />
      <p>热门搜索</p>
      <ul>
        <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('迪士尼')">迪士尼</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('天目湖')">天目湖</li>
          <li class="van-hairline--bottom " @click="handlesearch('恐龙园')">恐龙园</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('上海')">上海</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('南京')">南京</li>
          <li class="van-hairline--bottom" @click="handlesearch('常州')">常州</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('苏州')">苏州</li>
          <li class="van-hairline--bottom van-hairline--left" @click="handlesearch('杭州')">杭州</li>
          <!-- <li class="van-hairline--bottom">重庆</li> -->
      </ul>
    </van-popup>
  </div>

</template>

<script>
Number.prototype.toCeil = function(num) {
  return Math.ceil(this * Math.pow(10, num)) / Math.pow(10, num);
};
import typecom from "../components/selectcom2.vue";
import recommend from "../components/recommentpro.vue";
import selectcom from "../components/selectcom.vue";
import { Cell, Popup, Search, CellGroup, List } from "vant";
import { $axios } from "../utils/axios";
import _findeindex from 'lodash/findIndex'
export default {
  name: "allproduct",
  components: {
    selectcom: selectcom,
    "type-com": typecom,
    recommend: recommend,
    "van-popup": Popup,
    "van-search": Search,
    "vant-list": List
  },
  data() {
    return {
      currentfilter: "不限",
      currenttheme: 0,
      currentsort: "1",
      searchquery: "常州",
      currnetPageindex: 1,
      loading: false,
      finished: false,
      searchtext: "",
      searchPopshow: false,
      fileterpopshow: false,
      sortpopshow: false,
      productList: []
    };
  },
  computed: {
    themeList() {
      const theme_set = new Set();
      this.productList.forEach(item => {
        theme_set.add(...item.productTheme);
      });
      let ta = Array.from(theme_set);
      ta = ta.map(item => {
        return { title: item, choose: false };
      });
      ta.unshift({ title: "不限", choose: false });
      let ct = 0;
      for (let i = 0; i < ta.length; i++) {
        if (ta[i].title === this.currentfilter) {
          ct = i;
        }
      }

      ta[ct].choose = true;
      return ta;
    },
    productList_c() {
      if (this.currentfilter == "不限") {
        return this.productList;
      } else {
        return this.productList.filter(item => {
          return _findeindex(item.productTheme,theme=>{
            return theme===this.currentfilter;
          })!==-1;
          // return  item.productTheme.indexOf(this.currentfilter) !== -1;
        });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    const searchquery = to.query.search;
    next(vm => {
      vm.searchquery = searchquery;
    });
    // $axios
    //   .post("api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList", {
    //     keyName: locationcity,
    //     hasPrice: true,
    //     pageIndex: 1,
    //     // productStatus:1,
    //     pageSize: 4
    //   })
    //   .then(res => {
    //     next(vm => {
    //       if (res.data.code === "0") {
    //         vm.productList = res.data.data.productInfos;
    //       } else {
    //         vm.productList = [];
    //       }
    //     });
    //   });
    // console.log(to.query.city);
    // console.log(from);
  },
  methods: {
    handlesearch(ttt){
      // this.$router.re
      window.history.replaceState(null,null,`#/all?search=${ttt}`);
      console.log("search");
      this.productList = [];
      this.searchquery = ttt;
      this.currnetPageindex = 1;
      this.loading=true;
      this.finished = false;
      this.searchPopshow = false;
      this.onLoad();
    },
    handledisappear(){
      this.sortpopshow=false;
    },
    handledisappear2(){
      this.fileterpopshow=false;
    },
    hanglechange2(theme, index) {
      console.log("筛选主题", theme);
      this.fileterpopshow = false;
      // this.productList.forEach(item=>{
      //   // if(item!=)
      // })
      this.currentfilter = theme.title;

      this.currenttheme = index;
    },
    handlechange(sortindex) {
      console.log("父组件排序", sortindex);
      if (this.currentsort === sortindex) {
        return;
      }
      // this.currentsort=sortindex;
      switch (sortindex) {
        case "1":
          console.log("1");
          this.productList.sort();
          //综合排序
          break;
        case "2":
          //价格低到高
          console.log("2");
          this.productList.sort((a, b) => {
            return a.minPrice - b.minPrice;
          });
          break;
        case "3":
          console.log("3");
          this.productList.sort((a, b) => {
            return b.minPrice - a.minPrice;
          });
          //价格高到低
          break;
        case 4:
          break;
      }

      this.sortpopshow = false;
      this.currentsort = sortindex;
    },
    async onLoad() {
      console.log("onload");
      const productList_res = await $axios.post(
        "api/LvmamaScenicTickets/ProductLocalInfos/GetProductInfosList",
        {
          keyName: this.searchquery,
          hasPrice: true,
          pageIndex: this.currnetPageindex,
          productStatus:1,
          pageSize: 6
        }
      );
      // console.log('产品信息',productList_res.data.data.pageSize);
      if (productList_res.data.code === "0") {
        this.productList.push(...productList_res.data.data.productInfos);
        this.currnetPageindex++;
      } else {
        this.finished = true;
      }
      this.loading = false;
      // if (this.currnetPageindex - 1 >(productList_res.data.data.pageSize/productList_res.data.data.pageSize).toCeil(0)) {
      //   this.finished = true;
      // }
      // .then(res => {
      //     if (res.data.code === "0") {
      //       this.productList.push(...res.data.data.productInfos) ;
      //       this.currnetPageindex++;
      //     } else {
      //       // this.productList = [];
      //     }
      //     this.loading = true;
      //     if(this.currnetPageindex-1>res.data.data.pageSize){
      //       this.finished = true;
      //     }

      // });
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }
      //   this.loading = false;

      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 500);
    },
    goback() {
      this.$router.go(-1);
    },
    searchpopfun() {
      this.searchPopshow = true;
    },
    // toTicketdetails() {
    //   console.log("dddd");
    //   this.$router.push("/ticket");
    // },
    showsort() {
      this.fileterpopshow = false;
      this.sortpopshow = !this.sortpopshow;
    },
    showfilter() {
      this.sortpopshow = false;
      this.fileterpopshow = !this.fileterpopshow;
    },
    onSearch() {
      console.log("search");
      this.productList = [];
      this.searchquery = this.searchtext;
      this.currnetPageindex = 1;
      this.loading=true;
      this.finished = false;
      this.searchPopshow = false;
      this.onLoad();
    },
    onPopsearchcancel() {
      this.searchPopshow = false;
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.movedown-enter-active,
.movedown-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
}
.movedown-enter {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
  transition: opacity 0.5s;
}
.movedown-leave-active {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}

//===================
.allproduct {
  .searh-pop {
    @include maxPop();
    p {
      text-align: left;
      padding: 0.266667rem 0px 0.266667rem 0.4rem;
      background-color: $pupbaccolor;
    }
    ul {
      @include flexbox(row, flex-start, center);
      flex-wrap: wrap;
      li {
        width: 33%;
        box-sizing: border-box;
        padding: 0.133333rem;
      }
    }
  }
  .top {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 111;
    width: 100%;
  }
  .heard-dd {
    padding: 10px 0;
    background-color: #fff;
    position: relative;
    z-index: 11;
    // top: 0;
    // left: 0;
    // right: 0;
    @include flexbox(row, flex-start, center);
    width: 100%;
  }
  .back-button {
    flex: 2;
  }
  .searchbar {
    flex: 16;

    background-color: #fff;
    height: 0.853333rem;
    line-height: 0.853333rem;
    // padding: 0.266667rem;

    .searchcont {
      margin-right: 0.533333rem /* 20/37.5 */;
      margin-left: 0.266667rem /* 10/37.5 */;
      position: relative;
      border-radius: 0.666667rem;
      padding-left: 1.066667rem;
      background-color: #eef2f6;
      .dd-ic {
        position: absolute;
        top: 0.186667rem;
        left: 0.266667rem;
      }
    }
  }
  .select {
    // position: fixed;
    // left: 0;
    // right: 0;
    // top:50px;
    // margin-top: 20px;
    position: relative;
    z-index: 11;
    background-color: #fff;
    .list {
      font-size: 15px;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #ddd;
      @include flexbox(row, flex-start, center);
      .tag {
        flex: 1;
        &:first-child {
          border-right: 1px solid #ddd;
        }
      }
    }
  }
  > .list {
    padding-top: 98px;
    background-color: #fff;
  }
}
</style>
