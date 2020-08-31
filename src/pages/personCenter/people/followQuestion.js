import React from 'react';
import { Divider } from 'antd';
import PeopleMenu from '../components/PeopleMenu';
import styles from './people.less';

function FollowQuestion() {
  return (
    <div className={styles.people}>
      <div className={styles.menu}>
        <PeopleMenu />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>我关注的问题</div>
        <Divider></Divider>
        <div className={styles.content}></div>
      </div>
    </div>
  );
}

export default FollowQuestion;
