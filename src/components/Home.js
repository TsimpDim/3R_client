import React, { Component } from 'react'
import { Button } from 'antd'
import { Redirect } from 'react-router-dom'
import './styles/Home.scss'
import ResAddModal from './ResAddModal'
import ResourceList from './ResourceList';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resAddModalVisible: false,
            toRefresh: false
        }

        this.toggleModalVisible = this.toggleModalVisible.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    refreshData(ref) {
        if(ref)
            this.setState({toRefresh:ref});
        else
            return this.state.toRefresh;
    }   



    toggleModalVisible() {
        this.setState(state => ({
            resAddModalVisible: !state.resAddModalVisible
        }));
    }

    render() {
        if(!this.props.isAuthenticated)
            return(
                <Redirect to={{
                    pathname:"/login",
                    state:"redir"
                }}/>
            )
        else
            return (
                <div style={{display:"flex column", padding:"2em"}}>
                    {this.props.isAuthenticated}
                    <div className="flex-row">
                        <Button
                            size="large"
                            icon="plus-circle"
                            type="primary"
                            onClick={() => this.setState({resAddModalVisible:true})}
                        >
                            Add Resource
                        </Button>

                        <ResAddModal
                        visible={this.state.resAddModalVisible}
                        toggleVisible={this.toggleModalVisible}
                        refreshData={this.refreshData}
                        />

                        <ResourceList refreshData={this.refreshData}/>
                    </div>
                </div>
            )
    }
}
