import React, {useCallback, useEffect, useState} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import ImagePopup from "../components/ImagePopup.js";
import EditProfilePopup from "../components/EditProfilePopup.js";
import EditAvatarPopup from "../components/EditAvatarPopup.js";
import AddPlacePopup from "../components/AddPlacePopup.js";
import ConfirmPopup from "../components/ConfirmPopup.js";
import ErrorPopup from "../components/ErrorPopup.js";
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
  const [cards, setCards] = useState(loadingInitState.card);
  const [currentUser, setCurrentUser] = useState(loadingInitState.useInfo);
  const [isValidInput, setValidInput] = useState(false);
  const [validMsg, setValidMsg] = useState({});
  const handleMsgVaild = (inputVals) => {
    if (
      !isEditProfilePopupOpen &&
      !isAddPlacePopupOpen &&
      !isEditAvatarPopupOpen
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
    setIsLoading(true);
    api
      .getInitInfo()
      .then(([cardItemsArr, userInfoRes]) => {
        setIsLoading(false);
        setCards(cardItemsArr);
        setCurrentUser(userInfoRes);
      })
      .catch((error) => {
        console.log("error:", error);
        setCards(loadingInitError.card);
        setCurrentUser(loadingInitError.useInfo);
        handleErrorPopupOpen();
      });
  }, []);

  useEffect(
    () => {
      setValidInput(false);

      //Set and Remove Popups event
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
  const closeAllPopup = () => {
    onHandleBtnText("Close...", true);
    setTimeout(() => {
      setIsEditProfilePopupOpen(false);
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsRemovePopupOpen(false);
      setIsErrorPopupOpen(false);
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
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header />
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
        />
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
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
