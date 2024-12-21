//=========================================================================================================
// Card Component
//=========================================================================================================
import React, { useState } from "react";
import "../styles/Card.css";

const Card = ({
  RichMedia = "/images/Default_Card_Image.jpg",
  tag,
  title,
  subtitle,
  details,
  variant = "original",
  buttonLabel = "Expand",
  onButtonClick,
  linkButton = false,
  linkUrl = "#",
  showScanButton = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (linkButton) return;
    setExpanded((prev) => !prev);
    if (onButtonClick) onButtonClick();
  };

  const scanQrCode = async () => {
    // VIP don't forget to add the QR code scanning logic here*****
    alert("Opening camera to scan QR code...");
  };

  return (
    <div className={`card ${variant} ${expanded ? "expanded" : ""}`}>
      {variant === "original" && (
        <div className="card-image">
          <img src={RichMedia} alt="Card visual" />
          {tag && <div className="card-tag">{tag}</div>}
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-subtitle">{subtitle}</h4>

        {expanded && <p className="card-details">{details}</p>}

        {linkButton ? (
          <a href={linkUrl} className="card-button">
            {buttonLabel}
          </a>
        ) : (
          <>
            <button className="card-button" onClick={toggleExpand}>
              {expanded ? "Collapse" : buttonLabel}
            </button>
            {expanded && showScanButton && (
              <button className="card-button" onClick={scanQrCode}>
                Scan QR Code
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;