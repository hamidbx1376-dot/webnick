import fs from 'fs';
import path from 'path';
import { DatabaseSchema, AuditLog, NotificationItem } from './schema';
import { getInitialSeedData } from './seed';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'webnick_database.json');

class DatabaseEngine {
  private data: DatabaseSchema | null = null;
  private isSaving = false;
  private savePending = false;

  constructor() {
    this.init();
  }

  public init(): DatabaseSchema {
    if (this.data) return this.data;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[Database] Loaded existing database from disk.');
      } else {
        console.log('[Database] First run: initializing database with seed data...');
        this.data = getInitialSeedData();
        this.persistSync();
        console.log('[Database] Seed data written to', DB_FILE);
      }
    } catch (err) {
      console.error('[Database] Error loading database:', err);
      this.data = getInitialSeedData();
    }

    return this.data!;
  }

  private persistSync() {
    if (!this.data) return;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write database to disk:', err);
    }
  }

  public async persist(): Promise<void> {
    if (this.isSaving) {
      this.savePending = true;
      return;
    }

    this.isSaving = true;
    try {
      await fs.promises.writeFile(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Async persist error:', err);
    } finally {
      this.isSaving = false;
      if (this.savePending) {
        this.savePending = false;
        this.persist();
      }
    }
  }

  public getRawData(): DatabaseSchema {
    return this.init();
  }

  public getTable<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    const db = this.init();
    return db[table];
  }

  public async setTable<K extends keyof DatabaseSchema>(table: K, data: DatabaseSchema[K]): Promise<void> {
    const db = this.init();
    db[table] = data;
    await this.persist();
  }

  public findById<T = any>(table: keyof DatabaseSchema, id: string): T | null {
    const list = this.getTable(table) as any[];
    if (!Array.isArray(list)) return null;
    return list.find((item) => item.id === id) || null;
  }

  public find<T = any>(table: keyof DatabaseSchema, predicate: (item: T) => boolean): T[] {
    const list = this.getTable(table) as any[];
    if (!Array.isArray(list)) return [];
    return list.filter(predicate);
  }

  public findOne<T = any>(table: keyof DatabaseSchema, predicate: (item: T) => boolean): T | null {
    const list = this.getTable(table) as any[];
    if (!Array.isArray(list)) return null;
    return list.find(predicate) || null;
  }

  public async insert<T = any>(table: keyof DatabaseSchema, item: any): Promise<T> {
    const db = this.init();
    const list = db[table] as any[];
    if (!Array.isArray(list)) {
      throw new Error(`Table ${String(table)} is not an array.`);
    }

    const now = new Date().toISOString();
    const newRecord = {
      id: item.id || `${String(table).slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...item,
      created_at: item.created_at || now,
      updated_at: now,
    };

    list.unshift(newRecord);
    await this.persist();
    return newRecord as T;
  }

  public async update<T = any>(table: keyof DatabaseSchema, id: string, patch: Partial<T>): Promise<T | null> {
    const db = this.init();
    const list = db[table] as any[];
    if (!Array.isArray(list)) return null;

    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...patch,
      updated_at: new Date().toISOString(),
    };

    list[index] = updated;
    await this.persist();
    return updated as T;
  }

  public async delete(table: keyof DatabaseSchema, id: string): Promise<boolean> {
    const db = this.init();
    const list = db[table] as any[];
    if (!Array.isArray(list)) return false;

    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    await this.persist();
    return true;
  }

  public async logAudit(
    userId: string,
    username: string,
    action: string,
    entityType: string,
    entityId: string,
    ipAddress: string,
    details: string
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      username,
      action,
      entity_type: entityType,
      entity_id: entityId,
      ip_address: ipAddress || '127.0.0.1',
      details,
      created_at: new Date().toISOString(),
    };

    const db = this.init();
    db.audit_logs.unshift(log);
    // keep maximum 1000 logs in memory
    if (db.audit_logs.length > 1000) {
      db.audit_logs = db.audit_logs.slice(0, 1000);
    }
    await this.persist();
    return log;
  }

  public async createNotification(
    title: string,
    message: string,
    type: 'LEAD' | 'MESSAGE' | 'SYSTEM' | 'USER',
    entityType: string,
    entityId: string
  ): Promise<NotificationItem> {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      entity_type: entityType,
      entity_id: entityId,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const db = this.init();
    db.notifications.unshift(notif);
    await this.persist();
    return notif;
  }
}

export const db = new DatabaseEngine();
