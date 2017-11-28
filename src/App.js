import React, { Component } from 'react';
import {
    BrowserRouter as Router,Route,Redirect
}from "react-router-dom";
import './App.css';
import Login from './components/login/login';
import UserInfo from "./components/user/user_info";
import PasswordChange from "./components/user/password_change";
import Goods from "./components/goods/goods";
import GoodsAdd from "./components/goods/add_goods";
import SongCateAdd from "./components/songCate/songCate_add";
import SongCateManager from "./components/songCate/songCate_manager";
import SingerAdd from "./components/singer/singer_add";
import SingerManager from "./components/singer/singer_manager";
import SongsAdd from "./components/songs/songs_add";
import SongsManager from "./components/songs/songs_manager";


class App extends Component {
    constructor(){
        super();
        this.state={
            auth:true,
        }
    }
    componentWillMount(){
        fetch('/get_auth',{
            credentials:'include'
        }).then(res=>res.json())
            .then(r=>{
                this.setState({auth:r})})
    }
  render() {
    return (
        <Router>
            <div className="App">
                <Route path="/admin/" render={()=>(
                    <div>
                        {this.state.auth?(null):(<Redirect to="/admin/login"/>)}
                    </div>
                )}/>
                <Route path="/admin/login" component={Login}/>
                <Route path="/admin/user/info" component={UserInfo}/>
                <Route path="/admin/user/password_change" component={PasswordChange}/>
                <Route path="/admin/goods/goods_add" component={GoodsAdd}/>
                <Route path="/admin/goods/goods_manager" component={Goods}/>
                <Route path="/admin/songCate/song_cate_add" component={SongCateAdd}/>
                <Route path="/admin/songCate/song_cate_manager" component={SongCateManager}/>
                <Route path="/admin/singer/singer_add" component={SingerAdd}/>
                <Route path="/admin/singer/singer_manager" component={SingerManager}/>
                <Route path="/admin/songs/songs_add" component={SongsAdd}/>
                <Route path="/admin/songs/songs_manager" component={SongsManager}/>
            </div>
        </Router>
    );
  }
}

export default App;
