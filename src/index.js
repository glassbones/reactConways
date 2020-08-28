import CssBaseline from '@material-ui/core/CssBaseline';
import {RecoilRoot} from 'recoil'
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";


ReactDOM.render(<RecoilRoot>    

    <>
        <CssBaseline />
        <App />
    </>

</RecoilRoot>,document.getElementById("root"));
