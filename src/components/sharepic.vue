<template>
  <div class="share">
    <div class="icon" @click="handleShowpop" id="sharepicc">
      <icon name="share" scale="3" />
    </div>
    <div class="shareimg">
      <van-popup v-model="shareimgshow" class="imgpop" position="right" :get-container="()=>dom">
        <div class="img-content">
          <div class="ff">
            <van-navbar left-arrow title="分享" @click-left="handleback">
            </van-navbar>
          </div>
          <div class="share-ccc" id="sharecontent">
            <div class="conttt shadow1">

              <div class="img">
                <!-- :style="{'background-image':'url('+initimg+')'}" -->
                <img v-lazy="initimg" alt="" @click="handleimgpickershow">
              </div>
              <div class="text-content">
                <p class="title">
                  {{ticketDetails.productName}}
                </p>
                <p v-if="productDetails">{{productDetails.goodsName}}</p>
                <p class="price" v-if="!productDetails">
                  抢购价:
                  <em>￥</em>
                  <span>{{ticketDetails.minPrice}}</span>
                  <em>起</em>
                </p>
                <p class="price" v-else>
                  抢购价:
                  <em>￥</em>
                  <span>{{productDetails.nowPrice}}</span>
                </p>
                <div class="contact-ccc">
                  <div class="contact">
                    <div class="qrcode">
                      <vue-qrcode :value="currenturl" :options="{level:'H', size: 60 }" />
                    </div>
                    <div class="info">
                      <p>旅游顾问:{{agencyinfo.name}}</p>
                      <p>顾问电话:{{agencyinfo.mobile}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="button-share">
            <button class="createimg" @click="handleCreateImg">生成</button>
            <!-- <button class="createimg" @click="handleback">取消</button> -->
          </div>

        </div>
        <van-popup v-model="imgshow" class="downloadimg" :get-container="()=>dom">
          <div class="downloadimg">
            <img :src="imgurl" alt="">
            <div class="tipi">
              <p>长按即可保存</p>
            </div>
          </div>
        </van-popup>
      </van-popup>
      <van-popup v-model="imgpickershow" class="imgpicker">
        <van-navbar title="选择图片" left-arrow @click-left="onClickLeft" />
        <div class="img-p-content">
          <div class="img-item" v-for="(item, index) in coverimg" :key="index">
            <div class="radio">
              <input v-model="currentpicked" :value="index" :id="'radio-'+index" type="radio" name="radio">
              <label class="radio-label" :for="'radio-'+index">
                <img :src="item">
              </label>
            </div>
          </div>
        </div>
      </van-popup>
    </div>

  </div>
</template>

<script>
import VueQrcode from "@xkeshi/vue-qrcode";
import { Popup, Checkbox, Radio, Toast, NavBar, Dialog } from "vant";
import html2canvas from "html2canvas";
// import imgpicker from "@/components/imgpicker";

export default {
  data() {
    return {
      isTrueclick:true,
      value: true,
      shareimgshow: false,
      dom: document.getElementById("app"),
      imgpickershow: false,
      imgurl: "",
      currenturl: window.location.href,
      imgshow: false,
      currentpicked: 0,
      lasttimecreateimgUrl: ""
      // dialogshow: true //提示信息教程
    };
  },
  components: {
    "van-popup": Popup,
    "vue-qrcode": VueQrcode,
    "van-navbar": NavBar,
    // imgpicker: imgpicker,
    "mt-radio": Radio,
    // "van-dialog": Dialog,
    "van-checkbox": Checkbox
  },
  props: {
    agencyinfo: {
      required: true,
      default: { name: "", mobile: "" }
    },
    coverimg: {
      required: true,
      default: []
    },
    ticketDetails: {
      required: true
    },
    currentShareItem: {
      required: true
    }
  },
  mounted() {},
  computed: {
    productDetails(){
      if(this.isTrueclick){
        return null;
      }else{
        return this.currentShareItem;
      }
    },
    initimg() {
      if (this.coverimg.length > 0) {
        return `http://m.czgdly.com/transportation/scenicspotsTickets/imgbase/index.asp?url=${
          this.coverimg[this.currentpicked]
        }`;
      } else {
        return "";
      }
    }
  },
  watch: {
    currentpicked(nv, ov) {
      console.log("change", nv);
      this.imgpickershow = false;
    }
  },
  methods: {
    onClickLeft() {
      this.imgpickershow = false;
    },
    handleimgpickershow() {
      this.imgpickershow = true;
    },
    handleback() {
      this.shareimgshow = false;
    },
    async handleCreateImg() {
      Toast.loading({ duration: 0, forbidClick: true, message: "加载中...." });
      //console.log("???",html2canvas);
      // if (this.imgurl !== "") {
      //   Toast.clear();
      //   this.imgshow = true;
      //   return;
      // }
      if (this.lasttimecreateimgUrl == this.initimg) {
        Toast.clear();
        this.imgshow = true;
        return;
      }
      // html2canvas(document.querySelector("#sharecontent"), {
      //   allowTaint: false,
      //   useCORS: true,
      //   logging: true
      // }).then(canvas => {
      //   // document.body.appendChild(canvas);
      //   this.b64 = canvas.toDataURL("image/png");
      //   this.imgurl = this.b64;
      //   this.imgshow=true;
      // });

      const bs64 = await this.createImage();
      this.imgurl = bs64;
      this.imgshow = true;
      this.lasttimecreateimgUrl = this.initimg;
      Toast.clear();
    },
    handleShowpop(e) {
      const isteach = window.localStorage.getItem("isteach") || null;
      console.log(e.x);
      if(e.x===0){
        this.isTrueclick=false;
      }else{
        this.isTrueclick=true;
      }
      if (!isteach) {
        Dialog.alert({
          title: "提示",
          message: "点击图片可以选择不同的图片"
        }).then(() => {
          window.localStorage.setItem("isteach", true);
        });
      }
      this.shareimgshow = true;
    },
    createImage() {
      return new Promise((resolve, reject) => {
        html2canvas(document.querySelector("#sharecontent"), {
          allowTaint: false,
          useCORS: true,
          logging: true
        })
          .then(canvas => {
            // document.body.appendChild(canvas);
            resolve(canvas.toDataURL("image/png"));

            // this.imgurl = this.b64;
            // this.imgshow=true;
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
</script>

<style lang="scss">
.share {
  .icon {
    line-height: 63px;
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 25px;
  }
}
.imgpop {
  width: 100%;
  // height: 100%;
  // // display: grid;
  // justify-content: center;
  // align-items: center;
  background: rgba(0, 0, 0, 0);
}
.img-content {
  // background-color: #fff;
  // padding: 10px;
  // position: fixed;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  position: relative;
  width: 100%;
  height: auto;
  // background-color: #fff;
  &::after {
    content: "";
    width: 0;
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
  .share-ccc {
    padding: 10px;

    background: #b92b27; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to bottom,
      #1565c0,
      #b92b27
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #1565c0, #b92b27);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  .conttt {
    border-radius: 6px;
    overflow: hidden;
  }
  .shadow1 {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  .img {
    background-color: #fff;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-size: 100% 100%;
    // padding: 10px;
    img {
      width: 100%;
      height: 100%; // border-radius: 5px;
    }
  }
  .title {
    color: #666;
    text-align: left;
    font-weight: bold;
    font-size: 18px;
    background-color: #fff;
  }
  .price {
    background-color: #fff;
    text-align: right;
    color: red;
    em {
      font-style: normal;
      font-size: 12px;
    }
    span {
      font-weight: bold;
      font-style: normal;
      font-size: 16px;
    }
  }
  .text-content {
    background-color: #fff;
    padding: 0 10px;
  }
  .contact-ccc {
    background-color: #fff;
  }
  .contact {
    height: 65px;
    line-height: 65px;
    display: inline-block;
    margin: 0 auto;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .qrcode {
      float: left;
    }
    .info {
      height: 100%;
      float: left;
      line-height: 30px;
      text-align: left;
    }
  }
  .createimg {
    // z-index: 5000;
    // position: absolute;
    // bottom: -10px;
    right: 10px;
    width: 80%;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: #1864be;
    color: #fff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
}
.downloadimg {
  width: 100%;
  height: auto;
}
.button-share {
  padding-top: 15px;
}
.imgpicker {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .img-p-content {
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .img-item {
      input[type="radio"]:checked ~ .check {
        border: 5px solid #0dff92;
      }
      input[type="radio"]:checked ~ .check::before {
        background: #0dff92;
      }
      input[type="radio"]:checked ~ label {
        color: #0dff92;
      }
      width: 33.33%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
$color1: #f4f4f4;
$color2: #3197ee;
.radio {
  margin: 5px;
  input[type="radio"] {
    position: absolute;
    opacity: 0;
    + .radio-label {
      position: relative;
      &:before {
        content: "";
        background: $color1;
        border-radius: 100%;
        border: 1px solid darken($color1, 25%);
        display: inline-block;
        width: 1.4em;
        height: 1.4em;
        position: absolute;
        top: -0.2em;
        margin-right: 1em;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
        transition: all 250ms ease;
      }
    }
    &:checked {
      + .radio-label {
        &:before {
          background-color: $color2;
          box-shadow: inset 0 0 0 4px $color1;
        }
      }
    }
    &:focus {
      + .radio-label {
        &:before {
          outline: none;
          border-color: $color2;
        }
      }
    }
    &:disabled {
      + .radio-label {
        &:before {
          box-shadow: inset 0 0 0 4px $color1;
          border-color: darken($color1, 25%);
          background: darken($color1, 25%);
        }
      }
    }
    + .radio-label {
      &:empty {
        &:before {
          margin-right: 0;
        }
      }
    }
  }
}
#sharepicc{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

