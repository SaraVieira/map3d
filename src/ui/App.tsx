import { css } from "@emotion/react";
import { ExportButton, Space } from "../three/Space";
import { FullscreenModal } from "../components/FullscreenModal";
import { Title } from "@/components/text/Title";
import { Description } from "@/components/text/Description";
import { Column } from "@/components/flex/Column";
import { MapComponent } from "@/components/map/SelectMap";
import { useState } from "react";
import { NextButton, PrevButton } from "@/components/button/BottomButton";
import { BuildingHeights } from "@/components/map/Processing";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useAreaStore } from "@/state/areaStore";
import { useActionStore } from "@/state/exportStore";

const IconSize = css({
  width: "14px",
  height: "14px",
});

function App() {
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [areaData, setAreaData] = useState([]);
  const [steps, setSteps] = useState(["front", "processing"]);
  const [step, setStep] = useState(0);
  const setCenter = useAreaStore((state) => state.setCenter);
  const setAction = useActionStore((state) => state.setAction);

  const handleDone = (data) => {
    setAreaData(data);
    setCenter(data);
    console.log(data, "AAEE");
    setIsNextButtonDisabled(false);
  };

  const handleRemove = () => {
    setAreaData([]);
    setIsNextButtonDisabled(true);
  };

  const handleClickNextStep = () => {
    setStep(step + 1);
  };

  const handleClickPrevStep = () => {
    setStep(step - 1);
  };

  const handleClickExport = () => {
    setAction(true);
  };

  return (
    <div css={css({ height: "100%", width: "100%" })}>
      <FullscreenModal isOpen={steps[step] == "front"}>
        <Column gap="1rem">
          <Column gap="0.5rem">
            <Title>Generate 3d map</Title>
            <Description>
              Tools to create 3D maps based on maps and export them in 3D format
            </Description>
          </Column>
          <MapComponent
            onRemove={handleRemove}
            onDone={handleDone}
          ></MapComponent>
        </Column>
      </FullscreenModal>

      <FullscreenModal isOpen={steps[step] == "processing"}>
        <Column gap="1rem">
          <Column gap="0.5rem">
            <Title>Processing</Title>
            <Description>
              Tools to create 3D maps based on maps and export them in 3D format
            </Description>

            <BuildingHeights area={areaData} />
          </Column>
        </Column>
      </FullscreenModal>

      <PrevButton isShow={step != 0} onClick={handleClickPrevStep}>
        <ChevronLeft css={IconSize} /> Prev Step
      </PrevButton>

      <NextButton
        isShow={step != 2}
        disabled={isNextButtonDisabled}
        onClick={handleClickNextStep}
      >
        Next Step <ChevronRight css={IconSize} />
      </NextButton>

      <NextButton isShow={step == 2} onClick={handleClickExport}>
        Export GLB <Download css={IconSize} />
      </NextButton>

      <Space></Space>
    </div>
  );
}

export default App;
