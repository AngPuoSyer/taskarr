# Taskarr - Task Management Application

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run the Application

Install the dependencies

```sh
pnpm i
```
Build the docker images

```sh
pnpm docker:build
```
Run the docker containers

```sh
docker compose --env-file .env.local up -d
```
Run db migration
```sh
pnpm migration:run
```

hosts for the application
- frontend - localhost:3000
- backend - localhost:3001
- postgres - localhost:5432

Can visit localhost:3000/docs for the API Docs powered by OpenAPI

Enjoy the application :3


## Overview

This application is built within a NX Monorepo

### Backend

#### Tech Stack

- NestJS (Express Wrapper with very powerful Dependency Injection)
- Kysely (SQL Query Builder)
- PostgreSQL

#### Architecture Overview

The backend code is written and structured based on Clean Architecture

There are three main components to Clean Architecture

- Domain - The core of the system. Free of any dependencies. Responsible of performing business rules. Should be self-validating and portable between systems. E.g - TaskEntity, TaskCreatedEvent
- Application - The execution of application/business rules. Only interact with the domain data type. E.g TaskService, CreateTaskUseCase
- Infra - Anything that is outside of the application. E.g - Database, Other microservices, third party API, HTTP Request and Response to the system

When data is going through the layers, it should be mapped into their respective types to avoid leaking data types or interfaces that will cause tight coupling to the system

The code written in this way are very clean and manageable. But it takes time and a lot of upfront knowledge to be able to execute this properly. The structure of the code is also very rigid, making it very hard to make changes down the line.

#### Typebox
One of the very important component in the backend system is Typebox. Typebox is a validator library that mimic Typescript syntax and can generate OpenAPI specification documents. With that, we are able to single source the type definition and validation of the entity, types and validation of the HTTP routes, ensuring data coming in complies with the entity, and generate API docs + Frontend API sdk from it, making sure the API docs and frontend API calls are always up to date based on our application.

#### API Design
The API in this application follows RESTFUL API design. RESTFUL API are simple and straight forward. But the simplistic nature might become a challenge when we try to scale as it offers little flexibility when it comes to splitting concerns. An alternative design would be RPC API design which offers better flexibility.

### Frontend

#### Tech Stack

- React
- NextJS
- ChakraUI
- Tailwind
- React Query

#### Architecture Overview

Frontend changes very frequently, hence rather than focusing on the rigidity of the code where each layer should be separated from each other, the focus of the frontend code is more on grouping the code by concerns together so it can change easily without affecting other places

#### Generated SDK

Thanks to OenAPI spec, we are able to generate API sdk for frontend. Single sourcing the type definition and ensuring end-to-end type safety to our system. The sdk also abstract out one layer of code, which is interacting with the HTTP client directly, providing a cleaner code without much effort.

#### Encapsulation of Logic

The focus of the frontend code is encapsulating logic to each components. The logic for each concern of the application should be encapsulated into a component so when it gets to the topmost level, it is just the matter of composing components rather than trying to squeeze a lot of logic code into the page.

## Considerations

### Code Structure
Since the code is written in a monorepo settings, there are a couple considerations when structuring the directory
- apps - Applications that will be ran in a process. E.g - frontend, backend servers, microservices etc.
- package - Contains codes that supports the execution of business and application rules in the backend. E.g - Task Repository, Task Entity etc.
- ui - Contains codes and ui components that support the frontend
- files on root levels - can be shared between apps or a standalone executable unit. E.g - validators, database (as a standalone executable)

### Philosophy

Clean, manageable & well structured enterprise code is a very deep rabbit hole that one can spend a lifetime to possibly understand it. But in my opinion, to simplify the matter, the are a couple important concepts that act as the main pillars for a clean a manageable code that is demonstrated throughout the codebase.

#### 1. Concern

