import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuEvents from "./MenuEvents";
import * as UserContext from "@/app/context/UserContext";
import * as EventsHook from "@/app/hook/useEvents/useEvents";
import * as Cookies from "cookies-next";

jest.mock("../../context/UserContext.tsx", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../hook/useEvents/useEvents.ts", () => ({
  useEvents: jest.fn(),
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
}));

describe("MenuEvents Component", () => {
  const mockEvents = [
    { id: 1, name: "Event 1" },
    { id: 2, name: "Event 2" },
  ];

  beforeEach(() => {
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      userState: { data: { events: mockEvents } },
      currentEventId: 1,
      currentEvent: mockEvents[0],
      changeCurrentEvent: jest.fn(),
    }));

    (EventsHook.useEvents as jest.Mock).mockImplementation(() => ({
      getEvents: jest.fn(async () => mockEvents),
    }));

    (Cookies.getCookie as jest.Mock).mockImplementation(() => "1");
  });

  it("displays the name of the selected event", async () => {
    render(<MenuEvents />);
    expect(await screen.findByText("Event 1")).toBeInTheDocument();
  });

  it("handles event selection correctly", async () => {
    const changeCurrentEventMock = jest.fn();
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      userState: { data: { events: mockEvents } },
      currentEventId: 1,
      currentEvent: mockEvents[0],
      changeCurrentEvent: changeCurrentEventMock,
    }));

    render(<MenuEvents />);

    const eventButton = await screen.findByText("Event 1");
    fireEvent.click(eventButton); // Ouvrir le menu

    const event2Button = await screen.findByText("Event 2");
    fireEvent.click(event2Button);

    expect(changeCurrentEventMock).toHaveBeenCalledWith(2);
    expect(Cookies.setCookie).toHaveBeenCalledWith("selectedEventId", "2", expect.any(Object));
  });
});
