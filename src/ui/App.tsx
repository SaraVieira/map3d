import { Space } from "../three/Space"
import { FullscreenModal } from "../components/FullscreenModal"
import { Title } from "@/components/text/Title"
import { Description } from "@/components/text/Description"
import { Column } from "@/components/flex/Column"
import { MapComponent } from "@/components/map/SelectMap"
import { useState } from "react"
import {
  Button,
  NextButton,
  PrevButton,
} from "@/components/button/BottomButton"
import { BuildingHeights } from "@/components/map/Processing"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { useAreaStore } from "@/state/areaStore"
import { useActionStore } from "@/state/exportStore"
import { Modal } from "@/components/modal/Modal"
import { TopNav } from "@/components/nav/TopNav"
import { Row } from "@/components/flex/Row"

function App() {
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true)
  const [areaData, setAreaData] = useState([])
  const [steps, setSteps] = useState(["front", "processing"])
  const [step, setStep] = useState(0)
  const [isWarnModal, setIsWarnModal] = useState(false)
  const [isExportModal, setIsExportModal] = useState(false)

  const setCenter = useAreaStore((state) => state.setCenter)
  const setAction = useActionStore((state) => state.setAction)

  const checkIsBig = () => {
    const a = areaData[0].lat - areaData[1].lat
    const b = areaData[0].lng - areaData[1].lng

    console.log(a + b)

    if (a + b > 0.1) {
      return true
    } else {
      return false
    }
  }

  const exportFile = () => {
    setAction(true)
  }

  const handleDone = (data) => {
    setAreaData(data)
    setCenter(data)
    console.log(data, "AAEE")
    setIsNextButtonDisabled(false)
  }

  const handleRemove = () => {
    setAreaData([])
    setIsNextButtonDisabled(true)
  }

  const handleClickNextStep = () => {
    if (step == 0 && checkIsBig()) {
      setIsWarnModal(true)
      return false
    }
    setStep(step + 1)
  }

  const handleClickPrevStep = () => {
    setStep(step - 1)
  }

  const handleClickExport = () => {
    setIsExportModal(true)
  }

  return (
    <div>
      <TopNav />

      <FullscreenModal isOpen={steps[step] == "front"}>
        <MapComponent
          onRemove={handleRemove}
          onDone={handleDone}
        ></MapComponent>
      </FullscreenModal>

      <FullscreenModal isOpen={steps[step] == "processing"}>
        <Column gap="1rem">
          <Column gap="0.5rem">
            <Title>Processing</Title>
            <Description>
              Click the button below to get the building information.
            </Description>

            <BuildingHeights area={areaData} />
          </Column>
        </Column>
      </FullscreenModal>

      <PrevButton isShow={step != 0} onClick={handleClickPrevStep}>
        <ChevronLeft /> Prev Step
      </PrevButton>

      <NextButton
        isShow={step != 2}
        disabled={isNextButtonDisabled}
        onClick={handleClickNextStep}
      >
        Next Step <ChevronRight />
      </NextButton>

      <NextButton isShow={step == 2} onClick={handleClickExport}>
        Export GLB <Download />
      </NextButton>

      <Modal isOpen={isWarnModal} onClose={() => setIsWarnModal(false)}>
        <Column gap="0.5rem">
          <Title>The area is too big </Title>
          <Description>Do you want to proceed?</Description>
          <Button
            isShow={step != 2}
            disabled={isNextButtonDisabled}
            onClick={() => {
              setStep(step + 1)
              setIsWarnModal(false)
            }}
          >
            Next Step <ChevronRight />
          </Button>
        </Column>
      </Modal>

      <Modal isOpen={isExportModal} onClose={() => setIsExportModal(false)}>
        <Column gap="0.5rem">
          <Title>Export</Title>

          <Row gap="0.5rem">
            <Button isShow={true} onClick={exportFile}>
              GLB Download <Download />
            </Button>
          </Row>
        </Column>
      </Modal>

      <Space></Space>
    </div>
  )
}

export default App
