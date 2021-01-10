import React, { useState } from 'react';
import styled from 'styled-components';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { TikTok } from 'react-tiktok';
import Layout from '../../components/Layout';
import TikTokVideo from '../../components/TikTokVideo';

const Container = styled.section`
  height: 100vh;
  width: 100vw;

  overflow-y: scroll;

  scroll-snap-type: mandatory;
  scroll-snap-points-y: repeat(3rem);
  scroll-snap-type: y mandatory;
  position: relative;
  /* left: 510px;
  top: 50px; */
  z-index: 1;
  /* border-radius: 15px;
  border: none; */
  margin-bottom: 1rem;
`;

const Video = styled.article`
  height: 100vh;
  width: 100vw;
  /* background-color: black; */
  scroll-snap-align: start;
`;

const Details = ({ list }) => {
  const { error } = usePage();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container data-name="Container">
      {list.videos.map((video) => (
        <Video key={video.id}>
          <TikTokVideo html={video.html} />
        </Video>
      ))}
    </Container>
  );
};

Details.layout = (page) => <Layout children={page} title="Welcome" />;

export default Details;
