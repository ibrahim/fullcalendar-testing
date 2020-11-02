//import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook, cleanup, act } from "@testing-library/react-hooks";
import moment from "moment";
import { Appointments } from "../Appointments";
import * as utils from "../utils/prepareEvents";
import * as Api from "../Api";
import { AppointmentsStoreProvider, useAppointmentsStore } from "../store";
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
	test("Add appointment", async () => {
		const { result } = renderHook(() => useAppointmentsStore(), { wrapper });
		act(() => {
			result.current.addAppointment(newEvent);
		});
		const appointments = result.current.getAppointments();
		expect(appointments.length).toEqual(1);
	});
	test("Remove appointment", async () => {
		const { result } = renderHook(() => useAppointmentsStore(), { wrapper });
		act(() => {
			result.current.addAppointment(newEvent);
		});

		expect(result.current.getAppointments().length).toEqual(1);

		act(() => {
			result.current.removeAppointment(newEvent);
		});

		expect(result.current.getAppointments().length).toEqual(0);
	});
});
