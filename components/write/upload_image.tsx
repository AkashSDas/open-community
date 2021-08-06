import { useState } from "react";

import CameraSVG from "../svg_icons/camera";
import DocumentSVG from "../svg_icons/document";

// NOTE: make it functional
function UploadImage() {
  const [url, setURL] = useState(null);

  return (
    <div className="upload-img">
      <button className="icon-btn">
        <CameraSVG /> Upload image
      </button>

      {url ? <span className="link">{url}</span> : null}

      <span className="clipboard-icon">
        <DocumentSVG />
      </span>
    </div>
  );
}

export default UploadImage;
