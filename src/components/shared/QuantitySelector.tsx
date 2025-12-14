import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const QuantitySelector = ({
  value,
  max,
  min = 1,
  onChange,
  size = "md",
  disabled = false,
  className,
}: QuantitySelectorProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    const numValue = parseInt(val);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const inputSizeClasses = {
    sm: "h-7 w-12 text-sm",
    md: "h-9 w-14 text-base",
    lg: "h-11 w-16 text-lg",
  };

  return (
    <div className={cn("flex items-center gap-1 border border-border rounded-md", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn(sizeClasses[size], "rounded-none hover:bg-muted")}
      >
        <Minus className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
      
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        className={cn(
          inputSizeClasses[size],
          "text-center border-0 border-x focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
        )}
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn(sizeClasses[size], "rounded-none hover:bg-muted")}
      >
        <Plus className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
    </div>
  );
};
