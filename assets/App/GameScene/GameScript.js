import GameCtrl from 'GameCtrl';
import GameView from './GameView/GameView';

let GameScript = cc.Class({
    extends: cc.Component,

    properties: {
        gameViewPrefab: cc.Prefab,

        _gameView: GameView,
        _gameCtrl: GameCtrl,

    },

    start(){
        // this.node.on('gameview_onTouchEnd', this.gameview_onTouchEnd, this);
        this.node.on('playerView_onTouchEnd', this.playerView_onTouchEnd, this);
        this._gameView = cc.instantiate(this.gameViewPrefab).getComponent(GameView);
        this.node.addChild(this._gameView.node);
        this._gameCtrl = new GameCtrl();
        this._gameCtrl.Init(this._gameView);
        this._gameCtrl.Play();
    },

    gameview_onTouchEnd(){
        cc.log('GameScript');
        this._gameCtrl.dealPoker();
    },

    playerView_onTouchEnd(){
        cc.log('PlayerView');
        judge = this._gameCtrl.dealPoker();
        if(judge) this.node.off('playerView_onTouchEnd', this.playerView_onTouchEnd, this);
    },

    onDestroy(){
        this._gameCtrl.Exit();
    }
    
});

