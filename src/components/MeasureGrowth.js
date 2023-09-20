import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Draggable from "react-draggable";
import { ChinMarker } from "./ChinMarker";

import overlainGrowthGuide from "./overlain-growth-guide.jpeg";
import referenceChinMarker from "./chin-marker-reference.png";
import transparentGuide from "./guide.png";

export default function MeasureGrowth() {
  const location = useLocation();

  const { image, imageDimensions } = location.state;
  const aspectRatio = imageDimensions.height / imageDimensions.width;
  const width = window.innerWidth / 4 - 8;

  const [guideLocked, setGuideLocked] = useState(false);
  const [degree, setDegree] = useState(0);
  const [chinMarkerRotation, setChinMarkerRotation] = useState(315);
  const [transformOrigin, setTransformOrigin] = React.useState("50% 50%");

  const handleDrag = (e, data) => {
    // Compute the new transformOrigin based on data.x and data.y
    // For example, if it should rotate around its own center relative to the parent:
    const pointNXCoord = (458 / 575) * guideWidthInPixels;
    const pointNYCoord = (231 / 768) * guideWidthInPixels * (23.67 / 17.72);
    const newTransformOrigin = `${data.x + pointNXCoord}px ${
      data.y + pointNYCoord
    }px`;
    setTransformOrigin(newTransformOrigin);
  };

  const navigate = useNavigate();

  const labelText = () => {
    if (guideLocked) {
      return "Guide Locked, Set Chin Marker (See Reference Image)";
    } else {
      return "Scale the Growth Guide (use marker + 5 cm indication), then Overlay it (See Reference Image)";
    }
  };

  const referenceImageSource = () => {
    if (!guideLocked) {
      return overlainGrowthGuide;
    } else {
      return referenceChinMarker;
    }
  };

  const rotate = (amount) => {
    const rotation = guideLocked ? chinMarkerRotation : degree;
    let angle = rotation + amount;
    if (angle < 0) angle += 360;
    guideLocked ? setChinMarkerRotation(angle) : setDegree(angle);
  };

  const rotateForward = () => {
    rotate(5);
  };

  const rotateBackward = () => {
    rotate(-5);
  };

  const toggleGuideLock = () => {
    setGuideLocked(!guideLocked);
  };

  const cmEstimation = () => {
    const value = Math.ceil(width / 30);
    return value;
  };

  // Assuming the provided dimensions are in cm, convert them to pixel equivalent using the 5cm pixel distance
  // Set initial state for guide width and height
  const [guideWidthInPixels, setGuideWidthInPixels] = useState(
    18 * cmEstimation()
  );

  const initialX = (window.innerWidth / 4 - 8) * 0.75;
  const initialY = ((window.innerWidth * aspectRatio) / 4 - 8) * 0.75;

  return (
    <>
      <div className="my-8">
        <h1 className="text-center text-xl font-semibold">{labelText()}</h1>
      </div>
      <div className="flex justify-center my-8 space-x-4 relative">
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
                zIndex: 1, // Use zIndex to overlay it on the ImageMarker
              }}
            >
              <ChinMarker
                imageWidth={window.innerWidth / 4 - 8}
                imageHeight={(window.innerWidth * aspectRatio) / 4 - 8}
                rotation={chinMarkerRotation}
                twoMM={guideWidthInPixels / (17.72 * 5)}
                position={{ x: initialX, y: initialY }}
              />
            </div>
          )}
        </div>
        <div className="w-1/3 bg-gray-200 p-4 rounded-xl">
          <img src={referenceImageSource()} alt="Gnathiometer Growth Guide" />
        </div>
        <div
          className="absolute"
          style={{
            transform: `rotate(${degree}deg)`,
            transformOrigin: transformOrigin,
          }}
        >
          <Draggable disabled={guideLocked} onDrag={handleDrag}>
            <img
              className="processedImage"
              src={transparentGuide}
              alt="Processed"
              style={{
                maxWidth: `${guideWidthInPixels}px`,
                //transformOrigin: "50% 50%",
                pointerEvents: guideLocked ? "none" : "auto",
              }}
            />
          </Draggable>
        </div>
      </div>

      <div className="flex justify-center my-8">
        <>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center space-y-2 w-1/2">
              <input
                type="range"
                min="0"
                max="360"
                step="0.1"
                value={guideLocked ? chinMarkerRotation : degree}
                onChange={(e) => {
                  const newAngle = parseFloat(e.target.value);
                  guideLocked
                    ? setChinMarkerRotation(newAngle)
                    : setDegree(newAngle);
                }}
                className="w-full"
              />
              <label className="text-xl">
                Current Rotation:{" "}
                {guideLocked
                  ? chinMarkerRotation.toFixed(1)
                  : degree.toFixed(1)}
                °
              </label>
              <input
                type="number"
                min="0"
                max="360"
                step="0.1"
                value={guideLocked ? chinMarkerRotation : degree}
                onChange={(e) => {
                  const newAngle = parseFloat(e.target.value);
                  if (newAngle >= 0 && newAngle <= 360) {
                    guideLocked
                      ? setChinMarkerRotation(newAngle)
                      : setDegree(newAngle);
                  }
                }}
                className="border-2 border-gray-300 rounded w-32 text-center"
              />
            </div>
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-8 py-8 text-3xl rounded-xl border-4 focus:border-gray-200"
              onClick={rotateBackward}
            >
              ↺
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-8 py-8 text-3xl rounded-xl border-4 focus:border-gray-200"
              onClick={rotateForward}
            >
              ↻
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-8 py-8 text-3xl rounded-xl border-4 focus:border-gray-200"
              onClick={toggleGuideLock}
            >
              {guideLocked ? "🔒" : "🔓"}
            </button>
            <div className="flex flex-col items-center space-y-2 w-1/2">
              <input
                type="range"
                min={`${Math.floor(width / 15)}`}
                max={`${width}`}
                step="1"
                value={guideWidthInPixels}
                onChange={(e) => {
                  const newWidth = parseFloat(e.target.value);
                  setGuideWidthInPixels(newWidth);
                }}
                className="w-full"
              />
              <label className="text-xl">
                Current Guide Width: {guideWidthInPixels}
              </label>
              <input
                type="number"
                min={`${Math.floor(width / 15)}`}
                max={`${width}`}
                step="1"
                value={guideWidthInPixels}
                onChange={(e) => {
                  const newWidth = parseFloat(e.target.value);
                  setGuideWidthInPixels(newWidth);
                }}
                className="border-2 border-gray-300 rounded w-32 text-center"
              />
            </div>
          </div>
          <div className="flex space-x-4"></div>
        </>
      </div>

      <div className="flex justify-center my-8">
        <button
          className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-32 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
          onClick={() => navigate("/")}
        >
          Home Page 🏠
        </button>
      </div>
    </>
  );
}
