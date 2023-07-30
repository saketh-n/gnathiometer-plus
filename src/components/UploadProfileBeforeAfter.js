import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import before from "../reference-images/wei-before.png";
import after from "../reference-images/wei-after.png";

export default function UploadProfileBeforeAfter() {
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);

      const img = new Image();
      img.onload = function () {
        setImageDimensions({ width: this.width, height: this.height });

        // Navigate to new component with image data
        navigate("/improvement", {
          state: {
            image: reader.result,
            imageDimensions: { width: this.width, height: this.height },
          },
        });
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex justify-center m-8">
        <div className="w-1/3 p-4 border-gray-300 bg-gray-200 border-4 rounded-md mx-4">
          <h1 className="text-xl font-semibold text-center">
            Image Guidelines
          </h1>
          <ul className="list-disc pl-5">
            <li>Photograph the patient’s face in a true lateral position.</li>
            <li>
              Use an ‘Alice’ band to make sure that neither the forehead nor the
              tragus of the ear is obscured with hair.{" "}
            </li>
            <li>
              You will need to put some sort of scale on both images, ideally a
              marker 5 cm in length. This must be placed in the midline with the
              sagittal plane to ensure accuracy.
            </li>
          </ul>
        </div>
        <div className="w-1/2 bg-gray-200 p-4 border-gray-300 border-4 rounded-md mx-4">
          <h1 className="text-center text-xl font-semibold">Sample Images</h1>
          <div className="flex justify-center space-x-4">
            <div>
              <h1 className="text-center text-xl font-semibold">
                Before Image
              </h1>
              <img
                src={before}
                alt="Sample Gnathiometer Before Profile Image"
              />
            </div>
            <div>
              <h1 className="text-center text-xl font-semibold">After Image</h1>
              <img src={after} alt="Sample Gnathiometer After Profile Image" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 border-gray-300 px-32 py-12 text-2xl rounded-xl border-4 focus:border-gray-200 w-1/2"
          onClick={() => inputRef.current.click()}
        >
          Upload Before Image ⬆️
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={inputRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
