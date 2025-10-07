ifneq (,$(wildcard .env))
    include .env
    export
endif

start:
	fastapi dev main.py --port $(FASTAPI_PORT)
