import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import './styles/_shared.scss'
import { Icon, Form, Modal, Input, Tooltip, Button } from 'antd'
import axios from 'axios'

class EditResourceModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            confirmLoading: false,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    updateFormFields = () => {
        this.props.form.setFields({
            "title":{value:this.props.data.title},
            "url":{value:this.props.data.url},
            "notes":{value:this.props.data.notes},
            "tags":{value:this.props.data.tags}
        });
    }

    componentDidMount(){
        this.props.form.validateFields();
    }

    componentWillMount(){
        this.updateFormFields();
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            this.updateFormFields();
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    updateResource = () => {
        this.setState({ loading: true });
        let id = this.props.data.id;
        let title = this.props.form.getFieldValue('title');
        let url = this.props.form.getFieldValue('url');
        let note = this.props.form.getFieldValue('note');
        let tags = this.props.form.getFieldValue('tags');

        axios.patch("http://localhost:8000/api/resources/" + id + "/",
        {
            title: title,
            url: url,
            note: (!note ? undefined : note),
            tags:(tags ? tags.split(',') : undefined),
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({ confirmLoading:false });
            this.props.toggleVisible(); 

            // Refresh has to be triggered in here after promise is completed
            // so that the update has finished first
            this.props.triggerRefresh();
        })
        .catch(err => console.log(err));
    }


    handleOkResMod = () => {
        this.setState({
            confirmLoading:true
        });
        
        this.props.form.validateFields(err => {
            if(err){
                this.setState({ confirmLoading:false });
            }
            else{
                this.updateResource();
            }
        });
    };

    
    handleCancelResMod = () => {
        this.props.toggleVisible();
        this.setState({ confirmLoading:false });
    }


    render () {
        const { getFieldDecorator } = this.props.form;
        return (
    
            <Modal
                title="Edit Resource"
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
                    <Button key="add" type="primary" loading={this.state.confirmLoading} onClick={this.handleOkResMod}>
                        Update
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

const ResEditForm = Form.create()(EditResourceModal)
export default ResEditForm;