import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import './styles/_shared.scss'
import { Icon, Form, Modal, Input, Tooltip, Button } from 'antd'
import { succ_res_add } from './shared/messages'
import axios from 'axios';

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

    addResource = (addNext) => {
        this.setState({ loading: true });

        let title = this.props.form.getFieldValue('title');
        let url = this.props.form.getFieldValue('url');
        let note = this.props.form.getFieldValue('note');
        let tags = this.props.form.getFieldValue('tags');

        axios.post('http://localhost:8000/api/resources/', {
            title:title,
            url:url,
            note:(note ? note : ""), // Do not send if empty
            tags:(tags ? tags.split(',') : []), // Split into array first (see model)
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
       
            // Stop showing the loading icon
            this.setState({ confirmLoading:false });

            // Notify components to refresh the list
            this.props.triggerRefresh();

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
            
        }).catch(err => {

            this.setState({ confirmLoading:false });

            this.props.form.setFields({
                "tags":{
                    value: this.props.form.getFieldValue("tags"),
                    errors: [new Error("*Tags contain duplicates.")],
                }
            });
        }); 
    }

    // Returns true if resource was added or false otherwise.
    // That way "addNext" knows whether to clear the fields or not
    handleOkResMod = (addNext) => {
        this.setState({
            confirmLoading:true
        });
        
        this.props.form.validateFields(err => {
            if(err)
                this.setState({ confirmLoading:false });
            else
                this.addResource(addNext);
        });
    }

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
                    <Button key="return" onClick={this.handleCancelResMod}>
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
                                pattern: /^[A-Za-z0-9_ \u0370-\u03ff\u1f00-\u1fff]*$/,
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
                                pattern: /^[a-zA-Z\u0370-\u03ff\u1f00-\u1fff,_]*$/,
                                message: "*Tags are in improper form - read the tip."
                            },{
                                max: 60,
                                message: "*Tags exceed character limit."
                            },{
                                pattern: /^\w+(,\w+)*$/,
                                message: "*Empty tags not allowed."
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

export default ResAddForm;