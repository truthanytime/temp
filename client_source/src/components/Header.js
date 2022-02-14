import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import Darkbutton from "../components/Darkbutton";
import { setIsexpand } from "../redux/actions/util";
const Header = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsopen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isNoti, setIsNoti] = useState(false);
  const [isafterexpand, setIsafterexpand] = useState(false);
  const [isexpandover, setIsexpandover] = useState(true);
  const [Tooltip, setTooltip] = useState("");
  const [TooltipOffset, setTooltipOffset] = useState("0px");

  const toggleOpen = () => setIsopen(!isOpen);
  const toggleActive = () => setIsActive(!isActive);
  const toggleisNoti = () => setIsNoti(!isNoti);
  const { isexpand } = useSelector((state) => state.util); // here, indicate reducer
  const toggleexpand = () => {
    setTimeout(() => {
      setIsafterexpand(!isafterexpand);
    }, 250);
    dispatch(setIsexpand(!isexpand));
  };
  const expandover = (e) => {
    const span = e.target.nextElementSibling;
    const offset = e.currentTarget.parentElement.offsetTop + 100 + "px";
    setIsexpandover(!isexpandover);
    setTooltip(span.innerHTML);
    setTooltipOffset(offset);
  };

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive ? " show" : ""}`;
  const notiClass = `${isNoti ? " show" : ""}`;
  const navwidth = `${isexpand ? " 280px" : "84px"}`;
  const { vcoin } = useSelector((state) => state.auth); // here, indicate reducer

  return (
    <div className="nav-header bg-white shadow-xs border-0">
      <div className="nav-top d-flex justify-content-between">
        <Link to="/">
          <img
            height="60"
            alt="favicon"
            className="text-success display2-size me-1 ms-4"
            src="/logo.png"
          ></img>
          <span className="d-inline-block fredoka-font ls-3 fw-600 text-dark font-xxl logo-text mb-0"></span>{" "}
        </Link>
        {/* <Link to="/myfeed" className="mob-menu ms-auto me-2 chat-active-btn"><i className="feather-package text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
                <Link to="/upload" className="mob-menu me-2"><i className="feather-upload text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
                <span onClick={toggleActive} className="me-2 menu-search-icon mob-menu"><i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></span> */}
        <button
          onClick={toggleOpen}
          className={`nav-menu me-0 ms-2 ${buttonClass}`}
        ></button>
      </div>

      <form action="#" className="float-left header-search ms-3">
        <div className="form-group mb-0 icon-input">
          <i className="feather-search font-sm text-grey-400"></i>
          <input
            type="text"
            placeholder="Type search words.."
            className="bg-grey text-grey-900 border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg"
          />
        </div>
      </form>
      {/* <NavLink activeClassName="active" to="/home" className="p-2 text-center ms-3 menu-icon center-menu-icon"><i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
            <NavLink activeClassName="active" to="/upload" className="p-2 text-center ms-3 menu-icon center-menu-icon"><i className="feather-upload font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
            <NavLink activeClassName="active" to="/mapping" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-map-pin font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500  me-3"></i></NavLink>            
            <NavLink activeClassName="active" to="/checkout" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-credit-card font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>            
             */}
      <span
        className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`}
        id="dropdownMenu3"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={toggleisNoti}
      >
        <span className="dot-count bg-warning"></span>
        <i className="feather-bell font-xl text-dark"></i>
      </span>
      {/* <div className={`dropdown-menu bg-dark p-4 right-0 rounded-xxl border-0 shadow-lg ${notiClass}`} style={{top:'20px'}} aria-labelledby="dropdownMenu3">
                <h4 className="fw-700 font-xss text-white mb-4">Notification</h4>
                <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
                    <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                    <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Hendrix Stamp <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 3 min</span></h5>
                    <h6 className="text-grey-500 fw-500 font-xssss lh-4">There are many variations of pass..</h6>
                </div>
                <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
                    <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                    <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Goria Coast <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 2 min</span></h5>
                    <h6 className="text-grey-500 fw-500 font-xssss lh-4">Mobile Apps UI Designer is require..</h6>
                </div>

                <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
                    <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                    <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Surfiya Zakir <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 1 min</span></h5>
                    <h6 className="text-grey-500 fw-500 font-xssss lh-4">Mobile Apps UI Designer is require..</h6>
                </div>
                <div className="card bg-transparent-card w-100 border-0 ps-5">
                    <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                    <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Victor Exrixon <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 30 sec</span></h5>
                    <h6 className="text-grey-500 fw-500 font-xssss lh-4">Mobile Apps UI Designer is require..</h6>
                </div>
            </div> */}
      <Link
        to="/defaultmessage"
        className="p-2 text-center ms-3 menu-icon chat-active-btn"
      >
        <i className="feather-message-square font-xl text-dark"></i>
      </Link>
      <Darkbutton />
      <div className="p-0 ms-3 menu-icon">
        <h3 className="border-bottom-1 border-dark">{vcoin} Vcoin</h3>
        <h3>{Number(1)}Vcoin/$</h3>
      </div>

      <nav
        className={`navigation scroll-bar ${navClass}`}
        style={{ width: navwidth }}
      >
        <div className="container ps-0 pe-0">
          <div className="nav-content">
            <div className="nav-wrap bg-white bg-transparent-card pt-3 pb-1 mb-2 mt-2">
              <div className="nav-caption fw-600 font-xssss text-grey-500"></div>
              <ul className="mb-1 top-content">
                <li className="logo d-none d-xl-block d-lg-block"></li>
                <li>
                  <Link to="/home" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="font-xl text-grey-500 feather-home me-4"
                    ></i>
                    <span>HOME</span>
                  </Link>
                </li>
                <li>
                  <Link to="/myfeed" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="feather-package font-xl text-grey-500 me-4"
                    ></i>
                    <span>My Feed</span>
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="feather-upload font-xl text-grey-500 me-4"
                    ></i>
                    <span>Upload </span>
                  </Link>
                </li>
                <li>
                  <Link to="/mapping" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="font-xl text-grey-500 feather-map-pin me-4"
                    ></i>
                    <span>Mapping</span>
                  </Link>
                </li>
                <li>
                  <Link to="/save" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="font-xl text-grey-500 feather-bookmark me-4"
                    ></i>
                    <span>Save</span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="feather-user font-xl text-grey-500 me-4"
                    ></i>
                    <span>Profile </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="nav-content-bttn open-font h-auto pt-2 pb-2"
                  >
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="font-xl feather-settings me-4 text-grey-500"
                    ></i>
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="nav-wrap bg-white bg-transparent-card shadow-xss pt-3 pb-1">
              <div className="nav-wrap fw-600 font-xssss text-grey-500"></div>
              <ul className="mb-1">
                <li
                  onClick={toggleexpand}
                  className="pointer d-xl-block d-lg-block text-primary"
                >
                  <i
                    onMouseOver={(e) => expandover(e)}
                    onMouseOut={(e) => expandover(e)}
                    className={`ms-3 font-xl ${
                      isafterexpand
                        ? "feather-chevrons-right"
                        : "feather-chevrons-left"
                    } me-4`}
                  ></i>
                  <span className="font-md">
                    {isafterexpand ? "Expand" : "Collapse"}
                  </span>
                </li>
                <li>
                  <Link to="/checkout" className="nav-content-bttn open-font">
                    <i
                      onMouseOver={(e) => expandover(e)}
                      onMouseOut={(e) => expandover(e)}
                      className="font-xl feather-credit-card me-4 text-grey-500"
                    ></i>
                    <span>Wallet</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {!isexpand ? (
        <div
          className={`fw-600 font-xss ${isexpandover ? "d-none" : "d-block"}`}
          style={{
            position: "absolute",
            top: TooltipOffset,
            left: "80px",
            padding: "10px",
            backgroundColor: "#000000",
            color: "white",
            zIndex: "10",
          }}
        >
          {Tooltip}
        </div>
      ) : (
        ""
      )}
      <div className={`app-header-search ${searchClass}`}>
        <form className="search-form">
          <div className="form-group searchbox mb-0 border-0 p-1">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search..."
            />
            <i className="input-icon">
              <ion-icon
                name="search-outline"
                role="img"
                className="md hydrated"
                aria-label="search outline"
              ></ion-icon>
            </i>
            <span className="ms-1 mt-1 d-inline-block close searchbox-close">
              <i className="ti-close font-xs" onClick={toggleActive}></i>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Header;
