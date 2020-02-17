import React, { useState } from 'react';
import { List, Tag, Icon } from 'antd';
import dayjs from 'dayjs';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

export default function Literature(props) {
  let { data, id, evaluate, dispatch, pagination, whereSql } = props;
  const sortKey = whereSql.replace(/\s/g, '').match(/BY\((\S*),/)[1];
  const [count, setCount] = useState(0);
  const { good, bad, isevalute } = evaluate;
  const { pageStart, pageCount, total } = pagination;

  const [page, changePage] = useState(pageStart);

  const spanStyle = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };
  const tagStyle = {
    cursor: 'pointer'
  };

  const activeTag = {
    background: 'rgb(24, 144, 255)',
    color: '#fff'
  };
  function nextPage() {
    changePage(page + 1);
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: page + 1,
        whereSql
      }
    });
  }

  function prevPage() {
    changePage(page - 1);
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart: page - 1,
        whereSql
      }
    });
  }

  function sortBy(key) {
    let str = whereSql.split('ORDER')[0];
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
      order = "ORDER BY (ffd,'rank') DESC";
    }
    let newWhereSql = str + order;
    dispatch({
      type: 'result/getCustomView',
      payload: {
        pageStart,
        whereSql: newWhereSql
      }
    });
    setCount(count + 1);
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
          <div>
            {/* {sortKey === 'ffd' ? (
              <Tag
                onClick={sortBy.bind(this, 'ffd')}
                style={
                  sortKey === 'ffd'
                    ? { ...tagStyle, ...activeTag }
                    : {
                        ...tagStyle
                      }
                }
              >
                默认排序
              </Tag>
            ) : null} */}
            <Tag
              onClick={sortBy.bind(this, 'time')}
              style={sortKey === '发表时间' ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
            >
              {sortKey === '发表时间' ? (
                <Icon type={count % 2 ? 'caret-up' : 'caret-down'} />
              ) : null}
              时间
            </Tag>

            <Tag
              onClick={sortBy.bind(this, 'ref')}
              style={sortKey === '被引频次' ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
            >
              {sortKey === '被引频次' ? (
                <Icon type={count % 2 ? 'caret-up' : 'caret-down'} />
              ) : null}
              引用
            </Tag>
            <Tag
              onClick={sortBy.bind(this, 'down')}
              style={sortKey === '下载频次' ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
            >
              {sortKey === '下载频次' ? (
                <Icon type={count % 2 ? 'caret-up' : 'caret-down'} />
              ) : null}
              下载
            </Tag>
          </div>
        }
        footer={
          <div>
            {total >= pageCount ?
            <div>
              {page > 1 ? (
                <Tag style={tagStyle} onClick={prevPage}>
                  上一页
                </Tag>
              ) : null}
              <span style={{ padding: '0 10px' }}>{page}</span>
              <Tag style={tagStyle} onClick={nextPage}>
                下一页
              </Tag>
            </div>: null}
            <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
          </div>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ display: '-ms-flex',display: 'flex',  justifyContent: 'space-between' }}>
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
              title={RestTools.removeFlag((/\d+/g.test(item.作者)? item.作者名称 : item.作者) ||'-')}
              style={Object.assign({}, spanStyle, { width: '10%' })}
              dangerouslySetInnerHTML={{ __html: RestTools.translateToRed((/\d+/g.test(item.作者)? item.作者名称 : item.作者) || '-') }}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
