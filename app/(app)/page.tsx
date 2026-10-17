"use client"

import { Box, Typography } from "@mui/material"
import { useEffect } from "react"
import PageContainer from "../components/PageContainer"
import Section from "../components/Section"
import Surface from "../components/ui/Surface"
import { useTransactionContext } from "../contexts/transaction-context"
import BudgetProgress from "./BudgetProgress"
import Summary from "./Summary"

export default function Home() {
  const { setSelectedDate } = useTransactionContext()

  useEffect(() => setSelectedDate(new Date()), [setSelectedDate])

  return (
    <PageContainer>
      <Box sx={{ padding: 1.5, height: 64 }}>
        <Typography variant={"h4"}>Welcome,</Typography>
      </Box>

      <Section>
        <Surface>
          <Summary />
        </Surface>
      </Section>

      <Section>
        <Surface>
          <BudgetProgress />
        </Surface>
      </Section>
    </PageContainer>
  )
}
