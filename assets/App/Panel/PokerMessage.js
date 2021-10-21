
// 卡牌计数器
cc.Class({
    extends: cc.Component,

    properties: {

        sendPokerLabel: [cc.Label],

        setPokerLabel: [cc.Label],

        playerPokerLabel: [cc.Label],

    },

    // 显示面板
    showPancel(){
        this.node.active = true;
    },

    // 隐藏面板
    hidePancel(){ 
        this.node.active = false; 
    },

    // 更新计数板信息  参数为数组类型

    updateSendLabel(message){
        for(let i = 0;i<4;i++)
            this.sendPokerLabel[i].string = message[i];
        this.sendPokerLabel[4].string = `抽牌区：${message[4]}`;
    },

    updateSetLabel(message){
        for(let i = 0;i<4;i++)
            this.setPokerLabel[i].string = message[i];
        this.setPokerLabel[4].string = `放置区：${message[4]}`;
    },

    updatePlayerLabel(message){
        this.playerPokerLabel[0].string = `你的手牌数：${message[0]}`;
        this.playerPokerLabel[1].string = `对手手牌数：${message[1]}`;
    }

});
