<template>
  <div class="township-container">
    <div class="township-title">
      {{townShipName}}
    </div>
    <div class="township-box">
      <div
          :class="['township-item', (['秋浦街道'].includes(item.township)) ? 'township-item-active' : '']"
          v-for="(item, index) in townshipData"
          :key="index">
        <p
            style="cursor: pointer"
            v-if="item.township_id"
            @click="() => handleActiveArea(item.township_id)">
          {{ item.township }}
        </p>
        <p v-else class="no-click">{{ item.township }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator'
import {MapClass} from '@/map'
import {AreaStore} from "@/store/areaDetail";
const cityDt = require('../../../../assets/geojson/city.json')
const district = require('../../../../assets/geojson/district.json')
const township = require('../../../../assets/geojson/township.json')
@Component({
  name: 'townshipContainer'
})
export default class townshipContainer extends Vue {
  townshipData: string[] = []
  township: any = {}
  townshipPloy:any = {}
  district:any=''
  province:any=''
  get townshipId(){
    return AreaStore.townshipId
  }

  get townShipName(){
    const temp = district.features.filter((f:any)=>{
      return f.properties.district_id === AreaStore.districtId
    })
    return temp[0].properties.district
  }

  initData(){
    this.townshipPloy = township
    this.townshipData = township.features.map((item:any)=>item.properties).filter((f:any)=>{
      return f.district_id === AreaStore.districtId
    })
    //存储页面标题
    const {city,province}:any = cityDt.features[0].properties
    AreaStore.updateHeadTitle(`${province}${city}`)
  }
  handleActiveArea (townshipId: any):void {
    // 更新当前位置为县级网格
    AreaStore.updateCurNav('township')
    const filter:any = this.townshipData.find((g:any)=>{
      return g.township_id === townshipId
    })
    AreaStore.updatetownshipId(filter.township_id)
    let adr = `${filter.township}`
    console.log('adr',adr);
    AreaStore.updateAdr(adr)
    MapClass.level2.changeToLevel(townshipId)
  }

  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.township-container {
  .township-title {
    text-align: center;
    font-size: 20px;
    color: #fffa81;
  }

  .township-box {
    padding: 6% 24%;

    .township-item {
      background-image: url(~@/assets/img/grid-bg.png);
      background-size: 100% 100%;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #00EAF7;
      line-height: 40px;
      padding: 10px;
      text-align: center;
      p{
        line-height: 15px;
        user-select: none;
      }
      .no-click{
        cursor: not-allowed;
      }
    }

    .township-item-active {
      background-image: url(~@/assets/img/grid-active-bg.png);
      font-size: 14px;
      font-weight: 600;
      color: #091A48;
    }
  }
}
</style>
