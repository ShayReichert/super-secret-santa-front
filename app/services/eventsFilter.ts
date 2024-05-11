export const getEventsOrganizedByUser = (eventList: SantaEvent[], organizedEventIds: number[]) => {
  return eventList.filter((event) => organizedEventIds.includes(event.id));
};
