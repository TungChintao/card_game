import global from "../Global/global";
import {Mode} from "../Global/ConfigEsum"

let StartScript = cc.Class({
    extends: cc.Component,

    properties: {
        pveBtn: cc.Button,
        pvpBtn: cc.Button,
        onlineBtn: cc.Button,
        returnBtn: cc.Button,
    },

    onLoad(){
        if(global.selfInfo.token === null) 
            this.onlineBtn.node.active = false;
        else
            this.onlineBtn.node.on('touchend', this.toRoomSecne,this);
        this.pveBtn.node.on('touchend', this.OnPVEbtnClick, this);
        this.pvpBtn.node.on('touchend', this.OnPVPbtnClick, this);
        this.returnBtn.node.on('touchend', this.OnReturnClick,this);
    },

    toRoomSecne(){
        global.gameMode = Mode.Online;
        cc.director.loadScene('RoomScene');
    },

    OnPVEbtnClick(){
        global.gameMode = Mode.PVE;
        cc.director.loadScene('GameScene');
    },

    OnPVPbtnClick(){
        global.gameMode = Mode.PVP;
        cc.director.loadScene('GameScene');
    },
    
    OnReturnClick(){
        cc.director.loadScene('HallScene');
    },
});

