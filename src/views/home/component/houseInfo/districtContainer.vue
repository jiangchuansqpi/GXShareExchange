<template>
  <div class="district-container">
    <div class="district-title">
      {{city}}
    </div>
    <div class="district-box">
      <div
          :class="['district-item', (['贵池区'].includes(item.district)) ? 'district-item-active' : '']"
          v-for="(item) in districtData"
          :key="item.district_id">
        <p
            style="cursor: pointer"
            v-if="item.district_id"
            @click="() => handleActiveArea(item.district_id)">
          {{ item.district }}
        </p>
        <p v-else class="no-click">{{ item.district }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator'
import {AreaStore} from "@/store/areaDetail/index.ts";
import {MapClass} from '@/map'
const district1 = require('../../../../assets/geojson/district.json')
const city1 = require('../../../../assets/geojson/city.json')
// const township1=require('../../../../assets/geojson/township.json')
@Component({
  name: 'districtContainer'
})
export default class districtContainer extends Vue {
  districtData: string[] = []
  district: any = {}
  districtPloy:any = {}
  cityPloy:any = city1

  city:any=city1.features[0].properties.city
  province:any=''
  get districtId(){
    return AreaStore.districtId
  }

  initData(){
    console.log('district1',district1);
    this.districtPloy=district1
    this.districtData=district1.features.map((item:any)=>item.properties)
    this.district=this.districtData[0]
    console.log('this.districtPloy',this.districtPloy);
    console.log('this.districtData',this.districtData);
    console.log('this.district',this.district);
    //存储页面标题
    const {city,province}:any=city1.features[0].properties
    AreaStore.updateHeadTitle(`${province}${city}`)
  }
  handleActiveArea (districtId: any):void {
    // 更新当前位置为县级网格
    AreaStore.updateCurNav('district')
    console.log('要变成县级');
    console.log('districtId',districtId);
    const filter:any = this.districtData.find((g:any)=>{
      return g.district_id === districtId
    })
    console.log('filter', filter)
    AreaStore.updatedistrictId(filter.district_id)
    let adr = `${filter.district}`
    console.log('adr',adr);
    AreaStore.updateAdr(adr)
    // console.log(districtId,'districtId~~~~');
    // console.log(MapClass.level1,'MapClass.level1~~~~~');
    MapClass.level1.changeToLevel(districtId)
  }
  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.district-container {
  .district-title {
    text-align: center;
    font-size: 20px;
    color: #fffa81;
  }

  .district-box {
    padding: 6% 24%;

    .district-item {
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

    .district-item-active {
      background-image: url(~@/assets/img/grid-active-bg.png);
      font-size: 14px;
      font-weight: 600;
      color: #091A48;
    }
  }
}
</style>
