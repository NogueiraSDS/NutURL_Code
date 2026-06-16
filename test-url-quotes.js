try {
  new URL('"postgresql://postgres:V%23LtdZ%24b5K%2ARgP%2A@db.yprtrwpykeqpvydyvafh.supabase.co:5432/postgres"');
  console.log('OK');
} catch(e) {
  console.log(e.message);
}
