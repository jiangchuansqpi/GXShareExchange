<template>
  <div>
    <el-dialog
        center
        style="width: 100%"
        class="dialog"
        :title="tittle"
        @close="close"
        :visible.sync="dialogVisible">
      <div class="box">
        <el-table
            class="table"
            :data="gridData">
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column property="name" label="姓名" width="100"/>
          <el-table-column property="age" label="年龄" width=""/>
          <el-table-column property="idCard" label="身份证号码" width="160"/>
          <el-table-column property="roomAddress" label="居住地址" width=""/>
          <el-table-column property="mobile" label="手机" width="120"/>
          <el-table-column property="vaccineSituation" label="接种情况" width=""/>
          <el-table-column property="vaccinCount" label="疫苗剂次" width=""/>
          <el-table-column property="vaccinName" label="疫苗产品名称" width=""/>
        </el-table>
        <el-pagination
            small
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :total="total"/>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {immunityDetail} from "@/api";


@Component({
  name: 'PeopleDetail'
})
export default class HouseDetail extends Vue {
  tittle = '免疫详情'

  gridData: any = []

  dialogVisible = false

  pageNum = 1
  pageSize = 10
  total = 100

  getData() {
    immunityDetail(this.pageNum, this.pageSize).then(res=>{
      const result = res.data
      this.pageNum = result.current
      this.total = result.pages
      result.records.filter((item: any) => {
        item.vaccineSituation = item.vaccinCount ? '已接种' : '未接种'
      })
      this.gridData = result.records
    })
  }

  handleCurrentChange(page:number){
    this.pageNum = page
    this.getData()
  }

  close() {
  }

  toggle(status = false): void {
    this.dialogVisible = status
    this.getData()
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
        .el-pager li{
          background: none;
        }
        .btn-next,
        .btn-prev{
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

.box {
  background: rgba(16, 39, 63, 0.6);
  margin: 10px 0;
  padding: 5px 15px;

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
  .el-table__body tr:hover>td.el-table__cell{
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
