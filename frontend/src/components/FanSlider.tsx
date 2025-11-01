import { useState, useEffect } from 'react';
import type { FanType } from '@/types';

interface FanSliderProps {
  fan: FanType;
  speed: number;
  disabled: boolean;
  onSpeedChange: (fan: FanType, speed: number) => void;
}

export default function FanSlider({ fan, speed, disabled, onSpeedChange }: FanSliderProps) {
  const [localSpeed, setLocalSpeed] = useState(speed);

  useEffect(() => {
    setLocalSpeed(speed);
  }, [speed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSpeed(Number(e.target.value));
  };

  const handleRelease = () => {
    onSpeedChange(fan, localSpeed);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize">
          {fan === 'cpu' ? '🖥️ CPU Fan' : '🎮 GPU Fan'}
        </h3>
        <span className="text-2xl font-bold text-predator-blue">
          {localSpeed}%
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={localSpeed}
        onChange={handleChange}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-4 
                   [&::-webkit-slider-thumb]:h-4 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-predator-blue
                   [&::-moz-range-thumb]:w-4 
                   [&::-moz-range-thumb]:h-4 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-predator-blue
                   [&::-moz-range-thumb]:border-0"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
