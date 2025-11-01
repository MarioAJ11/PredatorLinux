# API Testing Examples

## Health Check
curl http://localhost:8080/health

## Estadísticas del Sistema
curl http://localhost:8080/api/stats

## Control de Ventiladores

### Establecer velocidad del ventilador CPU al 50%
curl -X POST http://localhost:8080/api/fans/speed \
  -H "Content-Type: application/json" \
  -d '{"fan": "cpu", "speed": 50}'

### Establecer velocidad del ventilador GPU al 80%
curl -X POST http://localhost:8080/api/fans/speed \
  -H "Content-Type: application/json" \
  -d '{"fan": "gpu", "speed": 80}'

### Activar modo automático de ventiladores
curl -X POST http://localhost:8080/api/fans/auto \
  -H "Content-Type: application/json"

## Perfiles de Rendimiento

### Activar modo Turbo
curl -X POST http://localhost:8080/api/profiles/turbo \
  -H "Content-Type: application/json" \
  -d '{"enable": true}'

### Desactivar modo Turbo
curl -X POST http://localhost:8080/api/profiles/turbo \
  -H "Content-Type: application/json" \
  -d '{"enable": false}'

### Establecer perfil Turbo (máximo rendimiento)
curl -X POST http://localhost:8080/api/profiles/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "turbo"}'

### Establecer perfil Performance
curl -X POST http://localhost:8080/api/profiles/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "performance"}'

### Establecer perfil Balanced
curl -X POST http://localhost:8080/api/profiles/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "balanced"}'

### Establecer perfil Quiet (silencioso)
curl -X POST http://localhost:8080/api/profiles/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "quiet"}'

## Pruebas de Validación

### Error: velocidad fuera de rango
curl -X POST http://localhost:8080/api/fans/speed \
  -H "Content-Type: application/json" \
  -d '{"fan": "cpu", "speed": 150}'

### Error: ventilador inválido
curl -X POST http://localhost:8080/api/fans/speed \
  -H "Content-Type: application/json" \
  -d '{"fan": "invalid", "speed": 50}'

### Error: modo inválido
curl -X POST http://localhost:8080/api/profiles/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "invalid"}'

### Error: campo faltante
curl -X POST http://localhost:8080/api/profiles/turbo \
  -H "Content-Type: application/json" \
  -d '{}'
