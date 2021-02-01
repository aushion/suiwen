/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { List, Tag, Pagination, Input, message } from 'antd';
import dayjs from 'dayjs';
import findIndex from 'lodash/findIndex';
import { useUpdateEffect } from '@umijs/hooks';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import DynamicArrow from './DynamicArrow';
import SameNames from './SameNames';
import PeopleInfo from './PeopleInfo';
import SortTag from './SortTag';
import uniqBy from 'lodash/uniqBy';
import { getCustomView } from '../../service/result';
import styles from './index.less';

const { Search } = Input;
export default function Literature(props) {
  const [resource, updateResource] = useState(props);
  const { literatureData } = resource;
  const [works, people = null, sameNames = null] = literatureData;
  //嵌套解构
  let {
    dataNode: {
      data = [],
      year = [],
      searchword,
      subject = [],
      subjectType,
      SN,
      korderValue,
      orderBy,
      keyword,
      replaceSql,
      fieldWord,
      linkName,
      sql
    },
    id,
    evaluate = { good: 0, bad: 0, isevaluate: false },
    intentId,
    pagination = {},
    intentJson
  } = works;

  const relevant = orderBy && orderBy.indexOf('relevant');
  const subjectValid = subject ? uniqBy(subject, 'g').filter((item) => !/\d+/g.test(item.g)) : []; //有效学科单元
  const { good = 0, bad = 0, isevalute = false } = evaluate;
  const { pageStart, pageCount, total } = pagination;

  const [sortKey, setSortKey] = useState(
    relevant > 0 ? 'relevant' : orderBy && orderBy.replace(/\s/g, '').match(/BY\((\S*),/)[1]
  );
  const [count, setCount] = useState(0);
  const [page, changePage] = useState(pageStart);
  const [searchValue, setSearchValue] = useState(searchword || keyword || '');
  const [yearInfo, setYearInfo] = useState({
    index: 0, //年份信息的初始状态
    yearSql: '',
    year: year ? year.slice(0, 10) : []
  });

  const [subjectInfo, setSubjectInfo] = useState({
    index: 0,
    subjectSql: '',
    subject: subjectValid ? subjectValid.slice(0, 8) : []
  });

  const [loading, setLoading] = useState(false);

  const linkMap = {
    法律期刊: {
      name: '法律相关期刊',
      url: () => `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=CLKJ`
    },
    期刊: {
      name: '期刊论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CJFQ&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
    },
    文献: {
      name: '相关文献',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
    },
    硕士: {
      name: '硕士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
    },
    博士: {
      name: '博士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
    },
    会议: {
      name: '会议论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CIPD&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
    },
    硕博: {
      name: '博硕士论文',
      url: (kw) =>
        `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${encodeURIComponent(
          kw
        )}&korder=${korderValue}&sel=1`
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
    marginBottom: '6px',
    lineHeight: 1.5
  };

  const activeTag = {
    backgroundColor: 'rgb(24, 144, 255)',
    color: '#fff'
  };

  function fetchData(params) {
    setLoading(true);
    getCustomView(params)
      .then((res) => {
        if (res.data.code === 200) {
          setLoading(false);
          updateResource({
            ...resource,
            literatureData: res.data.result
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    RestTools.setSession('preSearchValue', searchValue);
  }, []);

  useEffect(() => {
    setSearchValue(searchword || keyword || '');
  }, [keyword, searchword]);

  useUpdateEffect(() => {
    const sortMap = {
      发表时间: 'TIME',
      被引频次: 'integer',
      下载频次: 'integer',
      ffd: 'rank'
    };
    let order = '';
    if (sortKey === 'ffd') {
      order = " ORDER BY (ffd,'rank') DESC";
    } else {
      order =
        count % 2 === 0
          ? ` ORDER BY (${sortKey}, ${sortMap[sortKey]}) desc `
          : ` ORDER BY (${sortKey}, ${sortMap[sortKey]}) asc `;
    }
    const { yearSql } = yearInfo;
    const { subjectSql } = subjectInfo;
    fetchData({
      pageStart,
      whereSql: sql,
      yearSql,
      linkName,
      subjectSql,
      korderValue,
      intent: intentJson,
      keyword: searchValue || keyword,
      fieldWord,
      replaceSql,
      searchword: '',
      SN,
      orderSql: order
    });
  }, [count, sortKey]);

  useEffect(() => {
    if (year.length) {
      setYearInfo({
        ...yearInfo,
        year: yearInfo.index > 10 ? year : year.slice(0, 10) //当索引大于初始值是，去所有
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    if (subject.length) {
      setSubjectInfo({
        ...subjectInfo,
        index: subjectInfo.item ? findIndex(subjectValid, subjectInfo.item) + 1 : subjectInfo.index,
        subject: subjectValid ? subjectValid.slice(0, 8) : []
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  function handleChangePage(page) {
    const { yearSql } = yearInfo;
    const { subjectSql } = subjectInfo;
    changePage(page);
    fetchData({
      pageStart: page,
      whereSql: sql,
      yearSql,
      subjectSql,
      linkName,
      korderValue,
      fieldWord,
      replaceSql,
      keyword: searchValue || keyword,
      searchword: '',
      intent: intentJson,
      SN,
      orderSql: orderBy
    });
  }

  function sortBy(key) {
    if (sortKey === key) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
    setSortKey(key);
  }

  function filterByYear(year, index) {
    const yearSql = year === '全部' ? '' : ` AND 年='${year}'`;
    const { subjectSql } = subjectInfo;
    const newYearInfo = {
      index, //点击年份标签的索引，用于设置选中状态
      yearSql,
      year
    };
    setYearInfo(newYearInfo); //修改年份选中状态
    changePage(1);
    fetchData({
      pageStart: 1,
      whereSql: sql,
      yearSql: yearSql,
      intent: intentJson,
      subjectSql,
      linkName,
      korderValue,
      fieldWord,
      replaceSql,
      keyword: searchValue || keyword,
      searchword: '',
      SN,
      orderSql: orderBy
    });
  }

  function filterBySubject(subject, index) {
    const subjectSql = subject === '全部' ? '' : subjectSqlMap[subjectType](subject);
    setSubjectInfo({
      subject,
      index: index === 0 ? 0 : 1,
      subjectSql,
      item: {
        i: subject
      }
    });
    setYearInfo({ ...yearInfo, index: 0, yearSql: '' });
    changePage(1);
    fetchData({
      pageStart: 1,
      whereSql: sql,
      yearSql: '',
      intent: intentJson,
      subjectSql,
      linkName,
      korderValue,
      fieldWord,
      replaceSql,
      searchword: '',
      keyword: searchValue || keyword,
      SN,
      orderSql: orderBy
    });
  }

  function handleSearch(value) {
    const keyword = sessionStorage.getItem('preSearchValue');
    if (!value.trim()) {
      message.warning('您还没有输入哟');
      return;
    }
    if (!value || keyword === value) {
      return;
    }
    if (value.length > 20) {
      message.warning('输入的字符不能超过20个');
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
    fetchData({
      pageStart: 1,
      whereSql: sql,
      yearSql: '',
      intent: intentJson,
      subjectSql: '',
      linkName,
      korderValue,
      fieldWord,
      replaceSql,
      keyword,
      searchword: value,
      SN,
      orderSql: orderBy
    });

    //记录上一次搜索框的值
    RestTools.setSession('preSearchValue', value);
  }

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
      className={styles.literature}
      style={
        props.law
          ? null
          : {
              background: '#fff',
              padding: '20px 20px 10px 20px',
              marginBottom: 20,
              boxShadow: '#cecece 0 0 6px 0'
            }
      }
    >
      {props.law ? null : (
        <h2>
          <a href={linkMap[linkName].url(keyword)} target="_blank" rel="noopener noreferrer">
            {searchword || props.q}
          </a>
          <span> - 知网文献</span>
        </h2>
      )}
      {intentId === '43' || intentId === '71' || intentId === '77' ? (
        <div style={{ fontSize: 15 }}>未找到本科论文，推荐以下博硕士论文</div>
      ) : null}
      <List
        loading={loading}
        size="small"
        header={
          <div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'left' }}>
                {people ? (
                  <PeopleInfo data={people.dataNode.data[0]} />
                ) : (
                  <Search
                    placeholder="请输入关键字"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={(value) => handleSearch(value)}
                    style={{ width: 300 }}
                    maxLength={20}
                  />
                )}
              </div>
              <div style={{ float: 'right' }}>
                <SortTag
                  sqlKey="ffd"
                  name="默认排序"
                  sortKeyText="ffd"
                  showArrow={false}
                  sortKey={sortKey}
                  onClick={sortBy}
                  tagStyle={tagStyle}
                  activeTag={activeTag}
                  count={count}
                />
                <SortTag
                  sqlKey="time"
                  name="时间"
                  sortKeyText="发表时间"
                  onClick={sortBy}
                  sortKey={sortKey}
                  tagStyle={tagStyle}
                  showArrow
                  activeTag={activeTag}
                  count={count}
                />
                <SortTag
                  sqlKey="ref"
                  name="引用"
                  showArrow
                  sortKey={sortKey}
                  onClick={sortBy}
                  sortKeyText="被引频次"
                  tagStyle={tagStyle}
                  activeTag={activeTag}
                  count={count}
                />
                <SortTag
                  sqlKey="down"
                  name="下载"
                  showArrow
                  sortKey={sortKey}
                  onClick={sortBy}
                  sortKeyText="下载频次"
                  tagStyle={tagStyle}
                  activeTag={activeTag}
                  count={count}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                background: '#F2F2F2',
                padding: '10px 0',
                justifyContent: 'space-between',
                marginTop: 10,
                color: '#778192'
              }}
            >
              <div style={{ width: '38%', textAlign: 'center' }}>提名</div>
              <div style={{ width: '15%', textAlign: 'center' }}>下载/被引</div>
              <div style={{ width: '15%', textAlign: 'center' }}>来源</div>
              <div style={{ width: '15%', textAlign: 'center' }}>发表时间</div>
              <div style={{ width: '17%', textAlign: 'center' }}>作者</div>
            </div>
          </div>
        }
        footer={
          <div>
            {year && year.length ? (
              <div style={{ marginBottom: 6 }}>
                <label htmlFor="时间">时间：</label>
                {[{ 年: '全部' }].concat(yearInfo.year).map((item, index) => {
                  return (
                    <Tag
                      style={
                        yearInfo.index === index ? { ...tagStyle, ...activeTag } : { ...tagStyle }
                      }
                      key={item.年 || ''}
                      onClick={filterByYear.bind(this, item.年, index)}
                    >
                      {item.年 || ''}
                    </Tag>
                  );
                })}
                {year && year.length > 10 ? (
                  <DynamicArrow
                    currentLength={yearInfo.year.length}
                    basicsLength={year.length}
                    index={yearInfo.index}
                    onClick={showOrHide}
                    size={10}
                    type="year"
                  />
                ) : null}
              </div>
            ) : null}

            {subject && subject.length ? (
              <div style={{ marginBottom: 6 }}>
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
                      key={item.g + index}
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

            {data.length && total >= pageCount ? (
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
              {linkName ? (
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
              ) : null}

              <div>
                <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
              </div>
            </div>
          </div>
        }
        dataSource={data}
        renderItem={(item) => {
          const author = intentJson.results[0].fields['作者'];
          const name = item.作者名称
            ? item.作者名称
                .replace(/\$\$\$/g, '')
                .replace(/###/, '')
                .replace(new RegExp(author), '###$&$$$$$$')
            : '-';

          const realAuthor = item.作者 ? (/\d+/g.test(item.作者) ? name : item.作者) : '-';
          const randomKey =
            fieldWord === '题名' || fieldWord === '主题' || fieldWord === '作者'
              ? item['来源']
              : item[fieldWord] || item.学位授予单位;

          return (
            <List.Item
              style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}
            >
              <a
                style={Object.assign({}, spanStyle, { width: '38%' })}
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(item.题名 || item.篇名 || '-')
                }}
                title={RestTools.removeFlag(item.题名 || '-')}
                href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                  RestTools.sourceDb[item.来源数据库]
                }&filename=${item.文件名}`}
                target="_blank"
                rel="noopener noreferrer"
              />
              <div style={{ width: '15%', textAlign: 'center' }}>
                {/* <div>下载/被引</div> */}
                <div>
                  {item.被引频次
                    ? `${item.下载频次 || '-'}/${item.被引频次}`
                    : `${item.下载频次 || '-'}/-`}
                </div>
              </div>
              {randomKey ? (
                <div
                  title={RestTools.removeFlag(randomKey)}
                  style={{
                    width: '15%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(randomKey) }}
                />
              ) : null}
              <div style={{ width: '15%', textAlign: 'center' }}>
                {item.出版日期 ? dayjs(item.出版日期).format('YYYY-MM-DD') : '-'}
              </div>
              <div
                title={RestTools.removeFlag(realAuthor.substring(0, realAuthor.length) || '-')}
                style={{ ...spanStyle, width: '17%' }}
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(realAuthor)
                }}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}
