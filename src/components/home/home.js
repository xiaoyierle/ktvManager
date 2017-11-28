import React from 'react';
import { Layout, Menu, Icon ,Dropdown ,Row , Col} from 'antd';
import './home.css';
import {Link} from 'react-router-dom';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class Home extends React.Component{
    constructor(){
        super();
        this.state={
            username:"",
        }
    }
    componentDidMount(){
        fetch('/get_user',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                if(data.code!==4){
                    this.setState({
                        username:data
                    })
                }else{

                }
            })
    }
    render(){
        const drop = (
            <Menu className="drop-menu">
                <Menu.Item>
                    <a href="">个人中心</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="/admin/login">退出登录</a>
                </Menu.Item>
            </Menu>
        );
        return(
            <Layout>
                <Header className="admin-header">
                    <Row>
                        <Col span={4}>
                            <div className="logo">
                                <Row className="logoinner" type="flex" justify="center" align="middle">
                                    <h3>啃麦迪</h3>
                                    <span>|</span>
                                    <p>商家中心</p>
                                </Row>
                            </div>
                        </Col>
                        <Col span={6} align="right" offset={14}>
                            <Dropdown overlay={drop} trigger={['click']} placement={'bottomCenter'}>
                                <a href="" className="drop-a">welcome {this.state.username} <Icon type="down"/></a>
                            </Dropdown>
                        </Col>

                    </Row>
                </Header>
                <Content className="admin-content">
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={200} style={{background:'#fff'}}>
                            <Menu mode="inline"  style={{ height: '100%' }}
                                  defaultSelectedKeys={[this.props.selected]}
                                  defaultOpenKeys={['user','goods','songCate','songs','singer']}>
                                <SubMenu key='user' title={<span><Icon type="user"/>个人中心</span>}>
                                    <Menu.Item key="order">
                                        我的订单
                                    </Menu.Item>
                                    <Menu.Item key="info">
                                        <Link to="/admin/user/info">个人信息</Link>
                                    </Menu.Item>
                                    <Menu.Item key="password_change">
                                        <Link to="/admin/user/password_change">修改密码</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key='goods' title={<span><Icon type="shopping-cart" />商品管理</span>}>
                                    <Menu.Item key="goods_add">
                                        <Link to="/admin/goods/goods_add">
                                            添加商品
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="goods_manager">
                                        <Link to="/admin/goods/goods_manager">
                                            商品管理
                                        </Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key='songCate' title={<span><Icon type="customer-service" />分类管理</span>}>
                                    <Menu.Item key="song_cate_add">
                                        <Link to="/admin/songCate/song_cate_add">
                                            添加分类
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="song_cate_manager">
                                        <Link to="/admin/songCate/song_cate_manager">
                                            分类管理
                                        </Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key='singer' title={<span><Icon type="customer-service" />歌手管理</span>}>
                                    <Menu.Item key="singer_add">
                                        <Link to="/admin/singer/singer_add">
                                            添加歌手
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="singer_manager">
                                        <Link to="/admin/singer/singer_manager">
                                            歌手管理
                                        </Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key='songs' title={<span><Icon type="customer-service" />歌曲管理</span>}>
                                    <Menu.Item key="songs_add">
                                        <Link to="/admin/songs/songs_add">
                                            添加歌曲
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="songs_manager">
                                        <Link to="/admin/songs/songs_manager">
                                            歌曲管理
                                        </Link>
                                    </Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{background:'#fff',padding:"30px",minHeight:'600px'}}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
        )
    }
}
export default Home;