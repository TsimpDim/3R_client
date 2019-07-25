import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import { Icon, Form, Modal, Input, Tooltip, Button } from 'antd'
import * as actions from '../store/actions/resources'
import { connect } from 'react-redux'
import { succ_res_add } from './shared/messages'

class ResAddModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            confirmLoading: false,
            title: '',
            url: '',
            note: '',
            tags: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    showResAddMod = () => {
        this.setState({ visible:true });
    }

    // Returns true if resource was added or false otherwise.
    // That way "addNext" knows whether to clear the fields or not
    handleOkResMod = (addNext) => {
        this.setState({
            confirmLoading:true
        });
        
        this.props.form.validateFields(err => {
            if(err){
                this.setState({ confirmLoading:false });
            }
            else{
                this.props.addResource(this.state.title, this.state.url, this.state.note, this.state.tags).then(res => {
               
                    // Stop showing the loading icon
                    this.setState({
                        confirmLoading:false
                    });

                    // Notify components to refresh the list
                    this.props.refreshData(true);

                    // Flash success message
                    succ_res_add();

                    // If addNext is not true that means that
                    // we want to close the dialog.
                    // We don't use 'if(!addNext)' to avoid unecessary
                    // complexity for the null/undefined values.
                    if(addNext !== true)
                        this.props.toggleVisible();
                    
                    // We always want to reset the fields since
                    // otherwise when we re-opened the form we would
                    // see the previous values
                    this.props.form.resetFields();
                });

            }
        });
    };

    handleAddNext = () => {
        this.handleOkResMod(true);
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
                footer={[
                    <Button key="return" onClick={this.handleCancel}>
                        Return
                    </Button>
                    ,
                    <Button key="add-next" loading={this.state.confirmLoading} onClick={this.handleAddNext}>
                        Add Next
                    </Button>
                    ,
                    <Button key="add" type="primary" loading={this.state.confirmLoading} onClick={this.handleOkResMod}>
                        Add
                    </Button>
                ]}
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
                            prefix={<Icon type="info" />}
                            onChange={this.handleChange}
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
                        {getFieldDecorator('url', {
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "*Field is required. ",
                            },{
                                pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
                                message: "*URL is in improper form."
                            },{
                                max: 200,
                                message: "*URL exceeds character limit."
                            }],
                        })(<Input name="url" prefix={<Icon type="link" />} onChange={this.handleChange} placeholder="Url"/>)}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('note', {
                            rules:[{
                                max: 300,
                                message: "*Note exceeds character limit."
                            }]
                        })(<TextArea name="note" prefix={<Icon type="snippets" />} onChange={this.handleChange} placeholder="Note"/>)}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('tags', {
                            rules:[{
                                pattern: "^[a-zA-Z\u0370-\u03ff\u1f00-\u1fff,_]*$",
                                message: "*Tags are in improper form - read the tip."
                            },{
                                max: 60,
                                message: "*Tags exceed character limit."
                            }]
                        })(
                            <Input
                            name="tags"
                            prefix={<Icon type="tag" />}
                            onChange={this.handleChange}
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
        addResource: (title, url, note, tags) => dispatch(actions.addRes(title, url, note, tags))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResAddForm);