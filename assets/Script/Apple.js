cc.Class({
    extends: cc.Component,
    
    properties: {
        // Khi khoảng cách giữa ngôi sao và nhân vật chính nhỏ hơn giá trị này, bộ sưu tập sẽ được hoàn thành
        _isLive: true,  

    },
   
    isDestroy(){
        this.node.destroy();
    }
    // update: function (dt) {
    //     this.onPicked();
    // },
});
