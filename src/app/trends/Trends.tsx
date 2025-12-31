"use client"

import MockDataWarning from "@/components/MockDataWarning"
import AverageExpenses from "./AverageExpenses"
import { FlexColWrapper } from "@/components/Wrappers"
import Projections from "./Projections"
import ExpectedSpending from "./ExpectedSpending"

const Trends =() => {
  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <AverageExpenses/>

      <Projections />

      <ExpectedSpending/>
    </FlexColWrapper>
  )
}

export default Trends