import React from "react";
import svg from "svg.js";
import panzoom from "svg.panzoom.js";
import { View } from "react-native";

const ICON_PATH = `M25.52,27.38h-15A3.36,3.36,0,0,1,7.4,25.9a3.28,3.28,0,0,1,.29-3.35l7.2-12a3.5,3.5,0,0,1,2.93-1.92,3.53,3.53,0,0,1,2.92,1.87l7.52,12.07a3.17,3.17,0,0,1,.35,3.34,3.32,3.32,0,0,1-3.09,1.48m-7.7-16.76a1.61,1.61,0,0,0-1.22.94l-7.2,12a1.49,1.49,0,0,0-.27,1.34,1.58,1.58,0,0,0,1.37.48h15a1.58,1.58,0,0,0,1.35-.46,1.47,1.47,0,0,0-.3-1.31L19,11.54a1.62,1.62,0,0,0-1.22-.92m1,7.76v-3a1,1,0,1,0-2,0v3a1,1,0,1,0,2,0M18.5,23.09a1,1,0,0,0,.29-0.71,1,1,0,1,0-.29.71`;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const foo = svg.adopt(this.mapRef);
    const bar = svg.adopt(this.tagRef);

    // foo.image(
    //   "https://render.bitstrips.com/v2/cpanel/38380598-39a3-47ae-b0e7-94b606e61db9-257a69f2-ce01-4457-abea-693657c5bbf0-v1.png?transparent=1&palette=1",
    //   200,
    //   200,
    // );

    let group = foo.group();
    let newpath = group.path(ICON_PATH);
    newpath.translate(200, 200);
    foo.panZoom({ zoomMin: 1, zoomMax: 20 });
  }
  render() {
    return (
      <View>
        <View>
          <svg
            ref={(ele) => {
              this.mapRef = ele;
            }}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="1000px"
            height="554px"
            viewBox="0 0 1000 554"
            enableBackground="new 0 0 1000 554"
          >
            <g id="floor" opacity="0.6">
              <g>
                <rect
                  x="-261.8"
                  y="-72"
                  fill="#DAE1E7"
                  width="73"
                  height="73"
                />
              </g>
              <rect x="19" y="68.5" fill="#DAE1E7" width="937" height="463.5" />
            </g>
            <g id="stairs-elevators" opacity="0.6">
              <rect
                x="-261.8"
                y="259.7"
                fill="#EC7F82"
                width="97.4"
                height="27.4"
              />
              <rect
                x="280.5"
                y="68.5"
                fill="#EC7F82"
                width="215.5"
                height="85.5"
              />
              <rect
                x="19"
                y="183.5"
                fill="#EC7F82"
                width="68.8"
                height="59.5"
              />
            </g>
            <g id="restrooms" opacity="0.6">
              <rect
                x="-261.8"
                y="365.2"
                fill="#7D95AB"
                width="67.3"
                height="33.3"
              />
              <rect
                x="496"
                y="68.5"
                fill="#7D95AB"
                width="150.5"
                height="85.5"
              />
            </g>
            <g id="accent_1" opacity="0.6">
              <rect
                x="-247.1"
                y="1677.5"
                fill="#5A2049"
                width="67.3"
                height="65.4"
              />
            </g>
            <g id="accent_2" opacity="0.6">
              <rect
                x="-247.1"
                y="1783.5"
                fill="#7B4D6D"
                width="67.3"
                height="65.4"
              />
            </g>
            <g id="accent_3" opacity="0.6">
              <rect
                x="-247.1"
                y="1889.5"
                fill="#820024"
                width="67.3"
                height="65.4"
              />
            </g>
            <g id="accent_4" opacity="0.6">
              <rect
                x="-247.1"
                y="1995.5"
                fill="#9B3350"
                width="67.3"
                height="65.4"
              />
            </g>
            <g id="base_logo" opacity="0.6">
              <rect x="-247.1" y="2101.5" width="67.3" height="65.4" />
            </g>
            <g id="concessions" opacity="0.6">
              <rect
                x="-261.8"
                y="616.5"
                fill="#F0DA7D"
                width="67.3"
                height="65.4"
              />
            </g>
            <g id="water" opacity="0.5">
              <rect
                x="-262.4"
                y="937.5"
                fill="#58B6C6"
                width="98"
                height="66.1"
              />
            </g>
            <g id="grass" opacity="0.5">
              <rect
                x="-262.4"
                y="1093.5"
                fill="#28A058"
                width="98"
                height="66.1"
              />
            </g>
            <g id="streets">
              <rect
                x="-262.4"
                y="1252.5"
                fill="#833089"
                width="98"
                height="66.1"
              />
            </g>
            <g id="extra">
              <rect
                x="-262.4"
                y="1567.5"
                fill="#2A4B9E"
                width="98"
                height="66.1"
              />
            </g>
            <g id="concrete">
              <rect
                x="-262.4"
                y="1410.5"
                fill="#706116"
                width="98"
                height="66.1"
              />
            </g>
            <g id="interior-walls" opacity="0.6">
              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="-261.8"
                y1="157.5"
                x2="-132.9"
                y2="157.5"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="189,183.5 
		280.5,183.5 280.5,68.5 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="19"
                y1="183.5"
                x2="116.5"
                y2="183.5"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="189"
                y1="243"
                x2="252"
                y2="243"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="19"
                y1="243"
                x2="156.5"
                y2="243"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="87.8"
                y1="228.5"
                x2="87.8"
                y2="243"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="87.8"
                y1="183.5"
                x2="87.8"
                y2="189.5"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="334"
                y1="269.5"
                x2="334"
                y2="154"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="222.5,243 
		222.5,305.5 334,305.5 334,300.2 	"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="640.5,154 
		646.5,154 646.5,68.5 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="528"
                y1="154"
                x2="611"
                y2="154"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="316"
                y1="154"
                x2="500"
                y2="154"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="280.5"
                y1="154"
                x2="286.5"
                y2="154"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="292.5,305.5 
		292.5,243 334,243 	"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="496,68.5 
		496,196 646.5,196 	"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="839,186.5 
		839,191.5 956,191.5 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="839"
                y1="68.5"
                x2="839"
                y2="155.5"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="459.5,430 
		337.5,430 337.5,532 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="491.5"
                y1="430"
                x2="482.5"
                y2="430"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="752.5"
                y1="430"
                x2="520"
                y2="430"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="788,532 788,430 
		781.5,430 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="487.5"
                y1="430"
                x2="487.5"
                y2="532"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="636.2"
                y1="430"
                x2="636.2"
                y2="532"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="839,283.5 
		839,313 956,313 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="839"
                y1="236"
                x2="839"
                y2="259.5"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="839"
                y1="191.5"
                x2="839"
                y2="211.7"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="839"
                y1="249.7"
                x2="956"
                y2="249.7"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="571.2"
                y1="68.5"
                x2="571.2"
                y2="154"
              />
              <polyline
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                points="337.5,345 
		337.5,305.5 334,305.5 	"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="337.5"
                y1="430"
                x2="337.5"
                y2="393.5"
              />

              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="31.5"
                y1="336"
                x2="189"
                y2="336"
              />
            </g>
            <g id="inaccessible" opacity="0.5">
              <rect
                x="-262.4"
                y="780.5"
                fill="#272F36"
                width="98"
                height="66.1"
              />
            </g>
            <g id="exterior-walls" opacity="0.6">
              <line
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="5"
                strokeLinecap="square"
                strokeMiterlimit="10"
                x1="-261.8"
                y1="77"
                x2="-173.4"
                y2="77"
              />

              <rect
                x="19"
                y="68.5"
                fill="none"
                stroke="#5B6C7D"
                strokeWidth="5"
                strokeLinecap="square"
                strokeMiterlimit="10"
                width="937"
                height="463.5"
              />
            </g>
            <g id="notes">
              <text
                transform="matrix(1 0 0 1 -261.7939 246.667)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Stairs, Elevators
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 60.7607)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Exterior Walls
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 -79.7773)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Floor
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 140.958)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Interior Walls
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 355.2979)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Restrooms
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 737.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Non-Accessible
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 915.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Water
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1072.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Grass
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1233.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Streets
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1394.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Concrete
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1551.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Extra
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 766.6934)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Areas
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 457.335)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                “Concessions”
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 486.1348)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                - shops
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 514.9355)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                - cafeteria
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 543.7344)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                - restaurant
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 572.5352)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                - coffee shop
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 601.335)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                - etc.
              </text>
              <text
                transform="matrix(1 0 0 1 -262.4468 1772.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Accent_2
              </text>
              <text
                transform="matrix(1 0 0 1 -262.4468 1667.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Accent_1
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1879.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Accent_3
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 1985.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Accent_4
              </text>
              <text
                transform="matrix(1 0 0 1 -261.7939 2191.8945)"
                fontFamily="'MyriadPro-Regular'"
                fontSize="24"
              >
                Base_Logo
              </text>
            </g>
          </svg>
        </View>
      </View>
    );
  }
}
