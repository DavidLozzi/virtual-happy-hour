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

  const coffee = () => {
    analytics.event('coffee', CATEGORIES.LINKS);
    window.open('https://www.buymeacoffee.com/davidlozzi');
  }

  const feedback = () => {
    analytics.event('feedback', CATEGORIES.LINKS);
    window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=eBIX0mRBW0qcSNE8o8S4uV77t6Bb_nVGrH1y5i3LkuBUQUFFRlRJMTlGVjNSUkdXRUlOUkgwNVlaRS4u');
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
        <Dropdown.Item onClick={coffee}>Love it? Buy me a coffee</Dropdown.Item>
        <Dropdown.Item onClick={feedback}>Share Feedback or Issue</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default HeartMenu;