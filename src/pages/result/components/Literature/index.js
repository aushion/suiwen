import React, { useState, useEffect } from 'react';
import { List, Tag, Icon, Pagination, Input } from 'antd';
import dayjs from 'dayjs';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

const { Search } = Input;
export default function Literature(props) {
  const { literatureData, dispatch } = props;
  const [works, people = null, sameNames = null] = literatureData;

  //嵌套解构
  let {
    dataNode: { data, year, searchword, subject, subjectType, SN, orderBy, keyword, linkName, sql },
    id,
    evaluate,
    pagination,
    intentJson: intent
  } = works;
  const [sortKey, setSortKey] = useState(orderBy.replace(/\s/g, '').match(/BY\((\S*),/)[1]);
  const [count, setCount] = useState(0);
  const { good, bad, isevalute } = evaluate;
  const { pageStart, pageCount, total } = pagination;
  const [page, changePage] = useState(pageStart);
  const [searchValue, setSearchValue] = useState(searchword || keyword || '');

  const [yearInfo, setYearInfo] = useState({
    index: 0, //年份信息的初始状态
    yearSql: '',
    year: year ? year.slice(0, 12) : []
  });

  const [subjectInfo, setSubjectInfo] = useState({
    index: 0,
    subjectSql: '',
    subject: subject ? subject.slice(0, 5) : []
  });

  useEffect(() => {
    RestTools.setSession('preSearchValue', searchValue);
  }, [searchValue]);

  useEffect(() => {
    setYearInfo({
      ...yearInfo,
      year: year ? year.slice(0, 12) : []
    });
  }, [year, yearInfo]);
  const linkMap = {
    文献: {
      name: '相关文献',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw=${kw}&korder=0&sel=1`
    },
    硕士: {
      name: '硕士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
    博士: {
      name: '博士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
    会议: {
      name: '会议论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CIPD&kw=${kw}&korder=0&sel=1`
    },
    硕博: {
      name: '硕博士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    }
  };

  const subjectSqlMap = {
    学科: (subject) => ` AND 专题子栏目代码='${subject}?'`,
    学位授予单位: (subject) => ` AND 来源代码='${subject}?'`,
    主办单位: (subject) => ` AND 主办单位代码='${subject}?'`
  };

  const spanStyle = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };
  const tagStyle = {
    cursor: 'pointer',
    marginBottom: '2px',
    lineHeight: 1.5
  };

  const activeTag = {
    background: 'rgb(24, 144, 255)',
    color: '#fff'
  };

  function handleChangePage(page) {
    const { yearSql } = yearInfo;
    const { subjectSql } = subjectInfo;
    changePage(page);
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: page,
        whereSql: sql,
        yearSql,
        subjectSql,
        keyword: '',
        searchword:  '',
        intent,
        SN,
        orderSql: ' ' + orderBy
      }
    });
  }

  function sortBy(key) {
    let order = '';
    if (key === 'time') {
      if (count % 2 !== 0) {
        order = " ORDER BY (发表时间,'TIME') desc ";
      } else {
        order = " ORDER BY (发表时间,'TIME') asc ";
      }
      setSortKey('发表时间')
    } else if (key === 'ref') {
      if (count % 2 !== 0) {
        order = " ORDER BY  (被引频次,'integer') desc ";
      } else {
        order = " ORDER BY  (被引频次,'integer') asc ";
      }
      setSortKey('被引频次')

    } else if (key === 'down') {
      if (count % 2 !== 0) {
        order = " ORDER BY  (下载频次,'integer') desc ";
      } else {
        order = " ORDER BY  (下载频次,'integer') asc ";
      }
      setSortKey('下载频次')
    } else if (key === 'ffd') {
      order = " ORDER BY (ffd,'rank') DESC";
      setSortKey('ffd')
    }
    const { yearSql } = yearInfo;
    const { subjectSql } = subjectInfo;

    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart,
        whereSql: sql,
        yearSql,
        subjectSql,
        intent,
        keyword: RestTools.getSession('preSearchValue'),
        searchword: searchValue,
        SN,
        orderSql: order
      }
    });
    setCount(count + 1);
  }

  function filterByYear(year, index) {
    const yearSql = year === '全部' ? '' : ` AND 年='${year}'`;
    const { subjectSql } = subjectInfo;
    const newYearInfo = {
      index, //点击年份标签的索引，用于设置选中状态
      yearSql,
      year: yearInfo.year
    };
    setYearInfo(newYearInfo); //修改年份选中状态
    changePage(1)

    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: 1,
        whereSql: sql,
        yearSql: yearSql,
        intent,
        subjectSql,
        keyword: '',
        searchword: '',
        SN,
        orderSql: orderBy
      }
    });
  }

  function filterBySubject(subject, index) {
    const subjectSql = subject === '全部' ? '' : subjectSqlMap[subjectType](subject);
    setSubjectInfo({ ...subjectInfo, index, subjectSql });
    setYearInfo({ ...yearInfo, index: 0, yearSql: '' });
    changePage(1)
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: 1,
        whereSql: sql,
        yearSql: '',
        intent,
        subjectSql,
        searchword: '',
        keyword: '',
        SN,
        orderSql: orderBy
      }
    });
  }

  function showOrHide(type) {
    const { year: currentYear } = yearInfo;
    const { subject: currentSubject } = subjectInfo;
    if (type === 'year') {
      setYearInfo({
        ...yearInfo,
        year: currentYear.length < year.length ? year : year.slice(0, 12)
      });
    } else {
      setSubjectInfo({
        ...subjectInfo,
        subject: currentSubject.length < subject.length ? subject : subject.slice(0, 5)
      });
    }
  }

  function handleSearch(value) {
    const keyword = RestTools.getSession('preSearchValue');
    if (keyword === value) {
      return;
    }
    setYearInfo({
      index: 0,
      yearSql: '',
      year:[]
    })
    setSubjectInfo({
      index: 0,
      subjectSql: '',
      subject: []
    })
    changePage(1)
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: 1,
        whereSql: sql,
        yearSql: '',
        intent,
        subjectSql: '',
        keyword,
        searchword: value,
        SN,
        orderSql: orderBy
      }
    });
    //记录上一次搜索框的值
    RestTools.setSession('preSearchValue', value);
  }
  //排序子组件
  const SortTag = function(props) {
    const { sortKeyText, name, sqlKey, tagStyle, activeTag, count, } = props;
    return (
      <Tag
        onClick={sortBy.bind(this, sqlKey)}
        style={sortKey === sortKeyText ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
      >
        {sortKey === sortKeyText ? <Icon type={count % 2 ? 'caret-up' : 'caret-down'} /> : null}
        {name}
      </Tag>
    );
  };

  //学者信息组件
  const PeopleInfo = (props) => {
    const { 作者 = '', 学者单位 = '', 研究领域 = '' } = props.data;
    return (
      <div>
        <span
          style={{ fontSize: 16, paddingRight: '20px' }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(作者) }}
        />
        <span style={{ paddingRight: '20px' }}>{学者单位}</span>
        <span>{研究领域}</span>
      </div>
    );
  };
  // 同名学者组件
  const SameNames = (props) => {
    const { data } = props;
    return (
      <div style={{ marginTop: 10 }}>
        <div style={{ padding: '20px 0', fontSize: 14 }}>
          同名学者：
          <a
            href={`http://xuezhe.cnki.net/Search/Search.aspx?ac=result&sm=0&sv=${RestTools.removeFlag(
              data[0].作者 || ''
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            更多学者
          </a>
        </div>
        <ul style={{ padding: 0 }}>
          {data.map((item, index) => (
            <li style={{ listStyle: 'none', padding: '5px 0' }} key={index}>
              <a
                href={`http://kns.cnki.net/kcms/detail/knetsearch.aspx?sfield=au&skey=${RestTools.removeFlag(
                  item.作者
                )}&code=${item.学者代码}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {RestTools.removeFlag(item.作者)}
              </a>
              <span style={{ margin: '0 20px', color: '#999', fontSize: 12 }}>{item.学者单位}</span>
              <span style={{ color: '#999', fontSize: 12 }}>{item.研究领域}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // 列表后箭头组件
  const DynamicArrow = (props) => {
    const { currentLength, basicsLength, size, type } = props;
    if (basicsLength > size) {
      if (currentLength < basicsLength) {
        return (
          <Icon
            onClick={showOrHide.bind(this, type)}
            style={{ color: '#000', fontWeight: 'bolder' }}
            type="arrow-down"
          />
        );
      } else if (currentLength === basicsLength && basicsLength > size) {
        return (
          <Icon
            onClick={showOrHide.bind(this, type)}
            style={{ color: '#000', fontWeight: 'bolder' }}
            type="arrow-up"
          />
        );
      }
    } else {
      return <span></span>;
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: 20,
        marginBottom: 20,
        boxShadow: '#a5a5a5 0 0 10.8px 0'
      }}
    >
      <List
        header={
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              {people ? (
                <PeopleInfo data={people.dataNode.data[0]} />
              ) : (
                <Search
                  placeholder=""
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={(value) => handleSearch(value)}
                  style={{ width: 300 }}
                />
              )}
            </div>
            <div style={{ float: 'right' }}>
              <SortTag
                sqlKey="ffd"
                name="默认排序"
                sortKeyText="ffd"
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="time"
                name="时间"
                sortKeyText="发表时间"
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="ref"
                name="引用"
                sortKeyText="被引频次"
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="down"
                name="下载"
                sortKeyText="下载频次"
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
            </div>
          </div>
        }
        footer={
          <div>
            {yearInfo.year.length ? (
              <div style={{ marginBottom: 10 }}>
                <label htmlFor="时间">时间：</label>

                {[{ 年: '全部' }].concat(yearInfo.year).map((item, index) => {
                  return (
                    <Tag
                      style={
                        yearInfo.index === index ? { ...tagStyle, ...activeTag } : { ...tagStyle }
                      }
                      key={item.年}
                      onClick={filterByYear.bind(this, item.年, index)}
                    >
                      {item.年}
                    </Tag>
                  );
                })}

                <DynamicArrow
                  currentLength={yearInfo.year.length}
                  basicsLength={year.length}
                  size={12}
                  type="year"
                />
              </div>
            ) : null}

            {subjectInfo.subject.length ? (
              <div style={{ marginBottom: 10 }}>
                <label htmlFor="其他">学科：</label>
                {[{ g: '全部', i: '全部' }].concat(subjectInfo.subject).map((item, index) => {
                  return (
                    <Tag
                      onClick={filterBySubject.bind(this, item.i, index)}
                      style={
                        subjectInfo.index === index
                          ? { ...tagStyle, ...activeTag }
                          : { ...tagStyle }
                      }
                      key={item.g}
                    >
                      {item.g}
                    </Tag>
                  );
                })}
                <DynamicArrow
                  currentLength={subjectInfo.subject.length}
                  basicsLength={subject.length}
                  size={5}
                  type="subject"
                />
              </div>
            ) : null}

            {total >= pageCount ? (
              <div>
                <Pagination
                  size="small"
                  total={total}
                  current={page}
                  pageSize={pageCount}
                  onChange={handleChangePage}
                />
              </div>
            ) : null}
            {sameNames ? <SameNames data={sameNames.dataNode.data} /> : null}
            <a
              style={{
                display: 'block',
                paddingBottom: 10,
                textAlign: 'right',
                color: '#999',
                fontSize: 12
              }}
              href={linkMap[linkName].url(intent.results[0].fields[keyword])}
              target="_blank"
              rel="noopener noreferrer"
            >
              更多{linkMap[linkName].name}
            </a>
            <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
          </div>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{ display: '-ms-flex', display: 'flex', justifyContent: 'space-between' }}
          >
            <a
              style={Object.assign({}, spanStyle, { width: '45%' })}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(item.题名 || '-')
              }}
              href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                RestTools.sourceDb[item.来源数据库]
              }&filename=${item.文件名}`}
              target="_blank"
              rel="noopener noreferrer"
            />
            <div>
              下载/被引：
              {item.被引频次 ? `${item.下载频次 || '-'}/${item.被引频次}` : `${item.下载频次}/-`}
            </div>
            <div>{item.来源数据库}</div>
            <div>{item.出版日期 ? dayjs(item.出版日期).format('YYYY-MM-DD') : '---------'}</div>
            <div
              title={RestTools.removeFlag(
                (/\d+/g.test(item.作者) ? item.作者名称 : item.作者) || '-'
              )}
              style={{ ...spanStyle, width: '10%' }}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(
                  (/\d+/g.test(item.作者) ? item.作者名称 : item.作者) || '-'
                )
              }}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
