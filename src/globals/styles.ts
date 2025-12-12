import { accentColorPrimaryHover } from "./colors";

export const linkStyle = {
    textDecoration: "none",
    color: "inherit"
}

export const navSelection = {
  position: "relative",
  color: "inherit",
  cursor: "pointer",
  paddingTop: "5px",
  paddingBottom: "5px",
  paddingLeft: "10px",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    height: "100%",
    borderRadius: "10px",
    zIndex: 0,
  },
  "&:hover::before": {
    width: "100%",
    backgroundColor: accentColorPrimaryHover,
  },
  "& *": {
    position: "relative",
    zIndex: 1,
  },
};