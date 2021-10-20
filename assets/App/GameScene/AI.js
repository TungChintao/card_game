import Model from "../../GameFramework/MVC/Model";
import { Area } from "../Global/ConfigEsum";

export default class AI extends Model{
    _Model = null;
    _gameRound = null;

    constructor(){
        super();
        // this.on('AiDealCard', this.DealCard, this);
    };

    ContrlPlayer(player){
        player.AIcontrl = true;
    };

    UnContrlPlayer(player){
        player.AIcontrl = false;
    };

    BindModel(Model){
        this._Model = Model;
    };

    UnBindModel(){
        this._Model = null;
    };

    BindRound(round){
        this._gameRound = round;
    };

    UnBindRound(){
        this._gameRound = null;
    };

    // AI出牌
    DealCard(playerID){
        // 出牌策略简易版（先做出人机模块再构思算法）
        // (放置区无牌则点击抽牌区&&手牌比对方少) || 无手牌   抽牌
        // 否则   ！= 放置区顶部花色 && 目前花色最多的       手牌 
        let setPokersNum = this._Model.setPokerNum();

        let dealArea = null;
        let dealPoker = null;
        if(setPokersNum == 0){
            dealArea = Area.sendArea;
            dealPoker = this._Model.sendTopPoker();
        }
        else{
            let setTopPokerSuit = this._Model.setTopPoker().suit;
            let lessPokerPlayerID = this._Model.CmpCardNum();
            // cc.log(lessPokerPlayerID);
            if(lessPokerPlayerID === playerID || lessPokerPlayerID === -1 ||
            this._Model.playerPokersNum[playerID] === 0 ||
            this._Model.playerPokersNum[playerID] === this._Model.playerPokers[playerID][setTopPokerSuit].pokerNum){
                dealPoker = this._Model.sendTopPoker();
                dealArea = Area.sendArea;
            }
            else{
                let maxNumSuit = 0;
                let firstIndex = true;
                for(let suit = 0;suit<4;suit++){
                    if(firstIndex && suit != setTopPokerSuit){
                        maxNumSuit = suit;
                        firstIndex = false;
                    }
                    else if(suit != setTopPokerSuit && 
                    this._Model.playerPokers[playerID][suit].pokerNum > 
                    this._Model.playerPokers[playerID][maxNumSuit].pokerNum){
                        maxNumSuit = suit;
                    }
                }
                dealPoker = this._Model.playerPokers[playerID][maxNumSuit].GetTopPoker();
                cc.log(dealPoker);
                if(playerID === 0) dealArea = Area.player1List
                else dealArea = Area.player2List;
            }
        }
        // cc.log(dealArea,playerID,dealPoker.suit);
        setTimeout(()=>{
            this._Model.toSetArea(dealArea,playerID,dealPoker);
            setTimeout(()=>{this._gameRound.localRoundTurn()},1000);
        },2000);
    };


};
