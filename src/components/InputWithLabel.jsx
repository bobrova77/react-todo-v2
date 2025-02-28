import React from "react";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

function InputWithLabel(props) {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <>
      <label htmlFor="todoTitle">{props.children}</label>
      <input
        ref={inputRef}
        id="todoTitle"
        type="text"
        value={props.value}
        onChange={props.onChange}
        name="title"
      ></input>
    </>
  );
}

InputWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputWithLabel;
