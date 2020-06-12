// import styles from './index.css';
import { ConfigProvider } from 'antd';
import BasicLayout from './BasicLayout';
import HomeLayout from './HomeLayout';
import SpecialLayout from './SpecialLayout';
import zhCN from 'antd/es/locale/zh_CN';

export default function(props) {
  // console.log('props.location.pathname', props.location.pathname);
  if (props.location.pathname === '/home' || props.location.pathname === '/') {
    return (
      <ConfigProvider locale={zhCN}>
        <HomeLayout>{props.children}</HomeLayout>
      </ConfigProvider>
    );
  } else if (props.location.pathname === '/special' || props.location.pathname === '/detail' || props.location.pathname === '/handleRedirect') {
    return (
      <ConfigProvider locale={zhCN}>
        <SpecialLayout>{props.children}</SpecialLayout>
      </ConfigProvider>
    );
  } else {
    return (
      <ConfigProvider locale={zhCN}>
        <BasicLayout>{props.children}</BasicLayout>
      </ConfigProvider>
    );
  }
}
