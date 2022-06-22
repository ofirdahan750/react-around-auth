import React, {useCallback, useEffect, useState} from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";
import ImagePopup from "../components/ImagePopup.js";
import EditProfilePopup from "../components/EditProfilePopup.js";
import EditAvatarPopup from "../components/EditAvatarPopup.js";
import AddPlacePopup from "../components/AddPlacePopup.js";
import ConfirmPopup from "../components/ConfirmPopup.js";
import ErrorPopup from "../components/ErrorPopup.js";
import AlertPopup from "../components/AlertPopup.js";
import {
  loadingInitState,
  loadingInitError,
  txtErr,
  errImg
} from "../utils/constants.js";
import api from "../utils/api.js";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import {register, authenticate, validateToken} from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";

import {formSettingStates} from "../utils/constants.js";
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formSetting, setFormSetting] = useState(formSettingStates.INIT);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [alertSetting, setAlertSetting] = useState(
    formSettingStates.ALERT_POPUP_FAILED
  );
  const [cards, setCards] = useState(loadingInitState.card);
  const [currentUser, setCurrentUser] = useState(loadingInitState.useInfo);
  const [isValidInput, setValidInput] = useState(false);
  const [validMsg, setValidMsg] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMsgVaild = (inputVals) => {
    if (
      !isEditProfilePopupOpen &&
      !isAddPlacePopupOpen &&
      !isEditAvatarPopupOpen &&
      location.pathname !== "/signin" &&
      location.pathname !== "/signup"
    )
      setValidMsg({});
    else {
      const isAllInputsFilled = Object.values(inputVals).every((v) => v);
      const isVaildMsgActive = !Object.values(validMsg).some((val) =>
        Boolean(val)
      );
      const isFormVaild = isAllInputsFilled && isVaildMsgActive;
      setValidInput(isFormVaild || false);
    }
  };

  const onSetVaildMsg = (inputVal, msg) => {
    setValidMsg({
      ...validMsg,
      [inputVal]: msg
    });
  };

  useEffect(() => {
    //Init only
    onInit();
  }, []);

  useEffect(
    () => {
      setValidInput(false); //Remove the Input error
      //Set and Remove Popups event esc button
      if (
        isEditProfilePopupOpen ||
        isAddPlacePopupOpen ||
        isEditAvatarPopupOpen ||
        isRemovePopupOpen ||
        selectedCard.isOpen
      ) {
        document.addEventListener("keydown", handleEscClose);
      } else {
        document.removeEventListener("keydown", handleEscClose);
      }
    },
    // eslint-disable-next-line
    [
      isEditProfilePopupOpen,
      isAddPlacePopupOpen,
      isRemovePopupOpen,
      isEditAvatarPopupOpen,
      selectedCard
    ]
  );
  useEffect(() => {
    //Getting AUTH form html text and setting
    if (location.pathname === "/signin") {
      setFormSetting(formSettingStates.LOG_IN_FROM);
    }
    if (location.pathname === "/signup") {
      setFormSetting(formSettingStates.SIGN_IN_FROM);
    }
  }, [location.pathname]);
  const onInit = () => {
    const jwt = localStorage.getItem("jwt") || false;
    if (jwt) {
      setIsLoggedIn(true);
      setIsLoading(true);
      api
        .getInitInfo()
        .then(([cardItemsArr, userInfoRes]) => {
          navigate("/");
          validateToken(jwt)
            .then((res) => {
              setCurrentUser({...userInfoRes, email: res.data.email});
              setCards(cardItemsArr);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(`Error: ${err}`);
              onHandleBtnText("Log in", true, err);
            });
        })
        .catch((error) => {
          console.log("error:", error);
          setCards(loadingInitError.card);
          setCurrentUser(loadingInitError.useInfo);
          handleErrorPopupOpen();
        });
    } else {
      setIsLoggedIn(false);
      navigate("/signin");
    }
  };
  const handleEditProfileClick = () => {
    if (isLoading) return;
    setIsEditProfilePopupOpen(true);
    setFormSetting(formSettingStates.EDIT_PROFILE);
  };

  const handleAddElementClick = () => {
    if (isLoading) return;
    setIsAddPlacePopupOpen(true);
    setFormSetting(formSettingStates.ADD_ITEM);
  };
  const handleEditAvatarClick = () => {
    if (isLoading) return;
    setIsEditAvatarPopupOpen(true);
    setFormSetting(formSettingStates.EDIT_AVATAR);
  };
  const handleCardClick = ({name, link}) => {
    if (isLoading) return;
    setSelectedCard({isOpen: true, name, link});
  };
  const handleRemoveCardClick = (cardId) => {
    if (isLoading) return;
    setIsRemovePopupOpen(true);
    formSettingStates.REMOVE_CARD.cardId = cardId;
    setFormSetting(formSettingStates.REMOVE_CARD);
  };
  const handleErrorPopupOpen = () => {
    setIsErrorPopupOpen(true);
    setFormSetting(formSettingStates.POPUP_ERROR);
  };
  const handleAlertPopupOpen = (isSuccessful) => {
    setIsAlertPopupOpen(true);
    setAlertSetting(
      formSettingStates[
        isSuccessful ? "ALERT_POPUP_SUCCESSFUL" : "ALERT_POPUP_FAILED"
      ]
    );
    setTimeout(() => {
      closeAllPopup();
    }, 3000);
  };
  const closeAllPopup = () => {
    setTimeout(() => {
      setIsEditProfilePopupOpen(false);
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsRemovePopupOpen(false);
      setIsErrorPopupOpen(false);
      setIsAlertPopupOpen(false);
      setSelectedCard((prevState) => ({
        ...prevState,
        isOpen: false
      }));
    }, 1);
  };

  const onHandleBtnText = (btnTxt = "Saving...", isDisable = true, error) => {
    if (error) {
      console.log(`Error: ${error}`);
      setFormSetting((prevState) => ({
        ...prevState,
        btnSetting: {txt: txtErr, isDisable: true}
      }));
      setTimeout(() => {
        setFormSetting((prevState) => ({
          ...prevState,
          btnSetting: {txt: btnTxt, isDisable: false}
        }));
      }, 1100);
    } else {
      setFormSetting((prevState) => ({
        ...prevState,
        btnSetting: {txt: btnTxt, isDisable: isDisable}
      }));
    }
  };

  const handlePopupMouseDown = (e) => {
    const contextMenu = 2;
    if (e.button === contextMenu) return;
    if (
      e.target.classList.contains("popup-box_visible") ||
      e.target.classList.contains("popup-box__close-button")
    ) {
      closeAllPopup();
    }
  };
  const handleEscClose = useCallback((e) => {
    if (e.key === "Escape") {
      closeAllPopup();
    }
    // eslint-disable-next-line
  }, []);
  const handleToggleLikedBtn = (isLiked, id) => {
    if (isLoading) return;
    if (!isLiked) {
      api
        .addItemLike(id)
        .then((res) => {
          const newState = [...cards];
          newState.find((item) => item._id === id).likes = res.likes;
          setCards(newState);
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
          handleErrorPopupOpen();
        });
    } else {
      api
        .removeItemLike(id)
        .then((res) => {
          const newState = [...cards];
          newState.find((item) => item._id === id).likes = res.likes;
          setCards(newState);
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
          handleErrorPopupOpen();
        });
    }
  };
  const handleSubmitRemoveCard = (e) => {
    e.preventDefault();
    onHandleBtnText();
    api
      .onRemoveItem(formSetting.cardId)
      .then(() => {
        onHandleBtnText("Place removed successfully!", true);
        setCards(cards.filter((item) => item._id !== formSetting.cardId));
        setTimeout(() => {
          closeAllPopup();
        }, 1000);
      })
      .catch((err) => {
        onHandleBtnText("Yes", true, err);
      });
  };
  const handleSubmitAddItem = (e, {imgTitle, imgSrc}) => {
    e.preventDefault();
    onHandleBtnText();
    api
      .addNewCard({
        name: imgTitle,
        link: imgSrc
      })
      .then((res) => {
        onHandleBtnText("Place added successfully!", true);
        setCards((prevState) => [res, ...prevState]);
        setTimeout(() => {
          closeAllPopup();
        }, 1000);
      })
      .catch((err) => {
        onHandleBtnText("Create", true, err);
      });
  };
  const handleSubmitEditProfile = (e, {name, description}) => {
    e.preventDefault();
    onHandleBtnText();
    api
      .setUserInfo({name, about: description})
      .then((res) => {
        onHandleBtnText("Profile edited successfully!", true);
        setCurrentUser(res);
        setTimeout(() => {
          closeAllPopup();
        }, 1000);
      })
      .catch((err) => {
        onHandleBtnText("Save", true, err);
      });
  };

  const handleSubmitChangeProfilePic = (e, avatarInput) => {
    e.preventDefault();
    onHandleBtnText();
    api
      .onUpdateProfilePic({avatar: avatarInput})
      .then(() => {
        onHandleBtnText("Profile Picture modified successfully!", true);
        setCurrentUser((prevState) => ({
          ...prevState,
          avatar: avatarInput
        }));
        setTimeout(() => {
          closeAllPopup();
        }, 1000);
      })
      .catch((err) => {
        onHandleBtnText("Save", true, err);
      });
  };

  const handleNewUserSubmit = ({email, password}) => {
    onHandleBtnText("Signing up...");
    register({email, password})
      .then(() => {
        handleAlertPopupOpen(true);
        console.log(isAlertPopupOpen);
        navigate("/signin");
      })
      .catch((err) => {
        handleAlertPopupOpen(false);
        onHandleBtnText("Sign up", true, err);
        console.log(isAlertPopupOpen);
      });
  };

  const handleSubmitLogInFrom = ({email, password}) => {
    onHandleBtnText("Logging in...");
    authenticate({email, password})
      .then((user) => {
        setCurrentUser({...currentUser, email});
        localStorage.setItem("jwt", user.token);
        setIsLoggedIn(true);
        onInit();
      })
      .catch((err) => {
        onHandleBtnText("Log in", true, err);
      });
  };
  const handleLogOutclicked = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  };
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header
          isLoggedIn={isLoggedIn}
          handleLogOutclicked={handleLogOutclicked}
          isLoading={isLoading}
        />
        <Routes>
          <Route
            path="/signin"
            element={
              <Login
                isLoading={isLoading}
                onSubmit={handleSubmitLogInFrom}
                onSetVaildMsg={onSetVaildMsg}
                validMsg={validMsg}
                handleMsgVaild={handleMsgVaild}
                isValidInput={isValidInput}
                formSetting={formSetting}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Register
                isLoading={isLoading}
                onSubmit={handleNewUserSubmit}
                onSetVaildMsg={onSetVaildMsg}
                validMsg={validMsg}
                handleMsgVaild={handleMsgVaild}
                isValidInput={isValidInput}
                formSetting={formSetting}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  currentUser={currentUser}
                  cards={cards}
                  setFormSetting={setFormSetting}
                  onEditProfile={handleEditProfileClick}
                  onAddElement={handleAddElementClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  closeAllPopup={closeAllPopup}
                  handleToggleLikedBtn={handleToggleLikedBtn}
                  handleRemoveCardClick={handleRemoveCardClick}
                  isLoading={isLoading}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <AddPlacePopup
          onSetVaildMsg={onSetVaildMsg}
          isOpen={isAddPlacePopupOpen}
          formSetting={formSetting}
          isValidInput={isValidInput}
          closeAllPopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
          handleSubmitAddItem={handleSubmitAddItem}
          validMsg={validMsg}
          handleMsgVaild={handleMsgVaild}
        />

        <EditProfilePopup
          onSetVaildMsg={onSetVaildMsg}
          isOpen={isEditProfilePopupOpen}
          formSetting={formSetting}
          isValidInput={isValidInput}
          closeAllPopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
          handleSubmitEditProfile={handleSubmitEditProfile}
          validMsg={validMsg}
          handleMsgVaild={handleMsgVaild}
          setValidInput={setValidInput}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          handleSubmitChangeProfilePic={handleSubmitChangeProfilePic}
          formSetting={formSetting}
          closeAllPopup={closeAllPopup}
          isValidInput={isValidInput}
          onSetVaildMsg={onSetVaildMsg}
          validMsg={validMsg}
          handleMsgVaild={handleMsgVaild}
          handlePopupMouseDown={handlePopupMouseDown}
        />
        <ConfirmPopup
          handleSubmitRemoveCard={handleSubmitRemoveCard}
          formSetting={formSetting}
          isOpen={isRemovePopupOpen}
          closePopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
        />
        <ErrorPopup
          formSetting={formSetting}
          isOpen={isErrorPopupOpen}
          closePopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
        />
        <ImagePopup
          selectedCard={selectedCard}
          closeAllPopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
          txtErr={txtErr}
          errImg={errImg}
        />
        <AlertPopup
          alertSetting={alertSetting}
          isOpen={isAlertPopupOpen}
          closePopup={closeAllPopup}
          handlePopupMouseDown={handlePopupMouseDown}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
