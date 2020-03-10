import { useState } from 'react';
import { Tabs, Modal } from 'antd';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';

const { TabPane } = Tabs;
function Sentence(props) {
  const { data } = props;
  const { id, evaluate } = data[0];
  const { good, bad, isevaluate } = evaluate;
  const sentenceData = data.map((item) => {
    return {
      tabkey: RestTools.removeFlag(item.dataNode[0].区别左词项 || item.dataNode[0].区别右词项),
      data: item.dataNode
    };
  });

  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }

  function callback(key) {
    // console.log(key);
  }

  function handleShowMore(e, str) {
    if (e.target.className === 'showMore') {
      showMore(str.substr(300, str.length));
    }
  }
  return (
    <div className={styles.Sentence}>
      <div className={styles.Sentence_title}>{data[0].title || ''}</div>
      <div className={styles.Sentence_answer}>
        <Tabs defaultActiveKey="0" onChange={callback}>
          {sentenceData.length
            ? sentenceData.map((item, index) => {
                return (
                  <TabPane tab={item.tabkey} key={`${index}`}>
                    {item.data.length
                      ? item.data.map((current) => {
                          const answer = current.Answer
                            ? current.Answer.length > 300
                              ? current.Answer.substr(0, 300) + '<a class="showMore"> 更多>></a>'
                              : current.Answer
                            : '';
                          return (
                            <div key={current.工具书编号} className={styles.Sentence_item}>
                              <div
                                onClick={(e) => handleShowMore(e, current.Answer)}
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
                                  {`--${RestTools.removeFlag(current.工具书名称)}`}
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
      <div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevaluate={isevaluate}></Evaluate>
      </div>
      <Modal
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
      </Modal>
    </div>
  );
}

export default Sentence;
