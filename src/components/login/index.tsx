import { Button, Input, message, Alert } from "antd";
import { UserOutlined, LockOutlined, DownOutlined } from "@ant-design/icons";
import React, { FC, useEffect, useMemo, useState } from "react";
import "./index.less";
import { LoginService } from "../../services/LoginService";
type Props = {
  checkLoginStatus: any;
};
let timeChange: any;
const Login: FC<Props> = ({ checkLoginStatus }) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [emailchecked, setEmailchecked] = useState<boolean>(true);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);
  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (
      value.match(
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
      )
    ) {
      setEmailchecked(true);
    } else {
      setEmailchecked(false);
    }
    setEmail(value);
  };

  const getVerificationCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVerificationCode(value);
  };

  const sendVerificationCode = () => {
    if (!emailchecked || email == "") {
      message.error("邮箱错误");
      return;
    }
    setLoadings(true);
    timeChange = setInterval(() => {
      setCount((t: number) => --t);
    }, 1000);
    LoginService.sendVerifyCodeByEmail(email).then((res) => {
      if (res.data.body.success == true) {
        message.success("验证码获取成功");
      } else {
        message.error("验证码获取失败");
      }
    });
  };

  const login = () => {
    if (!emailchecked || email == "") {
      message.error("请检查邮箱");
      return;
    } else if (verificationCode == "") {
      message.error("请填写验证码");
      return;
    }
    LoginService.loginVerify({
      email: email,
      verificationCode: verificationCode,
    }).then((res) => {
      if (res.data.body.success == true) {
        message.success("登录成功");
        localStorage.setItem("email", email);
        checkLoginStatus();
      } else {
        message.error("登录失败");
      }
    });
  };
  useEffect(() => {
    if (count >= 0 && count < 60) {
    } else {
      clearInterval(timeChange);
      setCount(60);
      setLoadings(false);
    }
  }, [count]);

  return (
    <div className={"login-layout"}>
      <Alert
        message="Arex 浏览器扩展用于 Web 版接口调试，须使用 Chrome 浏览器，请下载至本地安装。"
        type="info"
        showIcon
      />
      <div className={"login"}>
        <div className={"login-title"}>AreX</div>
        <Input
          size="large"
          placeholder="请输入邮箱号！"
          prefix={<UserOutlined />}
          onChange={getEmail}
          status={emailchecked ? "" : "error"}
          allowClear
        />
        {emailchecked ? <div className={"login-email-tip"}></div> : (
          <div className={"login-email-tip"}>请输入正确的邮箱号!</div>
        )}
        <div className={"login-verificationCode"}>
          <Input
            size="large"
            placeholder="请输入验证码！"
            prefix={<LockOutlined />}
            onChange={getVerificationCode}
          />
          <Button
            size="large"
            onClick={sendVerificationCode}
            disabled={loadings}
          >
            {loadings ? count + "s" : ""}获取验证码
          </Button>
        </div>
        <Button type="primary" block size="large" onClick={login}>登录</Button>
      </div>
    </div>
  );
};

export default Login;
