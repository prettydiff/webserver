
// cspell: disable

const demo_containers:store_compose = {
"8a87c3aee5b91f56f05814fd2f1dbd29f47900db590d4e7989c7fe12860b76bb":{"compose":`services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    # For DHCP it is recommended to remove these ports and instead add: network_mode: "host"
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "9001:80/tcp"
    environment:
      TZ: $\{TZ\}
      WEBPASSWORD: $\{PASSWORD\}
      # CORS_HOSTS: "dns.x"
      # DNSMASQ_USER: root
    healthcheck:
      disable: true
    # Volumes store your data between container upgrades
    volumes:
      - /path/pihole:/etc/pihole
      # - /path/pihole/lighttpd:/etc/lighttpd
      - /path/pihole/dnsmasq.d:/etc/dnsmasq.d
    #   https://github.com/pi-hole/docker-pi-hole#note-on-capabilities
    # cap_add:
    #   - NET_ADMIN # Required if you are using Pi-hole as your DHCP server, else not needed
    restart: unless-stopped`,"created":1784889453000,"description":"Pi-hole in a docker container","id":"8a87c3aee5b91f56f05814fd2f1dbd29f47900db590d4e7989c7fe12860b76bb","image":"pihole/pihole:latest","license":"NOASSERTION","name":"pihole","location":"/path/pihole.yml","ports":[[53,"tcp"],[9001,"tcp"],[53,"udp"],[67,"udp"]],"state":"running","status":"Up 10 days","version":"2024.07.0"},


"ee1f60718959b7bf5f9f2386949f4d875e082b3ca0b87998383ffc5af6e59331":{"compose":`services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    #image: jellyfin/jellyfin:latest
    container_name: jellyfin
    #network_mode: "service:tailscale"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=$\{TZ\}
    volumes:
      - /path/jellyfin:/config
      - /path/audiobooks:/data/audiobooks
      - /path/books:/data/books
      - /path/documentary:/data/documentary
      - /path/music:/data/music
      - /path/movies:/data/movies
      - /path/television:/data/television
    ports:
      - 8096:8096
      - 8920:8920 #optional
      - 7359:7359/udp #optional
      - 1900:1900/udp #optionai
    restart: unless-stopped`,"created":1787409126000,"description":"[Jellyfin](https://github.com/jellyfin/jellyfin) is a Free Software Media System that puts you in control of managing and streaming your media. It is an alternative to the proprietary Emby and Plex, to provide media from a dedicated server to end-user devices via multiple apps. Jellyfin is descended from Emby's 3.5.2 release and ported to the .NET Core framework to enable full cross-platform support. There are no strings attached, no premium licenses or features, and no hidden agendas: just a team who want to build something better and work together to achieve it.","id":"ee1f60718959b7bf5f9f2386949f4d875e082b3ca0b87998383ffc5af6e59331","image":"lscr.io/linuxserver/jellyfin:latest","license":"GPL-3.0-only","name":"jellyfin","location":"/path/jellyfin.yml",
    "ports":[[8096,"tcp"],[8920,"tcp"],[7359,"udp"],[1900,"udp"]],"state":"running","status":"Up 10 days","version":"10.10.3ubu2404-ls45"},


"6171d542a37bca3c68af9c75e8e26b28deddfe29b51b794ab77b90752cd48616":{"compose":`services:
  metube:
    image: ghcr.io/alexta69/metube
    container_name: metube
    restart: unless-stopped
    ports:
      - "8081:8081"
    volumes:
      - /path/video:/downloads`,"created":1788007018000,"description":"","id":"6171d542a37bca3c68af9c75e8e26b28deddfe29b51b794ab77b90752cd48616","image":"ghcr.io/alexta69/metube","license":"","name":"metube","location":"/path/metube.yml","ports":[[8081,"tcp"]],"state":"running","status":"Up 3 days (healthy)","version":""},


"b8fe8d5600aea9a151a4f4bee739ca4a4252f7f875ca79b5d95b9daea084f81e":{"compose":`services:
  baikal:
    image: ckulka/baikal:latest
    container_name: baikal_calendar
    ports:
      - "3080:80"
    volumes:
      - /path/baikal:/var/www/baikal/Specific
    restart: unless-stopped

volumes:
  baikal_data:`,"created":1784746545000,"description":"Ready-to-go Baikal server","id":"b8fe8d5600aea9a151a4f4bee739ca4a4252f7f875ca79b5d95b9daea084f81e","image":"ckulka/baikal:latest","license":"MIT","name":"baikal_calendar","location":"/path/baikal:.yml","ports":[[443,"tcp"],[3080,"tcp"]],"state":"running","status":"Up 10 days","version":"0.10.1"},


"b6293dfda0f615ca0b431195711a485ef0ca9965b6cd5edec0290776f139d8b5":{"compose":`services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    restart: unless-stopped
    ports:
      - "5230:5230"
    volumes:
      - /path/memos:/var/opt/memos
    environment:
      MEMOS_PORT: 5230
      MEMOS_DRIVER: sqlite
      MEMOS_INSTANCE_URL: http://server:3011
`,"created":1780539821000,"description":"","id":"b6293dfda0f615ca0b431195711a485ef0ca9965b6cd5edec0290776f139d8b5","image":"neosmemo/memos:stable","license":"","name":"memos","location":"/path/memos.yml","ports":[[5230,"tcp"]],"state":"running","status":"Up 10 days","version":""},


"10ac9dd043a77ffb515c0862db0d8a2772734a231c3ce7318c10834149242f7c":{"compose":`services:
  mealie:
    container_name: mealie
    image: hkotel/mealie
    build:
      context: ../
      target: production
      dockerfile: ./docker/Dockerfile
    healthcheck:
      disable: true
    restart: always
    volumes:
      - /path/mealie:/app/data/
    ports:
      - 9000:9000
    labels:
      - "docktail.service.enable=true"
      - "docktail.service.name=mealie"
      - "docktail.service.port=9000"
    environment:
      ALLOW_SIGNUP: "false"
      LOG_LEVEL: "DEBUG"
      PGID: 1000
      PUID: 1000

      DB_ENGINE: sqlite # Optional: 'sqlite', 'postgres'
      # =====================================
      # Postgres Config
      POSTGRES_USER: asdf
      POSTGRES_PASSWORD: 1234
      POSTGRES_SERVER: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: mealie

      # =====================================
      # Email Configuration
      # SMTP_HOST=
      # SMTP_PORT=587
      # SMTP_FROM_NAME=Mealie
      # SMTP_AUTH_STRATEGY=TLS # Options: 'TLS', 'SSL', 'NONE'
      # SMTP_FROM_EMAIL=
      # SMTP_USER=
      # SMTP_PASSWORD=

volumes:
  mealie-data:
    driver: local`,"created":1779750454000,"description":"","id":"10ac9dd043a77ffb515c0862db0d8a2772734a231c3ce7318c10834149242f7c","image":"hkotel/mealie","license":"","name":"mealie","location":"/path/mealie.yml","ports":[[9000,"tcp"]],"state":"running","status":"Up 10 days","version":""},


"c21a1253fc82a159bbab754ddc8d33fc26e9d20cc1d65421b3f0194f1d87d7ae":{"compose":`services:
  gamevault-backend:
    container_name: gamevault
    image: phalcode/gamevault-backend:latest
    restart: unless-stopped
    environment:
      DB_HOST: gamevault-db
      DB_USERNAME: asdfasdf
      DB_PASSWORD: 12341234
      SERVER_ADMIN_USERNAME: asdf
      SERVER_ADMIN_PASSWORD: 1234
      METADATA_IGDB_ENABLED: true
      METADATA_IGDB_CLIENT_ID: 123456789
      METADATA_IGDB_CLIENT_SECRET: asdfqwerasdf
    volumes:
      # Mount the folder where your games are
      - /path/games/Windows:/files
      # Mount the folder where GameVault should store its media
      - /path/gamevault/media:/media
    ports:
      - 8888:8080/tcp
  gamevault-db:
    image: postgres:17
    container_name: gamevault_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: asdf
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: gamevault
    volumes:
      # Mount the folder where your PostgreSQL database files should land
      - /path/gamevault/db:/var/lib/postgresql/data`,"created":1782572413000,"description":"","id":"c21a1253fc82a159bbab754ddc8d33fc26e9d20cc1d65421b3f0194f1d87d7ae","image":"postgres:17","license":"","name":"gamevault_db","location":"/path/gamevault.yml","ports":[[5432,"tcp"]],"state":"running","status":"Up 10 days","version":""},


"58a8746eb140526c6f772d56ceb46e4ab333f3502a21c8d39f46599cb2168173":{"compose":`services:
  gamevault-backend:
    container_name: gamevault
    image: phalcode/gamevault-backend:latest
    restart: unless-stopped
    environment:
      DB_HOST: gamevault-db
      DB_USERNAME: asdfasdf
      DB_PASSWORD: 12341234
      SERVER_ADMIN_USERNAME: asdf
      SERVER_ADMIN_PASSWORD: 1234
      METADATA_IGDB_ENABLED: true
      METADATA_IGDB_CLIENT_ID: 123456789
      METADATA_IGDB_CLIENT_SECRET: asdfqwerasdf
    volumes:
      # Mount the folder where your games are
      - /path/games/Windows:/files
      # Mount the folder where GameVault should store its media
      - /path/gamevault/media:/media
    ports:
      - 8888:8080/tcp
  gamevault-db:
    image: postgres:17
    container_name: gamevault_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: asdf
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: gamevault
    volumes:
      # Mount the folder where your PostgreSQL database files should land
      - /path/gamevault/db:/var/lib/postgresql/data`,"created":1782572413000,"description":"","id":"58a8746eb140526c6f772d56ceb46e4ab333f3502a21c8d39f46599cb2168173","image":"phalcode/gamevault-backend:latest","license":"","name":"gamevault","location":"/path/gamevault.yml","ports":[[8888,"tcp"],[8443,"tcp"]],"state":"running","status":"Up 10 days (healthy)","version":""},


"/path/yubal.yml":{"compose":`services:
  yubal:
    image: ghcr.io/guillevc/yubal:latest
    container_name: yubal
    user: 1000:1000
    ports:
      - 8000:8000
    environment:
      YUBAL_SCHEDULER_CRON: "0 0 * * *"
      YUBAL_DOWNLOAD_UGC: false
      YUBAL_TZ: UTC
      YUBAL_AUDIO_FORMAT: mp3
      YUBAL_AUDIO_QUALITY: 0
      YUBAL_SCHEDULER_ENABLED: false
      YUBAL_FETCH_LYRICS: false
    volumes:
      - /path/yubal/data:/app/data
      - /path/yubal/config:/app/config
    restart: unless-stopped`,"created":0,"description":"","id":"/path/yubal.yml","image":"","location":"/path/yubal.yml","license":"","name":"yubal","ports":[],"state":"dead","status":"","version":""},


"/path/tamari.yml":{"compose":`services:
  tamari:
    container_name: tamari
    image: alexbates/tamari:0.7
    restart: unless-stopped
    ports:
      - "4888:4888"
    volumes:
      - /path/tamari:/app/appdata`,"created":0,"description":"","id":"/path/tamari.yml","image":"","location":"/path/tamari.yml","license":"","name":"tamari","ports":[],"state":"dead","status":"","version":""},


"/path/photoprism.yml":{"compose":`services:
  photoprism:
    image: photoprism/photoprism:latest
    container_name: photoprism
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=$\{TZ\}
    restart: unless-stopped
    volumes:
      - ./path/photos:/photoprism/originals
      - ./path:/photoprism/storage
    ports:
      - 2342:2342`,"created":0,"description":"","id":"/path/photoprism.yml","image":"","location":"/path/photoprism.yml","license":"","name":"photoprism","ports":[],"state":"dead","status":"","version":""},


"/path/romm.yml":{"compose":`volumes:
  mysql_data:
  romm_resources:
  romm_redis_data:

services:
  romm:
    image: rommapp/romm:latest
    container_name: romm
    restart: unless-stopped
    environment:
      - DB_HOST=romm-db
      - DB_NAME=romm # Should match MYSQL_DATABASE in mariadb
      - DB_USER=asdf # Should match MYSQL_USER in mariadb
      - DB_PASSWD=1234 # Should match MYSQL_PASSWORD in mariadb
      - IGDB_CLIENT_ID=asdfasdfasdf # Generate an ID and SECRET in IGDB
      - IGDB_CLIENT_SECRET=Bearer asdfasdfasdf # https://api-docs.igdb.com/#account-creation
      - MOBYGAMES_API_KEY=masdfasdfasdf # https://www.mobygames.com/info/api/
      - ROMM_AUTH_SECRET_KEY=asdfasdfasdf # Generate a key with 'openssl rand -hex 32'
      - ROMM_AUTH_USERNAME=asdf
      - ROMM_AUTH_PASSWORD=1234 # default: admin
    volumes:
      - /path/romm/resources:/romm/resources # Resources fetched from IGDB (covers, screenshots, etc.)
      - /path/romm/redis:/redis-data # Cached data for background tasks
      - /path/emulation:/romm/library # Your game library
      - /path/romm/assets:/romm/assets # Uploaded saves, states, etc.
      #- /path/romm/config:/romm/config # Path where config.yml is stored
    ports:
      - 8050:8080
    depends_on:
      - romm-db

  romm-db:
    image: mariadb:latest
    container_name: romm-db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=1234x # Use a unique, secure password
      - MYSQL_DATABASE=romm
      - MYSQL_USER=asdf
      - MYSQL_PASSWORD=12341234
    volumes:
      - mysql_data:/var/lib/mysql`,"created":0,"description":"","id":"/path/romm.yml","image":"","location":"/path/romm.yml","license":"","name":"romm","ports":[],"state":"dead","status":"","version":""},


"/path/nexterm.yml":{"compose":`services:
  nexterm:
    image: nexterm/aio:latest
    container_name: nexterm
    ports:
      - "6989:6989"
      - "5900:5900"
    restart: always
    environment:
      - ENCRYPTION_KEY=asdfasdfasdf
    volumes:
      - /path/nexterm:/app/data`,"created":0,"description":"","id":"/path/nexterm.yml","image":"","location":"/path/nexterm.yml","license":"","name":"nexterm","ports":[],"state":"dead","status":"","version":""},


"/path/open_web_calendar:.yaml":{"compose":`services:
  open-web-calendar:
    image: niccokunzmann/open-web-calendar:latest
    container_name: web_calendar
    ports:
      - "19999:80"
    restart: unless-stopped`,"created":0,"description":"","id":"/path/open_web_calendar:.yaml","image":"","location":"/path/open_web_calendar:.yaml","license":"","name":"open_web_calendar:","ports":[],"state":"dead","status":"","version":""},


"/path/joplin.yml":{"compose":`services:
  open-web-calendar:
    image: niccokunzmann/open-web-calendar:latest
    container_name: web_calendar
    ports:
      - "9080:80"
    restart: unless-stopped@server:~/webserver$ cat compose/joplin.yml
services:
  db:
    image: postgres:16
    volumes:
      - /path/joplin/db:/var/lib/postgresql/data
    networks:
      - joplindb
    # ports:
      #  - "4444:5432"
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=joplin
  app:
    image: joplin/server:latest
    depends_on:
      - db
    ports:
      - "22300:22300"
    restart: unless-stopped
    environment:
      - APP_PORT=22300
      - APP_BASE_URL=http://server:22300
      - DB_CLIENT=pg
      - POSTGRES_PASSWORD=1234
      - POSTGRES_DATABASE=asdf
      - POSTGRES_USER=postgres
      - POSTGRES_PORT=3333
      - POSTGRES_HOST=db
      - MAILER_ENABLED=0
      - MAILER_HOST=smtp.bluehost.com
      - MAILER_PORT=0
      - MAILER_SECURE=1
      - MAILER_AUTH_USER=email@example.com
      - MAILER_AUTH_PASSWORD=na
      - MAILER_NOREPLY_NAME=Joplin
      - MAILER_NOREPLY_EMAIL=email@example.com
    networks:
      - joplindb

networks:
  joplindb:
    driver: bridge
`,"created":0,"description":"","id":"/path/joplin.yml","image":"","location":"/path/joplin.yml","license":"","name":"joplin","ports":[],"state":"dead","status":"","version":""},


"/path/docktail.yml":{"compose":`services:
  docktail:
    image: ghcr.io/marvinvr/docktail:latest
    restart: unless-stopped
    volumes:
      - /path/docktail:/var/run/docker.sock:ro
      - /var/run/tailscale:/var/run/tailscale
    environment:
      - TAILSCALE_OAUTH_CLIENT_ID=$\{TAILSCALE_OAUTH_CLIENT\}
      - TAILSCALE_OAUTH_CLIENT_SECRET=$\{TAILSCALE_OAUTH_SECRET\}
      - TAILSCALE_API_KEY=$\{TAILSCALE_KEY\}`,"created":0,"description":"","id":"/path/docktail.yml","image":"","location":"/path/docktail.yml","license":"","name":"docktail","ports":[],"state":"dead","status":"","version":""},
"/path/agendav.yml":{"compose":`services:
  agendav:
    image: ghcr.io/nagimov/agendav-docker:latest
    container_name: agendav
    restart: unless-stopped
    ports:
      - "33080:8080"
    environment:
      # The base URL or IP of this AgenDAV frontend container
      - AGENDAV_SERVER_NAME=127.0.0.1

      # Visual customization
      - AGENDAV_TITLE=Cheney Home
      - AGENDAV_FOOTER=http://127.0.0.1:33080

      # REQUIRED: URL pointing to your actual CalDAV server backend
      - AGENDAV_CALDAV_SERVER=http://127.0.0.1:33080/dav.php
      - AGENDAV_CALDAV_PUBLIC_URL=http://127.0.0.1:33081

      # Localization settings
      - AGENDAV_TIMEZONE=America/Chicago
      - AGENDAV_LANG=en
      - AGENDAV_WEEKSTART=0 # 0 for Sunday, 1 for Monday
      - AGENDAV_LOG_DIR=/tmp/`,"created":0,"description":"","id":"/path/agendav.yml","image":"","location":"/path/agendav.yml","license":"","name":"agendav","ports":[],"state":"dead","status":"","version":""}};

export default demo_containers;