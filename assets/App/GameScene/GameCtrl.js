import GameView from "./GameView/GameView"
import GameDB from "GameDB"
import Player from 'Player'
import GameRound from "GameRound";
import AI from "AI"
import global from "../Global/global";
import {Mode} from "../Global/ConfigEsum"
import OnLine from "OnLine";

var GameCtrl = cc.Class({
    extends: cc.Component,
    
    properties:{

        _gameDB: GameDB,

        _gameView: GameView,

        _gameRound: GameRound,

        _player1: Player,

        _player2: Player,

        _AIplayer: AI,

        _onLineManager: OnLine,

    },

    // onload(){
        
    // },

    Init(gameView){
        this._gameView = gameView;
        this._gameDB = new GameDB();
        this._gameView.BindModel(this._gameDB);

        this._gameRound = new GameRound();
        this._gameView.BindRound(this._gameRound);

        this._player1 = new Player();
        this._player2 = new Player();
        this._player1.Create(true,1);
        this._player2.Create(false,2);

        this._gameRound.BindPlayer(this._player1,this._player2);

        this._AIplayer = new AI();
        this._AIplayer.BindModel(this._gameDB);
        this._AIplayer.BindView(this._gameView);
        this._AIplayer.BindRound(this._gameRound);
        if(global.gameMode == Mode.PVE){ 
            this._AIplayer.ContrlPlayer(this._player2);
        }

        if(global.gameMode == Mode.Online){
            this._onLineManager = new OnLine();
            this._onLineManager.BindModel(this._gameDB);
            this._onLineManager.BindRound(this._gameRound);
            this._gameView.BindOnline(this._onLineManager);
           
            this._player1.active = global.yourTurn;
            this._player1.SetName(global.selfInfo.name);

            this._gameView.on('DealPokerOnTouch',this._onLineManager.DealPokerOnTouch,this._onLineManager);
        }

        this._gameRound.BindAI(this._AIplayer);

        this._gameView.on('UIPokerOnTouch',this._gameDB.toSetArea,this._gameDB);
        this._gameView.on('AIManageBtnOnTouch',this.AiManageCard,this);
        this._gameView.on('CancelAIManage',this.CancelAI,this);
        if(global.gameMode == Mode.Online) this._gameDB.InitPoker(); 
        else    this._gameDB.shuffle();
    },

    Play(){
        this._gameDB.toSendArea();
        if(global.gameMode == Mode.Online)
            if(!this._player1.active) {
                this._gameView.turnRoundMessage('对手回合');
                this._onLineManager.DealOpponentPoker();
            }
    },

    AiManageCard(){
        this._AIplayer.ContrlPlayer(this._player1);
        this._gameRound.Refresh(0);
    },

    CancelAI(){
        this._AIplayer.UnContrlPlayer(this._player1);
    },

    Exit(){
        if(global.gameMode == Mode.Online) this._onLineManager.Exit();

        this._AIplayer.UnContrlPlayer(this._player1);
        this._AIplayer.UnContrlPlayer(this._player2);

        this._AIplayer.Exit();
        this._gameRound.Exit();
        this._gameView.Exit();
    },

    onDestroy(){},

});