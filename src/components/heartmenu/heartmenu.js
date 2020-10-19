import React from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { HeartFill } from 'react-bootstrap-icons';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './heartmenu.scss';

const HeartMenu = () => {
  const donate = () => {
    analytics.event('donate', CATEGORIES.LINKS);
    window.open('https://remoteparty.social/donate/');
  }

  const feedback = () => {
    analytics.event('feedback', CATEGORIES.LINKS);
    window.open('https://remoteparty.social/contact/');
  }

  const heartButton = React.forwardRef(({ children, onClick }, ref) => (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>Bug? Feedback? Click here to share!</Tooltip>}
    >
      <HeartFill
        className="icon"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      />
    </OverlayTrigger>
  ))
  return (
    <Dropdown id="heartmenu" drop="left">
      <Dropdown.Toggle as={heartButton} />
      <Dropdown.Menu>
        <Dropdown.Item onClick={feedback}>Share Feedback or an Issue</Dropdown.Item>
        <Dropdown.Item onClick={donate}>Please consider a donation</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default HeartMenu;