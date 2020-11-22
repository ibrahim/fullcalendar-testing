//import { render, fireEvent, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
	render,
	screen,
	act,
} from "../../../utils/renderWithDateQueries";
import { Appointments } from "../Appointments";
import * as utils from "../utils/prepareEvents";
import { colors } from "../store";
import { slots } from '../slots'

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

describe("Appointments Calendar", () => {
	test("Calendar displays no appointments", () => {
		const props = {
			slot,
			colors,
			appointments: [],
			addAppointment: () => {},
			removeAppointment: () => {},
		};

		act(() => {
			render(<Appointments {...props} />);
			return;
		});

		const elems = screen.queryAllByText(/Test Checkup Event/);
		expect(elems.length).toEqual(0);
	});
	test("Calendar displays the appointment", () => {
		const appointments = Array(newEvent);
		const props = {
			slot,
			colors,
			appointments,
			addAppointment: () => {},
			removeAppointment: () => {},
		};

		act(() => {
			render(<Appointments {...props} />);
			return;
		});

		const elems = screen.queryAllByText(/Test Checkup Event/);
		expect(elems.length).toEqual(1);
	});
});
