import React, { useState } from 'react';
import { Popover, List, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Slider from 'react-slick';
import BlockTitle from './components/BlockTitle';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RestTools from '../../utils/RestTools';
import 法律 from '../../assets/法律.png';
import 农业 from '../../assets/农业.png';
import 医学 from '../../assets/医学.png';

let skillSlider = null;
let specialSlider = null;
function Home(props) {
  const { skillExamples, specialQuestions, newHelpList } = props;

  console.log(specialQuestions);
  const [activeTag, setActive] = useState(0);
  const [activeSpecial, setActiveSpecial] = useState('专题问答');
  const activeStyle = {
    backgroundColor: '#29A7F3',
    padding: '8px 24px',
    color: '#fff',
    borderRadius: 4
  };
  const skillSettings = {
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    beforeChange: function(i) {
      setActive(i === skillExamples.length - 1 ? 0 : i + 1);
    },
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const specialSettings = {
    autoplay: false,
    slidesToScroll: 1,
    slidesToShow: 1
  };

  function handleClickItem(item) {
    // props.dispatch({ type: 'global/setQuestion', payload: { q: item.Content } });
    // router.push('/result?q=' + item.Content);
  }

  function clickTag(i) {
    setActive(i);
    skillSlider.slickPause();
    skillSlider.slickGoTo(i, true);
  }

  return (
    <div className={homeStyles.home}>
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
                {skillExamples.length
                  ? skillExamples.map((item) => {
                      return (
                        <div key={item.name} className={homeStyles.section}>
                          {item.data.map((item) => {
                            return (
                              <div key={item.qId} className={homeStyles.item_wrapper}>
                                <div className={homeStyles.item} style={{ marginBottom: 12 }}>
                                  <div
                                    className={homeStyles.icon}
                                    style={{ background: '#FAC500' }}
                                  >
                                    Q
                                  </div>
                                  <div
                                    className={homeStyles.item_content}
                                    style={{ color: '#23242A' }}
                                  >
                                    {item.q}
                                  </div>
                                </div>
                                <div className={homeStyles.item}>
                                  <div
                                    className={homeStyles.icon}
                                    style={{ background: '#4BC3FF' }}
                                  >
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
                  : null}
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
              onClick={() => {setActiveSpecial('专题问答'); specialSlider.slickGoTo(0)}}
              style={activeSpecial === '专题问答' ? activeStyle : null}
              className={homeStyles.tag}
            >
              专题问答
            </span>
            <span
              onClick={() => {setActiveSpecial('热门求助');specialSlider.slickGoTo(1)}}
              style={activeSpecial === '热门求助' ? activeStyle : null}
              className={homeStyles.tag}
            >
              热门求助
            </span>
          </div>
        </div>

        <div className={homeStyles.special_bottom}>
          <Slider {...specialSettings} ref={slider => (specialSlider = slider)}>
            <div className={homeStyles.special_questions}>
              {specialQuestions.length ? (
                <Row gutter={16}>
                  <Col span={8} className={homeStyles.specialItem}>
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
                          return <div key={item.qid}>{item.q}</div>;
                        })}
                    </div>
                  </Col>

                  <Col span={8} className={homeStyles.specialItem}>
                    <div className={homeStyles.picture}>
                      <img src={医学} alt="医学" />
                    </div>
                    <div className={homeStyles.title}>
                      <span style={{ color: '#23242A', fontSize: 24 }}>医学</span>{' '}
                      <span style={{ color: '#C4C4C4', fontSize: 18 }}>Law</span>
                    </div>
                    <div className={homeStyles.questions}>
                      {specialQuestions
                        .filter((item) => item.name === '医学')[0]
                        .data.slice(0, 2)
                        .map((item) => {
                          return <div key={item.qid}>{item.q}</div>;
                        })}
                    </div>
                  </Col>

                  <Col span={8} className={homeStyles.specialItem}>
                    <div className={homeStyles.picture}>
                      <img src={农业} alt="农业" />
                    </div>
                    <div className={homeStyles.title}>
                      <span style={{ color: '#23242A', fontSize: 24 }}>农业</span>{' '}
                      <span style={{ color: '#C4C4C4', fontSize: 18 }}>Law</span>
                    </div>
                    <div className={homeStyles.questions}>
                      {specialQuestions
                        .filter((item) => item.name === '农业')[0]
                        .data.slice(0, 2)
                        .map((item) => {
                          return <div key={item.qid}>{item.q}</div>;
                        })}
                    </div>
                  </Col>
                </Row>
              ) : null}
            </div>
            <div className={homeStyles.special_help}>
              <div className={homeStyles.help_left}></div>

              <div className={homeStyles.help_right}>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={newHelpList}
                  renderItem={(item) => (
                    <List.Item style={{ fontSize: 16, color: '#5B5B5D', fontWeight: 400 }}>
                      <div className={homeStyles.help_item}>
                        <span>{item.Content}</span>
                        <span>{item.Time}</span>
                      </div>
                    </List.Item>
                  )}
                />

                <div style={{ width: 100, float: 'right', color: '#C4C4C4', fontSize: 20 }}>
                  MORE>>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  // const { newHelpList } = state.home;
  return {
    ...state.home,
    ...state.global
  };
}

export default connect(mapStateToProps)(Home);
