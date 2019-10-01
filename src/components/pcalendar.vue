<template>
  <div class="calendar" v-if="visable">
    <div class="weekcontain">
      <ul>
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="cont">
        <div class="dateContains" v-for="(item,index) of monthList" :key="index">
          <div class="datedetails">
            {{item.year+'年'+item.month+'月'}}
          </div>
          <div class="dayscontain">
            <ul>
              <li :class="{ 'father':isStartAndend(item.year,item.month,value),'unablechoosed':ispast(item.year,item.month,value)||getpriceShow(item.year,item.month,value)==''}" v-for="(value,i) of item.day" :key="i">
                <div class="item-show" :class="{'havechoose':isInchoose(item.year,item.month,value)}" @click="clickDate(item.year,item.month,value)" v-if="value!=-1">
                  <p class="date">{{value}}</p>
                  <p class="lowestprice">{{getpriceShow(item.year,item.month,value)}} </p>
                </div>
                <div v-if="Tipcanshow&&isclick(item.year,item.month,value)" class="calendat-tip">
                  {{status==0?'游玩':'游玩'}}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/**
 * @description
 * step1:生成从包括当前月份在内的6个月的日历（直接生成）
 * */
import moment from "moment";
import BScroll from "better-scroll";
export default {
  name: "calendar",
  data() {
    return {
      choosestatus: "startdate",
      windowHeight: 667,
      DateNum: {
        year: -1,
        month: -1,
        date: -1
      },
      Tipcanshow: false,
      timer: null,
      status: 0,
      // choosedArray: {
      //   start: {
      //     year: -1,
      //     month: -1,
      //     date: -1
      //   },
      //   end: {
      //     year: -1,
      //     month: -1,
      //     date: -1
      //   }
      // },
      monthList: null
    };
  },
  components: {},

  watch: {
    visable(newValue, oldValue) {
      console.log("日历组件的显示", newValue);
      if (newValue == true) {
        this.$nextTick(() => {
          let h =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
          this.$refs.wrapper.style.height = h - 50 + "px";
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true
          });
        });
      }
    }
  },
  props: {
    priceList: {
      type: [Map]
    },
    clicktodispear: {
      type: [Number],
      default: -1
    },
    choosedArray: {
      type: [Object],
      default: function() {
        return {
          start: {
            year: -1,
            month: -1,
            date: -1
          },
          end: {
            year: -1,
            month: -1,
            date: -1
          }
        };
      }
    },
    visable: {
      type: [Boolean],
      default: false
    }
    // choosestatus: {
    //   type: [String],
    //   default: "startdate"
    // }
  },
  methods: {
    getpriceShow(year, month, day) {
      const price = this.priceList.get(
        moment(`${year}/${month}/${day}`).format("YYYY-MM-DD")
      );
      if (!price) {
        return "";
      }
      return `￥${price.price}`;
      // if (price.b2bPrice - price.sellPrice > 0) {
      //   return `￥${price.b2bPrice}`;
      // } else {
      //   return `￥${price.marketPrice}`;
      // }
      // return price?`￥${price.marketPrice}`:'';
    },
    //判断是否点击
    isclick(year, month, date) {
      if (
        this.DateNum.year == year &&
        this.DateNum.month == month &&
        this.DateNum.date == date
      ) {
        return true;
      } else {
        return false;
      }
    },

    // enabletochoose(year, month, date) {
    //   //判断是否在选择之前 有待商榷
    //   if (this.choosedArray.start.year != -1) {
    //     if (year < this.choosedArray.start.year) {
    //       console.log("年");
    //       return true;
    //     } else {
    //     }
    //   }
    // },
    isStartAndend(year, month, date) {
      if (typeof this.choosedArray == "undefined") {
        let startYear = this.choosedArray.start.year;
        let startMonth = this.choosedArray.start.month;
        let startDate = this.choosedArray.start.date;
        if (startYear == year && startMonth == month && startDate == date) {
          return true;
        }
        let endYear = this.choosedArray.end.year;
        let endMonth = this.choosedArray.end.month;
        let endDate = this.choosedArray.end.date;
        if (endYear == year && endMonth == month && endDate == date) {
          return true;
        }
      }

      return false;
    },
    //判断是否在这个区间
    isInchoose(year, month, date) {
      // console.log("isInchoose",this.choosedArray)
      if (typeof this.choosedArray == "undefined") {
        return false;
      }
      if (
        this.choosedArray.end.year == -1 &&
        this.choosedArray.start.year != -1
      ) {
        //只有開始日期的情況
        // console.log("只有开始");
        let o_startYear = this.choosedArray.start.year;
        let o_startMonth = this.choosedArray.start.month;
        let o_startDate = this.choosedArray.start.date;
        if (
          o_startYear == year &&
          o_startMonth == month &&
          o_startDate == date
        ) {
          return true;
        } else {
          return false;
        }
      } else if (
        this.choosedArray.end.year != -1 &&
        this.choosedArray.start.year != -1
      ) {
        //開始和結束都有的情況下
        // console.log("开始和结束都有");
        let startDate = new Date(
          this.choosedArray.start.year,
          this.choosedArray.start.month - 1,
          this.choosedArray.start.date
        );
        let endDate = new Date(
          this.choosedArray.end.year,
          this.choosedArray.end.month - 1,
          this.choosedArray.end.date
        );
        let chooseDate = new Date(year, month - 1, date);
        let formartstartDate = Date.parse(startDate);
        let formartendDate = Date.parse(endDate);
        let formartchooseDate = Date.parse(chooseDate);
        // console.log("开始时间",formartstartDate);
        // console.log("结束时间",formartendDate)
        // console.log("区间",formartchooseDate)
        if (
          formartstartDate <= formartchooseDate &&
          formartchooseDate <= formartendDate
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    //判断是否是过去
    ispast(year, month, date) {
      let nowdate = this.getCurrentDate();
      if (
        year == nowdate.year &&
        month == nowdate.month &&
        nowdate.date > date
      ) {
        return true;
      }
      return false;
    },
    clickDate(year, month, date) {
      //点击事件
      if (this.getpriceShow(year, month, date) == "") {
        return;
      }
      console.log("失灵？", this.choosestatus);
      let dateobj_nowchoose = new Date(year, month - 1, date);
      let formate_now_date = Date.parse(dateobj_nowchoose);
      if (this.timer != null) {
        clearTimeout(this.timer);
      }
      if (this.choosestatus == "enddate") {
        let dateobj_start = new Date(
          this.choosedArray.start.year,
          this.choosedArray.start.month - 1,
          this.choosedArray.start.date
        );
        let formate_start_date = Date.parse(dateobj_start);

        console.log("入住时间", dateobj_start);
        console.log("现在选择的时间", dateobj_nowchoose);
        if (formate_now_date < formate_start_date) {
          console.log("小雨了");
          return;
        }
      }
      if (this.choosestatus == "startdate") {
        let dateobj_end = new Date(
          this.choosedArray.end.year,
          this.choosedArray.end.month - 1,
          this.choosedArray.end.date
        );
        let formate_end_date = Date.parse(dateobj_end);
        if (formate_end_date < formate_now_date) {
          console.log("开始日期大于结束日期");
          this.choosedArray.end.year = -1;
          this.choosedArray.end.month = -1;
          this.choosedArray.end.date = -1;
          this.$emit("update:choosedArray", {
            startdate: new Date(
              this.choosedArray.start.year,
              this.choosedArray.start.month - 1,
              this.choosedArray.start.date
            ),
            enddate: null
          });
        }
      }
      if (!this.ispast(year, month, date) && date != -1) {
        console.log("过去判断", this.ispast(year, month, date));
        console.log("过去判断", date);
        this.DateNum.year = year;
        this.DateNum.month = month;
        this.DateNum.date = date;

        console.log(year + "-" + month + "-" + date);
        this.Tipcanshow = true;
        this.timer = setTimeout(() => {
          this.Tipcanshow = false;
        }, 1000);
        if (this.choosestatus == "startdate") {
          this.status = 0;
        } else if (this.choosestatus == "enddate") {
          this.status = 1;
        }
        switch (this.status) {
          case 0:
            this.choosedArray.start.year = year;
            this.choosedArray.start.month = month;
            this.choosedArray.start.date = date;
            this.choosedArray.end.year = -1;
            this.choosedArray.end.month = -1;
            this.choosedArray.end.date = -1;
            this.status = 1;
            break;
          case 1:
            this.choosedArray.end.year = year;
            this.choosedArray.end.month = month;
            this.choosedArray.end.date = date;
            this.status = 0;
            break;
        }
        this.$emit("getClickDate", this.choosedArray);
        console.log(this.choosedArray);
        if (this.choosestatus == "startdate") {
          this.choosestatus = "startdate";
          this.$emit("hiddencandendar");
          // this.status = 0;
        } else {
          this.choosestatus = "enddate";
        }
      }
      if (this.clicktodispear != -1) {
        this.$emit("clickdispear");
      }
    },
    getDaysInOneMonth(year, month) {
      //获得每个月的天数
      month = parseInt(month, 10);
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    getCurrentDate() {
      //获得今天的日期
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1; //-1
      let date = now.getDate();
      let week = now.getDay();
      return {
        year: year,
        month: month,
        date: date,
        week: week
      };
    },
    getInitMonth(date_obj, index) {
      //获得月份第一天的信息,星期几
      let c_date = new Date(date_obj.year, date_obj.month - 1 + index, 1);
      let c_week = c_date.getDay();
      date_obj.week = c_week;
      date_obj.date = 1;
      date_obj.month = c_date.getMonth() + 1;
      date_obj.year = c_date.getFullYear();
      return date_obj;
    }
  },
  created() {
    //确定当前的日期
    let dd = [];
    let total = [];
    //console.log("月份的第一天的信息", initMonth);
    //生成一个月的数组
    let initnum = 0;
    for (let i = 0; i < 3; i++) {
      let initMonth = this.getInitMonth(this.getCurrentDate(), i); //第一个月份的信息的第一天的信息
      let monthdays = this.getDaysInOneMonth(initMonth.year, initMonth.month);
      console.log("生成月份是", initMonth.month);
      console.log("天数是", initMonth.week);
      for (let j = 0; j < 36; j++) {
        if (j < initMonth.week) {
          dd.push(-1);
        } else {
          initnum++;
          if (initnum > monthdays) {
            dd.push(-1);
          } else {
            dd.push(initnum);
          }
        }
      }
      total.push({
        year: initMonth.year,
        month: initMonth.month,
        day: dd
      });
      dd = [];
      initnum = 0;
    }
    this.monthList = total;
    console.log("月份数组", total);
  },
  mounted() {
    console.log("重新计算?");
    // let sd = new Date();
    // let ed = new Date();
    // sd.setDate(sd.getDate() + 3);
    // ed.setDate(sd.getDate() + 3);
    // this.choosedArray.start.year = sd.getFullYear() + "";
    // this.choosedArray.start.month = sd.getMonth() + 1 + "";
    // this.choosedArray.start.date = sd.getDate() + "";
    // this.choosedArray.end.year = ed.getFullYear() + "";
    // this.choosedArray.end.month = ed.getMonth() + 1 + "";
    // this.choosedArray.end.date = ed.getDate() + "";
    this.$nextTick(() => {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      this.$refs.wrapper.style.height = h - 46 + "px";
    });
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.calendar {
  color: #666;
  padding-top: 20px;
  box-sizing: border-box;
  position: relative;
}

.weekcontain {
  position: absolute;
  top: 0px;
  width: 100%;
}

.calendat-tip {
  position: absolute;
  z-index: 2;
  top: -37px;
  right: 6px;
  background-color: #08a9e5;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-weight: 40px;
}

.calendat-tip:before {
  display: inline-block;
  width: 0;
  height: 0;
  border: solid transparent;
  border-width: 10px;
  border-top-color: #08a9e5;
  content: "";
  position: absolute;
  top: 40px;
  right: 8px;
}

.weekcontain ul {
  display: flex;
  flex-direction: row;
  list-style: none;
  flex-flow: nowrap;
}

.weekcontain ul li {
  width: 14%;
}

.dayscontain {
  margin-top: 10px;
}

.dayscontain ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
}

.dayscontain ul li {
  width: 14%;
  height: 44px;
  padding: 5px;
  position: relative;
}

.item-show {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* margin: 10px; */
  height: 100%;
  margin-top: 10px;
  border-radius: 5px;
}

.father .havechoose {
  background-color: orange;
}

li .havechoose {
  background-color: rgba(255, 165, 0, 0.65);
}

.two {
  background-color: orange;
}

.unablechoosed {
  color: rgba(6, 6, 6, 0.2);
}

.wrapper {
  margin-top: 10px;
}

.wrapper {
  height: 380px;
  overflow: hidden;
}
.dateContains {
  background-color: #fff;
}
.lowestprice {
  font-size: xx-small;
}
</style>
