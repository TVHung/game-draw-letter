cc.Class({
    extends: cc.Component,
    
    properties: {
        clickSound:{
            default: null,
            type: cc.AudioClip
        },
        _isLive: true,  

    },
    
    onLoad(){
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchApple, this); 
    },

    onTouchApple(){
        this.node.active = false;
        cc.audioEngine.play(this.clickSound, false, 1);
    },

    isDestroy(){
        this.node.destroy();
    }
    // update: function (dt) {
    //     this.onPicked();
    // },
});
