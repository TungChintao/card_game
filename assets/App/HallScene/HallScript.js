
cc.Class({
    extends: cc.Component,

    properties: {

        loginBtn: cc.Button,
        visitorBtn: cc.Button,
      
    },

    onLoad () {
        this.loginBtn.node.on('touchend',this.loginScene,this);
        this.visitorBtn.node.on('touchend',this.startScene,this);
    },

    start () {
       
    },

    loginScene(){
        cc.director.loadScene("LoginScene");
    },

    startScene(){
        cc.director.loadScene("StartScene");
    },

    // onDestroy(){
    //     cc.log('destroy');
    //     this.loginBtn.off('touchend',this.loginScene,this);
    //     this.visitorBtn.off('touchend',this.startScene,this);
    // }
});
