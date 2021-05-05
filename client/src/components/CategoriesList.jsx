import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
/*
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import * as icons from '@material-ui/icons';

const categoryIconsMaping = {
  'life-style': 'EmojiPeople', // 'Cake', 'ChildFriendly'
  music: 'MusicNote',
  'movies-tv': 'Theaters',
  'video-games': 'VideogameAsset',
  travel: 'Flight',
  news: 'Announcement',
  'story-time': 'Forum',
  history: 'History',
  science: 'Public',
  pictures: 'Satellite',
  pranks: 'DirectionsRun',
  'horror-terror': 'MoodBad',
  driving: 'DriveEta',
  tech: 'Computer',
  internet: 'Http',
  health: 'LocalHospital',
  funny: 'EmojiEmotions',
  culture: 'Map',
  mystery: 'RemoveRedEye',
  languages: 'Language',
  sports: 'Sports',
};

function useIcons(word) {
  const Icon = icons[word];
  return <Icon />;
}
*/
const useChipClasses = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

const CategoriesList = ({ categories = [] }) => {
  const chipClasses = useChipClasses();
  const theme = useTheme();
  const isFullWidthMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="button">Categories</Typography>
      <Grid
        container
        direction={isFullWidthMatch ? 'column' : 'row'}
        alignContent="flex-start"
        alignItems="flex-start"
        justify="space-evenly"
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            classes={{ ...chipClasses }}
            variant="outlined"
            label={category.description}
          />
        ))}
      </Grid>
    </>
  );
};

export default CategoriesList;
