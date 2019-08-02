import React, { Component } from 'react'
import { Button } from 'antd'
import { Redirect } from 'react-router-dom'
import './styles/Home.scss'
import ResAddModal from './ResAddModal'
import ResourceList from './ResourceList'
import SearchBar from './SearchBar'
import axios from 'axios'

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resAddModalVisible: false,
            textFilter: "",
            tagsFilter: [],
            resources: [],
            absoluteTag: false
        }

        this.toggleModalVisible = this.toggleModalVisible.bind(this);
        this.getResources = this.getResources.bind(this);
    }

    getResources = (callback) => {

        axios.get("http://localhost:8000/api/resources/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({ resources:res.data });
            callback();
        })
        .catch(err => {
            console.log(err);
            callback();
        });
    }

    getTags = () => {
        
        const res = this.state.resources;
        
        if(res){
            // Capture all tags in an array
            let tagArray = [res.map(i => i.tags)];

            // Flatten it
            tagArray = tagArray.flat(2);

            // Remove duplicates and return
            return [...new Set(tagArray)];

        }else
            return null;
    }

    setAbsoluteTagSearch = (setValue) => {
        this.setState({ absoluteTag: setValue });
    }

    setResources = (setValue) => {
        this.setState({ resources: setValue });
    }

    setTextFilter = (textFilter) => {
        this.setState({ textFilter: textFilter });
    }

    setTagsFilter = (tagsFilter) => {
        this.setState({ tagsFilter: tagsFilter });
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
                    <div id="top-row">
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
                        getTags={this.getTags}
                        setAbsolute={this.setAbsoluteTagSearch}
                        />
                    </div>

                    <ResAddModal
                    visible={this.state.resAddModalVisible}
                    toggleVisible={this.toggleModalVisible}
                    triggerRefresh={this.getResources}
                    />

                    <ResourceList
                    resources={this.state.resources}
                    refresh={this.state.refresh}
                    triggerRefresh={this.getResources}
                    textFilter={this.state.textFilter}
                    tagsFilter={this.state.tagsFilter}
                    setResources={this.setResources}
                    absoluteTag={this.state.absoluteTag}
                    />
                </div>
            )
    }
}
