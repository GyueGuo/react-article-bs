import React from 'react';
import Pagination from '../../components/pagination/';
import axios from 'axios';
import './ColumnManage.less';
import { Form, Table, Row, Button, Modal, Input } from 'antd';

// form 布局配置
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21, offset: 1 },
  },
};
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ArticleAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tableLoading: false,
      showModal: false,
    };
    this.selectedColumn = {};
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.fetchColumn = this.fetchColumn.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleEditColumn = this.handleEditColumn.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    
    this.current = 0;
    // table 配置
    this.columnConf = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: "center"
    }, {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      align: "center"
    }, {
      title: '栏目code',
      dataIndex: 'code',
      key: 'code',
      align: "center"
    }, {
      title: '操作',
      key: 'operation',
      align: "center",
      render: (item) => ( <a href="javascript:;" onClick={() => this.handleEditColumn(item)}>编辑</a>)
    }];
  }
  // 分页组件页数变更回调
  handlePaginationChange(current) {
    this.current = current;

  }

  // 编辑显示新增栏目弹窗
  handleEditColumn(item) {
    this.selectedColumn = {
      code: item.code,
      title: item.title,
      id: item.id,
    };
    this.handleShowModal();
  }
  // 显示新增栏目弹窗
  handleShowModal(item) {
    this.setState({
      showModal: true,
    });
  }
  // 获取列表
  fetchColumn() {
    this.setState({
      tableLoading: true,
    });
    axios
      .get('http://localhost:9090/bs/article/column.json')
      .then((res) => {
        this.setState({
          columns: res.data.columns,
          tableLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  // 弹窗取消
  handleCancel() {
    this.selectedColumn = {};
    this.setState({
      showModal: false,
    });
  }

  // modal确定触发form提交
  handleFormSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = {
          ...values,
        };
        this.selectedColumn.id && (data.id = this.selectedColumn.id);
        console.log(data, this.selectedColumn);
        axios({
          url: 'http://localhost:9090/bs/article/column.json',
          method: Object.keys(this.selectedColumn).length ? 'put' : 'post',
          data,
        }).then((data) => {
          this.handleCancel();
          this.fetchColumn();
        })
      }
    });
  }

  componentDidMount() {
    this.fetchColumn();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { hasNext, columns, tableLoading, showModal } = this.state;
    return (
      <div className="column-manage">
        <Row className="add-column">
          <Button
            type="primary"
            onClick={this.handleShowModal}
          >
            新增栏目
          </Button>
        </Row>
        <Table
          pagination={false}
          columns={this.columnConf}
          dataSource={columns}
          loading={tableLoading}
          rowKey={item => item.id}
        />
        <Pagination
          current={this.current}
          disableNext={!hasNext}
          onChange={this.handlePaginationChange}
        />
        <Modal
          destroyOnClose
          title={`${Object.keys(this.selectedColumn).length ? '编辑' : '新增'}栏目`}
          visible={showModal}
          closable={false}
          okText="提交"
          cancelText="取消"
          onCancel={this.handleCancel}
          onOk={this.handleFormSubmit}
        >
          <Form>
            <Form.Item {...formItemLayout} label="标题">
              {
                getFieldDecorator('title', {
                  rules: [{required: true, message: '标题不能为空'}],
                  initialValue: this.selectedColumn.title || '',
                })(
                  <Input placeholder="标题" type="text" autoComplete="off" />
                )
              }
            </Form.Item>
            <Form.Item {...formItemLayout} label="code">
              {
                getFieldDecorator('code', {
                  rules: [{required: true, message: 'code不能为空'}],
                  initialValue: this.selectedColumn.code || '',
                })(
                  <Input placeholder="code" type="text" autoComplete="off" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ArticleAdd);
