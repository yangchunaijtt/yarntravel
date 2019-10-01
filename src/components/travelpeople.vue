<template>
  <div class="css_travelpeople_item">
    <van-Field v-model="people.name" placeholder="请输入游客姓名" :error-message="errors.first('name')" v-validate="'required|min:2'" name="name" label="姓名" required v-if="showList[0]"></van-Field>
    <van-Field v-model="people.mobile" placeholder="请输入手机号" label="手机" v-validate="{required:true,mobile:true}" name="mobile" :error-message="errors.first('mobile')" required v-if="showList[1]"></van-Field>
    <van-Field v-model="people.enName" label="英文名" placeholder="请输入游客英文名" required v-if="showList[2]"></van-Field>
    <van-Field v-model="people.email" label="邮箱" placeholder="请输入邮箱" v-validate="{required:true,email:true}" name="email" required v-if="showList[3]" :error-message="errors.first('email')"></van-Field>
    <van-Field v-model="people.credentials" placeholder="证件号码" required v-if="showList[4]" name="cardid" v-validate="{required:true,card:currentCard,}" :error-message="errors.first('cardid')">
      <div class="label" slot="label">
        <typechoose :cardList="cardList" @typechanged="handlechangeCardtype"></typechoose>
      </div>

    </van-Field>
  </div>
</template>

<script>
import typechoose from "./typechoose";
import { mapGetters, mapMutations } from "vuex";
import { Collapse, CollapseItem, Field } from "vant";
export default {
  data() {
    return {
      // people: {name:'',mobile:'',enName:'',email:'',credentials:''},
      people: {},
      activeNames: true,
      currentCard: ""
    };
  },
  components: {
    "van-Field": Field,
    "van-collapse": Collapse,
    "van-collapse-item": CollapseItem,
    typechoose: typechoose
  },
  props: {
    traveller: {
      required: true
    },
    index: {
      required: true
    },
    cardType: {
      type: String,
      default: "",
      required: true
    },
    // showList: {
    //   type: Array,
    //   default: [true, true, true, true, true]
    // }
  },
  computed: {
    showList() {
      console.log("test",this.index);
      if (this.index >=1) {
        return [
          this.formatetravel(this.traveller.name),
          this.formatetravel(this.traveller.mobile),
          this.formatetravel(this.traveller.enName),
          this.formatetravel(this.traveller.email),
          this.formatetravel(this.traveller.credentials)
        ];
      } else {
        return [
          this.formatetravel(this.traveller.name),
          this.formatetravel(this.traveller.mobile),
          this.formatetravel(this.traveller.enName),
          this.formatetravel(this.traveller.email),
          this.formatetravel(this.traveller.credentials)
        ];
      }
    },
    getvalidateErrorCount() {
      return this.errors.count();
    },
    cardList() {
      let arr = this.cardType.split("-");

      return this.cardType.split(",");
    }
    // dd: {
    //   get:()=>{
    //     if(this.travelerinfo){
    //       console.log("newvalue", this.travelerinfo);
    //       return this.travelerinfo;
    //     }else{
    //       return {};
    //     }
    //   },
    //   set:(value)=>{
    //     console.log(value);
    //   }
    // }
  },
  methods: {
    formatetravel2(t = "TRAV_NUM_NO") {
      switch (t) {
        case "TRAV_NUM_NO":
        case "TRAV_NUM_ONE":
          return false;
          break;
        case "TRAV_NUM_ALL":
          return true;
          break;
      }
    },
    formatetravel(t = "TRAV_NUM_NO") {
      switch (t) {
        case "TRAV_NUM_NO":
          return false;
          break;
        case "TRAV_NUM_ONE":
        case "TRAV_NUM_ALL":
          return true;
          break;
      }
    },
    handlechangeCardtype(i) {
      this.currentCard = this.cardList[i];
      this.people.credentialsType=currentCard;
      console.log(this.currentCard);
    },
    ...mapMutations({
      addtravers: "ADDTRAVERS",
      removeLasttravers: "REMOVELASTTRAVEL"
    })
  },
  watch: {
    getvalidateErrorCount(nv, ov) {
      // console.log(this.$validator.validate());
      // validator.validate();
      // this.$emit('Errors',this.index,nv);
      // this.$emit('Errors',this.index,this.$validator);
      // console.log(nv,this.index);
    }
  },
  mounted() {
    // this.$validator.validate();
    console.log("添加游玩人数到store");
    this.currentCard = this.cardList[0];
    this.people.credentialsType=this.currentCard;
    this.addtravers(this.people);
    this.$emit("Errors", this.index, this.$validator);
  },
  beforeDestroy() {
    console.log("我要销毁了");
    this.$emit("reomve-errors");
    this.removeLasttravers(); //删除游客
  }
};
</script>

<style lang="scss">
.css_travelpeople_item {
  text-align: left;
}
</style>
