import React, { useState } from "react";
import ImageMarker, { Marker } from "react-image-marker";
import { ChinMarker } from "../components/ChinMarker";
import SmallerMarker from "../components/SmallerMarker";
import growthGuide from "./growth-guide.jpeg";
import transparentGuide from "./guide.png";
import Draggable from "react-draggable";

function MeasureForwardGrowth() {
  const [image, setImage] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [degree, setDegree] = useState(0);
  const [guideLocked, setGuideLocked] = useState(false);

  const toggleGuideLock = () => {
    setGuideLocked(!guideLocked);
  };

  const rotateGuideForward = () => {
    let angle = degree + 5;
    if (angle < 0) angle += 360;
    setDegree(angle);
  };

  const rotateGuideBackward = () => {
    let angle = degree - 5;
    if (angle < 0) angle += 360;
    setDegree(angle);
  };

  const showGrowthGuide = () => {
    return markers.length === 3;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);

      const img = new Image();
      img.onload = function () {
        setImageDimensions({ width: this.width, height: this.height });
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const labelText = () => {
    if (markers.length < 2) {
      if (markers.length == 0) {
        return "Please Label the start of the 5 cm Marker on this Image";
      } else {
        return "Please Label the end of the 5 cm Marker on this Image";
      }
    } else if (markers.length < 3) {
      return "Please Label point N - refer to above growth guide";
    } else {
      return "Calculate Forward Growth";
    }
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeLastMarker = () => {
    if (markers.length > 1) {
      setMarkers(markers.slice(0, -1));
    } else if (markers.length == 1) {
      setMarkers([]);
    }
  };

  const addNewMarker = (marker) => {
    if (markers.length < 3) {
      setMarkers([...markers, marker]);
    }
  };

  const fiveCMPixelDistance = () => {
    if (markers.length >= 2) {
      const marker1 = markers[0];
      const marker2 = markers[1];
      const xDist =
        (marker2.left / 100) * imageDimensions.width -
        (marker1.left / 100) * imageDimensions.width;
      const yDist =
        (marker2.top / 100) * imageDimensions.height -
        (marker1.top / 100) * imageDimensions.height;

      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    } else {
      return 0;
    }
  };

  const scale = 1000 / Math.max(imageDimensions.width, imageDimensions.height);

  // Assuming the provided dimensions are in cm, convert them to pixel equivalent using the 5cm pixel distance
  const guideWidthInPixels = (fiveCMPixelDistance() / 5) * 17.72 * scale;
  const guideHeightInPixels = (fiveCMPixelDistance() / 5) * 23.67 * scale;

  // Calculate the pixel coordinates of point N on the growth guide
  const pointNLeft = (14.05 / 17.72) * guideWidthInPixels;
  const pointNTop = (6.87 / 23.67) * guideHeightInPixels;

  return (
    <>
      <div>
        <h1>Measure Forward Growth Page</h1>
        <img
          src={growthGuide}
          alt="Gnathiometer Growth Guide"
          width="200px"
          height="200px"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={clearAllMarkers}>Clear All Markers</button>
        <button onClick={removeLastMarker}>Undo Last Marker</button>
        <button onClick={rotateGuideForward}>
          Rotate Growth Guide Forward
        </button>
        <button onClick={rotateGuideBackward}>
          Rotate Growth Guide Backward
        </button>
        {markers.length == 3 && (
          <button onClick={toggleGuideLock}>
            {guideLocked ? "Unlock Growth Guide" : "Lock Growth Guide"}
          </button>
        )}
        {markers.length == 3 && <button>Calculate Forward Growth</button>}
      </div>

      {image && (
        <>
          <h3>{labelText()}</h3>
          <div
            style={{ position: "relative", width: "1000px", height: "1000px" }}
          >
            <ImageMarker
              src={image}
              markers={markers}
              onAddMarker={(marker) => addNewMarker(marker)}
              style={{ width: "100%", height: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: markers.length === 3 ? "auto" : "none",
              }}
            >
              {markers.length === 3 && <ChinMarker />}
            </div>
          </div>
        </>
      )}

      {showGrowthGuide() && (
        <div
          style={{
            transform: `rotate(${degree}deg)`,
          }}
        >
          <Draggable disabled={guideLocked}>
            <img
              className="processedImage"
              src={transparentGuide}
              alt="Processed image"
              style={{
                maxWidth: `${guideWidthInPixels}px`,
                maxHeight: `${guideHeightInPixels}px`,
                transform: `rotate(${degree}deg)`,
                transformOrigin: "50% 50%",
                pointerEvents: guideLocked ? "none" : "auto",
              }}
            />
          </Draggable>
        </div>
      )}
    </>
  );
}

export default MeasureForwardGrowth;
