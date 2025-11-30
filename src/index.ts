import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./app";
import { connectDB } from "./db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function main() {
  try {
    // Conecta no MongoDB usando a string no arquivo .env (MONGO_URI)
    await connectDB(
      process.env.MONGO_URI || "mongodb://localhost:27017/koa_orders"
    );

    // Cria a instância do servidor Koa (configurada em app.ts)
    const app = createServer();

    // Inicia o servidor HTTP
    app.listen(PORT);
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to start app:", err);
    process.exit(1);
  }
}

main();
