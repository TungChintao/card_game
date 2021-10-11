
import {URL} from '../Global/ConfigEsum'
import global from '../Global/global'

cc.Class({
    extends: cc.Component,

    properties: {
        createBtn: cc.Button,
        joinBtn: cc.Button,
        returnBtn: cc.Button,
        _private: false,
    },

    onLoad(){
        this.createBtn.node.on('touchend', this.CreateRoom,this);
        this.joinBtn.node.on('touchend', this.JoinRoom,this);
        this.returnBtn.node.on('touchend', this.returnStartScene, this);
    },

    CreateRoom(){
        cc.log('ok');
        let data = `private=${this._private}`
        let xhr = new XMLHttpRequest();
        xhr.open('POST',URL.createRoomUrl,true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + global.selfInfo.token);
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                let returnData = JSON.parse(xhr.responseText);
                global.selfRoomInfo = returnData.data.uuid;
                this.toWaitScene();
            }
        }
        
    },

    JoinRoom(){
        cc.log('ok');

    },

    returnStartScene(){
        cc.director.loadScene('StartScene');
    },

    toWaitScene(){
        cc.director.loadScene('WaitScene');
    },
});
