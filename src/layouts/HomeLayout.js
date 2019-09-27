import { Layout } from 'antd';
import SmartInput from '../components/SmartInput'
import styles from './HomeLayout.less';
import router from 'umi/router';
const { Header, Footer, Content } = Layout;

function HomeLayout(props) {
  function handleClickEnter(value) {
    console.log(value)
    value && router.push(`/result?question=${value}`)
  }
  function handleClickItem(value) {
    value && router.push(`/result?question=${value}`)
  }
  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.logo1}></div>
        <div className={styles.logo2}></div>
        <div className={styles.inputWrap}>
          <SmartInput onClickEnter={handleClickEnter} onClickItem={handleClickItem}></SmartInput>
        </div>
      </Header>
      <Content className={styles.content}>{props.children}</Content>
      <Footer className={styles.footer}>
        <div >homefooter</div>
      </Footer>
    </div>
  );
}
export default HomeLayout;
