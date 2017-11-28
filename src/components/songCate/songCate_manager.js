import React from 'react';
import Home from '../home/home';
import {Link} from 'react-router-dom';
import {Table , Card , message,Breadcrumb,Icon,Popconfirm,Input, Modal,Upload,Button} from 'antd';
message.config({
    duration:5
});
class SongCateManager extends React.Component{
    constructor(){
        super();
        this.state={
            source:[],
            name:''
        }
    }
    componentDidMount(){
        fetch('/get_song_cate',{credentials:'include'})
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
    update(id,key,record){
        const {name}=this.state;
        fetch('/update_song_cate',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id,key,name})
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
    showModal(gid){
        let r = this.state.source.map(v=>{
            if(v.gid===gid){
                v.show = true;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    hideModel(gid){
        let r = this.state.source.map(v=>{
            if(v.gid===gid){
                v.show = false;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    remove(id){
        var r = this.state.source.map(v=>{
            if(v.id === id){
                v.pic=undefined;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    delete(id){
        fetch('/delete_song_cate',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({id})
        }).then(res=>res.json())
            .then(r=>{
                var n = this.state.source.filter(v=>v.id!==id);
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
                if(v.id === id){
                    v.pic=imageUrl;
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
                {title:'序号',dataIndex:'id',key:'id'},
                {title:'名称',key:'name',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.name}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.name}/>)}
                            onConfirm={()=>this.update(record.id,'name',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'图片',key:'pic',render:(record)=>{
                    let o = [];
                    if(record.pic){
                        o.push({
                            uid:-1,
                            url:record.pic
                        })
                    }
                    return (
                        <div>
                            <Upload
                                name="abc"
                                action="/update_song_cate_pic"
                                listType="picture-card"
                                fileList={o}
                                data={{id:record.id}}
                                onPreview={()=>this.showModal(record.id)}
                                onRemove={()=>this.remove(record.id)}
                                onChange={(e)=>this.handleChange(e,record.id)}
                            >
                                {o.length?null:<div><Icon type="plus" style={{fontSize:"20px"}}/>点击上传</div>}
                            </Upload>
                            <Modal visible={record.show} footer={null} onCancel={()=>this.hideModel(record.id)}>
                                <img style={{ width: '100%' }} src={record.pic} alt=""/>
                            </Modal>
                        </div>
                    )
                }
                },
                {title:'操作',key:'option',render:r=>(
                    <Button type="dashed" onClick={()=>this.delete(r.id)}>删除</Button>
                )}
            ],
            dataSource:this.state.source
        };
        return(
            <Home selected="song_cate_manager">
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
export default SongCateManager;