import React, {useEffect} from "react";
import spinnerGif from "../images/api/spinner_svg.svg";

const AlertPopup = ({
  isOpen,
  handlePopupMouseDown,
  closeAllPopup,
  alertSetting
}) => {
  return (
    <div
      className={`popup-box popup-box_type_alert ${
        isOpen ? "popup-box_visible" : ""
      }`}
      onMouseDown={handlePopupMouseDown}
    >
      <div className="popup-box__container popup-box__container_type_alert">
        <button
          name="img"
          onClick={closeAllPopup}
          type="button"
          className="popup-box__close-button popup-box__close-button_type_alert button-modifier animation-modifier_type_opacity-hover"
        ></button>
        <div className="popup-box__wrapper popup-box__wrapper_type_alert">
          <img
            src={alertSetting.imgSrc || spinnerGif}
            className="popup-box__alert-img"
            alt={alertSetting.alt || "Loading image..."}
          />
          <h3 className="popup-box__alert-title">
            {alertSetting.title || "Loading..Please wait"}
          </h3>
        </div>
      </div>
    </div>
  );
};
export default AlertPopup;
