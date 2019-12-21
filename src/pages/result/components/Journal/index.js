import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function Journal(props) {
  const { data } = props;
  return (
    <div className={styles.Journal}>
      {data.length
        ? data.map((item) => (
            <div key={item.ID} className={styles.Journal_wrapper}>
              <div className={styles.Journal_left}>
                <img
                  src={`http://c61.cnki.net/CJFD/small/${item.拼音刊名}.jpg`}
                  alt={item.拼音刊名}
                />
              </div>
              <div className={styles.Journal_right}>
                <div className={styles.Journal_right_item} style={{ fontSize: 16 }}>
                  <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.主题) }} />
                  <span>{item.英文名}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">主办单位:</label>
                  <span>{item.主办单位}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">ISSN:</label>
                  <span>{item.ISSN}</span>主办单位
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">CN:</label>
                  <span>{item.CN}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">综合影响因子:</label>
                  <span>{item.综合影响因子}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">复合影响因子:</label>
                  <span>{item.复合影响因子}</span>
                </div>
              </div>
            </div>
          ))
        : null}

      <a
        style={{ display: 'block', textAlign: 'right' }}
        href="http://navi.cnki.net/KNavi/All.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        更多期刊
      </a>
    </div>
  );
}

export default Journal;
