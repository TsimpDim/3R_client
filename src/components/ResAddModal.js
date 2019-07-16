import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import { Icon, Form, Modal, Input } from 'antd'
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';

class ResAddModal extends React.Component {

    state = { 
        confirmLoading: false,
    };

    showResAddMod = () => {
        this.setState({ visible:true });
    }

    handleOkResMod = () => {
        this.setState({
            confirmLoading:true
        });
    }
    
    handleCancelResMod = () => {
        this.props.toggleVisible();
        this.setState({
            confirmLoading:false,
        });
    }


    render () {
        return (
    
            <Modal
                title="Add Resource"
                visible={this.props.visible}
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addRes: (title, url, note, tags) => dispatch(actions.addRes(title, url, note, tags)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResAddModal);