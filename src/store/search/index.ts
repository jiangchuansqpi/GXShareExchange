import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '../index'

export interface SearchData {
  visibile: boolean
}

@Module({
  name: 'search',
  dynamic: true,
  store
})

class Search extends VuexModule implements SearchData {
  visibile = false

  @Mutation
  updateVisible (payload: boolean): void {
    this.visibile = payload
  }
}
export const searchStore = getModule(Search)
