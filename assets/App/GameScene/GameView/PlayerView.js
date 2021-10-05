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
    },

    Create(sendArea){
        this.sendArea = sendArea;
    },



});
