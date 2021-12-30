// @ts-nocheck
import React, { useEffect } from 'react';

const init = function (context, color) {
  color = color || [24, 46.8, 48.2];
  const polyfillAnimFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  let lastframe;
  const currentparticles = [];
  const pendingparticles = [];

  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');

  buffer.width = 20;
  buffer.height = 20;

  const opacities = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 5, 5, 7, 4, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 17, 27, 41, 52,
    56, 34, 23, 15, 11, 4, 9, 5, 1, 0, 0, 0, 0, 0, 0, 1, 45, 63, 57, 45, 78, 66,
    52, 41, 34, 37, 23, 20, 0, 1, 0, 0, 0, 0, 1, 43, 62, 66, 64, 67, 115, 112,
    114, 56, 58, 47, 33, 18, 12, 10, 0, 0, 0, 0, 39, 50, 63, 76, 87, 107, 105,
    112, 128, 104, 69, 64, 29, 18, 21, 15, 0, 0, 0, 7, 42, 52, 85, 91, 103, 126,
    153, 128, 124, 82, 57, 52, 52, 24, 1, 0, 0, 0, 2, 17, 41, 67, 84, 100, 122,
    136, 159, 127, 78, 69, 60, 50, 47, 25, 7, 1, 0, 0, 0, 34, 33, 66, 82, 113,
    138, 149, 168, 175, 82, 142, 133, 70, 62, 41, 25, 6, 0, 0, 0, 18, 39, 55,
    113, 111, 137, 141, 139, 141, 128, 102, 130, 90, 96, 65, 37, 0, 0, 0, 2, 15,
    27, 71, 104, 129, 129, 158, 140, 154, 146, 150, 131, 92, 100, 67, 26, 3, 0,
    0, 0, 0, 46, 73, 104, 124, 145, 135, 122, 107, 120, 122, 101, 98, 96, 35,
    38, 7, 2, 0, 0, 0, 50, 58, 91, 124, 127, 139, 118, 121, 177, 156, 88, 90,
    88, 28, 43, 3, 0, 0, 0, 0, 30, 62, 68, 91, 83, 117, 89, 139, 139, 99, 105,
    77, 32, 1, 1, 0, 0, 0, 0, 0, 16, 21, 8, 45, 101, 125, 118, 87, 110, 86, 64,
    39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 28, 79, 79, 117, 122, 88, 84, 54, 46, 11,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 55, 61, 68, 71, 30, 16, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 23, 25, 20, 12, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 2, 12, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const data = bctx.createImageData(20, 20);
  const d = data.data;

  for (const i = 0; i < d.length; i += 4) {
    d[i] = color[0];
    d[i + 1] = color[1];
    d[i + 2] = color[2];
    d[i + 3] = opacities[i / 4];
  }

  bctx.putImageData(data, 0, 0);

  const imagewidth = 15 * 5;
  const imageheight = 8 * 5;

  function particle(x, y, l) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.vx = (Math.random() * 8 - 4) / 100;
    this.startvy = -(Math.random() * 30 + 10) / 100;
    this.vy = this.startvy;
    this.scale = Math.random() * 0.5;
    this.lifetime = Math.random() * l + l / 2;
    this.finalscale = 5 + this.scale + Math.random();

    this.update = function (deltatime) {
      this.x += this.vx * deltatime;
      this.y += this.vy * deltatime;
      const frac = Math.pow(this.age / this.lifetime, 0.5);
      this.vy = (1 - frac) * this.startvy;
      this.age += deltatime;
      this.scale = frac * this.finalscale;
    };

    this.draw = function () {
      context.globalAlpha =
        (1 - Math.abs(1 - (2 * this.age) / this.lifetime)) / 8;
      const off = (this.scale * imagewidth) / 2;
      const xmin = this.x - off;
      const xmax = xmin + this.scale * imageheight;
      const ymin = this.y - off;
      const ymax = ymin + this.scale * imageheight;
      context.drawImage(buffer, xmin, ymin, xmax - xmin, ymax - ymin);
    };
  }

  function addparticles(x, y, n, lifetime) {
    lifetime = lifetime || 4000;
    n = n || 10;
    if (n < 1)
      return (
        Math.random() <= n &&
        pendingparticles.push(new particle(x, y, lifetime))
      );
    for (const i = 0; i < n; i++) {
      pendingparticles.push(new particle(x, y, lifetime));
    }
  }

  function updateanddrawparticles(deltatime) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    deltatime = deltatime || 16;
    const newparticles = [];
    currentparticles = currentparticles.concat(pendingparticles);
    pendingparticles = [];

    currentparticles.forEach(function (p) {
      p.update(deltatime);
      if (p.age < p.lifetime) {
        p.draw();
        newparticles.push(p);
      }
    });
    currentparticles = newparticles;
  }

  function frame(time) {
    if (running) {
      const deltat = time - lastframe;
      lastframe = time;

      updateanddrawparticles(deltat);

      polyfillAnimFrame(frame);
    }
  }

  const running = false;
  function start() {
    running = true;
    polyfillAnimFrame(function (time) {
      lastframe = time;
      polyfillAnimFrame(frame);
    });
  }

  function stop() {
    running = false;
  }

  return {
    start: start,
    stop: stop,
    step: updateanddrawparticles,
    addsmoke: addparticles,
  };
};

const SmokeMachine = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const party = init(ctx, [31, 87, 184]);
    party.start(); // start animating

    setInterval(function () {
      party.addsmoke(innerWidth / 2, innerHeight, 1);
    }, 100);
  }, []);

  return (
    <canvas
      id="canvas"
      width="50"
      height="898"
      style={{
        WebkitMaskImage:
          '-webkit-gradient(linear, left 90%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))',
      }}
    ></canvas>
  );
};

export default SmokeMachine;
