let StartScript = cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: cc.Button,
    },

    start(){
        this.playBtn.node.on('touchstart', this.OnPlayBtnClick, this);

    },

    OnPlayBtnClick(){
        cc.director.loadScene('GameScene');
    }
});

