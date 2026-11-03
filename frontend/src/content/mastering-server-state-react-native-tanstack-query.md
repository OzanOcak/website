---
title: "Mastering Server State in React Native with TanStack Query: A Production Guide"
slug: mastering-server-state-react-native-tanstack-query
description: A practical guide to managing server state in React Native with TanStack Query, covering query keys, caching, mutations, optimistic updates, pagination, API integration, authentication token refresh, deep linking, and network lifecycle management.
imageUrl: /images/3.webp
author: o. ocak
date: 02.11.2026
tags:
  - React Native
  - TanStack Query
  - Server State
  - React Query
  - API Integration
  - Caching
  - Authentication
  - JavaScript
published: true
---

## Introduction

Managing server state in a React Native application involves more than simply fetching data from an API.

Mobile applications operate in environments where network connectivity can fluctuate, applications frequently transition between foreground and background states, and users expect responsive interfaces even when requests take time to complete.

Managing these scenarios manually with `useEffect` and `useState` can introduce unnecessary complexity, including duplicated requests, stale data, race conditions, inconsistent loading states and difficult cache synchronization.

TanStack Query (formerly React Query) provides a dedicated solution for managing asynchronous server state.

In my React Native application, I use TanStack Query alongside Redux Toolkit, Axios and a custom authentication backend.

This article explores how these technologies work together, covering caching, authentication boundaries, pagination, infinite scrolling, optimistic updates, deep linking, network connectivity, application lifecycle management and performance considerations.

The examples use TanStack Query v5.

### Technology stack

- React Native
- TypeScript
- TanStack Query v5
- Redux Toolkit
- Axios
- React Navigation
- AsyncStorage
- Node.js / Express backend

---

## Understanding Client State vs. Server State

One of the most important architectural decisions is understanding the difference between client state and server state.

Although both represent application data, they have different ownership and lifecycle requirements.

### Client State

Client state is owned and managed by the application.

Examples include:

- Authentication UI state.
- Selected theme.
- Device preferences.
- Navigation-related application preferences.
- Local UI configuration.

Redux Toolkit is suitable for managing this type of state.

### Server State

Server state originates from a remote backend.

Examples include:

- User profiles.
- Blog posts.
- Comments.
- Likes.
- Product information.
- Remote application configuration.

Unlike client state, server state can change independently of the application.

It also requires handling:

- Asynchronous requests.
- Caching.
- Data freshness.
- Network failures.
- Request deduplication.
- Refetching.
- Cache invalidation.

TanStack Query provides these capabilities without requiring developers to implement their own caching and synchronization infrastructure.

### Architectural separation

| Responsibility                | Technology             |
| ----------------------------- | ---------------------- |
| Client-side application state | Redux Toolkit          |
| Server-state management       | TanStack Query         |
| HTTP communication            | Axios                  |
| Authentication backend        | Node.js / Express      |
| Persistent preferences        | AsyncStorage           |
| Secure native credentials     | Keychain / SecureStore |
| Navigation                    | React Navigation       |

The important principle is to avoid maintaining duplicate copies of server data in Redux and TanStack Query.

For example, if TanStack Query already manages a user profile, there is generally no reason to copy that profile into Redux.

Each library should have a clearly defined responsibility.

---

## Query Configuration and Query Keys

A query represents an asynchronous request whose result is managed by TanStack Query.

The `useQuery` hook provides a declarative interface for fetching and managing server data.

```typescript
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};
```

The query key identifies the cached data.

This is important because TanStack Query uses query keys to determine whether two requests represent the same query.

### Query Keys

A query key should uniquely identify the requested data and its relevant parameters.

For example:

```typescript
["profile"]["blogs"][("blogs", { page: 1 })][("blog", "123")][
  ("comments", "123")
];
```

If a request depends on a parameter, that parameter should generally be included in the query key.

For example:

```typescript
useQuery({
  queryKey: ["blogs", { category, page }],

  queryFn: () =>
    fetchBlogs({
      category,
      page,
    }),
});
```

This ensures that different categories and pages have separate cache entries.

### Organizing Query Keys

For larger applications, query-key factories improve consistency.

