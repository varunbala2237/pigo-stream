// OverviewSection.js
import { useState } from "react";

function OverviewSection({ text }) {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 250;
  const isLong = text.length > previewLength;
  const previewText = text.slice(0, previewLength);

  return (
    <div
      className="text-wrap text-break text-start"
      style={{ whiteSpace: "pre-line" }}
    >
      <span className="dynamic-fs">{expanded || !isLong ? text : `${previewText}...`}</span>
      {isLong && (
        <div className="mt-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-sm btn-link text-primary dynamic-fs p-0"
            style={{ textAlign: "left" }}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default OverviewSection;