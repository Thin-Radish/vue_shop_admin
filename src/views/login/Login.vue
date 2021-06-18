<template>
  <div class="login_container">
    <div class="login_box"> 
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/logo.png">
      </div>
      <!-- 登录表单 -->
      <el-form 
        class="login_from" 
        :model="loginForm"
        :rules="loginFormRules" 
        ref="loginFormRef"> 

        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>

        <!-- 提交 -->
        <el-form-item class="btns"> 
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import { userLogin } from 'api/login.js'

  export default {
    name: 'Login',
    data() {
      return{
        loginForm: {
          username: '',
          password: ''
        },
        loginFormRules: {
          username: [
            { required: true, message: "请输入登录名称", trigger: "blur"},
            { min: 3, max: 10, message: "长度在3到10个字符之间", trigger: "blur"}
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      // 表单重置按钮
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return;
          const res = await userLogin(this.loginForm);

          if(res.meta.status !== 200) return this.$message.error(res.meta.msg+'!');
          this.$message.success("登录成功!");

          //1.登录成功后的 token 保存到客服端的 sessionStorage 中
          window.sessionStorage.setItem("token",res.data.token);

          //2.页面跳转到 home首页
          this.$router.push("/home");

        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #eee;
      background-color: #fff;

      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img { 
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }

    }
  }

  .login_from{
    position: absolute;
    bottom: 0;
    width: 100%;

    box-sizing: border-box;
    padding: 0 20px;

    .btns{
      display: flex;
      justify-content: end;
    }
  }


</style>