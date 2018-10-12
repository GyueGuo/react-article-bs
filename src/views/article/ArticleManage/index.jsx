import React from 'react';
import { Form, Table, Row, Col, Button, Select, Input, message, Modal } from 'antd';
import axios from 'axios';
import Pagination from '../../../components/pagination/';
import './index.less';

const colLayout = {
  span:5,
  offset: 1
};
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 17,
    offset: 1,
  },
};
const status = [{
  title: '全部',
  value: 'all'
}, {
  title: '审核中',
  value: 0
}, {
  title: '未通过',
  value: 1
}, {
  title: '已通过',
  value: 2
}];

class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      columns: [{
        title: '全部',
        id: 'all'
      }],
      loading: false,
    }
    this.searchQuery = {};
    this.hasNext = false;
    this.pageSize = 30;
    this.current = 0;
    this.columnConf = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    }, {
      title: '栏目',
      dataIndex: 'columnName',
      key: 'columnName',
      align: 'center'
    }, {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      align: 'center'
    } ,{
      title: '发布时间',
      dataIndex: 'created',
      key: 'created',
      align: 'center'
    }, {
      title: '状态',
      dataIndex: 'statusText',
      key: 'statusText',
      align: 'center'
    }, {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (item) => this.showMenus(item),
    }];
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.fetchList = this.fetchList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleDown = this.handleDown.bind(this);
  }
  // 搜索表单提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const query = {};
      Object.keys(values).map((key) => {
        if (values[key] !== '' && values[key] !== 'all') {
          query[key] = values[key];
        }
      });
      this.searchQuery = query;
      this.current = 0;
      this.fetchList();
    });
  }
  // 编辑
  handleEdit(id) {
    this.props.history.push({
      pathname: '/article/article-add',
      state: {
        id,
      },
    });
  }
  // 上架
  handlePass(item) {
    Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      title: '确认操作',
      content: `确定上架 ${item.title} ？`,
      onOk: () => {
        axios({
            url: 'http://localhost:9090/bs/article/pass.json',
            method: 'post',
            data: {
              id: item.id
            }
          }).then(({data}) => {
            if (data.flag === 1) {
              message.success('上架成功');
              this.fetchList();
            } else {
              message.error(data.msg);
            }
          }, () => {
            message.error('请检查网络后重试');
          });
      }
    });
  }
  // 下架
  handleDown(item) {
    Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      title: '确认操作',
      content: `确定下架 ${item.title} ？`,
      onOk: () => {
        axios({
            url: 'http://localhost:9090/bs/article/pass.json',
            method: 'delete',
            data: {
              id: item.id
            }
          }).then(({data}) => {
            if (data.flag === 1) {
              message.success('下架成功');
              this.fetchList();
            } else {
              message.error(data.msg);
            }
          }, () => {
            message.error('请检查网络后重试');
          });
      }
    });
  }
  // 获取商品列表
  fetchList() {
    this.setState({
      loading: true,
    });
    let url = `http://localhost:9090/bs/article/list.json?current=${this.current}&pageSize=${this.pageSize}`;
    Object.keys(this.searchQuery).forEach((key) => {
      url += `&${key}=${this.searchQuery[key]}`;
    });
    axios
      .get(url)
      .then(({data}) => {
        if (data.flag === 1) {
          const articles = data.data;
          this.hasNext = articles.length >= this.pageSize;
          this.setState({
            articles,
            loading: false,
          });
        } else {
          message.error(data.msg);
          this.setState({
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  }
  // 翻页回调
  handlePaginationChange(current) {
    this.current = current;
    this.fetchList();
  }
  
  showMenus(item) {
    if ([0, 1].includes(item.status)) {
      return (
        <React.Fragment>
          <a href="javascript:;" onClick={() => {this.handlePass(item)}}>上架</a>
          {' '}|{' '}  
          <a href="javascript:;" onClick={() => {this.handleEdit(item.id)}}>编辑</a>
        </React.Fragment>
      )
    } else if (item.status === 2) {
      return (
        <React.Fragment>
          <a href="javascript:;" onClick={() => {this.handleDown(item)}}>下架</a>
          {' '}|{' '}  
          <a href="javascript:;" onClick={() => {this.handleEdit(item.id)}}>编辑</a>
        </React.Fragment>
      )
    } else {
      return null;
    }
  }
  componentDidMount() {
    const { columns } = this.state;
    axios
      .get('http://localhost:9090/bs/article/column.json?pageSize=all')
      .then(({data}) => {
        if (data.flag === 1) {
          this.setState({
            columns:  [...columns, ...data.data],
          });
        } else {
          message.error(data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.fetchList();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { articles, columns, loading } = this.state;
    return (
      <div className="article-manage">
        <Form className="search-form" layout="inline" onSubmit={this.handleSubmit}>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="栏目" {...formItemLayout}>
                {
                  getFieldDecorator('column', {
                  initialValue: columns[0].id,
                  })(
                    <Select>
                      {
                        columns.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            { item.title }
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="标题" {...formItemLayout}>
                {
                  getFieldDecorator('title', {
                  initialValue: ''
                  })(
                    <Input placeholder="文章标题" autoComplete="off" />
                  )
                }
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="状态" {...formItemLayout}>
                {
                  getFieldDecorator('status', {
                  initialValue: status[0].value
                  })(
                    <Select>
                      {
                        status.map((item) => (
                          <Select.Option key={item.value} value={item.value}>
                            { item.title }
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Button htmlType="submit" type="primary">
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          pagination={false}
          columns={this.columnConf}
          dataSource={articles}
          rowKey={item => item.id}
          loading={loading}
        />
        <Pagination
          current={this.current}
          disableNext={!this.hasNext}
          onChange={this.handlePaginationChange}
        />
      </div>
    )
  }
}
export default Form.create()(Manage);