```typescript
export const blogKeys = {
  all: ["blogs"] as const,

  lists: () => [...blogKeys.all, "list"] as const,

  list: (filters: BlogFilters) => [...blogKeys.lists(), filters] as const,

  details: () => [...blogKeys.all, "detail"] as const,

  detail: (id: string) => [...blogKeys.details(), id] as const,
};
```

Usage:

```typescript
useQuery({
  queryKey: blogKeys.detail(blogId),

  queryFn: () => fetchBlog(blogId),
});
```

This becomes particularly useful when invalidating related queries.

---

## Understanding Cache Freshness: staleTime vs. gcTime

Two important TanStack Query configuration properties are `staleTime` and `gcTime`.

Although they are related to caching, they solve different problems.

### staleTime

`staleTime` determines how long fetched data is considered fresh.

While data is fresh, TanStack Query generally avoids automatically refetching it simply because a component mounts or the application regains focus.

### gcTime

`gcTime` determines how long inactive queries remain in memory before garbage collection.

An inactive query is one that no longer has active observers.

Example:

```typescript
useQuery({
  queryKey: ["profile"],

  queryFn: fetchProfile,

  staleTime: 60_000,

  gcTime: 300_000,
});
```

In this example:

- The data is considered fresh for 60 seconds.
- Once the query becomes inactive, its cached data can remain for up to 300 seconds before garbage collection.

An important distinction:

**Stale data is not necessarily deleted data.**

A query can become stale while remaining in the cache.

This allows the application to display previously fetched information while refreshing it in the background.

---

## Authentication Boundaries and Cache Security

Authentication introduces another important consideration: separating server data belonging to different users.

Imagine the following scenario:

1. User A logs into the application.
2. The application fetches User A's profile.
3. User A logs out.
4. User B logs into the same device.

If the application doesn't properly handle cached data, User B could briefly encounter data previously fetched for User A.

This is both a correctness and privacy concern.

### Clearing the Query Cache on Logout

TanStack Query exposes `useQueryClient` to access the application's query cache.

```typescript
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Prevent in-flight queries from continuing.
    await queryClient.cancelQueries();

    // Clear all cached queries and mutations.
    queryClient.clear();

    // Clear authentication state and credentials.
    // Perform backend logout as required.
  };

  return handleLogout;
};
```

`queryClient.clear()` clears both the query and mutation caches.

However, cache clearing should be coordinated with the authentication lifecycle.

For example, the application should prevent old requests from completing and repopulating user-specific caches after logout.

Query functions should consume the provided `AbortSignal`:

```typescript
useQuery({
  queryKey: ["profile"],

  queryFn: async ({ signal }) => {
    const response = await axiosInstance.get("/profile", { signal });

    return response.data;
  },
});
```

Axios supports `AbortSignal`, allowing TanStack Query cancellation to reach the underlying HTTP request.

### User-Specific Query Keys

Another useful approach is including the authenticated user ID in user-specific query keys.

```typescript
useQuery({
  queryKey: ["profile", userId],

  queryFn: fetchProfile,
});
```

This helps isolate cache entries belonging to different authenticated users.

For sensitive applications, use both appropriate query-key isolation and cache cleanup.

Clearing the cache is not a replacement for backend authorization. Every protected API request must still be authorized by the server.

---

## Infinite Scrolling with useInfiniteQuery

Mobile applications frequently display large collections of information.

Loading an entire collection at once can increase network usage, memory consumption and initial rendering time.

Pagination solves this problem by retrieving data in smaller portions.

TanStack Query provides `useInfiniteQuery` for managing paginated data.

### Example: Blog Feed

Imagine an API that returns ten blog posts per request.

```typescript
interface Blog {
  id: string;
  title: string;
  content: string;
}

interface BlogPage {
  items: Blog[];
  hasMore: boolean;
}

interface BlogPageParam {
  page: number;
}

const fetchBlogs = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<BlogPage> => {
  const response = await axiosInstance.get(`/blogs?page=${pageParam}&limit=10`);

  return response.data;
};
```

The infinite query:

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";

