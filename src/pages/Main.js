import React from "react";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="App">
      <Link to="/upload-image-fg">
        <button className="measure-button">Measure Forward Growth</button>
      </Link>
      <Link to="/upload-before-after">
        <button className="improvement-button">Measure Improvement</button>
      </Link>
    </div>
  );
}

export default Main;
