import { accentColorPrimarySelected } from "@/globals/colors"
import { linkStyle, navSelection } from "@/globals/styles"
import { SvgIconComponent } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import Link from "next/link"

export type PageLinkType = {
  name: string,
  link: string,
  icon: SvgIconComponent
}

const PageLink = (props: {item: PageLinkType, active?: boolean}) => {
  const { item, active } = props
  return (
    <Link style={linkStyle} href={item.link} >
      <Box 
        sx={{
          ...navSelection,
          "&::before": {
            ...navSelection["&::before"],
            width: active ? "100%" : 0,
            backgroundColor: active? accentColorPrimarySelected : "none",
          },
        }}
        display={"flex"} 
        flexDirection={"row"}
        gap={1}
        alignItems={"center"}
      >
        <item.icon />
        <Typography variant={"h5"} >
          {item.name}
        </Typography>
      </Box>
    </Link>
  )
}

export default PageLink