export const useBlogFeed = () => {
  return useInfiniteQuery({
    queryKey: ["blogs"],

    queryFn: fetchBlogs,

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },

    maxPages: 5,
  });
};
```

### Important Properties

| Property               | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `data.pages`           | Contains retrieved pages                       |
| `data.pageParams`      | Contains page parameters                       |
| `hasNextPage`          | Indicates whether another page exists          |
| `fetchNextPage`        | Retrieves the next page                        |
| `isFetchingNextPage`   | Indicates whether the next page is loading     |
| `isFetchNextPageError` | Indicates whether fetching another page failed |
| `maxPages`             | Limits the number of retained pages            |

`maxPages` is particularly useful when working with large feeds because it limits the number of retained pages in the infinite-query cache.

However, it should be configured carefully because older pages can be removed when the limit is reached.

### React Native FlatList Integration

React Native's `FlatList` provides an `onEndReached` callback that can trigger pagination.

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlogFeed();

const blogs = data?.pages.flatMap((page) => page.items) ?? [];

return (
  <FlatList
    data={blogs}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <BlogCard blog={item} />}
    onEndReached={() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }}
    onEndReachedThreshold={0.5}
    ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
  />
);
```

The `FlatList` handles virtualized rendering, while TanStack Query manages the server-side pagination and cached pages.

These are separate responsibilities.

---

## Optimistic UI Updates

An optimistic update modifies the UI before the backend confirms that an operation has succeeded.

This is useful for interactions where users expect immediate feedback.

For example, when a user likes a blog post, the interface can update immediately rather than waiting for the API response.

TanStack Query supports optimistic updates through mutation lifecycle callbacks.

### Example: Liking a Blog Post

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Blog {
  id: string;
  title: string;
  likes: number;
  isLiked: boolean;
}

interface BlogPage {
  items: Blog[];
  hasMore: boolean;
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await axiosInstance.post(`/blogs/${postId}/like`);

      return response.data;
    },

    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: ["blogs"],
      });

      const previousBlogs = queryClient.getQueryData<InfiniteData<BlogPage>>([
        "blogs",
      ]);

      queryClient.setQueryData<InfiniteData<BlogPage>>(["blogs"], (old) => {
        if (!old) return old;

        return {
          ...old,

          pages: old.pages.map((page) => ({
            ...page,

            items: page.items.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: post.likes + 1,
                    isLiked: true,
                  }
                : post,
            ),
          })),
        };
      });

      return { previousBlogs };
    },

    onError: (_error, _postId, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(["blogs"], context.previousBlogs);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
};
```

### Understanding the Mutation Lifecycle

The example follows three important stages.

**1. onMutate**

Executed before the mutation function completes.

It cancels relevant queries, captures the previous cached data and applies the optimistic update.

**2. onError**

Executed if the mutation fails.

The previous cache snapshot can be restored.

**3. onSettled**

Executed after the mutation succeeds or fails.

The relevant queries are invalidated so the application can reconcile its state with the backend.

### Handling Concurrent Mutations

Optimistic updates become more complicated when multiple mutations operate on the same data simultaneously.

For example:

1. A user likes a post.
2. The user quickly changes their action.
3. Two requests are in progress.
4. The earlier request fails after the later request succeeds.

A naive rollback can overwrite a more recent optimistic update.

Possible strategies include:

- Preventing repeated actions while a mutation is pending.
- Serializing mutations for the same resource.
- Using server-authoritative mutation responses.
- Designing idempotent API operations.
- Carefully reconciling cache updates.

Optimistic updates improve perceived responsiveness, but they introduce consistency considerations that must be handled deliberately.

---

## Handling Token Expiration with Axios Interceptors

Authentication is another area where TanStack Query and Axios work together.

In my application, authentication uses short-lived access tokens and a refresh mechanism managed by the backend.

The access token is kept in memory, while the refresh mechanism uses the appropriate secure credential storage and server-side rotation strategy.

When an access token expires, protected API requests may receive HTTP 401 responses.

Instead of immediately forcing the user to authenticate again, Axios interceptors can handle the refresh process.

### Request Interceptor

The request interceptor attaches the current access token.

```typescript
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
```

### Response Interceptor

The response interceptor detects an expired access token.

Conceptually, the flow is:

1. A request receives HTTP 401.
2. The interceptor checks whether the request has already been retried.
3. The interceptor starts or joins a refresh operation.
4. The backend validates and rotates the refresh credential.
5. The application receives a new access token.
6. The original request is retried.
7. The final response is returned to the original caller.

### Handling Concurrent Refresh Requests

A particularly important issue occurs when multiple requests receive 401 responses simultaneously.

Without coordination, each request might independently attempt to refresh the access token.

This can cause refresh-token rotation conflicts.

A single-flight refresh mechanism prevents multiple refresh operations from running concurrently.

Conceptually:

```typescript
let refreshPromise: Promise<string> | null = null;

async function getRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
```

Each failed request can await the same refresh operation.

The actual interceptor must also handle retry markers, logout on unrecoverable refresh failure and avoiding recursive refresh requests.

### How TanStack Query Fits In

An important distinction:

TanStack Query does not need to know about the token refresh process.

It calls the query function and receives its final result.

If the Axios interceptor successfully refreshes the token and retries the original request, the query function resolves normally.

If the interceptor cannot recover, the query function rejects.

TanStack Query then applies its configured retry policy.

This separation keeps authentication transport logic in Axios while TanStack Query manages server-state fetching and caching.

### Retry Configuration

For example:

```typescript
useQuery({
  queryKey: ["profile"],

  queryFn: fetchProfile,

  retry: (failureCount, error) => {
    if (isUnauthorized(error)) {
      return false;
    }

    if (isForbidden(error)) {
      return false;
    }

    return failureCount < 2;
  },
});
```

Authentication failures should generally be handled by the authentication layer rather than repeatedly retried by TanStack Query.

---

## Deep Linking and TanStack Query

Deep linking allows an external URL to open a specific screen inside a mobile application.

For example:

```text
oocakrn://blog/123
```

The application should navigate directly to the corresponding blog detail screen.

However, navigation and data fetching are different responsibilities.

React Navigation handles the destination screen.

TanStack Query retrieves and manages the server data required by that screen.

### Deep-Linking Workflow

A typical workflow looks like this:

1. The operating system receives a deep link.
2. React Native passes the URL to the application.
3. React Navigation resolves the URL.
4. The application navigates to the appropriate screen.
5. The screen extracts the blog ID.
6. TanStack Query fetches the blog information.
7. Cached data is displayed when available.

### Fetching Data from the Destination Screen

```typescript
import { useQuery } from "@tanstack/react-query";

export const useBlogDetail = (blogId: string) => {
  return useQuery({
    queryKey: ["blog", blogId],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(`/blogs/${blogId}`, { signal });

      return response.data;
    },

    enabled: Boolean(blogId),
  });
};
```

The screen can then use the hook:

```tsx
const BlogDetailScreen = ({ route }) => {
  const { blogId } = route.params;

  const { data, isPending, error } = useBlogDetail(blogId);

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <ErrorView />;
  }

  return <BlogDetail blog={data} />;
};
```

### Why Query Keys Matter Here

Consider two deep links:

```text
oocakrn://blog/123

oocakrn://blog/456
```

Each destination needs a different cache entry.

Using:

```typescript
["blog", blogId];
```

ensures that the correct blog data is associated with each screen.

### Cold Start vs. Warm Start

Mobile applications can receive deep links in two different situations.

**Cold start:** The application is not running when the deep link is opened.

**Warm start:** The application is already running in the background or foreground.

React Navigation handles the linking configuration and URL processing.

TanStack Query remains responsible for retrieving the destination's server data in either scenario.

One additional consideration is authentication. If a protected deep link arrives before the application has restored its authentication state, navigation should wait until authentication initialization is complete or route the user through an appropriate sign-in flow.

---

## React Native Application Lifecycle Integration

Unlike typical web applications, React Native applications frequently transition between foreground and background states.

For example:

1. A user opens the application.
2. The application fetches their profile.
3. The user switches to another application.
4. Several minutes pass.
5. The user returns to the original application.

The application may need to refresh stale information.

TanStack Query provides `focusManager` to manage application focus.

### Integrating AppState

```typescript
import { useEffect } from "react";

import { AppState } from "react-native";

import { focusManager } from "@tanstack/react-query";

