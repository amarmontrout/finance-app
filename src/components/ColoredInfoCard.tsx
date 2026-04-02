import { Stack, Typography } from "@mui/material"

export type CardColorsType = {
  background: string
  textIcon: string
  border: string
}

const ColoredInfoCard = ({
  cardColors,
  title,
  info,
}: {
  cardColors: CardColorsType
  title: string
  info: string
}) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        background: cardColors.background + "20",
        border: `1.5px solid ${cardColors.border}`,
        borderRadius: 3,
        padding: "8px 10px",
        minWidth: 160,
        width: "100%",
      }}
    >
      <Typography
        color={cardColors.textIcon}
        sx={{
          fontSize: { xs: "0.95rem", md: "1.1rem" },
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      <Typography
        color={cardColors.textIcon}
        sx={{
          fontSize: { xs: "1.75rem", md: "2rem" },
          fontWeight: 700,
        }}
      >
        {info}
      </Typography>
    </Stack>
  )
}

export default ColoredInfoCard
