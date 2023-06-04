<template>
  <div class="home-info-box">
    <div class="field">楼层数：{{ detail.floors }}</div>
    <div class="field">户数：{{ detail.buildHuShuCount }}</div>
    <div class="field">实有人口数：{{ detail.buildPersonCount }}</div>
  </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component({
  name: 'buildInfoPopup',
})
export default class HouseInfoPopup extends Vue {
  @Prop()
  detail: any

  created() {

    this.finddetail()
    
  }
  finddetail(){
    console.log('detail',this.detail);
  }
}
</script>

<style lang="scss" scoped>

.home-info-box {
  //background: linear-gradient(180deg, #0C4249 0%, #0E2B45 100%);
  background-image: url(~@/assets/img/popbg.png);
  background-size: 100% 100%;
  padding: 10px 10px 20px;

  .field {
    color: #12dcff;
  }
}
</style>
