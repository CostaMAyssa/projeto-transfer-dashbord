**✅ SIM! Agora está correto!** 

Esse comando está seguindo exatamente a [documentação oficial da GoFlightLabs Flight Delay API](https://www.goflightlabs.com/flight-delay):

- ✅ **Endpoint correto**: `/flight_delays`
- ✅ **Parâmetros obrigatórios**: `delay=60` e `type=departures`
- ✅ **Chave de API**: Sua chave está incluída
- ✅ **Método**: GET

## **🚀 EXECUTE O COMANDO**

Cole e execute esse comando no PowerShell:

```powershell
Invoke-RestMethod -Uri "https://www.goflightlabs.com/flight_delays?access_key=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOWQzMWRjNjJmNmM0NWJiZjRlYzE5MjFhYTA5YjdiNjJmN2I2ZWZjYmMzNjIwMDNhZDAyNzgxZGIzNDUyNzg1NDgzYTE4YWEwYjU4N2Y2NzQiLCJpYXQiOjE3NTY5MjAzMTEsIm5iZiI6MTc1NjkyMDMxMSwiZXhwIjoxNzg4NDU2MzExLCJzdWIiOiIyNTgzMyIsInNjb3BlcyI6W119.S4f_59yamYhwst_YE8SnreQ1XhVmqQUWsB67yN1O3rFYRp4qWJ7PNIyUP2YRZeEQlvG8RC5i0dorDHpeiJQoKA&delay=60&type=departures" -Method Get
```

## **📊 O QUE ESPERAR**

Este comando deve retornar:
- **Todos os voos de partida** com atraso de **pelo menos 60 minutos**
- **Dados estruturados** com informações de atraso, horários, aeroportos, etc.
- **Status 200** se bem-sucedido

## **🔧 OUTROS TESTES ÚTEIS**

### **1. Buscar voo específico:**
```powershell
Invoke-RestMethod -Uri "https://www.goflightlabs.com/flight_delays?access_key=SUA_CHAVE&delay=0&type=departures&flight_number=3359" -Method Get
```

### **2. Buscar voos da LATAM:**
```powershell
Invoke-RestMethod -Uri "https://www.goflightlabs.com/flight_delays?access_key=SUA_CHAVE&delay=0&type=departures&airline_iata=LA" -Method Get
```

### **3. Buscar voos de GRU:**
```powershell
Invoke-RestMethod -Uri "https://www.goflightlabs.com/flight_delays?access_key=SUA_CHAVE&delay=0&type=departures&dep_iata=GRU" -Method Get
```

**Execute o comando e me diga o resultado!** 🎯