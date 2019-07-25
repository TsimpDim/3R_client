import React from 'react'
import { Card, Icon, List, Tag } from 'antd'
import axios from 'axios'

const { Meta } = Card;



export default class ResourceList extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            resources: [],
            loading: true
        }

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

    render () {
        return (
            <div>

            {
                this.state.loading
            ?

                <div><Icon id="loading-spinner" type="loading" spin /></div>
            :

                <List
                grid={{   
                    gutter: 0,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 4,
                    xxl: 5,
                }}
                dataSource={this.state.resources}
                renderItem={item => (
                    <List.Item>
                        <Card
                        style={{ width: 300, marginTop: 16 }}
                        actions={[<Icon type="edit" />, <Icon type="link" />, <Icon type="ellipsis" />]}
                        hoverable={true}
                        extra={<span><Icon type="calendar"/> {this.reformatDate(item.date_of_creation)}</span>}
                        >
                            <Meta
                            title={item.title}
                            description={item.note}
                            />
                        
                        {item.tags && item.tags.map(item => (
                            <Tag style={{marginTop:"10px"}}>{item}</Tag>
                        ))}


                        </Card>
                    </List.Item>
                )}
                />
            }
        
        

            </div>
        );
    }
}
