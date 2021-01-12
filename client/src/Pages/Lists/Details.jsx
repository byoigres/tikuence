import React, { useState } from 'react';
import styled from 'styled-components';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { TikTok } from 'react-tiktok';
import Typography from '@material-ui/core/Typography';
import Layout from '../../components/Layout';
import TikTokVideo from '../../components/TikTokVideo';

const Container = styled.section`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  overflow-y: scroll;

  scroll-snap-type: mandatory;
  /* scroll-snap-points-y: repeat(3rem); */
  scroll-snap-type: y proximity;
  position: relative;
  z-index: 1;
`;

const Video = styled.article`
  height: 100vh;
  width: 100vw;
  /* background-color: black; */
  scroll-snap-align: start;
  /* margin: 1rem 0; */
`;

const Details = ({ list }) => {
  const { error } = usePage();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container data-name="Container">
      <Video key="title">
        <Typography
          component="h4"
          variant="h4"
          style={{
            margin: '1rem 1rem 0 1rem',
            textAlign: 'center',
          }}
        >
          {list.title}
        </Typography>
      </Video>
      {list.videos.map((video) => (
        <Video key={video.id}>
          <TikTokVideo html={video.html} />
        </Video>
      ))}
    </Container>
  );
};

Details.layout = (page) => <Layout children={page} title="Welcome" cleanLayout />;

export default Details;
