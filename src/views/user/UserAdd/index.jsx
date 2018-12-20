import React from 'react';
import axios from 'axios';
import md5 from 'md5';
import { Form, Input, Button, message, Row, Col, Radio } from 'antd';
import './index.less';

class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        message.loading('注册中...');
        const data = { ...values };
        data.password = md5(data.password);
        axios({
          method: 'post',
          url: 'http://localhost:9090/bs/user/register.json',
          data,
        }).then(({data}) => {
          message.destroy();
          if (data.flag === 1) {
            message.success('注册成功');
            form.resetFields();
          } else {
            message.error(data.msg || '请检查网络');
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="user-add">
        <Form onSubmit={this.handleSubmit}>
          <Row className="user-add-row">
            <Col span={4}>用户名</Col>
            <Col span={10} offset={1}>
              {
                getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '用户名不能为空',
                  }],
                  initialValue: ''
                })(
                  <Input autoComplete="off" placeholder="请输入用户名" />
                )
              }
            </Col>
            <Col span={8} offset={1}>
                {
                  getFieldDecorator('sex', {
                    initialValue: 1
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={1}>男</Radio.Button>
                      <Radio.Button value={2}>女</Radio.Button>
                    </Radio.Group>
                  )
                }
            </Col>
          </Row>
          <Row className="user-add-row">
            <Col span={4}>昵称</Col>
            <Col span={10} offset={1}>
              {
                getFieldDecorator('nickname', {
                  rules: [{
                    required: true,
                    message: '昵称不能为空',
                  }],
                  initialValue: ''
                })(
                  <Input autoComplete="off" placeholder="请输入昵称" />
                )
              }
            </Col>
          </Row>
          <Row className="user-add-row">
            <Col span={4}>密码</Col>
            <Col span={10} offset={1}>
              {
                getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    message: '密码不能为空',
                  }],
                  initialValue: ''
                })(
                  <Input type="password" autoComplete="off" placeholder="请输入密码" />
                )
              }
            </Col>
          </Row>
          <Button htmlType="submit" type="primary">提交</Button>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserAdd);
