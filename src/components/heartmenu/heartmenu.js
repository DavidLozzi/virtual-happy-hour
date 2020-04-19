import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { HeartFill } from 'react-bootstrap-icons';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './heartmenu.scss';

const HeartMenu = () => {
  const donate = () => {
    analytics.event('donate', CATEGORIES.LINKS);
    window.open('https://paypal.me/davidlozzi');
  }

  const feedback = () => {
    analytics.event('feedback', CATEGORIES.LINKS);
    window.open('https://paypal.me/davidlozzi');
  }

  const bug = () => {
    analytics.event('bug', CATEGORIES.LINKS);
    window.open('https://paypal.me/davidlozzi');
  }
  const heartButton = React.forwardRef(({ children, onClick }, ref) => (
    <HeartFill
      size={25}
      className="icon"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ))
  return (
    <Dropdown id="heartmenu" drop="left">
      <Dropdown.Toggle as={heartButton} />
      <Dropdown.Menu>
        <Dropdown.Item onClick={donate}>Love it? Please Donate</Dropdown.Item>
        <Dropdown.Item onClick={feedback}>Feedback or Feature Request</Dropdown.Item>
        <Dropdown.Item onClick={bug}>Report a Bug</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default HeartMenu;