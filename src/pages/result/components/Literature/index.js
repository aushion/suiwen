/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { List, Tag, Icon, Pagination, Input } from 'antd';
import dayjs from 'dayjs';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import DynamicArrow from './DynamicArrow';
import SameNames from './SameNames';
import PeopleInfo from './PeopleInfo';

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
  const subjectValid = subject && subject.filter((item) => !/\d+/g.test(item.g)); //有效学科单元
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
    subject: subjectValid ? subjectValid.slice(0, 8) : []
  });

  useEffect(() => {
    RestTools.setSession('preSearchValue', searchValue);
  }, []);

  useEffect(() => {
    if(year){
      setYearInfo({
        ...yearInfo,
        year: yearInfo.index > 12 ? year : year.slice(0, 12) //当索引大于初始值是，去所有
      });
    }
    return () => {
      setYearInfo(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    if(subject){
      setSubjectInfo({
        ...subjectInfo,
        subject: subjectValid ? subjectValid.slice(0, 8) : []
      });
    }
    return () => {
      setSubjectInfo(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const linkMap = {
    期刊: {
      name: '论文',
      url: (kw) => 
      `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
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
    backgroundColor: 'rgb(24, 144, 255)',
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
        searchword: '',
        intent,
        SN,
        orderSql: ' ' + orderBy
      }
    });
  }

  function sortBy(key) {
    let order = '';
    if (key === 'time') {
      if(sortKey === '发表时间'){
        setCount(count+1)
      }else{
        setCount(0)
      }
      if (count % 2 === 0) {
        order = " ORDER BY (发表时间,'TIME') desc ";
      } else {
        order = " ORDER BY (发表时间,'TIME') asc ";
      }
      setSortKey('发表时间');
    } else if (key === 'ref') {
      if(sortKey === '被引频次'){
        setCount(count+1)
      }else{
        setCount(0)
      }
      if (count % 2 === 0) {
        order = " ORDER BY  (被引频次,'integer') desc ";
      } else {
        order = " ORDER BY  (被引频次,'integer') asc ";
      }
      setSortKey('被引频次');
    } else if (key === 'down') {
      if(sortKey === '下载频次'){
        setCount(count+1)
      }else{
        setCount(0)
      }
      if (count % 2 === 0) {
        order = " ORDER BY  (下载频次,'integer') desc ";
      } else {
        order = " ORDER BY  (下载频次,'integer') asc ";
      }
      setSortKey('下载频次');
    } else if (key === 'ffd') {
      if(sortKey === 'ffd'){

        setCount(count+1)
      }else{
        setCount(0)
      }
      order = " ORDER BY (ffd,'rank') DESC";
      setSortKey('ffd');
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
        keyword: '',
        searchword: '',
        SN,
        orderSql: order
      }
    });
  }

  function filterByYear(year, index) {
    const yearSql = year === '全部' ? '' : ` AND 年='${year}'`;
    const { subjectSql } = subjectInfo;
    const newYearInfo = {
      index, //点击年份标签的索引，用于设置选中状态
      yearSql,
      year: []
    };
    setYearInfo(newYearInfo); //修改年份选中状态
    changePage(1);

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
    setSubjectInfo({ subject: [], index: index === 0 ? 0 : 1, subjectSql });
    setYearInfo({ ...yearInfo, index: 0, yearSql: '' });
    changePage(1);
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

  function handleSearch(value) {
    const keyword = RestTools.getSession('preSearchValue');
    if (!value || keyword === value) {
      return;
    }
    setYearInfo({
      index: 0,
      yearSql: '',
      year: []
    });
    setSubjectInfo({
      index: 0,
      subjectSql: '',
      subject: []
    });
    changePage(1);
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
    const { sortKeyText, name, sqlKey, tagStyle, activeTag, count, showArrow } = props;
    return (
      <Tag
        onClick={sortBy.bind(this, sqlKey)}
        style={sortKey === sortKeyText ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
      >
        {sortKey === sortKeyText && showArrow ? (
          <Icon type={count % 2 === 0 ? 'caret-down' : 'caret-up'} />
        ) : null}
        {name}
      </Tag>
    );
  };

  function showOrHide(props) {
    const { currentLength, basicsLength, size, type } = props;
    const data = type === 'year' ? year : subjectValid;
    if (type === 'year') {
      setYearInfo({
        ...yearInfo,
        year: currentLength < basicsLength ? data : data.slice(0, size)
      });
    } else {
      setSubjectInfo({
        ...subjectInfo,
        subject: currentLength < basicsLength ? data : data.slice(0, size)
      });
    }
  }
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
                showArrow={false}
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="time"
                name="时间"
                sortKeyText="发表时间"
                tagStyle={tagStyle}
                showArrow
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="ref"
                name="引用"
                showArrow
                sortKeyText="被引频次"
                tagStyle={tagStyle}
                activeTag={activeTag}
                count={count}
              />
              <SortTag
                sqlKey="down"
                name="下载"
                showArrow
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
                {year.length > 12 ? (
                  <DynamicArrow
                    currentLength={yearInfo.year.length}
                    basicsLength={year.length}
                    index={yearInfo.index}
                    onClick={showOrHide}
                    size={12}
                    type="year"
                  />
                ) : null}
              </div>
            ) : null}

            {subjectInfo.subject.length ? (
              <div style={{ marginBottom: 10 }}>
                <label htmlFor="其他">{subjectType}：</label>
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
                {subjectValid.length > 8 ? (
                  <DynamicArrow
                    currentLength={subjectInfo.subject.length}
                    basicsLength={subjectValid.length}
                    index={subjectInfo.index}
                    onClick={showOrHide}
                    size={8}
                    type="subject"
                  />
                ) : null}
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
            <div style={{ overflow: 'hidden' }}>
              <div style={{ textAlign: 'right' }}>
                <a
                  style={{
                    paddingBottom: 10,
                    color: '#999',
                    fontSize: 13
                  }}
                  href={linkMap[linkName].url(keyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  更多{linkMap[linkName].name}
                </a>
              </div>

              <div>
                <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
              </div>
            </div>
          </div>
        }
        dataSource={data}
        renderItem={(item) => {
          const authorIndex =
            item.作者 &&
            item.作者
              .split(';')
              .filter((item) => item)
              .findIndex((item) => /#+/g.test(item));
          item.作者名称 =
            item.作者名称 &&
            item.作者名称
              .split(';')
              .filter((item) => item)
              .map((item, index) => {
                if (authorIndex === index) {
                  return `###${item}$$$`;
                }
                return item;
              })
              .join(';');
          return (
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
          );
        }}
      />
    </div>
  );
}
