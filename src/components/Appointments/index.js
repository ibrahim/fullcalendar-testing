import * as React from "react";
import Appointments from "./Appointments";
import { isEmpty } from "lodash";
import moment from "moment";
import { formatDate } from "./utils";

const SLOT = {
	id: "1234",
	title: "Medical Checkup",
	body: "We will perform a quick media checkup.",
	startTime: "2020-11-23T13:24:00.000Z",
	endTime: "2020-11-26T13:24:00.000Z",
	slotTimeDuration: 90,
};

function prepareSlotEvents(slots) {
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
			color: BACKGROUND_SLOT_COLOR,
			extendedProps: {
				eventType: "SLOT",
				slotTimeDuration: event.slotTimeDuration,
			},
		}));
	return slotEvents;
}
const BACKGROUND_SLOT_COLOR = "#8fdf82";
function AppointmentsContainer() {
	const slots = Array(SLOT);
	const [slot, setSlot] = React.useState(null);
	React.useEffect(() => {
		if (!isEmpty(slots)) {
			const slotEvents = prepareSlotEvents(slots);
			const upcomingSlot = slotEvents[0];
			if (upcomingSlot) {
				setSlot(upcomingSlot);
			}
		}
	}, []);
	console.log({ slot });
	return (
		<div style={{ margin: "50px" }}>{slot && <Appointments slot={slot} />}</div>
	);
}

export default AppointmentsContainer;
