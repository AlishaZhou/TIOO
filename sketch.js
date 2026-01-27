//circle size
let s;

//rotation 
let angle=0;

let speed=0.005;

//positioning
let circleSet1=2;
let circleSet2=25;


function setup() {
    var myCanvas = createCanvas(400, 400);
  myCanvas.parent("mySketch");
  createCanvas(windowWidth, windowHeight);
  background(89, 61, 194);

  noStroke();
  
  //scale circle to windowWidth
  s=windowWidth/99;
}

function draw() {
  
  push();
  translate(-width/6,height/6);
  
  //black + opacity
  background(89, 61, 194, 1);

  //determines new position of ball
  let pos1 = map(cos(angle),-1,1,1*width/3,2*width/3);
  let pos2 = map(sin(angle),-1,1,1*width/3,2*height/3);
  
  //starting pos
  translate(width/2,height/2);
  rotate(angle);
  
  
  for (i=0;i<circleSet1;i++){
    push();
    rotate(i*TWO_PI/circleSet1);
    //moves new pos by pos1
    translate(pos1,0);

    for (j=0;j<circleSet2;j++){
      push();
      rotate(j*TWO_PI/circleSet2);
      translate(pos2,0);

      let r=random(50, 150)
      let g=random(50, 150)
      let b=random(200, 255)         
      fill(r, g, b);
      ellipse(0,0,s/3);
            pop();
          }
    pop();
  }
  
  //add speed to angle
  angle+=speed;
  pop();
  
}