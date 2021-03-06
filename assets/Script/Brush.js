cc.Class({
    extends: cc.Component,
 
    properties: {

    },
 
    // LIFE-CYCLE CALLBACKS:
    start (){

    },
 
    onLoad () {
        this.ctx = this.node.getComponent(cc.Graphics);
    },

    setBrushPos (x, y) {
        // set point
        this.ctx.moveTo(x, y);
    },
 
    setBrushLineWidth(lineWidth) {
        // width
        this.ctx.lineWidth = lineWidth;
    },
 
    setBrushColor(color) {
        // set color
        this.ctx.strokeColor = color;
        this.ctx.fillColor = color;
    },

    nonDraw(){
        this.ctx.opacity = 0;
    },
 
    drawTo (x, y) {
        this.ctx.opacity = 255;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.moveTo(x, y);
    },
    clear (){
        this.ctx.clear();
    },
    close (){
        this.ctx.close();
    },
});