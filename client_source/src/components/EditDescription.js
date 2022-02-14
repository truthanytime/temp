import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MentionsInput, Mention } from "react-mentions";
import { Button, Modal } from "react-bootstrap";
import api from "../utils/api";
const EditDescription = (blog, setNewBlog) => {
    //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { user } = useSelector((state) => state.auth); // here, indicate reducer

  const keydown = (e) => {
    return e.keyCode;
  };

  //hastag
  const [content, setContent] = useState(blog.blog.description);
  const [tagNames, setTagNames] = useState([]);
  const myInput = useRef();

  useEffect(() => {
    setContent(blog.blog.description);
  },[blog]);
  function addContent(input) {
    if (input.length <= 350) {
      setContent(input);
    }
    let length = input.length;
    if (length <= 349) setContent(input);
    if (keydown === 8 || keydown === 46) setContent(input);
  }

  async function asyncTags(query, callback) {
    if (!query) return;
    api.get(`/hashtag/tag/search?name=${query}`)
      .then((res) => {
        if (res.data.tags.length) {
          const suggestion = { id: query, display: `#${query}` };
          const tagsArray = res.data.tags.map((tag) => ({
            id: `#${tag.name}`,
            display: `#${tag.name}`,
          }));
          return [...tagsArray, suggestion];
        } else {
          return [{ id: `#${query}`, display: `#${query}` }];
        }
      })
      .then(callback);
  }

  const Uploadsubmit = async (e) => {
    e.preventDefault();
    let newContent = content;
    newContent = newContent.split("$$$_").join('');
    newContent = newContent.split("~~~_").join(``);
    newContent = newContent.split("$$$~~~").join("");

    if (newContent !== "") {
      //hash tag
      let description = newContent.trim();
      //Call to your DataBase like backendModule.savePost(body,  along_with_other_params);
      tagNames.map(async (tag) => {
        tag = tag.replace("#", "");
        try {
          await api.post("/hashtag/tag", {
            name: tag,
          });
        } catch (error) {
          console.log(error);
        }
      });
      try {
        const newBlog = await api.put(`/blog/edit/${blog.blog._id}`, {
          description: newContent,
        });
        setNewBlog(newBlog.data);
      } catch (error) {
        console.log(error);
      }
      handleClose();
    }
  };


  const [check, setcheck] = useState(false);
  const handleChange = (checked) => {
    setcheck(checked);
  };

  return (<>
            <i  onClick={handleShow} className="feather-edit me-1"></i>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="bg-black rounded-0">
                    <div className="d-flex w-100 upload">
                        <h4 className="font-md text-white fw-600 ms-4 mb-0 mt-2 ">
                          Edit description
                        </h4>
                    </div>
                </Modal.Header>
                <Modal.Body className="card bg-black rounded-0">
                  <form action="#">
                      <div className="row">
                      <div className="col-lg-12 mb-1">
                          <div className="form-gorup">
                          <label className="mont-font fw-600 font-md revertcolor p-2">
                              What's happening?
                          </label>
                          <MentionsInput
                              className="mentioFns font-sm"
                              inputRef={myInput}
                              spellCheck="false"
                              placeholder="Type less than 350 characters"
                              value={content.replace(/<[^>]+>/g, '')}
                              onChange={(event) => addContent(event.target.value)}
                              required={true}
                          >
                              <Mention
                              trigger="#"
                              data={asyncTags}
                              markup="$$$___id__~~~___display__$$$~~~"
                              style={{ backgroundColor: "#5e9ede", }}
                              onAdd={(display) => setTagNames((tagNames) => [...tagNames, display])}
                              appendSpaceAdd={true}
                              >
                              </Mention>
                          </MentionsInput>

                          
                          </div>
                      </div>
                      </div>
                      <div className="">
                      </div>
                      <div className="row"></div>
                  </form>
                </Modal.Body>
                <Modal.Footer className="bg-black rounded-0">
                    <button
                        onClick={Uploadsubmit}
                        className="bg-black text-center text-white font-md fw-600 p-1 w175 badge-pill d-inline-block"
                    >
                        modify
                    </button>
                </Modal.Footer>
            </Modal>
  </>);
};

export default EditDescription;
