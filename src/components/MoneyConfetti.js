import React, { useEffect } from 'react';

export default function MoneyConfetti() {
  const canvasRef = React.useRef(null);

  function range_random(gteq, lt) {
    return gteq + Math.random() * (lt - gteq);
  }

  let TO_RADIAN = Math.PI / 180;
  let NUM_OF_PIECES = 100;

  useEffect(() => {
    let image_f = new Image();
    image_f.src = 'dollar_front.png';
    let image_r = new Image();
    image_r.src = 'dollar_back.png';

    const canvas = canvasRef.current;
    if (!canvasRef.current) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let context = canvas.getContext('2d');
    let pieces = [];
    let step = 0;
    for (let i = 0; i < NUM_OF_PIECES; i++) {
      pieces.push({
        w: 20,
        h: 10,
        x: range_random(20, canvas.width - 20),
        y: range_random(0, -500),
        vy: range_random(2.5, 3.5),
        ay: range_random(0, 0.1),
        degree: 0,
        vdegree: range_random(-5, 5),
        cyclevsy: range_random(0, 0.4),
        cyclex: range_random(0, 20),
        cyclevx: range_random(0, 0.2),
      });
    }

    let interval_id = setInterval(function () {
      let piece;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (pieces.length == 0) {
        clearInterval(interval_id);
        return;
      }

      // draw
      for (let i in pieces) {
        piece = pieces[i];
        let scaley = Math.sin(step * piece.cyclevsy);

        context.save();
        context.translate(
          piece.x + Math.sin(step * piece.cyclevx) * piece.cyclex,
          piece.y
        );
        context.scale(1, scaley);
        context.rotate(piece.degree * TO_RADIAN);
        if (scaley > 0) {
          context.drawImage(image_f, -40, 0, 80, 35);
        } else {
          context.drawImage(image_r, -40, 0, 80, 35);
        }
        context.restore();

        piece.degree += piece.vdegree;
        piece.y += piece.vy;
        piece.vy += piece.ay;
      }
      // remove
      for (let i = pieces.length - 1; i >= 0; i--) {
        piece = pieces[i];
        if (piece.y > canvas.height) {
          pieces.splice(i, 1);
        }
      }
      step++;
    }, 1000 / 60);
  }, [canvasRef]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      <canvas
        className="confetti"
        id="confetti"
        ref={canvasRef}
        width="320"
        height="320"
      ></canvas>
    </div>
  );
}
