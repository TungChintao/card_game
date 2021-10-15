cc.Class({
    extends: cc.Component,

    properties: {
        joinBtn: cc.Button,
        roomLabel: cc.Label,
        _uuid: '0',
        _hostID: 0,
        _clientID: 0,
        _status: '等待中...',
    },

    onLoad(){
        this.joinBtn.node.on('touchend',this.OnTouchJoinBtn,this);
    },

    OnTouchJoinBtn(){
        cc.log(this.roomLabel);
    },

    initItem(uuid,hostID,clientID){
        this._uuid = uuid;
        this._hostID = hostID;
        this._clientID = clientID;
        if(clientID != 0) this._status = '对局中...';
        this.roomLabel = `创建者ID：${this._hostID}  ${this._status}`;
    },

});
