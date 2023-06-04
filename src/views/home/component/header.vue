<template>
    <div class="header-box">
      <div class="contain">
        <div class="weather">
          <span>14℃  晴 空气质量良</span>
        </div>
        <div class="title">{{title}}综合管理平台</div>
        <div class="date">
          <span>{{date.date}} </span>
          <span>{{date.today}} </span>
          <span>{{date.time}}</span>
        </div>
      </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { parseDateStringToLocalString } from '@/utils/utils.ts'
import {AreaStore} from "@/store/areaDetail";

@Component({
  name: 'headerBox'
})
export default class Header extends Vue {
  timer: any = parseDateStringToLocalString(new Date())

  title: any = ''

  created () {
    this.initTimer()
    setTimeout(()=>{
      this.title = AreaStore.headTitle
    },1000)

  }

  get date () {
    return this.timer
  }

  initTimer () {
    setInterval(() => {
      const now = new Date()
      this.timer = parseDateStringToLocalString(now)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
  .header-box {
    position: absolute;
    width: 100%;
    height: 90px;
    top: 0;
    background-image: url('~@/assets/img/top.png');
    background-size: 100% 100%;
    .contain{
      width: 85%;
      margin: 30px auto;
      display: flex;
      justify-content: space-between;
    }
    .weather,
    .date{
      display: inline-block;
      vertical-align: middle;
      color: #3EFFF4;
      font-size: 16px;
      width: 22%;
      span{
        margin: 0 5px;
      }
    }
    .title{
      font-size: 24px;
      color: white;
    }
  }
</style>
