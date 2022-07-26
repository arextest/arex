import { Button, Input, message, Alert } from "antd";
import { UserOutlined, LockOutlined, DownOutlined } from "@ant-design/icons";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import "./index.less";
import { LoginService } from "../../services/LoginService";
import { GlobalContext } from "../../App";
import { WorkspaceService } from "../../services/WorkspaceService";

let timeChange: any;
const Login = () => {
  const value = useContext(GlobalContext);
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
      message.error("email error");
      return;
    }
    setLoadings(true);
    timeChange = setInterval(() => {
      setCount((t: number) => --t);
    }, 1000);
    LoginService.sendVerifyCodeByEmail(email).then((res) => {
      if (res.data.body.success == true) {
        message.success("The verification code has been sent to the email.");
      } else {
        message.error("Authentication failed.");
      }
    });
  };
  // 用户进入前初始化
  const initBeforeUserEntry = (userName) => {
    WorkspaceService.listWorkspace({
      userName: userName,
    }).then((workspaces) => {
      if (workspaces.length === 0) {
        const params = {
          userName: userName,
          workspaceName: "Default",
        };
        WorkspaceService.createWorkspace(params).then((res) => {
          localStorage.setItem("email", email);
          value.dispatch({ type: "login", payload: email });
        });
      } else {
        localStorage.setItem("email", email);
        value.dispatch({ type: "login", payload: email });
      }
    });
  };

  const login = () => {
    if (!emailchecked || email == "") {
      message.error("Please check your email");
      return;
    } else if (verificationCode == "") {
      message.error("Please fill in the verification code");
      return;
    }

    LoginService.loginVerify({
      email: email,
      verificationCode: verificationCode,
    }).then((res) => {
      if (res.data.body.success == true) {
        message.success("Login succeeded");
        initBeforeUserEntry(email);
      } else {
        message.error("Login failed");
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
      {window.__AREX_EXTENSION_INSTALLED__ ? null : (
        <Alert
          message={
            (
              <div>
                Be careful：The Chrome Extension can break the cross-domain limit of the browser. Please install the
                <a
                  href="https://chrome.google.com/webstore/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj"
                  target={"_blank"}
                >
                  Chrome Extension
                </a>
                before you run it.
              </div>
            )
          }
        />
      )}
      <div className={"login"}>
        <div className={"login-title"}>AREX</div>
        <Input
          size="large"
          placeholder="Please enter your email！"
          prefix={<UserOutlined />}
          onChange={getEmail}
          status={emailchecked ? "" : "error"}
          allowClear
        />
        {emailchecked ? <div className={"login-email-tip"}></div> : (
          <div className={"login-email-tip"}>Please enter the correct email!</div>
        )}
        <div className={"login-verificationCode"}>
          <Input
            size="large"
            placeholder="Please enter a verification code！"
            prefix={<LockOutlined />}
            onChange={getVerificationCode}
          />
          <Button
              style={{marginLeft:'8px'}}
            size="large"
            onClick={sendVerificationCode}
            disabled={loadings}
          >
            {loadings ? count + "s" : ""}Verification code
          </Button>
        </div>
        <Button type="primary" block size="large" onClick={login}>Login</Button>
      </div>
    </div>
  );
};

export default Login;
