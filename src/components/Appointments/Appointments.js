import * as React from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment'

function Appointments(props) {
	const { slot } = props;
	const slotEvents = Array(slot);

	const calendarRef = React.useRef(null);

	const handleTimeClick = React.useCallback((info) => {
		const { dateStr, view } = info;

		const withinSlotTime = moment(dateStr).isBetween(moment(slot.start),moment(slot.end),undefined,"[]")
		if(!withinSlotTime){
			console.log("selected date is outside slot",{start:slot.start,end: slot.end})
		}
		else{
			console.log("Within Slot Time",{start:slot.start,end: slot.end})
		}
	}, []);

	const handleDateClick = (info) => {
		const { dateStr, view } = info;
		console.log("handleDateClick");
		try {
			if (view.type === "dayGridMonth") {
				console.log("dayGridMonth");
				const api = calendarRef.current.getApi();
				const calendarApi = api.view.calendar;
				if (calendarApi) {
					calendarApi.zoomTo(new Date(dateStr), "timeGridWeek");
				} else {
					console.log("Cannot get the calendar API");
				}
			} else {
				handleTimeClick(info);
			}
		} catch (e) {
			/* eslint-disable no-console */
			console.error("catch error", e.message);
		}
	};
	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView="dayGridMonth"
			eventSources={[slotEvents]}
			dateClick={handleDateClick}
		/>
	);
}

Appointments.propTypes = {
	slot: PropTypes.shape({
		id: PropTypes.string.isRequired,
		start: PropTypes.string.isRequired,
		end: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		extendedProps: PropTypes.shape({
			slotTimeDuration: PropTypes.number.isRequired,
			eventType: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};

export default Appointments;
