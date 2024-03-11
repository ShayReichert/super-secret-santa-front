export const getEventsOrganizedByUser = (eventList: SantaEvent[], organizedEventIds: number[]) => {
  return eventList.filter((event) => organizedEventIds.includes(event.id));
};

export const extractUsers = (
  events: SantaEvent[],
  currentEventId: number | null,
  organizedEventIds: number[] | undefined,
  isAdministrator: boolean
) => {
  let relevantEvents = events;

  if (!isAdministrator) {
    relevantEvents = getEventsOrganizedByUser(events, organizedEventIds || []);
  }

  const userObjects: { id: number; username: string }[] = [];

  const currentEventUsersIds = currentEventId ? events.find((event) => event.id === currentEventId)?.users.map((user) => user.id) : [];

  relevantEvents.forEach((event) => {
    event.users.forEach((user) => {
      // Check if the user is not already in the current event and has not already been added to the array
      if (!currentEventUsersIds?.includes(user.id) && !userObjects.some((u) => u.id === user.id)) {
        userObjects.push({ id: user.id, username: user.username });
      }
    });
  });

  return userObjects;
};
