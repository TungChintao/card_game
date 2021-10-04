import { Singleton } from "../Base/Singleton";

export default class EventManger extends Singleton{

    /**
     * @description add listener
     * @public
     * @param {string} callName name listener
     * @param {function} func function for call
     * @returns {function} unsubscribe function
     */
    on(callName, func, target = undefined){
        if(!this.subscribes[callName]) { this.subscribes[callName] = []; }
        this.subscribes[callName].push({f: func, del: false, target: target});
        return ()=>{
            this.off(callName, func);
        }
        
    };

    /**
     * @description like "on" but just run once
     * @public
     * @param {string} callName name listener
     * @param {function} func function for call
     * @para {object} target target for call
     * @returns {function} unsubscribe function
     */
    once (callName, func,target = undefined){
        let unsubscribe = undefined;
        unsubscribe = this.onabort(callName,(...args)=>{
            func.apply(target,args);
            unsubscribe();
        }, target);
        return unsubscribe;
    };

    /**
     * @description dispatch all listenner
     * @public
     * @param {string} callName name listener
     * @param {any} args arguments for send to on(...)
     * @returns {array} return all listen can return data
     */
    emit(callName, ...args){
        ++this.m_emit_reference_count;
        if(this.subscribes[callName]){
            this.subscribes[callName].forEach((v) => {
                if(v.f && !v.del) { v.f.apply(v.target, args); }
            });
        }
    };

       /**
     * @description unsubscribe listener
     * @public
     * @param {string} callName name listener
     * @param {function} func the function the you want to unsubscribe If not defined, all subscriptions will be canceled
     * @returns {function} nothing
     */
    off(callName, func) {
        if(this.subscrirbes[callName]){
            if(func){
                this.subscribes[callName].forEach( v => {
                    if(v.f === func) { v.del = true;}
                });
            }
            else{
                this.subscribes[callName].forEach( v => {
                    v.del = true;
                });
            }
        }
        if(this.m_emit_reference_count === 0){
            this.clear();
        }
    }

    /**
     * @description clear marked listeneres
     */
    clear(){
        for(let name in this.subscribes){
            this.subscribes[name] = this.subscribes[name].filter((v) => !v.del);
        }
    }

    subscribes = {};
    m_emit_reference_count = 0;

}