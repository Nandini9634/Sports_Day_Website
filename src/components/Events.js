import React, { useState, useEffect } from "react";
import { Button, Card, CardSubtitle } from "react-bootstrap";
import { Endpoints } from "../constant/model";
import { useParams } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import FormatUnixTimestamp from "./FormatUnixTimestamp";
import "../css/Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isAllEventsDataAvailable, setIsAllEventsDataAvailable] =
    useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSelectedEventsDataAvailable, setIsSelectedEventsDataAvailable] =
    useState(false);
  const { userId } = useParams();

  const selectedEventsLimit = 3;

  const handleSelect = async (event) => {
    if (selectedEvents.length < selectedEventsLimit) {
      try {
        const apiUrl =
          Endpoints.SPORTS_DAY_API +
          Endpoints.API +
          Endpoints.VERSION_1 +
          Endpoints.EVENTS +
          Endpoints.REGISTER;

        const requestBody = {
          eventId: event.id,
          userId: userId,
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          renderSelectedEvents();
          renderAllEvents();
        } else {
          alert("Unable to select item.");
          window.location.reload();
        }
      } catch (error) {
        alert("Unable to select item.");
        window.location.reload();
      }
    } else {
      alert("You can select up to 3 events.");
    }
  };

  const handleRemove = async (event) => {
    try {
      const apiUrl =
        Endpoints.SPORTS_DAY_API +
        Endpoints.API +
        Endpoints.VERSION_1 +
        Endpoints.EVENTS +
        Endpoints.UNREGISTER;

      const requestBody = {
        eventId: event.id,
        userId: userId,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        renderSelectedEvents();
        renderAllEvents();
      } else {
        alert("Removing event failed.");
        window.location.reload();
      }
    } catch (error) {
      alert("Removing event failed.");
      window.location.reload();
    }
  };

  const renderAllEvents = async () => {
    try {
      const apiUrl =
        Endpoints.SPORTS_DAY_API +
        Endpoints.API +
        Endpoints.VERSION_1 +
        Endpoints.EVENTS;

      const response = await fetch(apiUrl);

      if (response.ok) {
        const eventsData = await response.json();

        const nonSelectedEvents = eventsData.filter((event) => {
          return !selectedEvents.some(
            (selectedEvent) => selectedEvent.id === event.id
          );
        });

        const updatedEvents = nonSelectedEvents.map((event) => {
          const hasTimeConflict = selectedEvents.some((selectedEvent) => {
            const eventStartTime = new Date(event.startTime).getTime();
            const eventEndTime = new Date(event.endTime).getTime();
            const selectedEventStartTime = new Date(
              selectedEvent.startTime
            ).getTime();
            const selectedEventEndTime = new Date(
              selectedEvent.endTime
            ).getTime();

            return (
              (eventStartTime >= selectedEventStartTime &&
                eventStartTime < selectedEventEndTime) ||
              (eventEndTime > selectedEventStartTime &&
                eventEndTime <= selectedEventEndTime) ||
              (eventStartTime <= selectedEventStartTime &&
                eventEndTime >= selectedEventEndTime)
            );
          });

          return {
            ...event,
            hasTimeConflict,
          };
        });
        setEvents(updatedEvents);

        setIsAllEventsDataAvailable({
          isAllEventsDataAvailable: true,
        });
      } else {
        alert("Unable to get events. Please try after some time.");
      }
    } catch (error) {
      console.error("Network error: ", error);
    }
    return;
  };

  const renderSelectedEvents = async () => {
    try {
      const apiUrl =
        Endpoints.SPORTS_DAY_API +
        Endpoints.API +
        Endpoints.VERSION_1 +
        Endpoints.EVENTS +
        Endpoints.SELECTED +
        "?userId=" +
        userId;

      const response = await fetch(apiUrl);

      if (response.ok) {
        const selectedEventsData = await response.json();
        setSelectedEvents(selectedEventsData);

        setIsSelectedEventsDataAvailable({
          isSelectedEventsDataAvailable: true,
        });
      } else {
        alert("Unable to get events selected. Please try after some time.");
      }
    } catch (error) {
      console.error("Network error: ", error);
    }
    return;
  };

  useEffect(() => {
    renderSelectedEvents();
    renderAllEvents();
  }, [events, selectedEvents]);

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="event-card">
        <div className="event-card">
          {isAllEventsDataAvailable && (
            <div>
              <h2>All events</h2>
              <div className="event-card-flex">
                {events.map((event) => (
                  <div key={event.id} className="event-subcard">
                    <Card className="rounded event-card-style">
                      <Card.Body>
                        <Card.Title className="event-card-title">
                          {event.name}
                        </Card.Title>
                        <CardSubtitle>({event.category})</CardSubtitle>
                        <Card.Text>
                          Start Time: {FormatUnixTimestamp(event.startTime)}
                          <br></br>End Time:{" "}
                          {FormatUnixTimestamp(event.endTime)}
                        </Card.Text>
                        <Button
                          onClick={() => {
                            if (!event.hasTimeConflict) {
                              handleSelect(event);
                            } else {
                              alert(
                                "This event conflicts with your selected events."
                              );
                            }
                          }}
                          className={`event-card-button ${
                            event.hasTimeConflict
                              ? "event-card-button-conflict"
                              : "event-card-button-no-conflict"
                          }`}
                          disabled={event.hasTimeConflict}
                        >
                          SELECT
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="event-card">
          {isSelectedEventsDataAvailable && (
            <div>
              <h2>Selected events</h2>
              <div className="event-card-flex">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="event-subcard">
                    <Card className="rounded event-card-style">
                      <Card.Body>
                        <Card.Title className="event-card-title">
                          {event.name}
                        </Card.Title>
                        <CardSubtitle>({event.category})</CardSubtitle>
                        <Card.Text>
                          Start Time: {FormatUnixTimestamp(event.startTime)}
                          <br></br>End Time:{" "}
                          {FormatUnixTimestamp(event.endTime)}
                        </Card.Text>
                        <Button
                          onClick={() => handleRemove(event)}
                          className="event-card-button event-card-button-remove"
                        >
                          REMOVE
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
