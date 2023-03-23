<!--
 * @Description: 登录组件
 * @Author: hai-27
 * @Date: 2020-02-19 20:55:17
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-01 15:34:08
 -->
<template>
  <div id="myLogin">
    <el-dialog title="登录" width="300px" center :visible.sync="isLogin">
      <el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" placeholder="请输入账号" v-model="LoginUser.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="LoginUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Login" style="width:100%;">登录</el-button>
          <el-button size="medium" type="primary" @click="test" style="width:100%;">ceshi</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import  md5  from "js-md5";



export default {
  name: "MyLogin",
  data() {
    // 用户名的校验方法
    // let validateName = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("请输入用户名"));
    //   }
    //   // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
    //   const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    //   if (userNameRule.test(value)) {
    //     this.$refs.ruleForm.validateField("checkPass");
    //     return callback();
    //   } else {
    //     return callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"));
    //   }
    // };

    // 验证手机号
    let checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }

    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passwordRule = /^[a-zA-Z]\w{5,17}$/;
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("字母开头,长度6-18之间,允许字母数字和下划线")
        );
      }
    };
    return {
      LoginUser: {
        mobile: "",
        pass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        mobile: [{ validator: checkPhone, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    // 获取vuex中的showLogin，控制登录组件是否显示
    isLogin: {
      get() {
        return this.$store.getters.getShowLogin;
      },
      set(val) {
        this.$refs["ruleForm"].resetFields();
        this.setShowLogin(val);
      }
    }
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin"]),
    test(){
      this.$axios
      .get("/api/demo/hello").then(res =>{
        console.log(res.data);
      }).catch(err =>{
        return Promise.reject(err)
      })

    },
    Login() {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs["ruleForm"].validate(valid => {
        //如果通过校验开始登录
        if (valid) {
          let salt = "1a2b3c4d";
          var str = "" + salt.charAt(0) + salt.charAt(2) + this.LoginUser.pass + salt.charAt(5) + salt.charAt(4);
          this.LoginUser.pass = md5(salt + str);
          this.$axios.post("/api/login/doLogin", {
              mobile: this.LoginUser.mobile,
              password: this.LoginUser.pass
            }).then(res => {
              if(res.data.code === 200){
                this.isLogin = false;
                this.setUser(res.data.obj);
                this.notifySucceed("欢迎登录:"+res.data.obj.nickname);
              }else{
                this.$refs["ruleForm"].resetFields();
                this.notifyError(res.data.msg)
              }
              // “001”代表登录成功，其他的均为失败
              // if (res.data.code === "001") {
              //   // 隐藏登录组件
              //   this.isLogin = false;
              //   // 登录信息存到本地
              //   let user = JSON.stringify(res.data.user);
              //   localStorage.setItem("user", user);
              //   // 登录信息存到vuex
              //   this.setUser(res.data.user);
              //   // 弹出通知框提示登录成功信息
              //   this.notifySucceed(res.data.msg);
              // } else {
              //   // 清空输入框的校验状态
              //   this.$refs["ruleForm"].resetFields();
              //   // 弹出通知框提示登录失败信息
              //   this.notifyError(res.data.msg);
              // }
              console.log(res.data)
              console.log(res.data.data)
              console.log(res.data.code)
              console.log(res.data.data.code)
            })
            .catch(err => {
              return Promise.reject(err);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
</style>