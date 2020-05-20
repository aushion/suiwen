import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function ReferenceBook63(props) {
  const { data, id, evaluate } = props;
  const { good, bad, isevalute } = evaluate;
  return (
    <div className={styles.reference}>
      {data.length
        ? data.map((item) => {
            return (
              <div key={item.ID} className={styles.Journal_wrapper}>
                <div className={styles.Journal_left}>
                  <img
                    src={`http://gongjushu.cnki.net/crfdpic/small/${item.工具书编号}fm_small.jpg`}
                    alt={RestTools.removeFlag(item.书目介绍)}
                  />
                </div>
                <div className={styles.Journal_right}>
                  <a
                    className={styles.Journal_right_item}
                    style={{ fontSize: 16 }}
                    href={`http://gongjushu.cnki.net/RBook/Book/BookDetail?fn=${item.工具书编号}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.书目介绍) }}
                    />
                  </a>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">责任者：</label>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.主要责任者 || '-')
                      }}
                    />
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">出版：</label>
                    <span>{item.出版者 || '-'}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">ISBN：</label>
                    <span>{item.ISBN || '-'}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">出版时间：</label>
                    <span>{item.出版日期 || '-'}</span>
                  </div>
                </div>
              </div>
            );
          })
        : null}

      <div className={styles.Journal_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default ReferenceBook63;
