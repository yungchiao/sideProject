import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
const Activity: React.FC = () => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  return (
    <Card className="mx-auto mt-4 max-w-[740px] border p-4">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="/avatars/avatar-1.png"
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "border-default-200 bg-transparent text-foreground"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>
          Frontend developer and UI/UX enthusiast. Join me on this coding
          adventure!
        </p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="text-small font-semibold text-default-400">4</p>
          <p className=" text-small text-default-400">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="text-small font-semibold text-default-400">97.1K</p>
          <p className="text-small text-default-400">Followers</p>
        </div>
      </CardFooter>

      <div className="relative">
        <div className="fixed bottom-8 right-8 z-50 h-10 w-10 cursor-pointer rounded-full bg-stone-700">
          <p className="flex items-center justify-center text-3xl text-gray-100">
            <Link to="/userpost">+</Link>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Activity;
