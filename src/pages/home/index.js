import React, { PureComponent } from 'react';
import { Popover, List } from 'antd';
import { connect } from 'dva';
import Slider from 'react-slick';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mockData from '../../mock/mockData';

class Home extends PureComponent {
  render() {
    const { newHelpList } = this.props;

    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
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
            renderItem={item => <List.Item>{item.Content}</List.Item>}
          />
        </div>

        {/* 新求助结束 */}

        <div className={homeStyles.subject}>
          <h2 className={homeStyles.title}>专题问答</h2>
          <div className={homeStyles.wrap}>
            {mockData.subjects.map((item,index) => (
              <div className={homeStyles.item} key={item.title}>
                <img src={item.src} alt={item.title}  />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { newHelpList } = state.home;
  return {
    newHelpList,
  };
}

export default connect(mapStateToProps)(Home);
