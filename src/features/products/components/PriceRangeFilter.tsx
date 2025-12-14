import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onRangeChange: (min: number, max: number) => void;
}

export const PriceRangeFilter = ({
  min,
  max,
  currentMin,
  currentMax,
  onRangeChange,
}: PriceRangeFilterProps) => {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  const handleSliderChange = (values: number[]) => {
    const [newMin, newMax] = values;
    setLocalMin(newMin);
    setLocalMax(newMax);
    onRangeChange(newMin, newMax);
  };

  const handleMinInputChange = (value: string) => {
    const numValue = parseInt(value) || min;
    const clampedValue = Math.max(min, Math.min(numValue, localMax));
    setLocalMin(clampedValue);
    onRangeChange(clampedValue, localMax);
  };

  const handleMaxInputChange = (value: string) => {
    const numValue = parseInt(value) || max;
    const clampedValue = Math.min(max, Math.max(numValue, localMin));
    setLocalMax(clampedValue);
    onRangeChange(localMin, clampedValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <Slider
          min={min}
          max={max}
          step={100}
          value={[localMin, localMax]}
          onValueChange={handleSliderChange}
          className="mb-4"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label htmlFor="min-price" className="text-xs text-muted-foreground mb-1 block">
            Min
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <Input
              id="min-price"
              type="number"
              value={localMin / 100}
              onChange={(e) => handleMinInputChange((parseFloat(e.target.value) * 100).toString())}
              className="pl-7 h-9 text-sm"
            />
          </div>
        </div>

        <div className="pt-5 text-muted-foreground">—</div>

        <div className="flex-1">
          <Label htmlFor="max-price" className="text-xs text-muted-foreground mb-1 block">
            Max
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <Input
              id="max-price"
              type="number"
              value={localMax / 100}
              onChange={(e) => handleMaxInputChange((parseFloat(e.target.value) * 100).toString())}
              className="pl-7 h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Showing ₹{(localMin / 100).toFixed(0)} - ₹{(localMax / 100).toFixed(0)}
      </div>
    </div>
  );
};
