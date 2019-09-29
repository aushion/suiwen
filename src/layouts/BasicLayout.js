import { Layout } from 'antd';
import styles from './BasicLayout.less';
import SmartInput from '../components/SmartInput';
import { connect } from 'dva';
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
            <SmartInput
              question={props.question}
              onClickEnter={handleClickEnter}
              onClickItem={handleClickItem}
            ></SmartInput>
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

function mapStateToProps(state) {
  return state.global;
}
export default connect(mapStateToProps)(BasicLayout);
