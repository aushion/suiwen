export default {
  statistics: {
    single: [
      {
        id: '9231814a49e9ce9626c7825e1d6fa7318eea3e04',
        dataType: 3,
        title: '北京的总人口数是多少啊',
        domain: '统计数据',
        intentId: '1',
        intentDomain: '数值问答',
        intentFocus: '指标',
        dataNode: [
          {
            unit: '澳门元',
            prop: '澳门',
            value: 713143
          },
          {
            unit: '澳门元',
            prop: '中国',
            value: 710895
          },
          {
            unit: '港元',
            prop: '香港',
            value: 311835
          },
          {
            unit: '万元',
            prop: '天津',
            value: 10.5202
          },
          {
            unit: '万元',
            prop: '北京',
            value: 9.9995
          },
          {
            unit: '万元',
            prop: '上海',
            value: 9.7343
          },
          {
            unit: '万元',
            prop: '江苏',
            value: 8.1874
          },
          {
            unit: '万元',
            prop: '浙江',
            value: 7.2967
          },
          {
            unit: '万元',
            prop: '内蒙古',
            value: 7.1044
          },
          {
            unit: '万元',
            prop: '辽宁',
            value: 6.5201
          }
        ],
        pagination: {
          pageStart: 1,
          pageCount: 50,
          total: 5
        },
        intentJson: {
          analyse_strategy: 'ST_TP',
          qt_domain: '统计数据',
          search_model: 'WEB',
          qt_type: '',
          intent_no: '1',
          chapter_schema: {
            schema: '',
            id: '0'
          },
          parsed_key: '',
          template_no: '292',
          results: [
            {
              score: '0',
              domain: '数值问答',
              fields: {
                地域: '北京',
                focus: '指标',
                指标: '总人口数'
              },
              intent: 'GET'
            }
          ]
        },
        evaluate: {
          question: '北京的总人口数是多少啊',
          good: 0,
          bad: 0,
          isevalute: ''
        }
      }
    ],

    multi: [
      {
        id: 'b87a21bb254d98c03adab640513bcbd6dcf4cb2d',
        dataType: 3,
        title: '',
        domain: '统计数据',
        intentId: '11',
        intentDomain: '数值问答',
        intentFocus: '指标',
        dataNode: [
          {
            '2012': 2380,
            '2013': 2415,
            '2014': 2426,
            '2015': 2415,
            '2016': 2420,
            unit: '万人',
            fileds: ['2012', '2013', '2014', '2015', '2016'],
            name: '上海'
          },
          {
            '2012': 2069,
            '2013': 2115,
            '2014': 2152,
            '2015': 2171,
            '2016': 2173,
            unit: '万人',
            fileds: ['2012', '2013', '2014', '2015', '2016'],
            name: '北京'
          },
          {
            '2012': 1413,
            '2013': 1472,
            '2014': 1517,
            '2015': 1547,
            '2016': 1562,
            unit: '万人',
            fileds: ['2012', '2013', '2014', '2015', '2016'],
            name: '天津'
          }
        ],
        pagination: {
          pageStart: 1,
          pageCount: 50,
          total: 5
        },
        intentJson: {
          analyse_strategy: 'ST_TP',
          qt_domain: '统计数据',
          search_model: 'WEB',
          qt_type: '',
          intent_no: '11',
          chapter_schema: {
            schema: '',
            id: '0'
          },
          parsed_key: '',
          template_no: '406',
          results: [
            {
              score: '0',
              domain: '数值问答',
              fields: {
                地域2: '上海',
                地域: '北京',
                地域3: '天津',
                focus: '指标',
                指标: '总人口数'
              },
              intent: 'GET'
            }
          ]
        },
        evaluate: {
          question: '北京的总人口数是多少啊',
          good: 0,
          bad: 0,
          isevalute: ''
        }
      }
    ]
  }
};
