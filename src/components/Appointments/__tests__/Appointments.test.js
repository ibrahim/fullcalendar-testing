import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import moment from "moment";
import { Appointments } from "../Appointments";
import * as utils from "../utils/prepareEvents";
import * as Api from "../Api";
import { AppointmentsStoreProvider, useAppointmentsStore } from "../store";

const wrapper = ({ children }) => (
	<AppointmentsStoreProvider step={2}>{children}</AppointmentsStoreProvider>
);

test("Default Appointments state", async () => {
	const { result } = renderHook(() => useAppointmentsStore(), { wrapper });
	const slots = await Api.fetchSlots();
	act(() => {
		const {
			colors,
			getAppointments,
			removeAppointment,
			addAppointment,
		} = result.current;

		const slot = utils.prepareSlotEvents(slots, { color: "#ddd" })[0];
		const props = {
			slot,
			colors,
			appointments: getAppointments(),
			addAppointment,
			removeAppointment,
		};
		render(<Appointments {...props} />);
	});


	// expect(true).toBeTruthy();
	// fireEvent.click(screen.getByLabelText(/username/i), {
	//   target: {value: 'chuck'},
	// })

	// const linkElement = screen.getByText(/learn react/i);
	// expect(linkElement).toBeInTheDocument();
});
