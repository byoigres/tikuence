import React, { useState } from 'react';
import styled from 'styled-components';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { TikTok } from 'react-tiktok';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Layout from '../../components/Layout';
import TikTokVideo from '../../components/TikTokVideo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialog: {
    padding: 0,
  },
}));

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

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Details = ({ list }) => {
  const classes = useStyles();
  const { error } = usePage();
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    Inertia.visit('/');
  }
  function handleCreate() {}

  return (
    <Dialog
      fullScreen
      open
      onClose={handleClose}
      TransitionComponent={Transition}
      closeAfterTransition
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            disabled={isLoading}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {list.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialog}>
        <Container data-name="Container">
          {list.videos.map((video) => (
            <Video key={video.id}>
              <TikTokVideo html={video.html} />
            </Video>
          ))}
        </Container>
      </DialogContent>
    </Dialog>
  );
};

Details.layout = (page) => <Layout children={page} title={page.props.list.title} cleanLayout />;

export default Details;
