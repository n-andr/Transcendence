# ft_transcendence

_This project has been created as part of the 42 curriculum by lde-taey, mrodenbu, nandreev, nboer, sgramsch._

## Description
You Draw Me Crazy is a full-stack web application built as part of the 42 curriculum, within the project called ft_transcendence. We wanted to create a fun drawing game that we would love playing ourselves.

The resulting project combines real-time multiplayer gameplay with modern web technologies and a containerized development workflow.

Core goals of the project:
- Build a responsive, browser-based multiplayer experience.
- Implement real-time communication using WebSockets.
- Organize the codebase into a clear frontend/backend architecture.
- Run the full stack reproducibly via Docker.

---

## Instructions

### Prerequisites
- Docker + Docker Compose
- GNU Make

### Start the project
From the repository root:

```bash
make
```

This command:
1. Synchronizes shared type files between backend and frontend.
2. Builds Docker images.
3. Starts containers in detached mode.

### Access the app
- Frontend: `http://localhost:5173`
- Backend service runs inside Docker and is used by the frontend.

### Useful commands
- `make clean` → Stop containers and remove volumes (keeps images).
- `make fclean` → Full cleanup (containers, volumes, images).
- `make re` → Full rebuild from scratch.

### Notes
- Backend and frontend are containerized in `requirements/backend` and `requirements/frontend`.
- PostgreSQL runs as a dedicated service (`postgres:16-alpine`).
- Shared files are copied from `requirements/backend/shared` to `requirements/frontend/shared` via `make sync-shared`.

---

## Technical Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Router
- **Backend:** NestJS, TypeScript, Socket.IO
- **Database:** PostgreSQL + Prisma ORM
- **Infra:** Docker, Docker Compose, Makefile workflow

### Major Architectural Decisions
- **Server-authoritative game state:** Game-critical logic (room assignment, turn rotation, scoring, round progression) is handled on the backend to prevent client-side desync and inconsistent results.
- **Real-time event architecture with Socket.IO:** The application uses event-driven communication for drawing updates, guesses, and score changes so all connected clients stay synchronized with low latency.
- **Shared contracts between frontend and backend:** DTOs and WebSocket payload/event types are maintained in shared files and synchronized across services, reducing integration bugs and type mismatches.
- **Modular backend structure (NestJS):** Backend responsibilities are split into focused modules (`auth`, `game`, `rooms`, `websocket`, `database`) to improve maintainability, ownership, and feature iteration speed.
- **Component/state-driven frontend:** React components are organized by feature/layout, with Zustand for session and app state, making UI updates predictable during fast real-time changes.
- **Container-first development workflow:** Frontend, backend, and PostgreSQL run in Docker Compose with Make targets, ensuring reproducible local setups and minimizing environment drift across team members.

---

## Database Scheme

The backend uses **PostgreSQL** with **Prisma ORM**.  
The current schema is intentionally minimal and focused on authentication and game word storage.

### Models

| Model | Fields | Purpose |
| --- | --- | --- |
| `User` | `id`, `nickname`, `email`, `password`, `friends` | Stores user account and login-related data |
| `Word` | `id`, `text` | Stores unique words used by the drawing/guessing game |

### Prisma schema summary

- `User.id` → primary key (`Int`, auto-increment)
- `User.nickname` → unique
- `User.email` → unique
- `User.password` → hashed password string
- `User.friends` → `Int[]` list of user IDs (simple friend reference list)

- `Word.id` → primary key (`Int`, auto-increment)
- `Word.text` → unique word value

### Constraints and integrity rules

- Unique constraints prevent duplicate users by `nickname` or `email`.
- Unique constraint on `Word.text` prevents duplicate words.
- At this stage, there are **no explicit relational foreign keys** between models in Prisma (the `friends` field is stored as an integer array).

### Source of truth

The authoritative database definition is:

`requirements/backend/prisma/schema.prisma`

---

## Features List
The following list reflects the implemented project scope and ownership. 

