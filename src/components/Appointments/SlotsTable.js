import * as React from "react";
import { isNull, isEmpty } from "lodash";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Calendar from "./Calendar";

import { prepareSlotEvents } from "./utils/prepareEvents";
import { useAppointmentsStore } from "./store";
import withHooks from "../../store/withHooks";
import * as Api from "./Api";

const BACKGROUND_SLOT_COLOR = "#8fdf82";

const Cell = withStyles((theme) => ({
	root: {
		font: '400 18px Roboto',
	},
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 17,
  },
}))(TableCell);

const useStyles = makeStyles({
	table: {
		maxWidth: 800,
	},
	root: {
		margin: "100px auto",
		maxWidth: 800,
	},
});

function SlotsTable(props) {
	const { slots, setSlots, appointments } = props;
	const classes = useStyles();

	React.useEffect(
		() => {
			if (isNull(slots)) {
				Api.fetchSlots().then((res) => {
					const slotEvents = prepareSlotEvents(res, {
						color: BACKGROUND_SLOT_COLOR,
					});
					setSlots(slotEvents);
				});
			}
		},
		[slots, setSlots]
	);

	React.useEffect(
		() => {
			if (!isEmpty(appointments)) {
				console.log({ appointments });
			}
		},
		[appointments]
	);
	return (
		<Grid classes={{ root: classes.root }}>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<Cell>Title</Cell>
							<Cell align="center">Start Time</Cell>
							<Cell align="center">End Time</Cell>
							<Cell align="center">Appointment</Cell>
							<Cell align="center">Status</Cell>
						</TableRow>
					</TableHead>
					<TableBody>
						{slots &&
							slots.map((slot, index) => {
								const appointment = appointments.find(event => event.slotId === slot.id)
								return (
									<TableRow key={`slot-${index}`}>
										<Cell component="th" scope="row" classes={{ }}>
											{slot.title}
										</Cell>
										<Cell align="center">
											{moment(slot.start).format("DD MMM YYYY")}
										</Cell>
										<Cell align="center">
											{moment(slot.end).format("DD MMM YYYY")}
										</Cell>
										<Cell align="center">
											{appointment 
												? moment(appointment.startTime).format("DD MMM YYYY HH:mm")
												: "---"
											}
										</Cell>
										<Cell align="center">
											<Calendar slot={slot} appointment={appointment}/>
										</Cell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	);
}

const useHooksToProps = (props) => {
	const { getSlots, getAppointments, setSlots } = useAppointmentsStore();

	return {
		slots: getSlots(),
		setSlots,
		appointments: getAppointments(),
	};
};

export default withHooks(useHooksToProps)(SlotsTable);
