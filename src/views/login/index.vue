<template>
  <div class="login">
    <div class="title-box">
      <div class="title-text"></div>
    </div>
    <el-card class="box-card">
      <div class="text item">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="58px" class="demo-ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model.number="ruleForm.username" @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"
                      @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="submit-btn btn" type="primary" @click="submitForm">提交</el-button>
        <el-button class="reset-btn btn" @click="resetForm">重置</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator'
import './index.sass'

interface RuleForm {
  username: string
  password: string
}

interface Rule {
  password: any[]
  username: any[]
}

@Component({
  name: 'Login'
})
export default class Login extends Vue {
  rules: Rule = {
    password: [
      {required: true, message: '请输入密码', trigger: 'blur'}
    ],
    username: [
      {required: true, message: '请输入用户账号', trigger: 'blur'}
    ]
  }

  ruleForm: RuleForm = {
    username: '',
    password: ''
  }

  submitForm(): void {
    (this.$refs.ruleForm as any).validate((valid: boolean) => {
      if (valid) {
        if (this.ruleForm.username === 'wayz' && this.ruleForm.password === 'wayz') {
          localStorage.setItem('login', '1')
          localStorage.setItem('loginTime', (new Date() as any).getTime())
          this.$router.push('/')
        } else {
          this.$message.error('用户名或密码错误！！！')
        }
        return true
      } else {
        this.$message.error('error submit!!')
        return false
      }
    })
  }

  resetForm(): void {
    (this.$refs.ruleForm as any).resetFields()
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  background-image: url(~@/assets/img/login_bg.png);
  background-size: 100% 100%;

  .title-box {
    height: 454px;
    line-height: 454px;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    background-image: url(~@/assets/img/login_title_bg.png);

    .title-text {
      background-image: url(~@/assets/img/title-text.png);
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 40%;
      background-position: 0 50%;
    }
  }
}

.login .el-form-item__label {
  color: #fff;
  font-weight: 500;
}

.login .box-card {
  color: #fff;
  width: 25%;
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translateY(-50%);
  background-image: url(~@/assets/img/login_control_bg.png);
  background-size: 100% 100%;
  height: 638px;

  .text {
    .btn {
      display: block;
      margin-left: 0;
      width: 100%;
      background-color: transparent;
      border: none;
      color: #fff;
    }

    .submit-btn {
      background-image: url(~@/assets/img/login_btn_bg.png);
      background-size: 100% 100%;
    }

    .reset-btn {
      border: 1px solid rgba($color: #000000, $alpha: 0.8);
      border-radius: 24px;
      margin-top: 20px;
    }
  }
}

.login .el-input__inner {
  width: 70%;
}

.login .demo-ruleForm {
  margin: auto;
}

.login .el-input__suffix {
  right: auto;
}
</style>
