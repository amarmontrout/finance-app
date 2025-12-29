"use client"

import MockDataWarning from "@/components/MockDataWarning"
import AverageExpenses from "./AverageExpenses"
import { FlexColWrapper } from "@/components/Wrappers"
import Projections from "./Projections"

const Trends =() => {
  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <AverageExpenses/>

      <Projections/>
    </FlexColWrapper>
  )
}

export default Trends