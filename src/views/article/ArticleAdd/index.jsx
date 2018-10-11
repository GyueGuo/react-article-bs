import React from 'react';
import Editor from 'wangeditor';
import axios from 'axios';
import './index.less';

import { Form, Input, Select, Row, Button, Checkbox, message } from 'antd';
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
// 编辑器菜单栏配置
const editorConfig = [
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'backColor', // 背景颜色
  'link', // 插入链接
  'list', // 列表
  'justify', // 对齐方式
  'quote', // 引用
  'table', // 表格
  'undo', // 撤销
  'redo', // 恢复
];
class ArticleAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      reprint: false,
      article: {
        title: '',
        id: '',
        column: '',
        reprint: false,
        source: '',
        content: ''
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleReprintChange = this.handleReprintChange.bind(this);
    this.validateEditorFrom = this.validateEditorFrom.bind(this);
    
  }
  componentDidMount() {
    // 初始化富文本编辑器
    this.editor = new Editor(this.editorNode);
    this.editor.customConfig.menus = editorConfig;
    this.editor.customConfig.zIndex = 100;
    this.editor.customConfig.onchange = (html) => {
      // 输入时将编辑器的html值设为form表单的content属性值
      this.props.form.setFieldsValue({
        content: html.trim(),
      });
    };
    this.editor.create();
    if (this.props.location.state && this.props.location.state.id) {
      this.id = this.props.location.state.id;
      axios
        .get(`http://localhost:9090/bs/article/article.json?id=${this.id}`)
        .then((res) => {
          const article = res.data.data.article;
          this.editor.txt.html(article.content);
          this.setState({
            article,
            reprint: !!article.reprint,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    axios
      .get('http://localhost:9090/bs/article/column.json?pageSize=all')
      .then(({data}) => {
        this.setState({
          columns: data.data.columns,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 保存
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.reprint && !values.source) {
          this.props.form.setFields({
            source: {
              value: values.source,
              errors: [new Error('内容来源不能为空')],
            },
          });
        } else {
          const data = { ...values, id: this.id };
          data.source = data.reprint ? data.source : '';
          axios({
            url: 'http://localhost:9090/bs/article/article.json',
            method: this.id? 'put' : 'post',
            data,
          })
          .then(({data}) => {
            if (data && data.flag === 1) {
              if (!this.id) {
                this.id = data.data.id;
              }
              message.success('保存成功');
            }
          })
          .catch(() => {
            message.success('系统错误，请稍后再试');
          });
        }
      }
    });
  }
  // 重置
  handleReset() {
    const { article } = this.state;
    this.editor.txt.html(article.content);
    this.props.form.resetFields();
    this.setState({
      reprint: article.reprint,
    })
  }
  handleReprintChange(e) {
    this.setState({
      reprint: e.target.checked,
    });
  }
  // 提交时内容校验
  validateEditorFrom(rule, value, callback) {
    if (!this.editor.txt.text()) {
      callback('内容不能为空');
    }
    callback();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { reprint, columns, article } = this.state;
    return (
      <div className="artcile-add">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="文章标题" { ...formItemLayout }>
            { 
              getFieldDecorator('title', {
                rules:[{ required: true, message: '文章标题'}],
                initialValue: article.title,
              })(
                <Input placehholder="文章标题，50字以内" autoComplete="off" />
              )
            }
          </Form.Item>
          <Form.Item label="栏目" { ...formItemLayout }>
            {
              getFieldDecorator('column', {
                rules: [{
                  required: true,
                  message: '栏目不能为空',
                }],
                initialValue: article.column_id || (columns[0] ? columns[0].id : '')
              })(
                <Select>
                  {
                    columns.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        { item.title }
                      </Select.Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="转载" { ...formItemLayout }>
            {
              getFieldDecorator('reprint', {
                initialValue: article.reprint
              })(
              <Checkbox
                onChange={this.handleReprintChange}
                checked={reprint}
              >
                是否转载
              </Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item label="内容来源" { ...formItemLayout } style={ reprint ? {} : { display: 'none' }}>
            { 
              getFieldDecorator('source', {
                rules: [{
                  required: reprint,
                  message: '内容来源不能为空',
                }],
                initialValue: article.source
              })(
                <Input
                  placehholder="内容来源"
                  autoComplete="off"
                />
              )
            }
          </Form.Item>
          <Form.Item {...formItemLayout} label="内容">
            {
              getFieldDecorator('content', {
                rules: [{
                  validator: this.validateEditorFrom, // 使用自定义的校验规则
                }],
                initialValue: article.content,
              })(<div ref={(node) => this.editorNode = node} />)
            }
          </Form.Item>
          <Row type="flex" justify="space-around">
            <Button
              htmlType="submit"
              type="primary"
            >
              提交
            </Button>
            <Button
              type="danger"
              onClick={this.handleReset}
            >
              重置
            </Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(ArticleAdd);
