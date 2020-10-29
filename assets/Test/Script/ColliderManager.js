// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
 
cc.Class({
    extends: cc.Component,
 
    editor: {
        menu: "CustomComponent/CollisionManagement",
    },
 
    properties: {
        _isCollider: false
    },
 
    onLoad () {
        var colliderManager = cc.director.getCollisionManager();
        colliderManager.enabled = true;    //bật hệ thống bắt va chạm
        // colliderManager.enabledDebugDraw = true;    //hiện vùng va chạm
    },
 
    start () {
        this.gameComponent = cc.find("Canvas").getComponent("Game");
    },
 
    onCollisionEnter (other, self) {  
        if (this.node.group === cc.game.groupList[2]) {     // gr 2 là node check
            this._isCollider = true;
            this.gameComponent._appleNode = this.node;      //node va chạm chính là _appleNode
        }
    },
 
    onCollisionExit (other, self) {                             //tắt va chạm
        if (this.node.group === cc.game.groupList[2]) {
            this._isCollider = false;
        }
    },
 
    initGroup () {
        if (this.editorGroup === Group.Default) {
            this.contrastGroup = this.GroupName[0];         //nhóm ánh xạ đến
        }
        else if (this.editorGroup === Group.Check) {
            this.contrastGroup = this.GroupName[1];
        }
        else if (this.editorGroup === Group.Apple) {
            this.contrastGroup = this.GroupName[2];
        }
    }
    // update (dt) {},
});
 