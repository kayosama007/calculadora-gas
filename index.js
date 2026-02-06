var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  actividadUsuarios: () => actividadUsuarios,
  actividadUsuariosRelations: () => actividadUsuariosRelations,
  cargas: () => cargas,
  cargasRelations: () => cargasRelations,
  evaluaciones: () => evaluaciones,
  evaluacionesRelations: () => evaluacionesRelations,
  gaseras: () => gaseras,
  insertCargaSchema: () => insertCargaSchema,
  insertEvaluacionSchema: () => insertEvaluacionSchema,
  insertGaseraSchema: () => insertGaseraSchema,
  insertProveedorSchema: () => insertProveedorSchema,
  insertTanqueSchema: () => insertTanqueSchema,
  insertUsuarioSchema: () => insertUsuarioSchema,
  proveedores: () => proveedores,
  proveedoresRelations: () => proveedoresRelations,
  tanques: () => tanques,
  tanquesRelations: () => tanquesRelations,
  usuarios: () => usuarios,
  usuariosRelations: () => usuariosRelations
});
import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  telefono: text("telefono"),
  zona: text("zona"),
  // Para filtrar pipas cercanas
  ciudad: text("ciudad"),
  calle: text("calle"),
  numero: text("numero"),
  departamento: text("departamento"),
  codigoPostal: text("codigo_postal"),
  esAdmin: boolean("es_admin").default(false),
  passwordAdmin: text("password_admin"),
  // Contraseña hasheada solo para admin
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  activo: boolean("activo").default(true),
  aceptoTerminos: boolean("acepto_terminos").default(false)
});
var tanques = pgTable("tanques", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  marca: text("marca").notNull(),
  capacidad: text("capacidad").notNull(),
  // Capacidad en litros
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  activo: boolean("activo").default(true)
});
var cargas = pgTable("cargas", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  tanqueId: integer("tanque_id").notNull().references(() => tanques.id),
  porcentajeAnterior: text("porcentaje_anterior").notNull(),
  porcentajeObjetivo: text("porcentaje_objetivo").notNull(),
  costoPorLitro: text("costo_por_litro").notNull(),
  litrosCargados: text("litros_cargados").notNull(),
  montoTotal: text("monto_total").notNull(),
  fechaCarga: timestamp("fecha_carga").defaultNow(),
  estacion: text("estacion"),
  notas: text("notas")
});
var proveedores = pgTable("proveedores", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  zona: text("zona"),
  ciudad: text("ciudad"),
  codigoPostal: text("codigo_postal"),
  // Código postal para búsqueda más precisa
  direccion: text("direccion"),
  // Dirección completa
  barrio: text("barrio"),
  // Barrio o vecindario
  referencia: text("referencia"),
  // Referencia de ubicación (ej: cerca del parque, esquina con...)
  coordenadas: text("coordenadas"),
  // "lat,lng"
  confiable: boolean("confiable").default(false),
  // Admin puede marcar como confiable
  estrellas: integer("estrellas").default(0),
  // 0-5 estrellas de confiabilidad del admin
  horarioAtencion: text("horario_atencion"),
  // Horario de atención
  descripcion: text("descripcion"),
  // Descripción adicional
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  activo: boolean("activo").default(true)
});
var evaluaciones = pgTable("evaluaciones", {
  id: serial("id").primaryKey(),
  proveedorId: integer("proveedor_id").notNull().references(() => proveedores.id),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  calificacion: integer("calificacion").notNull(),
  // 1-5
  comentario: text("comentario"),
  recomendado: boolean("recomendado").default(false),
  fechaEvaluacion: timestamp("fecha_evaluacion").defaultNow()
});
var gaseras = pgTable("gaseras", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  contacto: text("contacto").notNull(),
  telefono: text("telefono").notNull(),
  zona: text("zona").notNull(),
  ciudad: text("ciudad").notNull(),
  coordenadas: text("coordenadas"),
  // "lat,lng"
  precioPromedio: decimal("precio_promedio", { precision: 10, scale: 2 }),
  activo: boolean("activo").default(true),
  fechaRegistro: timestamp("fecha_registro").defaultNow()
});
var actividadUsuarios = pgTable("actividad_usuarios", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  ultimaActividad: timestamp("ultima_actividad").defaultNow(),
  activo: boolean("activo").default(true)
});
var usuariosRelations = relations(usuarios, ({ many }) => ({
  tanques: many(tanques),
  cargas: many(cargas)
}));
var tanquesRelations = relations(tanques, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [tanques.usuarioId],
    references: [usuarios.id]
  }),
  cargas: many(cargas)
}));
var cargasRelations = relations(cargas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [cargas.usuarioId],
    references: [usuarios.id]
  }),
  tanque: one(tanques, {
    fields: [cargas.tanqueId],
    references: [tanques.id]
  })
}));
var proveedoresRelations = relations(proveedores, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [proveedores.usuarioId],
    references: [usuarios.id]
  }),
  evaluaciones: many(evaluaciones)
}));
var evaluacionesRelations = relations(evaluaciones, ({ one }) => ({
  proveedor: one(proveedores, {
    fields: [evaluaciones.proveedorId],
    references: [proveedores.id]
  }),
  usuario: one(usuarios, {
    fields: [evaluaciones.usuarioId],
    references: [usuarios.id]
  })
}));
var actividadUsuariosRelations = relations(actividadUsuarios, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [actividadUsuarios.usuarioId],
    references: [usuarios.id]
  })
}));
var insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  fechaRegistro: true,
  activo: true
});
var insertGaseraSchema = createInsertSchema(gaseras).omit({
  id: true,
  fechaRegistro: true,
  activo: true
});
var insertProveedorSchema = createInsertSchema(proveedores).omit({
  id: true,
  fechaRegistro: true,
  activo: true,
  confiable: true
});
var insertEvaluacionSchema = createInsertSchema(evaluaciones).omit({
  id: true,
  fechaEvaluacion: true
});
var insertTanqueSchema = createInsertSchema(tanques).omit({
  id: true,
  fechaRegistro: true,
  activo: true
});
var insertCargaSchema = createInsertSchema(cargas).omit({
  id: true,
  fechaCarga: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql, and } from "drizzle-orm";
import crypto from "crypto";
var DatabaseStorage = class {
  // Usuarios
  async getUsuarios() {
    return await db.select().from(usuarios).where(eq(usuarios.activo, true)).orderBy(desc(usuarios.fechaRegistro));
  }
  async getUsuario(id) {
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return usuario || void 0;
  }
  async getUsuarioPorEmail(email) {
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return usuario || void 0;
  }
  async createUsuario(usuario) {
    const [newUsuario] = await db.insert(usuarios).values(usuario).returning();
    return newUsuario;
  }
  async updateUsuario(id, usuario) {
    const [updatedUsuario] = await db.update(usuarios).set(usuario).where(eq(usuarios.id, id)).returning();
    return updatedUsuario;
  }
  // Tanques
  async getTanques() {
    const results = await db.select({
      id: tanques.id,
      usuarioId: tanques.usuarioId,
      marca: tanques.marca,
      capacidad: tanques.capacidad,
      fechaRegistro: tanques.fechaRegistro,
      activo: tanques.activo,
      usuario: {
        id: usuarios.id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        telefono: usuarios.telefono,
        esAdmin: usuarios.esAdmin,
        fechaRegistro: usuarios.fechaRegistro,
        activo: usuarios.activo
      }
    }).from(tanques).innerJoin(usuarios, eq(tanques.usuarioId, usuarios.id)).where(eq(tanques.activo, true)).orderBy(desc(tanques.fechaRegistro));
    return results.map((row) => ({
      ...row,
      usuario: row.usuario
    }));
  }
  async getTanquesPorUsuario(usuarioId) {
    return await db.select().from(tanques).where(and(eq(tanques.usuarioId, usuarioId), eq(tanques.activo, true))).orderBy(desc(tanques.fechaRegistro));
  }
  async getTanque(id) {
    const [tanque] = await db.select().from(tanques).where(eq(tanques.id, id));
    return tanque || void 0;
  }
  async createTanque(tanque) {
    const [newTanque] = await db.insert(tanques).values(tanque).returning();
    return newTanque;
  }
  async updateTanque(id, tanque) {
    const [updatedTanque] = await db.update(tanques).set(tanque).where(eq(tanques.id, id)).returning();
    return updatedTanque;
  }
  // Cargas
  async getCargas() {
    const results = await db.select({
      id: cargas.id,
      usuarioId: cargas.usuarioId,
      tanqueId: cargas.tanqueId,
      porcentajeAnterior: cargas.porcentajeAnterior,
      porcentajeObjetivo: cargas.porcentajeObjetivo,
      costoPorLitro: cargas.costoPorLitro,
      litrosCargados: cargas.litrosCargados,
      montoTotal: cargas.montoTotal,
      fechaCarga: cargas.fechaCarga,
      estacion: cargas.estacion,
      notas: cargas.notas,
      usuario: {
        id: usuarios.id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        telefono: usuarios.telefono,
        esAdmin: usuarios.esAdmin,
        fechaRegistro: usuarios.fechaRegistro,
        activo: usuarios.activo
      },
      tanque: {
        id: tanques.id,
        usuarioId: tanques.usuarioId,
        marca: tanques.marca,
        capacidad: tanques.capacidad,
        fechaRegistro: tanques.fechaRegistro,
        activo: tanques.activo
      }
    }).from(cargas).innerJoin(usuarios, eq(cargas.usuarioId, usuarios.id)).innerJoin(tanques, eq(cargas.tanqueId, tanques.id)).orderBy(desc(cargas.fechaCarga));
    return results.map((row) => ({
      ...row,
      usuario: row.usuario,
      tanque: row.tanque
    }));
  }
  async getCargasPorUsuario(usuarioId) {
    const results = await db.select({
      id: cargas.id,
      usuarioId: cargas.usuarioId,
      tanqueId: cargas.tanqueId,
      porcentajeAnterior: cargas.porcentajeAnterior,
      porcentajeObjetivo: cargas.porcentajeObjetivo,
      costoPorLitro: cargas.costoPorLitro,
      litrosCargados: cargas.litrosCargados,
      montoTotal: cargas.montoTotal,
      fechaCarga: cargas.fechaCarga,
      estacion: cargas.estacion,
      notas: cargas.notas,
      usuario: {
        id: usuarios.id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        telefono: usuarios.telefono,
        esAdmin: usuarios.esAdmin,
        fechaRegistro: usuarios.fechaRegistro,
        activo: usuarios.activo
      },
      tanque: {
        id: tanques.id,
        usuarioId: tanques.usuarioId,
        marca: tanques.marca,
        capacidad: tanques.capacidad,
        fechaRegistro: tanques.fechaRegistro,
        activo: tanques.activo
      }
    }).from(cargas).innerJoin(usuarios, eq(cargas.usuarioId, usuarios.id)).innerJoin(tanques, eq(cargas.tanqueId, tanques.id)).where(eq(cargas.usuarioId, usuarioId)).orderBy(desc(cargas.fechaCarga));
    return results.map((row) => ({
      ...row,
      usuario: row.usuario,
      tanque: row.tanque
    }));
  }
  async createCarga(carga) {
    const [newCarga] = await db.insert(cargas).values(carga).returning();
    return newCarga;
  }
  // Cálculos
  calcularCarga(porcentajeActual, porcentajeObjetivo, capacidadTanque, costoPorLitro) {
    let esSeguro = true;
    let advertencia;
    if (porcentajeObjetivo > 80) {
      esSeguro = false;
      advertencia = "\u26A0\uFE0F ADVERTENCIA: No se recomienda llenar el tanque m\xE1s del 80% por seguridad";
    }
    if (porcentajeObjetivo > 85) {
      advertencia = "\u{1F6A8} PELIGRO: Llenar m\xE1s del 85% puede ser muy peligroso";
    }
    if (porcentajeActual >= porcentajeObjetivo) {
      advertencia = "El tanque ya tiene m\xE1s gas del objetivo solicitado";
    }
    const porcentajeACargar = porcentajeObjetivo - porcentajeActual;
    const litrosACargar = capacidadTanque * porcentajeACargar / 100;
    const montoAPagar = litrosACargar * costoPorLitro;
    return {
      porcentajeActual,
      porcentajeObjetivo,
      capacidadTanque,
      costoPorLitro,
      litrosACargar: Math.max(0, litrosACargar),
      montoAPagar: Math.max(0, montoAPagar),
      esSeguro,
      advertencia
    };
  }
  calcularPorDinero(porcentajeActual, capacidadTanque, costoPorLitro, montoAPagar) {
    const litrosPosibles = montoAPagar / costoPorLitro;
    const porcentajeACargar = litrosPosibles / capacidadTanque * 100;
    const porcentajeFinal = porcentajeActual + porcentajeACargar;
    let esSeguro = true;
    let advertencia;
    if (porcentajeFinal > 100) {
      advertencia = "\u26A0\uFE0F ADVERTENCIA: Con ese dinero el tanque se desbordar\xEDa y excede del l\xEDmite de gas que le cabe al tanque. Reduce la cantidad.";
      esSeguro = false;
    } else if (porcentajeFinal > 85) {
      advertencia = "\u{1F6A8} PELIGRO: Llenar m\xE1s del 85% puede ser muy peligroso";
      esSeguro = false;
    } else if (porcentajeFinal > 80) {
      advertencia = "\u26A0\uFE0F ADVERTENCIA: No se recomienda llenar el tanque m\xE1s del 80% por seguridad";
      esSeguro = false;
    }
    if (litrosPosibles <= 0) {
      advertencia = "El monto ingresado es insuficiente para comprar gas";
      esSeguro = false;
    }
    return {
      porcentajeActual,
      capacidadTanque,
      costoPorLitro,
      montoAPagar,
      litrosPosibles: Math.max(0, litrosPosibles),
      porcentajeFinal: Math.min(100, Math.max(porcentajeActual, porcentajeFinal)),
      esSeguro,
      advertencia
    };
  }
  // Estadísticas
  // Gaseras
  async getGaseras() {
    return await db.select().from(gaseras).where(eq(gaseras.activo, true)).orderBy(desc(gaseras.fechaRegistro));
  }
  async getGaserasPorZona(zona) {
    return await db.select().from(gaseras).where(and(eq(gaseras.zona, zona), eq(gaseras.activo, true)));
  }
  async createGasera(gasera) {
    const [newGasera] = await db.insert(gaseras).values(gasera).returning();
    return newGasera;
  }
  // Actividad de usuarios
  async getUsuariosActivos() {
    const results = await db.select({
      id: usuarios.id,
      nombre: usuarios.nombre,
      email: usuarios.email,
      telefono: usuarios.telefono,
      esAdmin: usuarios.esAdmin,
      fechaRegistro: usuarios.fechaRegistro,
      activo: usuarios.activo,
      ultimaActividad: actividadUsuarios.ultimaActividad
    }).from(usuarios).leftJoin(actividadUsuarios, eq(usuarios.id, actividadUsuarios.usuarioId)).where(eq(usuarios.activo, true)).orderBy(desc(actividadUsuarios.ultimaActividad));
    return results;
  }
  async updateActividadUsuario(usuarioId) {
    const [existing] = await db.select().from(actividadUsuarios).where(eq(actividadUsuarios.usuarioId, usuarioId));
    if (existing) {
      await db.update(actividadUsuarios).set({ ultimaActividad: /* @__PURE__ */ new Date() }).where(eq(actividadUsuarios.usuarioId, usuarioId));
    } else {
      await db.insert(actividadUsuarios).values({ usuarioId, ultimaActividad: /* @__PURE__ */ new Date() });
    }
  }
  async eliminarUsuariosViejos(diasInactivos) {
    const fechaLimite = /* @__PURE__ */ new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasInactivos);
    const result = await db.update(usuarios).set({ activo: false }).where(and(
      eq(usuarios.activo, true),
      eq(usuarios.esAdmin, false),
      sql`${usuarios.fechaRegistro} < ${fechaLimite}`
    )).returning();
    return result.length;
  }
  async eliminarUsuarioPermanentemente(id) {
    await db.delete(usuarios).where(eq(usuarios.id, id));
  }
  async getProveedores() {
    const provs = await db.select().from(proveedores).where(eq(proveedores.activo, true)).orderBy(desc(proveedores.fechaRegistro));
    return Promise.all(provs.map(async (prov) => {
      const evals = await db.select().from(evaluaciones).where(eq(evaluaciones.proveedorId, prov.id));
      const promedio = evals.length > 0 ? evals.reduce((sum2, e) => sum2 + e.calificacion, 0) / evals.length : 0;
      return {
        ...prov,
        evaluaciones: evals,
        promedioCalificacion: parseFloat(promedio.toFixed(1)),
        totalEvaluaciones: evals.length
      };
    }));
  }
  async getProveedoresPorZona(zona) {
    const provs = await db.select().from(proveedores).where(and(eq(proveedores.zona, zona), eq(proveedores.activo, true)));
    return Promise.all(provs.map(async (prov) => {
      const evals = await db.select().from(evaluaciones).where(eq(evaluaciones.proveedorId, prov.id));
      const promedio = evals.length > 0 ? evals.reduce((sum2, e) => sum2 + e.calificacion, 0) / evals.length : 0;
      return {
        ...prov,
        evaluaciones: evals,
        promedioCalificacion: parseFloat(promedio.toFixed(1)),
        totalEvaluaciones: evals.length
      };
    }));
  }
  async getProveedoresCercanos(zona, ciudad, codigoPostal) {
    const conditions = [];
    if (zona) conditions.push(eq(proveedores.zona, zona));
    if (ciudad) conditions.push(eq(proveedores.ciudad, ciudad));
    if (codigoPostal) conditions.push(eq(proveedores.codigoPostal, codigoPostal));
    const where = conditions.length > 0 ? and(eq(proveedores.activo, true), and(...conditions)) : eq(proveedores.activo, true);
    const provs = await db.select().from(proveedores).where(where).orderBy(desc(proveedores.estrellas), desc(proveedores.fechaRegistro));
    return Promise.all(provs.map(async (prov) => {
      const evals = await db.select().from(evaluaciones).where(eq(evaluaciones.proveedorId, prov.id));
      const promedio = evals.length > 0 ? evals.reduce((sum2, e) => sum2 + e.calificacion, 0) / evals.length : 0;
      return {
        ...prov,
        evaluaciones: evals,
        promedioCalificacion: parseFloat(promedio.toFixed(1)),
        totalEvaluaciones: evals.length
      };
    }));
  }
  async createProveedor(proveedor) {
    const [newProveedor] = await db.insert(proveedores).values(proveedor).returning();
    return newProveedor;
  }
  async updateProveedorConfiable(id, confiable) {
    const [updated] = await db.update(proveedores).set({ confiable }).where(eq(proveedores.id, id)).returning();
    return updated;
  }
  async createEvaluacion(evaluacion) {
    const [newEval] = await db.insert(evaluaciones).values(evaluacion).returning();
    return newEval;
  }
  async getEvaluacionesPorProveedor(proveedorId) {
    return await db.select().from(evaluaciones).where(eq(evaluaciones.proveedorId, proveedorId)).orderBy(desc(evaluaciones.fechaEvaluacion));
  }
  async deleteProveedor(id) {
    await db.delete(proveedores).where(eq(proveedores.id, id));
  }
  async updateProveedorEstrellas(id, estrellas) {
    const [proveedor] = await db.update(proveedores).set({ estrellas }).where(eq(proveedores.id, id)).returning();
    return proveedor;
  }
  async setAdminPassword(usuarioId, password) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    await db.update(usuarios).set({ passwordAdmin: hashedPassword }).where(eq(usuarios.id, usuarioId));
  }
  async verifyAdminPassword(usuarioId, password) {
    const usuario = await this.getUsuario(usuarioId);
    if (!usuario?.passwordAdmin) return false;
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    return usuario.passwordAdmin === hashedPassword;
  }
  async getEstadisticasPorUsuario(usuarioId) {
    const [totalGastadoResult] = await db.select({ total: sql`COALESCE(SUM(${cargas.montoTotal}), 0)` }).from(cargas).where(eq(cargas.usuarioId, usuarioId));
    const [cargasRealizadasResult] = await db.select({ count: sql`COUNT(*)` }).from(cargas).where(eq(cargas.usuarioId, usuarioId));
    const [promedioLitrosResult] = await db.select({ promedio: sql`COALESCE(AVG(${cargas.litrosCargados}), 0)` }).from(cargas).where(eq(cargas.usuarioId, usuarioId));
    const [estacionMasUsadaResult] = await db.select({
      estacion: cargas.estacion,
      count: sql`COUNT(*)`
    }).from(cargas).where(eq(cargas.usuarioId, usuarioId)).groupBy(cargas.estacion).orderBy(desc(sql`COUNT(*)`)).limit(1);
    return {
      totalGastado: totalGastadoResult?.total || "0",
      cargasRealizadas: cargasRealizadasResult?.count || 0,
      promedioLitrosPorCarga: promedioLitrosResult?.promedio || "0",
      estacionMasUsada: estacionMasUsadaResult?.estacion || "Sin datos"
    };
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
import { eq as eq2 } from "drizzle-orm";
async function registerRoutes(app2) {
  app2.get("/api/usuarios", async (req, res) => {
    try {
      const usuarios2 = await storage.getUsuarios();
      res.json(usuarios2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  });
  app2.get("/api/usuarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await storage.getUsuario(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });
  app2.get("/api/usuarios/email/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      console.log("Buscando usuario con email:", email);
      const usuario = await storage.getUsuarioPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      res.status(500).json({ message: "Error al obtener usuario", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/usuarios", async (req, res) => {
    try {
      console.log("Creando usuario con datos:", req.body);
      const usuarioData = insertUsuarioSchema.parse(req.body);
      console.log("Datos validados:", usuarioData);
      const usuario = await storage.createUsuario(usuarioData);
      console.log("Usuario creado exitosamente:", usuario);
      res.status(201).json(usuario);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        return res.status(409).json({
          message: "Ya existe una cuenta con este email",
          suggestion: "Usa el bot\xF3n 'Ingresar' para acceder a tu cuenta existente"
        });
      }
      res.status(500).json({ message: "Error al crear usuario", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.put("/api/usuarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const usuarioData = insertUsuarioSchema.partial().parse(req.body);
      const usuario = await storage.updateUsuario(id, usuarioData);
      res.json(usuario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  });
  app2.get("/api/tanques", async (req, res) => {
    try {
      const tanques2 = await storage.getTanques();
      res.json(tanques2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tanques" });
    }
  });
  app2.get("/api/tanques/usuario/:usuarioId", async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const tanques2 = await storage.getTanquesPorUsuario(usuarioId);
      res.json(tanques2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tanques del usuario" });
    }
  });
  app2.get("/api/tanques/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tanque = await storage.getTanque(id);
      if (!tanque) {
        return res.status(404).json({ message: "Tanque no encontrado" });
      }
      res.json(tanque);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tanque" });
    }
  });
  app2.post("/api/tanques", async (req, res) => {
    try {
      const tanqueData = insertTanqueSchema.parse(req.body);
      const tanque = await storage.createTanque(tanqueData);
      res.status(201).json(tanque);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error al crear tanque" });
    }
  });
  app2.put("/api/tanques/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tanqueData = insertTanqueSchema.partial().parse(req.body);
      const tanque = await storage.updateTanque(id, tanqueData);
      res.json(tanque);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error al actualizar tanque" });
    }
  });
  app2.get("/api/cargas", async (req, res) => {
    try {
      const cargas2 = await storage.getCargas();
      res.json(cargas2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cargas" });
    }
  });
  app2.get("/api/cargas/usuario/:usuarioId", async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const cargas2 = await storage.getCargasPorUsuario(usuarioId);
      res.json(cargas2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cargas del usuario" });
    }
  });
  app2.post("/api/cargas", async (req, res) => {
    try {
      const cargaData = insertCargaSchema.parse(req.body);
      const carga = await storage.createCarga(cargaData);
      res.status(201).json(carga);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error al crear carga" });
    }
  });
  app2.post("/api/calcular", async (req, res) => {
    try {
      const { porcentajeActual, porcentajeObjetivo, capacidadTanque, costoPorLitro } = req.body;
      if (porcentajeActual === void 0 || porcentajeObjetivo === void 0 || capacidadTanque === void 0 || costoPorLitro === void 0) {
        return res.status(400).json({ message: "Faltan datos requeridos para el c\xE1lculo" });
      }
      const calculo = storage.calcularCarga(
        parseFloat(porcentajeActual),
        parseFloat(porcentajeObjetivo),
        parseFloat(capacidadTanque),
        parseFloat(costoPorLitro)
      );
      res.json(calculo);
    } catch (error) {
      res.status(500).json({ message: "Error al calcular carga" });
    }
  });
  app2.post("/api/calcular-por-dinero", async (req, res) => {
    try {
      const { porcentajeActual, capacidadTanque, costoPorLitro, montoAPagar } = req.body;
      if (porcentajeActual === void 0 || capacidadTanque === void 0 || costoPorLitro === void 0 || montoAPagar === void 0) {
        return res.status(400).json({ message: "Faltan datos requeridos para el c\xE1lculo por dinero" });
      }
      const calculo = storage.calcularPorDinero(
        parseFloat(porcentajeActual),
        parseFloat(capacidadTanque),
        parseFloat(costoPorLitro),
        parseFloat(montoAPagar)
      );
      res.json(calculo);
    } catch (error) {
      res.status(500).json({ message: "Error al calcular por dinero" });
    }
  });
  app2.get("/api/estadisticas/usuario/:usuarioId", async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const estadisticas = await storage.getEstadisticasPorUsuario(usuarioId);
      res.json(estadisticas);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estad\xEDsticas" });
    }
  });
  app2.get("/api/admin/usuarios", async (req, res) => {
    try {
      const usuarios2 = await storage.getUsuarios();
      res.json(usuarios2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  });
  app2.put("/api/admin/usuarios/:id/admin", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { esAdmin } = req.body;
      const usuario = await storage.updateUsuario(id, { esAdmin });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  });
  app2.delete("/api/admin/usuarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [usuario] = await db.update(usuarios).set({ activo: false }).where(eq2(usuarios.id, id)).returning();
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al desactivar usuario" });
    }
  });
  app2.get("/api/gaseras", async (req, res) => {
    try {
      const gaseras2 = await storage.getGaseras();
      res.json(gaseras2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener gaseras" });
    }
  });
  app2.get("/api/gaseras/zona/:zona", async (req, res) => {
    try {
      const zona = decodeURIComponent(req.params.zona);
      const gaseras2 = await storage.getGaserasPorZona(zona);
      res.json(gaseras2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener gaseras por zona" });
    }
  });
  app2.post("/api/admin/gaseras", async (req, res) => {
    try {
      const gasera = insertGaseraSchema.parse(req.body);
      const newGasera = await storage.createGasera(gasera);
      res.json(newGasera);
    } catch (error) {
      res.status(400).json({ message: "Error al crear gasera" });
    }
  });
  app2.get("/api/admin/usuarios-activos", async (req, res) => {
    try {
      const usuariosActivos = await storage.getUsuariosActivos();
      res.json(usuariosActivos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios activos" });
    }
  });
  app2.post("/api/actividad", async (req, res) => {
    try {
      const { usuarioId } = req.body;
      if (!usuarioId) return res.status(400).json({ message: "usuarioId requerido" });
      await storage.updateActividadUsuario(usuarioId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar actividad" });
    }
  });
  app2.post("/api/admin/limpiar-usuarios", async (req, res) => {
    try {
      const { diasInactivos } = req.body;
      if (!diasInactivos || diasInactivos < 1) {
        return res.status(400).json({ message: "diasInactivos debe ser mayor a 0" });
      }
      const eliminados = await storage.eliminarUsuariosViejos(diasInactivos);
      res.json({ eliminados, message: `${eliminados} usuarios desactivados` });
    } catch (error) {
      res.status(500).json({ message: "Error al limpiar usuarios" });
    }
  });
  app2.delete("/api/admin/usuarios/:id/permanent", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.eliminarUsuarioPermanentemente(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  });
  app2.get("/api/proveedores", async (req, res) => {
    try {
      const proveedores2 = await storage.getProveedores();
      res.json(proveedores2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedores" });
    }
  });
  app2.get("/api/proveedores/zona/:zona", async (req, res) => {
    try {
      const zona = decodeURIComponent(req.params.zona);
      const proveedores2 = await storage.getProveedoresPorZona(zona);
      res.json(proveedores2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedores" });
    }
  });
  app2.get("/api/proveedores/cercanos", async (req, res) => {
    try {
      const zona = req.query.zona;
      const ciudad = req.query.ciudad;
      const codigoPostal = req.query.codigoPostal;
      const proveedores2 = await storage.getProveedoresCercanos(zona, ciudad, codigoPostal);
      res.json(proveedores2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedores cercanos" });
    }
  });
  app2.post("/api/proveedores", async (req, res) => {
    try {
      const proveedor = insertProveedorSchema.parse(req.body);
      const newProveedor = await storage.createProveedor(proveedor);
      res.json(newProveedor);
    } catch (error) {
      res.status(400).json({ message: "Error al crear proveedor" });
    }
  });
  app2.post("/api/evaluaciones", async (req, res) => {
    try {
      const evaluacion = insertEvaluacionSchema.parse(req.body);
      const newEval = await storage.createEvaluacion(evaluacion);
      res.json(newEval);
    } catch (error) {
      res.status(400).json({ message: "Error al crear evaluaci\xF3n" });
    }
  });
  app2.get("/api/evaluaciones/:proveedorId", async (req, res) => {
    try {
      const proveedorId = parseInt(req.params.proveedorId);
      const evals = await storage.getEvaluacionesPorProveedor(proveedorId);
      res.json(evals);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener evaluaciones" });
    }
  });
  app2.put("/api/admin/proveedores/:id/confiable", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { confiable } = req.body;
      const proveedor = await storage.updateProveedorConfiable(id, confiable);
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar proveedor" });
    }
  });
  app2.delete("/api/proveedores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProveedor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar proveedor" });
    }
  });
  app2.put("/api/admin/proveedores/:id/estrellas", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { estrellas } = req.body;
      if (estrellas < 0 || estrellas > 5) {
        return res.status(400).json({ message: "Las estrellas deben estar entre 0 y 5" });
      }
      const proveedor = await storage.updateProveedorEstrellas(id, estrellas);
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estrellas" });
    }
  });
  app2.delete("/api/admin/proveedores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProveedor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar proveedor" });
    }
  });
  app2.post("/api/admin/verify-password", async (req, res) => {
    try {
      const { usuarioId, password } = req.body;
      if (!usuarioId || !password) {
        return res.status(400).json({ message: "Datos incompletos" });
      }
      const isValid = await storage.verifyAdminPassword(usuarioId, password);
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ message: "Error al verificar contrase\xF1a" });
    }
  });
  app2.post("/api/admin/set-password", async (req, res) => {
    try {
      const { usuarioId, password } = req.body;
      if (!usuarioId || !password || password.length < 4) {
        return res.status(400).json({ message: "Contrase\xF1a debe tener al menos 4 caracteres" });
      }
      await storage.setAdminPassword(usuarioId, password);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al establecer contrase\xF1a" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
