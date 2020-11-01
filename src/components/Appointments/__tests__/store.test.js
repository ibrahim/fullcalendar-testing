import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import moment from 'moment'
import { Appointments } from "../Appointments";
import * as utils from "../utils/prepareEvents";
import * as Api from "../Api";
import { AppointmentsStoreProvider, useAppointmentsStore } from "../store";

const wrapper = ({ children }) => (
	<AppointmentsStoreProvider step={2}>{children}</AppointmentsStoreProvider>
);

test("Adding an appointment", async () => {
	const { result } = renderHook(() => useAppointmentsStore(), { wrapper });

	act(() => {
		const {
			colors,
			getAppointments,
			removeAppointment,
			addAppointment,
		} = result.current

	const props =  {
		colors,
		appointments: getAppointments(),
		addAppointment,
		removeAppointment,
	};

		result.current.addAppointment({
			id: "123",
			start: moment().format(),
			end: moment().format(),
			extendedProps: { eventType: "APPOINTMENT" },
		});
	});

	expect(result.current.getAppointments()).toHaveLength(1);

	// const slots = await Api.fetchSlots();
	// const slot = utils.prepareSlotEvents(slots, { color: "#ddd" })[0];

	// render(<Appointments slot={slot} />);

	// expect(true).toBeTruthy();
	// fireEvent.click(screen.getByLabelText(/username/i), {
	//   target: {value: 'chuck'},
	// })

	// const linkElement = screen.getByText(/learn react/i);
	// expect(linkElement).toBeInTheDocument();
});
