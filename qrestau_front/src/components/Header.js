import {useAPI} from 'contexts/APIContext';


function Header(props) {
  const {isStaff, user} = useAPI();

  return (
    isStaff ?
      <header className="header">
        <div className="header__login">
          Logged in as {user.username}
        </div>
        {/* <button className="header__hamburger" onClick={toggleNav}>
          <div className="hamburger__stroke"></div>
          <div className="hamburger__stroke"></div>
          <div className="hamburger__stroke"></div>
        </button> */}
      </header>
    : <></>
  )
}

export default Header;
