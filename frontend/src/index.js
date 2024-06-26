import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red } from '@mui/material/colors';
import ChatProvider from './Context/ChatProvider';

const theme = createTheme({
    typography: {
        fontFamily: "Open Sans, sans-serif",
    },
    palette: {
        red: {
            main: red[500],
            light: red[300],
            dark: red[600],
            darker: red[800]
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <ChatProvider>
                <CssBaseline />
                <App />
            </ChatProvider>
        </BrowserRouter>
    </ThemeProvider >

);

