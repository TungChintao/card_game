let GameScript = cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
    },

    start(){
        this.label.string = "It's the Game Scene";
    },
});

