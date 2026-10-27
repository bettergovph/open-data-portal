/* oxlint-disable typescript/no-explicit-any -- usages of any is acceptable here */
let dbInstance: D1Database | null = null

export const initDB = (db: D1Database): void => {
  dbInstance = db
}

const getDB = (): D1Database => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call initDB() first.")
  }
  return dbInstance
}

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  const db = getDB()
  const result = await db
    .prepare(sql)
    .bind(...params)
    .all()
  return result.results as T[]
}

export const queryOne = async <T = any>(sql: string, params: any[] = []): Promise<T | null> => {
  const db = getDB()
  const result = await db
    .prepare(sql)
    .bind(...params)
    .first()
  return result as T | null
}

export const execute = async (sql: string, params: any[] = []): Promise<D1Result> => {
  const db = getDB()
  return await db
    .prepare(sql)
    .bind(...params)
    .run()
}
