<template>
<div>
  <div class="map-search-box" @click.stop="() => {}">
    <el-popover
      :value="popoverVisible"
      popper-class="map-search-result"
      placement="bottom"
      trigger="manual"
    >
      <div class="search-result-list">
          <ul class="scroll-box" v-show="searchListData.length !== 0">
            <li
              class="list-item"
              :key="index"
              v-for="(list, index) in searchListData"
              @click="() => handleSelect(list)"
            >
                <div class="address-name">
                  <span class="address-box">
                    <div class="house-people">
                      <span>
                        房主：{{ list.name }}
                      </span>
                      <span>
                        地址：{{ list.room_address }}
                      </span>
                    </div>
                  </span>
                </div>
            </li>
          </ul>
          <div class="no-data" v-show="searchListData.length === 0">暂无数据</div>
      </div>
      <div slot="reference">
        <el-select v-model="value" @change="selectChange" placeholder="请选择" class="select-control-box">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="search-control-box">
          <el-input
            class="search-control"
            v-model="searchValue"
            placeholder="请输入关键字进行地点查询"
            @keyup.enter.native="handleSearch"
          />
          <i type="search" class="map-search-icon-box" @click="handleSearch" />
        </div>
      </div>
    </el-popover>
  </div>
  <HouseDetail ref="hd"/>
</div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { searchStore } from '@/store/search'
import { MapClass } from '@/map'
import HouseDetail from '@/views/home/component/houseInfo/HouseDetail.vue'
// const searchData = require('@/assets/json/searchDat.json')
const searchData = require('@/assets/data/person.json')
// const room = require('@/assets/json/room.json')
const room = require('@/assets/data/room.json')
// const unit = require('@/assets/json/unit.json')
const unit = require('@/assets/data/unit.json')
interface SelectOptions {
  value: number
  label: string
}

@Component({
  name: 'search',
  components: {
    HouseDetail
  }
})
export default class Search extends Vue {
  searchValue = ''// 搜索的值
  value = 1
  searchListData: Array<any> = [] // 搜索出来的数据
  options: SelectOptions[] = [
    {
      value: 1,
      label: '全部'
    },
    {
      value: 2,
      label: '人员'
    },
    {
      value: 3,
      label: '地址'
    }
  ]

  get popoverVisible (): boolean {
    return searchStore.visibile
  }

  selectChange (): void {
    searchStore.updateVisible(false)
  }

  // 搜索数据
  handleSearch () {
    searchStore.updateVisible(false)
    const searchResult: any[] = []
    console.log('this.value', this.value)
    searchData.forEach((item: any) => {
      switch (this.value) {
        case 3: {
          if (item.room_id?.indexOf(this.searchValue) !== -1) {
            searchResult.push(item)
          }
          break
        }
        case 2: {
          if (
            item.name?.indexOf(this.searchValue) !== -1
            // item.personnel?.indexOf(this.searchValue) !== -1
          ) {
            searchResult.push(item)
          }
          break
        }
        case 1: {
          if (
            item.room_id?.indexOf(this.searchValue) !== -1 ||
            item.name?.indexOf(this.searchValue) !== -1
            // item.personnel?.indexOf(this.searchValue) !== -1
          ) {
            searchResult.push(item)
          }
          break
        }
      }
    })
    console.log('searchResult', searchResult)
    this.searchListData = searchResult
    if (this.searchValue.length === 0) {
      this.searchListData = []
    }
    setTimeout(() => {
      searchStore.updateVisible(true)
      setTimeout(() => {
        const searchPopover = document.getElementsByClassName('map-search-result')[0]
        ;(searchPopover as any).style.left = Number((searchPopover as any).style.left.split('px')[0]) + 81 + 'px'
      })
    }, 300)
    // getPlace({
    //   keyword: this.searchValue
    // })
    //   .then(res => {
    //     // console.log('res', res)
    //     // this.loading = false
    //     if (res.status !== 200) {
    //       this.$message.error('表格数据请求失败')
    //       return
    //     }
    //     console.log('res.data', res.data.data)
    //     this.searchListData = [...res.data.data]
    //     this.setVisible(true)
    //     if (res.data.length === 0) {
    //       this.searchNoDataTimeId = setTimeout(() => {
    //         this.setVisible(false)
    //       }, 2000)
    //     }
    //   })
    //   .catch(err => {
    //     this.loading = false
    //     if (err.message) {
    //       this.$message.error(err.message)
    //     } else {
    //       this.$message.error('表格数据请求失败')
    //     }
    //   })
  }

  handleSelect (list: any): void {
    // 选择search出来的列表值
    // this.searchValue = list.name
    console.log('list', list, room)
    const filterRom = room.filter((item: any) => item.room_id === list.room_id)
    console.log('filterRom', filterRom)
    if (filterRom.length !== 0) {
      const unitFilter = unit.features.filter((item: any) => String(item.properties.unit_id) === String(filterRom[0].unit_id))
      console.log('unitFilter', unitFilter)
      if (unitFilter.length !== 0) {
        MapClass.level4.changeToLevel(unitFilter[0].properties.grid_id)
        setTimeout(() => {
          MapClass.level6 && MapClass.level6.clear()
          MapClass.level5.changeToLevel(unitFilter, unitFilter[0].properties.unit_id)
          searchStore.updateVisible(false)
        }, 2000)
      }
    }

    (this.$refs.hd as any).toggle(true, list.room_id)
  }

  created () {
    window.addEventListener('click', () => {
      searchStore.updateVisible(false)
    }, false)
  }
}
</script>

<style scoped lang="scss">
.map-search-box {
  position: absolute;
  z-index: 8;
  /* transform: translate(-50%, -50%); */
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  .ant-input {
    outline: none;
    border-radius: 4px 0 0 4px;
    background: #062243;
    opacity: 0.8;
    border: 1px solid #3f9cee;
  }
  .map-search-icon-box {
    color: #fff;
    position: absolute;
    height: 100%;
    width: 50px;
    right: 0;
    cursor: pointer;
    text-align: center;
    line-height: 82px;
    background-image: url(~@/assets/img/search.png);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 30%;
  }
}
</style>
