// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node = this.node.getComponent(cc.Graphics);
        // setTimeout(()=>{
            // this.arrowTutorial(1);     
        // },0);
        // setTimeout(()=>{
        //     this.arrowTutorial(2);     
        // },2000);
        // setTimeout(()=>{
        //     this.arrowTutorial(3);     
        // },4000);
    },

    start () {
    
    },

    arrowTutorial(order){
        if(order == 1){
            this.node.setPosition(-10, 145);
            this.node.angle = -23;
            var seq = cc.repeat(
                cc.sequence(
                    cc.moveBy(1.5, -97, -272),
                    cc.moveBy(0, 97, 272)
                ), 1);
            
            // cc.tween(this.node)
            //     .to(1.5,{position:cc.v2(-107,-127)})
            //     .to(0,{position:cc.v2(-10,145)})
            //     .to(1.5,{position:cc.v2(-107,-127)})
            //     .to(0,{position:cc.v2(-10,145)})
            //     .start();
        }else if(order == 2){
            this.node.setPosition(10, 145);
            this.node.angle = 23;
            var seq = cc.repeat(
                cc.sequence(
                    cc.moveBy(1.5, 97, -272),
                    cc.moveBy(0, -97, 272)
                ), 1);
        }else{
            this.node.setPosition(-80, -68);
            this.node.angle = 90;
            var seq = cc.repeat(
                cc.sequence(
                    cc.moveBy(1.5, 160, 0),
                    cc.moveBy(0, -160, 0)
                ), 1);
        }
        this.node.runAction(seq);
    },

    update (dt) {

    },
});
