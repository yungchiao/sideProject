import { Button } from "@nextui-org/react";
import p5 from "p5";
import React, { useEffect, useRef, useState } from "react";

const Paint: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string>("black");
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(700, 700);
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

      const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
        const strokeColor = isEraser ? p.color(255, 255, 255) : p.color(color);
        p.stroke(strokeColor);
        p.strokeWeight(isEraser ? 10 : 2);
        p.line(x0, y0, x1, y1);
      };

      p.mouseDragged = () => {
        drawLine(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      };

      p.mousePressed = () => {
        drawLine(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
      };
    };

    if (sketchRef.current && !p5Instance) {
      setP5Instance(new p5(sketch, sketchRef.current));
    }
  }, []);

  useEffect(() => {
    if (p5Instance) {
      p5Instance.mouseDragged = () => {
        const strokeColor = isEraser
          ? p5Instance.color(255)
          : p5Instance.color(color);
        p5Instance.stroke(strokeColor);
        p5Instance.strokeWeight(isEraser ? 6 : 2);
        p5Instance.line(
          p5Instance.pmouseX,
          p5Instance.pmouseY,
          p5Instance.mouseX,
          p5Instance.mouseY,
        );
      };

      p5Instance.mousePressed = () => {
        const strokeColor = isEraser
          ? p5Instance.color(255)
          : p5Instance.color(color);
        p5Instance.stroke(strokeColor);
        p5Instance.strokeWeight(isEraser ? 10 : 2);
        p5Instance.point(p5Instance.mouseX, p5Instance.mouseY);
      };
    }
  }, [color, isEraser, p5Instance]);

  return (
    <>
      <div className="m-auto my-10  w-3/4 border border-stone-800 p-4">
        <div className="flex justify-center ">
          {isEraser ? (
            <Button
              className="mb-4 border border-stone-800 bg-white"
              onClick={() => setIsEraser(!isEraser)}
            >
              <p className="text-stone-800">
                {isEraser ? "使用畫筆" : "使用橡皮擦"}
              </p>
            </Button>
          ) : (
            <Button
              className=" mb-4 bg-stone-800 text-center "
              onClick={() => setIsEraser(!isEraser)}
            >
              <p className="text-white">
                {isEraser ? "使用畫筆" : "使用橡皮擦"}
              </p>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button color="default" onClick={() => setColor("black")}>
            黑色
          </Button>
          <Button color="primary" onClick={() => setColor("blue")}>
            藍色
          </Button>
          <Button color="success" onClick={() => setColor("green")}>
            綠色
          </Button>
          <Button color="danger" onClick={() => setColor("red")}>
            紅色
          </Button>
        </div>
      </div>
      <div ref={sketchRef} className="flex justify-center"></div>
      <div className="mt-4 flex justify-center">
        <Button color="default">儲存</Button>
      </div>
    </>
  );
};

export default Paint;
