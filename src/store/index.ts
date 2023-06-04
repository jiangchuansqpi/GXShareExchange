import Vue from 'vue'
import Vuex from 'vuex'
import { AreaData } from './areaDetail'
import { SearchData } from './search'
import { LegendData} from "@/store/legend";

Vue.use(Vuex)

interface allState {
  AreaData: AreaData,
  SearchData: SearchData,
  LegendData: LegendData
}

export default new Vuex.Store<allState>({
})
