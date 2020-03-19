// import styles from './index.css';
import { ConfigProvider } from 'antd';
import BasicLayout from './BasicLayout';
import HomeLayout from './HomeLayout';
import SpecialLayout from './SpecialLayout';
import zhCN from 'antd/es/locale/zh_CN';

export default function(props) {
  if (props.location.pathname === '/home') {
    return (
      <ConfigProvider locale={zhCN}>
        <HomeLayout>{props.children}</HomeLayout>
      </ConfigProvider>
    );
  } else if (props.location.pathname === '/special') {
    return (
      <ConfigProvider locale={zhCN}>
        <SpecialLayout>{props.children}</SpecialLayout>
      </ConfigProvider>
    );
  }
  return (
    <ConfigProvider locale={zhCN}>
      <BasicLayout>{props.children}</BasicLayout>
    </ConfigProvider>
  );
}
