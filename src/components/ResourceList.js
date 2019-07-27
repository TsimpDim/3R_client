import React from 'react'
import { Card, Icon, Tag, Empty, Popconfirm } from 'antd'
import axios from 'axios'
import Masonry from 'react-masonry-component'
import './styles/_shared.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { succ_copy } from './shared/messages'

const { Meta } = Card;
const masonryOptions = {
    transitionDuration: 0,
    gutter: 70,
};


export default class ResourceList extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            resources: [],
            loading: true
        }

    }

    componentWillReceiveProps() {
        if(this.props.refreshData())
            this.refreshList();
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        this.setState({ loading: true });

        axios.get("http://localhost:8000/api/resources/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => this.setState({ resources: res.data, loading:false }))
        .catch(err => console.log(err));
    };

    deleteResource = (idx) => {
        this.setState({ loading: true });

        axios.patch("http://localhost:8000/api/resources/"+idx+"/",
        {
            visible:false,
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
        }})
        .then(res => this.setState({
            resources: this.state.resources.filter(item => item.id !== idx),
            loading:false 
        }))
        .catch(err => console.log(err));
    };
    
    reformatDate = (dateStr) => {
        let dateArr = dateStr.split("-");  // ex input "2010-01-18"
        return dateArr[2]+ "/" +dateArr[1]+ "/" +dateArr[0].substring(2); //ex out: "18/01/10"
    }

    renderCards = () => {
        if(this.state.resources.length === 0)
            return <Empty
                    description={<span><Icon type="frown"/> No resources yet.<br/>Click the <span style={{color:"#108ee9"}}>blue</span> button on the top left!</span>}
                    style={{marginRight:"auto", marginLeft:"45%"}}
                    />
        else
            return this.state.resources.map(item => (
                <Card
                style={{ width: 300, marginTop: 16 }}
                actions={[
                    <Icon type="edit" />,
                    <CopyToClipboard onCopy={succ_copy} text={item.url}><Icon type="link" /></CopyToClipboard>,
                    <Popconfirm
                    title="Delete resource?"
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

    render () {
        return (
            <div style={{marginTop:"5em"}}>
            
                {this.state.loading &&
                <Icon id="loading-spinner" type="loading" spin />}

                <Masonry
                options={masonryOptions}
                >
                    {this.renderCards()}
                </Masonry>
            
            </div>
        );
    }
}
