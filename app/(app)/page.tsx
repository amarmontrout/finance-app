"use client"

import { Box, Typography } from "@mui/material"
import { useEffect } from "react"
import PageContainer from "../components/PageContainer"
import Section from "../components/Section"
import Surface from "../components/ui/Surface"
import { useTransactionContext } from "../contexts/transaction-context"
import { formatDate } from "../lib/functions/formatters"
import { getISODate } from "../lib/functions/getters"
import BudgetProgress from "./BudgetProgress"
import Summary from "./Summary"

export default function Home() {
  const { setSelectedDate } = useTransactionContext()
  const date = formatDate(getISODate())

  useEffect(() => setSelectedDate(new Date()), [setSelectedDate])

  return (
    <PageContainer>
      <Box sx={{ padding: 1.5, height: 64 }}>
        <Typography variant={"h4"}>{date}</Typography>
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

      {/* <Section>
        <Surface>
          <CreditCardEstimate />
        </Surface>
      </Section> */}
    </PageContainer>
  )
}
