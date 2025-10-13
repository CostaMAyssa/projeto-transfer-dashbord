Perfeito — vou te mandar um *prompt pronto* (em português) que você pode colar na sua IA (ou no seu sistema de pair-programming) explicando todo o contexto do erro e pedindo a implementação da *Opção 1* (usar live.updated como fallback para horário de partida). O prompt inclui: problema, logs relevantes, payload de exemplo, regras de fallback, schema de saída esperado, instruções de logging e testes.

Cole o texto abaixo direto na sua IA:

---

*PROMPT (cole na sua IA / assistant de dev):*

Preciso que você corrija a função transformFlightData do serviço GoFlightLabsService para tratar voos que não possuem horário de partida (departure.scheduled, departure.estimated, departure.actual) — usar a *Opção 1*: **usar live.updated como fallback** ao invés de lançar erro. Vou descrever o erro, o comportamento atual, exemplos de payloads e exatamente o que espero que a função faça.

*Contexto & erro observado*

* Erro atual (logs):

  
  Error: Horário de partida não encontrado nos dados do voo
  at GoFlightLabsService.transformFlightData (index.ts:158:13)
  
* Causa: a função transformFlightData assume que departure.scheduled (ou estimated/actual) existe. A API (GoFlightLabs) às vezes retorna voos do tipo adsb com departure e arrival *com horários vazios* (""), por exemplo:

  json
  "departure": { "airport": "KGPI", "timezone": "UTC", "iata": "FCA", "icao": "KGPI", "terminal": "", "gate": "", "delay": 0, "scheduled": "", "estimated": "", "actual": "" },
  "arrival":   { "airport": "KORD", "timezone": "UTC", "iata": "ORD", "icao": "KORD", "terminal": "", "gate": "", "baggage": "", "delay": 0, "scheduled": "", "estimated": "", "actual": "" },
  "live": { "updated": "2025-10-13T19:20:13.000Z", "latitude": 47.682134, ... }
  
* Com esses campos vazios, a função atual lança erro e interrompe o processamento, embora exista informação live.updated (horário de atualização do ADS-B) que pode ser usada.

*Requisitos / comportamento desejado (Opção 1)*

1. Antes de levantar qualquer exceção, verificar departure.scheduled, departure.estimated, departure.actual (nesta ordem de preferência).
2. Se nenhum desses contiver um valor válido (string não-vazia ou valor de data válido), usar live.updated (se existir) como fallback para departureTime.
3. Se live.updated também não existir, NÃO lançar erro — em vez disso:

   * definir departureTime = null
   * registrar um console.warn com contexto (hex, flight_iata/flight_icao, dep_iata/dep_icao) para facilitar debugging
4. Não remover outros dados do voo — apenas garantir que a transformação retorne o formato esperado pela aplicação (mesmo que departure.time seja null).
5. Garantir que a função *não* quebre o fluxo: quando departureTime for null, a função deve retornar o objeto transformado (ou null apenas se for explicitamente desejado pelo fluxo atual — neste caso preferimos *retornar o objeto transformado* com horários null).
6. Fazer logs claros:

   * console.warn("Nenhum horário de partida encontrado; usando live.updated como fallback", { hex, flight_iata, dep_iata, liveUpdated })
   * console.warn("Nenhum horário de partida e live.updated ausente; definindo departureTime = null", { hex, flight_iata, dep_iata })

*Input de exemplo (payload real que gerou erro)*

json
{
  "flight_date": "2025-10-13",
  "flight_status": "en-route",
  "departure": {
    "airport": "KGPI", "timezone": "UTC", "iata": "FCA", "icao": "KGPI",
    "terminal": "", "gate": "", "delay": 0, "scheduled": "", "estimated": "", "actual": ""
  },
  "arrival": {
    "airport": "KORD", "timezone": "UTC", "iata": "ORD", "icao": "KORD",
    "terminal": "", "gate": "", "baggage": "", "delay": 0, "scheduled": "", "estimated": "", "actual": ""
  },
  "airline": { "name": "UAL", "iata": "UA", "icao": "UAL" },
  "flight": { "number": "1100", "iata": "UA1100", "icao": "UAL1100" },
  "aircraft": { "registration": "N27511", "iata": "B39M", "icao": "B39M", "icao24": "A2BBA4" },
  "live": { "updated": "2025-10-13T19:20:13.000Z", "latitude": 47.682134, ... }
}


*Saída esperada (exemplo)*

