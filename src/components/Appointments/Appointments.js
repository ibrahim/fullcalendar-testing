import * as React from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import moment from "moment";
import { isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import AlertMsg from "./AlertMsg";
import { useAppointmentsStore } from "./store";
import { prepareAppointmentEvents } from "./utils/prepareEvents";
import withHooks from "../../store/withHooks";

const useStyles = makeStyles((theme) => ({
	actions: {
		flexGrow: 1,
		padding: 20,
	},
}));
const defaultAlert = (isPending) => ({
	severity: "info",
	message: isPending
		? "Confirm to schedule the appointment."
		: "Schedule an appointment for this slot",
});
function Appointments(props) {
	const classes = useStyles();
	const {
		close,
		slot,
		colors,
		appointments,
		addAppointment,
		removeAppointment,
	} = props;
	const slotEvents = Array(slot);

	const [isPending, setPending] = React.useState(false);
	const [showConfirmation, setConfirmation] = React.useState(false);
	const [selectedEvent, setSelectedEvent] = React.useState(null);
	const [appointmentEvents, setAppointmentEvents] = React.useState([]);
	const [currentView, setCurrentView] = React.useState("dayGridMonth");

	const calendarRef = React.useRef(null);
	const [msg, setAlert] = React.useState(null);

	React.useEffect(
		() => {
			if (!isEmpty(appointments)) {
				const events = prepareAppointmentEvents(appointments, {
					color: colors && colors.orange,
					view: currentView,
					slot,
				});
				setAppointmentEvents(events);
			}
		},
		[appointments, setAppointmentEvents]
	);

	const reset = () => {
		setConfirmation(false);
		setSelectedEvent(null);
		setPending(false);
		hideAlert();
	};

	const hideAlert = () => setAlert(null);

	const isInPastDate = (dateStr) => {
		const result = moment(dateStr).isBefore(moment(), "day");
		return result;
	};

	const handleTimeClick = (info) => {
		const { dateStr } = info;
		hideAlert();

		if (!slot) {
			setAlert({ severity: "warning", message: "Time slot is not defined" });
			return;
		}

		if (isPending) {
			return;
		}

		const hasAppointment =
			appointments && appointments.find((event) => event.slotId === slot.id);

		if (hasAppointment) {
			const date = moment(hasAppointment.startTime).format("DD MMM YYYY");
			const startTime = moment(hasAppointment.startTime).format("HH:mm");
			setAlert({
				severity: "info",
				message: `An appointment already booked for current Participant on ${date} at ${startTime}`,
			});
			return;
		}
		const withinSlotTime = moment(dateStr).isBetween(
			moment(slot.start),
			moment(slot.end),
			undefined,
			"[]"
		);

		if (!withinSlotTime) {
			setAlert({
				severity: "warning",
				message: "Cannot schedule an appointment outside time slot.",
			});
			return;
		}

		const api = calendarRef.current.getApi();
		const calendarApi = api.view.calendar;

		if (isEmpty(calendarApi)) {
			return;
		}

		setPending(true);
		console.log({ isPending });

		const startTime = moment(dateStr).format();
		const endTime = moment(dateStr)
			.add(slot.extendedProps.slotTimeDuration, "minute")
			.format();

		calendarApi.addEvent({
			id: uuid(),
			title: slot.title,
			start: startTime,
			end: endTime,
			backgroundColor: colors && colors.blue,
			allDay: false,
			constraint: "availableSlots",
			startEditable: () => showConfirmation,
			durationEditable: false,
			resizeableFromStart: false,
			extendedProps: {
				eventType: "APPOINTMENT",
				slotId: slot.id,
			},
		});
		const events = calendarApi.getEvents().filter(e => e.extendedProps.eventType === 'APPOINTMENT');
		const event = events.map(e => ({id: e.id, start: e.start, end: e.end}))
		console.log({events})
		setConfirmation(true);
		hideAlert();
	};

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

	const handleEventClick = (info) => {
		hideAlert();
		if (info.event.extendedProps.eventType === "APPOINTMENT") {
			setSelectedEvent(info.event);
			/* eslint-disable no-param-reassign */
			info.el.style.borderColor = "black";
		}
	};

	const handleEventAdded = (info) => {
		const event = info.event;
		setSelectedEvent(event);
	};

	const handelEventDropped = (info) => {
		console.log("event dropped");
		const { startStr } = info.event;
		if (!isInPastDate(startStr)) {
			hideAlert();
			setSelectedEvent(info.event);
		} else {
			setAlert({
				severity: "alert",
				message: `Cannot schedule an appointment outside the time slot.`,
			});
			info.revert();
		}
	};

	const handleRemoveEvent = () => {
		removeAppointment(selectedEvent);
		selectedEvent.remove();
		reset();
		// setPending(false);
		// setConfirmation(false);
		// setSelectedEvent(null);
		// hideAlert();
	};

	const handleConfirm = () => {
		if (!selectedEvent) {
			return;
		}
		const event = {
			id: uuid(),
			title: selectedEvent.title,
			body: selectedEvent.body,
			slotId: selectedEvent.extendedProps.slotId,
			startTime: selectedEvent.start,
			endTime: selectedEvent.end,
		};
		selectedEvent.remove();
		addAppointment(event);
		reset();
		setAlert({
			severity: "success",
			message: `Appointment was scheduled at ${moment(event.startTime).format(
				"D MMM YYYY HH:mm"
			)}`,
		});
	};

	return (
		<>
			{msg ? <AlertMsg msg={msg} /> : <div style={{ height: "65px" }} />}
			<FullCalendar
				ref={calendarRef}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				initialDate={slot.start}
				eventSources={[slotEvents, appointmentEvents]}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				eventAdd={handleEventAdded}
				eventDrop={handelEventDropped}
				viewDidMount={({ view }) => {
					setCurrentView(view.type);
				}}
			/>
			<Grid
				container
				justify="flex-end"
				spacing={5}
				classes={{ container: classes.actions }}
			>
				<Grid item>
					<Button
						variant="contained"
						disabled={isPending}
						color="secondary"
						onClick={close}
					>
						Close
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						disabled={!selectedEvent}
						color="secondary"
						onClick={handleRemoveEvent}
					>
						Remove
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						disabled={!showConfirmation}
						color="primary"
						onClick={handleConfirm}
					>
						Confirm Save
					</Button>
				</Grid>
			</Grid>
		</>
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

const useHooksToProps = (props) => {
	const {
		colors,
		getAppointments,
		removeAppointment,
		addAppointment,
	} = useAppointmentsStore();

	return {
		colors,
		appointments: getAppointments(),
		addAppointment,
		removeAppointment,
	};
};

export default withHooks(useHooksToProps)(Appointments);
