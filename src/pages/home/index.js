import React, { useState } from 'react';
import { Spin, List, Row, Col, Divider, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Slider from 'react-slick';
import BlockTitle from './components/BlockTitle';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RestTools from '../../utils/RestTools';
import 法律 from '../../assets/法律.png';
import 农业 from '../../assets/农业.png';
import 医学 from '../../assets/医学.png';
import Link from 'umi/link';

let skillSlider = null;
let specialSlider = null;
const HISTORYKEY = RestTools.HISTORYKEY;
message.config({
  maxCount: 1,
  top: 50
});
function Home(props) {
  const { skillExamples, specialQuestions, newHelpList, loading } = props;
  const [activeTag, setActive] = useState(RestTools.getSession('tagIndex') || 0);
  const [activeSpecial, setActiveSpecial] = useState('专题问答');
  const activeStyle = {
    backgroundColor: '#29A7F3',
    padding: '8px 24px',
    color: '#fff',
    borderRadius: 4
  };

  const specialActiveStyle = {
    backgroundColor: '#29A7F3',
    padding: '8px 14px',
    color: '#fff',
    borderRadius: 4
  };
  const skillSettings = {
    infinite: true,
    initialSlide: RestTools.getSession('tagIndex') || 0,
    swipe: false,
    arrows: false
  };

  const specialSettings = {
    autoplay: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipe: false,
    arrows: false
  };

  function handleClickItem(item) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: item } });
    router.push('/result?q=' + item);
    RestTools.setSession('q', item);
    RestTools.setStorageInput(HISTORYKEY, item);
  }

  function clickTag(i) {
    setActive(i);
    RestTools.setSession('tagIndex',i) //存储索引，解决页面回退，索引丢失的问题
    skillSlider.slickGoTo(i, true);
  }

  // function building() {
  //   message.warn({
  //     content: '正在建设中...',
  //     icon: <Icon type="smile" />
  //   });
  // }
  const slideList = skillExamples.length
    ? skillExamples.map((item) => {
        return (
          <div key={item.name} className={homeStyles.section}>
            {item.data.map((item) => {
              return (
                <div
                  key={item.qId}
                  className={homeStyles.item_wrapper}
                  onClick={handleClickItem.bind(this, item.q)}
                >
                  <div className={homeStyles.item} style={{ marginBottom: 12 }}>
                    <div className={homeStyles.icon} style={{ background: '#FAC500' }}>
                      Q
                    </div>
                    <div className={homeStyles.item_content} style={{ color: '#23242A' }}>
                      {item.q}
                    </div>
                  </div>
                  <div className={homeStyles.item}>
                    <div className={homeStyles.icon} style={{ background: '#4BC3FF' }}>
                      A
                    </div>
                    <div
                      className={homeStyles.item_content}
                      title={RestTools.removeTag(item.answer)}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })
    : null;

  return (
    <div className={homeStyles.home}>
      <Spin spinning={loading}>
        <div className={homeStyles.skill}>
          <div className={homeStyles.left}>
            <div className={homeStyles.title}>
              <BlockTitle cnTitle="技能" enTitle="Skill" />
            </div>
            <div className={homeStyles.bg}></div>
          </div>

          <div className={homeStyles.right}>
            <div className={homeStyles.right_top}>
              {skillExamples.length
                ? skillExamples.map((item, index) => (
                    <span
                      onClick={clickTag.bind(this, index)}
                      style={activeTag === index ? activeStyle : null}
                      key={item.name}
                      className={homeStyles.tag}
                    >
                      {item.name}
                    </span>
                  ))
                : null}
            </div>

            <div className={homeStyles.right_bottom}>
              <div className={homeStyles.wrapper}>
                <Slider {...skillSettings} ref={(slider) => (skillSlider = slider)}>
                  {slideList}
                </Slider>
              </div>
            </div>
          </div>
        </div>
        <div className={homeStyles.special}>
          <div className={homeStyles.special_top}>
            <div className={homeStyles.title}>
              <BlockTitle enTitle="Special" cnTitle="专题" />
            </div>
            <div className={homeStyles.modular}>
              <span
                onClick={() => {
                  setActiveSpecial('专题问答');
                  specialSlider.slickGoTo(0);
                }}
                style={activeSpecial === '专题问答' ? specialActiveStyle : null}
                className={homeStyles.tag}
              >
                专题问答
              </span>
              <span
                onClick={() => {
                  setActiveSpecial('热门求助');
                  specialSlider.slickGoTo(1);
                }}
                style={activeSpecial === '热门求助' ? specialActiveStyle : null}
                className={homeStyles.tag}
              >
                热门求助
              </span>
            </div>
          </div>

          <div className={homeStyles.special_bottom}>
            <Slider {...specialSettings} ref={(slider) => (specialSlider = slider)}>
              <div className={homeStyles.special_questions}>
                {specialQuestions.length ? (
                  <Row gutter={56}>
                    <Col span={8} className={homeStyles.specialItem}>
                      <div className={homeStyles.specialWrapper}>
                        <div className={homeStyles.picture}>
                          <img src={法律} alt="法律" />
                        </div>
                        <div className={homeStyles.title}>
                          <span style={{ color: '#23242A', fontSize: 24 }}>法律</span>{' '}
                          <span style={{ color: '#C4C4C4', fontSize: 18 }}>Law</span>
                        </div>
                        <div className={homeStyles.questions}>
                          {specialQuestions
                            .filter((item) => item.name === '法律')[0]
                            .data.slice(0, 2)
                            .map((item) => {
                              return (
                                <a
                                  className={homeStyles.questions_item}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={`http://qa.cnki.net/web/SQuery?q=${encodeURIComponent(item.q)}&r=query&domain=${encodeURIComponent('法律')}`}
                                  key={item.qid}
                                >
                                  {item.q}
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    </Col>

                    <Col span={8} className={homeStyles.specialItem}>
                      <div className={homeStyles.specialWrapper}>
                        <div className={homeStyles.picture}>
                          <img src={医学} alt="医学" />
                        </div>
                        <div className={homeStyles.title}>
                          <span style={{ color: '#23242A', fontSize: 24 }}>医学</span>{' '}
                          <span style={{ color: '#C4C4C4', fontSize: 18 }}>Medicine</span>
                        </div>
                        <div className={homeStyles.questions}>
                          {specialQuestions
                            .filter((item) => item.name === '医学')[0]
                            .data.slice(0, 2)
                            .map((item) => {
                              return (
                                <a
                                  href={`http://qa.cnki.net/web/SQuery?q=${encodeURIComponent(item.q)}&r=query&domain=${encodeURIComponent('医学')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={homeStyles.questions_item}
                                  // onClick={building}
                                  key={item.qid}
                                >
                                  {item.q}
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    </Col>

                    <Col span={8} className={homeStyles.specialItem}>
                      <div className={homeStyles.specialWrapper}>
                        <div className={homeStyles.picture}>
                          <img src={农业} alt="农业" />
                        </div>
                        <div className={homeStyles.title}>
                          <span style={{ color: '#23242A', fontSize: 24 }}>农业</span>{' '}
                          <span style={{ color: '#C4C4C4', fontSize: 18 }}>Argiculture</span>
                        </div>
                        <div className={homeStyles.questions}>
                          {specialQuestions
                            .filter((item) => item.name === '农业')[0]
                            .data.slice(0, 2)
                            .map((item) => {
                              return (
                                <a
                                  href={`http://qa.cnki.net/web/SQuery?q=${encodeURIComponent(item.q)}&r=query&domain=${encodeURIComponent('农业')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={homeStyles.questions_item}
                                  // onClick={building}
                                  key={item.qid}
                                >
                                  {item.q}
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : null}
              </div>
              <div className={homeStyles.special_help}>
                <div className={homeStyles.help_left}></div>

                <div className={homeStyles.help_right}>
                  <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={newHelpList.slice(0, 5)}
                    renderItem={(item) => (
                      <List.Item style={{ fontSize: 16, color: '#5B5B5D', fontWeight: 400 }}>
                        <div
                          className={homeStyles.help_item}
                          onClick={() => {
                            RestTools.setSession('q', item.Content);
                          }}
                          // onClick={handleClickItem.bind(this, item.Content)}
                        >
                          <Link
                            to={`/reply?question=${item.Content}&QID=${item.ID}&domain=${item.Domain}`}
                            className={homeStyles.help_item_content}
                          >
                            {item.Content}
                          </Link>
                          <span
                            style={{
                              display: 'inline-block',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                          >
                            我来回答
                          </span>
                          <Divider type="vertical" style={{ top: '-5px' }}></Divider>
                          <span style={{ float: 'right' }}>{item.Time}</span>
                        </div>
                      </List.Item>
                    )}
                  />

                  <div
                    className={homeStyles.help_more}
                    onClick={() => {
                      router.push('/help/newHelp');
                    }}
                  >
                    MORE>>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </Spin>
    </div>
  );
}

function mapStateToProps(state) {
  // const { newHelpList } = state.home;
  return {
    ...state.home,
    ...state.global,
    loading: state.loading.models.home
  };
}

export default connect(mapStateToProps)(Home);
