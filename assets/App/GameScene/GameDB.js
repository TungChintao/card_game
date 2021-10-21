import Model from "../../GameFramework/MVC/Model"
import { Area } from "../Global/ConfigEsum";
import global from "../Global/global";
import {Mode} from "../Global/ConfigEsum"

class Poker{
    // status 背面:true 正面：false
    // 0: heitao 1:hongtao 2:heimei 3:fangkuai

    _view = null;

    constructor(point, suit, status=true){
        this.point = point;
        this.suit = suit;
        this.status = status;
    };

    Bind(view){
        this._view = view;
    };

    unBind(){
        this._view = null;
    };

    setPoker(suit,point){
        this.point = point;
        this.suit = suit;
        this._view.setPoker(suit,point);
    };

    get view(){
        return this._view;
    };
};

class PokerGroup{

    _pokers = [];

    pokerNum = 0;

    AddPoker(poker){
        this._pokers.push(poker);
        this.pokerNum++;
    }

    PopPoker(){
        this.pokerNum--;
        return this._pokers.pop();
    }

    GetTopPoker(){
        return this._pokers[this.pokerNum-1]
    }

    get pokers(){ return this._pokers;};
};


export default class GameDB extends Model{

    static CONST_PLAY_GROUPS = 4;
    
    // 原始扑克
    _pokers = [];
    // 抽牌区扑克
    _sendPokers = [];
    // 放置区扑克
    _setPokers = [];
    // 玩家扑克组
    _playerPokers = [[],[]];
    // 玩家手牌数
    _playerPokersNum = [0,0];



    constructor(){
        super();
        for(let p = 0;p<2;p++){
            for(let i = 0;i<GameDB.CONST_PLAY_GROUPS; i++){
                let pokerGroup = new PokerGroup();
                this._playerPokers[p].push(pokerGroup);
            }
        }

        for(let point = 1;point<=13;point++){
            for(let suit = 0;suit<4;suit++){
                let temp_poker;
                if(global.gameMode == Mode.Online)
                    temp_poker = new Poker();
                else
                    temp_poker = new Poker(point, suit);
                   
                this._pokers.push(temp_poker);
            }
        }

        // this.on('UIPokerOnTouch',this.toSetArea, this);
    };

    // 洗牌
    shuffle(){
        let i = this._pokers.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [this._pokers[j], this._pokers[i]] = [this._pokers[i], this._pokers[j]];
        } 
        // this.emit('init_poker', this._pokers);
        this.InitPoker();
    };

    InitPoker(){
        this.emit('init_poker',this._pokers);
    };

    // 从初始位置到抽牌区
    toSendArea(){
        for(let i = 0;i<52;i++){
            // let poker = this._pokers[this._pokers.length-1];
            let poker = this._pokers.pop();
            this._sendPokers.push(poker);
            this.emit('toSendArea',poker,i);
            // return this._pokers.pop();
        }
        // cc.log(this._sendPokers.length);    
    };

    toSetArea(dealArea,playerID, dealPoker){
        let setSuit = -1;
        let setLen = this._setPokers.length-1;
        if(setLen >= 0)
            setSuit = this._setPokers[setLen].suit;

        if(dealArea === Area.sendArea){
            let sendLen = this._sendPokers.length-1;
            let poker = this._sendPokers[sendLen];
            poker.status = !poker.status;
    
            this._setPokers.push(poker);
            this.emit('clickToSetArea',poker,this._setPokers.length,dealArea);
            
            setTimeout(()=>{
                if(this._sendPokers.pop().suit === setSuit) {
                    this.toPlayList(playerID);
                }
            },1600);

            setTimeout(()=>{ 
                if(this._sendPokers.length === 0){
                    this.judgeWinner();
                    global.yourTurn = true;
                }
            },2500);
                

        }
        else{
            let poker = this._playerPokers[playerID][dealPoker.suit].PopPoker();
            this._playerPokersNum[playerID]--;
            this._setPokers.push(poker);
            this.emit('clickToSetArea', poker,this._setPokers.length,dealArea);

            setTimeout(()=>{
                if(setSuit === dealPoker.suit){
                    this.toPlayList(playerID);
                }
            },700);
        }
    };

    toPlayList(id){
        setLen = this._setPokers.length;
        for(let i = 0;i < setLen; i++){
            let poker = this._setPokers.pop();
            // console.log(poker);
            this._playerPokers[id][poker.suit].AddPoker(poker);
            this._playerPokersNum[id]++;
            this.emit('toPlayList', poker, i,setLen*0.1,id+1);
        }
    };

    isTopIndexPoker(poker,playerID, pokerArea){
        let topPoker = null;
        if(pokerArea === Area.sendArea)
            topPoker = this._sendPokers[this._sendPokers.length-1];
        else topPoker = this._playerPokers[playerID][poker.suit].GetTopPoker();
        if(poker.suit === topPoker.suit && poker.point === topPoker.point)
            return true;
        return false;
    };

    CmpCardNum(){
        if(this._playerPokersNum[0] > this._playerPokersNum[1]) return 1;
       
        else if(this._playerPokersNum[0] < this._playerPokersNum[1]) return 0;
        
        else return -1;
        
    }

    judgeWinner(){
        let winner = this.CmpCardNum();
        // cc.log('judge');
        
        global.winner = winner+1;
        this.emit("GameOver",winner+1);
    };

    exchangePoker(suit,point){
        let len = this._sendPokers.length;
        this._sendPokers[len-1].setPoker(suit,point);
    }

    setPokerNum() { return this._setPokers.length; }
    sendPokerNum() { return this._sendPokers.length; }

    setTopPoker() { if(this._setPokers.length > 0) return this._setPokers[this._setPokers.length-1];}
    sendTopPoker() { if(this._sendPokers.length > 0) return this._sendPokers[this._sendPokers.length-1];}

    playerGroupTopPoker(playerID, pokerSuit){
        return this._playerPokers[playerID][pokerSuit].GetTopPoker();
    }
    playerGroupPokerNum(playerID, pokerSuit){
        return this._playerPokers[playerID][pokerSuit].pokerNum;
    }

    get pokers() { return this._pokers; };
    get sendPokers() { return this._sendPokers; };
    get setPokers() { return this._setPokers; };
    get playerPokers() { return this._playerPokers; };
    get playerPokersNum() { return this._playerPokersNum; };

};
