<template>
  <div style="margin: 0 0 10px 0">
    <div class="tab-item">
      <span
        v-if="titleName === '疫苗接种' && nav !== 'community'"
        class="tab"
        @click="immuneDetail()"
        :style="{textDecoration: 'underline',cursor: 'pointer',color: styles, border: `1px solid ${styles}`}">
        {{titleName}}
      </span>
      <span
          v-else
          class="tab"
          :style="{color: styles, border: `1px solid ${styles}`}">
        {{titleName}}
      </span>
      <img :class="{imgState: state}" :src="imgUrl" alt="" @click="onchange">
    </div>
    <div class="box" v-show="!state">
      <div
        :class="[titleName === '疫苗接种'? 'block-tag':'']"
        class="block"
        :style="{color: styles}"
        v-for="li in titleContentList"
        :key="li.id">
        <p class="name">
          <span
              style="cursor:pointer;text-decoration: underline"
              v-if="nav !== 'community' && li.clickEvent"
              @click="viewDetail(li)">
            {{li.value}}
          </span>
          <span v-else>{{li.value}}</span>
          <span>{{li.unit}}</span>
        </p>
        <span class="post">{{li.label}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {AreaStore} from "@/store/areaDetail";
@Component({
  name: 'Element'
})
export default class Element extends Vue {
  @Prop()
  titleName: any

  // @Prop()
  // style: any

  @Prop()
  styles: any

  @Prop()
  titleContentList: any

  imgUrl = require('@/assets/img/close.png')
  state = false

  get nav(){
    return AreaStore.curNav
  }

  onchange () {
    this.state = !this.state
  }

  immuneDetail(){
    let event:any = {}
    event.clickEvent = 7
    this.$bus.emit('panel-event', event)
  }

  viewDetail(event:any){
    this.$bus.emit('panel-event', event)
  }
}
</script>

<style lang="scss" scoped>
  .tab-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tab{
    background: rgba(13, 48, 54, 0.75);
    border-radius: 10px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    margin-left: 15px;
  }
  img{
    cursor: pointer;
  }
  .imgState{
    transform: rotate(180deg);
  }
  .box{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
    .block{
      display: inline-block;
      padding: 5px;
      font-size: 16px;
      text-align: center;
      width: 22%;
      .name{
        margin: 5px;
        span:first-child{
          margin: 5px;
          font-size: 16px;
        }
        span:last-child{
          font-size: 0.14rem;
        }
      }
      .post{
        font-size: 0.12rem;
      }
    }
    .block-tag{
      width: 21%;
      margin: 0 2px;
    }
  }
</style>
