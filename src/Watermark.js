import { h } from "preact";

import { css, theme } from "./style";

const cssLogo = css({
  label: "logo",
  display: "block",
  fill: "rgba(0, 0, 0, 0.4)",
  width: 70,
  height: 30
});

const Logo = () => (
  <svg className={cssLogo} viewBox="0 0 196.07 71.15">
    <path d="M61.18 30.06a10.52 10.52 0 0 0-4.6-1.37v26.16h6.82V40.53a8 8 0 0 1 8.11-7.89 8.2 8.2 0 0 1 5.31 1.94V27a15.25 15.25 0 0 0-5.31-1 15.08 15.08 0 0 0-10.33 4.06zM38.93 26A14.63 14.63 0 0 0 24.1 40.43a14.63 14.63 0 0 0 14.83 14.42 15 15 0 0 0 9-3c1.54 2.49 5.83 3 5.83 3V40.43A14.63 14.63 0 0 0 38.93 26zm0 22.39a8 8 0 1 1 8.22-8 8.11 8.11 0 0 1-8.22 8.01zM157.22 26a14.63 14.63 0 0 0-14.84 14.42 14.63 14.63 0 0 0 14.84 14.42 15 15 0 0 0 9-3c1.53 2.49 5.83 3 5.83 3V40.43A14.63 14.63 0 0 0 157.22 26zm0 22.39a8 8 0 1 1 8.21-8 8.11 8.11 0 0 1-8.21 8.01zm-56-15.08v7a7.39 7.39 0 1 1-14.75 0V37c-.08-7.21-6.83-8.89-6.83-8.89v12.28a14.21 14.21 0 1 0 28.41 0V24.75h-.14c-1.31.63-6.4 2.56-6.69 8.57zM125.86 26a15.05 15.05 0 0 0-8.17 2.39v-2.25c-.28-6-5.22-7.94-6.52-8.56H111v37.36s4.44-.47 6.1-2.88a15 15 0 0 0 8.74 2.79 14.63 14.63 0 0 0 14.83-14.42A14.63 14.63 0 0 0 125.86 26zm0 22.39a8 8 0 1 1 8.22-8 8.11 8.11 0 0 1-8.22 8.01z" />
  </svg>
);

const cssWatermark = css({
  label: "watermark",
  background: "rgba(250, 250, 250, 0.6)",
  overflow: "hidden",
  position: "absolute",
  zIndex: 1,
  right: 0,
  bottom: 0,
  borderTopLeftRadius: theme.borderRadius
});

const Watermark = () => (
  <div className={cssWatermark}>
    <Logo />
  </div>
);

export default Watermark;
