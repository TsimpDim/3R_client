import React, { Component } from 'react'
import { Button } from 'antd'
import { Redirect } from 'react-router-dom'
import './styles/Home.scss'
import ResAddModal from './ResAddModal'
import ResourceList from './ResourceList'
import SearchBar from './SearchBar'

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resAddModalVisible: false,
            refresh: false,
            textFilter: "",
            tagsFilter: [],
        }

        this.toggleModalVisible = this.toggleModalVisible.bind(this);
        this.triggerRefresh = this.triggerRefresh.bind(this);
    }

    triggerRefresh() {
        this.setState({ refresh: !this.state.refresh });
    }

    setTextFilter = (textFilter) => {
        this.setState({ textFilter: textFilter });
    }

    setTagsFilter = (tagsFilter) => {
        this.setState({ tagsFilter: tagsFilter.split(',') }, () => console.log(this.state.tagsFilter));
    }

    toggleModalVisible() {
        this.setState({ resAddModalVisible: !this.state.resAddModalVisible });
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
                <div style={{display:"flex-column", padding:"2em"}}>
                    <div style={{display:"flex-row"}}>
                        <Button
                            size="large"
                            icon="plus-circle"
                            type="primary"
                            onClick={() => this.setState({resAddModalVisible:true})}
                        >
                            Add Resource
                        </Button>

                        <SearchBar
                        setTextFilter={this.setTextFilter}
                        setTagsFilter={this.setTagsFilter}
                        triggerRefresh={this.triggerRefresh}
                        />
                    </div>

                    <ResAddModal
                    visible={this.state.resAddModalVisible}
                    toggleVisible={this.toggleModalVisible}
                    refresh={this.state.refresh}
                    triggerRefresh={this.triggerRefresh}
                    />

                    <ResourceList
                    refresh={this.state.refresh}
                    triggerRefresh={this.triggerRefresh}
                    textFilter={this.state.textFilter}
                    tagsFilter={this.state.tagsFilter}
                    />
                </div>
            )
    }
}
