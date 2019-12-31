import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function Journal(props) {
  const { data, id, evaluate } = props;
  const { good, bad, isevalute } = evaluate;
  return (
    <div className={styles.Journal}>
      {data.length
        ? data.map((item) => (
            <div key={item.ID} className={styles.Journal_wrapper}>
              <div className={styles.Journal_left}>
                <img
                  src={`http://c61.cnki.net/CJFD/small/${RestTools.removeFlag(item.拼音刊名)}.jpg`}
                  alt={RestTools.removeFlag(item.拼音刊名)}
                />
              </div>
              <div className={styles.Journal_right}>
                <a
                  className={styles.Journal_right_item}
                  style={{ fontSize: 16, }}
                  href={`http://navi.cnki.net/KNavi/pubDetail?pubtype=journal&pcode=CJFD&baseid=${RestTools.removeFlag(
                    item.ID || item.拼音刊名
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.主题) }} />
                  <span>{item.英文名}</span>
                </a>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">主办单位：</label>
                  <span>{item.主办单位 || '-'}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">ISSN：</label>
                  <span>{item.ISSN || '-'}</span>主办单位
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">CN：</label>
                  <span>{item.CN}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">综合影响因子：</label>
                  <span>{item.综合影响因子}</span>
                </div>
                <div className={styles.Journal_right_item}>
                  <label htmlFor="">复合影响因子：</label>
                  <span>{item.复合影响因子}</span>
                </div>
              </div>
            </div>
          ))
        : null}

      <a
        style={{ display: 'block', textAlign: 'right', color: '#999', fontSize: 14 }}
        href="http://navi.cnki.net/KNavi/All.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        更多期刊
      </a>

      <div className={styles.Journal_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default Journal;
