import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { Layout, Row, Col, Modal, Button, Divider, Card, Collapse } from 'antd';
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Headers from './Header.js'
import Person from './Person.js'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import axios from 'axios'
import { withRouter } from "react-router-dom";
import 'moment/locale/th';

const { Content, Footer } = Layout
const Panel = Collapse.Panel;

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
const DragAndDropCalendar = withDragAndDrop(BigCalendar, {backend: false})

class ManageTimes extends Component {

    state = {
        person: [],
        events: [],
        visible: false,
        visibleWork: false,
        confirmLoading: false,
        confirmLoadingWork: false,
        eventDeleteData: null,
        checkinList: [],
        workid: ''
    };

    async componentDidMount() {
        moment.locale('th')
        await axios.get('http://l3est.cis-training.com/bisall/api/employees/sellers/all')
        .then((result) => {
            this.setState({
                person: result.data
            })
        })
        await axios.get('http://l3est.cis-training.com/bisall/api/worktimes')
        .then((result) => {
            this.setState({
                events: result.data
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
        await axios.get('http://l3est.cis-training.com/bisall/api/confirmcheckin')
        .then((result) => {
            this.setState({
                checkinList: result.data
            })
        })
    }

    onEventDrop = async ({ event, start, end, allDay }) => {
        if(!event.hasOwnProperty('start')) {
            const newValue = {
                start: start,
                end: end,
                title: event.title + ' ' + event.emp_name + ' ' + event.emp_lastname
            }
            await axios.post(`http://l3est.cis-training.com/bisall/api/worktimes?token=${localStorage.getItem('token')}`, {
                emp_code: event.title,
                work_startdate: moment(start).format('YYYY-MM-DD'),
                work_enddate: moment(end).format('YYYY-MM-DD')
            })
            .then((result) => {
                this.setState({
                    events: [...this.state.events, newValue]
                })
            })
        } else {
            const { events } = this.state

            console.log(event)

            const startdate = new Date(start)
            startdate.setHours(8)
            startdate.setMinutes(0)
            startdate.setSeconds(0)
            start = startdate

            const enddate = new Date(end)
            enddate.setHours(16)
            enddate.setMinutes(0)
            enddate.setSeconds(0)
            end = enddate

            const idx = events.indexOf(event)
            const updatedEvent = { ...event, start, end}

            const nextEvents = [...events]
            nextEvents.splice(idx, 1, updatedEvent)

            await axios.post(`http://l3est.cis-training.com/bisall/api/worktimes/edit/${event.id}?token=${localStorage.getItem('token')}`, {
                work_startdate: moment(start).format('YYYY-MM-DD'),
                work_enddate: moment(end).format('YYYY-MM-DD')
            })
            .then((result) => {
                this.setState({
                    events: nextEvents
                })
            })
        }
    };

    onSelectEvent = async (event) => {
        this.setState({
            visible: true,
            eventDeleteData: event
        });

    }

    handleOk = async () => {
        const e = this.state.eventDeleteData
        
        this.setState({
            confirmLoading: true,
        });
        await axios.post(`http://l3est.cis-training.com/bisall/api/worktimes/${e.id}`)
        .then((result) => {
            this.setState((prevState, props) => {
                const events = [...prevState.events]
                const idx = events.indexOf(e)
                events.splice(idx, 1)
                return { events }
            })
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        })
    }

    handleCancel = () => {
        this.setState({
        visible: false,
        });
    }

    handleOkWork = async () => {
        
        this.setState({
            confirmLoadingWork: true,
        });
        await axios.post(`http://l3est.cis-training.com/bisall/api/worktimes/savecheckin/${this.state.workid}`)
        .then((result) => {
            this.setState({
                checkinList: result.data,
                visibleWork: false,
                confirmLoadingWork: false,
            });
        })
    }

    handleCancelWork = () => {
        this.setState({
        visibleWork: false,
        });
    }

    render() {
        const { visible, confirmLoading, visibleWork, confirmLoadingWork, ModalText } = this.state;
        if(window.atob(localStorage.getItem('checkpos')) == 11) {
            this.props.history.push('/home')
        }
        return(
            <div>
                <Layout>
                    <Headers/>
                    <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0'}}>
                    <Row>
                        <Col lg={6}>    
                            <p>รหัสพนักงาน <b>(ลากชื่อลงในกรอบสี่เหลี่ยมเพื่อมอบหมายงาน หากต้องการลบให้คลิกที่กรอบสีน้ำเงิน)</b></p>                    
                            {
                                this.state.person.map(item => {
                                    return <Person event={item}/>
                                })
                            }
                        </Col>
                        <Col lg={18}>
                            <DragAndDropCalendar
                                popup
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={this.state.events}
                                style={{ height: "100vh" }}
                                onEventDrop={this.onEventDrop}
                                onSelectEvent= {event => this.onSelectEvent(event)}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: 30}}>
                        <p style={{fontWeight: 'bold'}}>อนุมัติการเช็คอินเข้าทำงาน</p>
                        <Divider />
                        {
                            (this.state.checkinList.length >=1 ) ?
                            this.state.checkinList.map((item) => {
                                return <div>
                                    <Card
                                        type="inner"
                                        title={`วัน${moment(item.work_startdate).format('dddd DD MMMM YYYY')}`}
                                        extra={<a onClick={() => {this.setState({workid: item.work_id, visibleWork: true})}}>อนุมัติ</a>}
                                        >
                                        <p>รหัสพนักงาน : {item.empc_code}</p>
                                        <p>รหัสนักศึกษา : {item.empc_scode}</p>
                                        <p>ชื่อ-นามสกุล : {`${item.empc_name} ${item.empc_lastname}`}</p>
                                        <p>เวลาเข้างาน : <b>{`${item.time_in}`}</b></p> 
                                        <p>เวลาออกงาน : <b>{(item.time_out != null ? item.time_out : 'ยังไม่มีเวลาออกงาน')}</b></p>
                                        <p style={{fontWeight: 'bold', color: '#1890ff'}}>มอบหมายงานโดย : 
                                        {`${item.empa_code} ${item.empa_name} ${item.empa_lastname}`}</p>
                                    </Card>
                                    <Collapse accordion>
                                        <Panel header="รายละเอียด" key="1">
                                            {(item.work_img != null ? JSON.parse(item.work_img).map((img) => { 
                                                            return <img src={`http://l3est.cis-training.com/bisall/api/workimage/${img}`} alt={img} style={{marginRight: 20}}/> 
                                                        })
                                                            :
                                                            <p>ไม่มีรูปภาพ</p>
                                                        )
                                            }
                                            <p>หมายเหตุการเช็คอินเข้าทำงาน : {(item.in_details != '' ? item.in_details : 'ไม่มี')}</p>
                                            <p>หมายเหตุการเช็คเอาท์เข้าทำงาน : {(item.out_details != '' ? item.out_details : 'ไม่มี')}</p>
                                        </Panel>
                                    </Collapse>
                                </div>
                            })
                            :
                            <p>ยังไม่มีรายการให้อนุมัติ</p>
                        }

                    </Row>
                    </div>
                    </Content>
                    <Modal 
                        title="แจ้งเตือน"
                        visible={visible}
                        onOk={this.handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        >
                        <p>คุณต้องการลบหรือไม่ ?</p>
                    </Modal>
                    <Modal 
                        title="แจ้งเตือน"
                        visible={visibleWork}
                        onOk={this.handleOkWork}
                        confirmLoading={confirmLoadingWork}
                        onCancel={this.handleCancelWork}
                        >
                        <p>คุณต้องการอนุมัติหรือไม่ ?</p>
                    </Modal>
                    <Footer style={{ textAlign: 'center' }}>
                        BIS All Dummy Company ©2018 Created by BISALLSERVICES
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(withRouter(ManageTimes))