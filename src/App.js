import Grid from './components/Grid'
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
        backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[200],
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color:
    theme.palette.type === 'light' ? theme.palette.success.dark : theme.palette.success.dark,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.success.dark : theme.palette.success.dark,
  },
  typography: {
    flexGrow: 1,
        align: "center"
  }
}));

//<div style={{color:'black', display:'inline', position: 'fixed'}}>ACTIVE </div>

// App

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="md">
        <Typography variant="body1" className={classes.typography} >Draw inside the box then press play.</Typography>
        <Grid/>
      </Container>
    </div>
  );
}
export default App;

/*
<Typography variant="h3" component="h1" gutterBottom>
Conway's Game of Life
</Typography>
*/

/*
  <footer className={classes.footer}>
    <Container maxWidth="sm">
      <Typography variant="body1">Michael Johnson</Typography>
      <Copyright />
    </Container>
  </footer>
*/