export function useAppStateFocus() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);
}
```

This connects React Native's application lifecycle to TanStack Query's focus management.

When the application becomes active again, stale queries can be refetched according to their configuration.

This is particularly useful for:

- User profiles.
- Notifications.
- Dashboard information.
- Frequently changing content.
- Data that might become outdated while the application is backgrounded.

---

## Network Connectivity and Offline Behavior

Mobile connectivity is unpredictable.

Users can lose Wi-Fi, switch between mobile networks or enter areas with no internet access.

TanStack Query provides `onlineManager` to track connectivity.

In React Native, a library such as `@react-native-community/netinfo` can provide network-state information.

Example:

```typescript
import NetInfo from "@react-native-community/netinfo";

import { onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(
      Boolean(state.isConnected && state.isInternetReachable !== false),
    );
  });
});
```

This allows TanStack Query to coordinate query execution with network availability.

### Offline Considerations

TanStack Query can retain cached data and pause certain operations while the application is offline.

However, this does not automatically make an application fully offline-first.

A genuinely offline-first architecture may also require:

- Persistent local databases.
- Local write queues.
- Conflict resolution.
- Synchronization strategies.
- Handling failed mutations.
- Defining server versus local data ownership.

For applications using SQLite, for example, TanStack Query can work alongside a local persistence layer, but the synchronization architecture must be designed separately.

---

## Pagination vs. Infinite Queries in TanStack Query v5

Although both approaches retrieve data in smaller portions, they represent different UI patterns.

### Standard Pagination

Standard pagination is appropriate when users explicitly navigate between pages.

For example:

- Page 1.
- Page 2.
- Page 3.

Each page is represented by a separate query.

```typescript
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useBlogs = (page: number) => {
  return useQuery({
    queryKey: ["blogs", page],

    queryFn: () => fetchBlogs(page),

    placeholderData: keepPreviousData,
  });
};
```

In TanStack Query v5, the old `keepPreviousData` option was replaced by the `placeholderData` pattern.

The `keepPreviousData` helper preserves the previous query's displayed data while the next page is loading.

### Infinite Queries

Infinite queries are appropriate when users continuously load more content.

Examples include:

- Social feeds.
- Blog feeds.
- Search results.
- Product listings.

Unlike standard pagination, an infinite query stores multiple pages under one query.

The choice depends on the interaction model, not simply the number of API requests.

---

## Error Handling and Retry Strategies

Network requests can fail for many reasons.

Examples include:

- Network connectivity loss.
- Request timeouts.
- HTTP 401 authentication failures.
- HTTP 403 authorization failures.
- HTTP 404 missing resources.
- HTTP 500 server errors.

Not every error should be retried.

TanStack Query allows retry behavior to be configured.

```typescript
useQuery({
  queryKey: ["profile"],

  queryFn: fetchProfile,

  retry: (failureCount, error) => {
    if (isUnauthorized(error)) {
      return false;
    }

    if (isForbidden(error)) {
      return false;
    }

    return failureCount < 2;
  },

  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
});
```

This uses exponential backoff.

The delay increases between retry attempts, helping avoid repeatedly hitting an unavailable backend.

### Error Handling Strategy

| Error           | Typical handling              |
| --------------- | ----------------------------- |
| Network failure | Retry when appropriate        |
| Timeout         | Retry when appropriate        |
| HTTP 401        | Attempt token refresh         |
| HTTP 403        | Show authorization error      |
| HTTP 404        | Show missing-resource state   |
| HTTP 500        | Retry with controlled backoff |

The correct policy depends on the API and operation.

For example, a read-only GET request can often be retried safely, whereas retrying a non-idempotent POST operation requires more care.

---

## Performance Considerations

TanStack Query helps reduce unnecessary requests and manage server-state caching, but it does not automatically solve every React Native performance problem.

Performance should be considered across multiple layers.

### Query Configuration

Use appropriate `staleTime` values to avoid unnecessary refetching.

Use query keys consistently to prevent accidental cache duplication.

Avoid invalidating more queries than necessary.

### Component Rendering

Use React memoization where it provides measurable benefits.

Examples include:

- `React.memo`.
- `useMemo`.
- `useCallback`.

Avoid unnecessary memoization because it can introduce complexity without improving performance.

### List Rendering

For large datasets, use `FlatList` or another virtualized list implementation.

Consider:

- Stable keys.
- Appropriate batch rendering.
- `initialNumToRender`.
- `windowSize`.
- `getItemLayout` when item dimensions are known.
- Avoiding expensive work inside `renderItem`.

### Network Performance

Consider:

- Request deduplication.
- Cache reuse.
- Pagination.
- Appropriate retry policies.
- Avoiding unnecessary invalidation.
- Cancelling obsolete requests.

The objective is to reduce unnecessary work while keeping the displayed data sufficiently fresh.

---

## Testing TanStack Query

Testing server-state behavior is important because query caching and asynchronous operations introduce additional complexity.

A common approach is to use Jest and React Native Testing Library.

### Testing Setup

Each test can use a separate QueryClient to avoid sharing cached data between tests.

```typescript
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { render } from
  '@testing-library/react-native';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};
