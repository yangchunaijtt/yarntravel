<template>
  <div class="typecom">
    <div class="up">
      <p>
        <span>景点主题</span>
      </p>
    </div>
    <div class="down">
      <ul>
        <li v-if="item.title" :class="{'choosed':item.choose}" v-for="(item,index) in c_typelist" :key="index" @click="clickitem(item,index)">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "typecom",
  data() {
    return {
      lastchoose: 0
    };
  },
  props: {
    typelist: {
      type: Array,
      default: []
    }
  },
  computed: {
    c_typelist() {
      return this.typelist;
    }
  },
  methods: {
    clickitem(item, index) {
      this.c_typelist.forEach(element => {
          element.choose=false;
      });
      // console.log("孙子",this.lastchoose);

      // this.c_typelist[this.lastchoose].choose = false;
      this.c_typelist[index].choose = true;
      // this.lastchoose = index;
      // console.log("孙子",this.c_typelist);
      // // console.log("孙子",this.c_typelist);
      // console.log("孙子",this.lastchoose);
      
      this.$emit("update:typelist", this.c_typelist);
      this.$emit("change",this.c_typelist[index],index);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/pub";
.typecom {
  .up {
    padding: 10px;
    font-size: 15px;
    text-align: left;
  }
  .down {
    ul {
      // @include flexbox(row,flex-start,center);
      // flex-wrap: wrap;
      height: auto;
      &::after {
        content: "";
        clear: both;
        display: block;
      }
      .choosed {
        border: 1px solid rgb(18, 150, 219);;
        color: rgb(18, 150, 219);;
      }
      li {
        &:nth-child(3n + 1) {
          margin-left: 5px;
        }
        background-color: #f4f4f4;
        margin-bottom: 5px;
        margin-right: 5px;
        font-size: 15px;
        float: left;
        padding: 5px 0;
        box-sizing: border-box;
        width: 31%;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
    }
  }
}
</style>
