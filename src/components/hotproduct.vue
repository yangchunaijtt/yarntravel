<template>
  <a class="hotproduct van-hairline--surround" @click="handleclick">
    <div class="imgwrap">
      <div class="img" v-lazy:background-image="getimgShow(product.images)" ></div>
    </div>
    <div class="proinfo">
      <p v-html="product.productName"/>
      <p class='pro-price'>
        <span>
          <i>￥</i>{{product.minPrice}} </span>
        起
      </p>
    </div>
  </a>
</template>

<script>

export default {
  name: "hotproduct",
  data() {
    return {
      img:
        "http://pic.lvmama.com/pics//uploads/pc/place2/2018-03-14/6bf5123d-9223-4bb5-b9d7-910d787b1385_480_320.jpg"
    };
  },
  props: {
    product: {
      type: Object
    }
  },
  mounted() {

  },
  methods:{
    handleclick(id){
      this.$router.push({
        name: "ticket",
        query: {
          id: this.product.id
        }
      });
    },
    getimgShow(imgs){
      const count=imgs.length;
      if(count==0){
        return ''
      }else {
        // const today=new Date();
       return imgs[(new Date()).getDate()%(count-1)];
        // const num=(Math.random()*(count-1)).toFixed(0);
        // console.log("随机的数",num);
        // return imgs[num];

      }
    },
  }
};
</script>

<style lang="scss">
.hotproduct {
  &:visited{
    text-decoration:none;
  }
  &:hover{
    text-decoration:none;
  }
  text-decoration:none;
  overflow: hidden;
  width: 38.4%;
  display: inline-block;
  margin-right:.133333rem /* 5/37.5 */;
  .imgwrap {
    .img {
      padding-bottom: 67.63%;
      height: 0;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}
</style>
