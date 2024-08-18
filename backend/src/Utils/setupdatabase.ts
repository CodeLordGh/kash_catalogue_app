// src/setupDatabase.ts
import { supabase } from'./superbaseClient';

const createTables = async () => {
    const tables = [
      {
        name: 'sellers',
        sql: `
          CREATE TABLE IF NOT EXISTS sellers (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            store_name text NOT NULL,
            store_id text UNIQUE NOT NULL
          );
        `,
      },
      {
        name: 'products',
        sql: `
          CREATE TABLE IF NOT EXISTS products (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            seller_id uuid REFERENCES sellers(id),
            name text NOT NULL,
            description text,
            price numeric NOT NULL,
            image_url text,
            category text
          );
        `,
      },
      {
        name: 'delivery_fees',
        sql: `
          CREATE TABLE IF NOT EXISTS delivery_fees (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            seller_id uuid REFERENCES sellers(id),
            location text NOT NULL,
            fee numeric NOT NULL
          );
        `,
      },
      {
        name: 'orders',
        sql: `
          CREATE TABLE IF NOT EXISTS orders (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            phone_number text NOT NULL,
            items jsonb NOT NULL,
            seller_id uuid REFERENCES sellers(id),
            status text DEFAULT 'pending'
          );
        `,
      },
    ];
  
    for (const table of tables) {
      const { error } = await supabase.rpc('execute_sql', {
        sql: table.sql,
      });
      if (error) {
        console.error(`Error creating ${table.name}:`, error.message);
      } else {
        console.log(`${table.name} table created successfully`);
      }
    }
  };
  
  createTables().then(() => {
    console.log('Database setup complete');
    process.exit(0);
  });
  