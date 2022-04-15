import { createStore } from "vuex";
import getters from "./getters";
import {SET_ROUTES, SET_SCREEN_WIDTH} from "@/store/mutation-types";

const store = createStore({
  modules: {
  },
  state: () => {
    return {
      routes: [],
      screenWidth: 0
    }
  },
  getters,
  mutations: {
    [SET_ROUTES]: (state, routes) => {
      state.routes = routes;
    },
    [SET_SCREEN_WIDTH]: (state, screenWidth) => {
      state.screenWidth = screenWidth;
    },
  },
  actions: {

  },

});

export default store;
