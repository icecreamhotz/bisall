import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import Headers from './Header.js'
import { Layout, Row, Col, Card, Button, Alert, DatePicker, Collapse } from 'antd';

const { RangePicker } = DatePicker;
const { Content, Footer } = Layout;
const Panel = Collapse.Panel;

class MoreWorktimes extends Component {

    state = {
        checkinList: [],
        checkoutList: [],
        show: false,
        start: '',
        end: ''
    };

    async componentDidMount() {
        moment.locale('th')
    }

    onCalendarChange = (date, dateString) => {
        this.setState({
            start: dateString[0],
            end: dateString[1]
        })
    }
    
    searchdata = async () => {
        console.log(this.state.start)
        console.log(this.state.end)
        await axios.post('http://l3est.cis-training.com/bisall/api/search/checkin', {
            start: this.state.start,
            end: this.state.end
        })
        .then((result) => {
            this.setState({
                show: true,
                checkoutList: result.data
            })
            console.log(result)
        })
        await axios.post('http://l3est.cis-training.com/bisall/api/search/checkout', {
            start: this.state.start,
            end: this.state.end
        })
        .then((result) => {
             this.setState({
                checkinList: result.data
             })
            console.log(result)
        })
    }

    render() {
        return(
            <div>
            <Layout>
                <Headers />
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0', textAlign: 'center'}}>
                    ค้นหาตามช่วงเวลา : <RangePicker onChange={this.onCalendarChange} />
                    <Button onClick={() => {this.searchdata()}} style={{marginLeft: 15}}>
                        ค้นหา
                    </Button>
                    <Row style={{textAlign: 'left', marginTop: '30px', display: (this.state.show ? 'initial' : 'none')}}>
                        <Collapse accordion>
                            <Panel header="รายการที่อนุมัติแล้ว" key="1">
                                {
                                    (this.state.checkoutList.length >=1 ) ?
                                        this.state.checkoutList.map((item) => {
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
                                        <p>ยังไม่มีรายการที่อนุมัติ</p>
                                }
                            </Panel>
                            <Panel header="รายการที่ยังไม่ได้อนุมัติ" key="2">
                                {
                                    (this.state.checkinList.length >=1 ) ?
                                        this.state.checkinList.map((item) => {
                                            return <div>
                                                <Card
                                                    type="inner"
                                                    title={`วัน${moment(item.work_startdate).format('dddd DD MMMM YYYY')}`}
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
                                        <p>ยังไม่มีรายการที่อนุมัติ</p>
                                }
                            </Panel>
                        </Collapse>
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

export default MoreWorktimes