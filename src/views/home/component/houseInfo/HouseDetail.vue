<template>
  <div>
    <el-dialog
      center
      style="width: 100%"
      class="dialog"
      :title="tittle"
      @close="close"
      :visible.sync="dialogVisible">
      <div v-if="behavior === 'show' ">
        <div class="box">
          <p>房主信息</p>
          <div>
            <span>房主：{{owner.name}}</span>
            <span>联系方式：{{owner.mobile}} </span>
          </div>
        </div>
        <div class="box">
          <p>人员信息</p>
          <p
            style="border-radius: 5px;border: 1px dashed;cursor:pointer;float: right"
            @click="add">+ 新增</p>
          <el-table
            class="table"
            :data="gridData">
            <el-table-column property="name" label="姓名" width="100"/>
            <el-table-column property="gender" label="性别" width=""/>
            <el-table-column property="age" label="年龄" width=""/>
            <el-table-column property="mobile" label="手机" width="120"/>
            <el-table-column property="cert_type" label="证件类型" width=""/>
            <el-table-column property="id_card" label="身份证号码" width="160"/>
            <el-table-column property="tags" label="人员标签" width=""/>
            <el-table-column property="belong_county" label="所属区域" width="130"/>
            <el-table-column
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="box">
          <p>户籍人信息</p>
          <el-table
            class="table"
            :data="gridData2">
            <el-table-column property="personnel" label="姓名" width="100"/>
            <el-table-column property="sex" label="性别" width=""/>
            <el-table-column property="age" label="年龄" width=""/>
            <el-table-column property="telephone" label="标签" width="130"/>
            <el-table-column property="other" label="操作" width=""/>
          </el-table>
        </div>
      </div>
      <div v-if="behavior === 'add'">
        <el-form
          ref="form"
          :rules="rules"
          label-position="left"
          label-width="100px"
          :inline="true"
          :model="form"
          class="form">
          <el-form-item label="与户主关系">
            <el-input size="mini" v-model="form.relate" placeholder=""/>
          </el-form-item>
          <el-form-item label="居住人员">
            <el-input size="mini" v-model="form.person" placeholder=""/>
          </el-form-item>
          <el-form-item label="户籍人员">
            <el-input size="mini" v-model="form.person2" placeholder=""/>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input size="mini" v-model="form.name" placeholder=""/>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input size="mini" v-model.number="form.age" placeholder=""/>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select size="mini" v-model="form.gender" placeholder="">
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile">
            <el-input size="mini" v-model.number="form.mobile" placeholder=""/>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select size="mini" v-model="form.party" placeholder="">
              <el-option label="群众" value="群众"/>
              <el-option label="党员" value="党员"/>
            </el-select>
          </el-form-item>
          <el-form-item label="地区">
            <el-input size="mini" v-model="form.zone" placeholder=""/>
          </el-form-item>
          <el-form-item label="民族">
            <el-select size="mini" v-model="form.minZu" placeholder="">
              <el-option label="汉" value="汉"/>
              <el-option label="满" value="满"/>
            </el-select>
          </el-form-item>
          <el-form-item label="居住地址">
            <el-input size="mini" v-model="form.address" placeholder=""/>
          </el-form-item>
          <el-form-item label="婚姻状况">
            <el-select size="mini" v-model="form.marry" placeholder="">
              <el-option label="已婚" value="已婚"/>
              <el-option label="未婚" value="未婚"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="width: 80%;text-align: center;margin: auto">
          <div
            style="
            height: 35px;
            line-height: 35px;
            color: white;
            width: 200px;
            margin: 0 auto;
            border-radius: 5px;
            cursor: pointer;
            background-color: #409EFF;"
            @click="save">
            保 存
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElementUi from 'element-ui'
import {delPerson, getPerson, insertPerson} from "@/api";

@Component({
  name: 'HouseDetail'
})
export default class HouseDetail extends Vue {
  behavior = 'show'

  tittle = ''

  gridData: any = []

  gridData2: any = []

  dialogVisible = false

  owner: any = {}

  form = {
    roomId: '',
    relate: '',
    person: '',
    person2: '',
    name: '',
    code: '',
    gender: '',
    born: '',
    party: '',
    zone: '',
    age: '',
    mobile: '',
    card: '',
    address: '',
    minZu: '',
    marry: ''
  }

