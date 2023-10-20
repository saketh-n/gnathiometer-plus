import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import GnathiometerImage from "./GnathiometerImage";

import overlainGrowthGuide from "./overlain-growth-guide.jpeg";
import referenceChinMarker from "./chin-marker-reference.png";
import transparentGuide from "./guide.png";

export default function MeasureGrowth() {
  const location = useLocation();

  const { image, imageDimensions } = location.state;

  const [guideLocked, setGuideLocked] = useState(false);
  const [degree, setDegree] = useState(0);
  const [chinMarkerRotation, setChinMarkerRotation] = useState(315);

  const navigate = useNavigate();

  // TODO: isn't there another way to find the iamge height?
  const aspectRatio = imageDimensions.height / imageDimensions.width;
  const width = window.innerWidth / 4 - 8;

  const cmEstimation = () => {
    const value = Math.ceil(width / 30);
    return value;
  };

  // Assuming the provided dimensions are in cm, convert them to pixel equivalent using the 5cm pixel distance
  // Set initial state for guide width and height
  const [guideWidthInPixels, setGuideWidthInPixels] = useState(
    18 * cmEstimation()
  );

  const labelText = () => {
    return (
      <h1 className="text-center text-xl font-semibold">
        {"If Computed Result Incorrect, Press Lock Button to Adjust"}
      </h1>
    );
  };

  const referenceImageSource = () => {
    if (!guideLocked) {
      return overlainGrowthGuide;
    } else {
      return referenceChinMarker;
    }
  };

  const toggleGuideLock = () => {
    setGuideLocked(!guideLocked);
  };

  const initialX = (window.innerWidth / 4 - 8) * 0.75;
  const initialY = ((window.innerWidth * aspectRatio) / 4 - 8) * 0.75;

  return (
    <>
      <div className="my-8">{labelText()}</div>
      <div className="flex justify-center my-8 space-x-4 relative">
        <div className="w-1/3 bg-gray-200 p-4 rounded-xl">
          <img src={referenceImageSource()} alt="Gnathiometer Growth Guide" />
        </div>
      </div>

      <div className="flex justify-center my-8">
        <>
          <div className="flex space-x-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-8 py-8 text-3xl rounded-xl border-4 focus:border-gray-200"
              onClick={toggleGuideLock}
            >
              {guideLocked ? "🔒" : "🔓"}
            </button>
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
