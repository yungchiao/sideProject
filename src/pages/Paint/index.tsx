import { Button } from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { GlobalButton } from "../../components/Button";

const Paint: React.FC = observer(() => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>("black");
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [p5Instance, setP5Instance] = useState<any | null>(null);
  const [history, setHistory] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import("p5").then((p5Module) => {
      const sketch = (p: any) => {
        p.setup = () => {
          const canvas = p.createCanvas(500, 500);
          canvasRef.current = canvas.elt;
          p.background(255);
          const borderWidth = 1;
          p.stroke(0);
          p.strokeWeight(borderWidth);
        };

        p.mouseDragged = () => {
          drawLine(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        };

        p.mousePressed = () => {
          drawLine(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
        };
      };

      if (sketchRef.current && !p5Instance) {
        const instance = new p5Module.default(sketch, sketchRef.current);
        setP5Instance(instance);
      }
    });
  }, []);

  const saveCanvasState = () => {
    if (p5Instance) {
      p5Instance.loadPixels();
      const currentState = p5Instance.pixels.slice();
      setHistory((prevHistory) => [...prevHistory, currentState]);
    }
  };

  const undoLastAction = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const lastState = prevHistory[prevHistory.length - 1];
        if (p5Instance) {
          p5Instance.loadPixels();
          for (let i = 0; i < lastState.length; i++) {
            p5Instance.pixels[i] = lastState[i];
          }
          p5Instance.updatePixels();
          return prevHistory.slice(0, -1);
        }
      }
      return prevHistory;
    });
  };

  const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    if (p5Instance) {
      const strokeColor = isEraser
        ? p5Instance.color(255, 255, 255)
        : p5Instance.color(color);
      p5Instance.stroke(strokeColor);
      p5Instance.strokeWeight(isEraser ? 10 : 5);
      p5Instance.line(x0, y0, x1, y1);
    }
  };
  useEffect(() => {
    if (p5Instance) {
      p5Instance.mousePressed = () => {
        saveCanvasState();
        const strokeColor = isEraser
          ? p5Instance.color(255)
          : p5Instance.color(color);
        p5Instance.stroke(strokeColor);
        p5Instance.strokeWeight(isEraser ? 10 : 2);
        p5Instance.point(p5Instance.mouseX, p5Instance.mouseY);
      };

      p5Instance.mouseDragged = () => {
        drawLine(
          p5Instance.pmouseX,
          p5Instance.pmouseY,
          p5Instance.mouseX,
          p5Instance.mouseY,
        );
      };
    }
  }, [color, isEraser, p5Instance, drawLine]);

  const saveDrawing = () => {
    if (p5Instance) {
      p5Instance.saveCanvas("myDrawing", "png");
    }
  };
  const saveAndUploadDrawing = async () => {
    setIsLoading(true);
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          console.error("無法辨識圖片");
          return;
        }
        const file = new File([blob], "drawing.png", { type: "image/png" });
        try {
          const imageUrl = await uploadImage(file);
          await updateAvatarUrl(imageUrl);
          toast.success("上傳成功");
          setIsLoading(false);
        } catch (error) {
          console.error("上傳失敗", error);
        }
      });
    }
  };
  const auth = getAuth();
  const updateAvatarUrl = async (imageUrl: string) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const db = getFirestore();
    const userDocRef = doc(db, "user", userEmail);
    await updateDoc(userDocRef, { avatar: imageUrl });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name + v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };
  const imageList = [
    { src: "/bear.jpg", alt: "臺灣黑熊", name: "臺灣黑熊" },
    { src: "/bird.jpg", alt: "臺灣藍鵲", name: "臺灣藍鵲" },
    { src: "/deer.jpg", alt: "梅花鹿", name: "梅花鹿" },
  ];

  const selectImageAsBackground = (imageSrc: any) => {
    if (p5Instance) {
      p5Instance.loadImage(imageSrc, (img: any) => {
        p5Instance.clear(0, 0, 0, 0);
        p5Instance.background(img);
      });
    }
  };

  return (
    <>
      <div className="m-auto mb-5 w-3/4 p-4 pt-28">
        <div className="flex justify-center gap-2">
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
          <Button onClick={undoLastAction}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </Button>
        </div>
        <div className="my-6 flex flex-nowrap items-center justify-center gap-1 border-b-2 p-0 md:gap-4 md:pt-4">
          <button onClick={() => setColor("black")}>
            <div className="w=[100px] flex h-[80px] justify-center transition duration-200 hover:scale-110">
              <img
                src="/crayon/crayon-black.png"
                className="h-[60px] w-[60px]"
              />
            </div>
          </button>
          <button color="primary" onClick={() => setColor("blue")}>
            <div className="w=[100px] flex h-[80px] justify-center transition duration-200 hover:scale-110">
              <img
                src="/crayon/crayon-blue.png"
                className="h-[60px] w-[60px]"
              />
            </div>
          </button>
          <button color="success" onClick={() => setColor("green")}>
            <div className="w=[100px] flex h-[80px] justify-center transition duration-200 hover:scale-110">
              <img
                src="/crayon/crayon-green.png"
                className="h-[60px] w-[60px]"
              />
            </div>
          </button>
          <button color="danger" onClick={() => setColor("red")}>
            <div className="w=[100px] flex h-[80px] justify-center transition duration-200 hover:scale-110">
              <img src="/crayon/crayon-red.png" className="h-[60px] w-[60px]" />
            </div>
          </button>
        </div>
      </div>
      <div ref={sketchRef} className="mb-10 flex justify-center"></div>
      <div className="image-selection flex justify-center gap-4">
        {imageList.map((img, index) => (
          <div className="mb-3">
            <div className="h-30 flex w-20  overflow-hidden border p-1">
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className="h-auto w-full"
                onClick={() => selectImageAsBackground(img.src)}
              />
            </div>
            <p className="mt-3 flex justify-center text-xs">{img.name}</p>
          </div>
        ))}
      </div>
      <div className="pb-10">
        <div className="mt-4 flex justify-center gap-2 ">
          <GlobalButton
            variant="brown"
            content="下載作品"
            onClick={saveDrawing}
          />
          <GlobalButton
            variant="brown"
            content="設定為頭貼"
            onClick={saveAndUploadDrawing}
          />
        </div>
        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <img
              src="./gravity-logo.png"
              className="spin-slow relative  flex h-[40px] w-[40px] object-cover"
            />
            <p className="items-center">上傳中...</p>
          </div>
        )}
      </div>
    </>
  );
});

export default Paint;
