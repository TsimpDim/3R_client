import React, { Component } from 'react'
import { Icon, Button, Form, Modal, Input } from 'antd';
import { Redirect } from 'react-router-dom'
import './styles/Home.scss'
import TextArea from 'antd/lib/input/TextArea';

export default class Home extends Component {

    state = { 
        visible: false,
        confirmLoading: false,
    };

    showAddResMod = () => {
        this.setState({ visible:true });
    }

    handleOkResMod = () => {
        this.setState({
            confirmLoading:true
        });

        
    }
    
    handleCancelResMod = () => {
        this.setState({
            visible:false,
            confirmLoading:false,
        });
    }

    render() {
        if(!this.props.isAuthenticated)
            return (
                <Redirect push to={{
                        pathname:'/login',
                        state:"redir"
                        }} 
                />
            );
        else
            return (
                <div style={{display:"flex column", padding:"2em"}}>
                    <div className="flex-row">
                        <Button
                            shape="round"
                            size="large"
                            icon="plus-circle"
                            type="primary"
                            style={{backgroundColor: "#52c41a", border:"none"}}
                            onClick={this.showAddResMod}                            
                        >
                            Add Resource
                        </Button>


                        <Modal
                            title="Add Resource"
                            visible={this.state.visible}
                            onOk={this.handleOkResMod}
                            onCancel={this.handleCancelResMod}
                            width={800}
                            confirmLoading={this.state.confirmLoading}
                        >

                            <Form>
                                <Form.Item>
                                    <Input name="title" prefix={<Icon type="info" />} placeholder="Title"/>
                                </Form.Item>
                                <Form.Item>
                                    <Input name="link" prefix={<Icon type="link" />} placeholder="Url"/>
                                </Form.Item>
                                <Form.Item>
                                    <TextArea name="note" prefix={<Icon type="snippets" />} placeholder="Note"/>
                                </Form.Item>
                                <Form.Item>
                                    <Input name="note" prefix={<Icon type="tag" />} placeholder="Tags"/>
                                </Form.Item>                                                              
                            </Form>
                        </Modal>
                    </div>
                </div>
            )
    }
}
