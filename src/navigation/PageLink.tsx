import { accentColorPrimarySelected } from "@/globals/colors"
import { linkStyle, navSelection } from "@/globals/styles"
import { SvgIconComponent } from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"

export type PageLinkType = {
  name: string
  link: string
  icon: SvgIconComponent
}

export const PageLink = ({
  item,
  active,
}: {
  item: PageLinkType
  active: boolean
}) => {
  return (
    <Link style={linkStyle} href={item.link}>
      <Box
        sx={{
          ...navSelection,
          "&::before": {
            ...navSelection["&::before"],
            width: active ? "100%" : 0,
            backgroundColor: active ? accentColorPrimarySelected : "none",
          },
        }}
        display={"flex"}
        flexDirection={"row"}
        gap={1}
        alignItems={"center"}
        height={"100%"}
      >
        <item.icon fontSize="large" />
        <Typography className="flex" variant={"h6"}>
          {item.name}
        </Typography>
      </Box>
    </Link>
  )
}

export const HorizontalPageLink = ({
  item,
  active,
}: {
  item: PageLinkType
  active: boolean
}) => {
  return (
    <Link key={item.name} href={item.link} style={{ textDecoration: "none" }}>
      <Stack
        direction="column"
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
        sx={{
          py: 1,
          px: 2,
          borderRadius: 2,
          color: active ? "primary.main" : "text.secondary",
          transition: "all 0.2s ease-in-out",
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <item.icon fontSize="medium" />
        <Typography fontSize={11}>{item.name}</Typography>
      </Stack>
    </Link>
  )
}
