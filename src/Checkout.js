import React, { Component } from 'react'
import moment from 'moment'
import { Layout, Menu, Breadcrumb, Form, Icon, Input, Button, Row, Col, Modal } from 'antd';
import Headers from './Header.js'
import axios from 'axios'
import { withRouter, Link } from "react-router-dom";

const { Content, Footer } = Layout
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class Checkout extends Component {

    state = { details: '', avatar: [], imgname: [] }

    onChangeText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    imgChange = (e) => {

        if(this.state.imgname.length >= 2) {
            alert('จำกัดแค่ 2 รูป')
            return
        }

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onload = (e) => {
            let r = btoa(Math.random() * 15)
            this.setState({
                avatar: [...this.state.avatar, e.target.result],
                imgname: [...this.state.imgname, r]
            })
        };

        reader.readAsDataURL(file)
    }

    removeImg = (index) => {
        let arrAvatar = [...this.state.avatar]
        let arrImg = [...this.state.imgname]

        arrAvatar.splice(index, 1)
        arrImg.splice(index, 1)
        this.setState({
            avatar: arrAvatar,
            imgname: arrImg
        })
    }

    saveData = async () => {
        console.log(JSON.stringify(this.state.imgname))
        await axios.post(`http://l3est.cis-training.com/bisall/api/checkout?token=${localStorage.getItem('token')}`, {
            datenow: moment().format('YYYY-MM-DD'),
            time_out: moment().format('HH:mm:ss'),
            avatar: this.state.avatar,
            out_details: this.state.details,
            imgname: JSON.stringify(this.state.imgname)
        })
        .then((result) => {
            this.success()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    success = () => {
        Modal.success({
            title: 'สำเร็จ',
            content: 'บันทึกข้อมูลเรียบร้อยแล้ว!',
        });
    }

    render() {
        if(window.atob(localStorage.getItem('checkpos')) != 11) {
            this.props.history.push('/home')
        }
        return(
            <div>
                <Layout>
                    <Headers/>
                    <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0'}}>
                        <p>ตอนนี้เวลา : {moment().format('HH.mm.ss')}</p>
                        <Form className="login-form">
                        <p>รายละเอียด (ไม่มีไม่ต้องใส่ก็ได้ครับ)</p>
                        <FormItem>
                            <TextArea rows={4} name="details" placeholder="ข้อมูล" value={this.state.details} onChange={this.onChangeText}/>
                        </FormItem>
                        <div class="input-file-container">  
                            <input class="input-file" type="file" onChange={(e) => this.imgChange(e)}/>
                            <label tabindex="0" for="my-file" class="input-file-trigger">เลือกรูปภาพ (สูงสุดได้ 2 รูป)</label>
                        </div>
                        { this.state.avatar.map((item, index) => {
                            return <Row style={{padding: '25px 0', textAlign: 'left'}}>
                            <div class="image-area">
                                <img src={item} style={{display:'block'}}/>
                                <a class="remove-image" style={{display:'inline'}} onClick={(index) => this.removeImg(index)}>&#215;</a>
                            </div>
                            </Row>
                        })}
                        <Row style={{padding: '25px 0', textAlign: 'center'}}>
                            <Col><Button onClick={() => this.saveData()}>
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

export default withRouter(Checkout)