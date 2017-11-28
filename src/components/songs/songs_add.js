import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,Select,message,Breadcrumb,Upload} from 'antd';
import {Redirect,Link} from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
message.config({
    duration:5
});
class SongAddBox extends React.Component{
    constructor(){
        super();
        this.state={
            cate:[],
            r:false,
            singers:[]
        }
    }
    componentDidMount(){
        fetch('/get_song_cate',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                if(data.code===4){
                    message.error(data.message);
                }else{
                    this.setState({
                        cate:data
                    })
                }
            })
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/add_song',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data.code===4){
                            message.error(data.message)
                        }else{
                            this.setState({
                                r:true
                            })
                        }
                    })
            }
        })
    }
    handleSelectChange = (value) => {
        let id = value||1
        fetch(`/get_singer_by_cate_id?id=${id}`)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    singers:data
                })
            })
    }
    render(){
        let style = {
            labelCol:{span:2,offset:6},
            wrapperCol:{span:10}
        };
        const{getFieldDecorator}=this.props.form;
        const{cate,singers}=this.state;
        const cates = cate.map(v=>(
            <Option value={v.id.toString()} key={v.id}>{v.name}</Option>
        ));
        const singer = singers.map(v=>(
            <Option value={v.sid.toString()} key={v.sid}>{v.sname}</Option>
        ));
        return(
            <div>
                {
                    this.state.r?(
                        <Redirect to="/admin/songs/songs_manager"/>
                    ):(
                        <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                            <FormItem label="选择分类" {...style} hasFeedback>
                                {getFieldDecorator('cate_id', {
                                    rules: [
                                        { required: true, message: '请选择分类' },
                                    ],
                                })(
                                    <Select placeholder="选择分类" onChange={this.handleSelectChange}>
                                        {cates}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="选择歌手" {...style} hasFeedback>
                                {getFieldDecorator('sid', {
                                    rules: [
                                        { required: true, message: '请选择歌手' },
                                    ],
                                })(
                                    <Select placeholder="选择歌手">
                                        {singer}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="歌曲名称" {...style}>
                                {
                                    getFieldDecorator('songname',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="专辑图片" {...style}>
                                {
                                    getFieldDecorator('songpic',{
                                        rules:[{required:true}]
                                    })(
                                        <Upload
                                            name="file"
                                            action="/upload_song_pic"
                                            withCredentials={true}
                                        >

                                            <Button>
                                                <Icon type="upload" />
                                                点击上传
                                            </Button>
                                        </Upload>
                                    )
                                }
                            </FormItem>
                            <FormItem label="歌曲文件" {...style}>
                                {
                                    getFieldDecorator('songfile',{
                                        rules:[{required:true}]
                                    })(
                                        <Upload
                                            name="file"
                                            action="/upload_song_file"
                                            withCredentials={true}
                                        >

                                            <Button>
                                                <Icon type="upload" />
                                                点击上传
                                            </Button>
                                        </Upload>
                                    )
                                }
                            </FormItem>
                            <FormItem wrapperCol={{offset:8}}>
                                <Button type="primary" htmlType="submit">
                                    添加
                                </Button>
                            </FormItem>
                        </Form>
                    )
                }
            </div>
        )
    }
}
const AddForm = Form.create()(SongAddBox);
class SongAdd extends React.Component{
    render(){
        return(
            <Home selected="songs_add">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/admin"><Icon type="home" /></Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Icon type="user" />
                            <span>添加歌手</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }>
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default SongAdd;