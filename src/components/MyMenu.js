import React from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';

import PublishIcon from '@material-ui/icons/Publish'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import DeleteIcon from '@material-ui/icons/Delete';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';



const useStyles = makeStyles((theme) => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
    display: 'inline',
    position: 'fixed',
    bottom: 10,
    right: 10,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  button: {
    color:'red',
    backgroundColor:'red'
  },

}));

const overRide = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        // Name of the rule
        text: {
          // Some CSS
          color: 'red',
        },
      },
    },
  });

//



export default function MyMenu(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  console.log(props)

  const actions=[
    { icon: <DirectionsRunIcon onClick={ ()=> props.props.clickHandleSpeed() }  />, name: 'Toggle Speed' },
    { icon: <DeleteIcon onClick={ ()=> props.props.clearOrRandomize() }/>, name: 'Clear Grid' },
    { icon: <SwapCallsIcon onClick={ ()=> props.props.clearOrRandomize(1) }/>, name: 'Randomize' },
    { icon: <FavoriteIcon />, name: 'Presets' },
    { icon: <FileCopyIcon onClick={ ()=> props.props.clickHandleCopy() } />, name: 'Copy JSON' },
    { icon: <PublishIcon onClick={ ()=> props.props.clickHandleUpload() } />, name: 'Upload JSON' },
  ];

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div className={classes.root}>
      {/*<Button onClick={handleVisibility}>Toggle Speed Dial</Button>*/}
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon color='secondary' openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={ {color: "secondary"} }
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
      
    </div>
  );
}
