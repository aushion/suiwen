import React from 'react';
import Evaluate from '../Evaluate';
import RestTools from 'Utils/RestTools';
import styles from './index.less';
export default function Publication(props) {
  let { intentDomain, id, evaluate = {}, data = [] } = props;
  const { good = 0, bad = 0, isevalute = false } = evaluate;

  function handleError(e) {
    var img = e.target;
    img.src = 'https://data.cnki.net/Resources/design/images/NJDefaultPic.jpg';
    img.onerror = null;
  }
  const tongjikanwu =
    data.length && intentDomain === '统计刊物'
      ? data.map((item, index) => (
          <div key={index} className={styles.Statistics_wrapper}>
            <div className={styles.Statistics_left}>
              <img
                src={`http://c61.cnki.net/cyfd/${item.编号}.jpg`}
                onError={handleError.bind(this)}
                alt={RestTools.removeFlag(item.刊物)}
              />
            </div>
            <div className={styles.Statistics_right}>
              <a
                className={styles.Statistics_right_item}
                style={{ fontSize: 16 }}
                href={`http://data.cnki.net/yearbook/Single/${item.编号}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.刊物) }} />
                {/* <span>{item.英文名}</span> */}
              </a>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">收录年份：</label>
                <span>{item.收录年份 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">历任主编：</label>
                <span>{item.历任主编 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">编撰机构：</label>
                <span>{item.主编单位 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">出版社：</label>
                <span>{item.出版者 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">出版地：</label>
                <span
                  dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.地区) || '-' }}
                />
              </div>
            </div>
          </div>
        ))
      : null;

  return (
    <div className={styles.Statistics}>
      {intentDomain === '统计刊物' ? tongjikanwu : null}
      <div className={styles.Journal_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}
