import moment from 'moment'
import { v4 as uuid } from "uuid";

export const fetchSlots = () =>
	new Promise((resolve) =>
		resolve([
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
		])
	);
