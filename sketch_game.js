
//fish vars
let school, angle;

//text vars
const letters = []
const txt = "A GODLESS INTERLUDE "
const clr = "white"

let txtindex = 0

// Control the resolution and text scale
let res;
let scale;

// Control margin and spacing between letters
let margin;
let xSpacing;
let ySpacing;
let maxDist;

// Control speed of text movement
const speed = 0.015


console.log('press and drag mouse to attract fish')
console.log('the larger the screen the better the effect!')


function reset() {
	scale = res / 270;
	margin = 40*scale;
	xSpacing = 10*scale;
	ySpacing = 13*scale;
	maxDist = 200*scale;
}


function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("mySketchGame");
  res =	Math.min(windowWidth, windowHeight);
	reset();
  createCanvas(windowWidth, windowHeight-125);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  
  //fish array setup  
  school = new School();
  
  //randomizes position of fish and places 50 on screen
  //note : change i<"50" to change # of fish on screen
  for (let i = 0; i < 50; i++) {
    let f = new Fish((random(windowWidth), random(windowHeight)));
    school.addFish(f);
    }
  
	// Text itteration over grid positions, minus some margins
	for (let y = margin; y <= height - margin; y += ySpacing) {
    for (let x = margin; x <= width - margin; x += xSpacing) {
      letters.push({
				x, 
				y, 
				clr,
				origX: x,
				origY: y,
				targetX: x, 
				targetY: y,
				txt: txt[txtindex]
			})	
      txtindex = (txtindex + 1) % txt.length;
    }
  }
}


//defining class School contains array of fishes
class School {
  constructor() {
    this.fishes = [];
  }
  run() {
    for (let fish of this.fishes) {
      // Pass the entire list of fishes to each  individual fish in the array
      fish.run(this.fishes);
    }
  }
  addFish(f) {
    this.fishes.push(f);
  }
}



function draw() {
  background(0);
  school.run();	
  
  // For each letter...
  for (let letter of letters) {
		// Calculate target XY based on distance from mouse
    const d = dist(letter.origX, letter.origY, mouseX, mouseY)

		// Set the text size based on distance from mouse
    textSize(map(d, 0, maxDist/2, 15*scale, scale*5, true))
    if(textSize == true){
      textStyle(BOLD)
    }
    //set opacity('spotlight effect')
    let a = (map(d, 0, scale*25, 100*scale, scale*10, true))
    
		// Draw letter 
    fill(255, 255, 255, a);
    text(letter.txt, letter.x, letter.y)
  }
}


class Fish {
  //defining class Fish
  //note : velocity = speed & acceleration = speed at which velocity changes
  constructor(x, y) {
    this.position = createVector(x, y)
    this.color = color(random(50, 150), random(50, 150), random(200, 255), random(50, 230)); 
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    //max speed
    this.maxVel = 5;
    //max steering/turning force
    this.maxForce = 0.05;
    this.size = 15
    this.offset = 1;
  }
  
  run(fishes) {
    this.school(fishes);
    this.update();
    this.edges();
    this.display();
  }
    
  //constantly refreshing the following
  update() {
    //updates velocity based on acceleration
    this.velocity.add(this.acceleration);
    //limits max Velocity
    this.velocity.limit(this.maxVel);
    //changes pos based on velocity
    this.position.add(this.velocity);
    //resets acceleration
    this.acceleration.mult(0);
    this.edges();
    this.seek();
  }
  
  //draws fish
  display() {
    let facing = this.velocity.heading();
    fill(this.color);
    push();
    translate(this.position.x, this.position.y);
    rotate(facing);
    textSize(this.size);
    text('><>', 0, 0);
    pop();
  }
  
  //fish wraps around to other side of screen
  edges(){
if (this.position.x < -this.size) {
      this.position.x = width + this.size;
    }
    if (this.position.x > width + this.size) {
      this.position.x = -this.size;
    }
    if (this.position.y > height + this.size) {
      this.position.y = -this.size;
    }
    if (this.position.y < -this.size) {
      this.position.y = height + this.size;
    }
  }

 //sets the direction the fish should turn/steer towards 
  seek(){
      if (mouseIsPressed){
    let target = createVector(mouseX, mouseY);
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(5);
    //steer = desired - velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    //limit to max steering force
    steer.limit(this.maxForce);
    this.applyForce(steer);
    }
    //when mouse isn't pressed, fish travel normally
    else{
        this.position.add(this.velocity);
    }
  }
  
//defines applyForce
  applyForce(force) {
    this.acceleration.add(force);
  }
  
//when steering is calculated follow directs fish towards mouse
  follow() {
    if ((mouseIsPressed) && (this.offset > 0)) {
      let desired = p5.Vector.sub(createVector(this.offset - 1, this.offset - 1), createVector(this.position.x, this.position.y));
      desired.setMag(5);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
  }
    else{
        this.position.add(this.velocity);
    }
  }
  
  // Separation checks for nearby fish and steers away
  school(fishes) {
    let separation = this.separate(fishes);
    this.applyForce(separation);
}
  
  separate(fishes) {
    let desiredSeparation = 40.0;
    let steer = createVector(0, 0);
    let count = 0;

    // For every fish in the system, check if it's too close
    for (let fish of fishes) {
      let distanceToNeighbor = p5.Vector.dist(this.position, fish.position);

      // If the distance is greater than 0 and less than desiredSeparation
      if (distanceToNeighbor > 0 && distanceToNeighbor < desiredSeparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, fish.position);
        diff.normalize();

        // Scale by distance
        diff.div(distanceToNeighbor);
        steer.add(diff);

        // Keep track of how many
        count++;
      }
    }

    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      //Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxVel);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }
}