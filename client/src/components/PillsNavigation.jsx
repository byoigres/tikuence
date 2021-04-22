import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  navigation: {
    margin: theme.spacing(1),
  },
  pill: {
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '&:not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const PillsNavigation = ({ children, value, onChange, style = {} }) => {
  const classes = useStyles();

  return (
    <div className={classes.navigation} style={style}>
      {React.Children.map(children, (child, childIndex) => {
        if (!React.isValidElement(child)) {
          return null;
        }

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
