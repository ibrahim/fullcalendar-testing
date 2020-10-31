import * as React from "react";
import { isNull } from "lodash";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import Calendar from "./Calendar";

import prepareSlotEvents from "./utils/prepareSlotEvents";
import { useAppointmentsStore } from "./store";
import withHooks from "../../store/withHooks";
import * as Api from "./Api";

const BACKGROUND_SLOT_COLOR = "#8fdf82";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		maxWidth: 752,
	},
	demo: {
		backgroundColor: theme.palette.background.paper,
	},
	title: {
		margin: theme.spacing(4, 0, 2),
	},
	primary: {
		font: "400 20px Roboto",
	},
}));

const ListContainer = (props) => {
	const { slots, setSlots } = props;
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

	return (
		<div className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography variant="h5" className={classes.title}>
						Appointments Time Slots
					</Typography>
					<div className={classes.demo}>
						<List dense={true}>
							{slots &&
								slots.map((slot, index) => (
									<ListItem key={`slot-${index}`}>
										<ListItemAvatar>
											<Avatar>
												<DateRangeOutlinedIcon />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={slot.title}
											classes={{ primary: classes.primary }} 
											secondary={slot.body}
										/>
										<ListItemSecondaryAction>
											<Calendar slot={slot} />
										</ListItemSecondaryAction>
									</ListItem>
								))}
						</List>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

const useHooksToProps = (props) => {
	const { getSlots, setSlots } = useAppointmentsStore();

	return {
		slots: getSlots(),
		setSlots,
	};
};

export default withHooks(useHooksToProps)(ListContainer);
