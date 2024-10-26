FROM python:3.9-slim-buster
LABEL maintainer="Arvind .A"

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY . /tbyw
WORKDIR /tbyw

# install curl and nodejs
RUN apt-get update  && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    echo "nodejs version: $(node -v)" && \
    echo "npm version: $(npm -v)" && \
    npm run bootstrap && \
    npm run production && \
    npm cache clean --force

# Install python dependencies
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install pip --upgrade && \
    /opt/venv/bin/pip install -r requirements.txt && \
    chmod +x /tbyw/scripts/entrypoint.sh && \
    mkdir -p /tbyw/staticfiles_build/static

# Uninstall nodejs and npm and remove cache
RUN apt-get purge -y nodejs && \
    apt-get purge -y curl && \
    apt-get autoremove -y && \
    apt-get autoclean -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /root/.npm && \
    rm -rf /root/.cache && \
    rm -rf /tbyw/node_modules && \
    rm -rf /tbyw/.npm && \
    rm -rf /tbyw/apps/chatjs

CMD ["/tbyw/scripts/entrypoint.sh"]