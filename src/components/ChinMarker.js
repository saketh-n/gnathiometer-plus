import React from "react";
import { Stage, Layer, Line, Arrow, Group } from "react-konva";

export function ChinMarker({
  position,
  imageWidth,
  imageHeight,
  twoMM,
  rotation,
  onCirclePositionChange,
}) {
  const lineLength = 25 * twoMM;
  const gapLength = 5 * twoMM;
  const lineColor = "black";
  const arrowColor = "red";
  const lineWidth = twoMM;

  const leftLinePoints = [0, 0, lineLength / 2 - gapLength / 2, 0];
  const rightLinePoints = [lineLength / 2 + gapLength / 2, 0, lineLength, 0];

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
          <Group rotation={rotation}>
            <Line
              points={leftLinePoints}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
            {/* Right line with -45 degree rotation */}
            <Line
              points={rightLinePoints}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
            {/* Arrow at the center, orthogonal to the line */}
            <Arrow
              points={[
                lineLength / 2 + gapLength / 2 - (5 / 2) * twoMM,
                twoMM * 3,
                lineLength / 2 + gapLength / 2 - (5 / 2) * twoMM,
                -3 * twoMM,
              ]}
              pointerLength={twoMM * 3}
              pointerWidth={twoMM * 3}
              fill={arrowColor}
              stroke={arrowColor}
              strokeWidth={1}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
