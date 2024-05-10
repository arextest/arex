import { FlexCenterWrapper, Label, setLocalStorage, styled } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Card, Carousel, Input, Select, theme, Typography } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import axios from 'axios';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon, MacDraggableArea } from '@/components';
import { ACCESS_TOKEN_KEY, EMAIL_KEY, isClient, REFRESH_TOKEN_KEY } from '@/constant';
import { LoginService } from '@/services';
import { useClientStore } from '@/store';

const Logo = styled(Typography.Text)`
  height: 64px;
  display: block;
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin: 16px;
`;

enum LoginStep {
  Email,
  Organization,
  VerificationCode,
}

const Login: FC = () => {
  const { organization, setOrganization } = useClientStore();
  const carouselRef = useRef<CarouselRef>(null);

  const { message } = App.useApp();
  const { token } = theme.useToken();
  const nav = useNavigate();

  const [loginStep, setLoginStep] = useState<number>(0);

  const [email, setEmail] = useState<string>();

  const [errorStatus, setErrorStatus] = useState();

  const [loginVerifyCode, setLoginVerifyCode] = useState<string>();

  const {
    data: organizationList = [],
    loading: loadingOrganizationList,
    runAsync: getOrganizationByEmail,
  } = useRequest(LoginService.getOrganizationByEmail, {
    manual: true,
    onSuccess(res) {
      console.log(res);
    },
  });

  const { runAsync: sendVerifyCode, loading: sendingCode } = useRequest(
    LoginService.sendVerifyCodeByEmail,
    {
      manual: true,

      onSuccess(success) {
        success
          ? message.success('The verification code has been sent to the email.')
          : message.error('Authentication failed.');
      },
      onError() {
        message.error('Authentication failed.');
      },
    },
  );

  const { run: loginVerify } = useRequest(LoginService.loginVerify, {
    manual: true,
    onSuccess(res, [{ userName }]) {
      if (res.success) {
        setLocalStorage(ACCESS_TOKEN_KEY, res.accessToken);
        setLocalStorage(REFRESH_TOKEN_KEY, res.refreshToken);
        message.success('Login succeeded');
        handleLoginSuccess(userName);
      } else {
        message.error('Verification code error');
      }
    },
  });

  const handleLoginSuccess = (email?: string) => {
    const query = new URLSearchParams(location.search);
    const redirect = query.get('redirect');

    setLocalStorage(EMAIL_KEY, email);

    nav(redirect || '/');
  };

  const readySendCode = useMemo(
    () => (!isClient && loginStep === LoginStep.Email) || loginStep === LoginStep.Organization,
    [loginStep],
  );
  const handleNext = () => {
    if (readySendCode) {
      if (!email) return; //TODO ERROR Status

      axios.post('/api/organization', { organization });
      sendVerifyCode(email).then(() => {
        carouselRef.current?.next();
        setLoginStep((step) => (step + loginStep === LoginStep.Organization ? 1 : 2));
      });
    } else if (loginStep === LoginStep.Email) {
      if (!email) return; //TODO ERROR Status

      getOrganizationByEmail(email as string).then((res) => {
        if (res?.length) {
          carouselRef.current?.next();
          setLoginStep((step) => step + 1);
        } else {
          message.error('No organization found'); //TODO ERROR Status
        }
      });
    } else if (loginStep === LoginStep.VerificationCode) {
      if (!loginVerifyCode || loginVerifyCode.length !== 6) return; //TODO ERROR Status
      loginVerify({ userName: email as string, verificationCode: loginVerifyCode });
    }
  };

  const handlePrev = () => {
    carouselRef.current?.prev();
    setLoginStep((step) => step - 1);
  };

  return (
    <FlexCenterWrapper>
      <MacDraggableArea />

      <Card style={{ marginTop: '20vh' }}>
        <Logo>AREX</Logo>
        {/*<EmailForm />*/}
        <div style={{ width: '320px', height: '100px' }}>
          <Carousel ref={carouselRef} effect='fade' dots={false} infinite={false}>
            <div style={{ display: 'flex' }}>
              <Label type='secondary' style={{ marginBottom: '4px' }}>
                Email
              </Label>
              <Input
                allowClear
                size='large'
                value={email}
                prefix={<Icon name='Mail' />}
                placeholder='Please enter your email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isClient && (
              <div>
                <Label type='secondary' style={{ marginBottom: '4px' }}>
                  Organization
                </Label>
                <Select
                  size='large'
                  value={organization}
                  placeholder={
                    <>
                      <Icon name='Building2' style={{ color: token.colorText, margin: '0 4px' }} />
                      Please select your organization
                    </>
                  }
                  labelRender={(label) => (
                    <>
                      <Icon name='Building2' style={{ margin: '0 4px' }} />
                      {label.label}
                    </>
                  )}
                  options={organizationList.map((org) => ({
                    label: org,
                    value: org,
                  }))}
                  onChange={setOrganization}
                  css={css`
                    width: 100%;
                  `}
                />
              </div>
            )}
            <div>
              <Label type='secondary' style={{ marginBottom: '4px' }}>
                Verification Code
              </Label>
              <FlexCenterWrapper
                css={css`
                  padding-top: 8px;
                  .ant-otp-input {
                    margin: 0 4px;
                    width: 24px !important;
                  }
                `}
              >
                <Input.OTP size='large' value={loginVerifyCode} onChange={setLoginVerifyCode} />
              </FlexCenterWrapper>
            </div>
          </Carousel>
        </div>

        <Button
          block
          type='primary'
          loading={sendingCode || loadingOrganizationList}
          onClick={handleNext}
        >
          {readySendCode
            ? 'Send code'
            : loginStep === LoginStep.VerificationCode
            ? 'Login'
            : 'Next'}
        </Button>

        <Button
          block
          type='link'
          style={{ marginTop: '8px', visibility: loginStep === 0 ? 'hidden' : 'visible' }}
          onClick={handlePrev}
        >
          Back
        </Button>
      </Card>

      <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
        <Typography.Text type='secondary'>Version: {__APP_VERSION__}</Typography.Text>
      </div>
    </FlexCenterWrapper>
  );
};

export default Login;
