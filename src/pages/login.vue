<template>
  <div class="login">
    <van-nav-bar title="登陆"
                 fixed
                 left-arrow
                 @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="手机号"
                 placeholder="请输入手机号"
                 :error="isPhoneerror"
                 :error-message="phoneerrorMessage"
                 v-model="phonenum">
      </van-field>
      <van-field center
                 v-model="sms"
                 label="短信验证码"
                 placeholder="请输入短信验证码"
                 icon="clear"
                 @click-icon="sms = ''">
        <van-button slot="button"
                    size="small"
                    type="primary"
                    @click="sendSms"
                    :disabled="canuse">{{buttonstr}}</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-button">
      <!-- <van-row>
        <van-col span="12"> -->
      <van-button size="normal"
                  bottom-action
                  class="buttong"
                  :loading="isloading"
                  @click="clicktologin"
                  :disabled="canlogin"> {{loginstr}}</van-button>
      <!-- </van-col>
      </van-row> -->

    </div>

  </div>
</template>

<script>
import { Row, Col, Field, NavBar, Cell, CellGroup, Button } from "vant";
export default {
  name: "login",
  components: {
    "van-cell-group": CellGroup,
    "van-field": Field,
    "van-button": Button,
    "van-nav-bar": NavBar,
    "van-col": Col,
    "van-row": Row
  },
  data() {
    return {
      currentuid: 0,
      phoneerrorMessage: "",
      fullPath: "/",
      canlogin: false,
      loginstr: "登陆",
      isloading: false,
      phonenum: "",
      sms: "",
      canuse: false,
      buttonstr: "发送验证码"
    };
  },
  computed: {
    isPhoneerror() {
      if (!this.$checkphone(this.phonenum)) {
        this.phoneerrorMessage = "手机号码格式不正确";
        this.canlogin = true;
      } else {
        this.phoneerrorMessage = "";
        this.canlogin = false;
      }
      return !this.$checkphone(this.phonenum);
    }
  },
  methods: {
    async clicktologin() {
      this.isloading = true;
      this.loginstr = "登陆中。。";
      this.canlogin = true;
      try {
        const res_login = await this.$axios.get(
          "http://m.czgdly.com/transportation/login/sendcode.asp",
          {
            params: {
              c: "2",
              tel: this.phonenum,
              name: this.phonenum,
              val: this.sms,
              wherefrom: this.$cookie.get("WHERE"),
              tuijian: window.localStorage.getItem("agency")
            }
          }
        );
        if (res_login.data.message == "success") {
          this.loginstr = "登陆成功";
          this.isloading = false;
          this.$cookie.set("gdmobileusername", this.phonenum, 1 * 60 * 60);
          this.$cookie.set(
            "USERIDGDLY",
            res_login.data.data.userid,
            1 * 60 * 60
          );
          this.$cookie.set("gdmobileuserphone", this.phonenum, 1 * 60 * 60);
          this.$cookie.set(
            "usersecret",
            res_login.data.data.usersecret,
            1 * 60 * 60
          );
          this.$cookie.set("userid", res_login.data.data.tuijian, 1 * 60 * 60); //推荐人 0 or 123123
          const res_getoaid = await this.$axios.get(
            "http://m.czgdly.com/transportation/getuserid.asp",
            {
              params: {
                mobile: this.phonenum
              }
            }
          );
          if (res_getoaid.data.error == 0) {
            if (res_getoaid.data.data.user_id != "0") {
              this.$cookie.set(
                "userid",
                res_getoaid.data.data.user_id,
                1 * 60 * 60
              ); //odid 0 or 123123
            }
          }
          console.log(typeof this.$cookie.get("userid"));
          if (this.$cookie.get("userid") === "0") {
            this.$cookie.set("userid", this.currentuid, 1 * 60 * 60); //uid 0 or 32532534
          }
          setTimeout(() => {
            //这里要跳转
            // console.log("要跳转的url", this.fullPath);
            this.$router.push(this.fullPath);
          }, 500);
        } else {
          this.isloading = false;
          this.loginstr = "验证码不正确";

          setTimeout(() => {
            this.canlogin = false;

            this.loginstr = "登陆";
          }, 2000);
        }
      } catch (error) {
        this.loginbuttonenabel = false;
        this.loginbuttonstatus = "登陆";
      }

      // this.$axios
      //   .get(
      //     "http://m.czgdly.com/transportation/login/sendcode.asp",
      //     {
      //       params: {
      //         c: "2",
      //         tel: this.phonenum,
      //         name: this.phonenum,
      //         val: this.sms,
      //         wherefrom: this.$cookie.get("WHERE"),
      //         tuijian: window.localStorage.getItem("agency")
      //       }
      //     }
      //   )
      //   .then(res => {
      //     console.log("登陆返回的信息", res.data.message);
      //     if (res.data.message == "success") {
      //       this.loginstr = "登陆成功";
      //       this.isloading = false;
      //       //this.$store.commit("setcercet", res.data.data.usersecret); //存入state中
      //       // this.$store.commit("setuserId", res.data.data.userid);
      //       // this.$store.commit("setUserPhone", this.contactMobile);
      //       this.$cookie.set("gdmobileusername", this.phonenum, 99);

      //       this.$cookie.set("USERIDGDLY", res.data.data.userid, 99);
      //       this.$cookie.set("gdmobileuserphone", this.phonenum, 99);
      //       this.$cookie.set("usersecret", res.data.data.usersecret, 99);
      //       this.$axios
      //         .get("http://m.czgdly.com/transportation/getuserid.asp", {
      //           params: {
      //             mobile: this.phonenum
      //           }
      //         })
      //         .then(res => {
      //           console.log("获取到的usid", res.data.data);
      //           if (res.data.error == 0) {
      //             // this.$cookie.set("userid", res.data.data.user_id, 7);
      //           } else {
      //             // this.$cookie.set("userid", "0", 7);
      //           }
      //         })
      //         .catch(res => {}); //需要去获得用户的来源；
      //       setTimeout(() => {
      //         //这里要跳转
      //         // console.log("要跳转的url", this.fullPath);
      //         this.$router.push(this.fullPath);
      //       }, 500);
      //     } else {
      //       this.isloading = false;
      //       this.loginstr = "验证码不正确";

      //       setTimeout(() => {
      //         this.canlogin = false;

      //         this.loginstr = "登陆";
      //       }, 2000);
      //     }
      //   })
      //   .catch(error => {
      //     console.log("出错啦");
      //     this.loginbuttonenabel = false;
      //     this.loginbuttonstatus = "登陆";
      //   });
    },
    sendSms() {
      let sec = 59;
      this.canuse = true;
      this.$axios
        .get("http://m.czgdly.com/transportation/login/sendcode.asp", {
          params: { tel: this.phonenum, c: "1" }
        })
        .then(res => {
          console.log("发送验证码返回的信息", res);
        })
        .catch(error => {});
      this.buttonstr = "60秒后重新发送";
      //发送验证码逻辑
      const smsloop = setInterval(() => {
        this.buttonstr = sec + "秒后重新发送";
        sec--;
        if (sec < 0) {
          this.buttonstr = "发送验证码";
          this.canuse = false;
          sec = 59;
          clearInterval(smsloop);
        }
      }, 1000);
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.fullPath = from.fullPath;
      vm.currentuid = to.query.uid || 0;
    });
  }
};
</script>

<style lang="scss">
.login {
  box-sizing: border-box;
  padding-top: 100px;
  .login-button {
    margin-top: 20px;
    padding: 0 20px;
    .buttong {
      border-radius: 5px;
    }
  }
}
</style>
