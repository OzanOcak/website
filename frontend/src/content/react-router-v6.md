---
title: 'Understanding React Router: Complete Guide to createBrowserRouter'
slug: react-router-v6
description: Understanding React Router
imageUrl: /images/4.png
author: ozan
date: 12.10.2024
tags:
  - React
  - React-Router
published: true
---

React Router is an essential library for building single-page applications (SPAs) in React. It provides a robust way to manage navigation, routes, and data fetching. In this guide, we’ll explore the createBrowserRouter API, its features like loaders and actions, and how it compares to using React Query for data management. To get started, install React Router if you haven’t already: `npm install react-router-dom`

## What is createBrowserRouter?

createBrowserRouter is a part of React Router that simplifies route management in your React applications. It allows you to define routes declaratively and manage complex routing scenarios with ease.

### Key Features of createBrowserRouter

**1- Declarative Routing:** It allows you to define routes in a more declarative manner, making your code easier to read and maintain.

```js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import About from "./About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

**2- Nested Routes:** It provides better support for nested routing, enabling you to create complex UIs with less boilerplate code.

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
```

**3- Data Loading:** The API integrates data loading and route handling, allowing you to fetch data directly as part of the routing process. This streamlines the data-fetching strategy.

```js
const router = createBrowserRouter([
  {
    path: "/user/:id",
    element: <UserProfile />,
    loader: async ({ params }) => {
      const response = await fetch(`/api/users/${params.id}`);
      return response.json();
    },
  },
]);
```

**4- Error Handling:** It simplifies error handling by allowing you to define error boundaries at the route level, making it easier to manage errors in your application.

```js
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />, // Custom error page component
  },
]);
```

**5- Asynchronous Routing:** It supports asynchronous route loading, which helps improve performance by splitting code and loading only what is necessary for the current route.

```js
const router = createBrowserRouter([
  {
    path: "/lazy",
    element: (
      <React.Suspense fallback={<Loading />}>
        <LazyComponent />
      </React.Suspense>
    ),
  },
]);
```

**6- Type Safety:** If you're using TypeScript, createBrowserRouter offers better type inference, reducing runtime errors and improving developer experience.

```js
import { createBrowserRouter, RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
];

const router = createBrowserRouter(routes);
```

**7- Improved Flexibility:** The router can handle various routing scenarios, including redirects and route transitions, with a more flexible API.

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/old-about",
    redirect: "/about", // Redirect from old to new route
  },
]);
```

## Loaders

Loaders are functions that fetch data before a route is rendered

```js
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const loadUserData = async ({ params }) => {
  const response = await fetch(`/api/users/${params.id}`);
  if (!response.ok) {
    throw new Response("User not found", { status: 404 });
  }
  return response.json();
};

const UserProfile = ({ data }) => (
  <div>
    <h1>{data.name}</h1>
    <p>{data.email}</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/user/:id",
    element: <UserProfile />,
    loader: loadUserData,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

## Actions

Actions are functions that handle form submissions and other interactions.

```js
const submitUserData = async ({ request }) => {
  const formData = await request.formData();
  const response = await fetch("/api/users", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Response("Failed to create user", { status: 400 });
  }
  return response.json();
};

const CreateUser = () => (
  <form method="post" action="/create-user">
    <input name="name" placeholder="Name" required />
    <input name="email" placeholder="Email" required />
    <button type="submit">Create User</button>
  </form>
);

const router = createBrowserRouter([
  {
    path: "/create-user",
    element: <CreateUser />,
    action: submitUserData,
  },
]);
```

## Comparison with React Query

### Using React Query

React Query provides advanced features like caching, background data fetching, and global state management. Here’s a brief comparison:

### Pros of React React Router:

- Integrated with Routing: Loaders are tied directly to route definitions, making it easy to fetch data when navigating to a specific route.
- Simplicity: For basic data fetching needs, using loaders keeps your code straightforward by centralizing data fetching logic alongside route definitions.
- Automatic Data Fetching: Data is automatically fetched when navigating to a route, which can simplify the component logic.

### Cons of React Router:

- Limited Features: Loaders lack advanced features like caching, background refetching, and automatic retries that are standard in dedicated data-fetching libraries.
- No Global State Management: Loaders do not provide a way to manage global state or share data across multiple components without re-fetching.
- Less Flexibility: They are designed for fetching data on route changes, which may not cover all use cases for data fetching in a more complex application.

## Conclusion

createBrowserRouter is a powerful addition to React Router, simplifying routing and data fetching in your applications. With features like loaders and actions, it enhances your ability to manage complex UIs effectively. While React Query provides advanced data fetching capabilities, combining both can lead to a well-structured and efficient application.

By understanding the strengths of each tool, you can make informed decisions on how to structure your React applications for optimal performance and maintainability.
