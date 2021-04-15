import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  navigation: {},
  pill: {
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '&:not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const PillsNavigation = ({ children, value, onChange }) => {
  const classes = useStyles();
  // const [currentPill, setCurrentPill] = useState(null);

  // <Chip color="primary" label="Recent" icon={<RestoreIcon />} style={{ height: 36, paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }} onClick={() => onFilterClick('recent')} />
  // <Chip label="News" variant="outlined" icon={<WbSunnyIcon />} style={{ height: 36, marginLeft: theme.spacing(1), paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }} onClick={() => onFilterClick('new')} />

  return (
    <div className={classes.navigation}>
      {React.Children.map(children, (child, childIndex) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        // if (process.env.NODE_ENV !== 'production') {
        //   if (isFragment(child)) {
        //     console.error(
        //       [
        //         "Material-UI: The BottomNavigation component doesn't accept a Fragment as a child.",
        //         'Consider providing an array instead.',
        //       ].join('\n')
        //     );
        //   }
        // }

        const childValue = child.props.value === undefined ? childIndex : child.props.value;

        return React.cloneElement(child, {
          className: classes.pill,
          selected: childValue === value,
          label: child.props.label,
          icon: child.props.icon,
          value: childValue,
          onClick: (e) => onChange(e, childValue),
        });
      })}
    </div>
  );
};

export const PillAction = ({ value, selected, label, icon, onClick }) => {
  const classes = useStyles();

  return (
    <Chip
      value={value}
      color={selected ? 'primary' : 'default'}
      label={label}
      icon={icon}
      className={classes.pill}
      onClick={onClick}
    />
  );
};

export default PillsNavigation;
