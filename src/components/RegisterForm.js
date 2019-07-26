import React from 'react';
import {
    Form, Icon, Input, Button
} from 'antd';
import { Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { connect} from 'react-redux';
import { ntwrk_err, succ_register } from './shared/messages';

class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password1: '',
            password2: '',
            email: '',
            loading: false
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading : true});

        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.props.onAuth(this.state.username,this.state.email, this.state.password1, this.state.password2).then(() => {
                this.setState({loading : false}); // Added on top to prevent componentWillUnmount errors

                if(this.props.error === null || this.props.error === undefined){
                    succ_register();
                    this.props.history.push('/', {
                        selection: "home"
                    });
                }else{
                    if(this.props.error.response === undefined){
                        this.props.form.setFields({
                            "username": {
                                value: "",
                                errors: [new Error("")],
                            },
                            "email":{
                                value: "",
                                errors: [new Error("")],
                            },
                            "password": {
                                value: "",
                                errors: [new Error("")],
                            },
                            "confirm": {
                                value: "",
                                errors: [new Error("Network Error")],
                            }
                        });

                        ntwrk_err();
                    }
                    else{
                        console.log(this.props);
                        this.props.form.setFields({
                            "username": {
                                value: this.props.form.getFieldValue("username"),
                                errors: (this.props.error.response.data.username ? [new Error(this.props.error.response.data.username)] : null),
                            },
                            "email":{
                                value: this.props.form.getFieldValue("email"),
                                errors: (this.props.error.response.data.email ? [new Error(this.props.error.response.data.email)] : null),
                            },
                            "password": {
                                value: "",
                                errors: [new Error(this.props.error.response.data.password1)],
                            },
                            "confirm": {
                                value: "",
                                errors: [new Error('')],
                            }
                        }); 
                }
                }
            });
        }else
            this.setState({loading : false});
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password'))
          callback('Two passwords that you enter is inconsistent!');
        else
          callback();
    }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty)
          form.validateFields(['confirm'], { force: true });
        callback();
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        if(this.props.isAuthenticated)
            return (<Redirect to="/" />)
        else
            return (
                <div id="flex-container">

                    <h3 className="logo"><span className="logo-gold">R</span>egister</h3>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label={("Username")}>
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                        whitespace: true 
                                    }],
                            })(
                                <Input name="username" onChange={this.handleChange} prefix={<Icon type="user"/>}/>
                            )}
                        </Form.Item>

                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    }, 
                                    {
                                        required: true, message: 'Please input your E-mail!',
                                    }]
                            })(
                                <Input name="email"  onChange={this.handleChange} prefix={<Icon type="mail"/>}/>
                            )}
                        </Form.Item>

                        <Form.Item label="Password">
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    }]
                            })(
                                <Input name="password1" type="password" onChange={this.handleChange} prefix={<Icon type="lock"/>}/>
                            )}
                        </Form.Item>

                        <Form.Item label="Confirm Password">
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    }]
                            })(
                                <Input name="password2" type="password" onBlur={this.handleConfirmBlur} onChange={this.handleChange} prefix={<Icon type="lock"/>}/>
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="register-form-button">Register</Button>
                        </Form.Item>
                    </Form>

                    {this.state.loading &&
                        <div><Icon id="loading-spinner" type="loading" spin /></div>
                    }
                </div>
            );
    }
}

const WrappedRegistration = Form.create()(RegisterForm)

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username,email,password1,password2) => dispatch(actions.authSignup(username,email,password1,password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistration);