export default class UIUtil {
    static move(this, node, targetParent){
        let wp = node.convertToWorldSpaceAR(cc.v2(0,0));
        let pp = targetParent.convertToNodeSpaceAR(wp);

        node.removeFromParent(false);
        node.position = pp;
        targetParent.addChild(node);

        return this;
    };

    static log(this){
        console.log('UIUtil:log');
        return this;
    };

    static rule(poker, suit){
        if(poker.suit === suit) return true;
        return false;
    }
};