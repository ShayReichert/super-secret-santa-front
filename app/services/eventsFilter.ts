export const getEventsOrganizedByUser = (eventList: Events[], organizedEventIds: number[]) => {
  return eventList.filter((event) => organizedEventIds.includes(event.id));
};
