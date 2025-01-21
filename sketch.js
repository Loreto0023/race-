let redLight, yellowLight, greenLight;
let car1, car2;

let currentState = "red"; // Estado inicial del semáforo
let lastChangeTime = 0; // Para evitar cambios demasiado rápidos
let changeDelay = 500; // Tiempo mínimo entre cambios (en milisegundos)
let gameStarted = false; // Indica si la carrera ha comenzado
let winner = null; // Ganador de la carrera

function setup() {
  createCanvas (windowWidth, windowHeight);
  noStroke();

  // Definir las luces
  redLight = new Light(width / 2, 150, color(255, 0, 0)); // Luz roja
  yellowLight = new Light(width / 2, 250, color(255, 255, 0)); // Luz amarilla
  greenLight = new Light(width / 2, 350, color(0, 255, 0)); // Luz verde

  // Crear coches
  car1 = new Car(width / 2 - 100, height - 50, color(0, 0, 255)); // Coche azul
  car2 = new Car(width / 2 + 20, height - 50, color(0, 255, 0)); // Coche verde
}

function draw() {
  background(0);

  // Dibujar la meta
  drawFinishLine();

  // Mostrar las luces como rayos
  redLight.show();
  yellowLight.show();
  greenLight.show();

  // Mostrar los coches
  car1.show();
  car2.show();

  // Verificar si alguien ganó
  checkWinner();

  // Activar las luces correspondientes según el estado actual
  if (currentState === "red") {
    redLight.activate();
    yellowLight.deactivate();
    greenLight.deactivate();
  } else if (currentState === "yellow") {
    redLight.deactivate();
    yellowLight.activate();
    greenLight.deactivate();
  } else if (currentState === "green") {
    redLight.deactivate();
    yellowLight.deactivate();
    greenLight.activate();
    gameStarted = true; // Permitir que los coches se muevan
  }

  // Mostrar mensaje de ganador
  if (winner) {
    textSize(32);
    fill(255);
    textAlign(CENTER);
    text(`${winner} gana la carrera!`, width / 2, height / 2);
    noLoop(); // Detener el juego
  }
}

function keyPressed() {
  // Movimiento del coche azul
  if (gameStarted && !winner) {
    if (key === "w" || key === "W") {
      car1.move(-1); // Mover hacia arriba
    } else if (key === "s" || key === "S") {
      car1.move(1); // Mover hacia abajo
    }

    // Movimiento del coche verde
    if (keyCode === UP_ARROW) {
      car2.move(-1); // Mover hacia arriba
    } else if (keyCode === DOWN_ARROW) {
      car2.move(1); // Mover hacia abajo
    }
  }
}

function mousePressed() {
  // Cambiar el estado del semáforo según dónde se haga clic
  if (millis() - lastChangeTime > changeDelay) {
    if (dist(mouseX, mouseY, width / 2, 150) < 50) {
      changeLight("red");
    } else if (dist(mouseX, mouseY, width / 2, 250) < 50) {
      changeLight("yellow");
    } else if (dist(mouseX, mouseY, width / 2, 350) < 50) {
      changeLight("green");
    }
  }
}

function changeLight(newState) {
  // Cambiar el estado del semáforo si ha pasado suficiente tiempo
  currentState = newState;
  lastChangeTime = millis();
}

function drawFinishLine() {
  stroke(255);
  strokeWeight(4);
  line(0, 100, width, 100); // Línea de meta
  noStroke();
}

function checkWinner() {
  if (!winner) {
    if (car1.pos.y <= 100) {
      winner = "¡Coche Azul";
    } else if (car2.pos.y <= 100) {
      winner = "¡Coche Verde";
    }
  }
}

class Light {
  constructor(x, y, c) {
    this.pos = createVector(x, y);
    this.color = c;
    this.isActive = false;
    this.rays = [];
    this.createRays();
  }

  createRays() {
    for (let angle = 0; angle < 360; angle += 10) {
      this.rays.push(new Ray(this.pos, radians(angle), this.color));
    }
  }

  show() {
    if (this.isActive) {
      for (let ray of this.rays) {
        ray.show(true);
      }
    } else {
      for (let ray of this.rays) {
        ray.show(false);
      }
    }
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}

class Ray {
  constructor(pos, dir, color) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(dir);
    this.color = color;
  }

  show(active = true) {
    if (active) {
      stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], 100);
    } else {
      stroke(50);
    }
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 100, this.dir.y * 100);
    pop();
  }
}

class Car {
  constructor(x, y, c) {
    this.pos = createVector(x, y); // Posición inicial del coche
    this.color = c; // Color del coche
    this.speed = 10; // Velocidad del coche
  }

  show() {
    fill(this.color);
    // Dibujar el cuerpo del coche (orientado verticalmente)
    rect(this.pos.x, this.pos.y, 30, 80); // Ajustar ancho y alto del coche para posición vertical

    fill(0); // Color de las ruedas (negro)
    // Dibujar ruedas en la parte superior e inferior
    ellipse(this.pos.x + 5, this.pos.y + 15, 20, 20); // Rueda superior izquierda
    ellipse(this.pos.x + 25, this.pos.y + 15, 20, 20); // Rueda superior derecha
    ellipse(this.pos.x + 5, this.pos.y + 65, 20, 20); // Rueda inferior izquierda
    ellipse(this.pos.x + 25, this.pos.y + 65, 20, 20); // Rueda inferior derecha
  }

  move(direction) {
    this.pos.y += direction * this.speed; // Mover el coche hacia arriba o abajo
    this.pos.y = constrain(this.pos.y, 100, height - 80); // Limitar el movimiento dentro de los bordes
  }
}
