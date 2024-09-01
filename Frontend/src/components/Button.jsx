// import React from 'react';
import PropTypes from 'prop-types';

const def = "font-semibold rounded shadow-md ";

function Button({ children, onClick, red, white, className }) {
  let style = red
    ? def + "border-2 border-red-700 bg-white hover-bg-red-700 text-black hover-text-white "
    : white
    ? def + "border-2 border-teal-700 hover-border-none bg-white hover-bg-teal-800 hover-text-white "
    : def + "bg-teal-700 text-white hover-bg-teal-800 ";
  style += className ? className : "w-72 h-11";

  return (
    <button onClick={onClick} className={style}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  red: PropTypes.bool,
  white: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;