import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  root: {
    width: "100%",
    maxWidth: 70,
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "flex-end",
    fontSize: 13,
    textTransform: "uppercase",
    paddingRight: 5,
    borderRight: "1px solid grey",
    marginRight: 10
  },
  prefix: {
    textAlign: "right",
    fontWeight: 700,
    lineHeight: 1.5
  },
  value: {
    fontWeight: 700,
    fontSize: 32,
    color: "#3076D2"
  },
  unit: {
    fontWeight: 700
  },
  text: {
    marginLeft: 10
  }
};

const ListItemCalendar = ({ prefix, value, unit }) => (
  <div
    style={styles.root}
  >
    <div style={styles.prefix}>{prefix}</div>
    <div style={styles.value}>{value}</div>
    <div style={styles.unit}>{unit}</div>
  </div>
)

ListItemCalendar.propTypes = {
  prefix: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired
};


export default ListItemCalendar;