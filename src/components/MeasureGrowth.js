import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ImageMarker from "react-image-marker";
import Draggable from "react-draggable";
import { ChinMarker } from "./ChinMarker";
import { FaceMarker } from "./markers/FaceMarker";

import growthGuide from "./growth-guide.jpeg";
import overlainGrowthGuide from "./overlain-growth-guide.jpeg";
import referenceChinMarker from "./chin-marker-reference.png";
import transparentGuide from "./guide.png";

export default function MeasureGrowth() {
  const location = useLocation();

  const { image, imageDimensions } = location.state;
  const aspectRatio = imageDimensions.height / imageDimensions.width;

  const [markers, setMarkers] = useState([]);
  const [guideLocked, setGuideLocked] = useState(false);
  const [degree, setDegree] = useState(0);
  const [chinMarkerRotation, setChinMarkerRotation] = useState(315);

  const navigate = useNavigate();

  const labelText = () => {
    if (markers.length < 1) {
      return "Label Start of 5 CM Marker (Green Dot)";
    } else if (markers.length < 2) {
      return "Label Start of 5 CM Marker (Red Dot)";
    } else {
      if (guideLocked) {
        return "Guide Locked, Set Chin Marker (See Reference Image)";
      } else {
        return "Overlay Growth Guide (See Reference Image)";
      }
    }
  };

  const subHeaderText = () => {
    if (guideLocked) {
      return "Rotate It (Use Bottom Row Buttons) such that it is tangent to the chin.";
    } else {
      return "Rotate & Lock It When Done (Use Bottom Row Buttons)";
    }
  };

  const fiveCMPixelDistance = () => {
    if (markers.length >= 2) {
      const marker1 = markers[0];
      const marker2 = markers[1];
      const width = window.innerWidth / 4 - 8;
      const height = width * aspectRatio;
      const xDist = (marker2.left / 100) * width - (marker1.left / 100) * width;
      const yDist = (marker2.top / 100) * height - (marker1.top / 100) * height;

      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    } else {
      return 0;
    }
  };

  const showGrowthGuide = () => {
    return markers.length === 2;
  };

  const addNewMarker = (marker) => {
    if (markers.length < 2) {
      setMarkers([...markers, marker]);
    }
  };

  const removeLastMarker = () => {
    if (markers.length > 1) {
      setMarkers(markers.slice(0, -1));
    } else if (markers.length == 1) {
      setMarkers([]);
    }
  };

  const referenceImageSource = () => {
    if (!guideLocked) {
      return markers.length === 2 ? growthGuide : overlainGrowthGuide;
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

  const proportion = fiveCMPixelDistance() / 5;

  // Assuming the provided dimensions are in cm, convert them to pixel equivalent using the 5cm pixel distance
  // Set initial state for guide width and height
  const [guideWidthInPixels, setGuideWidthInPixels] = useState(
    17.72 * proportion
  );
  const [guideHeightInPixels, setGuideHeightInPixels] = useState(
    23.67 * proportion
  );

  // Create a function to handle the resize event
  const handleResize = () => {
    if (markers.length >= 2) {
      const newProportion = fiveCMPixelDistance() / 5;
      setGuideWidthInPixels(17.72 * newProportion);
      setGuideHeightInPixels(23.67 * newProportion);
    }
  };

  // Use the useEffect hook to add the event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Pass an empty array as the dependency to run this hook only once, when the component is first mounted

  // Create a function to update guide width and height
  const updateGuideDimensions = () => {
    const newProportion = fiveCMPixelDistance() / 5;
    setGuideWidthInPixels(17.72 * newProportion);
    setGuideHeightInPixels(23.67 * newProportion);
  };

  // Use useEffect to watch the markers array and update the guide dimensions when there are two or more markers
  useEffect(() => {
    if (markers.length >= 2) {
      updateGuideDimensions();
    }
  }, [markers]);

  return (
    <>
      <div className="my-8">
        <h1 className="text-center text-xl font-semibold">{labelText()}</h1>
        {markers.length == 3 && (
          <>
            <h1 className="text-center text-large font-semibold">
              {subHeaderText()}
            </h1>
            <h1 className="text-center text-large font-semibold">
              {guideLocked &&
                "Place the red dot on the Gnathion (downward and forward-most point on the Chin)"}
            </h1>
          </>
        )}
      </div>
      <div className="flex justify-center my-8">
        {!guideLocked && (
          <button
            className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-32 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
            onClick={removeLastMarker}
          >
            ❌ Remove Marker
          </button>
        )}
      </div>
      <div className="flex justify-center my-8 space-x-4 relative">
        <div className="w-1/4 bg-gray-200 p-4 rounded-xl relative">
          <ImageMarker
            src={image}
            markers={markers}
            onAddMarker={(marker) => addNewMarker(marker)}
            markerComponent={FaceMarker}
          />
          {markers.length === 2 && guideLocked && (
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
                twoMM={fiveCMPixelDistance() / 25}
              />
            </div>
          )}
        </div>
        {markers.length >= 2 && (
          <div className="w-1/3 bg-gray-200 p-4 rounded-xl">
            <img src={referenceImageSource()} alt="Gnathiometer Growth Guide" />
          </div>
        )}
        {showGrowthGuide() && (
          <div
            className="absolute"
            style={{
              transform: `rotate(${degree}deg)`,
            }}
          >
            <Draggable disabled={guideLocked}>
              <img
                className="processedImage"
                src={transparentGuide}
                alt="Processed"
                style={{
                  maxWidth: `${guideWidthInPixels}px`,
                  maxHeight: `${guideHeightInPixels}px`,
                  transformOrigin: "50% 50%",
                  pointerEvents: guideLocked ? "none" : "auto",
                }}
              />
            </Draggable>
          </div>
        )}
      </div>

      <div className="flex justify-center my-8">
        {markers.length < 2 ? (
          <button
            className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-32 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
            onClick={() => navigate("/upload-image-fg")}
          >
            Re-Upload ⬆️
          </button>
        ) : (
          <div className="flex space-x-4">
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
          </div>
        )}
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
