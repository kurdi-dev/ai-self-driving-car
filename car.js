class Car {

    constructor(x, y, width, height, carType){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.carType = carType;

        switch(carType){
            case "MAIN":
                this.speed = 0;
                this.acceleration = 0.5;
                this.maxSpeed = 3;
                this.friction= 0.05;
                break;
            case "AI":
                this.speed = 0;
                this.acceleration = 0.4;
                this.maxSpeed = 3;
                this.friction= 0.05;
                break;
            case "DUMMY":
                this.speed = 0;
                this.acceleration = 0.4;
                this.maxSpeed = 2;
                this.friction= 0.05;
                break;
        }


        
        this.angle = 0;
        this.damaged=false;

        this.useBrain= carType=="AI";

        if(carType != "DUMMY"){
        this.sensor = new Sensor(this)
        this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(carType);
        
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#movment();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic) 
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset)
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad= Math.hypot(this.width,this.height)/2;
        const alpha =  Math.atan2(this.width,this.height);
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*rad ,
            y: this.y-Math.cos(this.angle-alpha)*rad});
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*rad ,
            y: this.y-Math.cos(this.angle+alpha)*rad});
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad ,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad});
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad ,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad});

        return points;
    }

    #movment(){
        // forward and reverse
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        if(this.speed > this.maxSpeed) { this.speed = this.maxSpeed;}
        if(this.speed < -this.maxSpeed/2) { this.speed = -this.maxSpeed/2;}
        if(this.speed > 0) { this.speed -= this.friction;}
        if(this.speed < 0) { this.speed += this.friction;}
        if(Math.abs(this.speed)<this.friction){this.speed = 0;}

        // sterring
        if(this.speed != 0){
            const flip = this.speed > 0? 1: -1;

            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }
         
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;

    }
    
    draw(ctx){
        
        if(this.carType != "DUMMY"){
            if(this.damaged){ctx.fillStyle = "gray"}else{ctx.fillStyle = "green";}
        }else{
            ctx.fillStyle = "blue"
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y)
        for(let i =1;i< this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y)
        }
        ctx.fill();
        this.sensor && this.sensor.draw(ctx);
    }
}