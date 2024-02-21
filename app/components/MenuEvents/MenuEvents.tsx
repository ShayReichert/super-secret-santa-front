"use client";

import styles from "./MenuEvents.module.scss";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { setCookie, getCookie } from "cookies-next";
import { cookieParams } from "@/app/services/cookieParams";

export default function MenuEvents() {
  const { userState, currentEventId, changeCurrentEvent } = useUser();
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const selectedEventName = userState.data?.events.find((event) => event.id === currentEventId)?.name || "";

  const initializeEventSelection = () => {
    let initialEventId = currentEventId;
    const storedEventId = getCookie("selectedEventId");

    if (!initialEventId && storedEventId) {
      initialEventId = parseInt(storedEventId, 10);
      changeCurrentEvent(initialEventId);
    } else if (!initialEventId && userState.data?.events && userState.data.events.length > 0) {
      initialEventId = userState.data.events[0].id;
      changeCurrentEvent(initialEventId);
      setCookie("selectedEventId", initialEventId.toString(), cookieParams);
    }
  };

  useEffect(initializeEventSelection, [userState.data?.events, currentEventId, changeCurrentEvent]);

  // Show nothing if no event is available
  if (!userState.data?.events?.length) {
    return null;
  }

  const handleSelectEvent = (eventId: number, eventName: string) => {
    changeCurrentEvent(eventId);
    setCookie("selectedEventId", eventId.toString(), cookieParams);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        className={styles["button-events"]}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
      >
        {selectedEventName}
      </Button>
      <Menu
        id="basic-menu"
        className={`${styles["menu-open-events"]} ${isAdminPage ? styles["menu-open-events-admin"] : ""}`}
        anchorEl={anchorEl}
        disableScrollLock={true}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {userState.data.events.map((event) => (
          <MenuItem key={event.id} onClick={() => handleSelectEvent(event.id, event.name)}>
            {event.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
