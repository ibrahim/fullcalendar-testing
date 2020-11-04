import createStore from "../../store/createStore";
import produce from "immer";
import moment from "moment";

const BACKGROUND_YELLOW_COLOR = "#FFA";
const BACKGROUND_ORANGE_COLOR = "#ff4e4e";
const BACKGROUND_BLUE_COLOR = "#025baa";

export const MESSAGES = {
	ERROR_OUTSIDE_TIME_SLOT: "Cannot schedule an appointment outside time slot.",
	ERROR_APPOINTMENT_ALREADY_SCHEDULED: "An appointment already booked for current Participant",
}

export const colors =  {
		blue: BACKGROUND_BLUE_COLOR,
		yellow: BACKGROUND_YELLOW_COLOR,
		orange: BACKGROUND_ORANGE_COLOR,
	}

const initia_state = {
	slots: null,
	upcomingSlot: null,
	appointments: [],
	colors
};

const useReducer = ({ state, setState }) => {
	const setSlots = (slots) => {
		setState(
			produce((draft) => {
				draft.slots = slots;
			})
		);
	};

	const addAppointment = (event) => {
		setState(
			produce((draft) => {
				draft.appointments = [...draft.appointments, event]
			})
		);
	};
	const removeAppointment = (event) => {
		setState(
			produce((draft) => {
				const newAppointments = draft.appointments.filter(a => a.id !== event.id )
				draft.appointments = newAppointments
			})
		);
	};

	const addAppointmentValidation = ({slot, dateStr}) => {
		if (!slot) {
			return({ severity: "warning", message: "Time slot is not defined" });
		}


		const hasAppointment =
			state.appointments && state.appointments.find((event) => event.slotId === slot.id);

		if (hasAppointment) {
			const date = moment(hasAppointment.startTime).format("DD MMM YYYY");
			const startTime = moment(hasAppointment.startTime).format("HH:mm");
			return ({
				severity: "info",
				message: `${MESSAGES.ERROR_APPOINTMENT_ALREADY_SCHEDULED} on ${date} at ${startTime}`,
			});
		}
		const withinTimeSlot = moment(dateStr).isBetween(
			moment(slot.start),
			moment(slot.end),
			undefined,
			"[]"
		);

		if (!withinTimeSlot) {
			return({
				severity: "warning",
				message: MESSAGES.ERROR_OUTSIDE_TIME_SLOT,
			});
		}
		return;
	}
	const getAppointments = () => state.appointments
	const getSlots = () => state.slots;
	const getUpcomingSlot = () => state.slots[0];

	return {
		setSlots,
		getUpcomingSlot,
		getSlots,
		addAppointment,
		addAppointmentValidation,
		removeAppointment,
		getAppointments,
	};
};

let [AppointmentsStoreProvider, useAppointmentsStore] = createStore(
	useReducer,
	initia_state
);

export { AppointmentsStoreProvider, useAppointmentsStore };
