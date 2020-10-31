import * as React from "react";
import SlotsTable from "./SlotsTable";
import { AppointmentsStoreProvider } from "./store";

function AppointmentsContainer() {
	return (
		<AppointmentsStoreProvider>
			<SlotsTable />
		</AppointmentsStoreProvider>
	);
}

export default AppointmentsContainer;
