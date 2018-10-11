import React from 'react';
import { Form, Input, Upload, Button, Radio, Icon, message } from 'antd';
import './index.less';

const ItemLayout =  {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 , offset: 1},
};
const MaxSize = 2 * 1024 * 2024;
class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleUploadChange = this.handleUploadChange.bind(this);
    this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleUploadChange({fileList}) {
    console.log(fileList);
  }

  handleBeforeUpload(file) {
    if (file.size > MaxSize) {
      message.error('上传图片不能大于2M');
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        const base64 = e.target.result;
        console.log(base64);
      }
    }
    return false;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { fileList } = this.state;
    return (
      <div className="user-add">
        <Form onSubmit={this.handleSubmit} mode="horizontal">
          <Form.Item label="用户名" {...ItemLayout}>
            {
              getFieldDecorator('username', {
                rules: [{
                  required: true,
                }],
                initialValue: ''
              })(
                <Input autoComplete="off" />
              )
            }
          </Form.Item>
          <Form.Item label="昵称" {...ItemLayout}>
            {
              getFieldDecorator('username', {
                rules: [{
                  required: true,
                }],
                initialValue: ''
              })(
                <Input autoComplete="off" />
              )
            }
          </Form.Item>
          <Form.Item label="头像" {...ItemLayout}>
            {
              getFieldDecorator('portrait', {
                rules: [{
                  required: true,
                }],
                initialValue: ''
              })(
                <Input type="hidden" />
              )
            }
            <Upload
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={this.handleBeforeUpload}
              onChange={this.handleUploadChange}
              fileList={fileList}
            >
              <Button className="portrait-button">
                {

                }
                <div className="portrait-inner">
                  <Icon type="upload" />
                  上传头像
                </div>
              </Button>
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type="primary">提交</Button>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserAdd);
