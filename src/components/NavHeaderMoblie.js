import {useLocation, Link} from "react-router-dom";
import moblieMenuBtnOpen from "../images/header/header__hamburger.svg";
import moblieMenuBtnClose from "../images/header/header__menu-close.svg";

const NavHeaderMoblie = ({
  isLoggedIn,
  isMoblieMenuOpen,
  setIsMoblieMenuOpen
}) => {
  const location = useLocation();

  return (
    <>
      <nav className="header__nav-container header__nav-container_type_moblie">
        {!isLoggedIn && location.pathname === "/signin" && (
          <div className="header__nav-loggedout_type_moblie link-modifier ">
            <Link to="/signup">Sign up</Link>
          </div>
        )}
        {!isLoggedIn && location.pathname === "/signup" && (
          <div className="header__nav-loggedout_type_moblie link-modifier ">
            <Link to="/signin">Log in</Link>
          </div>
        )}
      </nav>
      {isLoggedIn && (
        <>
          {!isMoblieMenuOpen ? (
            <button
              className="header__moblie-menu-btn button-modifier animation-modifier_type_opacity-hover "
              onClick={() => {
                setIsMoblieMenuOpen(true);
              }}
            >
              <img src={moblieMenuBtnOpen} alt="Open navbar menu" />
            </button>
          ) : (
            <button
              className="header__moblie-menu-btn button-modifier animation-modifier_type_opacity-hover"
              onClick={() => {
                setIsMoblieMenuOpen(false);
              }}
            >
              <img src={moblieMenuBtnClose} alt="Open navbar menu" />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default NavHeaderMoblie;
