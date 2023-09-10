import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ImageMarker from "react-image-marker";
import { ChinMarker } from "./ChinMarker";
import { FaceMarker } from "./markers/FaceMarker";

import growthGuide from "./growth-guide.jpeg";
import referenceChinMarker from "./chin-marker-reference.png";

export default function MeasureImprovement() {
  const location = useLocation();

  const { image, imageDimensions } = location.state;
  const [aspectRatio, setAspectRatio] = useState(
    imageDimensions.height / imageDimensions.width
  );
  const inputRef = useRef();
  const initialX = (window.innerWidth / 4 - 8) * 0.75;
  const initialY = ((window.innerWidth * aspectRatio) / 4 - 8) * 0.75;

  // markers for the before image
  const [markers, setMarkers] = useState([]);
  // markers for the after image
  const [afterMarkers, setAfterMarkers] = useState([]);
  const [afterImage, setAfterImage] = useState(null);
  const [afterImageDimensions, setAfterImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [chinMarkerRotation, setChinMarkerRotation] = useState(315);
  const [afterChinMarkerRotation, setAfterChinMarkerRotation] = useState(315);
  const [circlePosition, setCirclePosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [afterCirclePosition, setAfterCirclePosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [improvement, setImprovement] = useState({ x: 0, y: 0 });

  const [sliderValue, setSliderValue] = useState(5);
  const [afterSliderValue, setAfterSliderValue] = useState(5);

  const markerGroup = afterImage ? afterMarkers : markers;
  const setMarkerGroup = afterImage ? setAfterMarkers : setMarkers;

  // Calculate the position for the number label
  const sliderWidth = 300; // Assuming the slider is 300px wide
  const sValue = markers.length < 2 ? sliderValue : afterSliderValue;
  const setSValue = markers.length < 2 ? setSliderValue : setAfterSliderValue;
  const position = ((sValue - 1) / 29) * sliderWidth;

  const handleSliderChange = (e) => {
    setSValue(e.target.value);
  };

  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAfterImage(reader.result);

      const img = new Image();
      img.onload = function () {
        setAspectRatio(this.height / this.width);
        setAfterImageDimensions({ width: this.width, height: this.height });
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const labelText = () => {
    if (markerGroup.length < 1) {
      return `Label Start of ${sValue} CM Marker (Green Dot)`;
    } else if (markerGroup.length < 2) {
      return `Label End of ${sValue} CM Marker (Red Dot)`;
    } else if (markerGroup.length == 2) {
      return "Label Point N (See Growth Guide)";
    } else {
      return "Set Chin Marker (See Reference Image)";
    }
  };

  const subHeaderText = () => {
    return "Rotate It (Use Bottom Row Buttons) such that it is tangent to the chin.";
  };

  const beforeCMPixelDistance = () => {
    if (markers.length >= 2) {
      const marker1 = markers[0];
      const marker2 = markers[1];
      const width = window.innerWidth / 4 - 8;
      const height = width * (imageDimensions.height / imageDimensions.width);
      const xDist = (marker2.left / 100) * width - (marker1.left / 100) * width;
      const yDist = (marker2.top / 100) * height - (marker1.top / 100) * height;

      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    } else {
      return 0;
    }
  };

  const afterCMPixelDistance = () => {
    if (afterMarkers.length >= 2) {
      const marker1 = afterMarkers[0];
      const marker2 = afterMarkers[1];
      const width = window.innerWidth / 4 - 8;
      const height =
        width * (afterImageDimensions.height / afterImageDimensions.width);
      const xDist = (marker2.left / 100) * width - (marker1.left / 100) * width;
      const yDist = (marker2.top / 100) * height - (marker1.top / 100) * height;

      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    } else {
      return 0;
    }
  };

  const addNewMarker = (marker) => {
    if (markerGroup.length < 3) {
      setMarkerGroup([...markerGroup, marker]);
    }
  };

  const removeLastMarker = () => {
    if (markerGroup.length > 1) {
      setMarkerGroup(markerGroup.slice(0, -1));
    } else if (markerGroup.length == 1) {
      setMarkerGroup([]);
    }
  };

  const referenceImageSource = () => {
    return markers.length === 2 ? growthGuide : referenceChinMarker;
  };

  const rotate = (amount) => {
    const rotation = afterImage ? afterChinMarkerRotation : chinMarkerRotation;
    const setRotation = afterImage
      ? setAfterChinMarkerRotation
      : setChinMarkerRotation;
    let angle = rotation + amount;
    if (angle < 0) angle += 360;
    setRotation(angle);
  };

  const rotateForward = () => {
    rotate(5);
  };

  const rotateBackward = () => {
    rotate(-5);
  };

  const handleCirclePositionChange = (newCirclePosition) => {
    console.log("LOL", newCirclePosition);
    setCirclePosition(newCirclePosition);
  };

  const handleAfterCirclePositionChange = (newCirclePosition) => {
    console.log("LOL2", newCirclePosition);
    setAfterCirclePosition(newCirclePosition);
  };

  const uploadAfter = (
    <div className="flex justify-center w-full">
      <button
        className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-16 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
        onClick={() => inputRef.current.click()}
      >
        {afterImage ? "Re-Upload After ⬆️" : "Upload After ⬆️"}
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

  const reuploadBefore = (
    <button
      className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-16 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
      onClick={() => navigate("/upload-before-after")}
    >
      Re-Upload Before ⬆️
    </button>
  );

  const rotationButtons = (
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
    </div>
  );

  const uploadButton = () => {
    return afterImage ? uploadAfter : reuploadBefore;
  };

  const calculateImprovement = () => {
    if (markers.length >= 3 && afterMarkers.length >= 3) {
      const beforeWidth = window.innerWidth / 4 - 8;
      const beforeHeight =
        beforeWidth * (imageDimensions.height / imageDimensions.width);
      const beforePixelToMMRatio = (sliderValue * 10) / beforeCMPixelDistance(); // 50 mm equivalent to beforeFiveCMPixelDistance pixels

      const afterWidth = window.innerWidth / 4 - 8;
      const afterHeight =
        afterWidth * (afterImageDimensions.height / afterImageDimensions.width);
      const afterPixelToMMRatio =
        (afterSliderValue * 10) / afterCMPixelDistance(); // 50 mm equivalent to afterFiveCMPixelDistance pixels

      // Calculate difference for first image
      const difference = {
        x:
          (circlePosition.x - (markers[2].left / 100) * beforeWidth) *
          beforePixelToMMRatio,
        y:
          (circlePosition.y - (markers[2].top / 100) * beforeHeight) *
          beforePixelToMMRatio,
      };

      console.log("Markers 2 Left", (markers[2].left / 100) * beforeWidth);
      console.log("Circle Position X", circlePosition.x);

      // Calculate difference for second image
      const afterDifference = {
        x:
          (afterCirclePosition.x - (afterMarkers[2].left / 100) * afterWidth) *
          afterPixelToMMRatio,
        y:
          (afterCirclePosition.y - (afterMarkers[2].top / 100) * afterHeight) *
          afterPixelToMMRatio,
      };

      console.log(
        "After Markers 2 Left",
        (afterMarkers[2].left / 100) * afterWidth
      );
      console.log("After Circle Position X", afterCirclePosition.x);

      // Calculate the difference in x and y between afterDifference and difference
      const improvement = {
        x: afterDifference.x - difference.x,
        y: afterDifference.y - difference.y,
      };

      console.log("Improvement", improvement);

      // Set the improvement state
      setImprovement(improvement);
    }
  };

  return (
    <>
      <div className="my-8">
        <h1 className="text-center text-xl font-semibold">{labelText()}</h1>
        {markerGroup.length < 2 && (
          <div>
            <div class="relative mx-auto w-80 text-center">
              <p>Adjust Marker Size (CM)</p>
            </div>
            <div class="relative mx-auto w-80">
              <input
                type="range"
                min={1}
                max={30}
                value={sValue}
                step="1"
                style={{ width: `${sliderWidth}px` }}
                onChange={handleSliderChange}
              />
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  left: `${position}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {sValue} CM
              </div>
            </div>
          </div>
        )}
        {markerGroup.length == 3 && (
          <>
            <h1 className="text-center text-large font-semibold">
              {subHeaderText()}
            </h1>
            <h1 className="text-center text-large font-semibold">
              {
                "Place the red dot on the Gnathion (downward and forward-most point on the Chin)"
              }
            </h1>
          </>
        )}
      </div>
      <div className="flex justify-center my-8">
        <button
          className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-32 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
          onClick={removeLastMarker}
        >
          ❌ Remove Marker
        </button>
      </div>
      <div className="flex justify-center my-8 space-x-4 relative">
        <div className="w-1/4 bg-gray-200 p-4 rounded-xl relative">
          <ImageMarker
            src={image}
            markers={markers}
            onAddMarker={(marker) => addNewMarker(marker)}
            markerComponent={FaceMarker}
          />
          {markers.length === 3 && (
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
                twoMM={beforeCMPixelDistance() / (sliderValue * 5)}
                onCirclePositionChange={handleCirclePositionChange}
                position={circlePosition}
              />
            </div>
          )}
        </div>
        {markers.length >= 2 && (
          <div className="w-1/4 bg-gray-200 p-4 rounded-xl relative">
            {afterImage ? (
              <>
                <ImageMarker
                  src={afterImage}
                  markers={afterMarkers}
                  onAddMarker={(marker) => addNewMarker(marker)}
                  markerComponent={FaceMarker}
                />
                {afterMarkers.length === 3 && (
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
                      imageHeight={
                        (window.innerWidth *
                          (afterImageDimensions.height /
                            afterImageDimensions.width)) /
                          4 -
                        8
                      }
                      rotation={afterChinMarkerRotation}
                      twoMM={afterCMPixelDistance() / (sliderValue * 5)}
                      onCirclePositionChange={handleAfterCirclePositionChange}
                      position={afterCirclePosition}
                    />
                  </div>
                )}
              </>
            ) : (
              <img
                src={referenceImageSource()}
                alt="Gnathiometer Growth Guide"
              />
            )}
          </div>
        )}
      </div>

      <div>
        {markerGroup.length < 3 ? (
          <div className="flex justify-center">{uploadButton()}</div>
        ) : (
          <div className="flex justify-center my-8">{rotationButtons}</div>
        )}
      </div>
      <div className="w-full">
        {!afterImage && markers.length === 3 && uploadAfter}
      </div>
      {afterMarkers.length === 3 && (
        <>
          <div className="flex justify-center">
            <button
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-16 py-8 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
              onClick={calculateImprovement}
            >
              Calculate Improvement
            </button>
          </div>
          <h1 className="text-center text-large font-semibold">
            {improvement.x !== 0 &&
              `Horizontal MM Diff : ${improvement.x.toFixed(1)}MM`}
          </h1>
          <h1 className="text-center text-large font-semibold">
            {improvement.y !== 0 &&
              `Vertical MM Diff : ${improvement.y.toFixed(1)}MM`}
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
