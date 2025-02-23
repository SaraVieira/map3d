import { css } from "@emotion/react";
import { Space } from "./space/Space";

function App() {
  return (
    <div css={css({ height: "100%", width: "100%" })}>
      <Space />
    </div>
  );
}

export default App;
