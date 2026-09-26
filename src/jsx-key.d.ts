// Il progetto non installa @types/react: senza questa dichiarazione TypeScript
// rifiuta la prop `key` sui componenti personalizzati.
declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number | bigint | null;
  }
}
