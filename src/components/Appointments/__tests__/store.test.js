//import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook, cleanup, act } from "@testing-library/react-hooks";
import moment from "moment";
import * as utils from "../utils/prepareEvents";
import * as Api from "../Api";
import { AppointmentsStoreProvider, useAppointmentsStore, MESSAGES } from "../store";
import { slots } from "./Appointments.test";

const wrapper = ({ children }) => (
	<AppointmentsStoreProvider>{children}</AppointmentsStoreProvider>
);
const slot = utils.prepareSlotEvents(slots, { color: "#ddd" })[0];
const newEvent = {
	id: "123",
	title: "Test Checkup Event",
	body: "Test Checkup Event body",
	startTime: moment(slot.start)
		.add(1, "days")
		.format(),
	endTime: moment(slot.start)
		.add(1, "days")
		.add(90, "minutes")
		.format(),
	slotId: slot.id,
};

describe("Appointments Store", () => {
	let store; 
	beforeEach(() => {
		store = renderHook(() => useAppointmentsStore(), { wrapper });
	})
	test("Add appointment", async () => {
		act(() => {
			store.result.current.addAppointment(newEvent);
		});
		const appointments = store.result.current.getAppointments();
		expect(appointments.length).toEqual(1);
	});
	test("Remove appointment", async () => {
		act(() => {
			store.result.current.addAppointment(newEvent);
		});

		expect(store.result.current.getAppointments().length).toEqual(1);

		act(() => {
			store.result.current.removeAppointment(newEvent);
		});

		expect(store.result.current.getAppointments().length).toEqual(0);
	});
	test("Cannot add apointment when one is already scheduled.", () => {
		let errors;
		const dateStr = moment(slot.start).add(1,"days").format()
		act(() => {
			store.result.current.addAppointment(newEvent);
		});
		expect(store.result.current.getAppointments().length).toEqual(1);
		act(() => {
			errors = store.result.current.addAppointmentValidation({dateStr,slot});
		});
		expect(errors.message).toMatch(MESSAGES.ERROR_APPOINTMENT_ALREADY_SCHEDULED);
	})
	test("Cannot schedule an appointment outside time slot..", () => {
		let errors;
		const dateStr = moment(slot.end).add(1,"days").format()
		act(() => {
			errors = store.result.current.addAppointmentValidation({dateStr,slot});
		});
		expect(errors.message).toMatch(MESSAGES.ERROR_OUTSIDE_TIME_SLOT);
	});
});
