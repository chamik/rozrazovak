
# Local docker build

Because building the container on my VPS takes forever and makes it extremely laggy, you can build the container locally and then scp it to your server:

```sh
docker save -o rozrazovak.tar rozrazovak:latest
scp rozrazovak.tar <server>:<a path>
```

Then on your server:
```sh
docker compose down
docker load -i rozrazovak.tar
docker system prune -f
docker compose up -d
```
