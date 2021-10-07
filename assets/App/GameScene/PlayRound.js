import Model from "../../GameFramework/MVC/Model";

export default class PlayRound extends Model{
    round = 0;

    constructor(){
        super();
        this.on('GameOver');
    }
    
}