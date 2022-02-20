import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Watermark } from "@hirohe/react-watermark";
import Slider from "react-slick";
import { Player } from "video-react";
import { format, formatDistance } from "date-fns";
import api from "../utils/api";
import { Dropdown } from "react-bootstrap";
import ReactHashtag from "react-hashtag";
import { Icon } from "@iconify/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LocationView from "../components/LocationView";
import EditDescription from "../components/EditDescription";
import PayDonate from "../components/PayDonate";
import { Link } from "react-router-dom";
import "../pages/style.css";

const Postview = ({
  addFollow,
  buyVcoin,
  Download,
  blogItem,
  myProfile
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [owneraddr, setowneraddr] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [username, setUsername] = useState("");
  const [user_id, setUserid] = useState("");
  // const [vcoin, setVcoin] = useState("");
  const [creatorprofile, set_profile] = useState("");
  // const [creatoraddress, set_address] = useState(null);
  const [blog, setMyblog] = useState(blogItem);
  const [newDescription, setNewDesc] = useState(blog.description);
  const [flag, setflag] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMyblog(blogItem);
    });
    return () => {
      clearTimeout(timer);
    }
  }, [blogItem]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMyblog(blog);
    });
    return () => {
      clearTimeout(timer);
    }
  }, [blog]);

  const viewLink = "http://localhost:4000/view" + blog._id;
  const toggleOpen = () => setIsOpen({ isOpen: !isOpen });
  const toggleActive = () => setIsActive({ isActive: !isActive });
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const menuClass = `${isOpen ? " show" : ""}`;
  // const emojiClass = `${isActive ? " active" : ""}`;
  const { user, isauthenticated } = useSelector((state) => state.auth); // here, indicate reducer
  useEffect(() => {
    const timer = setTimeout(() => {
      const showusername = async () => {
        const res = await api.post("/auth/name", { id: blog.creator });
        setUsername(res.data);
        // setVcoin(res.data.vcoin);
      };
      if (isauthenticated) showusername();

      const setcreatorprofle = async () => {
        const res = await api.post(`/profile/${blog.creator}`);
        set_profile(res.data);
      };
      if (isauthenticated) setcreatorprofle();
    });
    return () => {
      clearTimeout(timer);
    }
  }, [isauthenticated, blog]);

  const membersettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
  };

  const addlike = async (id) => {
    try {
      const res = await api.put(`/blog/like/${id}`);
      setMyblog(res.data);

    } catch (error) {
      console.log("error", error.response.data);
    }
  };
  const addsaveuser = async (id) => {
    try {
      const res = await api.put(`/blog/saveuser/${id}`);
      setMyblog(res.data);

    } catch (error) {
      console.log("error", error.response.data);
    }
  };
  const addReport = async (id) => {
    try {
      const res = await api.put(`/blog/report/${id}`);
      setMyblog(res.data);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };

  const editflag = () => {
    setflag(true);
  }

  const confirmDonate = () => {
    setConfirmModal(true);
  }
  const handlechangeflag = (state) => {
    setflag(state);
    setConfirmModal(state);
  }
  const handleCallback = (childData) => {
    setNewDesc(childData);
  }

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <img
            src={`${blog.hideshow == 1 ? creatorprofile.avatar
              ? creatorprofile.avatar
              : `assets/images/user.png`
              : `assets/images/user.png`}`}
            alt="avater"
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          <Link to={`/profile/${username}`} className="profilelink">
            {blog.hideshow == 1 ? <label className="fw-900 font-xss cursor-pointer">{creatorprofile.name}</label> : ""}
          </Link>
          <span className="mentiontag fw-600 font-xsss"> {blog.hideshow == 1 ? "@" + username : ""}</span>
          <span className={blog.hideshow == 1 ? "ms-2 mentiontag" : "mentiontag"}>
            {formatDistance(new Date(blog.date), new Date(), { addSuffix: true })}
          </span>
          <LocationView id={blog._id} address={blog.address} phonemodel={blog.phonemodel} />
        </h4>
        <div className="ms-auto pointer text-white">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              <i
                className="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"
                style={{ marginLeft: "10px" }}
              ></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <i className="feather-link me-1"></i>
                <CopyToClipboard text={viewLink} onCopy={onCopyText}>
                  <span>{isCopied ? "Copied!" : "Copy link to post"}</span>
                </CopyToClipboard>
              </Dropdown.Item>

              {user._id == blog.creator && (
                <Dropdown.Item onClick={() => editflag()}>
                  <i class="feather-edit me-1"></i>
                  <span>Edit Description</span>
                </Dropdown.Item>
              )}

              {flag == true ? <EditDescription value={blog} reValue={newDescription} parentCallback={handleCallback} changeflag={handlechangeflag} /> : ""}

              {/*Follow*/}
              <Dropdown.Item
                onClick={() => addFollow(blog.creator)}
                className={
                  user._id == blog.creator || location.pathname == "/save"
                    ? "d-none"
                    : ""
                }
              >
                <Icon
                  icon={
                    myProfile.following.some((follow) => follow.user == blog.creator)
                      ? "simple-line-icons:user-unfollow"
                      : "simple-line-icons:user-follow"
                  }
                  className="me-1"
                />
                {myProfile.following.some((follow) => follow.user == blog.creator)
                  ? "Unfollow"
                  : "Follow"}
                @{username}
              </Dropdown.Item>
              {/*Report*/}
              {user._id != blog.creator && (
                <Dropdown.Item
                  onClick={() => addReport(blog._id)}
                  className={
                    blog.reporters.some((reporter) => reporter.user == user._id)
                      ? "reported"
                      : ""
                  }
                >
                  <Icon icon="bi:flag-fill" className="me-1" />
                  {blog.reporters.some((reporter) => reporter.user == user._id)
                    ? "Reported this"
                    : "Report"}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="card-body p-0 me-lg-5">
        <p
          className="fw-500 mentiontag lh-26 font-xssss w-100 mb-2 description"
        >
          <ReactHashtag
            renderHashtag={(hashtagValue) => (
              <a key={blog._id} href={`${hashtagValue}`}>{hashtagValue}</a>
            )}
          >
            {newDescription}
          </ReactHashtag>
        </p>
      </div>
      {blog.filetype === "video" ? (
        <Slider {...membersettings}>
          <div
            className="d-block mb-3 overflow-hidden"
            style={{ width: "100%" }}
          >
            <Player poster={blog.thumb} src={blog.markedmetaurl} />
          </div>
        </Slider>
      ) : null}
      {blog.filetype === "image" ? (
        <div className="card-body d-block p-0 mb-3">
          <div className="row ps-2 pe-2">
            <div className="col-sm-12 p-1">
              <img src={blog.markedmetaurl} className="rounded-3 w-100" alt="post" />
            </div>
          </div>
        </div>
      ) : null}
      <div className="card-body d-flex p-0 justify-content">
        <div
          className="card-body p-0 emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
          onClick={() => addlike(blog._id)}
        >
          <i className="feather-heart text-red me-2 btn-round-xs font-lg"></i>
          <span className="d-none-xss text-red">{blog.likes.length}</span>
        </div>
        <div
          className="card-body p-0 emoji-bttn pointer d-flex align-items-center fw-600 text-dark lh-26 font-xssss me-2"
          onClick={() => addsaveuser(blog._id)}
        >
          <Icon
            className="font-lg text-dark me-2"
            icon={
              blog.saveusers.some((saveuser) => saveuser.user == user._id)
                ? "bi:bookmark-dash-fill"
                : "bi:bookmark"
            }
          />
          <span className="d-none-xss text-dark">
            {blog.saveusers.some((saveuser) => saveuser.user == user._id)
              ? "unsave"
              : "save"}
          </span>
        </div>
        {blog.creator != user._id ? <div className="card-body p-0 d-flex">
          <button
            className="border-0 bg-transparent d-flex align-items-center fw-600 text-grey-900 lh-26 font-xssss text-dark"
            onClick={() => confirmDonate()}
          >
            <i className="feather-dollar-sign btn-round-sm font-xs text-dark"></i>
            Donate
          </button>
        </div> : ""}
        <div
          className={`card-body p-0 pointer ms-auto d-flex align-items-center fw-600 text-dark lh-26 font-xssss ${menuClass}`}
          id={`dropdownMenu${blog._id}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={toggleOpen}
        >
          <i className="feather-share-2 text-dark btn-round-sm font-md"></i>
          <span className="d-none-xs">Share</span>
        </div>
        <div className="card-body p-0 d-flex">
          {blog.price !== 0 ? (
            <button
              className="border-0 bg-transparent d-flex align-items-center fw-600 text-grey-900 lh-26 font-xssss text-dark"
              onClick={() => buyVcoin(blog._id, blog.price)}
            >
              <i className="feather-download btn-round-sm font-xs text-dark"></i>
              Buy
            </button>
          ) : (
            <button
              className="border-0 bg-transparent d-flex align-items-center fw-600 text-grey-900 lh-26 font-xssss text-dark"
              onClick={() => Download(blog._id)}
            >
              <i className="feather-download btn-round-sm font-xs text-dark"></i>
              Download
            </button>
          )}
        </div>
      </div>
      {confirmModal == true ? <PayDonate value={blog} userValue={user} parentCallback={handleCallback} changeflag={handlechangeflag} /> : ""}
    </div>
  );
};

export default Postview;
