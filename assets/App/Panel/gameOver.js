import global from '../Global/global'
import {Mode} from '../Global/ConfigEsum'

cc.Class({
    extends: cc.Component,

    properties: {
        returnBtn: cc.Button,

        losePirture: cc.Sprite,
        winPirture: cc.Sprite,
        winLabel: cc.Label,
    },

    onLoad(){
        this.returnBtn.node.on('touchend',this.returnLastScene,this);
        
    },

    start(){
        if(global.gameMode == Mode.PVP){
            this.losePirture.node.active = false;
            this.winLabel.string = `Winner: Player${global.winner}`;
        }
        else{
            if(global.winner === 1){
                this.losePirture.node.active = false;
                this.winLabel.string = 'Winner：Player1!'
            }
            else
                this.winPirture.node.active = false;
        } 
 
    },

    returnLastScene(){
        this.node.dispatchEvent( new cc.Event.EventCustom('returnLastScene', true) );
    },

});
