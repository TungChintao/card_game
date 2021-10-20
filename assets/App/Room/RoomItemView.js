import View from '../../GameFramework/MVC/View'

cc.Class({
    extends: View,

    properties: {
        joinBtn: cc.Button,
        joinBtnBG: cc.Sprite,
        roomLabel: cc.Label,
        _uuid: '0',
        _hostID: 0,
        _clientID: 0,
        _status: '等待中...',
    },

    onLoad(){
    },


    initItem(roomInfo){
        this._uuid = roomInfo.uuid;
        this._hostID = roomInfo.host_id;
        this._clientID = roomInfo.client_id;
        if(roomInfo.client_id != 0) {
            this.RefreshStatus();
        }
        else{
            this.joinBtn.node.on('touchend',this.OnTouchJoinBtn,this);
        }
        this.roomLabel.string = `创建者ID：${this._hostID}  ${this._status}`;
    },

    removeFromPage(){
        this.removeFromParent();
    },

    RefreshStatus(){
        this._status = '对局进行中...';
        this.joinBtnBG.node.color = cc.Color.BLACK.fromHEX("#606363");
        this.joinBtnBG.node.getChildByName('JoinLabel').color = cc.Color.BLACK.fromHEX("#A4A8B3")
        this.joinBtn.interactable = false;
    },

    
    OnTouchJoinBtn(){
        cc.log(this.roomLabel);
        this.emit('JoinRoomOnTouch',this._uuid);
        // this.node.dispatchEvent( new cc.Event.EventCustom('JoinRoomOnTouch', false) );
    },

});
