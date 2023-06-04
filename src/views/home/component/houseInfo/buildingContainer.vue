<template>
    <div class="building-container">
      <div class="grid-building-title">
        {{ title }}
      </div>
      <div class="building-box">
        <div
          class="building-item-box"
          :key="buildingData[index].properties.building"
          v-for="(item, index) in getCurrentBuilding">
          <div class="building-title">
            {{ buildingData[index].properties.building }}
          </div>
          <div class="unit-container">
            <div
                class="unit-item"
                v-for="unit in item"
                :key="unit.properties.unit_id"
                @click="detail(unit)">
              {{ unit.properties.unit }}
            </div>
          </div>
        </div>
      </div>
      <HouseDetail ref="hd"/>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { AreaStore } from '@/store/areaDetail'
import HouseDetail from '@/views/home/component/houseInfo/HouseDetail.vue'
import { MapClass } from '@/map'
import {getData} from "@/api";

@Component({
  name: 'buildingContainer',
  components: {
    HouseDetail
  }
})
export default class buildingContainer extends Vue {
  buildingData: any[] = []
  unitData: any[] = []

  building: any = []
  getBuilding: any = []
  getCurrentBuilding:any = []
  title: string = ''

  unit: any = []

  mounted(){
    this.init()
  }

  async init(){
    const cName:any = this.$route.query.name || '月亮湖社区'
    const buildResult:any = await getData('building', cName)
    const unitResult:any = await getData('unit', cName)

    this.building = buildResult.data
    this.getBuilding = this.building.features.filter((item: any) => item.properties.grid_id == AreaStore.gridId).sort((a: any, b: any) => a.properties.building_id - b.properties.building_id)
    this.title = this.getBuilding[0].properties.grid

    this.unit = unitResult.data
    this.getCurrentBuild()
  }

  getCurrentBuild(){
    this.buildingData = this.building.features.filter((item: any) => item.properties.grid_id == AreaStore.gridId).sort((a: any, b: any) => a.properties.building_id - b.properties.building_id)

    this.getCurrentBuilding = this.buildingData.map((item: any) => {
      return this.unit.features.filter((curUnit: any) => curUnit.properties.building_id && curUnit.properties.building_id === item.properties.building_id).sort((a: any, b: any) => a.properties.unit_id - b.properties.unit_id)
    })
  }

  // 获取当前单元下的室信息
  handleActiveUnit (unitId: string): void {
    // const filterUnit = this.unit.features.filter((item: any) => item.properties.unit_id === unitId)
    const filterUnit = this.unit.features.filter((item: any) => item.properties)
    AreaStore.updateGrid(filterUnit[0].properties)
    MapClass.level5.changeToLevel(filterUnit, unitId)
  }


  detail (un: any) {
    // 更新当前位置为网格
    AreaStore.updateCurNav('unit')

    const {
      community, grid, building, unit, building_id
    } = un.properties
    console.log('un',un);
    console.log('community',community);
    
    const matchBuild = this.buildingData.find(b=>{
      return b.properties.building_id === building_id
    })
    const firstPoint = matchBuild.geometry.coordinates[0][0][0]
    MapClass.buildingPolygonLayer.layer.flyTo({
      center: firstPoint,
      zoom: 18
    })

    const m = new MapClass()
    console.log('matchBuild',matchBuild);
    
    m.matchBuildLine(matchBuild)

    const adr = `${community}-${grid}-${building}-${unit}`
    AreaStore.updateAdr(adr)
    this.$bus.emit("initPanel", adr)
    this.handleActiveUnit(un.properties.unit_id)
  }
}
</script>

<style lang="scss" scoped>
  .building-container {
      height: 100%;
    .grid-building-title {
      text-align: center;
      font-size: 20px;
      color: #fffa81;
    }
    .building-box {
      height: calc(100% - 34px);
      overflow: auto;
      .building-item-box {
        .building-title {
            font-size: 20px;
            /* height: 30px; */
            line-height: 30px;
            padding: 2% 2% 0 4%;
            color: rgb(255, 250, 129);
            font-size: 18px;
        }
        .unit-container {
            padding: 3% 8%;
            display: flex;
            flex-wrap: wrap;
            .unit-item {
              display: inline-block;
              background-image: url(~@/assets/img/unit-bg.png);
              background-size: 100% 100%;
              flex-basis: 85px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              font-size: 14px;
              font-weight: 500;
              color: #00FFBC;
              margin: 10px 20px;
              cursor: pointer;
            }
        }
      }
    }
    .building-box::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /*滚动条滑块*/
    .building-box::-webkit-scrollbar-thumb {
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        // background: rgb(0, 0, 0, 0.7)
        background-color: #05E3D0;
    }

    /*滚动条里面轨道*/
    .building-box::-webkit-scrollbar-track {
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
    }
    /*滚动条的小边角*/
    .room-box::-webkit-scrollbar-corner {
        background: transparent;
    }
  }
</style>
