import React from 'react';
import { Popover, List, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Slider from 'react-slick';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mockData from '../../mock/mockData';

function Home(props) {
  function handleClickItem(item) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: item.Content } });
    router.push('/result?q=' + item.Content);
  }

  const { newHelpList } = props;
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className={homeStyles.home}>
      {/* 热门示例开始 */}
      <div className={homeStyles.hotExample}>
        <h2 className={homeStyles.title}> 热门示例 </h2>
        <Slider {...settings}>
          {mockData.homeHotExamples.map(item => {
            return (
              <Popover
                key={item.name}
                placement={'right'}
                overlayStyle={{ width: '80%', paddingLeft: '20%' }}
                overlayClassName="qaoverlay"
                content={
                  <div className="overlay-content">
                    {item.qa.map((v, index) => (
                      <div className="overlay-item" key={index}>
                        <div style={{ padding: '10px 0', display: 'flex' }}>
                          <div className="circle">问</div>
                          <div className="ask">{v.question}</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <div className="circle" style={{ background: '#d3d3d3' }}>
                            答
                          </div>
                          <div className="answer">{v.answer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                trigger="click"
              >
                <div className={homeStyles.slideItem}>
                  <div className={homeStyles.slideImg}>
                    <img src={item.imgSrc} alt={item.name} />
                  </div>
                  <div className={homeStyles.name}>{item.name}</div>
                </div>
              </Popover>
            );
          })}
        </Slider>
      </div>
      {/* 热门示例结束 */}

      {/* 新求助开始 */}
      <div className={homeStyles.newHelp}>
        <h2 className={homeStyles.title}> 新求助 </h2>
        <List
          bordered
          dataSource={newHelpList}
          footer={
            <div
              onClick={() => {
                router.push('/help');
              }}
              className={homeStyles.more}
            >
              查看更多
            </div>
          }
          renderItem={item => (
            <List.Item>
              <div className={homeStyles.item_content} onClick={handleClickItem}>
                <Link to={`/reply?question=${item.Content}&qid=${item.ID}`}>{item.Content}</Link>
              </div>
              <div className={homeStyles.item_time}>
                已有回答:{item.CheckSum}
                <span>
                  <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
                  {item.Time}
                </span>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* 新求助结束 */}

      <div className={homeStyles.subject}>
        <h2 className={homeStyles.title}>专题问答</h2>
        <Row className={homeStyles.wrap} gutter={120}>
          {mockData.subjects.map((item, index) => (
            <Col xs={20} sm={16} md={8} lg={8} xl={8} className={homeStyles.item} key={item.title}>
              <img className={homeStyles.subimg} src={item.src} alt={item.title} />
              <ul className={homeStyles.subitem}>
                {item.questions.map(content => (
                  <li key={content}>{content}</li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  // const { newHelpList } = state.home;
  return {
    ...state.home,
    ...state.global,
  };
}

export default connect(mapStateToProps)(Home);
