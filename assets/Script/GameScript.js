import GameCtrl from 'GameCtrl';

let GameScript = cc.Class({
    extends: cc.Component,

    properties: {

        _gameCtrl: GameCtrl,

        pokerContainer: cc.Node,

        pokerPrefab: cc.Prefab,

        label: {
            default: null,
            type: cc.Label
        },
    },

    

    start(){
        this.label.string = "It's the Game Scene";
        this._gameCtrl = new GameCtrl();
        this._gameCtrl.Init(this.pokerContainer, this.pokerPrefab);
        this._gameCtrl.Start();
    },
});

