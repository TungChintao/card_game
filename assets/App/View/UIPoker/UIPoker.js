import View from "../../../GameFramework/MVC/View"
import {Area} from "../../Global/ConfigEsum"

const POINT_MAP = {
    "1": "A",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "J",
    "12": "Q",
    "13": "K",
}
let UIPoker = cc.Class({
    extends: View,

    properties: {
        _poker: null,
        _View: null,

        Area: Area.initPokerArea,   

        // resources
        pointLabel: cc.Label,
        bigSuitSprite: cc.Sprite,
        smallSuitSprite: cc.Sprite,
        bigSuits: {
            default: [],
            type: cc.SpriteFrame,
        },

        smallSuits:{
            default: [],
             type: cc.SpriteFrame,
        },


         redTextColor: cc.Color.RED,
         blackTextColor: cc.Color.WHITE,

         texFrontBG: cc.SpriteFrame,
         texBackBG: cc.SpriteFrame,

         texFaces: {
             default: [],
             type: cc.SpriteFrame,
         }
    },

    get poker() { return this._poker; },
    get View() { return this._View; },

    start(){
        // this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchend', this.onTouchEnd, this);
    },

    
    setStatus(status){
        if(status){
            this.pointLabel.node.active = false;
            this.smallSuitSprite.node.active = false;
            this.bigSuitSprite.node.active = false;
            let sp = this.getComponent(cc.Sprite);
            sp.spriteFrame = this.texBackBG;
        }
        else{
            this.pointLabel.node.active = true;
            this.smallSuitSprite.node.active = true;
            this.bigSuitSprite.node.active = true;
            let sp = this.getComponent(cc.Sprite);
            sp.spriteFrame = this.texFrontBG;
        }
    },

    Init(poker, view){
        this._poker = poker;
        this._View = view;
        poker.Bind(this);
        this.pointLabel.string = `${POINT_MAP[poker.point]}`;
        this.pointLabel.node.color = (poker.suit === 0 || poker.suit === 2) ? this.blackTextColor:this.redTextColor;
        if(poker.point > 10) this.bigSuitSprite.spriteFrame = this.texFaces[poker.point-11];
        else this.bigSuitSprite.spriteFrame = this.bigSuits[poker.suit];
        this.smallSuitSprite.spriteFrame = this.smallSuits[poker.suit];
        this.setStatus(poker.status);
    },

    Refresh(){
        this.setStatus(this._poker.status);
    },

    onTouchEnd(){
        let pos = this.node.convertToNodeSpaceAR(Event).pos;
        console.log(this._poker);
        this._View.UIPokerOnTouch(this._poker, this.Area);
    },

    onDestroy(){
        this.node.off('touchstart', this.onTouchStart, this);
    },

});
