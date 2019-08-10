import React from 'react'
import { Card, Icon, Tag, Empty, Popconfirm } from 'antd'
import axios from 'axios'
import Masonry from 'react-masonry-component'
import CopyToClipboard from 'react-copy-to-clipboard'
import { succ_copy, err_get_res, err_make_invis, err_get_options } from './shared/messages'
import EditResourceModal from './EditResourceModal'

const { Meta } = Card;
const masonryOptions = {
    transitionDuration: 0,
    gutter: 70,
};


export default class ResourceList extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            loading: true,
            editDrawerVisible:false,
            drawerData: [],
            options: {}
        }

    }

    toggleDrawerVisible = () => {
        this.setState({ editDrawerVisible: !this.state.editDrawerVisible });
    }

    componentDidMount() {
        this.props.triggerRefresh(() => this.setState({loading:false}));
        this.getOptions();
    }

    getOptions = () => {
        axios.get("http://localhost:8000/api/options/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({ options:res.data })
        })
        .catch(err => {
            err_get_options();
            console.log(err);
        });
    }

    deleteResource = (idx) => {
        this.setState({ loading: true });

        axios.patch("http://localhost:8000/api/resources/"+idx+"/",
        {
            visible:false,
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({loading: false});
            this.props.setResources(this.props.resources.filter(item => item.id !== idx));
        })
        .catch(err => {
            err_make_invis();
            console.log(err);
        });
    };

    getResource = (idx) => {
        axios.get("http://localhost:8000/api/resources/"+idx+"/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({ drawerData:res.data })
        })
        .catch(err => {
            err_get_res();
            console.log(err);
        });
    };

    
    reformatDate = (dateStr) => {
        if(dateStr){
            let dateArr = dateStr.split("-");  // ex input "2010-01-18"
            return dateArr[2]+ "/" +dateArr[1]+ "/" +dateArr[0].substring(2); //ex out: "18/01/10"
        } else
            return "?";
    }

    onEdit = (idx) => {
        this.getResource(idx);
        this.toggleDrawerVisible();
    }

    renderCards = () => {
        if(this.props.resources.length === 0)
            return <Empty
                    description={<span><Icon type="frown"/> No resources yet.<br/>Click the <span style={{color:"#108ee9"}}>blue</span> button on the top left!</span>}
                    style={{marginRight:"auto", marginLeft:"45%"}}
                    />
        else {

            // Text (title) search
            let resourcesArray = this.props.resources;
            if(this.props.textFilter && this.props.textFilter !== "")
                resourcesArray = resourcesArray.filter(item => item.title.toLowerCase().includes(this.props.textFilter.toLowerCase()));
            
            // Tag search
            if(this.props.tagsFilter.length !== 0){
                if(this.props.absoluteTag) {
                    // Get each item of which *every* tag is included in the tagsFilter
                    resourcesArray = resourcesArray.filter(i => i.tags.length !== 0).filter(i => i.tags.every(val => this.props.tagsFilter.includes(val)));
                }else{
                    // Get each item of which *some* of the tags are included in the tagsFilter
                    resourcesArray = resourcesArray.filter(i => i.tags.some(val => this.props.tagsFilter.includes(val)));
                }
            }

            // Handle sorting
            if(Object.keys(this.state.options).length !== 0){ // If options not an empty object
                const sort = this.state.options.sort;

                if(sort === "AAS")
                    resourcesArray = resourcesArray.sort((a,b) => a.title.localeCompare(b.title));
                else if(sort === "ADE")
                    resourcesArray = resourcesArray.sort((a,b) => -(a.title.localeCompare(b.title)));
                else if(sort === "TAS")
                    resourcesArray = resourcesArray.sort((a,b) => -(a.date_of_creation.localeCompare(b.date_of_creation)));
                else if(sort === "TDE")
                    resourcesArray = resourcesArray.sort((a,b) => a.date_of_creation.localeCompare(b.date_of_creation));
                else
                    err_get_options();
            }


            return resourcesArray.map(item => (
                <Card
                style={{ width: 300, marginTop: 16 }}
                actions={[
                    <Icon type="edit" onClick={() => this.onEdit(item.id)}/>,
                    <CopyToClipboard onCopy={succ_copy} text={item.url}><Icon type="link" /></CopyToClipboard>,
                    <Popconfirm
                    title="Remove resource?"
                    onConfirm={() => this.deleteResource(item.id)}>
                        <Icon type="delete"/>
                    </Popconfirm>
                ]}
                key={item.id}
                hoverable={true}
                headStyle={{backgroundColor:"#323232", borderLeft:"2px #fadb14 solid"}}
                bodyStyle={{backgroundColor:"#e8e8e8", borderLeft:"2px #fadb14 solid"}}
                extra={<span style={{color:"white"}}>{this.reformatDate(item.date_of_creation)} <Icon type="calendar"/></span>}
                >
                    <Meta
                    style={{color:"white"}}
                    onClick={() => window.open(item.url, "_blank")}
                    title={item.title}
                    description={item.note}
                    />
                    
                    {item.tags && item.tags.map(item => (
                        <Tag key={item} style={{marginTop:"10px"}}>{item}</Tag>
                    ))}

                </Card>
            ));
        }
    }

    render () {
        return (
            <div style={{marginTop:"5em"}}>
            
                {this.state.loading &&
                <Icon id="loading-spinner" type="loading" spin />}

                {!this.state.loading && 
                <Masonry
                options={masonryOptions}
                >
                    {this.renderCards()}
                </Masonry>
                }

                <EditResourceModal
                visible={this.state.editDrawerVisible}
                toggleVisible={this.toggleDrawerVisible}
                data={this.state.drawerData}
                triggerRefresh={this.props.triggerRefresh}
                />
            
            </div>
        );
    }
}
