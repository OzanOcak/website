---
title: Understanding Advanced Types in TypeScript
slug: understanding-typescript
description: Understanding Typescript
imageUrl: /images/7.png
author: ozan
date: 16.11.2024
tags:
  - typescript
published: false
---

# Advanced Types

TypeScript offers a robust type system that helps developers catch errors early and improve code quality. One of the powerful features of TypeScript is its advanced types, which include constructs like as const, tuples, generics, and built-in types. In this post, we’ll explore these concepts with code snippets for clarity.

## As Const

The as const assertion allows you to create immutable types. For example, while a normal variable can be mutable, using as const makes its properties read-only. This is particularly useful when creating enums or constant values.

```ts
let a: number = 4; // a is mutable
const b = 5; // b is not mutable
const c = 5 as const; // this is what actually happens behind the sceen
const num = ["1", "2", "3"] as const; // num.push('4') is still valid witout as const
const object = { name: "", age: 35, adress: { street: "" } } as const; // as const make every property as read only
```

This can be effective for creating enums:

```ts
const LEVELS = ["begginer", "intermadiate", "advanced"] as const; // type LEVELS = ['begginer' | 'intermadiate'| 'advanced' }
type Person = { skillLevel: (typeof LEVELS)[number] }; // can be assigned  to variable
LEVELS.forEach((level) => console.log(level)); // this can be iterated unlice type
```

## Tuples

Tuples are fixed-length arrays with specific types. They can be useful for representing structured data.

```ts
type Tuple = [string, boolean];
const person: Tuple = { name: "John", age: 35 };
Object.entries(person).forEach(([key, value]) => {
  console.log(key, value);
}); // type Tuple = [string, boolean] ,note that useState returns tupple
```

## Generics

Generics enable you to create reusable components that can work with any data type. The <HTMLInputElement> is an example of a generic type.

```ts
const input = document.querySelector<HTMLInputElement>(".input");
console.log(input);
```

With functions, generics allow for flexibility:

```ts
function getSecond<T>(array: T[]): T {
  array[1];
}

const a = [1, 2, 3]; // returns 2 (T is number)
const b = ["a", "b", "c"]; // returns b (T is string)
```

A practical use case for generics is in API responses:

```ts
type APIResponse<TData> = {
  data: TData;
  error: boolean;
};
const a: APIResponse<Array<number>> = { data: [1, 2, 3], isError: false };
```

## Async Functions

TypeScript can infer return types for async functions, making code cleaner and more readable.

```ts
function wait(duration: number) {
  return new Promise<string>((res) => {
    setTimeout(() => res("hi!"), duration);
  });
}

wait(1000).then((value) => {
  console.log(value.length);
});
```

## Build in Types

TypeScript provides built-in utility types like Omit, Pick, Partial, and Required to manipulate types easily.

## Omit and Pick

To create a new type based on an existing one, you can use Pick or Omit:

`type NewTodo = Pick<Todo, "name" | "completed">`
`type NewTodo = Omit<Todo, "id">`

```ts
type Todo = {
  id:string;
  name:string;
  completed:boolean
}
type NewTodo = {
  name:string;
  completed:boolean;
}
function saveTodo(newTodo: NewTodo) {
  return {...newTodo, id:crypto.randomUUID()
}
```

## Partial and Required

To make properties optional or required:

```ts
type Todo = {
  title?: string;
  completed: boolean;
  address?: {
    street?: street;
  };
};

type RequiredPick<T, Key extends keyof T> = Required<Pick<T, Key>> & T; // we pick one of the keys from Todo type and make it required, lastly make it union with Todo but required overwrites so this code makes generic picked type as required.
type FormTodo = RequiredPick<Todo, "title">; // now title is require, it is not optional anymore

type PartialPick<T, Key extends keyof T> = Partial<Pick<T, Key>> & Omit<T, Key>; // we pick one key and make it partial, lastly we union with all of the keys but it would overwrite required so we omit the specific key before unioning
type FormTodo2 = PartialPick<Todo, "completed">; // now completed is optional
```

## ReturnType and Parameters

TypeScript allows you to extract the return type of a function or its parameters using ReturnType and Parameters.

```ts
const Func = () => void

type ReturnTypeOfFunc = ReturnType<typeof Func> //
```

```ts
function checkLength(a: string, b: number) {
  return a.length() > b;
}
type ParamsOfCheckLen = Parameters<typeof CheckLength>; // [a:string, b:number] // a tupple
```

## Record

The Record type is useful for creating objects with specific keys and values.

```ts
type PeopleGroupByName = Record<Person["name"], Person[]>;
```

## Readonly

The Readonly type creates immutable versions of existing types.
This is basically same **_as const_** but readonly can be used for creating another type.

```ts
type FinalTodo = Readonly<Todo>;
```

## Type Narrowing

Type narrowing allows for more precise type checking in your code. Basic type guards help differentiate types effectively.

## Basic Type Guards

```ts
type Todo = {
  titles: string;
  property: "High" | "Normal" | "Low";
  isComplete: boolean;
  description?: string;
  dueDate: Date | string;
};

function extendTodo(todo: Todo) {
  if (typeof todo.dueDate === "string") {
    // or todo.dueDate instanceof Date
  } else {
    console.log(todo.dueDate.getDate);
  }
}
```

- checking undefined is possible with **?**. Below code is equivalent to `todo.description?.length > 5`

```ts
if(todo.description !== undefined) {
  todo.description.length > 5 // length is not exist but it will not give error since we check if it is undefined but this is possible with todo.description?.length > 5
```

- This **!** also tell tsc that it is not possible be to be null but it overwrites typescript

## Discriminated Union

Discriminated unions simplify handling different types:

```ts
type SuccessResponse = {
  status: "Success";
  data: { id: string; name: string };
};
type ErrorResponse = {
  status: "Error";
  errorMessage: string;
};

type UserApiResponse = SuccessResponse | ErrorResponse;
```

## Function Overloads

Function overloads allow you to define multiple ways to call a function based on different input types.

```ts
function sum = (nums:number[]):number
function sum = (a:number,b:number):number


const t1 = sum([20,22]);
const t2 = sum(20,22);
```

## Conclusion

Understanding advanced types in TypeScript enhances code quality and maintainability. By leveraging features like as const, generics, utility types, and type narrowing, developers can write more robust and error-resistant applications. Embrace these tools to improve your TypeScript skills!
