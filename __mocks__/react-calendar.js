const React = require('react');
module.exports = function MockCalendar(props) {
  return <div data-testid="mock-calendar">{props.children}</div>;
};