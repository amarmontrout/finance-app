import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"

export type CardColorsType = {
  bg: string
  color: string
}

const InfoCard = ({
  cardColors,
  title,
  amount,
  moreInfo,
  onClick,
}: {
  cardColors: CardColorsType
  title: string
  amount: string
  moreInfo?: ReactNode
  onClick?: () => void
}) => {
  return (
    <Stack
      direction={"column"}
      onClick={onClick}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        background: cardColors.bg,
        border: `1.5px solid ${cardColors.color}`,
        borderRadius: 3,
        padding: "8px 15px",
        minWidth: 160,
        width: "100%",
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: 160,
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 700,
            color: cardColors.color,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            color: cardColors.color,
          }}
        >
          {amount}
        </Typography>
      </Stack>

      {moreInfo && (
        <Box
          className="border-t-[3px] border-solid border-dark-4 dark:border-dark-6"
          sx={{ width: "100%" }}
        >
          {moreInfo}
        </Box>
      )}
    </Stack>
  )
}

export default InfoCard
