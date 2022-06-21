import {getRandomString} from "./utils";
import spinnerGif from "../images/api/spinner_svg.svg";
import errImg from "../images/api/error_svg.svg";
import successfulAlert from "../images/popup-box/alert_popup_successfull.svg";
import failedAlert from "../images/popup-box/alert_popup_failed.svg";
const txtErr = "Something went wrong, please try again later ";

const loadingInitState = {
  card: [
    {
      name: "Loading...",
      link: {spinnerGif},
      likes: [],
      _id: getRandomString(),
      owner: {_id: getRandomString()}
    }
  ],
  useInfo: {name: "Loading...", about: "Loading...", avatar: spinnerGif}
};
const loadingInitError = {
  card: [
    {
      name: txtErr,
      link: errImg,
      likes: [],
      _id: getRandomString(),
      owner: {_id: getRandomString()}
    }
  ],
  useInfo: {name: txtErr, about: txtErr, avatar: errImg}
};
const formSettingStates = {
  INIT: {
    name: "INIT",
    type: "init",
    heading: "Loading...",
    btnSetting: {txt: "Loading...", isDisable: true},
    alert: {title: "Loading,,", imgSrc: spinnerGif, alt: "loading image..."}
  },
  ADD_ITEM: {
    name: "ADD_ITEM",
    type: "add-item",
    heading: "New place",
    btnSetting: {txt: "Create", isDisable: false}
  },
  EDIT_PROFILE: {
    name: "EDIT_PROFILE",
    type: "profile-edit",
    heading: "Edit profile",
    btnSetting: {txt: "Save", isDisable: false}
  },
  EDIT_AVATAR: {
    name: "EDIT_AVATAR",
    type: "change-profile-pic",
    heading: "Change profile picture",
    btnSetting: {txt: "Save", isDisable: false}
  },
  REMOVE_CARD: {
    name: "REMOVE_CARD",
    type: "confirm",
    heading: "Are you sure?",
    btnSetting: {txt: "Yes", isDisable: false},
    cardId: ""
  },
  POPUP_ERROR: {
    name: "POPUP_ERROR",
    type: "error",
    heading: txtErr,
    btnSetting: {txt: "OK", isDisable: false}
  },
  POPUP_IMAGE: {
    name: "POPUP_IMAGE",
    type: "img",
    title: "",
    btnSetting: {txt: "", isDisable: false},
    link: "",
    isOpen: false
  },
  LOG_IN_FROM: {
    name: "LOGIN_FORM",
    type: "login",
    title: "Log in",
    btnSetting: {txt: "Log in", isDisable: false},
    bottomLinkTxt: "Not a member? Sign up here!"
  },
  SIGN_IN_FROM: {
    name: "SIGNUP_FORM",
    type: "signup",
    title: "Sign up",
    btnSetting: {txt: "Sign up", isDisable: false},
    bottomLinkTxt: "Already a member? Log in here!"
  },
  ALERT_POPUP_SUCCESSFUL: {
    name: "ALERT_POPUP_SUCCESSFUL",
    type: "alert",
    imgSrc: successfulAlert,
    alt: '"v" button in black color',
    title: "Success! You have now been registered."
  },
  ALERT_POPUP_FAILED: {
    name: "ALERT_POPUP_FAILED",
    type: "alert",
    alt: '"X" button in red color',
    imgSrc: failedAlert,
    title: "Oops, something went wrong! Please try again."
  }
};

export {txtErr, loadingInitError, loadingInitState, formSettingStates, errImg};
