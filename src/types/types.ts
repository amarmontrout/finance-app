import { AlertColor } from "@mui/material";

export type HookSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type WeekType = {
  start: number;
  end: number;
};

export type SelectedDateType = {
  month: string;
  year: number;
};

export type AlertToastType = {
  open: boolean;
  onClose: () => void;
  severity: AlertColor;
  message: string;
};
