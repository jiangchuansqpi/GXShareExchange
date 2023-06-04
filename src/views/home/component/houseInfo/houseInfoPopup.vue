<template>
  <div class="home-info-box">
    <div class="home-info-title">区域分析</div>
    <div class="container">
      <div class="content">
        <div class="item-box">
          <div class="field">总楼栋数：{{ detail.builds }}</div>
        </div>
        <div class="item-box">
          <div class="field">总户数：{{ detail.hushus }}</div>
        </div>
        <div class="item-box">
          <div class="field">总人数：{{ detail.peoPleAmount }}</div>
          <template>
            <div v-for="(itemI,idxI) in list" :key="idxI">
              <div class="items-box">
                <div class="title">{{itemI.label}}</div>
                <div
                  class="field"
                  v-for="(itemJ,idxJ) in itemI.value"
                  :key="idxJ">
                  {{itemJ.label}}: {{ detail[itemJ.key] ||0 }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

const householderInfo = require('@/assets/json/householderInfo.json')
@Component({
  name: 'houseInfoPopup',
})
export default class HouseInfoPopup extends Vue {
  currentHolder: any = null
  houseInfo: any = null
  @Prop()
  detail: any
  list = [
    {
      label: '家庭防疫',
      value: [
        {label: '居家隔离', key: 'isHomeQuarantine', value: ''},
        {label: '门磁安装', key: 'isHomeMc', value: ''}
      ],
    },
    {
      label: '特殊人群',
      value: [
        {label: '独居老人', key: 'dujuOld', value: ''},
        {label: '失能老人', key: 'shilengOld', value: ''},
        {label: '残疾', key: 'canji', value: ''},
        {label: '新生儿', key: 'newBorn', value: ''},
        {label: '婴幼儿', key: 'yingyouEr', value: ''},
        {label: '孕产妇', key: 'yunchanfu', value: ''}
      ],
    },
    {
      label: '疾病人群',
      value: [
        {label: '心脑血管疾病', key: 'heartIllness', value: ''},
        {label: '糖尿病', key: 'glycuresis', value: ''},
        {label: '肺部疾', key: 'feiBuIllness', value: ''},
        {label: '其他疾病', key: 'otherIllness', value: ''},
      ],
    },
  ]

  created() {
    const currentRoom = `${Number(this.detail.building_id)}-${parseInt(
      this.detail.unit
    )}-${this.detail.room}`
    householderInfo.forEach((item: any) => {
      if (item.room_number === currentRoom) {
        this.currentHolder = item
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
}
.home-info-box {
  width: 500px;
  padding: 12px 12px 12px 12px;
  background: linear-gradient(180deg, #0C4249 0%, #0E2B45 100%);;
  background-size: 100% 100%;

  .home-info-title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #04e5d9;
    line-height: 32px;
  }

  .content {
    padding: 10px;
    padding-top: 0;
    overflow: hidden;
    grid-template-columns: 0.8fr 1.2fr;

    .item-box {
      position: relative;
      margin: 10px 0;
      background: #113245;
      width: 100%;
      color: #12dcff;
      .field {
        margin-left: 20px;
        display: inline-block;
      }

      .items-box {
        position: relative;
        background: #13213d;
        margin: 30px 15px;
        padding: 20px 0;
        .title {
          left: 50%;
          top: -15px;
          color: rgba(245, 245, 245, 0.789);
          padding: 0px 10px;
          border-radius: 75px;
          background: #183a4b;
          transform: translateX(-50%);
          display: inline-block;
          position: absolute;
        }
        .field {
          display: inline-block;
          //width: calc(50% - 20px);
          margin-right: 50px;
        }
      }

      .content-text {
        display: inline-block;
        width: 100%;
        text-align: left;
        white-space: wrap;
      }
    }
  }

  .family-people-title {
    height: 33px;
    font-size: 24px;
    font-weight: 400;
    color: #ffffff;
    line-height: 33px;
    margin-bottom: 28px;
  }
}
</style>
