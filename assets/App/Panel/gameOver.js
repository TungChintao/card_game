import global from '../Global/global'

cc.Class({
    extends: cc.Component,

    properties: {
        againBtn: cc.Button,
        returnBtn: cc.Button,
    },

    onLoad(){
        this.againBtn.node.on('touchend',this.OneMoreGame,this);
        this.returnBtn.node.on('touchend',this.returnLastScene,this);
    },

    OneMoreGame(){
        this.node.dispatchEvent( new cc.Event.EventCustom('OneMoreGame', true) );
    },

    returnLastScene(){
        this.node.dispatchEvent( new cc.Event.EventCustom('returnLastScene', true) );
    },

});
