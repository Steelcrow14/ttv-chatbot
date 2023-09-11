FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
ENV NODE_ENV production
RUN npx prisma generate
RUN npm run build
CMD ["sh", "docker.init.sh"]
EXPOSE 3000