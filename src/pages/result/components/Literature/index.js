import React, { useState } from 'react';
import { List, Tag, Icon, Pagination, Input } from 'antd';
import dayjs from 'dayjs';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

const { Search } = Input;
export default function Literature(props) {
  let { data, id, evaluate, dispatch, linkName, keyword, pagination, sql, orderBy, SN, year, subject, intent } = props;
  const sortKey = orderBy.replace(/\s/g, '').match(/BY\((\S*),/)[1];
  console.log(intent)
  const [count, setCount] = useState(0);
  const { good, bad, isevalute } = evaluate;
  const { pageStart, pageCount, total } = pagination;
  const [page, changePage] = useState(pageStart);
  const [searchValue, setSearchValue] = useState(keyword?intent.results[0].fields[keyword]: '')
  const [yearInfo, setYearInfo] = useState({
    index: 0,
    yearSql: '',
    year: year ? year.slice(0, 12) : []
  });
  

  const [subjectInfo, setSubjectInfo] = useState({
    index: 0,
    subjectSql: '',
    subject: subject ? subject.slice(0, 5) : []
  });

  const linkMap = {
    '文献': {
      name: '相关文献',
      url: (kw) => `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw=${kw}&korder=0&sel=1`
    },
    '硕士': {
      name: '硕士论文',
      url: (kw) => `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
    '博士': {
      name: '博士论文',
      url: (kw) =>`http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
    '会议': {
      name: '会议论文',
      url: (kw) => `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CIPD&kw=${kw}&korder=0&sel=1`
    },
    '硕博': {
      name: '硕博士论文',
      url: (kw) => `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=CDMD&kw=${kw}&korder=0&sel=1`
    },
  }

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
    } else if (key === 'ref') {
      if (count % 2 !== 0) {
        order = " ORDER BY  (被引频次,'integer') desc ";
      } else {
        order = " ORDER BY  (被引频次,'integer') asc ";
      }
    } else if (key === 'down') {
      if (count % 2 !== 0) {
        order = " ORDER BY  (下载频次,'integer') desc ";
      } else {
        order = " ORDER BY  (下载频次,'integer') asc ";
      }
    } else if (key === 'ffd') {
      order = " ORDER BY (ffd,'rank') DESC";
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
      index,
      yearSql,
      year: yearInfo.year
    };
    changePage(1);
    setYearInfo(newYearInfo);

    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: 1,
        index,
        whereSql: sql,
        yearSql: yearSql,
        intent,
        subjectSql,
        keyword: '',
        SN,
        orderSql: orderBy
      }
    });
  }

  function filterBySubject(subject, index) {
    const subjectSql = subject === '全部' ? '' : ` AND 专题子栏目代码='${subject}?'`;
    setSubjectInfo({ ...subjectInfo, index, subjectSql });
    setYearInfo({ ...yearInfo, index: 0, yearSql: '' });
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart,
        whereSql: sql,
        yearSql: '',
        intent,
        subjectSql,
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
  //排序子组件
  const SortTag = function(props) {
    const { sortKeyText, name, sqlKey } = props;
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
              <Search
                placeholder=""
                value={searchValue}
                onSearch={(value) => console.log(value)}
                style={{ width: 300 }}
              />
            </div>
            <div style={{ float: 'right' }}>
              <SortTag sqlKey="ffd" name="默认排序" sortKeyText="ffd" />
              <SortTag sqlKey="time" name="时间" sortKeyText="发表时间" />
              <SortTag sqlKey="ref" name="引用" sortKeyText="被引频次" />
              <SortTag sqlKey="down" name="下载" sortKeyText="下载频次" />
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
                {yearInfo.year.length < year.length ? (
                  <Icon
                    onClick={showOrHide.bind(this, 'year')}
                    style={{ color: '#000', fontWeight: 'bolder' }}
                    type="arrow-down"
                  />
                ) : yearInfo.year.length === year.length ? (
                  <Icon
                    onClick={showOrHide.bind(this, 'year')}
                    style={{ color: '#000', fontWeight: 'bolder' }}
                    type="arrow-up"
                  />
                ) : null}
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
                {subjectInfo.subject.length < subject.length ? (
                  <Icon
                    onClick={showOrHide.bind(this, 'subject')}
                    style={{ color: '#000', fontWeight: 'bolder' }}
                    type="arrow-down"
                  />
                ) : subjectInfo.subject.length === subject.length ? (
                  <Icon
                    onClick={showOrHide.bind(this, 'subject')}
                    style={{ color: '#000', fontWeight: 'bolder' }}
                    type="arrow-up"
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
            <a
              style={{ display: 'block', paddingBottom: 10, textAlign: 'right', color: '#999', fontSize: 12 }}
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
