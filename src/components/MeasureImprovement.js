import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import GnathiometerImage from "./GnathiometerImage";

import overlainGrowthGuide from "./overlain-growth-guide.jpeg";
import referenceChinMarker from "./chin-marker-reference.png";
import transparentGuide from "./guide.png";

export default function MeasureImprovement() {
  const location = useLocation();

  const { image, imageDimensions } = location.state;
  // TODO: isn't there another way to find the iamge height?
  const aspectRatio = imageDimensions.height / imageDimensions.width;
  const width = window.innerWidth / 4 - 8;
  const initialX = (window.innerWidth / 4 - 8) * 0.75;
  const initialY = ((window.innerWidth * aspectRatio) / 4 - 8) * 0.75;

  const inputRef = useRef();

  const [guideLocked, setGuideLocked] = useState(false);
  const [afterGuideLocked, setAfterGuideLocked] = useState(false);
  const [degree, setDegree] = useState(0);
  const [afterDegree, setAfterDegree] = useState(0);
  const [chinMarkerRotation, setChinMarkerRotation] = useState(315);
  const [afterChinMarkerRotation, setAfterChinMarkerRotation] = useState(315);
  const [gnathion, setGnathion] = useState({ x: initialX, y: initialY });
  const [afterGnathion, setAfterGnathion] = useState({
    x: initialX,
    y: initialY,
  });
  const [pointN, setPointN] = useState({ x: 0, y: 0 });
  const [afterPointN, setAfterPointN] = useState({ x: 0, y: 0 });
  const [improvementClicked, setImprovementClicked] = useState(false);

  const [afterAspectRatio, setAfterAspectRatio] = useState(0);
  const [afterImage, setAfterImage] = useState(null);
  const [afterImageDimensions, setAfterImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [relativeGnathion, setRelativeGnathion] = useState({ x: 0, y: 0 });
  const [afterRelativeGnathion, setAfterRelativeGnathion] = useState({
    x: 0,
    y: 0,
  });

  const navigate = useNavigate();

  const cmEstimation = () => {
    const value = Math.ceil(width / 30);
    return value;
  };

  // Assuming the provided dimensions are in cm, convert them to pixel equivalent using the 5cm pixel distance
  // Set initial state for guide width and height
  const [guideWidthInPixels, setGuideWidthInPixels] = useState(
    18 * cmEstimation()
  );

  const [afterGuideWidthInPixels, setAfterGuideWidthInPixels] = useState(
    18 * cmEstimation()
  );

  const labelText = () => {
    if (guideLocked) {
      return (
        <>
          <h1 className="text-center text-xl font-semibold">
            {"Guide Locked, Set Chin Marker (See Reference Image)"}
          </h1>
          <h1 className="text-center text-l font-semibold">
            {"Once done press upload after to move on"}
          </h1>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-center text-xl font-semibold">
            {
              "Scale the Growth Guide (use marker + 5 cm indication), then Overlay it (See Reference Image)"
            }
          </h1>
          <h2 className="text-center text-l font-semibold">
            {"Once in the right position, press the lock button"}
          </h2>
        </>
      );
    }
  };

  const generalGuideLocked = afterImage ? afterGuideLocked : guideLocked;
  const setGeneralGuideLocked = afterImage
    ? setAfterGuideLocked
    : setGuideLocked;

  const referenceImageSource = () => {
    if (!guideLocked) {
      return overlainGrowthGuide;
    } else {
      return referenceChinMarker;
    }
  };

  const toggleGuideLock = () => {
    setGeneralGuideLocked(!generalGuideLocked);
  };

  const onCirclePositionChange = (position) => {
    setGnathion(position);
  };

  const onAfterCirclePositionChange = (position) => {
    setAfterGnathion(position);
  };

  const gnathionRelativePosition = (pointN, degree, gnathion) => {
    // Calculate the slope of the line
    const radianAngle = ((360 - degree) * Math.PI) / 180;
    const m = Math.tan(radianAngle);

    // Line equation y = mx + c. Calculate c using pointN
    const c = pointN.y - m * pointN.x;

    // Coordinates of intersection of perpendicular line from gnathion to original line
    const xi = (m * gnathion.y + gnathion.x - m * c) / (m * m + 1);
    const yi = m * xi + c;

    // Calculate Gx and Gy
    const Gx = Math.round(
      Math.sqrt(
        (gnathion.x - xi) * (gnathion.x - xi) +
          (gnathion.y - yi) * (gnathion.y - yi)
      )
    );
    const Gy = Math.round(
      Math.sqrt(
        (xi - pointN.x) * (xi - pointN.x) + (yi - pointN.y) * (yi - pointN.y)
      )
    );

    return {
      Gx: pixelsToMM(Gx),
      Gy: pixelsToMM(Gy),
    };
  };

  const pixelsPerMM = () => {
    return guideWidthInPixels / 177.2;
  };

  const pixelsToMM = (pixelValue) => {
    return Math.round(pixelValue / pixelsPerMM());
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAfterImage(reader.result);

      const img = new Image();
      img.onload = function () {
        setAfterAspectRatio(this.height / this.width);
        setAfterImageDimensions({ width: this.width, height: this.height });
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
    setRelativeGnathion(gnathionRelativePosition(pointN, degree, gnathion));
  };

  const uploadAfter = (
    <div className="flex justify-center w-full">
      <button
        className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-16 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
        onClick={() => inputRef.current.click()}
      >
        {"Upload After ⬆️"}
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputRef}
        style={{ display: "none" }}
      />
    </div>
  );

  const calculateImprovement = () => {
    setAfterRelativeGnathion(
      gnathionRelativePosition(afterPointN, afterDegree, afterGnathion)
    );
    console.log("relative gnathion = ", relativeGnathion);
    console.log("after relative gnathion = ", afterRelativeGnathion);
    setImprovementClicked(true);
  };

  const improvementButton = (
    <div className="flex justify-center w-full">
      <button
        className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-16 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
        onClick={calculateImprovement}
      >
        {"Calculate Improvement"}
      </button>
    </div>
  );

  const referenceImage = (
    <div className="w-1/4 bg-gray-200 p-4 rounded-xl">
      <img src={referenceImageSource()} alt="Gnathiometer Growth Guide" />
    </div>
  );

  const afterGnathiometerImage = (
    <GnathiometerImage
      image={afterImage}
      guideWidthInPixels={afterGuideWidthInPixels}
      aspectRatio={afterAspectRatio}
      guideRotation={afterDegree}
      chinMarkerRotation={afterChinMarkerRotation}
      position={afterGnathion}
      guideLocked={afterGuideLocked}
      transparentGuide={transparentGuide}
      setPointN={setAfterPointN}
      onCirclePositionChange={onAfterCirclePositionChange}
    />
  );

  const rotation = () => {
    if (afterImage) {
      return afterGuideLocked ? afterChinMarkerRotation : afterDegree;
    }
    return guideLocked ? chinMarkerRotation : degree;
  };

  const setRotation = () => {
    if (afterImage) {
      return afterGuideLocked ? setAfterChinMarkerRotation : setAfterDegree;
    }
    return guideLocked ? setChinMarkerRotation : setDegree;
  };

  const generalGuideWidthInPixels = afterImage
    ? afterGuideWidthInPixels
    : guideWidthInPixels;
  const setGeneralGuideWidthInPixels = afterImage
    ? setAfterGuideWidthInPixels
    : setGuideWidthInPixels;

  return (
    <>
      <div className="my-8">{labelText()}</div>
      <div className="flex justify-center my-8 space-x-4 relative">
        <GnathiometerImage
          image={image}
          guideWidthInPixels={guideWidthInPixels}
          aspectRatio={aspectRatio}
          guideRotation={degree}
          chinMarkerRotation={chinMarkerRotation}
          position={gnathion}
          guideLocked={guideLocked}
          transparentGuide={transparentGuide}
          setPointN={setPointN}
          onCirclePositionChange={onCirclePositionChange}
        />
        {afterImage ? afterGnathiometerImage : referenceImage}
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
                value={rotation()}
                onChange={(e) => {
                  const newAngle = parseFloat(e.target.value);
                  setRotation()(newAngle);
                }}
                className="w-full"
              />
              <label className="text-xl">Current Rotation: {rotation()}°</label>
              <input
                type="number"
                min="-0.1"
                max="360.1"
                step="0.1"
                value={rotation()}
                onChange={(e) => {
                  let newAngle = parseFloat(e.target.value);

                  // Wrap around logic
                  if (newAngle > 360) {
                    newAngle = 0.1;
                  } else if (newAngle < 0) {
                    newAngle = 359.9;
                  }

                  // Set the new angle
                  setRotation()(newAngle);
                }}
                className="border-2 border-gray-300 rounded w-32 text-center"
              />
            </div>
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-8 py-8 text-3xl rounded-xl border-4 focus:border-gray-200"
              onClick={toggleGuideLock}
            >
              {generalGuideLocked ? "🔒" : "🔓"}
            </button>
            <div className="flex flex-col items-center space-y-2 w-1/2">
              <input
                type="range"
                min={`${Math.floor(width / 15)}`}
                max={`${width}`}
                step="1"
                value={generalGuideWidthInPixels}
                onChange={(e) => {
                  const newWidth = parseFloat(e.target.value);
                  setGeneralGuideWidthInPixels(newWidth);
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
                value={generalGuideWidthInPixels}
                onChange={(e) => {
                  const newWidth = parseFloat(e.target.value);
                  setGeneralGuideWidthInPixels(newWidth);
                }}
                className="border-2 border-gray-300 rounded w-32 text-center"
              />
            </div>
          </div>
          <div className="flex space-x-4"></div>
        </>
      </div>
      {guideLocked && (afterGuideLocked ? improvementButton : uploadAfter)}
      {improvementClicked && (
        <>
          <h1>
            Horizontal Improvement (MM):{" "}
            {afterRelativeGnathion.Gx - relativeGnathion.Gx}
          </h1>
          <h1>
            Vertical Improvement (MM):{" "}
            {afterRelativeGnathion.Gy - relativeGnathion.Gy}
          </h1>
        </>
      )}
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