```

Disabling retries in tests makes failures easier to reproduce and prevents unnecessary waiting.

### What Should Be Tested?

Important scenarios include:

- Successful query execution.
- Failed requests.
- Loading states.
- Cache reuse.
- Query invalidation.
- Optimistic update rollback.
- Pagination.
- Infinite scrolling.
- Logout cache clearing.
- Token refresh failures.
- Offline and reconnect behavior.

For API mocking, Mock Service Worker (MSW) is another useful option.

It allows tests to simulate HTTP responses without requiring a real backend.

---

## TanStack Query vs. RTK Query

Redux Toolkit includes its own server-state solution: RTK Query.

Both TanStack Query and RTK Query solve similar problems, but they have different architectural approaches.

### RTK Query

RTK Query integrates directly with Redux Toolkit.

It provides:

- API request management.
- Query caching.
- Request deduplication.
- Cache invalidation.
- Loading and error states.
- Generated React hooks.
- Subscription management.

Example:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com",
  }),

  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/profile",
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
```

The generated hook can be used directly:

```typescript
const { data, isLoading, error } = useGetProfileQuery();
```

### Comparison

| Feature               | TanStack Query            | RTK Query       |
| --------------------- | ------------------------- | --------------- |
| Redux dependency      | No                        | Yes             |
| Query caching         | Yes                       | Yes             |
| Request deduplication | Yes                       | Yes             |
| Cache invalidation    | Query-based               | Tag-based       |
| Generated hooks       | Through query definitions | Built in        |
| Mutations             | Yes                       | Yes             |
| Optimistic updates    | Yes                       | Yes             |
| Integration           | Independent               | Redux Toolkit   |
| Query lifecycle       | QueryClient               | Redux API slice |

### Which One Should You Choose?

There is no universally correct choice.

TanStack Query is useful when server-state management should remain independent of the application's client-state solution.

RTK Query is particularly attractive when an application already uses Redux Toolkit extensively and wants API definitions, caching and state management integrated into the Redux ecosystem.

In my application, I use Redux Toolkit for client state and TanStack Query for server state.

There is no need to migrate to RTK Query simply because Redux Toolkit is being introduced.

The important architectural decision is avoiding duplicate server-state management.

---

# Conclusion

TanStack Query is much more than a library for fetching API data.

It provides a comprehensive approach to managing asynchronous server state, including caching, synchronization, pagination, optimistic updates and request lifecycle management.

In a React Native application, these capabilities become particularly valuable because mobile applications must handle unpredictable network conditions, background execution, authentication expiration and frequent navigation transitions.

The most important concepts covered in this article include:

1. Separating client state from server state.
2. Structuring query keys and cache architecture.
3. Understanding `staleTime` and `gcTime`.
4. Managing authentication boundaries and cache cleanup.
5. Implementing infinite scrolling with `useInfiniteQuery`.
6. Performing optimistic updates and handling concurrent mutations.
7. Integrating Axios interceptors with authentication refresh.
8. Combining deep linking with server-state fetching.
9. Handling foreground and background application transitions.
10. Integrating network connectivity with `onlineManager`.
11. Understanding pagination and infinite queries.
12. Implementing retry and error-handling strategies.
13. Optimizing query and component performance.
14. Testing asynchronous server-state workflows.
15. Understanding the architectural differences between TanStack Query and RTK Query.

The most important architectural lesson is that navigation, client state, server state, authentication and HTTP communication should have clearly defined responsibilities.

When these layers work together without duplicating responsibilities, the application becomes easier to maintain, test and scale.

TanStack Query handles the complexity of server-state synchronization, allowing the rest of the application to focus on its actual responsibilities.
