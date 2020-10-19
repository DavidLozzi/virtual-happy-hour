import React from 'react';
import './mobile.scss';

const Mobile = ({ children, hide, show }) => {
  let theClass = '';
  if(hide) theClass = 'hide';
  if(show) theClass = 'show';
  return <div id="mobile" className={theClass}>{children}</div>
}

export default Mobile;