FROM python:3.11-slim AS builder
WORKDIR /build
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS production
WORKDIR /app/backend
RUN addgroup --system app && adduser --system --group app
COPY --from=builder /root/.local /home/app/.local
COPY backend ./
# CLOUD-ONLY SWAP: Replace the massive model with the 8MB cloud version if it exists
RUN if [ -f "models/price_forecast_model_cloud.pkl" ]; then cp models/price_forecast_model_cloud.pkl models/price_forecast_model.pkl; fi
RUN chown -R app:app /app
USER app
ENV PATH=/home/app/.local/bin:$PATH
ENV PORT=8000
ENV PYTHONPATH=/app/backend
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
