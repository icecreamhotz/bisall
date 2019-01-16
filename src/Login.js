import React from 'react'
import axios from 'axios'
import { Layout, Menu, Breadcrumb, Form, Icon, Input, Button } from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const FormItem = Form.Item;

class Login extends React.Component {

    state = { emp_code: '', emp_password: '', error: false}

    componentDidMount() {
        if(localStorage.getItem('token')) {
            this.props.history.push('/home')
        }
    }

    onChangeText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://l3est.cis-training.com/bisall/api/auth/login', {
            emp_code: this.state.emp_code,
            emp_password: this.state.emp_password
        })
        .then((result) => {
            if(result.data.error) {
                this.setState({
                    error: true
                })
            } else {
                localStorage.setItem('token', result.data.token)
                localStorage.setItem('checkpos', window.btoa(result.data.info.pos_id))
                this.props.history.push('/home')
            }
        })
    }

    render() {
        return(
            <div>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['3']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/employee">รายชื่อ</Link></Menu.Item>
                    <Menu.Item key="2">อื่นๆ</Menu.Item>
                    <Menu.Item key="3"><Link to="/login">เข้าสู่ระบบ</Link></Menu.Item>
                </Menu>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <p>กรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem>
                            <Input name="emp_code" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="รหัสสตาฟ" value={this.state.emp_code} onChange={this.onChangeText}/>
                        </FormItem>
                        <FormItem>
                            <Input name="emp_password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="รหัสผ่าน" value={this.state.emp_password} onChange={this.onChangeText}/>
                        </FormItem>
                        <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            เข้าสู่ระบบ
                        </Button>
                        </FormItem>
                    </Form>
                    {(this.state.error ? <p style={{color:'red'}}>รหัสสตาฟหรือรหัสผ่านผิด !</p> : '')}
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    BIS All Dummy Company ©2018 Created by BISALLSERVICES
                </Footer>
            </Layout>
            </div>
        )
    }
}

export default withRouter(Login)