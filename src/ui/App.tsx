import { css } from "@emotion/react";
import { Space } from "../space/Space";
import { FullscreenModal } from "../components/FullscreenModal";
import { Title } from "@/components/text/Title";
import { Description } from "@/components/text/Description";
import { Column } from "@/components/flex/Column";

function App() {
  return (
    <div css={css({ height: "100%", width: "100%" })}>
      <FullscreenModal isOpen={true}>
        <Column gap="0.5rem">
          <Title>Generate 3d map</Title>
          <Description>
            Tools to create 3D maps based on maps and export them in 3D format
          </Description>
        </Column>
      </FullscreenModal>
      <Space />
    </div>
  );
}

export default App;
