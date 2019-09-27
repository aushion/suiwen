import { Layout } from 'antd';
import styles from './BasicLayout.less';
import SmartInput from '../components/SmartInput';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  function handleClickEnter(value) {
    console.log(value);
  }

  function handleClickItem(value) {
    console.log(value);
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.inputGroup}>
          <div className={styles.logo}></div>
          <div className={styles.inputWrap}>
            <SmartInput onClickEnter={handleClickEnter} onClickItem={handleClickItem}></SmartInput>
          </div>
        </div>
      </Header>
      <Content className={styles.content}>{props.children}</Content>
      <Footer className={styles.footer}>
        <div>basicfooter</div>
      </Footer>
    </div>
  );
}
export default BasicLayout;
