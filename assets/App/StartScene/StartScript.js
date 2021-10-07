let StartScript = cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: cc.Button,
        returnBtn: cc.Button,
    },

    start(){
        this.playBtn.node.on('touchstart', this.OnPlayBtnClick, this);
        this.returnBtn.node.on('touchstart', this.OnReturnClick,this);

    },

    OnPlayBtnClick(){
        cc.director.loadScene('GameScene');
    },
    
    OnReturnClick(){
        cc.director.loadScene('HallScene');
    },
});

