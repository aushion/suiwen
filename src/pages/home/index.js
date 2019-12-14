import React, { useEffect } from 'react';
import { Popover, List, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Slider from 'react-slick';
import request from '../../utils/request';
import BlockTitle from './components/BlockTitle';
import homeStyles from './index.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mockData from '../../mock/mockData';

function Home(props) {
  function handleClickItem(item) {
    // props.dispatch({ type: 'global/setQuestion', payload: { q: item.Content } });
    // router.push('/result?q=' + item.Content);

    const res = request.get('http://192.168.103.25:8080/qa.api/getAnswer?q=鲁迅')
    res.then(response => {
      console.log(response)
    })
  }

  useEffect(() => {

    const res = request.get('http://192.168.103.25:8080/qa.api/getAnswer?q=鲁迅')
    res.then(response => {
      console.log(response.data)
    })
    // request
    //   .post('http://192.168.103.25:8080/sw.api/getToken', {
    //     data: {
    //       appId: '421c0d4b546f48d387b44f1eb040bdff',
    //       secret: '8b385d3cc269a1af02c37fa78eec18bd28778118',
    //     },
    //   })
    //   .then(res => {
    //     console.log(res);
    //   });
  }, []);

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.top}>
        <div className={homeStyles.left}>
          <div className={homeStyles.title}>
            <BlockTitle cnTitle="技能" enTitle="Skill" />
          </div>
          <div className={homeStyles.bg}></div>
        </div>

        <div className={homeStyles.right}>
          <div className={homeStyles.right_top}>
            {mockData.homeHotExamples.map(item => (
              <span active className={homeStyles.tag}>
                {item.name}
              </span>
            ))}
          </div>

          <div className={homeStyles.right_bottom}>
            <div className={homeStyles.wrapper}>
              <div className={homeStyles.section}>
                <div className={homeStyles.item}>
                  <div className={homeStyles.item_q}>
                    <div className={homeStyles.icon}>Q</div>
                    <div>投资相关的优秀论文</div>
                  </div>
                  <div className={homeStyles.item_a}>
                    <div className={homeStyles.icon}>A</div>
                    <div>
                      通过具有专业知识的编辑初审和专家外审,从数以千计的论文中筛选出数量很少的优秀论文,从而保证和...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={homeStyles.right_bottom}></div>
      </div>
      <div className={homeStyles.bottom}>
        <div className={homeStyles.bottom_top}></div>
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
