import React, { Fragment } from "react";
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
  VideoListItemActions,
} from "../../components/VideoListItem";
 
const List = ({ lists }) => {
  return (
    <Layout>
      <Window title="Lists">
        {lists.map((item) => (
          <VideoListItemContainer key={item.id}>
            <VideoListItemContent
              onClick={(e) => {
                e.preventDefault();
                Inertia.replace(`/list/1`);
              }}
            >
              <VideoListItemImage
                src={`/images/${item.videos[0].thumbnail_name}`}
              />
              <VideoListItemDescriptions>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemAuthor>List by {item.user.email}</ItemAuthor>
              </VideoListItemDescriptions>
            </VideoListItemContent>
          </VideoListItemContainer>
        ))}
      </Window>
    </Layout>
  );
}

export default List;
