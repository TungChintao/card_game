cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,
    
        horizontalBar: {
            type: cc.ProgressBar,
            default: null
        }
    },

    onLoad: function () {
        this.horizontalBar.progress = 0;
    },

    update: function (dt) {
        this._updateProgressBar(this.horizontalBar, dt);
    },
    
    _updateProgressBar: function(progressBar, dt){
        var progress = progressBar.progress;
        if(progress < 1.0){
            progress += dt * this.speed;
        }
        else {
            progress = 0;
        }
        progressBar.progress = progress;
    }
});