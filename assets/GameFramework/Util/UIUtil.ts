export default class UIUtil {
    static move(this, node, targetParent){
        let wp = node.convertToWorldSpaceAR(cc.v2(0,0));
        let pp = targetParent.convertToNodeSpaceAR(wp);

        node.removeFromParent(false);
        node.position = pp;
        targetParent.addChild(node);

        return this;
    };
};