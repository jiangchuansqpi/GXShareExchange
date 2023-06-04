<template>
  <div>
    <div class="" v-if="nav === 'community' || 'neighborhood'">
      <div class="org-box">
        <div class="left">
          <div v-for="p in orgData.left" :key="p.id">
            <p>{{ p.label }}</p>
            <p style="text-align: left">{{ p.value }}</p>
          </div>
        </div>
        <div class="right">
          <div v-for="p in orgData.right" :key="p.id">
            <p>{{ p.label }}</p>
            <p>{{ p.value }}</p>
          </div>
        </div>
      </div>
      <div class="block-box">
        <PostLevel v-for="item in orgData.block" :key="item.id" v-bind="item"/>
      </div>
      <div class="block-box">
        <PostLevel v-for="item in orgData.block2" :key="item.id" v-bind="item"/>
      </div>
    </div>
    <div class="" v-if="nav === 'grid'">
      <div class="block-box">
        <PostLevel v-for="item in orgData.grid" :key="item.id" v-bind="item" :level="level"/>
      </div>
      <div class="block-box">
        <PostLevel v-for="item in orgData.grid2" :key="item.id" v-bind="item" :level="level"/>
      </div>
    </div>
    <div class="" v-if="nav === 'unit'">
      <div class="block-box">
        <PostLevel v-for="item in orgData.unit" :key="item.id" v-bind="item" :level="level"/>
      </div>
      <div class="block-box">
        <PostLevel v-for="item in orgData.unit2" :key="item.id" v-bind="item" :level="level"/>
      </div>
    </div>
  </div>
</template>

<script>
import {Vue, Component} from 'vue-property-decorator'
import PostLevel from './PostLevel.vue'
import {AreaStore} from '@/store/areaDetail'

@Component({
  name: 'Organization',
  components: {
    PostLevel
  }
})
export default class Organization extends Vue {
  orgData = {}

  get nav (){
    return AreaStore.curNav
  }

  get level() {
    return AreaStore.level
  }

  get gridId() {
    return AreaStore.gridId
  }

  get unitId() {
    return AreaStore.unitId
  }

  init(orgList) {
    let data = {}
    console.log('orgList--------',orgList);
    console.log('this.nav',this.nav);
    switch (this.nav) {
      case 'neighborhood': {
        data = {
          left: orgList.slice(0, 2),
          right: orgList.slice(2, 4),
          block: orgList.slice(4, 6),
          block2: orgList.slice(6),
        }
        break
      }
      case 'community': {
        data = {
          left: orgList.slice(0, 2),
          right: orgList.slice(2, 4),
          block: orgList.slice(4, 6),
          block2: orgList.slice(6),
        }
        break
      }
      case 'grid': {
        data = {
          grid: orgList.slice(0, 3),
          grid2: orgList.slice(3)
        }
        break
      }
      case 'unit': {
        data = {
          unit: orgList.slice(0, 1),
          unit2: orgList.slice(1),
        }
        break
      }
    }
    console.log('data-----',data);
    this.orgData = data
    console.log('orgData',this.orgData);
  }
}
</script>

<style lang="scss" scoped>
.org-box {
  //text-align: center;
  .left {
    border-right: 1px solid rgba(62, 255, 244, 0.3);
  }

  .left,
  .right {
    display: inline-block;
    vertical-align: middle;
    width: 49%;

    div {
      display: flex;
      align-items: center;
      padding-left: 10px;

      p {
        color: white;
        margin: 5px auto;
        font-size: 14px;
      }

      p:first-child {
        text-align: center;
        border-radius: 18px;
        padding: 5px;
        width: 60%;
        background: rgba(11, 21, 72, 0.5);
        border: 1px solid rgba(0, 248, 255, 0.5);
      }

      p:last-child {
        text-align: left;
        width: 25%;
      }
    }
  }
;
}

.block-box {
  display: flex;
  justify-content: space-around;
  margin: 5px 0;
  //width: 22%;
}

.block-box-level {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .block{
    width: 22%;
  }
}
</style>
