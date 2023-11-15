import { Button, Image } from "@nextui-org/react";
import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="bg-stone-800">
        <h1>haaaa</h1>
        <Button color="primary">Button</Button>
        <Image
          isBlurred
          width={240}
          src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          alt="NextUI Album Cover"
          classNames="m-5"
        />
        <Image
          isZoomed
          width={240}
          alt="NextUI Fruit Image with Zoom"
          src="https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"
        />
      </div>
    </>
  );
}

export default App;
