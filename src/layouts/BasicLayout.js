import { Layout } from 'antd';
import styles from './BasicLayout.less'

const { Header, Footer, Content } = Layout;

function BasicLayout(props){

  return <div className={styles.wrapper}>
    <Header className={styles.header}>
      <div>basicheader</div>
    </Header>
    <Content className={styles.content}>{props.children}</Content>
    <Footer className={styles.footer}>
      <div>basicfooter</div>
    </Footer>
  </div>
}
export default BasicLayout