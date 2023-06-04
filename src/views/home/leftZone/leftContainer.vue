<template>
  <div>
    <div class="left-container">
      <div v-if="orgState" class="btnTitle" @click="toggleOrg">组织情况</div>
      <div v-else class="organization-box box">
        <div class="head">
          <div class="title">组织情况</div>
          <img :src="onOff" alt @click="toggleOrg" />
        </div>
        <Organization ref="org" />
      </div>
      <div v-if="eleState" class="btnTitle" @click="toggleEle">治理要素</div>
      <div v-else class="element-box box" :style="{height: `${height}`}">
        <div class="head">
          <div class="title">治理要素</div>
          <img :src="onOff" alt @click="toggleEle" />
        </div>
        <div class="card">
          <Element v-for="item in curData" :key="item.id" v-bind="item" />
        </div>
      </div>
    </div>
    <PanelDetail ref="pd"/>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Organization from '@/views/home/leftZone/Organization.vue'
import Element from '@/views/home/leftZone/Element.vue'
import PanelDetail from './PanelDetail.vue'

import { AreaStore } from '@/store/areaDetail'
import { getPanel } from "@/api";

@Component({
  name: 'leftContainer',
  components: {
    Organization,
    Element,
    PanelDetail
  },
})
export default class HouseInfo extends Vue {
  mounted() {
    this.initPanel()
    this.$bus.on("initPanel",(adr)=>{
      // console.log('adr', adr)
      this.initPanel(adr)
    });

    this.$bus.on("panel-event",(e)=>{
      this.details(e.clickEvent)
    });
  }

  onOff = require('@/assets/img/shrink.png')

  orgState = false
  eleState = false
  curData = []

  get lev() {
    return AreaStore.level
  }

  get height() {
    let index = ['community', 'grid', 'unit'].indexOf(AreaStore.curNav)
    return ['60%', '70%', '70%'][index]
  }

  initPanel(adr){
    console.log('adr', adr)
    const cName = this.$route.query.name || '月亮湖社区'

    getPanel(adr||cName , cName).then(res=>{
      console.log('res',res.data);
      const org = res.data[0]
      // console.log('org',org);
      this.$refs.org.init(org.titleContentList)
      this.curData = res.data[1].children.filter(t=>{
        return t.titleContentList
      })
    })
  }

  details(type){
    this.$refs.pd.toggle(true, type)
  }

  toggleOrg() {
    this.orgState = !this.orgState
    if (!this.orgState){
      this.initPanel(AreaStore.adr_)
    }
  }

  toggleEle() {
    this.eleState = !this.eleState
  }
}
</script>

<style lang="scss" scoped>
.left-container {
  z-index: 2;
  position: absolute;
  left: 10px;
  top: 90px;
  width: 24%;
  height: 89%;
  .btnTitle {
    width: 70px;
    padding-left: 30px;
    height: 210px;
    font-weight: bold;
    color: #12f3ff;
    font-size: 26px;
    writing-mode: vertical-lr;
    background: linear-gradient(180deg, #0c4249 0%, #0e2b45 100%);
    box-shadow: 0px 6px 24px 7px #092639;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    border: 1px solid;
    margin: 10px 5px;
  }
  .head .title,
  .head img {
    display: inline-block;
  }
  .head .title {
    width: 94%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 20px;
    color: #12f3ff;
    text-indent: 20px;
  }
  img {
    display: block;
    cursor: pointer;
  }
  .organization-box,
  .element-box,
  .alarm-box {
    background-image: url(~@/assets/img/org-bg.png);
    background-size: 100% 100%;
    padding-bottom: 5px;
  }
  .element-box {
    margin-top: 13px;
    .card {
      overflow: auto;
      height: 88%;
    }
    .card::-webkit-scrollbar {
      width: 4px;
      background-color: #181c32;
    }
    .card::-webkit-scrollbar-thumb {
      background-color: #05e3d0;
    }
  }
}
</style>
