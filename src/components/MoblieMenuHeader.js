import {useContext} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

const NavHeaderMoblie = ({handleLogOutclicked}) => {
  const {email} = useContext(CurrentUserContext);
  if (email) {
    return (
      <nav className="header__nav-user-loggedin header__nav-user-loggedin_type_moblie">
        <span className="header__nav-user-email header__nav-user-email_type_moblie">
          {email}
        </span>
        <span
          className="header__logout-btn header__logout-btn_type_moblie"
          onClick={handleLogOutclicked}
        >
          Log out
        </span>
      </nav>
    );
  }
};
export default NavHeaderMoblie;
