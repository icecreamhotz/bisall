import React from 'react'
import axios from 'axios'
import { Layout, Menu, Breadcrumb, Form, Icon, Input, Button, Row, Col,Modal } from 'antd';
import Headers from './Header.js'
import { withRouter } from "react-router-dom";

const { Content, Footer } = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class Profile extends React.Component {

    state = { emp_name: '', emp_lastname: '', emp_tel: '', emp_address: '', emp_scode: '', emp_passport: '' }

    async componentDidMount() {
       await axios.get(`http://l3est.cis-training.com/bisall/api/auth/employee?token=${localStorage.getItem('token')}`)
       .then((result) => {
           this.setState({
               emp_name: result.data.emp_name,
               emp_lastname: result.data.emp_lastname,
               emp_tel: result.data.emp_tel,
               emp_address: result.data.emp_address,
               emp_scode: result.data.emp_scode,
               emp_passport: result.data.emp_passport
           })
       })
    }

    onChangeText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    success = () => {
        Modal.success({
            title: 'สำเร็จ',
            content: 'บันทึกข้อมูลเรียบร้อยแล้ว!',
        });
    }

    editData = () => {
            axios.post(`http://l3est.cis-training.com/bisall/api/auth/employee?token=${localStorage.getItem('token')}`, {
                    emp_name: this.state.emp_name,
                    emp_lastname: this.state.emp_lastname,
                    emp_tel: this.state.emp_tel,
                    emp_address: this.state.emp_address,     
                    emp_scode: this.state.emp_scode,
                    emp_passport: this.state.emp_passport
                }).then((result) => {
                    this.success()
                    this.setState({
                        emp_name: result.data.emp_name,
                        emp_lastname: result.data.emp_lastname,
                        emp_tel: result.data.emp_tel,
                        emp_address: result.data.emp_address,
                        emp_scode: result.data.emp_scode,
                        emp_passport: result.data.emp_passport
                    })
                })
    }

    render() {
        return(
            <div>
            <Layout>
                <Headers />
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Form className="login-form">
                        <p>รหัสนักศึกษา (ใส่ขีดด้วยนะครับ)</p>
                        <FormItem>
                            <Input name="emp_scode" prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_scode} onChange={this.onChangeText}/>
                        </FormItem>
                        <p>ชื่อจริง</p>
                        <FormItem>
                            <Input name="emp_name" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_name} onChange={this.onChangeText}/>
                        </FormItem>
                        <p>นามสกุลจริง</p>
                        <FormItem>
                            <Input name="emp_lastname" prefix={<Icon type="aliwangwang" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_lastname} onChange={this.onChangeText}/>
                        </FormItem>
                        <p>รหัสบัตรประชาชน</p>
                        <FormItem>
                            <Input name="emp_passport" prefix={<Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_passport} onChange={this.onChangeText}/>
                        </FormItem>
                        <p>เบอร์โทร</p>
                        <FormItem>
                            <Input name="emp_tel"  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_tel} onChange={this.onChangeText}/>
                        </FormItem>
                        <p>ที่อยู่</p>
                        <FormItem>
                            <Input name="emp_address" prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ข้อมูล" value={this.state.emp_address} onChange={this.onChangeText}/>
                        </FormItem>
                        <Row style={{padding: '25px 0', textAlign: 'center'}}>
                            <Col><Button onClick={() => {this.editData()}}>
                                บันทึก
                            </Button></Col>
                        </Row>
                    </Form>
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

export default Profile