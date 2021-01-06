import React, { Fragment, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import styled from "styled-components";
import Layout from "../../components/Layout";
import Window from "../../components/Window";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
} from "../../components/Modal";
import {
  VideoListItemContainer,
  VideoListItemContent,
  VideoListItemImage,
  VideoListItemDescriptions,
  ItemSubtitle,
  ItemAuthor,
  VideoListItemActions,
} from "../../components/VideoListItem";
import Button from "../../components/Button"

const AddVideoContainer = styled.div`
  margin: 1rem 0;
  text-align: center;
`;

const VideosCount = styled.div`
  margin: 0.5rem 0;
`;

const Edit = ({ list }) => {
  const { error } = usePage();
  const [title, setTitle] = useState(list.title);
  const [newVideoURL, setNewVideoURL] = useState("");
  const [isTitleInEditMode, setIsTitleInEditMode] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  function toggleAddVideoModalOpen(e) {
    setIsAddVideoModalOpen(!isAddVideoModalOpen);
  }

  function handleTitleChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  function handleTitleClick(e) {
    e.preventDefault();
    console.log(isTitleInEditMode);
    setIsTitleInEditMode(!isTitleInEditMode);
  }

  function handleNewVideoURLChange(e) {
    e.preventDefault();
    setNewVideoURL(e.target.value);
  }

  function handleNewVideo(e) {
    e.preventDefault();
    Inertia.post(`/list/${list.id}/video`, {
      url: newVideoURL,
    });
  }

  return (
    <Layout>
      <Window title="Edit list">
        {isTitleInEditMode && (
          <Fragment>
            <input
              id="title"
              name="title"
              value={title}
              autoFocus
              onChange={handleTitleChange}
              autoComplete="off"
              required
              // disabled={isLoading}
            />
            <Button onClick={handleTitleClick}>Cancel</Button>
            <Button>Save</Button>
          </Fragment>
        )}
        {!isTitleInEditMode && (
          <h1 className={""} onClick={handleTitleClick}>
            {list.title}
          </h1>
        )}
        <AddVideoContainer>
          <VideosCount>
            {`There are ${list.videos.length} videos in this list`}
          </VideosCount>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsAddVideoModalOpen(true);
            }}
          >
            Add video...
          </Button>
        </AddVideoContainer>
        {list.videos.map((video) => (
          <VideoListItemContainer key={video.id}>
            <VideoListItemContent>
              <VideoListItemImage src={`/images/${video.thumbnail_name}`} />
              <VideoListItemDescriptions>
                <ItemSubtitle>{video.title}</ItemSubtitle>
                <ItemAuthor>List by {video.author.username}</ItemAuthor>
              </VideoListItemDescriptions>
            </VideoListItemContent>
            <VideoListItemActions>
              <i className="fas fa-trash-alt"></i>
              <i className="fas fa-arrow-up"></i>
              <i className="fas fa-arrow-down"></i>
            </VideoListItemActions>
          </VideoListItemContainer>
        ))}
        <Modal
          isOpen={isAddVideoModalOpen}
          onBackgroundClick={toggleAddVideoModalOpen}
          onEscapeKeydown={toggleAddVideoModalOpen}
          opacity={1}
          backgroundProps={{ opacity: 1 }}
        >
          <ModalHeader
            title="Add video..."
            closeCallback={toggleAddVideoModalOpen}
          />
          <ModalContent>
            <input
              id="new-video"
              name="new-video"
              value={newVideoURL}
              onChange={handleNewVideoURLChange}
              placeholder="Video URL"
              type="url"
              autoFocus
              autoComplete="off"
              required
              // disabled={isLoading}
            />
          </ModalContent>
          <ModalActions>
            <Button
              type="button"
              onClick={handleNewVideo}
              // disabled={isLoading}
              // loading={isLoading}
            >
              Add video
            </Button>
          </ModalActions>
        </Modal>
      </Window>
    </Layout>
  );
};

export default Edit;
