import { Modal, Input, Card, Table, Button, message, Col, Row, Divider, Select, Spin, List, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import RestTools from '../../../../utils/RestTools';
import styles from '../style.less';
import { EditOutlined, DeleteOutlined, CheckOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import QuestionTemplateTagSelect from './QuestionTemplateTagSelect';

const NodeQuestionModel = props => {
    const { modalVisible, onCancle, data, chapterId, answerContentDataForCurrentQuestion } = props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const username = userInfo ? userInfo.UserName : '';
    const [questionSourceData, setQuestionSourceData] = useState([]);
    //新增问题/关键字相关
    const [questionTemplateData, setQuestionTemplateData] = useState([]);
    // const [selectedQuestionTemplate, setSeletedQuestionTemplate] = useState('');
    const [newNodeQuestions, setNewNodeQuestions] = useState('');
    const { TextArea } = Input;
    //多选框参数
    const [selectedRows, setSelectedRows] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState('');
    //编辑行数据相关
    const [tableEditedQuestion, setTableEditedQuestion] = useState('');
    const [inputIndex, setInputIndex] = useState(-1);
    const [editFlag, setEditFlag] = useState(false);
    //展示问题搜索到的答案内容
    const [showAnswerFlag, setShowAnswerFlag] = useState(false);
    const [showAnswerIndex, setShowAnswerIndex] = useState(-1);
    const [answerResultForCurrentQuestionLoading, setAnswerResultForCurrentQuestionLoading] = useState(false);
    //编辑模式开关状态
    const [questionInputTypeSwitchStatus, setQuestionInputTypeSwitchStatus] = useState(false);


    useEffect(() => {
        //加载问题模版
        getQuestionTemplate();
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFlag]);

    //获取所有的问题、关键字模版
    function getQuestionTemplate() {
        props
            .dispatch({
                type: 'Doc/getQuestionTemplate',
                payload: {
                    userName: username,
                  }
            })
            .then(res => {
                if (res.code === 200) {
                    setQuestionTemplateData(res.result);
                } else {
                    message.error(res.msg);
                }
            });
    }

    //根据节id加载对应的问题/关键字信息
    function search() {
        props
            .dispatch({
                type: 'Doc/queryForRouteQuestion',
                payload: {
                    userName: username,
                    routeId: data.id,
                    pageStart: 1,
                    pageSize: 5,

                },
            })
            .then(res => {
                if (res.code === 200) {
                    setQuestionSourceData(res.result.dataList);
                } else {
                    message.error(res.msg);
                }
            });
    }

    //展示当前问题对应的随问答案
    function showAnswerForCurrentQuestion(record, index) {
        setShowAnswerIndex(index);
        //根据当前是否显示预览答案状态，分别判定事件
        if (showAnswerFlag && index === showAnswerIndex) {
            setShowAnswerFlag(false);
            //清空答案数据

        } else {
            setShowAnswerFlag(true);
            //调用答案搜索函数，并将其视图化展示出来
            getAnswerContentForCurrentQuestion(record);


        }
    }

    //根据当前问题搜索随问答案原文函数
    function getAnswerContentForCurrentQuestion(record) {
        setAnswerResultForCurrentQuestionLoading(true);
        //调用获取随问片段接口
        props.dispatch({
            type: 'Doc/getContentByQuestion',
            payload: {
                userName: username,
                q: encodeURIComponent(record.question),
            }
        }).then((res) => {
            if (res.code === 200) {
                setAnswerResultForCurrentQuestionLoading(false);
            } else {
                message.error(res.msg);
            }
        });
    }

    //多选框
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    //多选框触发事件
    function onSelectChange(selectedRowKeys, selectedRows) {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    }

    let columns = [
        { title: '序号', dataIndex: 'key', key: 'key', align: 'center', width: '10%' },
        {
            title: '问题/关键字',
            dataIndex: 'question',
            key: 'question',
            align: 'center',
            width: '65%',
            render: (text, record, index) => {
                return <>
                    <TextArea
                        id={"queInput" + record.qId}
                        style={{ border: 0 }}
                        title={record.question}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                        value={(index === inputIndex) ? (tableEditedQuestion) : record.question}
                        //判断点击的键盘的keyCode是否为13，是就调用更新保存函数
                        onPressEnter={(e) => {
                            if (e.nativeEvent.keyCode === 13) { //e.nativeEvent获取原生的事件对像
                                //调用更新保存函数
                                editNodeQuestion(record);
                            }
                        }}
                        onChange={e => {
                            setTableEditedQuestion(e.target.value.trim());
                            setInputIndex(index);
                            setEditFlag(true);

                        }}
                        onBlur={() => {
                            //调用更新保存函数
                            editNodeQuestion(record);
                        }}

                    />
                </>
            },
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            align: 'center',
            width: '25%',
            render: (text, record, index) => (

                <span>
                    {editFlag === true ?
                        (index === inputIndex ? <CheckOutlined onClick={(() => { editNodeQuestion(record) })} title="保存" />
                            : <EditOutlined onClick={(() => { document.getElementById("queInput" + record.qId).focus() })} title="编辑" />)
                        : <EditOutlined onClick={(() => { document.getElementById("queInput" + record.qId).focus() })} title="编辑" />}
                    <Divider type="vertical" />
                    <DeleteOutlined onClick={(() => { deleteNodeQuestion({ userName: username,qId: record.qId }) })} title="删除" />
                    <Divider type="vertical" />
                    {showAnswerFlag === true ?
                        (index === showAnswerIndex ? <EyeOutlined onClick={(() => { showAnswerForCurrentQuestion(record, index) })} title="点击隐藏答案预览" />
                            : <EyeInvisibleOutlined onClick={(() => { showAnswerForCurrentQuestion(record, index) })} title="点击显示答案预览" />)
                        : <EyeInvisibleOutlined onClick={(() => { showAnswerForCurrentQuestion(record, index) })} title="点击显示答案预览" />}
                    <Divider type="vertical" />
                    <ArrowUpOutlined onClick={(() => { arrowUpOutlined(record) })} title="排序上升" />
                    <Divider type="vertical" />
                    <ArrowDownOutlined onClick={(() => { arrowDownOutlined(record) })} title="排序下降" />

                </span>
            ),
        },
    ]

    //定义数据数组并为其填充数据
    let questionData = [];
    if (questionSourceData) {
        for (let i = 0; i < questionSourceData.length; i++) {
            questionData.push({
                key: i + 1,
                qId: questionSourceData[i].qid,
                routeId: questionSourceData[i].routeId,
                question: questionSourceData[i].question,
                orderNum: questionSourceData[i].orderNum,

            });
        }
    }

    //根据问题id编辑对应的问题/关键字信息
    function editNodeQuestion(record) {
        props
            .dispatch({
                type: 'Doc/saveRouteQuestion',
                payload: {
                    qid: record.qId,
                    userName: username,
                    routeId: record.routeId,
                    parentId: record.parentId,
                    question: tableEditedQuestion === '' ? encodeURIComponent(record.question) : encodeURIComponent(tableEditedQuestion),
                    // question: record.question,
                    orderNum: record.orderNum,

                },
            })
            .then(res => {
                if (res.code === 200) {
                    //去除文本框里的焦点
                    document.getElementById("queInput" + record.qId).blur();
                    setTableEditedQuestion('');
                    setInputIndex('');
                    setEditFlag(false);
                    search();
                    message.success('更新成功');
                } else {

                    search();
                    message.error(res.msg);
                }
            });
    }

    //根据问题id删除对应的问题/关键字信息
    function deleteNodeQuestion(payload) {
        Modal.confirm({
            title: '确定删除?',
            centered: true,
            onOk() {
                props
                    .dispatch({
                        type: 'Doc/delRouteQuestion',
                        payload,
                    })
                    .then(res => {
                        if (res.code === 200) {
                            search();
                            message.success("删除成功");
                        } else {
                            message.error(res.msg);
                        }
                    });
            },
        });
    }

    //为当前节标题添加问题或关键字
    function addNodeQuestion() {
        if (newNodeQuestions.trim() === '') {
            message.warn('不可添加空字符');
            return;
        }

        //限制问题的数量最大值为5
        if (questionSourceData && questionSourceData.length >= 5) {
            message.warn('最多添加5个问题/关键字');
            return;
        }
        props
            .dispatch({
                type: 'Doc/saveRouteQuestion',
                payload: {
                    qid: null,
                    userName: username,
                    routeId: data.id,
                    parentId: chapterId,
                    question: encodeURIComponent(newNodeQuestions),
                    orderNum: null,
                }
            })
            .then((res) => {
                if (res.code === 200) {
                    search();
                    message.success("保存成功");
                    setNewNodeQuestions('');
                } else {
                    message.error(res.msg);
                }
            });
    }

    //为当前节标题添加标签问题
    function addNodeTagQuestion(values) {

        props
            .dispatch({
                type: 'Doc/saveRouteQuestion',
                payload: {
                    qid: null,
                    userName: username,
                    routeId: data.id,
                    parentId: chapterId,
                    question: encodeURIComponent(values.question),
                    tag: encodeURIComponent(values.tagQuestion),
                    orderNum: null,
                }
            })
            .then((res) => {
                if (res.code === 200) {
                    search();
                    message.success("保存成功");

                } else {
                    message.error(res.msg);
                }
            });
    }

    //清空文本域文本内容
    function textEmpty() {
        setNewNodeQuestions('');
        message.success('清空完毕');
    }

    //批量删除操作触发事件
    function batchDeleteNodeQuestion() {
        if (selectedRows === '' || selectedRows && selectedRows.length === 0) {
            message.warning('请选择一条记录!');
            return;
        }
        var qIds = [];
        selectedRows.forEach(value => qIds.push(value.qId));
        batchDeleteNodeQuestionByQIds({ qIds: qIds });
    }

    //批量删除问题/关键字
    function batchDeleteNodeQuestionByQIds(payload) {
        Modal.confirm({
            title: '确定批量删除选择的问题/关键字吗?',
            centered: true,
            onOk() {
                let qIds = payload.qIds;
                for (let i = 0; i < qIds.length; i++) {
                    props.dispatch({
                        type: 'Doc/delRouteQuestion',
                        payload: {
                            userName: username,
                            qId: qIds[i],
                        },
                    })
                        .then(res => {
                            if (res.code === 200) {
                                search();
                                if (i === (qIds.length - 1)) {
                                    message.success(res.msg);
                                }

                            } else {
                                //点击按钮，刷新查询页面，但不跳转到第一页，停留在当前页
                                search();
                                message.error(res.msg);
                            }
                        });
                }

                setSelectedRows(null);
                setSelectedRowKeys(null);
            }

        });
    }

    //刷新最新的节点问题数据
    function refreshNodeQuestionData() {
        //清除行数据编辑缓存和行索引缓存
        setTableEditedQuestion('');
        setInputIndex('');
        setShowAnswerIndex('');
        //推出编辑状态
        setEditFlag(false);
        search();
        message.success('最新数据刷新完毕');
    }


    //排序上升
    function arrowUpOutlined(record) {
        //判断当前行问题是否为第一序号，如果为第一序号，则不需要排序上升
        if (record.key === 1) {
            message.success("已经为第一序号了");
            return;
        }

        //获取当前行前面一行的数据
        let previousLine = [];
        for (let i = 0; i < questionData.length; i++) {
            if ((record.key - 1) === questionData[i]['key']) {
                previousLine = questionData[i];
                break;
            }
        }

        //交换当前问题和前面问题的排序序号（数据库字段值为orderNum）
        props.dispatch({
            type: 'Doc/saveRouteQuestion',
            payload: {
                qid: record.qId,
                userName: username,
                routeId: record.routeId,
                parentId: record.parentId,
                question: encodeURIComponent(record.question),
                orderNum: previousLine.orderNum,
            },
        }).then(res => {
            if (res.code === 200) {
                props.dispatch({
                    type: 'Doc/saveRouteQuestion',
                    payload: {
                        qid: previousLine.qId,
                        userName: username,
                        routeId: previousLine.routeId,
                        parentId: previousLine.parentId,
                        question: encodeURIComponent(previousLine.question),
                        orderNum: record.orderNum,
                    },
                }).then(res => {
                    if (res.code === 200) {
                        //交换完排序号，进行重新加载问题
                        search();
                    } else {
                        message.error(res.msg);
                    }
                });
            } else {
                message.error(res.msg);
            }
        });


    }

    //排序下降
    function arrowDownOutlined(record) {
        //判断当前行问题是否为最后的一个序号，如果为最后的序号，则不需要排序下降
        if (record.key === questionData.length) {
            message.success("已下降到最后");
            return;
        }

        //获取当前行后面一行的数据
        let nextLine = [];
        for (let i = 0; i < questionData.length; i++) {
            if ((record.key + 1) === questionData[i]['key']) {
                nextLine = questionData[i];
                break;
            }
        }

        //交换当前问题和后面问题的排序序号（数据库字段值为orderNum）
        props.dispatch({
            type: 'Doc/saveRouteQuestion',
            payload: {
                qid: record.qId,
                userName: username,
                routeId: record.routeId,
                parentId: record.parentId,
                question: encodeURIComponent(record.question),
                orderNum: nextLine.orderNum,
            },
        }).then(res => {
            if (res.code === 200) {
                props.dispatch({
                    type: 'Doc/saveRouteQuestion',
                    payload: {
                        qid: nextLine.qId,
                        userName: username,
                        routeId: nextLine.routeId,
                        parentId: nextLine.parentId,
                        question: encodeURIComponent(nextLine.question),
                        orderNum: record.orderNum,
                    },
                }).then(res => {
                    if (res.code === 200) {
                        //交换完排序号，进行重新加载问题
                        search();
                    } else {
                        message.error(res.msg);
                    }
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    //提交按钮事件
    const onHandleOk = () => {
        const values = {
            'orderNum': null,
            'qId': null,
            'parentId': chapterId,
            'routeId': data.id,
            'question': newNodeQuestions,
            'questionSourceData': questionSourceData,

        };
        props.handleOk(values);

    };

    //问题模板标签多选框数据初始化
    let questionTemplateTagOptions = [];
    let questionTemplateOptions = [];
    if (questionTemplateData.length) {
        for (let i = 0; i < questionTemplateData.length; i++) {

            questionTemplateOptions.push(
                <Select.Option value={questionTemplateData[i]['question']} key={i} title={questionTemplateData[i]['tag']}>
                    {questionTemplateData[i]['tag']}
                </Select.Option>
            );

            let tagObject = { label: questionTemplateData[i]['tag'], value: questionTemplateData[i]['question'] + '###' + questionTemplateData[i]['tag'] };
            questionTemplateTagOptions.push(tagObject);
        }
    }





    //选择问题模版改变事件
    // const onQuestionSelectChange = (v) => {
    //     setSeletedQuestionTemplate(v);
    //     if (v === '') {
    //         return;
    //     }
    //     //将选择的问题模版 填充到文本域里
    //     let newNodeQuestionsStr = (newNodeQuestions === '' ? (v) : (newNodeQuestions + '\n' + v));
    //     setNewNodeQuestions(newNodeQuestionsStr);
    // }

    //问题输入模式开关改变函数
    function onQuestionInputTypeSwitchChanged(checked) {
        if (checked) {
            //如果是自由输入模式
            setQuestionInputTypeSwitchStatus(true);
        } else {
            //如果切换到问题标签模式
            setQuestionInputTypeSwitchStatus(false);
        }
    }


    return (
        <Modal
            destroyOnClose
            title={"配置章节系列问题"}
            visible={modalVisible}
            width={showAnswerFlag === true ? 1500 : 850}
            centered={true}
            onOk={onHandleOk}
            onCancel={onCancle}
            footer={null}
        >
            <Row gutter={[24, 24]} >
                <Col span={12}>
                    <Card style={{ width: '800px' }}>
                        <Row gutter={[24, 24]} >
                            <Col span={24}>

                                <div style={{ textAlign: 'center', marginTop: 0 }}>
                                    <font style={{ marginLeft: '95px' }} face="楷体" size="4"><b>问题新增</b></font>
                                    <Switch
                                        // style={{ float: "right" ,visibility:'hidden'}}
                                        style={{ float: "right", backgroundColor: questionInputTypeSwitchStatus === false ? 'green' : '#23238E ' }}
                                        title={"标签与自由输入模式切换"}
                                        checkedChildren={'自由输入模式'}
                                        unCheckedChildren={'问题标签模式'}
                                        //默认自由输入状态。只有当点击开关时，才会将其置为问题标签模式。
                                        defaultChecked={false}
                                        checked={questionInputTypeSwitchStatus}
                                        onChange={value => {
                                            onQuestionInputTypeSwitchChanged(value);
                                        }}
                                    />
                                </div>


                            </Col>
                        </Row>
                        {questionInputTypeSwitchStatus === false ?
                            <QuestionTemplateTagSelect
                                questionTemplateTagOptions={questionTemplateTagOptions}
                                dispatch={props.dispatch}
                                addNodeTagQuestion={addNodeTagQuestion}
                                questionSourceData={questionSourceData}
                                search={search}
                                data={data}
                                chapterId={chapterId}
                            />
                            :
                            <div>
                                {/* <Row gutter={[24, 24]} >
                                    <Col span={24}>
                                        <div style={{ textAlign: 'left', marginTop: 0 }}>
                                            <font face="宋体" size="2"><b>模版选择：</b></font>
                                            <Select
                                                style={{ width: 300 }}
                                                value={selectedQuestionTemplate}
                                                onChange={(v) => onQuestionSelectChange(v)}
                                            >
                                                <Select.Option value={''} >
                                                    {'无'}
                                                </Select.Option>
                                                {questionTemplateOptions}
                                            </Select>
                                        </div>

                                    </Col>
                                </Row> */}

                                <Row gutter={[24, 24]}>

                                    <Col span={20} >
                                        <TextArea
                                            style={{ border: "solid 3px   #E6E8FA" }}
                                            placeholder="批量添加以回车换行分割"
                                            autoSize={{ minRows: 4, maxRows: 4 }}
                                            value={newNodeQuestions}
                                            onChange={e => {
                                                setNewNodeQuestions(e.target.value);

                                            }}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Button
                                            style={{ marginLeft: -10, color: '#5F9F9F' }}
                                            loading={props.loading}
                                            onClick={() => {
                                                //保存问题/关键字
                                                addNodeQuestion();
                                            }}
                                        >
                                            保存更新
                                </Button>

                                        <Button
                                            style={{ marginLeft: -10, marginTop: 33, color: '#97694F ' }}
                                            loading={props.loading}
                                            onClick={() => {
                                                //保存问题/关键字
                                                textEmpty();
                                            }}
                                        >
                                            文本清空
                                </Button>



                                    </Col>
                                </Row>
                            </div>
                        }
                        <Row gutter={[24, 24]} >
                            <Col span={24}>
                                <Card>
                                    <div style={{ textAlign: 'center', marginTop: 0 }}>
                                        <font face="楷体" size="4"><b>问题展示</b></font>
                                    </div>
                                    <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 10 }}>
                                        <Button onClick={refreshNodeQuestionData} loading={props.loading} style={{ marginLeft: 10, color: '#000000' }} >
                                            <strong>刷新数据</strong>
                                        </Button>
                                        <Button onClick={batchDeleteNodeQuestion} loading={props.loading} style={{ marginLeft: 10, color: ' red' }} >
                                            <strong>批量删除</strong>
                                        </Button>

                                    </div>
                                    <Table
                                        rowSelection={rowSelection}
                                        loading={props.loading}
                                        columns={columns}
                                        size='middle'
                                        style={{ marginTop: 20, minHeight: 320 }}
                                        pagination={false}
                                        dataSource={questionData}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={12} style={{ display: showAnswerFlag === false ? "none" : "block" }}>
                    <div id="scrollContentInNodeQuestionModel" className={styles.scrollContentInNodeQuestionModel}>
                        <Spin spinning={answerResultForCurrentQuestionLoading} tip="文档片段匹配中..." size="large">
                            {answerContentDataForCurrentQuestion && answerContentDataForCurrentQuestion.contentList && answerContentDataForCurrentQuestion.contentList.length > 0 ? (
                                <div>
                                    {
                                        answerContentDataForCurrentQuestion.question ? (

                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        '<h3 align="center">' +
                                                        [answerContentDataForCurrentQuestion.question] +
                                                        '</h3>'
                                                }}
                                            />
                                        ) : null
                                    }
                                    < List
                                        split={false}
                                        dataSource={answerContentDataForCurrentQuestion.contentList}
                                        renderItem={(contentItem) => (
                                            <List.Item>
                                                <Col>
                                                    <Row>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    '<p style="text-indent:2em">' +
                                                                    RestTools.translateDocToRed(
                                                                        contentItem.content
                                                                    ) +
                                                                    '</p>'
                                                            }}
                                                        />
                                                    </Row>
                                                    <Row>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    '<p style="text-align: right">' +
                                                                    '<a style="color:#999" target="_blank" rel="noopener noreferrer" href=http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=' +
                                                                    contentItem.resourceId +
                                                                    '>' +
                                                                    contentItem.resource +
                                                                    '</a>' +
                                                                    '</p>'
                                                            }}
                                                        />
                                                    </Row>
                                                </Col>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            ) : null}
                        </Spin>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};
export default NodeQuestionModel;
