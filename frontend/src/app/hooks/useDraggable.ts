import { useState } from 'react';

export const useDraggable = (
  positionX: number,
  positionY: number,
  onPositionChange?: (newX: number, newY: number) => void
) => {
  const [position, setPosition] = useState({ x: positionX, y: positionY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (clientX: number, clientY: number) => {
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const moveNode = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });
    if (onPositionChange) {
      onPositionChange(newX, newY);
    }
  };

  const handleMouseMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const x = clientX - dragOffset.x;
      const y = clientY - dragOffset.y;
      moveNode(x, y);
    }
  };

  return {
    position,
    setPosition,
    setIsDragging,
    handleMouseDown,
    handleMouseMove
  }
}
