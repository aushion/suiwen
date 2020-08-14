import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Icon, message } from 'antd';
import request from '../../utils/request';
import RestTools from '../../utils/RestTools';
import styles from './index.less';
// const { TabPane } = Tabs;
let time = null;

function LoginRegister(props) {
  const { visible, triggerCancel } = props;
  const { getFieldDecorator } = props.form;
  const [showRegister, setShowRegister] = useState(false); //显示注册框标志
  const [showLogin, setShowLogin] = useState(true); //显示登录框标志
  const [errMsg, setErrMsg] = useState(''); //接口报错提示
  const [loading, setLoading] = useState(false); //提交loading
  // const [activeKey, setActiveKey] = useState('1'); //注册tab切换控制dom显隐
  const [countDown, setCountDown] = useState(60); //倒计时

  const formItemLayout = {
    wrapperCol: { span: 24 }
  };

  useEffect(() => {
    clearInterval(time);
  }, []);

  useEffect(() => {
    if (countDown <= 0) {
      clearInterval(time);
      setCountDown(60);
    }
  }, [countDown]);

  //判断是打开登录还是注册窗口
  useEffect(() => {
    setShowLogin(props.showLogin);
    setShowRegister(props.showRegister);
  }, [props.showLogin, props.showRegister]);

  const QqSvg = () => (
    <svg fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M512 0C229.12 0 0 229.12 0 512c0 282.88 229.12 512 512 512s512-229.12 512-512C1024 229.12 794.88 0 512 0zM782.08 670.72c-11.52 6.4-30.72-7.68-48.64-34.56-6.4 28.16-24.32 53.76-48.64 74.24 25.6 8.96 42.24 25.6 42.24 42.24 0 29.44-46.08 52.48-102.4 52.48-51.2 0-93.44-19.2-101.12-43.52-2.56 0-10.24 0-12.8 0-7.68 24.32-49.92 43.52-101.12 43.52-56.32 0-102.4-23.04-102.4-52.48 0-17.92 16.64-33.28 42.24-42.24-24.32-20.48-42.24-46.08-48.64-74.24-17.92 25.6-37.12 39.68-48.64 34.56-17.92-8.96-14.08-57.6 7.68-107.52 16.64-39.68 39.68-69.12 57.6-75.52 0-2.56 0-5.12 0-7.68 0-15.36 3.84-29.44 11.52-40.96 0-1.28 0-1.28 0-2.56 0-7.68 1.28-14.08 5.12-19.2C340.48 312.32 408.32 230.4 518.4 230.4c110.08 0 177.92 81.92 183.04 185.6 2.56 5.12 5.12 12.8 5.12 19.2 0 1.28 0 1.28 0 2.56 7.68 11.52 11.52 25.6 11.52 40.96 0 2.56 0 5.12 0 7.68 17.92 6.4 40.96 35.84 57.6 75.52C796.16 613.12 800 661.76 782.08 670.72z"></path>
    </svg>
  );

  const WechatSvg = () => (
    <svg fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M319.1808 385.399467a33.518933 33.518933 0 1 0 33.518933-33.518934 33.518933 33.518933 0 0 0-33.518933 33.518934z m149.879467-0.9216a33.518933 33.518933 0 1 0 33.518933-33.518934 33.518933 33.518933 0 0 0-33.518933 33.518934z m83.797333 149.879466a23.278933 23.278933 0 1 0 23.278933-23.278933 23.278933 23.278933 0 0 0-23.176533 23.2448z m118.237867 1.8432a23.278933 23.278933 0 1 0 23.278933-23.278933 23.278933 23.278933 0 0 0-23.278933 23.278933z"></path>
      <path d="M512 0a512 512 0 1 0 512 512A511.6928 511.6928 0 0 0 512 0z m-87.483733 630.237867a351.812267 351.812267 0 0 1-75.400534-11.1616l-75.434666 37.205333 21.4016-64.238933a174.3872 174.3872 0 0 1-85.640534-145.2032c0-102.4 96.802133-182.4768 215.04-182.4768 105.198933 0 198.280533 64.238933 216.917334 150.801066a150.698667 150.698667 0 0 0-20.48-0.9216 175.752533 175.752533 0 0 0-182.4768 170.359467 172.6464 172.6464 0 0 0 6.519466 44.680533c-7.441067 0-13.960533 0.9216-20.48 0.9216z m314.641066 75.400533l15.803734 53.998933L696.32 727.04a258.730667 258.730667 0 0 1-64.238933 11.1616c-102.4 0-182.4768-69.8368-182.4768-155.477333s80.0768-155.4432 182.4768-155.4432c96.802133 0 182.442667 69.802667 182.442666 155.4432a161.757867 161.757867 0 0 1-75.400533 122.88z"></path>
    </svg>
  );

  const WeiboSvg = () => (
    <svg fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M411.272533 607.6416a44.373333 44.373333 0 0 0-52.258133 17.544533 30.72 30.72 0 0 0 11.8784 46.216534 43.997867 43.997867 0 0 0 53.3504-17.408 30.72 30.72 0 0 0-12.970667-46.353067z m44.373334-18.295467a16.554667 16.554667 0 0 0-19.5584 7.338667 11.6736 11.6736 0 0 0 5.154133 17.373867 16.7936 16.7936 0 0 0 20.036267-7.3728 11.639467 11.639467 0 0 0-5.7344-17.339734z m-28.023467-120.046933c-116.053333 11.434667-203.912533 82.2272-196.369067 158.071467s107.656533 128.170667 223.6416 116.736 203.912533-82.2272 196.4032-158.139734-107.758933-128.068267-223.778133-116.667733z m101.7856 178.9952a125.371733 125.371733 0 0 1-149.538133 63.249067 85.7088 85.7088 0 0 1-54.954667-122.231467 126.498133 126.498133 0 0 1 141.550933-61.44 86.1184 86.1184 0 0 1 62.839467 120.4224zM512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m-56.456533 794.965333c-145.339733 0-293.956267-70.212267-293.956267-185.6512 0-60.347733 38.4-130.184533 104.482133-196.061866 88.2688-87.927467 191.146667-128 229.888-89.3952a79.837867 79.837867 0 0 1 7.748267 81.6128c-5.7344 17.681067 16.657067 7.8848 16.657067 7.918933 71.338667-29.764267 133.563733-31.505067 156.330666 0.853333a72.738133 72.738133 0 0 1-0.2048 69.5296c-5.188267 12.936533 1.604267 14.9504 11.4688 17.885867a106.120533 106.120533 0 0 1 84.923734 95.368533c-0.034133 87.620267-126.7712 197.9392-317.3376 197.9392z m263.133866-367.172266a43.793067 43.793067 0 0 0-9.216-43.076267 44.373333 44.373333 0 0 0-42.052266-13.653333 23.005867 23.005867 0 1 1-9.6256-44.817067 90.146133 90.146133 0 0 1 104.823466 115.780267 23.074133 23.074133 0 0 1-43.9296-14.1312z m134.587734 43.349333a26.897067 26.897067 0 0 1-51.2-16.520533 131.652267 131.652267 0 0 0-152.951467-168.96 26.760533 26.760533 0 1 1-11.264-52.292267 185.207467 185.207467 0 0 1 215.3472 237.7728z"></path>
    </svg>
  );

  const NeteaseSvg = () => (
    <svg fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M1023.90784 502.306133a512 512 0 1 0-521.6256 521.6256 513.911467 513.911467 0 0 0 521.6256-521.6256z m-712.704 32.6656a209.2032 209.2032 0 0 0 123.938133-49.220266c7.406933-8.055467 2.6624-10.24-28.9792-12.8-42.427733-3.413333-57.275733-16.861867-65.3312-59.255467a290.372267 290.372267 0 0 1 1.3312-115.2c8.123733-14.1312 30.378667-17.5104 37.751467-5.393067a237.909333 237.909333 0 0 1 5.393067 56.593067c1.3312 74.103467 5.393067 77.5168 103.765333 74.103467 43.8272-1.399467 91.648-2.730667 107.8272-3.413334 43.076267 0 58.026667-18.193067 52.5312-65.3312-4.744533-42.427733-14.199467-59.938133-37.751467-68.7104a688.776533 688.776533 0 0 0-186.606933-4.061866c-35.0208 4.7104-35.703467 4.7104-35.703467-12.117334 0-20.1728 7.406933-25.565867 40.413867-32.290133a740.010667 740.010667 0 0 1 185.275733 2.013867c57.275733 14.848 66.6624 24.917333 83.592534 95.095466a121.787733 121.787733 0 0 1-2.730667 89.565867c-13.448533 33.041067-39.082667 40.96-121.275733 40.413867-66.048-0.682667-67.3792 0-78.848 17.5104a295.7312 295.7312 0 0 1-97.041067 77.448533c-77.448533 27.579733-120.593067 30.3104-127.317333 8.738133-6.724267-20.8896 8.055467-33.6896 39.765333-33.6896z m117.213867-197.393066a179.438933 179.438933 0 0 1 80.1792-7.4752c95.573333 0.7168 90.897067-0.682667 88.234666 20.923733l-2.013866 18.193067-84.241067 0.682666c-75.434667 0-84.241067-1.3312-86.254933-12.117333a28.9792 28.9792 0 0 1 4.096-20.1728z m41.745066 392.055466a385.911467 385.911467 0 0 1-142.848 61.44c-43.076267 0-40.413867-42.427733 3.413334-54.613333a687.3088 687.3088 0 0 0 242.551466-135.3728c36.420267-28.296533 40.413867-29.696 51.2-16.315733 9.386667 11.4688 7.406933 13.653333-55.261866 67.3792a144.4864 144.4864 0 0 0-38.434134 42.427733c0 4.744533-5.393067 8.772267-11.4688 8.772267a158.3104 158.3104 0 0 0-49.152 26.282666z m285.696-91.511466a121.9584 121.9584 0 0 1-49.152 94.3104c-53.930667 48.469333-129.399467 72.055467-154.965333 49.152a77.243733 77.243733 0 0 1-24.917333-61.44c3.413333-9.454933 6.075733-9.454933 24.917333 0.682666 42.427733 21.572267 103.082667-1.3312 138.103467-51.882666 35.0208-51.2 20.1728-107.144533-28.296534-107.144534a27.306667 27.306667 0 0 1-30.958933-18.8416c-12.868267-26.248533-38.434133-27.579733-67.3792-2.6624-134.724267 116.5312-260.061867 179.882667-288.3584 146.193067-18.193067-21.504-4.061867-32.290133 70.724267-53.8624a490.018133 490.018133 0 0 0 115.2-61.44c67.3792-44.373333 74.786133-51.2 72.123733-66.6624-2.730667-12.8 0-18.193067 12.117333-22.903467a76.731733 76.731733 0 0 1 33.041067-3.413333c9.386667 0.682667 30.958933 3.413333 48.469333 5.393067a146.500267 146.500267 0 0 1 129.3312 154.555733z"></path>
    </svg>
  );

  function handleCancel() {
    props.form.resetFields();
    setShowRegister(false);
    setShowLogin(true);
    // setActiveKey('1');
    setErrMsg('');
    triggerCancel();
  }

  function handleThirdLogin(type) {
    const handleRedirectUrl = encodeURIComponent(
      window.location.origin +
        process.env.basePath +
        '/handleRedirect?Redirect=' +
        window.location.href
    );
    window.open(
      `https://my.cnki.net/ThirdLogin/ThirdLogin.aspx?to=${type}&RedirectUrl=${handleRedirectUrl}`,
      'login',
      'width=960,height=640,top=100,left=100;resizable,scrollbars=yes,status=1'
    );
  }

  function handleOk(e, type) {
    e.preventDefault();
    setErrMsg('');
    props.form.validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        const data = JSON.parse(
          JSON.stringify(values, function(key, value) {
            if (value) {
              return value;
            } else {
              return undefined;
            }
          })
        );
        if (type === 'login') {
          login(data);
        } else if (type === 'mobileRegister') {
          mobileRegister(data);
        } else if (type === 'emailRegister') {
          emailRegister(data);
        }
      }
    });
  }

  function getVerifyCode() {
    setErrMsg('');
    clearInterval(time);

    props.form.validateFields(['mobile'], { first: true }, (errors, values) => {
      if (!errors) {
        request
          .post('/Login/send_verify_code', null, {
            params: {
              mobile: props.form.getFieldValue('mobile')
            }
          })
          .then((res) => {
            if (res.data.result) {
              time = setInterval(() => {
                setCountDown((countDown) => countDown - 1);
              }, 1000);
            } else {
              setErrMsg(res.data.msg);
            }
          })
          .catch((err) => {
            message.error('网络出了点小问题，请稍后再试');
          });
      }
    });
  }

  function login(data) {
    request
      .post('/Login/login', null, {
        params: { ...data }
      })
      .then((res) => {
        if (res.data.result) {
          triggerCancel();
          props.form.resetFields();
          RestTools.setLocalStorage('userInfo', {
            ...res.data.result,
            UserName: res.data.result.Username,
            ShowName: res.data.result.PersonUserName
          });
          window.location.reload();
        } else {
          setErrMsg(res.data.msg);
        }
        setLoading(false);
      })
      .catch((err) => {
        message.error('网络出了点小问题，请稍后再试');
      });
  }

  function mobileRegister(data) {
    request
      .post('/Login/mobileRegister', null, {
        params: {
          ...data
        }
      })
      .then((res) => {
        if (res.data.result) {
          triggerCancel();
          props.form.resetFields();
          setShowLogin(true);
          setShowRegister(false);
          message.success('太棒啦，您已经注册成功了，去登录试试吧');
        } else {
          setErrMsg(res.data.msg);
        }
        setLoading(false);
      })
      .catch((err) => {
        message.error('网络出了点小问题，请稍后再试');
        setLoading(false);
      });
  }

  function emailRegister(data) {
    request
      .post('/Login/emailRegister', null, {
        params: {
          ...data
        }
      })
      .then((res) => {
        if (res.data.result) {
          triggerCancel();
          props.form.resetFields();
          setShowLogin(true);
          setShowRegister(false);
          message.success('太棒啦，您已经注册成功了，去登录试试吧');
        } else {
          setErrMsg(res.data.msg);
        }
        setLoading(false);
      })
      .catch((err) => {
        message.error('网络出了点小问题，请稍后再试');

        setLoading(false);
      });
  }

  const loginForm = showLogin ? (
    <div className={styles.login}>
      <Form
        {...formItemLayout}
        labelAlign="left"
        onSubmit={(e) => {
          handleOk(e, 'login');
        }}
      >
        <div className={styles.title}>个人账户登录</div>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入密码"
              suffix={
                <a href="https://my.cnki.net/mycnki/RealName/FindPsd.aspx" target="blank">
                  找回密码
                </a>
              }
            />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          登录
        </Button>
        {errMsg ? <div style={{ color: 'red' }}>{errMsg}</div> : null}
        <div className={`${styles.otherLoginWrapper} display_flex justify-content_flex-justify`}>
          <div
            className={styles.otherLoginBtn}
            onClick={() => {
              handleThirdLogin('qq');
            }}
          >
            <Icon component={QqSvg} className={`${styles.icon} ${styles.qq}`} />
          </div>
          <div
            className={styles.otherLoginBtn}
            onClick={() => {
              handleThirdLogin('weixin');
            }}
          >
            <Icon component={WechatSvg} className={`${styles.icon} ${styles.wechat}`} />
          </div>
          <div
            className={styles.otherLoginBtn}
            onClick={() => {
              handleThirdLogin('sina');
            }}
          >
            <Icon component={WeiboSvg} className={`${styles.icon} ${styles.weibo}`} />
          </div>
          <div
            className={styles.otherLoginBtn}
            onClick={() => {
              handleThirdLogin('163');
            }}
          >
            <Icon component={NeteaseSvg} className={`${styles.icon} ${styles.netease}`} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          还没有账号？
          <Button
            type="link"
            onClick={() => {
              props.form.resetFields();
              setShowLogin(false);
              setShowRegister(true);
              // setActiveKey('1');
            }}
          >
            立即注册
          </Button>
        </div>
      </Form>
    </div>
  ) : null;

  const registerForm = showRegister ? (
    <div className={styles.register}>
      <div className={styles.title}>个人账户注册</div>
      <Form
        {...formItemLayout}
        labelAlign="left"
        onSubmit={(e) => {
          handleOk(e, 'mobileRegister');
        }}
      >
        <Form.Item>
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入正确手机号', pattern: /^1[3456789]\d{9}$/ }]
            // validateTrigger: 'onBlur'
          })(
            <Input
              size="large"
              prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入手机号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('verifyCode', {
            rules: [{ required: true, message: '请输入短信验证码' }]
          })(
            <Input
              type="text"
              size="large"
              placeholder="请输入短信验证码"
              suffix={
                countDown === 0 || countDown === 60 ? (
                  <Button type="link" onClick={getVerifyCode}>
                    获取验证码
                  </Button>
                ) : (
                  <span style={{ color: 'orange' }}>{countDown}秒后再发</span>
                )
              }
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '密码不能为空' },
              {
                validator: (rule, value, callback) => {
                  const mobile = props.form.getFieldValue('mobile');
                  if (value === mobile) {
                    callback('密码不能和用户名相同');
                  }
                  callback();
                }
              }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              size="large"
              visibilityToggle
              placeholder="请输入密码"
            />
          )}
        </Form.Item>
        <Button type="primary" block size="large" htmlType="submit">
          注册
        </Button>
      </Form>
      {/* <Tabs
        type="card"
        onChange={(activeKey) => {
          setActiveKey(activeKey);
        }}
      >
        <TabPane tab="手机注册" key="1" forceRender={false}>
          {activeKey === '1' ? (
            <Form
              {...formItemLayout}
              labelAlign="left"
              onSubmit={(e) => {
                handleOk(e, 'mobileRegister');
              }}
            >
              <Form.Item>
                {getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: '请输入正确手机号', pattern: /^1[3456789]\d{9}$/ }
                  ]
                  // validateTrigger: 'onBlur'
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入手机号"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('verifyCode', {
                  rules: [{ required: true, message: '请输入短信验证码' }]
                })(
                  <Input
                    type="text"
                    size="large"
                    placeholder="请输入短信验证码"
                    suffix={
                      countDown === 0 || countDown === 60 ? (
                        <Button type="link" onClick={getVerifyCode}>
                          获取验证码
                        </Button>
                      ) : (
                        <span style={{ color: 'orange' }}>{countDown}秒后再发</span>
                      )
                    }
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '密码不能为空' },
                    {
                      validator: (rule, value, callback) => {
                        const mobile = props.form.getFieldValue('mobile');
                        if (value === mobile) {
                          callback('密码不能和用户名相同');
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input.Password
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    size="large"
                    visibilityToggle
                    placeholder="请输入密码"
                  />
                )}
              </Form.Item>
              <Button type="primary" block size="large" htmlType="submit">
                注册
              </Button>
            </Form>
          ) : null}
          {errMsg ? <div style={{ color: 'red' }}>{errMsg}</div> : null}
        </TabPane>

        <TabPane tab="邮箱注册" key="2" forceRender={false}>
          {activeKey === '2' ? (
            <Form
              {...formItemLayout}
              labelAlign="left"
              onSubmit={(e) => {
                handleOk(e, 'emailRegister');
              }}
            >
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: '请输入正确的用户名' },
                    {
                      validator: (rule, value, callback) => {
                        if (/^\d$/.test(value)) {
                          callback('您输入的用户名不符合规范');
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="可使用常用邮箱作用户名,支持数字，字母及“”组合"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [{ type: 'email', required: true, message: '请输入有效的邮箱地址' }]
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入邮箱地址"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(
                  <Input.Password
                    size="large"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    visibilityToggle
                    placeholder="请输入密码"
                  />
                )}
              </Form.Item>
              {errMsg ? <div style={{ color: 'red' }}>{errMsg}</div> : null}
              <Button type="primary" block size="large" htmlType="submit">
                注册
              </Button>
            </Form>
          ) : null}
        </TabPane>
      </Tabs> */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        已有账号？
        <Button
          type="link"
          onClick={() => {
            props.form.resetFields();
            setShowRegister(false);
            setShowLogin(true);
          }}
        >
          去登录
        </Button>
      </div>
    </div>
  ) : null;

  return (
    <Modal title="" visible={visible} footer={null} onCancel={handleCancel} onOk={handleOk}>
      {showLogin ? loginForm : null}
      {showRegister ? registerForm : null}
    </Modal>
  );
}

const WrapperForm = Form.create()(LoginRegister);

export default WrapperForm;
