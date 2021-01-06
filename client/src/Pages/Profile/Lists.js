import React, { Fragment } from "react";
import { Inertia } from "@inertiajs/inertia";
import Layout from "../../components/Layout"
import Window from "../../components/Window"
import {
  VideoListItemContainer,
  VideoListItemContent,
  VideoListItemImage,
  VideoListItemDescriptions,
  ItemTitle,
  ItemAuthor,
} from "../../components/VideoListItem";

const List = ({ lists }) => {
  return (
    <Layout>
      <Window title="My lists">
        {lists.map((item) => (
          <VideoListItemContainer key={item.id}>
            <VideoListItemContent
              onClick={(e) => {
                e.preventDefault();
                Inertia.replace(`/list/1`);
              }}
            >
              {item.videos.length > 0 && (
                <VideoListItemImage
                  src={`/images/${item.videos[0].thumbnail_name}`}
                />
              )}
              {item.videos.length === 0 && <strong>This list doesn't have videos yet</strong>}
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
