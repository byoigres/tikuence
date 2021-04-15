import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  pill: {
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

const PillsNavigation = (children = []) => {
  const classes = useStyles();
  const [currentPill, setCurrentPill] = useState(null);

  // <Chip color="primary" label="Recent" icon={<RestoreIcon />} style={{ height: 36, paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }} onClick={() => onFilterClick('recent')} />
  // <Chip label="News" variant="outlined" icon={<WbSunnyIcon />} style={{ height: 36, marginLeft: theme.spacing(1), paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }} onClick={() => onFilterClick('new')} />

  return (
    <div>
      {children.map((pill) => (
        <Chip
          color={pill.id === currentPill ? "primary" : 'default'}
          label={pill.label}
          icon={pill.icon}
          className={classes.pill}
          onClick={() => onFilterClick(pill.id)}
        />
      ))}
    </div>
  );
}

export const PillAction = ({ id, label, icon, onClick }) => (
  <Chip
    // color={id === currentPill ? "primary" : 'default'}
    label={pill.label}
    icon={pill.icon}
    className={classes.pill}
    // onClick={() => onFilterClick(pill.id)}
  />
);

export default PillsNavigation;
