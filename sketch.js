/*
p5.js script for Pong game
David Norman Diaz Estrada
August 2023
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  leftPaddle = new paddle(true);
  rightPaddle = new paddle(false);
  ball1 = new ball();
}

function draw() {
  background(220);
  leftPaddle.show()
  rightPaddle.show()
  ball1.update()
  ball1.show()
  checkKeys()
}


class paddle{
  constructor(isLeft){
    this.width=20;
    this.height=150;
    this.y=windowHeight/2;
    this.radius=10
    this.speed=10

    if (isLeft){
      this.x=20;
      this.color='#CC0000';
    }
    else{
      this.x=windowWidth-20
      this.color='#00CC00';
    }
    

  }

  show() {
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

  update(direction){
    this.y=this.y+direction*this.speed
    //ensure the paddle does not go outside the window:
    this.y=min(max(this.y,this.height/2),windowHeight-this.height/2) 
  }

}


function checkKeys() {
  // right paddle
  if (keyIsDown(UP_ARROW)) {
    rightPaddle.update(direction=-1); // Move the object up
  } else if (keyIsDown(DOWN_ARROW)) {
    rightPaddle.update(direction=1); // Move the object down
  }
  // left paddle
  if (keyIsDown(87)) {//W -> 87 ASCII key code
    leftPaddle.update(direction=-1); // Move the object up
  } else if (keyIsDown(83)) {//S -> 83 ASCII key code
    leftPaddle.update(direction=1); // Move the object down
  }
}


class ball{
  constructor(){
    this.x=windowWidth/2;
    this.y=windowHeight/2;
    this.diameter=40;
    this.color="#0000CC"
    this.speed=5;
    this.Xdirection=-1
    this.Ydirection=-1
  }

  show(){
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  update(){
    this.x=this.x+this.Xdirection*this.speed
    this.y=this.y+this.Ydirection*this.speed
    //ensure ball bounces when hitting top/bottom of window limits
    if(this.y-this.diameter/2<=0){//ball hits top
      this.y=this.diameter/2;
      this.Ydirection=1}
    else if(this.y+this.diameter/2>=windowHeight){//ball hits bottom
      this.y=windowHeight-this.diameter/2;
      this.Ydirection=-1}
  }

}