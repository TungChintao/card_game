import global from '../Global/global'
import {URL} from '../Global/ConfigEsum'

cc.Class({
    extends: cc.Component,

    properties: {
        tips: cc.Label,

        account: cc.EditBox,
        password: cc.EditBox,
  
        loginBtn: cc.Button,
        returnBtn: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loginBtn.node.on('touchend', this.Login,this);
        this.returnBtn.node.on('touchend', this.OnReturnClick,this);
    },

    Login () {
        let data = `student_id=${this.account.string}&password=${this.password.string}`
        this.xhr = new XMLHttpRequest();
        this.xhr.open('POST', URL.loginUrl, true);
        this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        this.xhr.send(data);
        this.xhr.onreadystatechange = ()=>{
            if(this.xhr.readyState == 4 && this.xhr.status == 200){
                
                let returnData = JSON.parse(this.xhr.responseText);

                // success提示登录成功
                // 玩家信息写入全局
                // 跳转至新界面
                if(returnData.status === 200){
                    this.tips.string = "登录成功";
                    this.tips.node.color = cc.Color.GREEN;
    
                    global.selfInfo.token = returnData.data.token;
                    global.selfInfo.uid = returnData.data.detail.id;
                    global.selfInfo.name = returnData.data.detail.name;

                    this.toSplashScene();
                }
                // fail提示失败消息
                else{
                    this.tips.string = returnData.data.error_msg;
                    this.tips.node.color = cc.Color.RED;
                }
            }
            else{
                this.tips.string = '网络出错';
                this.tips.node.color = cc.Color.RED;
            }  
        };

    },

    OnReturnClick(){
        cc.director.loadScene("HallScene");
    },

    toSplashScene(){
        cc.director.loadScene('SplashScene');
    },

});
