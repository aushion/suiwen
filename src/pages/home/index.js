import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import Slider from 'react-slick';
import homeStyels from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mockData from '../../mock/mockData';

class Home extends PureComponent {
  render() {
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
      <div className={homeStyels.home}>
        <div className={homeStyels.hotExample}>
          <h2 className={homeStyels.title}> 热门示例 </h2>
          <Slider {...settings}>
            {mockData.homeHotExamples.map(item => {
              return (
                <Popover
                  content={
                    <div>
                      {item.qa.map(v => (
                        <div>
                          <div> 问：{v.question}</div>
                          <div>答：{v.answer}</div>
                        </div>
                      ))}
                    </div>
                  }
                  trigger="hover"
                >
                  <div className={homeStyels.slideItem}>
                    <div className={homeStyels.slideImg}>
                      <img src={item.imgSrc} alt="文献" />
                    </div>
                    <div className={homeStyels.name}>{item.name}</div>
                  </div>
                </Popover>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  }
}

export default Home;
