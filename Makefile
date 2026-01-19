RESET =				\033[0m
BOLD =				\033[1m
GREEN =				\033[32m
YELLOW =			\033[33m
RED :=				\033[91m

DOCKER_COMPOSE_YML := ./docker-compose.yml

####RULES
all: build up

build:
	@echo "$(GREEN)Building Images with $(RESET)"
	@echo "$(DOCKER_COMPOSE_YML)"
	docker compose -f $(DOCKER_COMPOSE_YML) build

up:
	@echo "$(GREEN)Starting containres in detached mode...$(RESET)"
	docker compose -f $(DOCKER_COMPOSE_YML) up -d

clean:
	@echo "$(GREEN)Stopping all running containers...$(RESET)"
	@docker compose -f $(DOCKER_COMPOSE_YML) down
	@echo "$(GREEN)Containers stopped.$(RESET)"

fclean: clean
	@echo "$(GREEN)Removing Docker volumes...$(RESET)"
	docker compose -f $(DOCKER_COMPOSE_YML) down -v
	@echo "$(GREEN)Removing all images$(RESET)"
	docker system prune -af
	@echo "$(GREEN)Full cleanup done.$(RESET)"


home: buildhome uphome

buildhome:
	@echo "$(GREEN)Building Images with $(RESET)"
	@echo "$(DOCKER_COMPOSE_YML)"
	docker-compose -f $(DOCKER_COMPOSE_YML) build

uphome:
	@echo "$(GREEN)Starting containres in detached mode...$(RESET)"
	docker-compose -f $(DOCKER_COMPOSE_YML) up -d

cleanhome:
	@echo "$(GREEN)Stopping all running containers...$(RESET)"
	@docker-compose -f $(DOCKER_COMPOSE_YML) down
	@echo "$(GREEN)Containers stopped.$(RESET)"

fcleanhome: clean
	@echo "$(GREEN)Removing Docker volumes...$(RESET)"
	docker-compose -f $(DOCKER_COMPOSE_YML) down -v
	@echo "$(GREEN)Removing all images$(RESET)"
	docker system prune -af
	@echo "$(GREEN)Full cleanup done.$(RESET)"

#prune -af might be a bad idea outside of a VM...

rehome: fcleanhome home

re: fclean all

.PHONY: all build up clean fclean re buildhome build uphome cleanhome fcleanhome rehome
