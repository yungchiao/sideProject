import p5 from "p5";
import React, { useEffect, useRef } from "react";

const DrawingApp: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new p5((p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(255);
        const borderWidth = 2;
        p.stroke(0);
        p.strokeWeight(borderWidth);
        p.rect(
          borderWidth / 2,
          borderWidth / 2,
          p.width - borderWidth,
          p.height - borderWidth,
        );
      };

      p.draw = () => {};

      p.mouseDragged = () => {
        p.stroke(0);
        p.strokeWeight(2);
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      };

      p.mousePressed = () => {
        p.stroke(0);
        p.strokeWeight(2);
        p.point(p.mouseX, p.mouseY);
      };
    }, sketchRef.current!);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default DrawingApp;
