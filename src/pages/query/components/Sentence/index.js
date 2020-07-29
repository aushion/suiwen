import { useState } from 'react';
import { Tabs } from 'antd';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';
import arrow_up from '../../../../assets/arrow_up.png';
import arrow_down from '../../../../assets/arrow_down.png';

const { TabPane } = Tabs;
function Sentence(props) {
  const { data } = props;
  const { id, evaluate } = data[0];
  const { good, bad, isevaluate } = evaluate;
  const sentenceData = data.map((item) => {
    return {
      tabkey: RestTools.removeFlag(
        item.dataNode[0].人名左 ||
          item.dataNode[0].人名右 ||
          item.dataNode[0].区别左词项 ||
          item.dataNode[0].区别右词项
      ),
      data: item.dataNode
    };
  });

  const [sData, updateData] = useState(sentenceData);
  const [pageYoffset, setPageYoffeset] = useState(0);

  function handleShowMore(e, item, index) {
    if (e.target.className === 'showMore') {
      setPageYoffeset(window.pageYOffset); //记录滚动位置
      const [m, n] = index;
      const newItem = { ...item, fullAnswer: item.Answer };
      const newSdata = [...sData];
      newSdata[m].data[n] = newItem;
      updateData(newSdata);
    } else if (e.target.className === 'up') {
      window.scrollTo({ top: pageYoffset }); //滚动到原始位置
      const [m, n] = index;
      const newItem = { ...item, fullAnswer: '' };
      const newSdata = [...sData];
      newSdata[m].data[n] = newItem;
      updateData(newSdata);
    }
  }

  function handleAnswer(item) {
    let answer = '';
    if (item.Answer.length <= 300) {
      answer = item.Answer;
    } else if (item.Answer.length > 300 && item.fullAnswer) {
      answer =
        item.fullAnswer +
        `<a class="up" style="color:#2090E3">  收起<img style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`;
    } else {
      answer = `${RestTools.removeHtmlTag(item.Answer).substr(
        0,
        300
      )} <a class="showMore" style="color:#2090E3"> 更多<img style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/> </a>`;
    }

    return answer;
  }

  return (
    <div className={styles.Sentence}>
      <div className={styles.Sentence_title}>{data[0].title || ''}</div>
      <div className={styles.Sentence_answer}>
        <Tabs defaultActiveKey="0">
          {sData.length
            ? sData.map((item, index) => {
                return (
                  <TabPane tab={item.tabkey} key={`${index}`}>
                    {item.data.length
                      ? item.data.map((current, currentIndex) => {
                          const answer = handleAnswer(current);
                          return (
                            <div key={current.工具书编号} className={styles.Sentence_item}>
                              <div
                                onClick={(e) => handleShowMore(e, current, [index, currentIndex])}
                                dangerouslySetInnerHTML={{
                                  __html: RestTools.removeFlag(answer)
                                }}
                              />
                              <div className={styles.Sentence_extra}>
                                <a
                                  className={styles.Sentence_name}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={`http://gongjushu.cnki.net/RBook/Book/BookDetail?fn=${current.工具书编号}`}
                                >
                                  {`${RestTools.removeFlag(current.工具书名称)}`}
                                </a>
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </TabPane>
                );
              })
            : null}
        </Tabs>
      </div>
      <div style={{ paddingTop: 5 }}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevaluate={isevaluate}></Evaluate>
      </div>
      {/* <Modal
        visible={visible}
        footer={null}
        style={{ top: 40, left: '29%' }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          style={{
            paddingTop: 10,
            color: '#333',
            letterSpacing: '2px',
            lineHeight: '27.2px',
            textIndent: '2em'
          }}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.formatText(initialText))
          }}
        />
      </Modal> */}
    </div>
  );
}

export default Sentence;
