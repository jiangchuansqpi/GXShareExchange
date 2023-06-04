<template>
  <div class="home-container">
    <MapInit />
    <Header />
    <Search />
    <LeftContainer v-if="level === 4 || level === 5 || level === 6"/>
    <HouseInfo v-if="houseVisible" @handle-hidden="handleHidden" />
    <div v-if="!houseVisible" class="house-hidden-box" @click="() => (houseVisible = true)">区域详情</div>
    <img v-if="level===4||level===5||level===6"
      class="iconBtn1"
      @click="dispatchEvent('aimap-draw_polygon')"
      :src="require('@/assets/img/hm.png')"
      title="绘制面"
    />
    <img v-if="level===4||level===5||level===6"
      class="iconBtn2"
      @click="dispatchEvent('aimap-draw_trash')"
      :src="require('@/assets/img/lj.png')"
      title="删除"
    />
<!--    <img class="iconBtn" :src="require('@/assets/img/jp.png')" @click="toZZT" title="疫情防控出图" />-->
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import MapInit from '@/components/MapInit.vue'
import Header from './component/header.vue'
import LeftContainer from './leftZone/leftContainer.vue'
import HouseInfo from './component/houseInfo/index.vue'
import Search from './component/search/index.vue'
import './index.sass'
import {AreaStore} from '../../store/areaDetail'
@Component({
  name: 'home',
  components: {
    MapInit,
    Header,
    LeftContainer,
    HouseInfo,
    Search,
  },
})
export default class Home extends Vue {
  get level():any{
    return AreaStore.level
  }
  houseVisible = true
  url: any = 'http://yingchunzzt.newayz.com?area='
  dispatchEvent(id: any) {
    document.getElementsByClassName(id)[0].dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: false,
      })
    )
  }
  // 区域详情的隐藏
  handleHidden(visible: boolean): void {
    this.houseVisible = visible
  }
  toZZT() {
    const area = this.$route.query.name || '月亮湖社区'
    window.location = this.url + area
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  background: red;
  .house-hidden-box {
    position: absolute;
    right: 10px;
    bottom: 10px;
    top: 90px;
    width: 30px;
    padding: 35px;
    text-align: center;
    height: 138px;
    background: linear-gradient(180deg, #0c4249 0%, #0e2b45 100%);
    box-shadow: 0px 6px 24px 7px #092639;
    border-radius: 8px;
    opacity: 0.6;
    font-weight: bold;
    color: #12f3ff;
    font-size: 26px;
    cursor: pointer;
  }
  .iconBtn {
    position: absolute;
    width: 27px;
    height: 26px;
    left: 25%;
    top: 170px;
    cursor: pointer;
  }

  .iconBtn1 {
    position: absolute;
    width: 28px;
    height: 25px;
    left: 25%;
    top: 92px;
    cursor: pointer;
  }
  .iconBtn2 {
    position: absolute;
    width: 28px;
    height: 25px;
    left: 25%;
    top: 132px;
    cursor: pointer;
    border-radius: 0 0 5px 5px;
  }
}
</style>
