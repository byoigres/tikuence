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

// const ItemContainer = styled.div`
//   display: flex;
//   align-items: stretch;
//   flex-grow: 1;
//   box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
//   margin-bottom: 1rem;
//   /* max-height: 100px; */
// `;

// const ItemImage = styled.img`
//   background-image: url(${(p) => p.backgroundImage});
//   align-self: center;
//   flex: 0 0 auto;
//   width: 33.3333333333%;
// `;

// const ItemContent = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   flex-direction: column;
//   justify-content: center;
//   text-align: center;
// `;

// const ItemTitle = styled.h1`
//   font-size: 1.4rem;
// `;

// const ItemAuthor = styled.strong`
//   font-size: 0.8rem;
// `;
 
const List = ({ lists }) => {
  return (
    <Layout>
      <Window title="Lists">
        {lists.map((item) => (
          <VideoListItemContainer key={item.id}>
            <VideoListItemContent
              onClick={(e) => {
                e.preventDefault();
                Inertia.replace(`/lists/1`);
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
            {/* <VideoListItemActions>
            <i className="fas fa-trash-alt"></i>
            <i className="fas fa-arrow-up"></i>
            <i className="fas fa-arrow-down"></i>
          </VideoListItemActions> */}
          </VideoListItemContainer>
        ))}
      </Window>
    </Layout>
  );
}

export default List;
