// src/server.ts
import express from'express';
import sellerRoutes from'./Routes/seller';
import buyerRoutes from'./Routes/buyer';
import env from "dotenv"

if (process.env.NODE_ENV !== 'production') {
  env.config();
}
const app = express();
app.use(express.json());

app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
