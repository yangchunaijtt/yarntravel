import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state:{
    direction: "forward",
    isLoading:false,
    traversInfo:[],
    // productID:-1,
  },
  mutations:{
    // SETPRODUCTID(state,id){
    //   state.productID=id;
    // },
    REMOVELASTTRAVEL(state) {
      state.traversInfo.pop();
    },
    CLEARTRAVELERS(state) {
      state.traversInfo.length = 0;
    },
    ADDTRAVERS(state,traver){ //添加游客信息；
      state.traversInfo.push(traver)
    },
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    },
    // updatebackStatus(state,payback){
    //   state.isback=payback.isback;
    // },
    // updateDirection(state,direction){
    //   state.direction=direction
    // },
    updateLoadingStatus(state,payload){
      state.isLoading=payload.isLoading
    },
  }
})