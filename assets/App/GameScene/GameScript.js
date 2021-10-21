import GameCtrl from 'GameCtrl';
import GameView from './GameView/GameView';
import View from '../../GameFramework/MVC/View'
import glabal from '../Global/global'

cc.Class({
    extends: View,

    properties: {
        gameViewPrefab: cc.Prefab,
        gameOverPrefab: cc.Prefab,

        _gameView: GameView,
        _gameCtrl: GameCtrl,
    },

    onLoad(){
        this.node.on('returnLastScene',this.returnLastScene,this);
    },

    start(){
        this._gameView = cc.instantiate(this.gameViewPrefab).getComponent(GameView);
        this.node.addChild(this._gameView.node);
        this._gameCtrl = new GameCtrl();
        this._gameCtrl.Init(this._gameView);
        this._gameCtrl.Play();
        
        this._gameView.on('gameOver',this.showResult,this);
    },

    Init(){
   
    },

    showResult(winner){
        this.ExitGame(this._gameCtrl);
        let gameOver = cc.instantiate(this.gameOverPrefab);

        this.node.addChild(gameOver);
    },

    ExitGame(gameCtrl){
        if(gameCtrl != null)
            // gameCtrl.Exit();
            gameCtrl.onDestroy();
    },

    returnLastScene(){
        cc.director.loadScene(glabal.fromWhichScene);
    },

    onDestroy(){
        // this._gameCtrl.Exit();
    },
    
});

