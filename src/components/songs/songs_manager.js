import React from 'react';
import Home from '../home/home';
import {Link} from 'react-router-dom';
import {Table , Card , message,Breadcrumb,Icon,Popconfirm,Input, Modal,Upload,Button} from 'antd';
message.config({
    duration:5
});
class SingerManager extends React.Component{
    constructor(){
        super();
        this.state={
            source:[],
            name:''
        }
    }
    componentDidMount(){
        fetch('/get_song',{credentials:'include'})
            .then(res=>res.json())
            .then(r=>{
                if(r.code===4){
                    message.error(r.message);
                }else{
                    r.forEach((v,i)=>{
                        v.show=false;
                        v.key=i;
                    });
                    this.setState({source:r});
                    console.log(this.state.source)
                }
            })
    }
    update(sid,key,record){
        const {name}=this.state;
        fetch('/update_song',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({sid,key,name})
        }).then(res=>res.json())
            .then(r=>{
                if(r==='ok'){
                    record[key]=name;
                    this.setState({
                        name:'',
                    })
                }
            })
    }
    change(e){
        this.setState({
            name:e.target.value
        })
    }
    showModal(sid){
        let r = this.state.source.map(v=>{
            if(v.sid===sid){
                v.show = true;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    hideModel(sid){
        let r = this.state.source.map(v=>{
            if(v.sid===sid){
                v.show = false;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    remove(sid){
        var r = this.state.source.map(v=>{
            if(v.sid === sid){
                v.opic=undefined;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    delete(sid){
        fetch('/delete_singer_by_sid',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({sid})
        }).then(res=>res.json())
            .then(r=>{
                var n = this.state.source.filter(v=>v.sid!==sid);
                if(r==='ok'){
                    this.setState({source:n});
                }
            })
    }
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleChange(e,id){
        this.getBase64(e.file.originFileObj, imageUrl => {
            var r = this.state.source.map(v=>{
                if(v.sid === id){
                    v.opic=imageUrl;
                }
                return v;
            });
            this.setState({
                source:r
            })
        });

    }
    render(){
        const tableData={
            columns:[
                {title:'序号',dataIndex:'sid',key:'sid'},
                {title:'歌手分类',key:'cname',dataIndex:'cname'},
                {title:'歌手名称',key:'sname',dataIndex:'sname'},
                {title:'专辑图片',key:'opic',render:(record)=>{
                    let o = [];
                    if(record.opic){
                        o.push({
                            uid:-1,
                            url:record.opic
                        })
                    }
                    return (
                        <div>
                            <Upload
                                name="abs"
                                action="/update_singer_pic"
                                listType="picture-card"
                                fileList={o}
                                data={{sid:record.sid}}
                                onPreview={()=>this.showModal(record.sid)}
                                onRemove={()=>this.remove(record.sid)}
                                onChange={(e)=>this.handleChange(e,record.sid)}
                            >
                                {o.length?null:<div><Icon type="plus" style={{fontSize:"20px"}}/>点击上传</div>}
                            </Upload>
                            <Modal visible={record.show} footer={null} onCancel={()=>this.hideModel(record.sid)}>
                                <img style={{ width: '100%' }} src={record.opic} alt=""/>
                            </Modal>
                        </div>
                    )
                }},
                {title:'歌曲名称',key:'oname',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.oname}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.oname}/>)}
                            onConfirm={()=>this.update(record.sid,'oname',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'歌曲详情',key:'song',render:(record)=>(
                    <div className="cateUpdateCell">
                        <Popconfirm
                            title={(<audio src={record.file} controls="controls"></audio>)}
                            onConfirm={()=>this.update(record.sid,'oname',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="caret-right" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'操作',key:'option',render:r=>(
                    <Button type="dashed" onClick={()=>this.delete(r.sid)}>删除</Button>
                )}
            ],
            dataSource:this.state.source
        };
        return(
            <Home selected="songs_manager">
                <Card title={<Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/admin"><Icon type="home" /></Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Icon type="user" />
                        <span>分类管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>}>
                    <Table bordered {...tableData}/>
                </Card>
            </Home>
        )
    }
}
export default SingerManager;