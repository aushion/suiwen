// import styles from './index.css';
import { ConfigProvider } from 'antd';
import BasicLayout from './BasicLayout';
import HomeLayout from './HomeLayout';
import zhCN from 'antd/es/locale/zh_CN';
export default function(props) {
  if (props.location.pathname === '/home') {
    return (
      <ConfigProvider locale={zhCN}>
        <HomeLayout>{props.children}</HomeLayout>
      </ConfigProvider>
    );
  }
  return (
    <ConfigProvider locale={zhCN}>
      <BasicLayout>{props.children}</BasicLayout>
    </ConfigProvider>
  );
}
