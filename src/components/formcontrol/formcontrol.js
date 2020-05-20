import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/FormControl';

const KEYCODES = {
  ENTER: 13
};

const MyFormControl = (props) => {
  const newProps = { ...props};
  delete newProps.onEnter;

  const onKeyUp = (e) => {
    e.preventDefault();
    if (e.keyCode === KEYCODES.ENTER) {
      if(props.onEnter) props.onEnter();
    }
  };

  return (
    <FormControl
      {...newProps}
      onKeyUp={onKeyUp}
    />
  )
}

MyFormControl.propTypes = {
  onEnter: PropTypes.func
}

MyFormControl.defaultProps = {
  onEnter: null
}

export default MyFormControl;