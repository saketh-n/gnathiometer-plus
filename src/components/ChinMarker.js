import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Group } from "react-konva";

export function ChinMarker({
  position,
  onDragMove,
  imageWidth,
  imageHeight,
  twoMM,
  rotation,
  onCirclePositionChange,
}) {
  const lineLength = 25 * twoMM;
  const gapLength = 5 * twoMM;
  const lineColor = "black";
  const circleColor = "red";
  const lineWidth = twoMM;

  const leftLinePoints = [0, 0, lineLength / 2 - gapLength / 2, 0];
  const rightLinePoints = [lineLength / 2 + gapLength / 2, 0, lineLength, 0];

  const circlePosition = { x: lineLength / 2, y: 0 };

  return (
    <div>
      <Stage
        width={imageWidth}
        height={imageHeight}
        draggable
        onDragMove={(e) => {
          onCirclePositionChange && onCirclePositionChange(e.target.position());
        }}
        position={position}
      >
        <Layer>
          <Group rotation={rotation} offsetX={circlePosition.x}>
            <Line
              points={leftLinePoints}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
            <Line
              points={rightLinePoints}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
            <Circle radius={lineWidth} fill={circleColor} {...circlePosition} />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
