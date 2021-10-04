var PlayerView = cc.Class({
    extends: cc.Component,

    properties: {
        id: 1,
        uid: 0,
        active: true,
        sendArea: cc.Node,
        player1List: [cc.Node],
        player2List: [cc.Node],
    },

    start(){
        if(this.active)
            this.sendArea.on('touchend',this.onTouchEnd, this);
    },

    Create(sendArea){
        this.sendArea = sendArea;
    },

    onTouchEnd(){
        cc.log('PlayerView');
        this.node.dispatchEvent( new cc.Event.EventCustom('playerView_onTouchEnd', true) );
    },





    // InitPlayer(sendArea, id, uid=0){
    //     this.sendArea = sendArea;
    //     this.id = id;
    //     this.uid = uid;

    // },

});
