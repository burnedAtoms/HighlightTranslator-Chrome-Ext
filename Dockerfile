FROM node
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npx", "tailwindcss", "-i", "./styles.css", "-o", "./output.css", "--watch"]