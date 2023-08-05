/*
p5.js script for Pong game
David Norman Diaz Estrada
https://github.com/DavidDZ7/pong
August 2023
 */

leftColor='#CC0000';
rightColor='#00CC00';
ballColor="#0000CC";
ballSpeed=4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  leftPaddle = new paddle(isLeft=true);
  rightPaddle = new paddle(isLeft=false);
  ball1 = new ball();
  leftScore = new scoreText(isLeft=true);
  rightScore = new scoreText(isLeft=false);
}

function draw() {
  background(220);
  leftPaddle.show();
  rightPaddle.show();

  ball1.update(leftPaddle,rightPaddle);
  score=ball1.checkIfScored();
  ball1.show();

  if (score!=null){
    if (score=="left"){leftScore.score+=1;}
    else{rightScore.score+=1;}
  }
  
  leftScore.show();
  rightScore.show();

  checkKeys();
}


class paddle{
  constructor(isLeft){
    this.width=20;
    this.height=150;
    this.y=windowHeight/2;
    this.radius=10;
    this.speed=10;

    if (isLeft){
      this.x=this.width;
      this.color=leftColor;
    }
    else{
      this.x=windowWidth-this.width;
      this.color=rightColor;
    }
    

  }

  show() {
    fill(this.color);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

  update(direction){
    this.y=this.y+direction*this.speed;
    //ensure the paddle does not go outside the window:
    this.y=min(max(this.y,this.height/2),windowHeight-this.height/2);
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
    this.color=ballColor;
    this.speed=ballSpeed;
    this.Xdirection=-1;
    this.Ydirection=-1;
  }

  show(){
    fill(this.color);
    strokeWeight(0); 
    circle(this.x, this.y, this.diameter);
  }

  update(leftPaddle,rightPaddle){
    this.x=this.x+this.Xdirection*this.speed;
    this.y=this.y+this.Ydirection*this.speed;
    //ensure ball bounces when hitting top of window:
    if(this.y-this.diameter/2<=0){
      this.y=this.diameter/2;
      this.Ydirection=1;}
    //ensure ball bounces when hitting bottom of window:
    else if(this.y+this.diameter/2>=windowHeight){
      this.y=windowHeight-this.diameter/2;
      this.Ydirection=-1;}    
    //ensure ball bounces when hitting left paddle:
    if(this.y>=leftPaddle.y-leftPaddle.height/2 && this.y<=leftPaddle.y+leftPaddle.height/2 && (this.x-this.diameter/2)<=1.5*leftPaddle.width){
      this.Xdirection=1
    }
    //ensure ball bounces when hitting right paddle:
    else if (this.y>=rightPaddle.y-rightPaddle.height/2 && this.y<=rightPaddle.y+rightPaddle.height/2 && (this.x+this.diameter/2)>=windowWidth-1.5*rightPaddle.width){
      this.Xdirection=-1;
    }
  }

  checkIfScored(){
    //check when player scores (ball outside min X or max X):
    if (this.x-this.diameter/2<=0){//Right player has scored
      this.x=windowWidth/2;
      this.y=windowHeight/2;
      return "right";
    }
    else if (this.x+this.diameter/2>=windowWidth){//left player has scored
      this.x=windowWidth/2;
      this.y=windowHeight/2;
      return "left";
    }

    return null //when no one has scored
  }

}

class scoreText{
  constructor(isLeft){
    this.score=0;
    this.y=30;
    if(isLeft){
      this.color=leftColor;
      this.x=0;
    }
    else{
      this.color=rightColor;
      this.x=windowWidth-170;
    }
  }
  show(){
    fill(20);
    strokeWeight(4); 
    textSize(30);
    var s='SCORE: '+str(this.score);
    text(s,this.x,this.y);
  }
}