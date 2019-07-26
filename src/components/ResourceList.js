import React from 'react'
import { Card, Icon, List, Tag } from 'antd'
import axios from 'axios'
import Masonry from 'react-masonry-component'
import './styles/_shared.scss'

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
        axios.get("http://localhost:8000/api/resources/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => this.setState({ resources: res.data, loading:false }))
        .catch(err => console.log(err));
    };
    
    reformatDate = (dateStr) => {
        let dateArr = dateStr.split("-");  // ex input "2010-01-18"
        return dateArr[2]+ "/" +dateArr[1]+ "/" +dateArr[0].substring(2); //ex out: "18/01/10"
    }

    renderCards = () => {
        return this.state.resources.map(item => (
            <Card
            style={{ width: 300, marginTop: 16 }}
            actions={[<Icon type="edit" />, <Icon type="link" />, <Icon type="ellipsis" />]}
            hoverable={true}
            headStyle={{backgroundColor:"#323232", borderLeft:"2px #fadb14 solid"}}
            bodyStyle={{backgroundColor:"#e8e8e8", borderLeft:"2px #fadb14 solid"}}
            extra={<span style={{color:"white"}}><Icon type="calendar"/> {this.reformatDate(item.date_of_creation)}</span>}
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

            {
                this.state.loading
            ?

                <Icon id="loading-spinner" type="loading" spin />
            :

                <Masonry
                options={masonryOptions}
                >
                    {this.renderCards()}
                </Masonry>
            }
        
        

            </div>
        );
    }
}
