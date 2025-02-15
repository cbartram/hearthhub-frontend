FROM python:3.11-slim

WORKDIR /app

COPY server.py .

COPY dist/ /app/static/
RUN chmod -R 755 /app/static

EXPOSE 8080

CMD ["python", "server.py"]