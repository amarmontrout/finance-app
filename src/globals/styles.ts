import { accentColorPrimary } from "./colors";

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
    top: 0,
    left: 0,
    height: "100%",
    width: 0,
    borderRadius: "10px",
    transition: "width 0.25s ease",
    zIndex: 0,
  },
  "&:hover::before": {
    width: "100%",
    border: `2px solid ${accentColorPrimary}`,
  },
  "& *": {
    position: "relative",
    zIndex: 1,
  },
};