import React, { Fragment, useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import styled from "styled-components";
import Layout from "../../components/Layout"
import Window from "../../components/Window"
import {
  VideoListItemContainer,
  VideoListItemContent,
  VideoListItemImage,
  VideoListItemDescriptions,
  ItemTitle,
  ItemAuthor,
  VideoListItemActions
} from "../../components/VideoListItem";

const SuccessMessage = styled.strong`
  display: block;
  background-color: #096d08;
  color: white;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  cursor: pointer;
`;

const List = ({ lists, flash }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(flash.success);

  useEffect(function() {
    setSuccessMessage(flash.success);
  }, [flash.success]);

  function handleDeleteLists(id) {
    Inertia.delete(`/list/${id}`, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {},
      onFinish() {
        setIsLoading(false);
      },
    });
  }
  return (
    <Layout>
      <Window title="My lists">
        {successMessage && (
          <SuccessMessage onClick={() => setSuccessMessage(null)}>{successMessage}</SuccessMessage>
        )}
        {lists.map((list) => (
          <VideoListItemContainer key={list.id}>
            <VideoListItemContent
              onClick={(e) => {
                e.preventDefault();
                Inertia.replace(`/list/1`);
              }}
            >
              {list.videos.length > 0 && (
                <VideoListItemImage
                  src={`/images/${list.videos[0].thumbnail_name}`}
                />
              )}
              {list.videos.length === 0 && <strong>This list doesn't have videos yet</strong>}
              <VideoListItemDescriptions>
                <ItemTitle>{list.title}</ItemTitle>
                <ItemAuthor>List by {list.user.email}</ItemAuthor>
              </VideoListItemDescriptions>
            </VideoListItemContent>
            <VideoListItemActions>
              {!isLoading && (
                <Fragment>
                  <i className="fas fa-trash-alt" onClick={(e) => {
                    e.preventDefault();
                    handleDeleteLists(list.id);
                  }}></i>
                  <i className="fas fa-edit"></i>
                </Fragment>
              )}
              {isLoading && <i>Working...</i>}
            </VideoListItemActions>
          </VideoListItemContainer>
        ))}
      </Window>
    </Layout>
  );
}

export default List;
