import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { Layout, Row, Col, Modal, Button, Alert } from 'antd';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Headers from './Header.js'
import axios from 'axios'
import { withRouter, Link } from "react-router-dom";

const { Content, Footer } = Layout

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class Schedule extends Component {

    state = { events: [], workNow: [] }

    async componentDidMount() {
        await axios.get(`http://l3est.cis-training.com/bisall/api/worktimes/owner?token=${localStorage.getItem('token')}`)
        .then((result) => {
            const checkWorkNow = result.data.filter(item => item.start === moment().format('YYYY-MM-DD'))
            this.setState({
                events: result.data,
                workNow: checkWorkNow
            }, () => {
                this.state.events.map(item => {
                    const startdate = new Date(item.start)
                    startdate.setHours(8)
                    startdate.setMinutes(0)
                    startdate.setSeconds(0)
                    item.start = startdate
                })
                this.state.events.map(item => {
                    const enddate = new Date(item.end)
                    enddate.setHours(16)
                    enddate.setMinutes(0)
                    enddate.setSeconds(0)
                    item.end = enddate
                })
            })
            
        })
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
                    <Row>
                        <BigCalendar
                            popup
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="month"
                            events={this.state.events}
                            style={{ height: "100vh" }}
                            views={{month:true,agenda:true}}
                        />
                    </Row>
                    <Row style={{ textAlign:'center', padding: 24 }}>
                        {
                            (this.state.workNow.length >= 1)
                            ?
                            <div>
                                <Button type="primary" style={{marginRight: 15}}><Link to="/checkin">เช็คอินเข้าทำงาน</Link></Button>
                                <Button type="danger"><Link to="/checkout">เช็คเวลาออกงาน</Link></Button>
                            </div>
                            :
                            <div>
                            <Alert
                                message="วันนี้ไม่มีเวลาที่จะต้องเข้าทำงาน"
                                description="กลับบ้านดิรอไร"
                                type="warning"
                                showIcon
                                style={{margin:'0 auto', width:'30%'}}
                            />
                            </div>
                        }
                    </Row>
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

export default withRouter(Schedule)