### 1) User Management & Authentication

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] User sign up / login | Users can create accounts with email and password | NestJS auth flow with DB-backed user records | mrodenbu, nboer, nandreev, sgramsch |
| [B] User session management | Keep users logged in during gameplay | Session/JWT-based auth state used by frontend socket/game flow | lde-taey, nboer, nandreev |
| [B] Database for users | Store user credentials and basic profile | Prisma schema + migrations for user persistence | sgramsch |

### 2) Rooms & Multiplayer

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] Automatic room assignment | Users automatically join a room with available players | Server handles room entry and capacity checks | mrodenbu, nboer, sgramsch |
| [B] Server-controlled drawer rotation | Server determines who draws next | Deterministic turn order managed by backend game state | sgramsch |
| [B/F] Round timer & score tracking | Each round has a timer, and scores are tracked per player | Server-authoritative scoring/timing, frontend live rendering | lde-taey, mrodenbu, nboer |
| [B] Multiplayer support | Support at least 2+ simultaneous players | Real-time sync of canvas, guesses, and scores | mrodenbu, nboer, nandreev |

### 3) Game Mechanics

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [F] Canvas drawing | Drawer can draw lines; guessers see updates in real-time | Frontend drawing board integrated with socket events | nandreev |
| [B/F] Guess submission | Players submit guesses; server checks correctness | Server handles scoring and round completion | lde-taey, mrodenbu, nboer |
| [B] Core game loop | Round starts, drawer draws, guessers submit guesses, round ends | Deterministic, server-authoritative state transitions | mrodenbu, nboer, sgramsch |

### 4) Frontend & UI

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [F] Minimal UI layout | Canvas, player list, scoreboard, guess input | Tailwind-based responsive layout and reusable components | lde-taey, nandreev |
| [F] Real-time updates | Canvas strokes, scores, guesses updated live | WebSocket client event handling + UI state updates | lde-taey, nandreev |
| [F] Privacy Policy & Terms | Static pages accessible from navigation | Static legal/info pages integrated into navigation | lde-taey, nandreev |
| [F] Responsive design | Works on desktop and mobile | Mobile-first adjustments with Tailwind utility classes | lde-taey, nandreev |

### 5) Infrastructure / DevOps

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] Containerization | Backend, frontend, DB run in Docker / single command | `docker-compose.yml` + Makefile orchestration | mrodenbu, sgramsch |
| [B] Environment variables | Store secrets (`.env`), include example file (`.env.example`) | Centralized env usage across services | nboer, sgramsch |
| [B] HTTPS | Use HTTPS for backend endpoints | Self-signed certs accepted for dev; required for production | mrodenbu, nboer, sgramsch |

### 6) Real-Time Communication

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] WebSocket setup | Connect clients to server for real-time updates | Handles canvas, guesses, and player events | mrodenbu, nboer, nandreev |
| [B/F] Event handling | Drawer strokes, guess submissions, score updates | Server-authoritative events to prevent desync | mrodenbu, nboer, lde-taey, nandreev, sgramsch |

---

## Modules:

| Module | Points | Justification | Implementation | Worked on by |
| --- | --- | --- | --- | --- |
| Total | 11 / 14 | Selected modules maximize gameplay quality and technical depth while staying realistic for timeline and team size. | Mandatory modules were prioritized first; optional modules were evaluated and partially deferred. | Team |
| Use a framework for both the frontend and backend. | 2 | Frameworks improved maintainability, onboarding speed, and consistency across a multi-person codebase. | Backend built with NestJS module architecture (`auth`, `game`, `rooms`, `websocket`, `database`); frontend built with React + Vite + Tailwind component/layout structure. | nandreev |
| Implement real-time features using WebSockets or similar technology. | 2 | Real-time gameplay requires low-latency synchronization of drawing, guesses, scores, and player state. | Socket.IO channels/events connect frontend and backend; shared DTO/event typings synchronize payload contracts across both sides. | all |
| Use an ORM for the database. | 1 | ORM reduced boilerplate, improved schema traceability, and made migrations/versioning reliable for collaborative development. | Prisma schema + migrations manage PostgreSQL entities; backend services query via Prisma client through database/prisma modules. | sgramsch |
| Implement a complete web-based game where users can play against each other. | 2 | This is the core project requirement and demonstrates end-to-end full-stack integration. | Implemented full loop: authentication, room join, turn progression, drawing/guessing, scoring, round transitions, and post-game summary. | all |
| Remote players — Enable two players on separate computers to play the same game in real-time. | 2 | Real distributed play validates networked architecture beyond local-only testing. | Clients connect through backend WebSocket gateway; server-authoritative game state is broadcast to all connected players. | nandreev |
| Multiplayer game (more than two players). | 2 | Multi-user rounds are central to game design and module scoring requirements. | Room/member management and turn rotation support multiple concurrent players with synchronized scoreboard and event updates. | all |
|  |  |  |  |  |

