-- Tabla para características de CASAS
CREATE TABLE IF NOT EXISTS casas (
    id_casa SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_frente DECIMAL(10, 2),
    area_fondo DECIMAL(10, 2),
    anos_construccion INTEGER,
    metros_cuadrados DECIMAL(10, 2),
    pisos INTEGER,
    habitaciones INTEGER,
    banos INTEGER,
    patio BOOLEAN DEFAULT FALSE,
    jardin BOOLEAN DEFAULT FALSE,
    balcon BOOLEAN DEFAULT FALSE,
    terraza BOOLEAN DEFAULT FALSE,
    descripcion_acabados TEXT,
    sala_comedor VARCHAR(50),
    cocina VARCHAR(50),
    zona_lavado VARCHAR(50),
    parqueadero VARCHAR(50)
);

-- Tabla para características de APARTAMENTOS
CREATE TABLE IF NOT EXISTS apartamentos (
    id_apartamento SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_total DECIMAL(10, 2),
    pisos_edificio INTEGER,
    torre INTEGER,
    habitaciones INTEGER,
    banos INTEGER,
    balcon BOOLEAN DEFAULT FALSE,
    ascensor BOOLEAN DEFAULT FALSE,
    vigilancia BOOLEAN DEFAULT FALSE,
    administracion DECIMAL(10, 2),
    zona_social TEXT,
    descripcion TEXT,
    cocina VARCHAR(50),
    parqueadero VARCHAR(50)
);

-- Tabla para características de APARTAESTUDIOS
CREATE TABLE IF NOT EXISTS apartaestudios (
    id_apartaestudio SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_total DECIMAL(10, 2),
    bano BOOLEAN DEFAULT FALSE,
    parqueadero BOOLEAN DEFAULT FALSE,
    balcon BOOLEAN DEFAULT FALSE,
    amoblado BOOLEAN DEFAULT FALSE,
    cocina VARCHAR(50),
    descripcion_acabados TEXT
);

-- Tabla para características de LOCALES
CREATE TABLE IF NOT EXISTS locales (
    id_local SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_total DECIMAL(10, 2),
    frente DECIMAL(10, 2),
    fondo DECIMAL(10, 2),
    altura DECIMAL(10, 2),
    entrepiso BOOLEAN DEFAULT FALSE,
    tiempo BOOLEAN DEFAULT FALSE,
    parqueadero TEXT,
    descripcion_acabados TEXT,
    zona_local VARCHAR(50)
);

-- Tabla para características de BODEGAS
CREATE TABLE IF NOT EXISTS bodegas (
    id_bodega SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_construida DECIMAL(10, 2),
    altura_libre DECIMAL(10, 2),
    tipo_puerta_carga VARCHAR(50),
    capacidad_carga TEXT,
    oficinas BOOLEAN DEFAULT FALSE,
    banos BOOLEAN DEFAULT FALSE,
    vestier BOOLEAN DEFAULT FALSE,
    descripcion_acabados TEXT
);

-- Tabla para características de FINCAS
CREATE TABLE IF NOT EXISTS fincas (
    id_finca SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_total DECIMAL(10, 2),
    area_cultivable DECIMAL(10, 2),
    area_construcciones DECIMAL(10, 2),
    fuentes_agua BOOLEAN DEFAULT FALSE,
    casa_principal BOOLEAN DEFAULT FALSE,
    otras_construcciones TEXT,
    cultivos_actuales TEXT,
    descripcion_acabados TEXT,
    luz BOOLEAN DEFAULT FALSE,
    cercas BOOLEAN DEFAULT FALSE,
    unidad_area VARCHAR(50),
    topografia VARCHAR(50),
    vias_acceso VARCHAR(50)
);

-- Tabla para características de LOTES
CREATE TABLE IF NOT EXISTS lotes (
    id_lote SERIAL PRIMARY KEY,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    area_total DECIMAL(10, 2),
    tipo_lote VARCHAR(50),
    topografia VARCHAR(50),
    servicios_disponibles TEXT,
    uso_suelo TEXT,
    descripcion TEXT
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_casas_inmueble ON casas(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_apartamentos_inmueble ON apartamentos(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_apartaestudios_inmueble ON apartaestudios(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_locales_inmueble ON locales(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_bodegas_inmueble ON bodegas(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_fincas_inmueble ON fincas(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_lotes_inmueble ON lotes(id_inmueble);
