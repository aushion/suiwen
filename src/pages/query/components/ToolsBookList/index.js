import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function ToolsBookList(props) {
  const { data, id, title, evaluate } = props;
  console.log('title',title)
  const { good, bad, isevalute } = evaluate;
  return (
    <div className={styles.Journal}>
        <div className={styles.ToolsBook}>
            <h2>
                <a
                href={`http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
                    RestTools.getKeyword(title)
                )}&c=crfdsearch`}
                target="_blank"
                rel="noopener noreferrer"
                >
                    <span>{RestTools.getKeyword(title)} </span>
                </a>- 知网工具书
            </h2>
        </div>
      {data.length
        ? data.map((item, index) => {
            return (
              <div
                key={index}
                className={styles.Journal_wrapper}
                style={{ borderBottom: index === data.length - 1 ? 'none' : '1px dashed #ccc' }}
              >
                <div className={styles.Journal_left}>
                  <img
                    src={`https://gongjushu.cnki.net/crfdpic/small/${item.工具书编号}fm_small.jpg`}
                    alt={RestTools.removeFlag(item.TITLE)}
                  />
                </div>
                <div className={styles.Journal_right}>
                  
                  <div className={styles.Journal_right_item}>
                    {/* <label htmlFor="">书目介绍：</label> */}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://gongjushu.cnki.net/RBook/${item.工具书编号}.html`}
                        dangerouslySetInnerHTML={{
                            __html: "<font size=\"3\"><b>"+RestTools.translateToRed(item.书目介绍)+(item.分辑名?"·"+item.分辑名:"")+"</b></font>"
                        }}
                    />
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">责任者：</label>
                    <span>{item.主要责任者}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">出版：</label>
                    <span>{item.出版者}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">ISBN：</label>
                    <span>{item.ISBN || '-'}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">出版时间：</label>
                    <span>{item.出版日期}</span>
                  </div>
                  <div className={styles.Journal_right_item}>
                    <label htmlFor="">简介：</label>
                    <span>{item.简介}</span>
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

export default ToolsBookList;