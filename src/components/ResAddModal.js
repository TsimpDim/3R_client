import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import { Icon, Form, Modal, Input, Tooltip } from 'antd'
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';

class ResAddModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            confirmLoading: false,
        };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    showResAddMod = () => {
        this.setState({ visible:true });
    }

    handleOkResMod = () => {
        this.setState({
            confirmLoading:true
        });
        this.props.form.validateFields(err => {
            if(err)
                this.setState({ confirmLoading:false });
        });
    }
    
    handleCancelResMod = () => {
        this.props.toggleVisible();
        this.setState({
            confirmLoading:false,
        });
    }


    render () {
        const { getFieldDecorator } = this.props.form;
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
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "*Field is required.",
                            },{
                                max: 120,
                                message: "*Title exceeds character limit."
                            },{
                                pattern: "^[A-Za-z0-9_ \u0370-\u03ff\u1f00-\u1fff]*$",
                                message: "*Title contains invalid characters."
                            }],
                        })(
                            <Input 
                            name="title"
                            prefix={<Icon type="info" onChange={this.handleChange}/>}
                            placeholder="Title"
                            suffix={
                                <Tooltip title="Allowed: English, Greek, underscore(_) and space">
                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('link', {
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "*Field is required. ",
                            },{
                                pattern: "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})",
                                message: "*URL is in improper form."
                            },{
                                max: 200,
                                message: "*URL exceeds character limit."
                            }],
                        })(<Input name="link" prefix={<Icon type="link" onChange={this.handleChange}/>} placeholder="Url"/>)}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('note', {
                            rules:[{
                                max: 300,
                                message: "*Note exceeds character limit."
                            }]
                        })(<TextArea name="note" prefix={<Icon type="snippets" onChange={this.handleChange}/>} placeholder="Note"/>)}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('tags', {
                            rules:[{
                                pattern: "^[a-zA-Z\u0370-\u03ff\u1f00-\u1fff,_]*$",
                                message: "*Tags are in improper form - read the tip."
                            },{
                                pattern: "^[A-Za-z0-9_ \u0370-\u03ff\u1f00-\u1fff]*$",
                                message: "*Tags contain invalid characters."
                            },{
                                max: 60,
                                message: "*Tags exceed character limit."
                            }]
                        })(
                            <Input
                            name="tags"
                            prefix={<Icon type="tag" onChange={this.handleChange}/>}
                            placeholder="Tags"
                            suffix={
                                <Tooltip title="Allowed: English, Greek and underscore(_). Separate with commas(,)">
                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            />
                        )}
                    </Form.Item>                                                              
                </Form>
            </Modal>
        );
    }
}

const ResAddForm = Form.create()(ResAddModal)

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

export default connect(mapStateToProps, mapDispatchToProps)(ResAddForm);