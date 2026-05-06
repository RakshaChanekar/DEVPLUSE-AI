# DevPulse AI

DevPulse AI is a reliability operations product that turns raw application logs, stack traces, and deployment failures into structured issue reports. It now includes real-time monitoring, an AI-backed scoring system, and predictive failure detection alongside the existing multi-issue log analyzer.

## What is included

- Polished React dashboard for issue triage
- Express backend with Google AI Studio Gemini integration
- Rule-based fallback analyzer when Google AI Studio is unavailable
- Real-time monitoring snapshot and event stream endpoints
- AI-enriched operational scorecard for stability and failure probability
- Predictive failure detection for saturation, restart, and dependency risks
- Docker setup for frontend and backend
- Kubernetes manifests for frontend and backend deployments

## Local startup

### 1. Backend configuration

Create a backend env file:

```bash
cp backend/.env.example backend/.env
```

Set your Google AI Studio key in `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
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

Monitoring snapshot: `http://localhost:5000/api/monitoring/snapshot`

Monitoring stream: `http://localhost:5000/api/monitoring/stream`

## Docker

Run the full stack:

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

Pass environment variables from your shell before running Docker Compose if you want Google AI Studio enabled:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

## Kubernetes

Update the image names in `k8s/deployment.yaml`, then apply:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Optional secret for Google AI Studio:

```bash
kubectl create secret generic devpulse-secrets --from-literal=GEMINI_API_KEY=your_gemini_api_key_here
```

## Environment variables

### Backend

- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `JSON_LIMIT`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `MONITORING_STREAM_INTERVAL_MS`

### Frontend

- `REACT_APP_API_BASE_URL`

This is optional for local development. The CRA dev server proxies `/api` to the backend automatically.

## Production notes

- The frontend container is built as static assets and served by Nginx
- Nginx proxies `/api` requests to the backend service
- Nginx disables proxy buffering for `/api` so the monitoring SSE stream stays real time
- The backend exposes readiness-friendly status metadata at `/api/status`
- When Google AI Studio is unavailable, the response includes a fallback reason so operators can see why AI inference was skipped

## API additions

- `GET /api/monitoring/snapshot` returns the latest monitoring snapshot, scorecard, and predictions
- `GET /api/monitoring/stream` streams live monitoring updates over Server-Sent Events
- `POST /api/score` evaluates the current payload and returns the operational scorecard
- `POST /api/predict` returns score plus predicted failure scenarios
- `POST /api/insights` returns issue analysis, monitoring context, scorecard, and predictions in one response

  ## Articture diagram
  <img width="1058" height="700" alt="image" src="https://github.com/user-attachments/assets/8bad85cf-6046-426c-9cb0-6cbe0b9a1faa" />
  ## Project Link
  https://jumpshare.com/s/mFstdas8S8DaxRpkWCrA

