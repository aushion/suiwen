import { useState } from 'react';
import { Modal, Pagination } from 'antd';
import Cookies from 'js-cookie';
import RestTools from '../../../utils/RestTools';
import Evaluate from './Evaluate';
import styles from './Graphic.less';

function Graphic(props) {
  const {
    data,
    intentFocus,
    title,
    pagination = {},
    evaluate = null,
    id,
    domain,
    q,
    intentJson,
    intentDomain,
    dispatch
  } = props;
  const { good = null, bad = null, isevalute = null } = evaluate || {};
  const { pageStart = 1, pageCount = 10, total } = pagination;
  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }
  const answerMap = {
    最美四季: {
      最美四季: {
        title: '景点',
        answer: '简介',
        focus: ['景点', '简介']
      }
    },
    恐龙: {
      恐龙大全: {
        title: '名称',
        answer: '简介',
        focus: ['名称', '简介']
      }
    },
    茶: {
      茶: {
        title: '名称',
        answer: '内容',
        focus: ['名称', '内容']
      },
      茶的种类: {
        title: '茶名',
        answer: '内容',
        focus: ['茶名', '内容']
      }
    },
    养生: {
      养生: {
        title: '养生餐',
        answer: '制作',
        focus: ['养生餐', '制作']
      }
    },
    故事: {
      故事大全: {
        title: 'Title',
        answer: 'Answer',
        focus: ['故事名称', '来源', '故事内容']
      }
    },
    谜语: {
      谜语: {
        title: 'Title',
        answer: 'Answer',
        focus: ['谜底', '谜面']
      }
    },
    历史: {
      历史年鉴: {
        title: 'Title',
        answer: 'Answer',
        focus: ['简介']
      }
    },
    菊花: {
      盆栽方式: {
        title: '菊花种类',
        answer: '盆栽方式',
        focus: ['盆栽方式']
      },
      品种: {
        title: '命名方式',
        answer: '品种',
        focus: ['品种']
      },
      菊花文化: {
        title: '菊花文化',
        answer: '菊花文化的含义',
        focus: ['菊花文化']
      },
      产业化: {
        title: '产业化',
        answer: '产业化的内容',
        focus: ['产业化']
      },
      最佳搭配: {
        title: '最佳搭配',
        answer: '制作过程',
        focus: ['最佳搭配', '制作过程']
      },
      花期: {
        title: '菊花种类',
        answer: '花期',
        focus: ['花期']
      },
      化学成分: {
        title: '化学成分',
        answer: '化学成分三级类',
        focus: ['化学成分', '化学成分四级类']
      },
      瓣型: {
        title: '花型',
        answer: '特征',
        focus: ['花型', '特征']
      }
    }
  };

  function handleShowMore(e, str) {
    if (e.target.className === 'showMore') {
      showMore(str.substr(300, str.length));
    }
  }

  function changePage(pageIndex, pageSize) {
    const userId = RestTools.getLocalStorage('userInfo')
      ? RestTools.getLocalStorage('userInfo').UserName
      : Cookies.get('cnki_qa_uuid');
    dispatch({
      type: 'result/getAnswer',
      payload: {
        q: encodeURIComponent(q),
        pageStart: pageIndex,
        pageCount: 10,
        userId
      }
    });
  }

  const Translate = function(props) {
    return (
      <div>
        <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>
          {intentJson.results[0].fields['词汇']}
        </div>
        <div style={{ textAlign: 'right' }}>
          <a
            style={{
              color: 'rgb(153, 153, 153)'
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://dict.cnki.net/dict_result.aspx?searchword=${encodeURIComponent(
              intentJson.results[0].fields['词汇']
            )}`}
          >
            试试CNKI翻译助手
          </a>
        </div>
      </div>
    );
  };

  const SpecialCom = function(props) {
    return (
      <div style={{ padding: '10px' }}>
        {data.map((item, index) => {
          const tagTitle = answerMap[domain][intentDomain].title === 'Title' ? '': `【${answerMap[domain][intentDomain].title}】`;
          const tagAnswer = answerMap[domain][intentDomain].answer === 'Answer'?'': `【${answerMap[domain][intentDomain].answer}】`
          const title = item[answerMap[domain][intentDomain].title] || '';
          const originAnswer = item[answerMap[domain][intentDomain].answer];
          const isFocus = answerMap[domain][intentDomain].focus.includes(intentFocus)
          const answer = originAnswer
            ? originAnswer.length > 300
              ? originAnswer.substr(0, 300) + '<a class="showMore"> 更多>></a>'
              : originAnswer
            : '';
          return (
            <div className={styles.answer_item} key={index} style={{ padding: '10px' }}>
              {/* {intentFocus === '省份' ? <div>地点：{item[intentFocus]}</div> : null} */}
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: `${tagTitle} <span style="font-weight: bold">${RestTools.translateToRed(title)}</span> `
                  }}
                />
              }
              {isFocus === false ? <div 
                dangerouslySetInnerHTML={{__html: `【${intentFocus}】 ${item[intentFocus]}`}}
              ></div> :null}
            {originAnswer ?   <div
                onClick={(e) => handleShowMore(e, originAnswer)}
                dangerouslySetInnerHTML={{
                  __html: `${tagAnswer} ${answer}`
                }}
              />:null}
            </div>
          );
        })}
      </div>
    );
  };

  const Default = function(props) {
    return (
      <div style={{ textIndent: '2em' }}>
        {data.map((item, index) => {
          let oldAnswer = RestTools.UnicodeToAscii(
            item.hasOwnProperty('Answer') ? item.Answer : item[intentFocus]
          );
          let answer = oldAnswer
            ? oldAnswer.length > 300
              ? oldAnswer.substring(0, 300) + '<a class="showMore"> 更多>></a>'
              : oldAnswer
            : '';
          return (
            <div key={index} className={styles.answer_item}>
              <div
                key={index}
                onClick={(e) => handleShowMore(e, oldAnswer)}
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(answer)
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.Graphic}>
      <div style={{ color: '#2f8bd6', fontSize: 20 }}>{title}</div>

      <div className={styles.wrapper}>
        {domain === '翻译' ? <Translate /> : answerMap[domain] && answerMap[domain][intentDomain] ? <SpecialCom /> : <Default />}
      </div>
      <div>
        {pagination && total > pageCount ? (
          <Pagination size="small" current={pageStart} total={total} onChange={changePage} />
        ) : null}
      </div>
      <div>
        {evaluate ? (
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        ) : null}
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

export default Graphic;
