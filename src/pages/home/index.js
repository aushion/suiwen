import React, { useState } from 'react';
import { Spin, List, Tabs, Divider, message, Icon, Carousel, Badge, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Slider from 'react-slick';
import BlockTitle from './components/BlockTitle';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RestTools from '../../utils/RestTools';
import 医学 from '../../assets/医学.png';
import rd from '../../assets/rd.png';
import docGen from '../../assets/docGen.png';
import tech from '../../assets/tech.png';

let skillSlider = null;
let specialSlider = null;
// let tagSlider = null;
const { TabPane } = Tabs;
const HISTORYKEY = RestTools.HISTORYKEY;
message.config({
  maxCount: 1,
  top: 50
});
function Home(props) {
  let { skillExamples, specialQuestions, newHelpList, loading, skillPicture, helpPicture } = props;
  const [activeTag, setActive] = useState(Number(sessionStorage.getItem('tagIndex')) || 0);
  const special_questions = specialQuestions.filter((item) => item.name !== '细粒度知识问答');
  const experience_questions = specialQuestions.filter((item) => item.name === '细粒度知识问答');
  const [activeTagName, setActiveTag] = useState(sessionStorage.getItem('tagName') || '');

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
    initialSlide: JSON.parse(window.sessionStorage.getItem('tagIndex')) || 0,
    swipe: false,
    arrows: false
  };

  const specialItemSetting = {
    centerMode: specialQuestions.length > 3 && true,
    className: specialQuestions.length > 3 ? 'center' : '',
    centerPadding: '0px',
    hoverPause: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    autoplay: true
  };

  function handleClickItem(item) {
    if (item && item.trim()) {
      props.dispatch({ type: 'global/setQuestion', payload: { q: item } });
      router.push('/query?q=' + encodeURIComponent(item));
      RestTools.setSession('q', item);
      RestTools.setStorageInput(HISTORYKEY, item.trim());
    }
  }

  function clickTag(i, name) {
    setActive(i);
    setActiveTag(name);
    RestTools.setSession('tagIndex', i); //存储索引，解决页面回退，索引丢失的问题
    RestTools.setSession('tagName', name); //存储索引，解决页面回退，索引丢失的问题
    skillSlider.slickGoTo(i, true);
  }

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

  const specialItem = special_questions.length
    ? special_questions.map((item, index) => {
        return (
          <div
            className={homeStyles.specialWrapper}
            key={item.name}
            style={{ width: '90% !important' }}
          >
            <Link
              className={homeStyles.picture}
              to={`/special?topicId=${item.topicId}`}
              target="_blank"
            >
              <img src={item.thumbUrl || 医学} alt={item.name} />
            </Link>

            <Link
              className={homeStyles.title}
              to={`/special?topicId=${item.topicId}`}
              target="_blank"
            >
              {item.name === '细粒度知识问答' ? (
                <Badge
                  count={
                    <div style={{ backgroundColor: '#f50', color: '#fff', padding: '2px 4px' }}>
                      Beta
                    </div>
                  }
                >
                  <span style={{ color: '#23242A', fontSize: 24, paddingRight: 10 }}>
                    {item.name}
                  </span>
                </Badge>
              ) : (
                <span style={{ color: '#23242A', fontSize: 24, paddingRight: 10 }}>
                  {item.name}
                </span>
              )}
            </Link>
            <div className={homeStyles.questions}>
              {item.data.slice(0, 5).map((child) => {
                return (
                  <Link
                    className={homeStyles.questions_item}
                    to={`/query?topic=${item.info.topic}&topicName=${encodeURIComponent(
                      item.name
                    )}&q=${encodeURIComponent(child.question)}`}
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
      })
    : null;

  const tagList = skillExamples.length
    ? skillExamples.map((item, index) => (
        <div
          onClick={clickTag.bind(this, index, item.name)}
          // style={activeTag === index ? activeStyle : null}
          key={item.name}
          className={activeTag === index ? homeStyles.active_tag : homeStyles.tag}
        >
          {item.name}
        </div>
      ))
    : null;

  //取设定最大值与最小值之间的随机数
  // function random(min, max) {
  //   return Math.floor(Math.random() * (max - min)) + min;
  // }

  return (
    <div className={homeStyles.home}>
      <Spin spinning={loading}>
        <div className={homeStyles.skill}>
          <div className={homeStyles.left}>
            <div className={homeStyles.title}>
              <BlockTitle cnTitle="技能" enTitle="Skill" />
            </div>
            <div className={homeStyles.bg}>
              <Carousel dotPosition="bottom" autoplay={skillPicture.length > 1} dots>
                {activeTagName === '核心技术' ? (
                  <div style={{ width: 400 }}>
                    <img
                      style={{ width: '100%', height: 320, borderRadius: 10 }}
                      src={tech}
                      alt="核心技术"
                    />
                  </div>
                ) : (
                  skillPicture.map((item) => (
                    <div style={{ width: 400 }} key={item}>
                      <img
                        style={{ width: '100%', height: 320, borderRadius: 10 }}
                        src={item}
                        alt={item}
                      />
                    </div>
                  ))
                )}
              </Carousel>
            </div>
          </div>

          <div className={homeStyles.right}>
            <div className={homeStyles.right_top}>
              <Slider {...tagSettings}>{tagList}</Slider>
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
          <div className={homeStyles.special_top}>
            <div className={homeStyles.title}>
              <BlockTitle enTitle="Topics" cnTitle="专题" />
            </div>
          </div>
          <div className={homeStyles.special_bottom}>
            {/* <Slider {...specialSettings} ref={(slider) => (specialSlider = slider)}> */}
            <Tabs defaultActiveKey="1" type="card" tabBarGutter={0}>
              <TabPane tab="专题问答" key="1">
                <div className={homeStyles.topic}>
                  <div
                    className={homeStyles.arrowBtn}
                    style={{ left: 'calc(50% - 690px)' }}
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
                    style={{ right: 'calc(50% - 690px)' }}
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
                  <div
                    className={homeStyles.help_left}
                    style={{ backgroundImage: `url(${helpPicture[0]})` }}
                  />
                  <div className={homeStyles.help_right}>
                    <List
                      grid={{ gutter: 16, column: 1 }}
                      dataSource={newHelpList.slice(0, 7)}
                      renderItem={(item) => (
                        <List.Item style={{ fontSize: 15, color: '#5B5B5D', fontWeight: 400 }}>
                          <div
                            className={homeStyles.help_item}
                            onClick={() => {
                              RestTools.setSession('q', item.content);
                            }}
                            // onClick={handleClickItem.bind(this, item.Content)}
                          >
                            <Link
                              to={`/reply?q=${encodeURIComponent(item.content.trim())}&QID=${
                                item.qid
                              }`}
                              target="_blank"
                              className={homeStyles.help_item_content}
                            >
                              <span title={item.Content}>{item.content}</span>
                            </Link>

                            <span style={{ display: 'inline-block', overflow: 'hidden' }}>
                              回答数:{item.answerCount}
                            </span>
                            <Divider type="vertical" style={{ top: '-5px' }}></Divider>
                            <Link
                              className={homeStyles.myReply}
                              to={`/reply?q=${encodeURIComponent(item.content.trim())}&QID=${
                                item.qid
                              }`}
                            >
                              我来回答
                            </Link>

                            <Divider type="vertical" style={{ top: '-5px' }}></Divider>
                            <span style={{ float: 'right' }}>{item.commitTime}</span>
                          </div>
                        </List.Item>
                      )}
                    />

                    <Link
                      className={homeStyles.help_more}
                      onClick={() => {
                        sessionStorage.removeItem('page'); //删除分页缓存
                      }}
                      to={'/help/newHelp'}
                      target="_blank"
                    >
                      MORE
                      <Icon
                        style={{ fontSize: 12, verticalAlign: 'baseline', paddingLeft: 6 }}
                        type="right"
                      />
                    </Link>
                  </div>
                </div>
              </TabPane>
            </Tabs>

            {/* </Slider> */}
          </div>
        </div>

        <div className={homeStyles.experience}>
          <div className={homeStyles.title}>
            <BlockTitle enTitle="Experience" cnTitle="体验" />
          </div>
          <Carousel autoplay autoplaySpeed={4000} hoverPause>
            <div className={homeStyles.content}>
              <div className={homeStyles.left}>
                <img src={docGen} alt="文档生成" />
              </div>
              <div className={homeStyles.right}>
                <Link to={`/doc/outlineConfig`} target="_blank">
                  <div className={homeStyles.cnTitle}>文档速成助手</div>
                  <div className={homeStyles.enTitle}>内容动态重组</div>
                </Link>

                <div className={homeStyles.desc}>
                  <div>
                    <font color="red" size="3">
                      便捷、高效
                    </font>
                    的文档
                    <font color="red" size="3">
                      撰写助手
                    </font>
                  </div>
                  <div>面向系列问题的内容动态生成重组</div>
                  <div> 自定义章节标题要点、内容自动生成重组</div>
                  <div>知网权威、海量学术期刊来源</div>
                  <div>
                    文档
                    <font color="red" size="3">
                      在线、定制、生成、预览、下载
                    </font>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    ghost
                    style={{ border: 0 }}
                    onClick={() => {
                      router.push({
                        pathname: '/doc/outlineConfig'
                      });
                    }}
                  >
                    <font color="blue" size="5">
                      {'试用>>'}
                    </font>
                  </Button>
                </div>
              </div>
            </div>
            <div className={homeStyles.content}>
              <div className={homeStyles.left}>
                <img src={rd} alt="阅读" />
              </div>
              <div className={homeStyles.right}>
                {experience_questions.length ? (
                  <Link to={`/special?topicId=${experience_questions[0].topicId}`} target="_blank">
                    <div className={homeStyles.cnTitle}>细粒度知识问答</div>
                    <div className={homeStyles.enTitle}>期刊全文</div>
                  </Link>
                ) : null}
                <div className={homeStyles.questions}>
                  {experience_questions.length
                    ? experience_questions[0].data.map((item) => {
                        const topic = experience_questions[0].info.topic;
                        const topicName = experience_questions[0].name;
                        return (
                          <Link
                            className={homeStyles.questions_item}
                            to={`/query?topic=${topic}&topicName=${encodeURIComponent(
                              topicName
                            )}&q=${encodeURIComponent(item.question)}`}
                            key={item.qId}
                            target="_blank"
                          >
                            {item.question}
                          </Link>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </Spin>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.index,
    ...state.global,
    loading: state.loading.models.index
  };
}

export default connect(mapStateToProps)(Home);
