import global from '../Global/global'
import {Mode} from '../Global/ConfigEsum'

cc.Class({
    extends: cc.Component,

    properties: {
        returnBtn: cc.Button,

        losePirture: cc.Sprite,
        winPirture: cc.Sprite,
        winLabel: cc.Label,
        tiePicture: cc.Sprite,
        
    },

    onLoad(){
        this.returnBtn.node.on('touchend',this.returnLastScene,this);
        
    },

    start(){
        if(global.gameMode == Mode.PVP){
            this.losePirture.node.active = false;
            if(global.winner === 0)
                this.winPirture.node.active = false;
            else{
                this.tiePicture.node.active = false;
                this.winLabel.string = `Winner: Player${global.winner} !!!`;
            }
        }
        else{
            if(global.winner === 1){
                this.tiePicture.node.active = false;
                this.losePirture.node.active = false;
                this.winLabel.string = 'Winner：Player1  !!!'
            }
            else if(global.winner === 2){
                this.winPirture.node.active = false;
                this.tiePicture.node.active = false;
            }
            else{
                this.winPirture.node.active = false;
                this.losePirture.node.active = false;
            }
        } 
 
    },

    returnLastScene(){
        this.node.dispatchEvent( new cc.Event.EventCustom('returnLastScene', true) );
    },

});