---

## Individual Contributions:

### lde-taey:

- Project owner: created a visual game flow and user story on Figma, created a list of features for the MVP, tested the app with family and friends to gather feedback about the UI experience that helped improve screen clarity, usability, and overall game flow
- Frontend developer: focused on UI components, layout, lobby management, and event flow integration with backend (clock, scoreboard, guess updates in the chat)

### mrodenbu

- Backend developer

### nandreev:

- Tech lead
- Frontend developer

### nboer

- Backend developer
- DTOs

### sgramsch:

- Backend developer
- Database & Prisma


---

## Team Information

| Team member | Role | Responsibilities |
| --- | --- | --- |
| lde-taey, mrodenbu, nandreev, nboer, sgramsch | Developer | Implementation and feature development |
| lde-taey | Product Owner | Defines product vision, prioritizes features, considers user needs, evaluation organization |
| nandreev | Tech Lead | Technical direction, architecture decisions, implementation guidance |
| mrodenbu | Project Manager | Organization of the team, setting up meetings, time management |

---

## Project Management

### How the team organized the work
- Work was split into backend, frontend, database, and integration streams.
- Shared data contracts were synchronized across services.
- Responsibilities were distributed by role and tracked continuously through biweekly meetings (online and at school) and Slack conversations.

### Tools used for project management
- **GitHub**
	- Source control
	- Pull request and review workflow: we protected `main`, and every pull request was reviewed by another team member
	- Issue/task tracking
- **Notion**
	- Used to track the full project
    - Gathered information and resources
	- Task distribution overview
	- Research notes
 - **Figma**
	- Used in an early phase to create a user-flow visualization
 - **Canva**
	- Used to support layout design
	- Source for images and icons

### Challenges

- Setup complexity: We spent significant time on Docker setup, frontend dependencies, rebasing branches, learning how to use Git, and understanding school environment constraints vs. real-world usage.
- WebSocket integration: Coordinating WSS implementation across frontend and backend required dedicated research sprints, separate check-in calls, and careful assignment of ownership.
- Frontend/backend sync: it took us a while to sync both sides, agree on shared types, and clarify who owns which event/endpoint.
- Deadline pressure: the original deadline of 31.1.26 was missed, as well as the second deadline of 5.3.26. We set these deadlines to force ourselves to work efficiently but it was still surprising that the work took longer than expected
- Scope management: module selection required explicit effort/desirability trade-off analysis, with some features (e.g. full User Management) deprioritized due to complexity.
- React 18 development mode caused some logic (for example code triggered from `useEffect`) to run twice because `StrictMode` intentionally re-runs it to detect unsafe side effects. This initially broke parts of our game loop during local development, so we added proper cleanup and guard logic to prevent duplicate initialization while keeping production behavior unchanged.

---

## Resources
- 42 project subject and evaluation criteria
- NestJS documentation: https://docs.nestjs.com
- React documentation: https://react.dev
- Socket.IO documentation: https://socket.io/docs/v4
- Prisma documentation: https://www.prisma.io/docs
- Docker documentation: https://docs.docker.com

### AI Usage
AI tools were used in a supportive role for brainstorming, debugging hints, documentation polishing, and quick syntax checks. The project architecture, feature decisions, implementation choices, testing, and final validation were done by the team. AI was treated as an assistant to improve workflow efficiency, not as a replacement for individual understanding or ownership of the code.
