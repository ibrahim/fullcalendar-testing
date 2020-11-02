//import { render, fireEvent, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
	render,
	rerender,
	fireEvent,
	cleanup,
	screen,
	act,
	waitFor,
} from "../../../utils/renderWithDateQueries";
import { Appointments } from "../Appointments";
import * as utils from "../utils/prepareEvents";
import * as Api from "../Api";
import { colors } from "../store";

export const slots = [
	{
		id: uuid(),
		title: "Medical Checkup",
		body: "Routine annual medical checkup.",
		startTime: moment()
			.add(2, "days")
			.format(),
		endTime: moment()
			.add(5, "days")
			.format(),
		slotTimeDuration: 90,
	},
	{
		id: uuid(),
		title: "Vaccine Trials",
		body: "Covid-19 clinical trials",
		startTime: moment()
			.add(12, "days")
			.format(),
		endTime: moment()
			.add(17, "days")
			.format(),
		slotTimeDuration: 120,
	},
	{
		id: uuid(),
		title: "Follow-up Examination",
		body: "follow up",
		startTime: moment()
			.add(35, "days")
			.format(),
		endTime: moment()
			.add(38, "days")
			.format(),
		slotTimeDuration: 120,
	},
];

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
