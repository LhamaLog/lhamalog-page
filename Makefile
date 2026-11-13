IMAGE := lhamalog-page

.PHONY: install run build docker

install:
	npm install

run:
	docker compose up --build

build:
	docker build -t $(IMAGE) .

docker: build
