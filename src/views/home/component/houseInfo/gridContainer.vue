<template>
  <div class="grid-container">
    <div class="grid-title">
      {{ community.community || "" }}
    </div>
    <div class="grid-box">
      <div
        :class="[
          'grid-item',
          item.grid_id === gridId ? 'grid-item-active' : '',
        ]"
        v-for="item in gridData"
        :key="item.grid_id"
      >
        <p
          style="cursor: pointer"
          v-if="item.is_click"
          @click="() => handleActiveArea(item.grid_id)"
        >
          {{ item.grid }}
        </p>
        <p v-else class="no-click">{{ item.grid }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { MapClass } from "@/map";
import { getData } from "@/api";
import { AreaStore } from "@/store/areaDetail";
// import turf from "@turf/turf";
const city1 = require('../../../../assets/geojson/city.json')
@Component({
  name: "gridContainer",
})

export default class gridContainer extends Vue {
  gridData: string[] = []
  community: any = {}
  gridPloy:any = {}
  cityData: string[] = []
  city: any = {}
  cityPloy:any = {}
  get gridId(){
    return AreaStore.gridId
  }

  initData(){
    console.log('city1',city1);
    this.cityPloy=city1
    this.cityData=city1.features.map((item:any)=>item.properties)//
    this.city=this.cityData[0]
    console.log('this.cityPloy',this.cityPloy);
    console.log('this.cityData',this.cityData);
    console.log('this.city',this.city);


    //存储页面标题
    const {city}:any=this.cityData[0]
    AreaStore.updateHeadTitle(`${city}`)

    const cName:any = this.$route.query.name || '月亮湖社区'
    AreaStore.updateCommunityName(cName)
    // console.log('cName',cName); //月亮湖社区
    getData('grid', cName).then(res=>{
      console.log('res.data',res.data);
      this.generatorGridData(res.data)
    })
  }

  generatorGridData (grid:any) {
    // console.log('grid',grid);
    this.gridPloy = grid
    this.gridData = grid.features.map((item:any)=>item.properties)
    this.community = this.gridData[0]
    console.log('this.gridData',this.gridData);
    // 存储页面标题
    const {
      // district, street, community
       community
    }:any = this.gridData[0]
    // AreaStore.updateHeadTitle(`${district}${street}${community}`)
    AreaStore.updateHeadTitle(`${community}`)//没有传地区跟街道，就把district跟street暂时删掉
  }

  //点击进入下个层级
  handleActiveArea(gridId: string): void {
    // 更新当前位置为网格
    AreaStore.updateCurNav("grid");

    const filter:any = this.gridData.find((g:any)=>{
      return g.grid_id === gridId
    })
    console.log('gridId',gridId);

    console.log('filter', filter)
    AreaStore.updateGrid(filter)

    let adr = `${filter.community}-${filter.grid}`
    console.log('adr',adr);

    AreaStore.updateAdr(adr)
    this.$bus.emit("initPanel", adr)
    MapClass.level4.changeToLevel(gridId)
    this.showGridLabel(gridId)

    const m = new MapClass();
    m.setWallColor();
    m.mouseEvent();
  }

  showGridLabel(gId: any) {
    const curGrid = this.gridPloy.features.find((f: any) => {
      return f.properties.grid_id === gId;
    });
    const girdPloy = {
      name: curGrid.properties.grid,
      coordinates: curGrid.geometry.coordinates
    }

    const m = new MapClass()
    m.showSelectGrid(girdPloy)
  }

  created() {
    this.initData();
  }
}
</script>

<style lang="scss" scoped>
.grid-container {
  .grid-title {
    text-align: center;
    font-size: 20px;
    color: #fffa81;
  }

  .grid-box {
    padding: 6% 24%;

    .grid-item {
      background-image: url(~@/assets/img/grid-bg.png);
      background-size: 100% 100%;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #00eaf7;
      line-height: 40px;
      padding: 10px;
      text-align: center;
      p {
        line-height: 15px;
        user-select: none;
      }
      .no-click {
        cursor: not-allowed;
      }
    }

    .grid-item-active {
      background-image: url(~@/assets/img/grid-active-bg.png);
      font-size: 14px;
      font-weight: 600;
      color: #091a48;
    }
  }
}
</style>
