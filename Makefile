RESET =             \033[0m
BOLD =              \033[1m
GREEN =             \033[32m
YELLOW =            \033[33m
RED :=              \033[91m
DOCKER_COMPOSE_YML := ./docker-compose.yml
BACKEND_SHARED := ./requirements/backend/shared
FRONTEND_SHARED := ./requirements/frontend/shared

####RULES
all: sync-shared build up

sync-shared:
	@echo "$(GREEN)Syncing shared files: backend -> frontend$(RESET)"
	@mkdir -p $(FRONTEND_SHARED)
	@rm -rf $(FRONTEND_SHARED)/*
	@cp -a $(BACKEND_SHARED)/. $(FRONTEND_SHARED)/

build: sync-shared
	@echo "$(GREEN)Building Images with $(RESET)"
	@echo "$(DOCKER_COMPOSE_YML)"
	docker compose -f $(DOCKER_COMPOSE_YML) build --no-cache

up:
	@echo "$(GREEN)Starting containers in detached mode...$(RESET)"
	docker compose -f $(DOCKER_COMPOSE_YML) up -d

school: schoolclean build
	@echo "$(GREEN)Starting containers without detached mode...$(RESET)"
	docker compose -f $(DOCKER_COMPOSE_YML) up

clean:
	@echo "$(GREEN)Resetting database...$(RESET)"
	@docker compose -f $(DOCKER_COMPOSE_YML) exec backend npx prisma migrate reset --force 2>/dev/null || true
	@echo "$(GREEN)Stopping all running containers...$(RESET)"
	@docker compose -f $(DOCKER_COMPOSE_YML) down -v
	@echo "$(GREEN)Containers and volumes stopped.$(RESET)"

fclean: clean
	@echo "$(GREEN)Removing all images...$(RESET)"
	docker compose -f $(DOCKER_COMPOSE_YML) down --rmi all --volumes --remove-orphans
	@echo "$(GREEN)Full cleanup done.$(RESET)"

schoolclean: clean fclean
	docker system prune -af --volumes

home: sync-shared buildhome uphome

buildhome: sync-shared
	@echo "$(GREEN)Building Images with $(RESET)"
	@echo "$(DOCKER_COMPOSE_YML)"
	docker-compose -f $(DOCKER_COMPOSE_YML) build

uphome:
	@echo "$(GREEN)Starting containers in detached mode...$(RESET)"
	docker-compose -f $(DOCKER_COMPOSE_YML) up -d

cleanhome:
	@echo "$(GREEN)Stopping all running containers...$(RESET)"
	@docker-compose -f $(DOCKER_COMPOSE_YML) down
	@echo "$(GREEN)Containers stopped.$(RESET)"

fcleanhome: clean
	@echo "$(GREEN)Removing Docker volumes...$(RESET)"
	docker-compose -f $(DOCKER_COMPOSE_YML) down -v

rehome: fcleanhome home

re: fclean all

.PHONY: all sync-shared build up clean fclean schoolclean school re buildhome uphome cleanhome fcleanhome rehome