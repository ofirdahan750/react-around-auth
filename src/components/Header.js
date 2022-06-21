import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import logo from "../images/header/header__logo.svg";
import NavHeaderDesktop from "./NavHeaderDesktop";
import NavHeaderMoblie from "./NavHeaderMoblie";
import MoblieMenuHeader from "./MoblieMenuHeader";

const Header = ({isLoggedIn, handleLogOutclicked}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const moblieBreakpoint = 650;
  const [isMoblieMenuOpen, setIsMoblieMenuOpen] = useState(false);
  useEffect(() => {
    //Fixing humbeger button if user toggle to bigger/smaller screen
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  useEffect(() => {
    //Logging out-closing the menu
    if (!isLoggedIn) {
      setIsMoblieMenuOpen(false);
    }
    return () => {
      setIsMoblieMenuOpen(false);
    };
  }, [isLoggedIn]);

  return (
    <>
      {width < moblieBreakpoint && isMoblieMenuOpen && isLoggedIn && (
        <MoblieMenuHeader handleLogOutclicked={handleLogOutclicked} />
      )}
      <header className="header">
        <div className="header__wrapper">
          <Link to="/">
            <img
              className="header__logo"
              src={logo}
              alt="header logo with text `Around The U.S.`"
            />
          </Link>

          {width > moblieBreakpoint ? (
            <NavHeaderDesktop
              handleLogOutclicked={handleLogOutclicked}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <NavHeaderMoblie
              isLoggedIn={isLoggedIn}
              setIsMoblieMenuOpen={setIsMoblieMenuOpen}
              isMoblieMenuOpen={isMoblieMenuOpen}
            />
          )}
        </div>
      </header>
    </>
  );
};
export default Header;
