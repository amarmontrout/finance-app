"use client"

import PageContainer from "../components/PageContainer"
import Section from "../components/Section"
import Surface from "../components/ui/Surface"
import BudgetProgress from "./BudgetProgress"
import Summary from "./Summary"

export default function Home() {
  return (
    <PageContainer>
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
