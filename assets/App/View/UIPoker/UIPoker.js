import View from "../../../GameFramework/MVC/View"
import {Area} from "../../Global/ConfigEsum"
import {POINT_MAP} from '../../Global/ConfigEsum'

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

    setPoker(suit,point){
        this.pointLabel.string = `${POINT_MAP[point]}`;
        this.pointLabel.node.color = (suit === 0 || suit === 2) ? this.blackTextColor:this.redTextColor;
        if(point > 10) this.bigSuitSprite.spriteFrame = this.texFaces[point-11];
        else this.bigSuitSprite.spriteFrame = this.bigSuits[suit];
        this.smallSuitSprite.spriteFrame = this.smallSuits[suit];
    },

    Refresh(){
        this.setStatus(this._poker.status);
    },

    onTouchEnd(){
        let pos = this.node.convertToNodeSpaceAR(Event).pos;
        // console.log(this._poker);
        this._View.UIPokerOnTouch(this._poker, this.Area);
    },

    onDestroy(){
        this.node.off('touchstart', this.onTouchStart, this);
    },

});
