import { Modal, Input, Card, Table, Button, message, Col, Row, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, CheckOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

let editFlag = false;

const NodeQuestionModel = props => {
    const { modalVisible, onCancle, data, chapterId } = props;
    const [questionSourceData, setQuestionSourceData] = useState([]);
    //新增问题/关键字相关
    const [newNodeQuestions, setNewNodeQuestions] = useState('');
    const { TextArea } = Input;
    //多选框参数
    const [selectedRows, setSelectedRows] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState('');
    //编辑行数据相关
    const [tableEditedQuestion, setTableEditedQuestion] = useState('');
    const [inputIndex, setInputIndex] = useState(-1);


    useEffect(() => {
        search();

    }, [editFlag]);

    //根据节id加载对应的问题/关键字信息
    function search() {
        props
            .dispatch({
                type: 'Doc/queryForRouteQuestion',
                payload: {
                    routeId: data.id,
                    pageStart: 1,
                    pageSize: 5,

                },
            })
            .then(res => {
                if (res.code == 200) {
                    setQuestionSourceData(res.result.dataList);
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
                            editFlag = true;

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
                    {editFlag == true ?
                        (index === inputIndex ? <CheckOutlined onClick={(() => { editNodeQuestion(record) })} title="保存" />
                            : <EditOutlined onClick={(() => { document.getElementById("queInput" + record.qId).focus() })} title="编辑" />)
                        : <EditOutlined onClick={(() => { document.getElementById("queInput" + record.qId).focus() })} title="编辑" />}
                    <Divider type="vertical" />
                    <DeleteOutlined onClick={(() => { deleteNodeQuestion({ qId: record.qId }) })} title="删除" />
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
        // console.log('questionSourceData', questionSourceData);
        for (let i = 0; i < questionSourceData.length; i++) {
            // console.log(questionSourceData[i].orderNum);
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
                    routeId: record.routeId,
                    parentId: record.parentId,
                    question: tableEditedQuestion == '' ? encodeURIComponent(record.question) : encodeURIComponent(tableEditedQuestion),
                    // question: record.question,
                    orderNum: record.orderNum,

                },
            })
            .then(res => {
                if (res.code == 200) {
                    //去除文本框里的焦点
                    document.getElementById("queInput" + record.qId).blur();
                    setTableEditedQuestion('');
                    setInputIndex('');
                    editFlag = false;
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
                        if (res.code == 200) {
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
                    routeId: data.id,
                    parentId: chapterId,
                    question: encodeURIComponent(newNodeQuestions),
                    orderNum: null,
                }
            })
            .then((res) => {
                if (res.code == 200) {
                    search();
                    message.success("保存成功");
                    setNewNodeQuestions('');
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
        if (selectedRows == '' || selectedRows.length == 0) {
            message.warning('请选择一条记录!');
            return;
        }
        var qIds = new Array();
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
                            qId: qIds[i],
                        },
                    })
                        .then(res => {
                            if (res.code == 200) {
                                search();
                                if (i == (qIds.length - 1)) {
                                    message.success('删除成功');
                                }

                            } else {
                                //点击按钮，刷新查询页面，但不跳转到第一页，停留在当前页
                                search();
                                message.error('删除失败');
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
        //推出编辑状态
        editFlag = false;
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
                routeId: record.routeId,
                parentId: record.parentId,
                question: encodeURIComponent(record.question),
                orderNum: previousLine.orderNum,
            },
        }).then(res => {
            if (res.code == 200) {
                props.dispatch({
                    type: 'Doc/saveRouteQuestion',
                    payload: {
                        qid: previousLine.qId,
                        routeId: previousLine.routeId,
                        parentId: previousLine.parentId,
                        question: encodeURIComponent(previousLine.question),
                        orderNum: record.orderNum,
                    },
                }).then(res => {
                    if (res.code == 200) {
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
                routeId: record.routeId,
                parentId: record.parentId,
                question: encodeURIComponent(record.question),
                orderNum: nextLine.orderNum,
            },
        }).then(res => {
            if (res.code == 200) {
                props.dispatch({
                    type: 'Doc/saveRouteQuestion',
                    payload: {
                        qid: nextLine.qId,
                        routeId: nextLine.routeId,
                        parentId: nextLine.parentId,
                        question: encodeURIComponent(nextLine.question),
                        orderNum: record.orderNum,
                    },
                }).then(res => {
                    if (res.code == 200) {
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

    return (
        <Modal
            destroyOnClose
            title={"配置问题或关键字"}
            visible={modalVisible}
            width={850}
            centered={true}
            onOk={onHandleOk}
            onCancel={onCancle}
        >

            <Card>
                <Row gutter={[24, 24]} >
                    <Col span={24}>
                        <div style={{ textAlign: 'center', marginTop: 0 }}>
                            <font face="楷体" size="4"><b>问题输入</b></font>
                        </div>
                    </Col>
                </Row>

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

                <Row gutter={[24, 24]} >
                    <Col span={24}>
                        <Card>
                            <div style={{ textAlign: 'center', marginTop: 0 }}>
                                <font face="楷体" size="4"><b>问题管理</b></font>
                            </div>
                            <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 10 }}>
                                <Button onClick={refreshNodeQuestionData} loading={props.loading} style={{ marginLeft: 10, color: '#000000' }} >
                                    刷新数据
                                </Button>
                                <Button onClick={batchDeleteNodeQuestion} loading={props.loading} style={{ marginLeft: 10, color: ' red' }} >
                                    批量删除
                                </Button>

                            </div>
                            <Table
                                rowSelection={rowSelection}
                                loading={props.loading}
                                columns={columns}
                                size='middle'
                                style={{ marginTop: 20, minHeight: 340 }}
                                pagination={false}
                                dataSource={questionData}
                            />
                        </Card>

                    </Col>


                </Row>





            </Card>
        </Modal>
    );
};
export default NodeQuestionModel;
