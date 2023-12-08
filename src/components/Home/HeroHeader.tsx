import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";

const HeroHeader: React.FC = observer(() => {
  return (
    <div>
      <div className="flex items-center">
        <div className="flex w-1/2 justify-center ">
          <div className="text-center ">
            <div className="mx-auto mb-8 flex h-auto w-[100px] justify-center">
              <img
                src="/gravity-logo.png"
                className="transition duration-300 ease-in-out hover:rotate-180 hover:scale-150"
              />
            </div>
            <h1 className="mb-10 text-8xl">GRAVITY</h1>
            <h1 className="text-5xl tracking-widest">地新引力</h1>
            {appStore.currentUserEmail ? (
              <div className="none"></div>
            ) : (
              <div className="mt-10">
                <Button>
                  <Link color="foreground" to="/profile">
                    登入
                  </Link>
                </Button>
              </div>
            )}
            <div className="mx-auto mt-10 flex h-60 w-full rounded-md border-2 border-dashed border-stone-400"></div>
          </div>
        </div>
        <div className="w-2/3  bg-white  ">
          <img src="/hero-header.png" className="w-full" />
        </div>
      </div>
    </div>
  );
});

export default HeroHeader;
