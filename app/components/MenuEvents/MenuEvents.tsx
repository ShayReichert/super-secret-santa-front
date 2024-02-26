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
import Chevron from "../Chevron/Chevron";

export default function MenuEvents({ isAdminPage, isOrganizerPage }: { isAdminPage?: boolean; isOrganizerPage?: boolean }) {
  const { userState, currentEventId, currentEvent, changeCurrentEvent } = useUser();
  const { getEvents } = useEvents();
  const [events, setEvents] = useState<Events[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const selectedEventName = currentEvent?.name || "";

  const initializeEventSelection = () => {
    let initialEventId = currentEventId;
    const storedEventId = getCookie("selectedEventId");

    if (isOrganizerPage) {
      // On affiche automatiquement le premier event duquel l'utilisateur est organisateur
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

  // Récupérer la liste de tous les évènements
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

  // Déterminez le type de données en fonction de la page
  let eventsToShow: EventInUser[] | Events[] = [];

  if (isOrganizerPage) {
    eventsToShow = getEventsOrganizedByUser(events as Events[], userState.data?.organizedEventIds || []);
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
        <Chevron />
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
