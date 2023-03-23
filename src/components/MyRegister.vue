<!--
 * @Description: 用户注册组件
 * @Author: hai-27
 * @Date: 2020-02-19 22:20:35
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-01 15:34:34
 -->
<template>
  <div id="register">
    <el-dialog title="注册" width="300px" center :visible.sync="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="nickName">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户昵称"
            v-model="RegisterUser.nickName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
            v-model="RegisterUser.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请再次输入密码"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%;">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  name: "MyRegister",
  props: ["register"],
  data() {
    // 用户名的校验方法
    let validateMobile = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    };
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
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入确认密码"));
      }
      // 校验是否以密码一致
      if (this.RegisterUser.pass != "" && value === this.RegisterUser.pass) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("两次输入的密码不一致"));
      }
    };
    return {
      isRegister: false, // 控制注册组件是否显示
      RegisterUser: {
        nickName:"",
        mobile: "",
        pass: "",
        confirmPass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        mobile: [{ validator: validateMobile, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
      }
    };
  },
  watch: {
    // 监听父组件传过来的register变量，设置this.isRegister的值
    register: function(val) {
      if (val) {
        this.isRegister = val;
      }
    },
    // 监听this.isRegister变量的值，更新父组件register变量的值
    isRegister: function(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.$emit("fromChild", val);
      }
    }
  },
  methods: {
    Register() {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs["ruleForm"].validate(valid => {
        //如果通过校验开始注册
        if (valid) {
          let salt = "1a2b3c4d";
          var str = "" + salt.charAt(0) + salt.charAt(2) + this.RegisterUser.pass + salt.charAt(5) + salt.charAt(4);
          this.RegisterUser.pass = md5(salt + str);
          this.$axios
            .post("/api/login/doRegister", {
              nickName:this.RegisterUser.nickName,
              mobile: this.RegisterUser.mobile,
              password: this.RegisterUser.pass
            })
            .then(res => {
              
              if(res.data.code === 200){
                //隐藏注册组件，提示注册成功消息
                this.isRegister = false;
                this.notifySucceed("注册成功");
              }else{
                this.notifyError(res.data.message)
              }
              // // “001”代表注册成功，其他的均为失败
              // if (res.code === 200) {
              //   // 隐藏注册组件
              //   this.isRegister = false;
              //   // 弹出通知框提示注册成功信息
              //   this.notifySucceed("注册成功");
              // } else {
              //   // 弹出通知框提示注册失败信息
              //   this.notifyError(res.message);
              // }
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