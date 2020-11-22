import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import IconButton from "@material-ui/core/IconButton";
import ScheduleOutlinedIcon from "@material-ui/icons/ScheduleOutlined";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import Appointments from "./Appointments";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	scheduled: {
		fontSize: "32px",
	},
	hasAppointment: {
		fontSize: "32px",
		color: "#AEA",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: "700px",
	},
}));

export default function ModalCalendar(props) {
	const { slot, appointment } = props;

	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<IconButton
				edge="end"
				aria-label="Make an appointment"
				onClick={handleOpen}
			>
				{appointment ? (
					<EventAvailableIcon className={classes.hasAppointment} />
				) : (
					<ScheduleOutlinedIcon className={classes.scheduled} />
				)}
			</IconButton>
			{open &&
				slot && (
					<Modal
						aria-labelledby="transition-modal-title"
						aria-describedby="transition-modal-description"
						className={classes.modal}
						open={open}
						onClose={handleClose}
						BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500,
						}}
					>
						<div className={classes.paper}>
							<Appointments slot={slot} close={handleClose} />
						</div>
					</Modal>
				)}
		</>
	);
}
