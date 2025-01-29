import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import React, { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useTranslations } from "next-intl";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const t = useTranslations("ResumeEditor");

  const myColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff", // Basic colors
    "#ff7f00",
    "#ffff00",
    "#00ffff",
    "#ff00ff", // Secondary colors
    "#800000",
    "#808000",
    "#008000",
    "#800080",
    "#008080",
    "#000080", // Darker shades
    "#c0c0c0",
    "#808080",
    "#999999",
    "#333333",
    "#666666", // Grayscale
    "#ff6347",
    "#ff4500",
    "#daa520",
    "#32cd32",
    "#4682b4", // Additional colors
    "#6a5acd",
    "#7fffd4",
    "#d2691e",
    "#ff69b4",
    "#cd5c5c", // More colors
    "#4b0082",
    "#8b0000",
    "#ff1493",
    "#00bfff",
    "#1e90ff", // Even more colors
    "#adff2f",
    "#ffb6c1",
    "#20b2aa",
    "#87cefa",
    "#778899", // Light colors
  ];
  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          title={t("Change resume color")}
          onClick={() => {
            setShowPopover(true);
          }}
        >
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker
          colors={myColors}
          color={color}
          onChange={onChange}
          triangle="top-right"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
