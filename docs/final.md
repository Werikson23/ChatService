┌──────────────┐
│   Plugins    │
│ Auth / User  │
│ Billing      │
│ Notifications│
└──────┬───────┘
       │ Ports
┌──────▼───────┐
│    Kernel    │
│ CommandBus   │
│ EventBus     │
│ QueryBus     │
└──────┬───────┘
       │ Infra adapters
┌──────▼─────────────────────────────────────┐
│ Redis | Postgres | Logger | Metrics | HTTP  │
└──────┬─────────────────────────────────────┘
       │ Docker
┌──────▼─────────────────────────────────────┐
│ Redis | Redis Insight | Postgres | pgAdmin  │
│ Prometheus | Grafana                         │
└─────────────────────────────────────────────┘
