import { css } from "@emotion/react";
import { Space } from "../three/Space";
import { FullscreenModal } from "../components/FullscreenModal";
import { Title } from "@/components/text/Title";
import { Description } from "@/components/text/Description";
import { Column } from "@/components/flex/Column";
import { MapComponent } from "@/components/map/SelectMap";
import { useState } from "react";
import { BottomButton } from "@/components/button/BottomButton";

function App() {
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const handleDone = (e) => {
    console.log(e);
    setIsNextButtonDisabled(false);
  };

  const handleClickNextStep = () => {};

  return (
    <div css={css({ height: "100%", width: "100%" })}>
      <FullscreenModal isOpen={true}>
        <Column gap="1rem">
          <Column gap="0.5rem">
            <Title>Generate 3d map</Title>
            <Description>
              Tools to create 3D maps based on maps and export them in 3D format
            </Description>
          </Column>
          <MapComponent onDone={handleDone}></MapComponent>
        </Column>
      </FullscreenModal>

      <BottomButton
        disabled={isNextButtonDisabled}
        onClick={handleClickNextStep}
      >
        Next Step
      </BottomButton>

      <Space />
    </div>
  );
}

export default App;
