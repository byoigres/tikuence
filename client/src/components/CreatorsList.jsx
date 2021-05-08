import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useChipClasses = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

const CreatorsList = ({ creators: initialCreators }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [creators, setCreators] = useState([]);
  const chipClasses = useChipClasses();
  const theme = useTheme();
  const isFullWidthMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);
  const minCreatorsToDisplay = 3;

  useEffect(() => {
    const val = isCollapsed ? initialCreators.length : minCreatorsToDisplay;
    const cr = initialCreators.filter((_, index) => index < val);
    setCreators(cr);
  }, [isCollapsed]);

  if (initialCreators.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="button">Creators</Typography>
      <Grid
        container
        direction={isFullWidthMatch ? 'column' : 'row'}
        alignContent="flex-start"
        alignItems="flex-start"
        justify="space-evenly"
        // classes={{ ...actionClasses }}
      >
        {creators.map((author) => (
          <Chip
            key={author.username}
            classes={{ ...chipClasses }}
            variant="outlined"
            label={author.name}
          />
        ))}
      </Grid>
      {initialCreators.length > minCreatorsToDisplay && (
        <Typography
          variant="body2"
          style={{ display: 'block' }}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          View all... {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
      )}
    </>
  );
};

export default CreatorsList;
