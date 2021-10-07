cc.Class({
    extends: cc.Component,

    properties: {
        account: cc.EditBox,
        password: cc.EditBox,
        tips: cc.Label,
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
        this.xhr.open('POST', 'http://172.17.173.97:8080/api/user/login',true);
        this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        this.xhr.send(data);
        this.xhr.onreadystatechange = ()=>{
            if(this.xhr.readyState == 4 && this.xhr.status == 200){
                var json = this.xhr.responseText;
                returnData = JSON.parse(json);
                console.log(returnData,returnData.message,returnData.data.token);

                console.log(returnData.data.detail.name);
            }  
        };
        // TODO
        // success提示登录成功（玩家消息写入全局）
        // fail提示失败消息

    },
    OnReturnClick(){
        cc.director.loadScene("HallScene");
    }
});
