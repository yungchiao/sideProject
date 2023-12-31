import { Button } from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";

interface GlobalButtonProps {
  variant: "yellow" | "gray" | "brown" | "green" | "white";
  content: string;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
}

export const GlobalButton: React.FC<GlobalButtonProps> = ({
  variant,
  content,
  disabled,
  onClick,
  to,
}) => {
  const baseClasses =
    "relative transform transition duration-200 ease-in-out cursor-pointer";
  const variantClasses = {
    yellow: "bg-yellow text-white whitespace-nowrap",
    gray: "bg-stone-500 text-white whitespace-nowrap",
    brown: "bg-brown text-white whitespace-nowrap",
    green: "bg-green text-white whitespace-nowrap",
    white: "bg-white text-stone-800 border-stone-800 border whitespace-nowrap",
  };
  const hoverClasses = !disabled
    ? {
        yellow: "hover:bg-darkYellow ",
        gray: "hover:bg-stone-800",
        brown: "hover:darkBrown",
        green: "hover:darkGreen",
        white: "hover:bg-stone-100",
      }
    : {
        yellow: "hover:opacity-10",
        gray: "hover:opacity-10",
        brown: "hover:opacity-10",
        green: "hover:opacity-10",
      };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return to ? (
    <Link to={to} className={disabled ? "pointer-events-none" : ""}>
      <Button
        className={`${baseClasses} ${variantClasses[variant]} ${
          hoverClasses[variant] || ""
        } ${disabledClasses}`}
        disabled={disabled}
        onClick={onClick}
      >
        {content}
      </Button>
    </Link>
  ) : (
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
