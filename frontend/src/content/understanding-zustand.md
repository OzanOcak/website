---
title: Zustand
slug: understanding-zustand
description: Understanding zustand
imageUrl: /images/8.png
author: ozan
date: 17.11.2024
tags:
  - React
  - Typescript
  - Zustand
published: true
---

# Zustand Tutorial: Managing State in React Applications

Zustand is a small, fast, and scalable state management solution for React applications. In this tutorial, we’ll explore how to set up Zustand in a sample application, covering essential topics such as store creation, state structure, actions, and more.

You can find the source code of the sample code in [github repository](https://github.com/OzanOcak/shopping-ui-zustand)

## Store Creation

To manage state with Zustand, you first need to create a store. The store serves as a central repository for your application's state. You create a store using the create function, which allows you to define the initial state and any actions that can modify that state.

Example

```tsx
export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get, store) => ({
          ...createUserSlice(set as any, get, store as any),
          ...createCartSlice(set as any, get, store as any),
        }))
      ),
      {
        name: "local-storage",
      }
    )
  )
);
```

In this example, we define a store for user information, including properties like userName, fullName, and address, along with an action setAddress to update the address.

## State Structure

The state in a Zustand store is often structured as an object. This structure can contain various properties and even nested objects, allowing you to represent your application’s data in a clear and organized way.

Example

```tsx
type CartState = {
  products: Product[];
  addProduct: (product: Product) => void;
};

export const useCartStore = create<CartState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));
```

In this example, the CartState contains an array of products and a method to add products to the cart, demonstrating how to manage more complex state structures.

## Actions

Actions are functions that modify the state. You define actions within the store, and they can update the state in response to user interactions or other events.

- User Slice Example

```tsx
export const createUserSlice = (set, get) => ({
  fullName: "",
  userName: "",
  address: "",
  setFullName: (name) => set({ fullName: name }),
  setUserName: (name) => set({ userName: name }),
  setAddress: (address) => set({ address }),
});
```

- Cart Slice Example

```tsx
export const createCartSlice = (set, get) => ({
  products: [],
  total: 0,
  addProduct: (product) => {
    set((state) => {
      const existingProduct = state.products.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        existingProduct.qty += 1;
      } else {
        state.products.push({ ...product, qty: 1 });
      }
    });
  },
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  reset: () => set({ products: [] }),
  setTotal: (total) => set({ total }),
});
```

This action updates the fullName property in the user state. You can create multiple actions to manage different aspects of your application's state.

## Selectors

Selectors allow you to derive or access specific pieces of state. They can be useful for optimizing performance by preventing unnecessary re-renders when only a subset of the state has changed.

Example

```tsx
const fullName = useUserStore((state) => state.fullName);
```

Using a selector like this, the component will only re-render when fullName changes, improving performance.

## Subscribing to State Changes

Components can subscribe to specific parts of the state using the useStore hook. When the subscribed state changes, the component will automatically re-render, ensuring that the UI is always in sync with the state.

Example

```tsx
const userName = useUserStore((state) => state.userName);
```

Whenever userName changes, the component will re-render, reflecting the updated state.

## Middleware

Zustand supports middleware for various functionalities, such as logging, persisting state, or adding additional capabilities. One common middleware is persist, which saves state to local storage.

Example

```tsx
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      userName: "",
      fullName: "",
      address: "",
      setAddress: (address) => set({ address }),
    }),
    {
      name: "user-storage", // unique name for the storage
    }
  )
);
```

This setup ensures that the user state is persisted across browser sessions.

## React Integration

Zustand is designed to work seamlessly with React. You can use the useStore hook to access and manipulate the store within functional components, making it easy to integrate into your app.

Example

```tsx
function UserProfile() {
  const { fullName, setFullName } = useUserStore();

  return (
    <div>
      <h1>{fullName}</h1>
      <input onChange={(e) => setFullName(e.target.value)} />
    </div>
  );
}
```

This component reads the fullName from the store and updates it based on user input.

## Server-Side Rendering (SSR)

Zustand can be used with server-side rendering, allowing you to initialize the store on the server and hydrate it on the client. This can enhance performance and improve SEO.

Example
You can set up Zustand in your SSR framework (like Next.js) by initializing the store on the server and passing it to the client.

## DevTools

Zustand has integration with Redux DevTools, enabling you to inspect state changes and actions in a user-friendly interface. This is useful for debugging and monitoring state in your application.

Example
To enable DevTools, you can use the devtools middleware:

```tsx
import { devtools } from "zustand/middleware";

export const useUserStore = create(
  devtools<UserState>((set) => ({
    userName: "",
    fullName: "",
    address: "",
    setAddress: (address) => set({ address }),
  }))
);
```

## TypeScript Support

Zustand provides excellent TypeScript support, allowing you to define types for your state and actions. This helps with type safety in your application, making it easier to catch errors during development.
