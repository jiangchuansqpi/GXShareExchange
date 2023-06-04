<template>
  <div class="house-info-box">
    <div class="up-level" v-if="Level !== 1" @click="handleUpLevel">
      返回
      <br/>上级
    </div>
    <div class="title-box">
      {{
        Level === 1 ? '区域详情':
          Level === 2 ? '区域详情':
            Level === 3 ? '区域详情':
              Level === 4 ? '区域详情' :
                  Level === 5 ? '区域详情' :
                      Level === 6 ? '房屋详情' : ''
      }}
      <span
          class="shrink-box"
          @click="handleHidden"/>
      <div class="title-line"/>
    </div>
    <div class="container">
<!--      {{Level}}-->
      <DistrictContainer v-if="Level===1"/>
      <TownshipContainer v-if="Level===2"/>
      <NeighborhoodContainer v-if="Level===3"/>
      <GridContainer v-if="Level === 4"/>
      <BuildingContainer v-if="Level === 5"/>
      <RoomContainer v-if="Level === 6"/>
    </div>
    <div class="title-line"></div>
    <div class="legend">
      <div class="ju tag">
        <img :src="ju" alt/>
        <span>居家隔离</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import infoPanel from '../infoPanel/index.vue'
import {Vue, Component, Emit} from 'vue-property-decorator'
import GridContainer from './gridContainer.vue'
import BuildingContainer from './buildingContainer.vue'
import RoomContainer from './roomContainer.vue'
import {MapClass} from '@/map'
import {AreaStore} from '@/store/areaDetail'
import DistrictContainer from './districtContainer.vue'
import TownshipContainer from './townshipContainer.vue'
import NeighborhoodContainer from './neighborhoodContainer.vue'
@Component({
  name: 'houseInfo',
  components: {
    DistrictContainer,
    TownshipContainer,
    NeighborhoodContainer,
    GridContainer,
    BuildingContainer,
    RoomContainer,
    infoPanel
  },
})
export default class HouseInfo extends Vue {
  get Level(): number {
    return AreaStore.level
  }

  ju = require('@/assets/img/juj.png')

  handleUpLevel(): void {
    let curLevel = AreaStore.level
    --curLevel
    console.log('curLevel',curLevel);
    switch (curLevel) {
      case 1: {
        MapClass.level1.clear()
        MapClass.level1.init()
        // // 更新当前位置为县网格
        AreaStore.updateCurNav('district')
        break
      }
      case 2: {
        MapClass.level2.clear()
        MapClass.level2.init()
        // 更新当前位置为区县网格
        AreaStore.updateCurNav('township')
        break
      }
      case 3: {
        MapClass.level3.clear()
        MapClass.level3.init()

        // 更新当前位置为社区网格
        AreaStore.updateCurNav('nieghborhood')
        break
      }
      case 4: {
        MapClass.level4.clear()
        MapClass.level4.init()

        // 更新当前位置为小区网格
        AreaStore.updateCurNav('community')
        break
      }
      case 5: {
        MapClass.level5.clear()
        MapClass.level5.init()

        // 更新当前位置为楼栋网格
        AreaStore.updateCurNav('grid')
        break
      }
      case 6: {
        MapClass.level6.init()
        // 更新当前位置为单元网格
        AreaStore.updateCurNav('unit')
        break
      }
    }
    AreaStore.updateLevel(curLevel)
    const {
      community, grid
    }:any = AreaStore.grid
    const adr = AreaStore.curNav === 'community' ? `${community}` : `${community}-${grid}`
    console.log('adr', adr)
    AreaStore.updateAdr(adr)
    this.$bus.emit("initPanel", adr)
  }

  // 隐藏当前弹窗
  @Emit('handle-hidden')
  handleHidden(): boolean {
    return false
  }
}
</script>

<style lang="scss" scoped>
.house-info-box {
  width: 24%;
  position: absolute;
  right: 10px;
  bottom: 7px;
  top: 90px;
  background-image: url(~@/assets/img/house-bg.png);
  background-size: 100% 100%;

  .up-level {
    position: absolute;
    left: -80px;
    text-align: center;
    font-weight: Bold;
    color: #33e9ff;
    padding: 10px;
    cursor: pointer;
    border: 1px solid;
    border-radius: 8px;
  }

  .title-box {
    position: relative;
    padding: 10px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    color: #12f3ff;
    line-height: 33px;
    //background: angular-gradient(360deg, #02c3e0 0%, #07f6c7 100%);

    .title-line {
      height: 10px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(~@/assets/img/line.png);
    }

    .shrink-box {
      background-image: url(~@/assets/img/shrink.png);
      width: 18px;
      height: 18px;
      position: absolute;
      top: 15px;
      right: 10px;
      cursor: pointer;
    }
  }

  .container {
    height: calc(100% - 105px);
    overflow: auto;
  }

  .title-line {
    height: 10px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(~@/assets/img/line.png);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .tag {
      display: inline-flex;
      align-items: center;
      width: 30%;

      img {
        margin: 0 10px;
      }

      span {
        color: #00eaf7;
        font-size: 14px;
      }
    }
  }
}
</style>
