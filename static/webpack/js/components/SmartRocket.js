import React from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { DARK_COLOR } from '../consts';

function sketch(p) {
  const masterParent = document.getElementById('smart-rocket'),
    lifespan = 400,
    popSize = 25,
    maxForce = 0.2,
    targetRadius = 16,
    obstacles = [];
  let population = null,
    target = null,
    generationP = null,
    lifespanP = null,
    skipGeneration = null,
    count = 0,
    generationCount = 1;

  function DNA(genes) {
    if (genes) {
      this.genes = genes;
    } else {
      this.genes = [];
      for (let i = 0; i < lifespan; i += 1) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxForce);
      }
    }

    this.crossover = (partner) => {
      const newGenes = [],
        mid = p.floor(p.random(this.genes.length));
      for (let i = 0; i < this.genes.length; i += 1) {
        if (i > mid) {
          newGenes[i] = this.genes[i];
        } else {
          newGenes[i] = partner.genes[i];
        }
      }
      return new DNA(newGenes);
    };

    this.mutation = () => {
      for (let i = 0; i < this.genes.length; i += 1) {
        if (p.random(1) < 0.005) {
          this.genes[i] = p5.Vector.random2D();
          this.genes[i].setMag(maxForce);
        }
      }
    };
  }

  function Rocket(dna) {
    this.pos = p.createVector(p.width / 2, p.height);
    this.vel = p.createVector();
    this.acc = p.createVector();
    this.completed = false;
    this.crashed = false;

    if (dna) {
      this.dna = dna;
    } else {
      this.dna = new DNA();
    }

    this.applyForce = (force) => {
      this.acc.add(force);
    };

    this.calcFitness = () => {
      this.fitness = p.map(this.d, 0, p.width, 100, 0);
      if (this.completed) {
        this.fitness *= p.map(this.completedC, 0, lifespan, 500, 5);
      } else if (this.crashed) {
        this.fitness /= 100;
      }
    };

    this.update = () => {
      if (!this.completed && !this.crashed) {
        this.applyForce(this.dna.genes[count]);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.limit(4);

        this.d = p.dist(this.pos.x, this.pos.y, target.x, target.y);
        if (this.d < targetRadius - 5) {
          this.completed = true;
          this.pos.x = target.x;
          this.pos.y = target.y;
          this.completedC = count;
          this.d = 0;
        } else if (this.pos.x > p.width || this.pos.x < 0 || this.pos.y > p.height || this.pos.y < 0) {
          this.crashed = true;
        } else {
          for (let i = 0; i < obstacles.length; i += 1) {
            if (this.pos.x > obstacles[i].x - (obstacles[i].width / 2)
              && this.pos.x < obstacles[i].x + (obstacles[i].width / 2)
              && this.pos.y > obstacles[i].y - (obstacles[i].height / 2)
              && this.pos.y < obstacles[i].y + (obstacles[i].height / 2)) {
              this.crashed = true;
              break;
            }
          }
        }
      }
    };

    this.show = () => {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      p.rotate(this.vel.heading());
      p.fill(255, 150);
      p.rect(0, 0, 25, 5);
      p.pop();
    };
  }

  function Population() {
    this.rockets = [];
    for (let i = 0; i < popSize; i += 1) {
      this.rockets[i] = new Rocket();
    }

    this.evaluate = () => {
      let maxfit = 0;
      for (let i = 0; i < popSize; i += 1) {
        this.rockets[i].calcFitness();
        if (this.rockets[i].fitness > maxfit) {
          maxfit = this.rockets[i].fitness;
        }
      }
      for (let i = 0; i < popSize; i += 1) {
        this.rockets[i].fitness /= maxfit;
        this.rockets[i].fitness *= 100;
      }

      this.matingpool = [];
      for (let i = 0; i < popSize; i += 1) {
        for (let j = 0; j < this.rockets[i].fitness; j += 1) {
          this.matingpool.push(this.rockets[i]);
        }
      }
    };

    this.selection = () => {
      const newRockets = [];
      for (let i = 0; i < this.rockets.length; i += 1) {
        const parentADna = p.random(this.matingpool).dna,
          parentBDna = p.random(this.matingpool).dna,
          childDna = parentADna.crossover(parentBDna);
        childDna.mutation();
        newRockets[i] = new Rocket(childDna);
      }
      this.rockets = newRockets;
    };

    this.run = (show) => {
      for (let i = 0; i < popSize; i += 1) {
        this.rockets[i].update();
        if (show) this.rockets[i].show();
      }
      count += 1;
      if (show) lifespanP.html(`Lifespan: ${count}`);
      if (count >= lifespan) {
        population.evaluate();
        population.selection();
        count = 0;
        generationCount += 1;
        if (show) generationP.html(`Generation: ${generationCount}`);
      }
    };
  }

  function Obstacle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.show = () => {
      p.rect(this.x, this.y, this.width, this.height);
    };
  }

  function setWindow() {
    generationP.position((p.windowWidth / 2) - 200, p.windowHeight * 0.14);
    lifespanP.position((p.windowWidth / 2) + 110, p.windowHeight * 0.14);
    skipGeneration.position((p.windowWidth / 2) - 60, p.windowHeight * 0.1);
  }

  p.setup = () => {
    const canvas = p.createCanvas(600, 600);
    canvas.parent(masterParent);
    generationP = p.createP(`Generation: ${generationCount}`);
    generationP.parent(masterParent);
    generationP.class('text-light');
    lifespanP = p.createP(`Lifespan: ${count}`);
    lifespanP.parent(masterParent);
    lifespanP.class('text-light');
    skipGeneration = p.createButton('Skip 10 Generation');
    skipGeneration.class('btn btn-light btn-sm');
    skipGeneration.parent(masterParent);
    skipGeneration.mouseClicked(() => {
      const currentGeneration = generationCount;
      while (generationCount < currentGeneration + 10) {
        population.run(false);
      }
      generationP.html(`Generation: ${generationCount}`);
    });
    obstacles[0] = new Obstacle(p.width / 2, 400, 400, 20);
    population = new Population();
    target = p.createVector(p.width / 2, 50);
    p.frameRate(60);
    setWindow();

    p.noStroke();
    p.rectMode(p.CENTER);
  };

  p.draw = () => {
    p.background(DARK_COLOR);
    population.run(true);
    for (let i = 0; i < obstacles.length; i += 1) obstacles[i].show();
    p.ellipse(target.x, target.y, targetRadius, targetRadius);
  };

  p.windowResized = () => {
    setWindow();
  };
}

class SmartRocket extends React.Component {
  componentDidMount() {
    if (this.p5Obj == null) this.p5Obj = new p5(sketch); // eslint-disable-line new-cap
  }

  componentWillUnmount() {
    if (this.p5Obj) {
      this.p5Obj.remove();
      this.p5Obj = null;
    }
  }

  render() {
    return (
      <div id="smart-rocket" className="center-display full-screen theme-dark" />
    );
  }
}


export default SmartRocket;
