import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import { memo, useRef, useState } from "react";
import { darkMode, lightMode, negativeColor, neutralColor } from "../colors";

const EditDeleteButton = ({
  onEdit,
  onSetDelete,
  noEdit,
}: {
  onEdit: () => void;
  onSetDelete: () => void;
  noEdit?: boolean;
}) => {
  return (
    <Stack direction={"row"} spacing={1}>
      {!noEdit && (
        <IconButton
          className="text-dark-4 dark:text-dark-6"
          edge={"end"}
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
      )}

      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onSetDelete}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

const ConfirmCancelButton = ({
  onDelete,
  onCancelDelete,
}: {
  onDelete: () => void;
  onCancelDelete: () => void;
}) => {
  return (
    <Stack direction={"row"} spacing={1}>
      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>

      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onCancelDelete}
      >
        <CancelIcon />
      </IconButton>
    </Stack>
  );
};

const ListItemSwipe = ({
  icon,
  mainTitle,
  secondaryTitle,
  amount,
  amountColor,
  buttonCondition,
  onDelete,
  onSetDelete,
  onCancelDelete,
  onEdit,
  noEdit,
}: {
  icon?: React.ReactNode;
  mainTitle: string;
  secondaryTitle: string;
  amount: string;
  amountColor: string;
  buttonCondition: boolean;
  onDelete: () => Promise<void>;
  onSetDelete: () => void;
  onCancelDelete: () => void;
  onEdit: () => void;
  noEdit?: boolean;
}) => {
  const { theme: currentTheme } = useTheme();
  const startEdgeRef = useRef<"left" | "right" | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const gestureLockRef = useRef<"horizontal" | "vertical" | null>(null);

  const [offset, setOffset] = useState(0);
  const [isActioning, setIsActioning] = useState(false);

  const EDGE_WIDTH = 75;
  const ACTION_WIDTH = 100;
  const SWIPE_THRESHOLD = ACTION_WIDTH;
  const MAX_SWIPE = ACTION_WIDTH;
  const DIRECTION_THRESHOLD = 10;

  const isDeleteActive = offset <= -SWIPE_THRESHOLD;
  const isEditActive = offset >= SWIPE_THRESHOLD;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = e.currentTarget.getBoundingClientRect();

    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const isLeftEdge = touchX - element.left <= EDGE_WIDTH;
    const isRightEdge = element.right - touchX <= EDGE_WIDTH;

    if (!isLeftEdge && !isRightEdge) {
      startEdgeRef.current = null;
      return;
    }

    startEdgeRef.current = isLeftEdge ? "left" : "right";

    startXRef.current = touchX;
    startYRef.current = touchY;
    gestureLockRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startEdgeRef.current) return;

    const touch = e.touches[0];

    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    // Determine gesture direction once threshold exceeded
    if (!gestureLockRef.current) {
      if (
        Math.abs(deltaX) > DIRECTION_THRESHOLD ||
        Math.abs(deltaY) > DIRECTION_THRESHOLD
      ) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          gestureLockRef.current = "horizontal";
        } else {
          gestureLockRef.current = "vertical";
        }
      }
    }

    // If vertical scroll → ignore swipe
    if (gestureLockRef.current === "vertical") return;

    // If horizontal → apply edge restriction
    if (gestureLockRef.current === "horizontal") {
      e.preventDefault();

      if (startEdgeRef.current === "left") {
        if (noEdit) {
          setOffset(0);
        } else {
          setOffset(Math.max(0, Math.min(deltaX, MAX_SWIPE)));
        }
      } else {
        setOffset(Math.min(0, Math.max(deltaX, -MAX_SWIPE)));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isActioning) return;

    if (offset <= -SWIPE_THRESHOLD) {
      setIsActioning(true);
      await onDelete();
    } else if (!noEdit && offset >= SWIPE_THRESHOLD) {
      setIsActioning(true);
      onEdit();
    }

    setOffset(0);
    startEdgeRef.current = null;
    gestureLockRef.current = null;
    setIsActioning(false);
  };

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shared height container */}
      <Box sx={{ position: "relative" }}>
        {/* Background layer */}
        <Box
          sx={{
            width: "100%",
            inset: 0,
            position: "absolute",
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          {/* Blue edit background */}
          <Box
            sx={{
              width: ACTION_WIDTH,
              bgcolor: neutralColor.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              opacity: offset > 0 ? offset / ACTION_WIDTH : 0,
            }}
          >
            <EditIcon
              sx={{
                transform: isEditActive ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s ease",
              }}
            />
          </Box>

          {/* Red delete background */}
          <Box
            sx={{
              width: ACTION_WIDTH,
              bgcolor: negativeColor.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              opacity: offset < 0 ? Math.abs(offset) / ACTION_WIDTH : 0,
            }}
          >
            <DeleteIcon
              sx={{
                transform: isDeleteActive ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s ease",
              }}
            />
          </Box>
        </Box>

        {/* Foreground content */}
        <Stack
          className="bg-gray-2 dark:bg-[#020D1A]"
          direction={"row"}
          sx={{
            position: "relative",
            zIndex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            px: 1.5,
            py: 0.5,
            transform: `translate3d(${offset}px,0,0)`,
            transition: offset === 0 ? "transform 0.2s ease" : "none",
            touchAction: "pan-y",
            willChange: "transform",
          }}
        >
          <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
            {icon && icon}

            <Stack direction={"column"}>
              <Typography
                sx={{
                  fontSize: ".9rem",
                  lineHeight: secondaryTitle === "" ? "36px" : "20px",
                  color:
                    currentTheme === "light"
                      ? lightMode.primaryText
                      : darkMode.primaryText,
                }}
              >
                {mainTitle}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.7rem",
                  lineHeight: "16px",
                  color:
                    currentTheme === "light"
                      ? lightMode.secondaryText
                      : darkMode.secondaryText,
                }}
              >
                {secondaryTitle}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <Typography
              sx={{
                fontSize: "1rem",
                color: amountColor,
                alignContent: "center",
              }}
            >
              {amount}
            </Typography>

            <Box className="hidden sm:flex">
              {buttonCondition ? (
                <ConfirmCancelButton
                  onDelete={onDelete}
                  onCancelDelete={onCancelDelete}
                />
              ) : (
                <EditDeleteButton
                  onEdit={onEdit}
                  onSetDelete={onSetDelete}
                  noEdit={noEdit}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(ListItemSwipe);
