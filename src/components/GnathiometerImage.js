import Draggable from "react-draggable";
import React, { useState } from "react";
import { ChinMarker } from "./ChinMarker";

export default function GnathiometerImage({
  image,
  guideWidthInPixels,
  aspectRatio,
  guideRotation,
  chinMarkerRotation,
  position,
  guideLocked,
  transparentGuide,
  setPointN = () => {},
  onCirclePositionChange = null,
}) {
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");

  const handleDrag = (e, data) => {
    // Compute the new transformOrigin based on data.x and data.y
    // For example, if it should rotate around its own center relative to the parent:
    const pointNXCoord = (458 / 575) * guideWidthInPixels;
    const pointNYCoord = (231 / 768) * guideWidthInPixels * (23.67 / 17.72);
    const newTransformOrigin = `${data.x + pointNXCoord}px ${
      data.y + pointNYCoord
    }px`;
    setTransformOrigin(newTransformOrigin);
    setPointN({ x: pointNXCoord, y: pointNYCoord });
  };

  return (
    <>
      <div className="w-1/4 bg-gray-200 p-4 rounded-xl relative">
        <img src={image} alt="Patient" />
        {guideLocked && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 2, // Use zIndex to overlay it on the ImageMarker
            }}
          >
            <ChinMarker
              imageWidth={window.innerWidth / 4 - 8}
              imageHeight={(window.innerWidth * aspectRatio) / 4 - 8}
              rotation={chinMarkerRotation}
              twoMM={guideWidthInPixels / (17.72 * 5)}
              position={position}
              onCirclePositionChange={onCirclePositionChange}
            />
          </div>
        )}
      </div>
      <div
        className="absolute"
        style={{
          transform: `rotate(${guideRotation}deg)`,
          transformOrigin: transformOrigin,
          zIndex: 1,
        }}
      >
        <Draggable disabled={guideLocked} onDrag={handleDrag}>
          <img
            className="processedImage"
            src={transparentGuide}
            alt="Processed"
            style={{
              maxWidth: `${guideWidthInPixels}px`,
              pointerEvents: guideLocked ? "none" : "auto",
            }}
          />
        </Draggable>
      </div>
    </>
  );
}
