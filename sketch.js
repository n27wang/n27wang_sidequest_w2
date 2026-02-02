// --------------------------------------------------
// PANIC BLOB with MISCHIEF MECHANIC
// --------------------------------------------------

let blob = {
  x: 240,
  y: 160,
  r: 30,
  points: 48,
  wobble: 14,
  wobbleFreq: 1.6,
  t: 0,
  tSpeed: 0.05, // faster breathing = panic
  vx: 2,
  vy: 2,
};

// Small map objects (snacks)
let objects = [];

function setup() {
  createCanvas(480, 320);
  noStroke();

  // Create objects on the map
  for (let i = 0; i < 6; i++) {
    objects.push({
      x: random(40, width - 40),
      y: random(40, height - 40),
      r: 8,
      stolen: false,
    });
  }

  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // Panic background flicker
  background(255, 220 + sin(frameCount * 0.2) * 20, 220);

  // Time update
  blob.t += blob.tSpeed;

  // Nervous movement
  blob.x += blob.vx + random(-1, 1);
  blob.y += blob.vy + random(-1, 1);

  // Bounce off walls
  if (blob.x < 40 || blob.x > width - 40) blob.vx *= -1;
  if (blob.y < 40 || blob.y > height - 40) blob.vy *= -1;

  drawBlob();
  drawObjects();
  checkMischief();

  fill(0);
  text("Panic Blob: bumps & steals objects", 10, 18);
}

// --------------------------------------------------
// Draw the blob
// --------------------------------------------------
function drawBlob() {
  fill(255, 80, 80); // panic red

  beginShape();
  for (let i = 0; i < blob.points; i++) {
    const a = (i / blob.points) * TAU;

    const n = noise(
      cos(a) * blob.wobbleFreq + 100,
      sin(a) * blob.wobbleFreq + 100,
      blob.t,
    );

    const r = blob.r + map(n, 0, 1, -blob.wobble, blob.wobble);
    vertex(blob.x + cos(a) * r, blob.y + sin(a) * r);
  }
  endShape(CLOSE);
}

// --------------------------------------------------
// Draw map objects
// --------------------------------------------------
function drawObjects() {
  for (let obj of objects) {
    if (!obj.stolen) {
      fill(60, 100, 255);
      ellipse(obj.x, obj.y, obj.r * 2);
    }
  }
}

// --------------------------------------------------
// Mischief mechanic
// --------------------------------------------------
function checkMischief() {
  for (let obj of objects) {
    if (obj.stolen) continue;

    let d = dist(blob.x, blob.y, obj.x, obj.y);

    if (d < blob.r + obj.r) {
      // 50% bump, 50% steal
      if (random() < 0.5) {
        // bump object away
        obj.x += random(-30, 30);
        obj.y += random(-30, 30);
      } else {
        // steal object
        obj.stolen = true;
      }
    }
  }
}
