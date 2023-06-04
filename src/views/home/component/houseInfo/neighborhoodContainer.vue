<template>
  <div class="neighborhood-container">
    <div class="neighborhood-title">
      {{neighborhoodName}}
    </div>
    <div class="neighborhood-box">
      <div
          :class="['neighborhood-item', item.neighborhood === neighborhoodId ? 'neighborhood-item-active' : '']"
          v-for="(item) in neighborhoodData"
          :key="item.neighborhood_id">
        <p
            style="cursor: pointer"
            v-if="item.neighborhood_id"
            @click="() => handleActiveArea(item.neighborhood_id)">
          {{ item.neighborhood }}
        </p>
        <p v-else class="no-click">{{ item.neighborhood }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator'
import {MapClass} from '@/map'
import {AreaStore} from "@/store/areaDetail";
const city1 = require('../../../../assets/geojson/city.json')
const township1 = require('../../../../assets/geojson/township.json')
const neighborhood1 = require('../../../../assets/geojson/neighborhood.json')
@Component({
  name: 'neighborhoodContainer'
})
export default class neighborhoodContainer extends Vue {
  neighborhoodData: string[] = [] 
  neighborhood: any =neighborhood1
  neighborhoodPloy:any = {}
  district:any=''
  province:any=''
  township:any=''
  get neighborhoodId(){
    return AreaStore.neighborhoodId
  }
  get neighborhoodName(){
    const temp = township1.features.filter((f:any)=>{
      return f.properties.township_id === AreaStore.townshipId
    })
    return temp[0].properties.township
  }

  initData(){
    // console.log('district1',district1);
    // console.log('neighborhood1',neighborhood1);
    this.neighborhoodPloy=neighborhood1
    this.neighborhoodData=neighborhood1.features.map((item:any)=>item.properties).filter((f:any)=>{
      return f.township_id === AreaStore.townshipId 
    })
    this.neighborhood=this.neighborhoodData[0]
    console.log('this.neighborhoodPloy',this.neighborhoodPloy);
    console.log('this.neighborhoodData',this.neighborhoodData);
    console.log('this.neighborhood',this.neighborhood);
    //存储页面标题
    const {city,province}:any=city1.features[0].properties
    AreaStore.updateHeadTitle(`${province}${city}`)
  }
  handleActiveArea (neighborhoodId: any):void {
    // 更新当前位置为社区级网格
    AreaStore.updateCurNav('neighborhood')
    console.log('要变成社区级');
    console.log('neighborhoodId',neighborhoodId);
    const filter:any = this.neighborhoodData.find((g:any)=>{
    return g.neighborhood_id === neighborhoodId
    })
    console.log('filter', filter)
    AreaStore.updateneighborhoodId(filter.neighborhood_id)
    let adr = `${filter.neighborhood}`
    console.log('adr',adr);
    AreaStore.updateAdr(adr)
    MapClass.level3.changeToLevel(neighborhoodId)
  }

  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.neighborhood-container {
  .neighborhood-title {
    text-align: center;
    font-size: 20px;
    color: #fffa81;
  }

  .neighborhood-box {
    padding: 6% 24%;

    .neighborhood-item {
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

    .neighborhood-item-active {
      background-image: url(~@/assets/img/grid-active-bg.png);
      font-size: 14px;
      font-weight: 600;
      color: #091A48;
    }
  }
}
</style>
