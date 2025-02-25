---
title: "Tanstack React Query"
slug: tanstack-react-query
description: Understanding Tanstack React Query
imageUrl: /images/5.png
author: ozan
date: 18.11.2024
tags:
  - React
  - React-Router
  - Axios
published: false
---

## TanStack React Query Tutorial

### Introduction

TanStack Query (formerly React Query) is a powerful data-fetching library for React applications. It provides hooks for managing server state, simplifying data fetching, caching, synchronization, and updating your UI efficiently.

Before we start, ensure you have the following packages installed in your project:

```bash
npm create vite@latest
npm install axios @tanstack/react-query json-server@0.17.4 react-router-dom
```

In your package.json, add the following script to run the JSON server:

```bash
"server": "json-server --watch db.json --port 3001"
```

### Traditional Data Fetching

In traditional data fetching, we manage loading states and errors manually. Here’s how you can fetch a list of todos using Axios:

```tsx
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/todos");
      setTodos(response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>Error has occurred...</div>;
  }

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      {todos.map((todo) => (
        <div className="todo-item" key={todo.id}>
          <h3 className="todo-title">{todo.title}</h3>
          <p className="todo-body">{todo.body}</p>
        </div>
      ))}
    </div>
  );
};
```

### Fetching with React Query

Using React Query simplifies data fetching significantly. Here’s how to fetch todos with it:

First, wrap your application with QueryClientProvider in main.tsx:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

Now, let’s fetch the todos using useQuery:

```tsx
const fetchTodos = async () => {
  const response = await axios.get("http://localhost:3001/todos");
  return response.data;
};

const TodoQuery: React.FC = () => {
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching todos: {error.message}</div>;

  return (
    <div className="todo-list">
      <h2>Todo Query</h2>
      {todos.map((todo: TodoType) => (
        <div className="todo-item" key={todo.id}>
          <h3 className="todo-title">{todo.title}</h3>
          <p className="todo-body">{todo.body}</p>
        </div>
      ))}
    </div>
  );
};
```

### React Query Dev Tools

To inspect your queries, install the React Query DevTools:

```bash
npm i @tanstack/react-query-devtools
```

Then, update main.tsx:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</StrictMode>;
```

You can monitor fetching states using isLoading and isFetching:

`console.log({ isLoading, isFetching });`
Initially, both isLoading and isFetching will be true. After fetching, they will both be false.
If you navigate away and return, isLoading will be false, but isFetching will be true if the data is stale.

### Stale Time

Control how long data is considered fresh using the staleTime option in useQuery:

```tsx
const { data } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  staleTime: 10000, // Data is fresh for 10 seconds
});
```

Polling with refetchInterval
To keep fetching data at regular intervals, use refetchInterval:

```tsx
const { data } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchInterval: 5000, // Refetch every 5 seconds
});
```

Triggering Queries on Demand
You can disable automatic fetching and trigger it manually:

```tsx
const { data, refetch } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  enabled: false, // Disable auto-fetching
});
```

// Button to manually fetch
`<button onClick={() => refetch()}>Fetch</button>`

### Querying by ID

To fetch specific post details by ID, create a route and use useParams:

```tsx
const fetchPostDetails = (postId: string | undefined) => {
  return axios.get(`http://localhost:3001/posts/${postId}`);
};

const PostDetailsRQ = () => {
  const { postId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostDetails(postId),
  });

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const { title, body } = data?.data || {};

  return (
    <div className="post-details-container">
      <div className="post-details-title">{title}</div>
      <div className="post-details-body">{body}</div>
    </div>
  );
};
```

### Pagination

To implement pagination, use query parameters in your fetch function:

```tsx
const fetchFruits = (pageId: number) => {
  return axios.get(`http://localhost:4000/fruits/?_page=${pageId}&_per_page=4`);
};

const PaginatedQueries = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fruits", page],
    queryFn: () => fetchFruits(page),
    keepPreviousData: true, // Keep previous data while loading
  });

  // Handle loading and error states
  if (isLoading) return <h2>Page is Loading...</h2>;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <div className="container">
      {data?.data.map((item: { id: number; name: string }) => (
        <div key={item.id} className="fruit-label">
          {item.name}
        </div>
      ))}
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
        Prev Page
      </button>
      <button onClick={() => setPage((prev) => prev + 1)}>Next Page</button>
    </div>
  );
};
```

### Infinite Scroll

To implement infinite scrolling, use useInfiniteQuery:

```tsx
const fetchAnimals = ({ pageParam = 1 }: any) => {
  return axios.get(
    `http://localhost:3001/animals/?_limit=10&_page=${pageParam}`
  );
};

const InfiniteQueries = () => {
  const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["animals"],
    queryFn: fetchAnimals,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < 5 ? allPages.length + 1 : undefined,
  });

  if (isLoading) return <h2>Page is Loading...</h2>;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <div className="container">
      {data?.pages.map((page) =>
        page.data.map((animal: { id: number; name: string }) => (
          <div className="fruit-item" key={animal.id}>
            {animal.name}
          </div>
        ))
      )}
      <button onClick={fetchNextPage}>Load More</button>
    </div>
  );
};
```

### Infinite Scroll with Intersection Observer

You can enhance the infinite scroll by using react-intersection-observer:

```tsx
const InfiniteQueries2 = () => {
  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["animals"],
      queryFn: fetchAnimals,
      getNextPageParam: (lastPage, allPages) =>
        allPages.length < 5 ? allPages.length + 1 : undefined,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) return <h2>Page is Loading...</h2>;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <div className="container">
      {data?.pages.map((page) =>
        page.data.map((animal: { id: number; name: string }) => (
          <div className="fruit-item" key={animal.id}>
            {animal.name}
          </div>
        ))
      )}
      <div ref={ref}>{isFetchingNextPage && "Loading..."}</div>
    </div>
  );
};
```

### Using Mutations

To add a new todo using mutations:

```tsx
const addTodo = async (todo: AddTodoType) => {
  const response = await axios.post("http://localhost:3001/todos", todo);
  return response.data;
};

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchPosts,
  });

  const { mutate: addTodoMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newTodo: AddTodoType = { title, body };
    addTodoMutation(newTodo);
    setTitle("");
    setBody("");
  };

  if (isLoading) return <div>Page is loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="post-list">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          value={title}
        />
        <input
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter post body"
          value={body}
        />
        <button type="submit">Post</button>
      </form>
      <div className="todo-list">
        <h2>Add Todo Query</h2>
        {todos?.map((todo: TodoType) => (
          <Link key={todo.id} to={`/todos/${todo.id}`}>
            <div className="todo-item">
              <h3 className="todo-title">{todo.title}</h3>
              <p className="todo-body">{todo.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
```

### Optimistic Updates

To implement optimistic updates, use the onMutate callback:

```tsx
const { mutate: addTodoMutation } = useMutation({
  mutationFn: addTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData(["todos"]);

    queryClient.setQueryData(["todos"], (oldTodos: []) =>
      oldTodos
        ? [...oldTodos, { ...newTodo, id: String(oldTodos.length + 1) }]
        : oldTodos
    );

    return { previousTodos };
  },
  onError: (error, newTodo, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

### Conclusion

TanStack React Query streamlines the process of fetching, caching, and syncing server state in React applications. By leveraging its powerful features, you can enhance your application's performance and user experience significantly.

Further Reading
Explore the official documentation for more advanced usage and best practices.

You can check out the react-query project on [github](https://github.com/OzanOcak/react-query-app).
