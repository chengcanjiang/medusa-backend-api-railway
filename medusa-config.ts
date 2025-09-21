import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // 1. 新增：显式声明 Redis 地址（读取环境变量 REDIS_URL）
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // 2. 新增：会话存储配置，指定使用 Redis（覆盖默认内存存储）
    session: {
      store: "redis", // 存储驱动为 Redis
      redisConfig: {
        url: process.env.REDIS_URL, // 引用 Redis 地址（与上方一致）
      },
      maxAge: 3600 * 1000, // 会话有效期 1 小时（单位：毫秒，与 .env 中 SESSION_MAX_AGE 对应）
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    }
  }
})
