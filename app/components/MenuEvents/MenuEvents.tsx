"use client";

import styles from "./MenuEvents.module.scss";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import { setCookie, getCookie } from "cookies-next";
import { cookieParams } from "@/app/services/cookieParams";
import { getEventsOrganizedByUser } from "@/app/services/eventsFilter";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChevronIcon from "../ChevronIcon/ChevronIcon";

export default function MenuEvents({ isAdminPage, isOrganizerPage }: { isAdminPage?: boolean; isOrganizerPage?: boolean }) {
  const { userState, currentEventId, currentEvent, changeCurrentEvent } = useUser();
  const { getEvents } = useEvents();
  const [events, setEvents] = useState<SantaEvent[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const selectedEventName = currentEvent?.name || "";

  const initializeEventSelection = () => {
    let initialEventId = currentEventId;
    const storedEventId = getCookie("selectedEventId");

    if (isOrganizerPage) {
      // Display the first event the user is an organizer of
      const organizedEventsIds = userState.data?.organizedEventIds || [];
      if (!organizedEventsIds.includes(initialEventId!) && organizedEventsIds.length > 0) {
        initialEventId = organizedEventsIds[0];
        changeCurrentEvent(initialEventId);
        setCookie("selectedEventId", initialEventId.toString(), cookieParams);
      }
    } else {
      if (!initialEventId && storedEventId) {
        initialEventId = parseInt(storedEventId, 10);
        changeCurrentEvent(initialEventId);
      } else if (!initialEventId && userState.data?.events && userState.data.events.length > 0) {
        initialEventId = userState.data.events[0].id;
        changeCurrentEvent(initialEventId);
        setCookie("selectedEventId", initialEventId.toString(), cookieParams);
      }
    }
  };

  useEffect(initializeEventSelection, [userState.data?.events, currentEventId, changeCurrentEvent, isOrganizerPage]);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  // Show nothing if no event is available
  if (!userState.data?.events?.length) {
    return null;
  }

  const handleSelectEvent = (eventId: number, eventName: string) => {
    changeCurrentEvent(eventId);
    setCookie("selectedEventId", eventId.toString(), cookieParams);
    setAnchorEl(null);
  };

  // Find the data type based on the page
  let eventsToShow: EventInUser[] | SantaEvent[] = [];

  if (isOrganizerPage) {
    eventsToShow = getEventsOrganizedByUser(events as SantaEvent[], userState.data?.organizedEventIds || []);
  } else {
    eventsToShow = userState.data?.events as EventInUser[];
  }

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
        <ChevronIcon />
      </Button>
      <Menu
        id="basic-menu"
        className={`${styles["menu-open-events"]} ${
          isAdminPage ? styles["menu-open-events-admin"] : isOrganizerPage ? styles["menu-open-events-organizer"] : ""
        }`}
        anchorEl={anchorEl}
        disableScrollLock={true}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {eventsToShow.map((event) => (
          <MenuItem key={event.id} onClick={() => handleSelectEvent(event.id, event.name)}>
            {event.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
