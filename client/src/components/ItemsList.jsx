import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import EditIcon from '@material-ui/icons/Edit';

const useGridClasses = makeStyles((theme) => ({
  [theme.breakpoints.down('md')]: {
    root: {
      flexWrap: 'nowrap',
      width: 'auto',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {},
  },
}));

const useChipClasses = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const ItemsList = ({
  title,
  items: initialItems = [],
  keyProperty,
  labelProperty,
  minimal = null,
  onEditClick,
}) => {
  const chipClasses = useChipClasses();
  const gridClasses = useGridClasses();
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [baseItems, setBaseItems] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(minimal === null);
  const isFullWidthMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);

  useEffect(() => {
    if (minimal && isFullWidthMatch) {
      const minimalItems = initialItems.filter((_, index) => index < minimal);
      setBaseItems(minimalItems);
      const restItems = initialItems.filter((_, index) => index >= minimal);
      setItems(restItems);
    } else {
      setBaseItems(initialItems);
    }
  }, [isFullWidthMatch, initialItems]);

  if (initialItems.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="button">
        {title} ({initialItems.length})
        {onEditClick && (
          <IconButton size="small" onClick={onEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Typography>
      <Grid
        container
        direction={isFullWidthMatch ? 'column' : 'row'}
        alignContent="flex-start"
        alignItems="flex-start"
        justify={isFullWidthMatch ? 'space-evenly' : 'flex-start'}
        classes={{ ...gridClasses }}
      >
        {baseItems.map((item) => (
          <Chip
            key={item[keyProperty]}
            classes={{ ...chipClasses }}
            variant="outlined"
            label={item[labelProperty]}
          />
        ))}
        <Collapse in={isCollapsed}>
          {items.map((item) => (
            <Chip
              key={item[keyProperty]}
              classes={{ ...chipClasses }}
              variant="outlined"
              label={item[labelProperty]}
            />
          ))}
        </Collapse>
        {isFullWidthMatch && minimal && initialItems.length > minimal && (
          <Typography
            variant="body2"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
          >
            View all... {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Typography>
        )}
      </Grid>
    </>
  );
};

export default ItemsList;
