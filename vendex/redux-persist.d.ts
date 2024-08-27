// redux-persist.d.ts
declare module 'redux-persist/integration/react' {
    import { ComponentType } from 'react';
    import { Persistor } from 'redux-persist';
  
    export const PersistGate: ComponentType<{
      loading?: React.ReactNode;
      persistor: Persistor;
    }>;
  
    export const PersistReducer: any; // You can define this more specifically if needed
  }