Mixing concerns in your code is the very bane of clean code. Code that carries the same functionality should still be separated despite being virtually the same. As they have different concerns, when the requirement of one side changes, it will affect the other side and causes a bunch of problems. Therefore there is a saying of `No abstraction is better than bad abstraction` as bad abstraction often have mixed concerns and introduce very tight coupling to the code. Hence, concern should be the very first concern (no pun intended) when it comes to writing maintainable code.

#### 2. Interface

Interfaces define contracts for how different parts of a system should interact without specifying how those interactions are implemented, from function level all the way to service level. Without taking care of the interface, it is very easy to introduce mixed concerns and tight coupling to the system. For example, leaking a database type into the application will cause the entire application being tied to the database type. Understanding the ownership of the interface and how to separate them is a key factor to a clean and maintainable code.

#### 3. Dependency

Dependencies are the relationships between parts of the system. Having too many dependencies in a part of the systems would introduced the so call `Spaghetti Code` as the dependency graph would be a total mess like lumps of spaghetti. Bad dependency management will cause tight coupling of the system and make maintenance and changes to the code extremely hard. Understanding the dependency hierarchy (who should be dependent on what) and avoid circular dependency is very important to keep the dependency of the system clean.

## Should Have
Apparently I am dumb enough to understand the requirement and implemented the `should have` already :P

### Sorting
- To sort efficiently, using the correct index is a must
- indexes are created on the `createdAt` and `dueDate` columns (for this use case, ascending and decending order probably does not matter as postgres supports index scan from the start and the end of the index tree)
- using `ORDER BY` query in sql on the column will trigger an index scan for efficient query
- frontend will query the tasks with the sort field and sort order

### Search

The implementation of search in the current iteration is done with creating a `GIN (Generalized Inverted Index)` index on a `ts_vector` column in postgres. It gets the job done but there are things to be considered with this approached

- Slow write performance - Every new row inserted into the db will cause the GIN index to be rebuilt. Inverted index are know to be very expensive to built. Despite being able to run in the background without blocking the table operation, it will still affect the write performance by a noticeable amount

- Query accuracy - `ts_vector` by default only supports very basic word/phrase search. To perform more accurate such as ngram search or semantic search requires more plugins on postgres, which might introduce more performance concerns

## Risk
```
There could there may be huge volumes of tasks created, in the 10s of 1000s, and wanted to ensure that the system would still be performant for users.
```
The main problem for this issue is the write performance. There are a couple ways to improve the write performance of the application.

### Horizontal Scaling

Due to many requests coming into the backend, one server instance might not be able to scale to the amount of requests. Since for this implementation, there server is written in a stateless manner, hence many instances can be spun up and performance its duty consistently without many issues. To counteract with the many database connections needed for the increase amount of server instances, a database connection pooler such as `pg_bouncer` can be used to help in this case.

### Database Sharding

Just like server, database can also be horizontally scaled via sharding. Sharding is routing database read and writes based on specific shard keys that is defined on the data. Sharding can be implemented manually or use existing solution such as `citus`. In the current implementation, the ID of the tasks (ObjectId, monotonically increasing) is chosen with sharding in mind as with a monotonically increasing ID, it can guarantee sequential reads when we try to list tasks rather than scattering across multiple shards to retrieve data

### Text Search Indexing

As mentioned in the pervious section, text search indexing is an expensive operation and is better off being handled by a secondary datastore that specializes in text search rather than on the primary datastore.
We can pipe the changes of postgres to text search engine like Elasticsearch via a message queue or straight into an integrated indexer like Manticoresearch and do the lookup in the Text Search Engine.

## What would I do given more time
- Write more unit test for better test coverage
- Write integration test as a safety net for any missing requirements or breaking changes in the future
- Create better type separation on the frontend
- Streamline code generation in the build pipeline to ensure no generated code is outdated
- Single source the types and interface from across frontend, backend and any other services based on the `DOMAIN` for end to end type safety
- Use RPC API design
