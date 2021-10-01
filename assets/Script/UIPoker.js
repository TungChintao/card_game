
let UIPoker = cc.Class({
    extends: cc.Component,

    properties: {
        pointLabel: cc.Label,
        suitSprite: cc.Sprite,
        suitSpriteList: [cc.SpriteFrame],

    },


    Init(poker){
        this.pointLabel.string = `${poker.point}`;
        this.suitSprite.spriteFrame = this.suitSpriteList[poker.suit];
    }


});
