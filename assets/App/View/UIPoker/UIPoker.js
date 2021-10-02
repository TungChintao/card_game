
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
    extends: cc.Component,

    properties: {
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

    
    setStatus(status){
        if(status){
            this.pointLabel.node.active = false;
            this.smallSuitSprite.node.active = false;
            this.bigSuitSprite.node.active = false;
            let sp = this.getComponent(cc.Sprite);
            sp.spriteFrame = this.texBackBG;
        }
    },

    Init(poker){
        poker.Bind(this);
        this.pointLabel.string = `${POINT_MAP[poker.point]}`;
        this.pointLabel.node.color = (poker.suit === 0 || poker.suit === 2) ? this.blackTextColor:this.redTextColor;
        if(poker.point > 10) this.bigSuitSprite.spriteFrame = this.texFaces[poker.point-11];
        else this.bigSuitSprite.spriteFrame = this.bigSuits[poker.suit];
        this.smallSuitSprite.spriteFrame = this.smallSuits[poker.suit];
        // this.setStatus(poker.status);
    },

});
