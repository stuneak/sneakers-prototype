import React from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { MainMap } from './pages/MainMap';

const guide = createBrowserRouter([
	{
		path: '*',
		element: <Navigate to="/" replace />,
	},
	{
		path: '/',
		element: <MainMap />,
	},
	{
		path: '/privacy',
		element: <Privacy />,
	},
	{
		path: '/terms',
		element: <Terms />,
	},
]);

function Route() {
	return <RouterProvider router={guide} />;
}

export default Route;
