import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    session: {
      store: "redis",
      redisConfig: {
        url: process.env.REDIS_URL,
      },
      maxAge: 3600 * 1000,
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    }
  },

  // 新增：插件配置
  plugins: [
    // 1. Stripe支付插件
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
    
    // 2. SendGrid邮件插件
    {
      resolve: "medusa-plugin-sendgrid",
      options: {
        api_key: process.env.SENDGRID_API_KEY,
        from: process.env.SENDGRID_FROM,
        order_placed_template: process.env.SENDGRID_ORDER_PLACED_TEMPLATE,
        // 可选：其他邮件模板
        user_password_reset_template: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE,
        customer_created_template: process.env.SENDGRID_CUSTOMER_CREATED_TEMPLATE,
      },
    },
    
    // 3. Algolia搜索插件
    {
      resolve: "medusa-plugin-algolia",
      options: {
        application_id: process.env.ALGOLIA_APP_ID,
        admin_api_key: process.env.ALGOLIA_ADMIN_API_KEY,
        index_name_prefix: process.env.ALGOLIA_INDEX_NAME_PREFIX,
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: [
                'title',
                'description', 
                'variant_sku',
                'collection_title',
                'categories.name'
              ],
              attributesToRetrieve: [
                'id',
                'title', 
                'description',
                'handle', 
                'thumbnail',
                'images',
                'variants',
                'collection',
                'collection_id',
                'categories'
              ],
            },
          },
        },
      },
    },
    
    // 4. R2文件存储插件
    {
      resolve: "medusa-file-r2",
      options: {
        account_id: process.env.R2_ACCOUNT_ID,
        access_key_id: process.env.R2_ACCESS_KEY_ID,
        secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
        bucket_name: process.env.R2_BUCKET,
        public_domain: process.env.R2_PUBLIC_URL,
      },
    },
  ],

  // 可选：功能模块配置
  modules: {
    // 这里可以配置Medusa模块（如果需要）
  }
})
