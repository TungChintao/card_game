import Event from '../Base/Event'

var View = cc.Class({
    extends: cc.Component,
    
    ctor(){
        this. _Event = new Event();
    },

    onLoad(){ this._Event = new Event(); },

    on(callName, func, target = undefined){ return this._Event.on(callName, func, target); },

    once (callName, func,target = undefined){ return this._Event.once(callName, func, target); },

    emit(callName, ...args){ return this._Event.emit(callName, ...args); },

    off(callName, func) { return this._Event.off(callName, func); },

});
