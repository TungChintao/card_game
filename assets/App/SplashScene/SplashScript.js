let SplashScript = cc.Class({
    extends: cc.Component,

    properties: {

        label: {
            default: null,
            type: cc.Label
        },
    },

    onLoad(){
    },

    start(){
        this.label.string = "It's the Loading Scene";
        setTimeout(() => {
            cc.director.loadScene('StartScene', ()=>{
                console.log('>> on Start Scene Launched Callback!');
            })
        }, 1000)
    },
});



