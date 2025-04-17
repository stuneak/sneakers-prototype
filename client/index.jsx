// import '@mantine/notifications/styles.css';
// import '@mantine/nprogress/styles.css';
// import '@mantine/spotlight/styles.css';
// import '@mantine/tiptap/styles.css';
// import '@mantine/dates/styles.css';

import 'regenerator-runtime';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import './src/theme/style.css';
import './fonts/font.css';
// import './fonts/font.js';
import './app.css';

import { MantineProvider } from '@mantine/core';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Route from './src/Route.jsx';

import {
    localStorageColorSchemeManager,
    shadcnTheme,
    shadcnCssVariableResolver,
} from './src/theme';

const container = document.getElementById('root');
const root = createRoot(container);

const colorSchemeManager = localStorageColorSchemeManager();

root.render(
    <MantineProvider
        theme={shadcnTheme}
        cssVariablesResolver={shadcnCssVariableResolver}
        defaultColorScheme="auto"
        colorSchemeManager={colorSchemeManager}
    >
        <Route />
    </MantineProvider >
);
