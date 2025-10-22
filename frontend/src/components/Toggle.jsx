import Button from "./Button";

function Toggle({ otherClass = "", onClick = null, checked = false }) {
  return (
    <Button
      otherClass={`switch-group ${otherClass}`}
      onClick={onClick}
    >
      <div className={`slider-wrapper ${checked ? "checked" : ""}`}>
        <span className="slider"></span>
      </div>
    </Button>
  );
}

export default Toggle;
