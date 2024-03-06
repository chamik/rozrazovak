# Rozřazovák

Středoškolská odborná činnost - rozřazovací testy pro výuku anglického jazyka.

Sepsanou práci najdeš [zde](https://github.com/chamik/soc).

## Cože?

Každý rok se u nás na škole provádějí rozřazovací testy do skupin na angličtinu.
Dělaly se v příšerně starém webovém programu co fungoval jen silou vůle. Nakonec 
ani to ne, poslední rok jsme skončili u papírových testů.

Prostě mě to nebavilo, tak jsem to udělal líp.

## Deploy (výsadek?)

1. Stáhni si repozitář 
```
git clone https://github.com/chamik/rozrazovak.git
cd rozrazovak
```

2. Vyplň `.env` (inspiruj se podle `.env-example`)
```
vim .env    # ano, musíš použít vim
```

3. Sestav docker container (nebo viz [build.md](https://github.com/chamik/rozrazovak/blob/main/BUILD.md))
```
docker build -t rozrazovak .
```

4. Spusť s docker compose
```
docker compose up -d
```

Jestli všechno dobře dopadne, na databázi sama proběhne migrace a server se spustí
na portu `9001` (podle nastavení v `.env`). Pokud to chceš dostat na internet, použij
třeba `caddy`. Zde je úryvek z `Caddyfile`.

```
rozrazovak.gjp-me.cz {
    reverse_proxy :9001
}
```

Pokud se chceš na něco zeptat, [napiš mi](https://chamik.eu/contact.cs).
