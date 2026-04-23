# DevPulse AI

DevPulse AI is a log analysis product that turns raw application logs, stack traces, and deployment failures into structured issue reports. It supports multi-issue detection, OpenAI-powered analysis, and a local fallback engine when no API key is configured.

## What is included

- Polished React dashboard for issue triage
- Express backend with OpenAI Responses API integration
- Rule-based fallback analyzer when OpenAI is unavailable
- Docker setup for frontend and backend
- Kubernetes manifests for frontend and backend deployments

## Local startup

### 1. Backend configuration

Create a backend env file:

```bash
cp backend/.env.example backend/.env
```

Set your OpenAI key in `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
```

If you do not add an API key, DevPulse still works with the local fallback analyzer.

### 2. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run the app

In one terminal:

```bash
npm run backend
```

In another terminal:

```bash
npm run frontend
```

Frontend: `http://localhost:3000`

Backend status: `http://localhost:5000/api/status`

## Docker

Run the full stack:

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

Pass environment variables from your shell before running Docker Compose if you want OpenAI enabled:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
```

## Kubernetes

Update the image names in `k8s/deployment.yaml`, then apply:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Optional secret for OpenAI:

```bash
kubectl create secret generic devpulse-secrets --from-literal=OPENAI_API_KEY=your_openai_api_key_here
```

## Environment variables

### Backend

- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `JSON_LIMIT`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

### Frontend

- `REACT_APP_API_BASE_URL`

This is optional for local development. The CRA dev server proxies `/api` to the backend automatically.

## Production notes

- The frontend container is built as static assets and served by Nginx
- Nginx proxies `/api` requests to the backend service
- The backend exposes readiness-friendly status metadata at `/api/status`
- When OpenAI is unavailable, the response includes a fallback reason so operators can see why AI inference was skipped