  rules= {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    age: [
      { type: 'number', required: true, message: '请输入年龄(只能输入数值)', trigger: 'change' }
    ],
    mobile: [
      { type: 'number', required: true, message: '请输入联系方式(只能输入数字)', trigger: 'change' }
    ]
  }
  roomId = ''

  toggle (status = false, roomId:string) : void {
    this.dialogVisible = status
    this.roomId = roomId
    this.initTb(roomId)
  }

  initTb(roomId: any){
    getPerson(roomId).then(res=>{
      console.log('res123123123',res);
      const personData = res.data.filter((l: any) => {
        return l.roomId == roomId
      })
      console.log('personData',personData);
      this.gridData = personData
      this.owner.name = personData[0]?.name
      this.owner.mobile = personData[0]?.mobile
      this.tittle = personData[0]?.roomAddress
    })
  }

  clear () : void {
    const temp: any = this.form
    for (const formKey in temp) {
      temp[formKey] = ''
    }
  }

  add () : void {
    this.clear()
    this.behavior = 'add'
  }

  del (row:any) {
    delPerson(row.id).then(res=>{
      if (!res.code)
        this.initTb(row.roomId)
      else
        this.$message.error(res.msg)
    })
  }

  save () : void {
    const {
      name, age, gender, mobile
    } = this.form
    const b = Number.isInteger(age) && Number.isInteger(mobile)
    if (name && age && gender && mobile && b) {
      this.form.roomId = this.roomId
      insertPerson(this.form).then(res=>{
        if (!res.code){
          this.$message.success(res.msg)
          this.behavior = 'show'
          this.clear()
          this.initTb(this.roomId)
        }else {
          this.$message.error(res.msg)
        }

      })
    } else {
      ElementUi.Message.error('姓名、性别、年龄和联系方式不能为空且输入规范！')
    }
  }

  close () {
    this.behavior = 'show'
  }
}

</script>

<style lang="scss" scoped>
.dialog{
  ::v-deep.el-dialog{
    width: 65%;
    background: linear-gradient(180deg, #0C4249 0%, #0E2B45 100%);
    box-shadow: 0 6px 24px 7px #092639;
    opacity: 0.79;
    .el-dialog__title{
      color: #12F3FF;
    }
    .el-dialog__header .el-icon-close:before{
      font-size: 22px;
      font-weight: bold;
      color: white;
    }
    .el-dialog__body{
      padding: 0 25px 10px;
      height: calc(100vh - 320px);
      overflow: auto;
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
.box{
  background: rgba(16, 39, 63, 0.6);
  margin: 10px 0;
  padding: 5px 15px;
  p{
    display: inline-block;
    color: #13DAFF;
    font-size: 14px;
    background: rgba(27, 67, 80, 0.75);
    border-radius: 14px;
    padding: 5px 15px;
  }
  div{
    color: #b5b5b5;
    text-indent: 15px;
    span{
      margin-right: 15px;
    }
  }
}
.table::v-deep.el-table{
  background: none;
  color: #b5b5b5;

  .el-table__body tr:hover > td.el-table__cell {
    background: #0b1f4d;
  }
}
.table::v-deep.el-table::before{
  background: none;
}
.table::v-deep.el-table .el-table__header-wrapper tr{
  background: #13213D;
  color: #13DAFF;
}
.table::v-deep.el-table th.el-table__cell{
  background: none;
  border: none;
}
.table::v-deep.el-table td.el-table__cell,
.table::v-deep.el-table th.el-table__cell.is-leaf{
  border: none;
}
.table::v-deep.el-table .el-table__body tr{
  background: none;
}

.form{
  width: 80%;
  margin: 50px auto 30px auto;
  ::v-deep .el-form-item{
    margin-bottom: 25px;
  }
  ::v-deep .el-form-item__label{
    color: #13DAFF;
  }
  ::v-deep .el-input--mini{
    width: 260px;
  }
  ::v-deep .el-input__inner{
    background: #073447;
    border: 1px solid #277189;
    color: white;
    border-radius: 4px;
  }
  ::v-deep .el-form-item:nth-of-type(odd){
    margin-right: 65px;
  }
}

</style>
