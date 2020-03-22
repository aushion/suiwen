export default {
  // 支持值为 Object 和 Array
  'GET /sw.api/getTopics': {
    code: 200,
    result: [
      {
        id: '1',
        name: '国内疫情',
        data: [],
        children: [
          {
            id: '11',
            name: '实时疫情',
            data: [
              {
                id: '111',
                question: '未发现复阳病例再传播报告'
              },
              {
                id: '112',
                question: '未发现复阳病例再传播报告'
              },
              {
                id: '113',
                question: '未发现复阳病例再传播报告'
              },
              {
                id: '114',
                question: '未发现复阳病例再传播报告'
              },
              {
                id: '115',
                question: '未发现复阳病例再传播报告'
              },
              {
                id: '116',
                question: '未发现复阳病例再传播报告'
              }
            ]
          },

          {
            id: '12',
            name: '辟谣',
            data: [
              {
                id: '121',
                question: '未发现复阳病例再传播报告'
              }
            ]
          },
          {
            id: '13',
            name: '科普',
            data: [
              {
                id: '131',
                question: '未发现复阳病例再传播报告'
              }
            ]
          }
        ]
      },
      {
        id: '2',
        name: '国际疫情',
        data: [],
        children: [
          {
            id: '21',
            name: '实时疫情',
            data: [
              {
                id: '211',
                question: '湖北女子隐瞒湖北居住史通过第三地进京，被北京警方拘留'
              }
            ]
          },

          {
            id: '22',
            name: '辟谣',
            data: [
              {
                id: '221',
                question: '部分赴京国际航班第一入境点为何调整？权威解释来了'
              }
            ]
          },
          {
            id: '23',
            name: '科普',
            data: [
              {
                id: '231',
                question: '未发现复阳病例再传播报告'
              }
            ]
          }
        ]
      },
      {
        id: '3',
        name: '复工复产',
        data: [
          {
            id: '31',
            question: '湖北省陆续开始复工复产'
          }
        ],
        children: []
      }
    ]
  }
};
