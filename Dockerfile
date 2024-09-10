# 阶段 1: 构建阶段
FROM node:20-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建 Next.js 项目
RUN npm run build

# 阶段 2: 生产阶段
FROM node:20-alpine AS production-stage

# 设置工作目录
WORKDIR /app

# 复制构建阶段的构建输出
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/.next/static ./.next/standalone/.next/static

# 暴露端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["node", ".next/standalone/server.js"]