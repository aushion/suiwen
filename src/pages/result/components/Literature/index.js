import React, { useState } from 'react';
import { List, Tag } from 'antd';
import Cookies from 'js-cookie';
import dayjs from 'dayjs'
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

export default function Literature(props) {
  const { data, id, evaluate, dispatch, pagination, domain, q } = props;
  const { good, bad, isevalute } = evaluate;
  const { pageStart, pageCount } = pagination;

  const [page, changePage] = useState(pageStart);
  const userId = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo').userName
    : Cookies.get('cnki_qa_uuid');
  const spanStyle = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };
  const tagStyle = {
    cursor: 'pointer'
  };
  function nextPage() {
    changePage(page + 1);
    dispatch({
      type: 'result/getAnswerByDomain',
      payload: {
        domain,
        q,
        userId,
        pageStart: page + 1,
        pageCount
      }
    });
  }

  function prevPage() {
    changePage(page - 1);
    dispatch({
      type: 'result/getAnswerByDomain',
      payload: {
        domain,
        q,
        userId,
        pageStart: page - 1,
        pageCount
      }
    });
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
        // bordered
        footer={
          <div>
            {/* <div>
              {page > 1 ? (
                <Tag style={tagStyle} onClick={prevPage}>
                  上一页
                </Tag>
              ) : null}
              <span>{page}</span>
              <Tag style={tagStyle} onClick={nextPage}>
                下一页
              </Tag>
            </div> */}
            <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
          </div>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a
              style={Object.assign({}, spanStyle, { width: '45%' })}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(item.题名|| '-')
              }}
              href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.sourceDb[item.来源数据库]}&filename=${item.文件名}`}
              target="_blank"
              rel="noopener noreferrer"
            />
            <span>
              下载/被引：
              {item.被引频次 ? `${item.下载频次}/${item.被引频次}` : `${item.下载频次}/-`}
            </span>
            <span>{item.来源数据库}</span>
            <span>{item.出版日期?dayjs(item.出版日期).format('YYYY-MM-DD'):'---------'}</span>
            <span
              title={RestTools.translateToRed(item.作者|| '-')}
              style={Object.assign({}, spanStyle, { width: '10%' })}
              dangerouslySetInnerHTML={{__html:RestTools.translateToRed(item.作者 || '-')}}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
