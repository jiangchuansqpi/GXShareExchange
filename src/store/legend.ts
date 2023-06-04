import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from './index'

export interface LegendData {
    data: any
}

@Module({
  name: 'legend',
  dynamic: true,
  store
})
export default class Legend extends VuexModule implements LegendData {

    data= {}

    @Mutation
    updateLegend (payload: any): void {
      this.data = payload
    }
}
export const LegendStore = getModule(Legend)
