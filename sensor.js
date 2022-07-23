class Sensor{

    constructor(car){
        this.car = car;
        this.rayCount = 10;
        this.rayLength = 150;
        this.raySpread= Math.PI/2; // ray angel 45 degree
        this.rays=[]

        this.readings=[]
    }

    update(roadBorders){
        this.#castRays();
        this.readings = [];
        for( let i = 0; i<this.rayCount; i++){
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders)
            )
        }
    }

    #getReading(ray, roadBorders){
        let touches = [];
        roadBorders.forEach(roadBorder=>{
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorder[0],
                roadBorder[1]
            );
            if(touch){
                touches.push(touch)
            }
        })

        if(touches.length == 0 ){
            return null;
        }else{
            const offsets = touches.map(v => v.offset)
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset == minOffset);
        }
    }
    #castRays(){
        this.rays=[];
        for(let i=0; i < this.rayCount; i++){
            const rayAngle = lerp(
                                    this.raySpread/2,
                                    -this.raySpread/2,
                                    this.rayCount == 1 ? 0.5: i/(this.rayCount-1)
                                )+this.car.angle;
            const start = {x:this.car.x, y:this.car.y};
            const end = {   x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                            y:this.car.y-Math.cos(rayAngle)*this.rayLength}
            this.rays.push([start,end])               
        }
    }

    draw(ctx){
        this.rays.forEach((ray, i)=>{
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle='red';

            let end = ray[1];
            if(this.readings[i]){
                end = this.readings[i]
            }
            ctx.moveTo(ray[0].x,ray[0].y)
            ctx.lineTo(end.x,end.y)
            ctx.stroke();
        })
    }

}