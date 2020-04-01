import React, { useState, useEffect } from 'react';
import { Spin, List, Row, Col, Tabs, Divider, message, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Slider from 'react-slick';
import BlockTitle from './components/BlockTitle';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RestTools from '../../utils/RestTools';
import 医学 from '../../assets/医学.png';
import Link from 'umi/link';

let skillSlider = null;
let specialSlider = null;
let tagSlider = null;
const { TabPane } = Tabs;
const HISTORYKEY = RestTools.HISTORYKEY;
message.config({
  maxCount: 1,
  top: 50
});
function Home(props) {
  const { skillExamples, specialQuestions, newHelpList, loading } = props;
  const [activeTag, setActive] = useState(RestTools.getSession('tagIndex') || 0);
  const [activeSpecial, setActiveSpecial] = useState('专题问答');

  // useEffect(() => {
  //   RestTools.setSession('tagIndex', activeTag); //存储索引，解决页面回退，索引丢失的问题
  //   tagSlider.slickGoTo(activeTag, true);
  //   skillSlider.slickGoTo(activeTag, true);
  //   return () => {};
  // }, [activeTag]);

  const PrevArrow = function(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon type="left" className={homeStyles.arrow} />;
      </div>
    );
  };

  const NextArrow = function(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon type="right" className={homeStyles.arrow} />;
      </div>
    );
  };

  const specialActiveStyle = {
    backgroundColor: '#29A7F3',
    padding: '8px 14px',
    color: '#fff',
    borderRadius: 4
  };
  function prevrClick() {
    console.log(1);
  }
  const tagSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
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
    arrows: false,
    adaptiveHeight: true
  };

  const specialItemSetting = {
    centerMode: true,
    className: 'center',
    centerPadding: '0px',
    hoverPause: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    // swipe: true,
    // arrows: true,
    dots: true
  };

  function handleClickItem(item) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: item } });
    router.push('/result?q=' + encodeURIComponent(item));
    RestTools.setSession('q', item);
    RestTools.setStorageInput(HISTORYKEY, item);
  }

  function clickTag(i) {
    setActive(i);
    RestTools.setSession('tagIndex', i); //存储索引，解决页面回退，索引丢失的问题
    skillSlider.slickGoTo(i, true);
  }

  // function gotoSpecial(q,domain) {
  //   router.push(`/result?q=${q}&domain=${domain}`);
  // }

  // function gotoSpecial(topicId) {
  //   if (topicId === '3') {
  //     window.open(`http://qa2.cnki.net/jcyqa/home`);
  //   } else {
  //     router.push(`/special?topicId=${topicId}`);
  //   }
  // }

  // function getResultByTopic(topic, q) {
  //   if (topic === 'FL') {
  //     window.open(`http://qa2.cnki.net/jcyqa/result?q=${encodeURIComponent(q)}`);
  //   } else {
  //     router.push(`/result?topic=${topic}&q=${q}`);
  //   }
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
                      dangerouslySetInnerHTML={{ __html: RestTools.removeHtmlTag(item.answer) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })
    : null;

  const specialItem = specialQuestions.map((item, index) => {
    return (
      <div className={homeStyles.specialWrapper} key={item.name}>
        <Link
          className={homeStyles.picture}
          to={`/special?topicId=${item.topicId}`}
          target="_blank"
        >
          <img src={item.thumbUrl || 医学} alt={item.name} />
        </Link>

        <Link className={homeStyles.title} to={`/special?topicId=${item.topicId}`} target="_blank">
          <span style={{ color: '#23242A', fontSize: 24, paddingRight: 10 }}>{item.name}</span>
          <span style={{ color: '#C4C4C4', fontSize: 18 }}>{item.info.enText}</span>
        </Link>
        <div className={homeStyles.questions}>
          {item.data.slice(0, 5).map((child) => {
            return (
              <Link
                className={homeStyles.questions_item}
                to={`/result?topic=${item.info.topic}&q=${child.question}`}
                key={child.qId}
                target="_blank"
              >
                {child.question}
              </Link>
            );
          })}
        </div>
      </div>
    );
  });

  const tagList = skillExamples.length
    ? skillExamples.map((item, index) => (
        <div
          onClick={clickTag.bind(this, index)}
          // style={activeTag === index ? activeStyle : null}
          key={item.name}
          className={activeTag === index ? homeStyles.active_tag : homeStyles.tag}
        >
          {item.name}
        </div>
      ))
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
              <Slider {...tagSettings} ref={(slider) => (tagSlider = slider)}>
                {tagList}
              </Slider>
            </div>

            <div className={homeStyles.right_bottom}>
              <div className={homeStyles.wrapper}>
                {skillExamples.length ? (
                  <Slider {...skillSettings} ref={(slider) => (skillSlider = slider)}>
                    {slideList}
                  </Slider>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className={homeStyles.special}>
          {/* <div className={homeStyles.special_top}>
            <div className={homeStyles.title}>
              <BlockTitle enTitle="Topics" cnTitle="专题" />
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
          </div> */}

          <div className={homeStyles.special_bottom}>
            {/* <Slider {...specialSettings} ref={(slider) => (specialSlider = slider)}> */}
            <Tabs defaultActiveKey="1" type="card" tabBarGutter={0}>
              <TabPane tab="专题问答" key="1">
                <div className={homeStyles.topic}>
                  <div
                    className={homeStyles.arrowBtn}
                    onClick={() => {
                      specialSlider.slickPrev();
                    }}
                  >
                    <Icon type="left" />
                  </div>
                  <div className={homeStyles.special_questions}>
                    <Slider {...specialItemSetting} ref={(slider) => (specialSlider = slider)}>
                      {specialItem}
                    </Slider>
                  </div>
                  <div
                    className={homeStyles.arrowBtn}
                    style={{ right: 0 }}
                    onClick={() => {
                      specialSlider.slickNext();
                    }}
                  >
                    <Icon type="right" />
                  </div>
                </div>
              </TabPane>

              <TabPane tab="热门求助" key="2">
                <div className={homeStyles.special_help}>
                  <div className={homeStyles.help_left} />
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
                              <span title={item.Content}>{item.Content}</span>
                            </Link>
                            {item.CheckSum ? (
                              <span style={{ display: 'inline-block', overflow: 'hidden' }}>
                                回答数:{item.CheckSum}
                              </span>
                            ) : (
                              <Link
                                className={homeStyles.myReply}
                                to={`/reply?question=${item.Content}&QID=${item.ID}&domain=${item.Domain}`}
                              >
                                我来回答
                              </Link>
                            )}
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
                      MORE
                      <Icon type="double-right" />
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>

            {/* </Slider> */}
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
