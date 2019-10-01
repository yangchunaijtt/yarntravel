<template>
  <div class="select-shaixuan">
    <div class="more" v-show="moreshow">
      <typecom @change="handlechange" :typelist.sync="theme"></typecom>
      <!-- <typecom :typelist.sync="cityList"></typecom> -->
    </div>
  </div>
</template>

<script>
//筛选
import typecom from "../components/typecom.vue";
import { Radio,Cell,CellGroup ,RadioGroup} from "vant";
export default {
  name: "selectphone",
  data() {
    return {
      moreshow: true,
      selectChoose:'',
      themeList:[{
        title:'不限',
        choose:true
      },{
        title:'主题乐园',
        choose:false
      },{
        title:'湖光山色',
        choose:false
      },{
        title:'温泉',
        choose:false
      },
      {
        title:'宗教祈福',
        choose:false
      },{
        title:'民俗风情',
        choose:false
      },{
        title:'动植物园',
        choose:false
      },
      {
        title:'田园度假',
        choose:false
      },
      ],
      cityList:[{
        title:'不限',
        choose:true
      },{
        title:'溧阳',
        choose:false
      },{
        title:'武进区',
        choose:false
      }]
    };
  },
  props:{
    theme:{
      default:[],
      required:true,
    },
    currentchoose:{
      default:0,
      required:true,
    }
  },
  components: {
    "van-radio": Radio,
    'van-radio-group':RadioGroup,
    'van-cell-group':CellGroup,
    'van-cell':Cell,
    'typecom':typecom
  },
  created() {},
  mounted() {
    const odiv = document.createElement("div");
    odiv.className = "modal";
    this.$root.$el.appendChild(odiv);
    console.log(odiv);
    odiv.onclick=(ev)=>{
      console.log('clicked');
      // odiv.canc
      ev.stopPropagation();
      this.$emit('disappear');
    }
    // for(let i=0;i<this.theme;i++){
    //   item.choose=false;
    //   this.$set(this.theme,i,item);
      
    // }
    console.log('this.theme',this.theme);
    console.log("this", this.currentchoose);
    // this.theme[this.currentchoose].choose=true;
    // this.$set(this.theme,this.currentchoose,this.theme[this.currentchoose]);

  },
  destroyed() {
    const mdiv = this.$root.$el.getElementsByClassName("modal");
    //console.log('mdiv',mdiv[0]);
    this.$root.$el.removeChild(mdiv[0]);
  },
  methods:{
    handlechange(ll,index){
      console.log('二级',ll);
      this.$emit('change',ll,index);
    }
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
.select-shaixuan {
  position: absolute;
  top: 90px;
  z-index: 10;
  background-color: #fff;
  width: 100%;
  height: auto;
  .more {
    width: 100%;
    height: auto;
    background-color: #fff;
    .typecom{
      background-color: #fff;
    }
  }
}

</style>
