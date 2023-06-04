import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '../index'

export interface AreaData {
    level: number,
    cityId: string,
    gridId: string,
    unitId: string
}

@Module({
  name: 'areaDetail',
  dynamic: true,
  store
})
export default class AreaDetail extends VuexModule implements AreaData {
    level = 1
    gridId = ''
    grid = ''
    unitId = ''
    cityId=''
    city=''
    district=''

     //县级id
    districtId=''
    //县名字
    districtName=''

    //街道
    townshipId=''
    //街道名
    townshipName=''

    // 真正社区
    neighborhoodId=''
    neighborhoodName=''
    // 社区名称
    communityName = ''

    // 页面标题
    headTitle = ''

    // 当前位置
    curNav = 'community' || 'neighborhood'
    // curNav = 'neighborhood'
    
    // 当前位置为unit时，左侧面板点击时需要当前楼栋号和单元号
    adr_ = ''
    get levelData (): number {
      return this.level
    }

    @Mutation
    updateLevel (payload: number): void {
      this.level = payload
    }

    @Mutation
    updateCity (payload: string): void {
        this.city = payload
    }
    
    @Mutation
    getDistrictData (payload: string): void {
        this.district = payload
    }

    @Mutation
    updateCityId (payload: string): void {
      this.cityId = payload
    }

    @Mutation
    updateGrid (payload: string): void {
        this.grid = payload
    }

    @Mutation
    updateGridId (payload: string): void {
      this.gridId = payload
    }

    @Mutation
    updateUnitId (payload: string): void {
      this.unitId = payload
    }

    //添加一个县级的
    @Mutation
    updatedistrictId(payload:string):void{
      this.districtId=payload
    }

    @Mutation
    updatedistrictName(playload:string):void{
      this.districtName=playload
    }

    //添加一个街道级的
    @Mutation
    updatetownshipId(payload:string):void{
      this.townshipId=payload
    }

    //添加一个社区级的
    @Mutation
    updateneighborhoodId(payload:string):void{
      this.neighborhoodId=payload
    }

    @Mutation
    updateCommunityName (payload: string): void {
        this.communityName = payload
    }

    @Mutation
    updateHeadTitle (payload: string): void {
        this.headTitle = payload
    }

    @Mutation
    updateCurNav (payload: string): void {
        this.curNav = payload
    }

    @Mutation
    updateAdr (payload: string): void {
        this.adr_ = payload
    }
}
export const AreaStore = getModule(AreaDetail)
