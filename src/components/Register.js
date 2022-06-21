import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const Register = ({
  onSubmit,
  formSetting,
  onSetVaildMsg,
  validMsg,
  handleMsgVaild,
  isValidInput
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    handleMsgVaild({userEmail, userPassword});
  }, [userEmail, userPassword]);

  return (
    <div className="popup-box_type_auth animation-modifier_type_animate-center">
      <h2 className="popup-box__heading popup-box__heading_type_auth">
        {formSetting.title}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({email: userEmail, password: userPassword});
        }}
        className={`popup-box__form popup-box__form_type_auth`}
        name="signup"
      >
        <fieldset className="popup-box__fieldset">
          <input
            onChange={(e) => {
              setUserEmail(e.target.value);
              onSetVaildMsg("emailInput", e.target.validationMessage);
            }}
            value={userEmail || ""}
            id="email-input"
            type="email"
            className={`popup-box__input popup-box__input_type_auth`}
            name="emailInput"
            required
            minLength="2"
            maxLength="40"
            placeholder="Email"
          />
          <span className="popup-box__input-error">
            {validMsg.emailInput || ""}
          </span>
          <input
            onChange={(e) => {
              setUserPassword(e.target.value);
              onSetVaildMsg("passwordInput", e.target.validationMessage);
            }}
            value={userPassword || ""}
            id="password-input"
            type="password"
            className={`popup-box__input popup-box__input_type_auth`}
            name="passwordInput"
            required
            minLength="2"
            maxLength="200"
            placeholder="Password"
          />
          <span className="popup-box__input-error">
            {validMsg.passwordInput || ""}
          </span>
          <button
            disabled={formSetting.btnSetting.isDisable || !isValidInput}
            type="submit"
            className={`popup-box__submit-button popup-box__submit-button_type_auth button-modifier animation-modifier_type_opacity-hover ${
              !isValidInput ? "popup-box__submit-button_inactive" : ""
            }`}
          >
            {formSetting.btnSetting.txt || "loading..."}
          </button>
        </fieldset>
        <div className="popup-box__bottom-link link-modifier animation-modifier_type_opacity-hover">
          <Link to="/signin"> {formSetting.bottomLinkTxt || "loading..."}</Link>
        </div>
      </form>
    </div>
  );
};
export default Register;
