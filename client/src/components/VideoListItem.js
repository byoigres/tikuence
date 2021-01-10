import React from 'react';
import styled from 'styled-components';

export const VideoListItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-grow: 1;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin-bottom: 1rem;
`;

export const VideoListItemContent = styled.div`
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  /* box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); */
  margin-bottom: 1rem;
`;

export const VideoListItemImage = styled.img`
  background-image: url(${(p) => p.backgroundImage});
  align-self: center;
  flex: 0 0 auto;
  width: 33.3333333333%;
`;

export const VideoListItemDescriptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

export const ItemTitle = styled.h1`
  font-size: 1.4rem;
`;

export const ItemSubtitle = styled.h1`
  font-size: 1rem;
`;

export const ItemAuthor = styled.strong`
  font-size: 0.8rem;
`;

export const VideoListItemActions = styled.div``;

export const VideoListItemActionsSeparator = styled.hr``;

const VideoListItem = ({ title, subtitle, thumbnail, author, onClick }) => (
  <VideoListItemContainer>
    <VideoListItemContent onClick={onClick}>
      <VideoListItemImage src={thumbnail} />
      <VideoListItemDescriptions>
        {title && <ItemTitle>{title}</ItemTitle>}
        {subtitle && <ItemSubtitle>{subtitle}</ItemSubtitle>}
        <ItemAuthor>List by {author}</ItemAuthor>
      </VideoListItemDescriptions>
    </VideoListItemContent>
    <VideoListItemActions>
      <i className="fas fa-trash-alt" />
      <i className="fas fa-arrow-up" />
      <i className="fas fa-arrow-down" />
    </VideoListItemActions>
  </VideoListItemContainer>
);

export default VideoListItem;
