import EventManager from "../../GameFramework/Event/EventManager";

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

    get view(){
        return this._view;
    };
};

class PokerGroup{
    _pokers = [];

    AddPoker(poker){
        this._pokers.push(poker);
    }

    get pokers(){ return this._pokers;};
};


export default class GameDB{

    static CONST_PLAY_GROUPS = 4;
    
    // 原始扑克
    _pokers = [];
    // 抽牌区扑克
    _sendPokers = [];
    // 放置区扑克
    _setPokers = [];
    // 玩家1扑克组
    _player1Pokers = [];
    // 玩家2扑克组
    _player2Pokers = [];

    static Create(){
        let gameDB = new GameDB()

        return gameDB;
    };

    constructor(){
        for(let i = 0;i<GameDB.CONST_PLAY_GROUPS; i++){
            let pokerGroup1 = new PokerGroup();
            let pokerGroup2 = new PokerGroup();
            this._player1Pokers.push(pokerGroup1);
            this._player2Pokers.push(pokerGroup2);
        }

        for(let point = 1;point<=13;point++){
            for(let suit = 0;suit<4;suit++){
                let temp_poker = new Poker(point, suit);
                this._pokers.push(temp_poker);
            }
        }
    };

    // 洗牌
    shuffle(){
        let i = this._pokers.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [this._pokers[j], this._pokers[i]] = [this._pokers[i], this._pokers[j]];
        } 
        EventManager.getInstance().emit('init_poker', this._pokers);
    };

    // 从初始位置到抽牌区
    toSendArea(){
        for(let i = 0;i<52;i++){
            // let poker = this._pokers[this._pokers.length-1];
            let poker = this._pokers.pop();
            this._sendPokers.push(poker);
            EventManager.getInstance().emit('toSendArea',poker,i);
            // return this._pokers.pop();
        }
    };

    toSetArea(){
        let len = this._sendPokers.length-1;
        let poker = this._sendPokers[len];
        poker.status = !poker.status;
        this._setPokers.push(poker);
        return [this._sendPokers.pop(),this._setPokers.length,len];
    }

    get pokers() { return this._pokers; };
    get sendPokers() { return this._sendPokers; };
    get setPokers() { return this._setPokers; };
    get player1Pokers()　{ return this._player1Pokers; };
    get player2Pokers() { return this._player2Pokers; };

};
