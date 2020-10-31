import createStore from "../../store/createStore";
import produce from "immer";

const BACKGROUND_YELLOW_COLOR = "#FFA";
const BACKGROUND_ORANGE_COLOR = "#ff4e4e";
const BACKGROUND_BLUE_COLOR = "#025baa";

const initia_state = {
	slots: null,
	upcomingSlot: null,
	appointments: [],
	colors: {
		blue: BACKGROUND_BLUE_COLOR,
		yellow: BACKGROUND_YELLOW_COLOR,
		orange: BACKGROUND_ORANGE_COLOR,
	},
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
				draft.appointments = draft.appointments.filter(a => a.id !== event.id )
			})
		);
	};

	const getAppointments = () => state.appointments
	const getSlots = () => state.slots;
	const getUpcomingSlot = () => state.slots[0];

	return {
		setSlots,
		getUpcomingSlot,
		getSlots,
		addAppointment,
		removeAppointment,
		getAppointments,
	};
};

let [AppointmentsStoreProvider, useAppointmentsStore] = createStore(
	useReducer,
	initia_state
);

export { AppointmentsStoreProvider, useAppointmentsStore };
