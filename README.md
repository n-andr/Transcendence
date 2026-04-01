# ft_transcendence

## Description
`ft_transcendence` is a full-stack web application built as part of the 42 curriculum.  
The project combines real-time multiplayer gameplay with modern web technologies and a containerized development workflow.

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

---

## Database Scheme

---

## Features List
- Real-time multiplayer room flow
- Turn-based game logic with drawer/guesser roles
- WebSocket event handling for game state updates
- Authentication module and user/session handling
- Round/turn result handling and post-game summary flow

---

## Modules:

| Module | Points | Justification | Implementation | Worked on by |
| --- | --- | --- | --- | --- |
| total | 11 / 14 | - | - | -Maybe just use who could respond to the questions the best |
| Use a framework for both the frontend and backend. | 2 |  | Backend: NestJS Frontend: Tailwind |  |
|  Implement real-time features using WebSockets or similar technology. | 2 | Real time updates on the game progress (drawing, scores …) |  | all |
| Use an ORM for the database. | 1 |  | Prisma | sgramsch |
| Implement a complete web-based game where users can play against eachother. | 2 |  |  | all |
| Remote players — Enable two players on separate computers to play the same game in real-time. | 2 |  |  | all |
| Multiplayer game (more than two players). | 2 |  |  | all |
|  |  |  |  |  |
| OPTIONAL |  |  |  |  |
| Support for multiple languages (at least 3 languages). | 1 |  |  |  |
| Support for additional browsers. | 1 |  |  |  |
|  Game customization options | 1 |  |  |  |

## Individual Contributions:

### lde-taey:

- Project owner
- Frontend developer

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

## Team Information

| Team member | Role | Responsibilities |
| --- | --- | --- |
| mrodenbu, nboer | Developer | Implementation and feature development |
| sgramsch | Project Manager | Organize the team’s work, plan and moderate team meetings, maintain task board, documentation, balance ideas with time and effort constraints |
| lde-taey | Project Owner | Defines product vision, prioritizes features, considers user needs, evaluation organization |
| nandreev | Tech Lead | Technical direction, architecture decisions, implementation guidance |

---

## Project Management

### How the team organized the work
- Work was split into backend, frontend, and integration streams.
- Shared data contracts were synchronized across services.
- Responsibilities were distributed by role and tracked continuously.

### Tools used for project management
- **GitHub**
	- Source control
	- Pull requests and review workflow
	- Issue/task tracking
- **Notion**
	- Gathered information and resources
	- Task distribution overview
	- General notes

---

## Resources
- 42 project subject and evaluation criteria
- NestJS documentation: https://docs.nestjs.com
- React documentation: https://react.dev
- Socket.IO documentation: https://socket.io/docs/v4
- Prisma documentation: https://www.prisma.io/docs
- Docker documentation: https://docs.docker.com
