<template>
  <div class="select-phone">
    <div class="more" v-show="moreshow">
      <van-radio-group v-model="selectChoose" @change="handlechange">
        <van-cell-group>
          <van-cell>
            <van-radio name="1">综合排序</van-radio>
          </van-cell>
          <van-cell>
            <van-radio name="2">价格从低到高</van-radio>
          </van-cell>
          <van-cell>
            <van-radio name="3">价格从高到低</van-radio>
          </van-cell>
          <!-- <van-cell>
            <van-radio name="4">单选框</van-radio>
          </van-cell> -->
        </van-cell-group>
      </van-radio-group>
    </div>
  </div>
</template>

<script>
import { Radio, Cell, CellGroup, RadioGroup } from "vant";
export default {
  name: "selectphone",
  data() {
    return {
      moreshow: true,
      selectChoose: ""
    };
  },
  components: {
    "van-radio": Radio,
    "van-radio-group": RadioGroup,
    "van-cell-group": CellGroup,
    "van-cell": Cell
  },
  created() {},
  props:{
    currentsort:{
      // required:true,
      default:1,
    }
  },
  mounted() {
    console.log("当前排序", this.currentsort);
    const odiv = document.createElement("div");
    odiv.className = "modal";
    this.$root.$el.appendChild(odiv);
    odiv.onclick=(ev)=>{
      console.log('clicked');
      // odiv.canc
      ev.stopPropagation();
      this.$emit('disappear');
    }
    this.selectChoose=this.currentsort;
  },
  methods: {
    handlechange() {
      console.log('chang');
      console.log(this.selectChoose);
      this.$emit('change',this.selectChoose);
    }
  },
  destroyed() {
    const mdiv = this.$root.$el.getElementsByClassName("modal");
    //console.log('mdiv',mdiv[0]);
    this.$root.$el.removeChild(mdiv[0]);
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.modal {
  z-index: 1;
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.select-phone {
  position: relative;
  z-index: 10;
  background-color: #fff;
  width: 100%;
  height: 137px;
  .more {
    width: 100%;
    height: 100px;
  }
}
.van-cell {
  .van-radio__input {
    float: right;
    position: static;
  }
  .van-radio__label {
    margin: 0;
  }
}
</style>
