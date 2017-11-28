import React from 'react';
import Home from '../home/home';
import {Link} from 'react-router-dom';
import {Table , Card , message,Breadcrumb,Icon,Popconfirm,Input, Modal,Upload,Button} from 'antd';
message.config({
    duration:5
});
class Goods extends React.Component{
    constructor(){
        super();
        this.state={
            source:[],
            name:''
        }
    }
    componentDidMount(){
        fetch('/get_goods',{credentials:'include'})
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
    update(gid,key,record){
        const {name}=this.state;
        fetch('/update_goods',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({gid,key,name})
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
    remove(gid){
        var r = this.state.source.map(v=>{
            if(v.gid === gid){
                v.pic=undefined;
            }
            return v;
        });
        this.setState({
            source:r
        })
    }
    delete(gid){
        fetch('/delete_goods',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({gid}),
        }).then(res=>res.json())
            .then(r=>{
                var n = this.state.source.filter(v=>v.gid!==gid);
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
    handleChange(e,gid){
        this.getBase64(e.file.originFileObj, imageUrl => {
            var r = this.state.source.map(v=>{
                if(v.gid === gid){
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
                {title:'序号',dataIndex:'gid',key:'gid1'},
                {title:'分类',dataIndex:'cname',key:'cname1'},
                {title:'名称',key:'gname1',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.gname}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.gname}/>)}
                            onConfirm={()=>this.update(record.gid,'gname',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'价格',key:'price1',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.price}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.price}/>)}
                            onConfirm={()=>this.update(record.gid,'price',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'图片',key:'pic1',render:(record)=>{
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
                            action="/update_pic"
                            listType="picture-card"
                            fileList={o}
                            data={{id:record.gid}}
                            onPreview={()=>this.showModal(record.gid)}
                            onRemove={()=>this.remove(record.gid)}
                            onChange={(e)=>this.handleChange(e,record.gid)}
                        >
                            {o.length?null:<div><Icon type="plus" style={{fontSize:"20px"}}/>点击上传</div>}
                        </Upload>
                        <Modal visible={record.show} footer={null} onCancel={()=>this.hideModel(record.gid)}>
                            <img style={{ width: '100%' }} src={record.pic} alt=""/>
                        </Modal>
                    </div>
                )
                }
                },
                {title:'描述',key:'desc1',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.desc}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.desc}/>)}
                            onConfirm={()=>this.update(record.gid,'desc',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'操作',key:'option1',render:r=>(
                    <Button type="dashed" onClick={()=>this.delete(r.gid)}>删除</Button>
                )}
            ],
            dataSource:this.state.source
        };
        return(
            <Home selected="goods_manager">
                <Card title={<Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/admin"><Icon type="home" /></Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Icon type="user" />
                        <span>商品管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>}>
                    <Table bordered {...tableData}/>
                </Card>
            </Home>
        )
    }
}
export default Goods;