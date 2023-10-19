import {useAuth} from 'contexts/AuthContext';


function Header(props) {
  const {isStaff, isAuthenticated, user, logout} = useAuth();

  return (
    isAuthenticated &&
      <header className="header">
        <div className="header__button">
          <button className="button" onClick={logout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
        </div>
        {
          isStaff &&
          <div className="header__login">
            Logged in as {user.username}
          </div>
        }
      </header>
  )
}

export default Header;
