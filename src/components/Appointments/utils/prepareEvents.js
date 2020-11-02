import moment from "moment";

export const prepareSlotEvents = (slots, { color }) => {
	const slotEvents = slots
		.filter((event) => moment(event.endTime).isAfter(moment(), "day"))
		.map((event) => ({
			id: event.id,
			title: event.title,
			start: moment(event.startTime)
				.startOf("day")
				.format(),
			end: moment(event.endTime)
				.add(1, "days")
				.startOf("day")
				.format(),
			allDay: true,
			display: "background",
			groupId: "availableSlots",
			color,
			extendedProps: {
				eventType: "SLOT",
				slotTimeDuration: event.slotTimeDuration,
			},
		}));
	return slotEvents;
};

export const prepareAppointmentEvents = (appointments, { color, view, slot }) => {
	const appointmentEvents = appointments
		.filter(event => event.slotId === slot.id)
		.map((event) => ({
			id: event.id,
			title: event.title,
			start: moment(event.startTime).format(),
			end: moment(event.endTime).format(),
			display: 'block', //view === 'dayGridMonth' ? "background" : "block",
			groupId: "availableSlots",
			color,
			extendedProps: {
				eventType: "APPOINTMENT",
				slotId: event.slotId,
			},
		}));
	return appointmentEvents;
};
