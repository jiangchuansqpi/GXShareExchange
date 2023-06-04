<template>
  <el-dialog
      center
      style="width: 100%"
      class="dialog"
      :title="tittle[eventType] + '详情'"
      @close="close"
      :visible.sync="dialogVisible">
    <div class="filter">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input size="mini" clearable v-model="searchForm.name"/>
        </el-form-item>
        <div class="search-item" v-if="eventType === 1">
          <el-form-item label="确诊时段">
            <el-date-picker
                size="mini"
                v-model="time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
          </el-form-item>
        </div>
        <div class="search-item" v-if="[2, 3].includes(eventType)">
          <el-form-item label="隔离起止时间">
            <el-date-picker
                size="mini"
                v-model="time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="隔离方式">
            <el-select
                clearable
                size="mini"
                v-model="searchForm.geLiType"
                placeholder="请选择">
              <el-option
                  v-for="item in divideList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search-item" v-if="[4, 5, 6].includes(eventType)">
          <el-form-item label="隔离起止时间">
            <el-date-picker
                size="mini"
                v-model="time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
          </el-form-item>
        </div>
        <div class="search-item" v-if="eventType === 7">
          <el-form-item label="接种情况">
            <el-select
                clearable
                size="mini"
                v-model="searchForm.ymjzJc"
                placeholder="请选择">
              <el-option
                  v-for="item in tyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="疫苗剂次">
                      <el-select
                          clearable
                          size="mini"
                          v-model="searchForm.yiMiaoCount"
                          placeholder="请选择">
                        <el-option
                            v-for="item in jzList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>-->
        </div>
        <el-form-item>
          <el-button
              size="mini"
              type="primary"
              @click="search">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <el-table
          class="table"
          :data="gridData">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column property="name" label="姓名" width="60"/>
        <el-table-column property="age" label="年龄" width="60"/>
        <div v-if="[2].includes(eventType)">
          <el-table-column property="qz" label="关联病例" width=""/>
        </div>
        <el-table-column property="addr" label="居住地址" width=""/>
        <el-table-column property="mobile" label="手机号" width=""/>
        <el-table-column property="jieZhongType" label="接种情况" width=""/>
        <el-table-column property="yiMiaoCount" label="疫苗剂次" width=""/>
        <div v-if="[1,2,3,4,5,6].includes(eventType)">
          <div v-if="[6].includes(eventType)">
            <el-table-column property="rjTime" label="入境时间" width=""/>
          </div>
          <div v-if="[1,2,3].includes(eventType)">
            <el-table-column property="geliType" label="隔离方式" width=""/>
          </div>
          <div v-if="[1,2,3,4,6].includes(eventType)">
            <el-table-column property="geLiAddr" label="隔离地点" width=""/>
          </div>
          <el-table-column property="startTime" label="隔离开始时间" width=""/>
          <el-table-column property="endTime" label="隔离结束时间" width=""/>
        </div>
        <div v-if="[8].includes(eventType)">
          <el-table-column property="resource" label="来源地" width=""/>
          <el-table-column property="entryTime" label="来蓉时间" width=""/>
        </div>
      </el-table>
      <el-pagination
          :hide-on-single-page="true"
          small
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="total"/>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {comeRon, diagnosePerson, dividePerson, entryPerson, immunityPerson} from "@/api";
import {AreaStore} from "@/store/areaDetail";

@Component({
  name: 'PanelDetail'
})
export default class HouseDetail extends Vue {
  tittle = [
    '',
    '确诊人员',
    '密接人员',
    '次密接人员',
    '转运隔离',
    '居家隔离',
    '入境人员',
    '疫苗接种',
    '中高风险地区来(返)蓉人数'
  ]
  dialogVisible = false

  divideList = [{
    value: '居家隔离',
    label: '居家隔离'
  }, {
    value: '转运隔离',
    label: '转运隔离'
  }]

  tyList = [{
    value: 1,
    label: '已接种'
  }, {
    value: 0,
    label: '未接种'
  }]
  jzList = [{
    value: '第一剂次',
    label: '第一剂次'
  }, {
    value: '第二剂次',
    label: '第二剂次'
  }, {
    value: '第三剂次',
    label: '第三剂次'
  }]
  time: any = []

  searchForm: any = {}
  thd: any = []
  gridData: any = []
  pageNum = 1
  pageSize = 10
  total = 100

  // 1 确诊人数 2 密接人员 3 次密接人员 4 转运隔离 5 居家隔离 6 入境人员 7 疫苗接种 8 中高风险区来蓉
  eventType = 0

  get nav() {
    return AreaStore.curNav
  }

  get grid() {
    const {grid}: any = AreaStore.grid
    return grid
  }

  toggle(status = false, type: number): void {
    this.dialogVisible = status
    this.eventType = type
    this.getData()
  }

  search() {
    if ([1,2,3,4,5,6].includes(this.eventType)){
      const len = this.time.length
      this.searchForm.geLiBeginTime = len > 0 ? this.time[0] : ''
      this.searchForm.geLiEndTime = len > 0 ? this.time[1] : ''
    }
    console.log('search', this.searchForm)
    this.getData()
  }

  getData() {
    const comp = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      villageName: AreaStore.communityName,
      ...this.searchForm
    }

