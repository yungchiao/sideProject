import { Button } from "@nextui-org/react";
import React from "react";

interface GlobalButtonProps {
  variant: "yellow" | "gray" | "brown" | "green";
  content: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const GlobalButton: React.FC<GlobalButtonProps> = ({
  variant,
  content,
  disabled,
  onClick,
}) => {
  const baseClasses = "relative transform transition duration-200 ease-in-out";
  const variantClasses = {
    yellow: "bg-yellow text-white",
    gray: "bg-gray text-white",
    brown: "bg-brown text-white",
    green: "bg-green text-white",
  };
  const hoverClasses = !disabled
    ? {
        yellow: "hover:bg-darkYellow ",
        gray: "hover:bg-gray-600",
        brown: "hover:darkBrown",
        green: "hover:darkGreen",
      }
    : {
        yellow: "hover:opacity-10",
        gray: "hover:opacity-10",
        brown: "hover:opacity-10",
        green: "hover:opacity-10",
      };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <Button
      className={`${baseClasses} ${variantClasses[variant]} ${
        hoverClasses[variant] || ""
      } ${disabledClasses}`}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};
