<template>
  <div class="css_travelpeoples">
    <div class="tip_css_cont">
      <p class="css_tip">游客姓名</p>
      <p class="css_tip small">{{tipinfo}}</p>
    </div>
    <!-- {{errcount}} -->
    <travel-people @reomve-errors="removeErrors"
                   @Errors="getErrors"
                   v-for="(item,index) in travelpeopleArray"
                   :key="index"
                   :index="index"
                   :traveller="traveller"
                   :cardType="traveller.credentialsType"></travel-people>
  </div>
</template>

<script>
import travelpeople from "./travelpeople";
export default {
  components: {
    "travel-people": travelpeople
  },
  data() {
    return {
      errorArr: [],
      errcount: 0,
      errmap: new Map(),
      tipinfo: ""
    };
  },
  props: {
    traveller: {
      type: Object,
      default: {},
      required: true
    },
    travelpeoplenums: {
      type: Number,
      default: 1
    }
  },
  computed: {
    // cardType() {
    //   switch (this.traveller.credentials) {
    //     case "ID_CARD":
    //       return "身份证";
    //       break;
    //     case "HUZHAO":
    //       return "护照";
    //       break;
    //     case "GANGAO":
    //       return "港澳通行证";
    //       break;
    //     case "TAIBAO":
    //       return "台湾通行证";
    //       break;
    //   }
    // },
    // itemshowList() {
    //   // if(this.travelpeoplenums>0)
    //   return [
    //     this.formatetravel(this.traveller.name),
    //     this.formatetravel(this.traveller.mobile),
    //     this.formatetravel(this.traveller.enName),
    //     this.formatetravel(this.traveller.email),
    //     this.formatetravel(this.traveller.credentials)
    //   ];
    // },
    travelpeopleArray() {
      let arr = null;
      console.log("this.traveller.name", this.traveller.name);
      if (this.traveller.credentials == "TRAV_NUM_ALL") {
        this.tipinfo = "依据该景点规定在线预定需要填写所有游玩人的信息";
        arr = Array(this.travelpeoplenums);
        // arr[0]=this.orderpeopleinfo;
        arr.fill({});
        return arr;
      } else {
        this.tipinfo = "依据该景点规定在线预定需要填写一个游玩人的信息";
        arr = Array(1);
        arr[0] = {};
        return arr;
      }
      //  else if (this.traveller.name == "TRAV_NUM_NO") {
      //   return [];
      // }
    }
  },
  mounted() {
    this.$emit("isError", this.errorArr);
  },
  methods: {
    removeErrors() {
      this.errorArr.pop();
    },
    getErrors(index, ec) {
      console.log("验证", ec);
      this.errorArr.push(ec);
      // this.errcount=0;
      // this.errmap.set(index,ec);
      // console.log('map',index,ec);
      // this.errmap.forEach(element => {
      //   console.log(element);
      //   this.errcount+=element;
      // });
      // this.$emit('isError',this.errcount?false:true);
    }
    // formatetravel(t = "TRAV_NUM_NO") {
    //   switch (t) {
    //     case "TRAV_NUM_NO":
    //       return false;
    //       break;
    //     case "TRAV_NUM_ONE":
    //     case "TRAV_NUM_ALL":
    //       return true;
    //       break;
    //   }
    // }
  }
};
</script>

<style lang="scss">
.css_travelpeoples {
  .tip_css_cont {
    padding: 10px;
    .css_tip {
      text-align: left;
    }
    .small {
      font-size: 12px;
    }
  }
}
</style>
