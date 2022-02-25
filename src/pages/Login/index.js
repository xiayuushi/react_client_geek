import { Card, Form, Input, Button, Checkbox } from 'antd'

import logo from '@/assets/logo.png'
import styles from './index.module.scss'

import { useDispatch } from 'react-redux'
import { login } from '@/store/actions/login'
import { message } from 'antd'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await dispatch(login(values))
      message.success('登录成功', 1, () => history.push('/layout'))
    } catch (error) {
      message.error(error?.response?.data?.message, 1, () => setLoading(false))
      Promise.reject(error)
    }
  }

  return (
    <div className={styles['root']}>
      <Card className="login-container">
        <img src={logo} alt="" />
        <Form
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            mobile: '13911111111',
            code: '246810',
            agree: true,
          }}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号码!',
              },
              {
                pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                message: '手机号码格式不正确!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码!',
              },
              {
                pattern: /^\d{6}$/,
                message: '验证码格式错误!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (rule, value) => {
                  if (!value) {
                    return Promise.reject(new Error('请阅读并同意条款和协议'))
                  }
                  return Promise.resolve(value)
                },
              },
            ]}
          >
            <Checkbox>我已阅读并同意[隐私条款]和[用户协议]</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login

// 01、Form.item的name字段应该与接口文档提供的字段名保持一致
// 02、Form.item会默认获取表单元素（例如input或checkbox）的value属性值（即，默认情况下valuePropName="value"）
// 03、但是获取checkbox的值是由checked属性控制的，而非value属性，因此必须在Form.item上设置设置valuePropName="checked"才能拿到值
// 04、checkbox不应该使用required来做rules效验，因为当勾选一次过后，后续是否勾选，即无论required的值是true或者false它都会往后走，这不符合常理
// 05、checkbox的rules必须使用自定义规则效验，即<Form.item rules={[{validator:(rule,value)=>Promise}]} />
// 06、validateTrigger属性可以给Form或者Form.item或者具体的rules规则对象内部添加，但是给Form添加是作用于各个Form.item的，相当于是统一设置
// 07、使用antd获取表单可以不需要自己去做表单组件的受控或者非受控，可以直接通过给Form绑定onFinish属性设置表单效验通过事件来获取所有表单的value值（事件形参中获取）
// 08、给Form设置initialValues={{name: val}}等同于给每一项Form.item设置initialValue="val"，用于设置表单默认值（正常项目不需要该属性，开发测试阶段使用比较方便查看效果而已）
// 09、需要调用接口获取的数据，如果会在项目多个组件中使用到，可以考虑使用redux，而将接口请求回来的数据房东redux则必须使用redux-thunk中间件让action中支持异步逻辑
// 10、redux中的数据是存储于内存中的一刷新就没了，因此建议配合localStorage做数据持久化（本地缓存与redux协同）
