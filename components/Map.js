import React from "react";
import { View } from "react-native";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <View>
          <svg id="svg_parent" width="1700" height="2200">
            <image
              xlinkHref="https://staging-edit.meridianapps.com/api/maps/5653104741580800.svg?namespace=5468665088573440_1&hash=d7e6519c78a4586e2a0f7ed98f6dd274&style=0b0f58e11f367d89ef3bd5ef0e850104&default_style=original"
              height="2200"
              width="1700"
            />

            <svg x="1396.6849688435675" y="1591.5310946482457">
              <path d="M25.52,27.38h-15A3.36,3.36,0,0,1,7.4,25.9a3.28,3.28,0,0,1,.29-3.35l7.2-12a3.5,3.5,0,0,1,2.93-1.92,3.53,3.53,0,0,1,2.92,1.87l7.52,12.07a3.17,3.17,0,0,1,.35,3.34,3.32,3.32,0,0,1-3.09,1.48m-7.7-16.76a1.61,1.61,0,0,0-1.22.94l-7.2,12a1.49,1.49,0,0,0-.27,1.34,1.58,1.58,0,0,0,1.37.48h15a1.58,1.58,0,0,0,1.35-.46,1.47,1.47,0,0,0-.3-1.31L19,11.54a1.62,1.62,0,0,0-1.22-.92m1,7.76v-3a1,1,0,1,0-2,0v3a1,1,0,1,0,2,0M18.5,23.09a1,1,0,0,0,.29-0.71,1,1,0,1,0-.29.71" />
            </svg>

            <image
              xlinkHref="https://staging-edit.meridianapps.com/api/maps/5653104741580800.svg?namespace=5468665088573440_1&hash=d7e6519c78a4586e2a0f7ed98f6dd274&style=0b0f58e11f367d89ef3bd5ef0e850104&default_style=original"
              height="50"
              width="50"
              x="1005"
              y="1500"
            />
          </svg>
        </View>
      </View>
    );
  }
}
