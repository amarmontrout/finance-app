import { linkStyle, navSelection } from "@/globals/styles"
import { Box, Typography } from "@mui/material"
import Link from "next/link"

export type PageLinkType = {
  name: string,
  link: string
}

const PageLink = (props: {item: PageLinkType}) => {
  const { item } = props
  return (
    <Link style={linkStyle} href={item.link} >
      <Box sx={navSelection} >
        <Typography variant={"h5"} >
          {item.name}
        </Typography>
      </Box>
    </Link>
  )
}

export default PageLink