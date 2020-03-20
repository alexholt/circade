import React, {useEffect, useState} from 'react';
import __SVGATOR_PLAYER__ from './svgator';

const svgPlayer = () => __SVGATOR_PLAYER__.build({
    "root": "eq0h2st1epos1",
    "animations": [{
        "duration": 3000,
        "direction": 1,
        "iterations": 0,
        "fill": 1,
        "alternate": false,
        "elements": {
            "eq0h2st1epos2": {
                "d": [{
                    "t": 0,
                    "v": ["M", 20, 93.692, "L", 33.0899, 57.9197, "L", 33.0899, 57.9197, "L", 33.0899, 57.9197, "L", 20, 93.692, "L", 20, 93.692, "L", 20, 93.692, "Z"]
                }, {
                    "t": 1000,
                    "v": ["M", 20, 93.692, "L", 33.0899, 57.9197, "L", 71.1583, 138.407, "L", 71.1583, 138.407, "L", 78.5918, 175, "L", 78.5918, 175, "L", 20, 93.692, "Z"]
                }, {
                    "t": 2000,
                    "v": ["M", 20, 93.692, "L", 33.0899, 57.9197, "L", 71.1583, 138.407, "L", 100.981, 0, "L", 138, 12.649, "L", 78.5918, 175, "L", 20, 93.692, "Z"]
                }, {
                    "t": 3000,
                    "v": ["M", 20, 93.692, "L", 33.0899, 57.9197, "L", 71.1583, 138.407, "L", 100.981, 0, "L", 138, 12.649, "L", 78.5918, 175, "L", 20, 93.692, "Z"]
                }]
            }
        }
    }],
    "options": {
        "start": "load",
        "hover": "restart"
    }
});


export default ({isHidden}) => {
  useEffect(() => svgPlayer().restart());

  return (
    <svg
      className={`notepad--loading ${isHidden ? 'notepad--hidden' : ''}`}
      id="eq0h2st1epos1"
      viewBox="0 0 158 186"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      width="150"
    >

      <path id="eq0h2st1epos2"
        d="M20,93.692000L33.089900,57.919700L33.089900,57.919700L33.089900,57.919700L20,93.692000L20,93.692000L20,93.692000Z"
        clipRule="evenodd"
        fill="rgb(0,0,0)"
        fillRule="evenodd"
        stroke="none"
        strokeWidth="1"
      />

      <rect id="eq0h2st1epos3"
        width="155"
        height="144"
        rx="0"
        ry="0"
        transform="matrix(1 0 0 1 1.50000000000000 40.50000000000000)"
        fill="none"
        stroke="rgb(0,0,0)"
        strokeWidth="3"
      />

    </svg>
  );
};
