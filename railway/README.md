# Railway 部署清单（Teleman）

仓库：https://github.com/heitao101/hometile  
目标：美国线路电话营销 SaaS。先跑通后台和单呼，再开群呼。

必须拆成 **4 个服务**（同一份 GitHub 代码）：

1. **MySQL** — 数据库  
2. **App** — 网站（唯一需要公网域名）  
3. **Worker** — 队列（群呼 / 导入 / 扣费）  
4. **Cron** — 定时任务（预约活动 / 月费）

第一次不要上 Reverb / AI 实时通话。后台能登录、能配 Twilio 再加。

---

## 1. 新建 Railway 项目

1. 打开 [railway.com](https://railway.com)，用 GitHub 登录。  
2. **New Project** → **Deploy from GitHub repo** → 选 `heitao101/hometile`（私有仓库先授权 Railway）。  
3. 先不要急着 Generate Domain，按下面把数据库和变量配齐再部署。

## 2. 加 MySQL

1. 画布上 **Add Service** → **Database** → **MySQL**。  
2. 等它变成 Running。  
3. 服务名保持 `MySQL`（后面变量引用用这个名字）。

需要 MySQL **8**。Railway 默认一般可用。

## 3. 配置 App 服务

打开自动创建的那个 Web 服务，改名为 **App**。

### Settings

| 项 | 填什么 |
|----|--------|
| Source Repo | `heitao101/hometile`，分支 `main` |
| Custom Build Command | `npm run build` |
| Pre-Deploy Command | `chmod +x ./railway/init-app.sh && sh ./railway/init-app.sh` |
| Custom Start Command | 留空（用 Nixpacks 默认的 php-fpm + Caddy） |
| Volume | 挂到 `/app/storage/app`（不要挂整个 `/app/storage`，否则会把 views 目录盖空导致 Crash） |

### 必填变量

在 App → Variables 里添加。数据库用引用，不要手抄密码。

```
APP_NAME=Teleman
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:请先在本地生成
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

APP_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_TIMEZONE=UTC

LOG_CHANNEL=stderr
LOG_STDERR_FORMATTER=\Monolog\Formatter\JsonFormatter
LOG_LEVEL=info

DB_CONNECTION=mysql
DB_URL=${{MySQL.MYSQL_URL}}

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
BROADCAST_CONNECTION=log
RAILPACK_SKIP_MIGRATIONS=true

NIXPACKS_PHP_VERSION=8.3
```

本地生成 `APP_KEY`（不要用卖家包里的）：

```bash
php artisan key:generate --show
```

生成公网域名后再确认 `APP_URL` 变成 `https://你的项目.up.railway.app`。

### 业务变量（没有也能先打开后台）

Twilio / Stripe 可以后填。**不要**填卖家 `.env` 里的 Sentry DSN。

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_VALIDATE_WEBHOOKS=true

STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_TEST_MODE=true

DEEPGRAM_API_KEY=
OPENROUTER_API_KEY=
OPENAI_API_KEY=
SENTRY_LARAVEL_DSN=
```

邮件先用 log 即可：

```
MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME=Teleman
```

## 4. 复制 Worker 服务

1. 画布 **Add Service** → **GitHub Repo** → 还是 `hometile`。  
2. 改名为 **Worker**。  
3. Variables：点 **Add Shared Variable** / 从 App **共享同一组变量**（至少包含 `APP_KEY`、`DB_*`、`QUEUE_CONNECTION=database`）。  
4. Settings → Custom Start Command：

```
chmod +x ./railway/run-worker.sh && sh ./railway/run-worker.sh
```

5. **不要** Generate Domain。  
6. 同样建议 Volume 挂 `/app/storage`（或和 App 用同一张盘，若 Railway 账号支持）。

## 5. 复制 Cron 服务

1. 再加一个 GitHub 服务，改名为 **Cron**。  
2. 变量与 App / Worker 相同。  
3. Custom Start Command：

```
chmod +x ./railway/run-cron.sh && sh ./railway/run-cron.sh
```

4. **不要** Generate Domain。

## 6. 给 App 生成域名并 Redeploy

1. App → Settings → Networking → **Generate Domain**。  
2. 确认 `APP_URL` 已指向这个 `https://...`。  
3. Redeploy App（让 Pre-Deploy 跑迁移和 seed）。  
4. Worker / Cron 也 Deploy 一次。

健康检查：打开 `https://你的域名/up`，应返回正常。

## 7. 第一次登录

种子账号（**立刻改密码**）：

- 管理员：`admin@example.com` / `password`
- 客户：`customer@example.com` / `password`
- 坐席：`agent@example.com` / `password`

若跳到 `/install`，说明 `public/.installed` 没写上，看 App 部署日志里 `init-app.sh` 有没有成功。

## 8. 接 Twilio（美国）

后台能进之后：

1. App 域名必须是 **HTTPS**（Railway 默认就是）。  
2. Twilio Console 里 Voice webhook / TwiML App 填：

```
https://你的域名/twiml/inbound-call
https://你的域名/webhooks/twilio/call-status
```

3. Geo Permission 打开 United States。  
4. 先打一通测试，再跑群呼。群呼没出去时先看 **Worker 日志**，不是看网页。

Stripe webhook（以后充值）：

```
https://你的域名/webhooks/payment/stripe
```

## 9. 验收顺序

1. `/up` 通  
2. 管理员能登录  
3. 改掉默认密码  
4. 配自己的 Twilio，单呼成功  
5. 导入几个联系人，开一个小活动（确认 Worker 在打）  
6. 预约活动到 2 分钟后（确认 Cron 在跑）

## 常见失败

| 现象 | 原因 |
|------|------|
| 一直进安装向导 | Pre-Deploy 没跑，或 `public/.installed` 没生成 |
| 页面 500，日志说 no APP_KEY | 没配 `APP_KEY` |
| 页面正常，活动不拨号 | 没开 Worker，或 `QUEUE_CONNECTION` 不是 `database` |
| 预约活动不准时 | 没开 Cron |
| 重启后录音没了 | 没挂 Volume |
| `route:cache` 报错 | 不要跑它，本仓库脚本已经去掉 |
| HTTPS 登录 cookie 异常 | 已在代码里 `trustProxies('*')`，确认 `APP_URL` 是 https |

Reverb 实时看板、AI 双向语音流不要第一次就上，需要单独的 WebSocket 服务和公网端口，比上面四件套麻烦。
