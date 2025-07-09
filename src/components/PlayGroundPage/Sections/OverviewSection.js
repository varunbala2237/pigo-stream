// OverviewSection.js
import { useState } from "react";

const OverviewSection = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 250;
  const isLong = text.length > previewLength;
  const previewText = text.slice(0, previewLength);

  return (
    <div
      className="text-wrap text-break text-start text-secondary"
      style={{ whiteSpace: "pre-line" }}
    >
      <span className="dynamic-fs">{expanded || !isLong ? text : `${previewText}...`}</span>
      {isLong && (
        <div className="mt-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-sm btn-dark rounded-pill text-white dynamic-fs text-decoration-none"
            style={{ textAlign: "left" }}
          >
            <i className={`bi bi-caret-${expanded ? "up" : "down"}-fill me-2`}></i>
            {expanded ? "Read Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default OverviewSection;