/backend
├── src
│   ├── main.ts                         # Ponto de entrada da aplicação
│   ├── bootstrap                       # Inicialização do sistema
│   │   ├── bootstrap.ts                # Inicializa kernel, plugins, infra, WebSocket
│   │   ├── pluginLoader.ts             # Carregamento dinâmico de plugins
│   │   └── validator.ts                # Validação de plugins
│   ├── kernel                          # Microkernel - núcleo da aplicação
│   │   ├── Kernel.ts                   # Núcleo central que orquestra plugins
│   │   ├── Plugin.ts                   # Contrato mínimo de plugin
│   │   ├── PluginManager.ts            # Gerencia ciclo de vida dos plugins
│   │   ├── PluginFactory.ts            # Fábrica de plugins
│   │   ├── IPlugin.ts                  # Interface genérica de plugins
│   │   ├── CommandBus.ts               # Orquestra comandos
│   │   ├── EventBus.ts                 # Orquestra eventos
│   │   ├── QueryBus.ts                 # Orquestra consultas
│   │   ├── types.ts                    # Tipos e contratos comuns
│   │   ├── lifecycle                   # Gerenciamento de ciclo de vida
│   │   │   ├── LifecycleManager.ts
│   │   │   ├── HealthCheck.ts
│   │   │   ├── GracefulShutdown.ts
│   │   │   ├── StartupTasks.ts
│   │   │   ├── EventHandler.ts
│   │   │   └── Metrics.ts
│   │   ├── ports                        # Interfaces principais do Kernel
│   │   │   ├── CommandBusPort.ts
│   │   │   ├── EventBusPort.ts
│   │   │   ├── QueryBusPort.ts
│   │   │   ├── LoggerPort.ts
│   │   │   ├── MetricsPort.ts
│   │   │   ├── HealthCheckPort.ts
│   │   │   └── RealtimePort.ts         # Novo port para Realtime
│   │   └── index.ts                     # Exporta componentes principais do kernel
│   ├── plugins                          # Microserviços internos (plugins)
│   │   ├── auth                          # Plugin de autenticação
│   │   │   ├── auth.plugin.ts
│   │   │   ├── plugin.manifest.ts
│   │   │   ├── plugin.ts
│   │   │   ├── pluginFactory.ts
│   │   │   ├── domain
│   │   │   │   ├── User.ts
│   │   │   │   └── AuthPolicy.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   ├── LoginUser.ts
│   │   │   │   │   ├── RegisterUser.ts
│   │   │   │   │   └── LogoutUser.ts
│   │   │   │   └── handlers
│   │   │   │       ├── LoginHandler.ts
│   │   │   │       ├── RegisterHandler.ts
│   │   │   │       └── LogoutHandler.ts
│   │   │   ├── ports
│   │   │   │   ├── UserRepository.ts
│   │   │   │   └── SessionStore.ts
│   │   │   └── adapters
│   │   │       └── http.ts
│   │   ├── ticket                        # Plugin de tickets
│   │   │   ├── ticket.plugin.ts
│   │   │   ├── plugin.manifest.ts
│   │   │   ├── plugin.ts
│   │   │   ├── pluginFactory.ts
│   │   │   ├── domain
│   │   │   │   ├── Ticket.ts
│   │   │   │   ├── TicketPriority.ts
│   │   │   │   └── TicketPolicy.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   ├── CreateTicket.ts
│   │   │   │   │   ├── AssignTicket.ts
│   │   │   │   │   ├── CloseTicket.ts
│   │   │   │   │   └── RetryTicket.ts
│   │   │   │   └── handlers
│   │   │   │       ├── CreateTicketHandler.ts
│   │   │   │       ├── AssignTicketHandler.ts
│   │   │   │       ├── CloseTicketHandler.ts
│   │   │   │       └── RetryTicketHandler.ts
│   │   │   ├── ports
│   │   │   │   ├── TicketRepository.ts
│   │   │   │   ├── TicketQueue.ts
│   │   │   │   └── TicketLock.ts
│   │   │   └── adapters
│   │   │       └── http.ts
│   │   ├── channel                        # Plugin de canais (WhatsApp, Telegram)
│   │   │   ├── domain
│   │   │   ├── application
│   │   │   ├── ports
│   │   │   └── adapters
│   │   └── integration                     # Integrações externas
│   │       ├── whatsapp
│   │       ├── telegram
│   │       ├── facebook
│   │       ├── email
│   │       └── iframe
│   ├── infra                             # Adaptadores concretos (infraestrutura)
│   │   ├── db
│   │   │   └── postgres
│   │   │       ├── prismaClient.ts
│   │   │       └── repositories
│   │   │           ├── UserRepository.pg.ts
│   │   │           ├── TicketRepository.pg.ts
│   │   │           └── MessageRepository.pg.ts
│   │   ├── cache
│   │   │   └── redis
│   │   │       ├── redisClient.ts
│   │   │       ├── RedisCache.ts
│   │   │       ├── RedisSession.ts
│   │   │       ├── RedisCounters.ts
│   │   │       ├── RedisGeo.ts
│   │   │       ├── RedisLocks.ts
│   │   │       └── RedisScripts.ts
│   │   ├── queue
│   │   │   └── redisStreams
│   │   │       ├── StreamManager.ts
│   │   │       ├── TicketStream.ts
│   │   │       ├── MessageStream.ts
│   │   │       ├── RetryManager.ts
│   │   │       ├── DelayScheduler.ts
│   │   │       └── DeadLetterQueue.ts
│   │   ├── eventBus
│   │   │   └── redisStreams
│   │   │       └── RedisEventBus.ts
│   │   ├── http
│   │   │   └── fastify
│   │   │       ├── server.ts
│   │   │       ├── routes.ts
│   │   │       └── middlewares
│   │   ├── realtime                       # NOVO: infraestrutura Realtime
│   │   │   ├── websocket
│   │   │   │   ├── WebSocketServer.ts
│   │   │   │   ├── WebSocketManager.ts
│   │   │   │   ├── WebSocketEvents.ts
│   │   │   │   └── adapters
│   │   │   │       ├── SocketIOAdapter.ts
│   │   │   │       └── WSAdapter.ts
│   │   │   ├── pubsub
│   │   │   │   ├── RealtimeEventBus.ts
│   │   │   │   ├── RedisPubSub.ts
│   │   │   │   └── NatsPubSub.ts
│   │   │   └── types.ts
│   │   └── observability
│   │       ├── logger.ts
│   │       ├── metrics.ts
│   │       └── tracing.ts
│   ├── api                               # API Gateway (interface externa)
│   │   ├── http.ts
│   │   ├── routes.ts
│   │   └── middlewares
│   └── config
│       ├── env
│       │   ├── local.env.ts
│       │   ├── dev.env.ts
│       │   ├── staging.env.ts
│       │   └── prod.env.ts
│       ├── featureFlags.ts
│       └── serviceLimits.ts
├── Dockerfile
├── docker-compose.yml
└── .env
