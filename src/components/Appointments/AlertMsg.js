import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AlertMsg(props) {
	const  { msg } = props
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
					severity={ msg.severity }
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
					{ msg.message }
        </Alert>
      </Collapse>
    </div>
  );
}