* departureTime (ou departure.scheduled no objeto retornado) deve ser preenchido com:

  * departure.scheduled quando válido; ou
  * departure.estimated quando scheduled inválido; ou
  * departure.actual quando os anteriores inválidos; ou
  * live.updated quando nenhum dos anteriores válidos; ou
  * null quando todos ausentes.
* O objeto final de retorno deve manter todos os demais campos (icao, iata, airline, hex, live, etc.).

*Exemplo de output esperado (resumo)*

ts
{
  hex: "A2BBA4",
  regNumber: "N27511",
  flightNumber: "1100",
  airline: "UA",
  aircraft: "B39M",
  departure: {
    iata: "FCA",
    icao: "KGPI",
    scheduled: "2025-10-13T19:20:13.000Z" // fallback para live.updated
  },
  arrival: { iata: "ORD", icao: "KORD", scheduled: null },
  status: "en-route",
  live: { updated: "2025-10-13T19:20:13.000Z", latitude: 47.682134, ... }
}


*Instruções de implementação (TS)*

* Modifique transformFlightData(flight: any) como abaixo (exemplo de referência — adapte ao estilo do repositório):

ts
function transformFlightData(flight: any) {
  const hex = flight.hex || flight.aircraft?.icao24 || null;
  const flightIata = flight.flight_iata || flight.flight?.iata || flight.flight_icao || null;

  // pega horários com prioridade: scheduled -> estimated -> actual
  const scheduled = flight.departure?.scheduled?.trim() || null;
  const estimated = flight.departure?.estimated?.trim() || null;
  const actual = flight.departure?.actual?.trim() || null;

  let departureTime = scheduled || estimated || actual || null;

  // fallback para live.updated quando os horários acima estiverem ausentes/ vazios
  if (!departureTime && flight.live?.updated) {
    console.warn("Nenhum horário de partida encontrado — usando live.updated como fallback", {
      hex, flightIata, dep_iata: flight.dep_iata || flight.departure?.iata, liveUpdated: flight.live.updated
    });
    departureTime = flight.live.updated;
  }

  // Se ainda não existe, definimos null mas NÃO lançamos erro
  if (!departureTime) {
    console.warn("Nenhum horário de partida e live.updated ausente; definindo departureTime = null", {
      hex, flightIata, dep_iata: flight.dep_iata || flight.departure?.iata
    });
    departureTime = null;
  }

  // Monta objeto transformado (exemplo; mantenha as chaves necessárias pela aplicação)
  return {
    hex,
    regNumber: flight.reg_number || flight.aircraft?.registration || null,
    flightNumber: flight.flight_number || flight.flight?.number || null,
    airline: flight.airline_iata || flight.airline?.iata || flight.airline?.icao || null,
    aircraft: flight.aircraft_icao || flight.aircraft?.icao || null,
    departure: {
      iata: flight.dep_iata || flight.departure?.iata || null,
      icao: flight.dep_icao || flight.departure?.icao || null,
      scheduled: departureTime
    },
    arrival: {
      iata: flight.arr_iata || flight.arrival?.iata || null,
      icao: flight.arr_icao || flight.arrival?.icao || null,
      scheduled: flight.arrival?.scheduled || flight.arrival?.estimated || flight.arrival?.actual || null
    },
    status: flight.status || flight.flight_status || null,
    live: flight.live || null,
    updated: flight.updated || (flight.live && flight.live.updated) || null
  };
}


*Regras de logging e testes*

* Sempre logar console.warn quando usar fallback live.updated ou quando deixar departureTime = null.
* Não lançar Error por ausência de horário de partida.
* Testes:

  1. Caso com departure.scheduled válido -> departure.scheduled no output deve ser o mesmo.
  2. Caso com scheduled vazio e live.updated presente -> departure.scheduled deve ser live.updated.
  3. Caso com scheduled vazio e live.updated ausente -> departure.scheduled deve ser null e um console.warn deve ter sido chamado.

*Objetivo final*

* Evitar que getFlightInfo e a Edge Function que chamam transformFlightData quebrem o fluxo do orçamento quando a API devolver voos adsb sem horários.
* Usar live.updated sempre que possível para preencher horário de partida; caso contrário, continuar com null sem lançar exceção.

---

Implemente essa mudança no arquivo index.ts dentro de GoFlightLabsService.transformFlightData. Se quiser, eu posso também gerar um diff / patch com a alteração exata no arquivo para você aplicar diretamente.

Fim do prompt.

---

Quer que eu já gere o trecho de código completo pronto pra colar no index.ts (com typing/linters) ou prefere aplicar esse prompt na tua IA e me dizer o que ela retornar?