import { accentColorPrimarySelected } from "@/globals/colors"
import { linkStyle, navSelection } from "@/globals/styles"
import { SvgIconComponent } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import Link from "next/link"

export type PageLinkType = {
  name: string
  link: string
  icon: SvgIconComponent
}

const PageLink = ({
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
        <Typography className="hidden md:flex" variant={"h6"}>
          {item.name}
        </Typography>
      </Box>
    </Link>
  )
}

export default PageLink
