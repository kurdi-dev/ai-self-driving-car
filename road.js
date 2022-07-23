class Road{
    constructor(x, width, laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left= x - width/2;
        this.right= x + width/2;

        const infinity = 10000000;
        this.top= -infinity;
        this.bottom= +infinity;

        const topLeft = {x:this.left, y:this.top}
        const bottomLeft = {x:this.left, y:this.bottom}
        const topRight = {x:this.right, y:this.top}
        const bottomRight = {x:this.right, y:this.bottom}
        
        this.boarders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]

    }

    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+ Math.min(laneIndex, this.laneCount-1)*laneWidth;
       
    }

    draw(ctx){
       ctx.lineWidth = 5;
       ctx.strokeStyle =  "#f6d315";

       for (let i = 0; i <= this.laneCount; i++) {
        const x = lerp(
            this.left,
            this.right,
            i/this.laneCount
        )

        if( i>0 && i < this.laneCount){
            ctx.setLineDash([20,20]);
        }else{
            ctx.setLineDash([]);
        }
        ctx.beginPath();
        ctx.moveTo(x, this.top)
        ctx.lineTo(x, this.bottom)
        ctx.stroke();
       }
    }  
}