    // 参数之所以如此复杂是因为后端相同字段不同写法 🪓
    const {
      building_id
    }: any = AreaStore.grid
    const adr = AreaStore.adr_.split('-')
    let p: any = ['unit', 'grid'].indexOf(this.nav) ?
        {
          residentialName: this.grid
        } :
        this.eventType === 7 ?
            {
              buildingUnitNo: adr[3],
              buildingId: building_id,
              residentialName: this.grid
            } :
            {
              buildingUnitNo: adr[3],
              buildingNo: adr[2],
              residentialName: this.grid
            }

    const par = {...comp, ...p}
    switch (true) {
      case [1, 2, 3].includes(this.eventType):
        par.type = ['', '确诊', '密接', '次密接', '转运隔离', '居家隔离'][this.eventType]
        this.dividePersonAnalyse(par)
        break;
      case [4, 5].includes(this.eventType):
        par.geLiType = ['转运隔离', '居家隔离'][this.eventType - 4]
        this.dividePersonAnalyse(par)
        break;
      case 6 === this.eventType:
        this.entryPersonAnalyse(par)
        break;
      case 7 === this.eventType:
        this.immunityPersonAnalyse(par)
        break;
      case 8 === this.eventType:
        this.comeToChengdu(par)
        break
    }
  }

  // 1 确诊人数 2 密接人员 3 次密接人员
  diagnosePersonAnalyse(param: any) {
    diagnosePerson(param).then(res => {
      const result = res.data
      this.pageNum = result.currentCount
      this.total = result.totals
      this.gridData = result.qzryVoList
    })
  }

  // 1 确诊人数 2 密接人员 3 次密接人员 4 转运隔离 5 居家隔离
  dividePersonAnalyse(param: any) {
    dividePerson(param).then(res => {
      const result = res.data
      this.pageNum = result.currentCount
      this.total = result.totals
      this.gridData = result.glryVoList
    })
  }

  // 6 入境人员
  entryPersonAnalyse(param: any) {
    entryPerson(param).then(res => {
      const result = res.data
      this.pageNum = result.currentCount
      this.total = result.totals
      this.gridData = result.rjryVoList
    })
  }

  // 7 疫苗接种
  immunityPersonAnalyse(param: any) {
    immunityPerson(param).then(res => {
      const result = res.data
      this.pageNum = result.current
      this.total = result.total
      result.records.map((d:any)=>{
        d.addr = d.fw
        d.yiMiaoCount = d.ymjzJc
      })
      this.gridData = result.records
    })
  }

  // 8 来蓉
  comeToChengdu(param: any) {
    comeRon(param).then(res => {
      const result = res.data
      this.pageNum = result.current
      this.total = result.total
      this.gridData = result.records
    })
  }

  handleCurrentChange(page: number) {
    this.pageNum = page
    this.getData()
  }

  close() {
    this.time = []
    this.searchForm = {}
  }

}
</script>

<style lang="scss" scoped>
.dialog {
  ::v-deep.el-dialog {
    width: 65%;
    background: linear-gradient(180deg, #0C4249 0%, #0E2B45 100%);
    box-shadow: 0 6px 24px 7px #092639;
    opacity: 0.79;

    .el-dialog__title {
      color: #12F3FF;
    }

    .el-dialog__header .el-icon-close:before {
      font-size: 22px;
      font-weight: bold;
      color: white;
    }

    .el-dialog__body {
      padding: 0 25px 10px;
      height: calc(100vh - 320px);
      overflow: auto;

      .el-pagination {
        .btn-next,
        .btn-prev,
        .el-pager li {
          background: none;
        }

        .btn-next,
        .btn-prev {
          color: white;
        }
      }
    }

    .el-dialog__body::-webkit-scrollbar {
      width: 4px;
      border-radius: 4px;
      background-color: #181c32;
    }

    .el-dialog__body::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #05E3D0;
    }
  }
}

.filter {
  padding: 0 15px;

  .search-item {
    display: inline-block;
  }

  ::v-deep .el-form-item {
    margin-bottom: 5px;
  }

  ::v-deep .el-form-item__label {
    color: #13DAFF;
  }

  ::v-deep .el-form-item__content {
    .el-input__inner {
      border: 0;
      background: #1E597D;
      color: #13DAFF;
    }

    .el-date-editor .el-range-input {
      background: none;
      color: #13DAFF;
    }

    .el-range-separator {
      color: #13DAFF;
    }
  }
}

.box {
  background: rgba(16, 39, 63, 0.6);
  margin: 10px 0;
  padding: 0 15px;

  p {
    display: inline-block;
    color: #13DAFF;
    font-size: 14px;
    background: rgba(27, 67, 80, 0.75);
    border-radius: 14px;
    padding: 5px 15px;
  }

  div {
    color: #b5b5b5;
    text-indent: 15px;

    span {
      margin-right: 15px;
    }
  }
}

.table::v-deep.el-table {
  background: none;
  color: #b5b5b5;

  .el-table__body tr:hover > td.el-table__cell {
    background: #0b1f4d;
  }
}

.table::v-deep.el-table::before {
  background: none;
}

.table::v-deep.el-table .el-table__header-wrapper tr {
  background: #13213D;
  color: #13DAFF;
}

.table::v-deep.el-table th.el-table__cell {
  background: none;
  border: none;
}

.table::v-deep.el-table td.el-table__cell,
.table::v-deep.el-table th.el-table__cell.is-leaf {
  border: none;
}

.table::v-deep.el-table .el-table__body tr {
  background: none;
}

</style>
