import React from 'react';
import { classNames } from "../utils";
import '../Styles/Button.css';

const noop = () => {};

const Button = ({ onClick, text, className, ...otherProps }) => (
  <button onClick={onClick || noop} className={classNames('button', className)} {...otherProps}>
    {text || ""}
  </button>
);

export default Button;
