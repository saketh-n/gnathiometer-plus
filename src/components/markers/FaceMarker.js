export const FaceMarker = (props) => {
  if (props.itemNumber == 0) {
    return (
      <svg height="20" width="20">
        <circle cx="10" cy="10" r="5" fill={"green"} />
      </svg>
    );
  } else if (props.itemNumber == 1) {
    return (
      <svg height="20" width="20">
        <circle cx="10" cy="10" r="5" fill={"red"} />
      </svg>
    );
  } else {
    return (
      <svg height="30" width="30">
        <line
          x1="30"
          y1="15"
          x2="5"
          y2="15"
          style={{ stroke: "black", strokeWidth: 2 }}
        />
        <polygon points="5,15 15,5 15,25" style={{ fill: "black" }} />
      </svg>
    );
  }
};
