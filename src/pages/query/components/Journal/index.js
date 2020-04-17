import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function Journal(props) {
  const { data, id, evaluate } = props;
  const { good, bad, isevalute } = evaluate;
  return (
    <div className={styles.Journal}>
      {data.length
        ? data.map((item) => {
          // const size = item.核心期刊版次 ? 'mid': 'small'
            return (
              <div key={item.ID} className={styles.Journal_wrapper}>
                <div className={styles.Journal_left}>
                  <img
                    src={`http://c61.cnki.net/CJFD/${'big'}/${RestTools.removeFlag(
                      item.拼音刊名
                    )}.jpg`}
                    alt={RestTools.removeFlag(item.拼音刊名)}
                  />
                </div>
                <div className={styles.Journal_right}>
                  {item.核心期刊版次 ? (
                    <div>
                      <h3 style={{ color: 'red',fontWeight: 'bold' }}>核心期刊</h3>
                      <div>
                        收录版次：
                        {item.核心期刊版次
                          .split(';')
                          .map((item) => RestTools.version[item])
                          .join(';')}
                      </div>
                    </div>
                  ) : null}
                  <a
                    className={styles.Journal_right_item}
                    style={{ fontSize: 16 }}
                    href={`http://navi.cnki.net/KNavi/pubDetail?pubtype=journal&pcode=CJFD&baseid=${RestTools.removeFlag(
                      item.ID || item.拼音刊名
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.主题) }}
                    />
                    <span>{item.英文名}</span>
                  </a>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">主办单位：</label>
                    <span>{item.主办单位名称 || '-'}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">ISSN：</label>
                    <span>{item.ISSN || '-'}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">CN：</label>
                    <span>{item.CN}</span>
                  </div>
                  {item.综合影响因子 ? (
                    <div className={styles.Journal_right_item}>
                      <label htmlFor="">综合影响因子：</label>
                      <span>{item.综合影响因子 || '-'}</span>
                    </div>
                  ) : null}
                  {item.复合影响因子 ? (
                    <div className={styles.Journal_right_item}>
                      <label htmlFor="">复合影响因子：</label>
                      <span>{item.复合影响因子 || '-'}</span>
                    </div>
                  ) : null}
                  {item.期刊网址 ? (
                    <div className={styles.Journal_right_item}>
                      <label htmlFor="">网址：</label>
                      <span>{item.期刊网址 || '-'}</span>
                    </div>
                  ) : null}
                  <div>
                    {item.收录来源 ? (
                      <div className={styles.Journal_right_item}>
                        <div style={{ color: 'red', fontWeight: 'bold' }}>
                          该刊被以下数据库录取：
                        </div>
                        <div>
                          <span>{item.收录来源}</span>
                        </div>
                      </div>
                    ) : null}

                    {item.核心期刊版次 ? (
                      <div  style={{ color: '#999', fontSize: 12 }}>
                        注:按照惯例，北大核心期刊每四年由北大图书馆评定一次，并出版
                        《北大核心期刊目录要览》一书.当前最新版次2014年版。
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
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
