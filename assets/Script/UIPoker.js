
let UIPoker = cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,

    },


    Init(poker){
        this.label.string = `(${poker.point},${poker.suit})`;
    }


});
