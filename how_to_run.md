

(check that you have a node_modules/ in ./requirements/backend

if not
cd ./requirements/backend
npm install

do NOT add node_modules to git.) -> this issue didn't show up at 42, just at home.

---
Run everything with make from ./transcendence

backend and frontend setup have been moved into docker. there is a dummy database process.
backend and frontend have their own folder in ./requirements with a Dockerfile each. 

Makefile: normal 42 required rules work at school (using docker compose).
the rules using docker-compose are named with the word 'home' added to the rule name. 

What should work now:
in ./transcendence terminal calling 'make' should build the images and start the containers in detached mode. 

'docker compose logs frontend' should show two sites (Local and Network). use Local to open the frontend UI. it should show a blueish page with dummy text. 

make clean 
should stop all containers, volumes and images persist

make fclean should stop all containers and delete volumes and images. 
