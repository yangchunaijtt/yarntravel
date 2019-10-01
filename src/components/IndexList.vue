<template>
  <div class="citylist">
    <v-touch ref="touchbar" class="char-left"  @pan="onPan" @press="onPress" @pressup="onClick">
      <div class="char-item" v-for="(item,index) in ccityList" @click="handleclick(item)" :key="index">
        <p>
          <a href="javascript:void(0)">{{item.en}}</a>
        </p>
      </div>
    </v-touch>
    <div class="indexlist" id="indexlist">

      <div class="scroll">

        <div class="char-list" v-for="(item,index) in ccityList" :key="index">
          <span :id="item.en+'_bartitle'">{{item.en}}</span>
          <vant-cell :title="iitem" v-for="(iitem,iindex) in item.city" @click="setlocationCity(iitem)" :key="iindex"></vant-cell>
        </div>
      </div>
      <vant-pop v-model="charPopshow" :overlay="false" class="char-pop" :lock-scroll="false">
        <div class="pop-content">
          {{currenChar}}
        </div>
      </vant-pop>
    </div>
  </div>

</template>

<script>
import cityList from "../../static/city_en";
import { Cell, Popup, CellGroup } from "vant";
export default {
  name: "indexlist",
  data() {
    return {
      currenChar: "",
      charPopshow: false,
      currentheight: 0
    };
  },
  components: {
    "vant-cell": Cell,
    "vant-cellgroup": CellGroup,
    "vant-pop": Popup
  },
  computed: {
    ccityList() {
      return cityList;
    }
  },
  created() {
  },
  mounted() {
    console.log("ref", this.$refs.touchbar.$el.offsetHeight);
    console.log("ref", this.$refs);
    this.currentheight = this.$refs.touchbar.$el.offsetHeight;
  },
  methods: {
    handleclick(item){
        console.log('click',item.en);
        let anchor = this.$el.querySelector("#" + item.en + "_bartitle");
        let indexlist = this.$el.querySelector("#indexlist");
        indexlist.scrollTop = anchor.offsetTop;
    },
    setlocationCity(item) {
      console.log(item);  
      this.$emit('setlocation',item);//返回到首页
    },
    onPan(e) {
      //滑动
      if (e.center.y-46 >= this.currentheight * 0.04 * this.ccityList.length||e.center.y<=46) {
        console.log("???");
        this.charPopshow = false;
        return;
      }
      if (!this.charPopshow) {
        this.charPopshow = true;
      }
      const perCharheight = this.currentheight * 0.04;
      console.log("pan", Math.floor(e.center.y / perCharheight));
      this.currenChar = this.ccityList[
        Math.floor((e.center.y-46) / perCharheight)
      ].en;
      let anchor = this.$el.querySelector("#" + this.currenChar + "_bartitle");
      // console.log("this.$el", anchor.offsetTop);
      console.log(e);
      let indexlist = this.$el.querySelector("#indexlist");
      console.log("indexlist",indexlist);
      indexlist.scrollTop = anchor.offsetTop;
      if (e.isFinal) {
        this.charPopshow = false;
      }
    },
    onPress(e) {
      //按住
      if (e.center.y-46 >= this.currentheight * 0.04 * this.ccityList.length) {
        this.charPopshow = false;
        return;
      }
      if (!this.charPopshow) {
        this.charPopshow = true;
      }
      const perCharheight = this.currentheight * 0.04;
      this.currenChar = this.ccityList[
        Math.floor((e.center.y-46) / perCharheight)
      ].en;
      console.log(e.target.outerText);
      let anchor = this.$el.querySelector("#" +this.currenChar+ "_bartitle");
      let indexlist = this.$el.querySelector("#indexlist");;
      console.log("indexlist",anchor.offsetTop);
      indexlist.scrollTop = anchor.offsetTop;
      if (e.isFinal) {
        this.charPopshow = false;
      }
    },

    onClick(cc) {
      this.charPopshow = false;
    }
  }
};
</script>

<style lang="scss">
.citylist{
  // position: relative;
  height: 100%;
  .char-left {
    height: 100%;
    z-index: 1;
    position: absolute;
    top: 46px;
    right: 0;
    width: .533333rem /* 20/37.5 */;
    background-color: #fff;
    .char-item {
      height: 4%;
      p {
        margin: 0rem /* 0/37.5 */;
        // height: 3%;
        a {
          color: #666;
        }
      }
    }
  }
}
.indexlist {
  width: 100%;
  background-color: #efeff7;
  position: absolute;
  right: 0rem /* 0/37.5 */;
  top: 0;
  bottom: 0;
  overflow-y: auto;

  
  .char-list {
    text-align: left;
  }
  .char-pop {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: .133333rem /* 5/37.5 */;
    width: 1.333333rem /* 50/37.5 */;
    height: 1.333333rem /* 50/37.5 */;
    .pop-content {
      line-height: 1.333333rem /* 50/37.5 */;
    }
  }
}
</style>
