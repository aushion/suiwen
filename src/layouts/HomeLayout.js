import { Layout } from 'antd';
import styles from './HomeLayout.less';
const { Header, Footer, Content } = Layout;

function HomeLayout(props) {
  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div>homeheader</div>
      </Header>
      <Content className={styles.content}>{props.children}</Content>
      <Footer>
        <div className={styles.footer}>homefooter</div>
      </Footer>
    </div>
  );
}
export default HomeLayout;
