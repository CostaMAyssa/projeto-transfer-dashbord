page.tsx:1484   - FormData.base_price antes: 142
page.tsx:1485   - FormData.total_amount antes: 164
page.tsx:1486   - Extras atuais: Object
page.tsx:1495   - Total de extras calculado: 22
page.tsx:1503   - Novo base_price: 143
page.tsx:1504   - Novo total_amount: 165 (base: 143 + extras: 22 )
page.tsx:1503   - Novo base_price: 143
page.tsx:1504   - Novo total_amount: 165 (base: 143 + extras: 22 )
page.tsx:1481 🔧 MUDANÇA DE PREÇO PERSONALIZADO:
page.tsx:1482   - Valor do input: 144
page.tsx:1483   - Preço parseado: 144 (tipo: number )
page.tsx:1484   - FormData.base_price antes: 143
page.tsx:1485   - FormData.total_amount antes: 165
page.tsx:1486   - Extras atuais: Object
page.tsx:1495   - Total de extras calculado: 22
page.tsx:1503   - Novo base_price: 144
page.tsx:1504   - Novo total_amount: 166 (base: 144 + extras: 22 )
page.tsx:1503   - Novo base_price: 144
page.tsx:1504   - Novo total_amount: 166 (base: 144 + extras: 22 )
page.tsx:1481 🔧 MUDANÇA DE PREÇO PERSONALIZADO:
page.tsx:1482   - Valor do input: 145
page.tsx:1483   - Preço parseado: 145 (tipo: number )
page.tsx:1484   - FormData.base_price antes: 144
page.tsx:1485   - FormData.total_amount antes: 166
page.tsx:1486   - Extras atuais: Object
page.tsx:1495   - Total de extras calculado: 22
page.tsx:1503   - Novo base_price: 145
page.tsx:1504   - Novo total_amount: 167 (base: 145 + extras: 22 )
page.tsx:1503   - Novo base_price: 145
page.tsx:1504   - Novo total_amount: 167 (base: 145 + extras: 22 )
page.tsx:612 
=== 📋 ANÁLISE FRONTEND - PREPARAÇÃO DE DADOS ===
page.tsx:613 📝 FORMDATA ORIGINAL (do formulário):
page.tsx:614   - customer_name: Marcos (tipo: string )
page.tsx:615   - customer_email: marcos16@gmail.com (tipo: string )
page.tsx:616   - customer_phone: 64992019427 (tipo: string )
page.tsx:617   - vehicle_category_id: sedan (tipo: string )
page.tsx:618   - base_price: 145 (tipo: number )
page.tsx:619   - total_amount: 167 (tipo: number )
page.tsx:620   - quote_type: one-way (tipo: string )
page.tsx:621   - pickup_address: John F. Kennedy International Airport (JFK), Queens, NY (comprimento: 55 )
page.tsx:622   - destination_address: Filadèlfia, PA (comprimento: 14 )
page.tsx:623   - pickup_date: 2001-12-10 (tipo: string )
page.tsx:624   - pickup_time: 11:28 (tipo: string )
page.tsx:625   - passengers: 1 (tipo: number )
page.tsx:626   - status: draft (tipo: string )
page.tsx:628 
🔄 QUOTEDATA PROCESSADO (para envio):
page.tsx:629   - customer_name: Marcos (tipo: string )
page.tsx:630   - customer_email: marcos16@gmail.com (tipo: string )
page.tsx:631   - customer_phone: 64992019427 (tipo: string )
page.tsx:632   - vehicle_category_id: sedan (tipo: string )
page.tsx:633   - base_price: 145 (tipo: number , Number(): 145 )
page.tsx:634   - total_amount: 167 (tipo: number , Number(): 167 )
page.tsx:635   - quote_type: one-way (tipo: string )
page.tsx:636   - pickup_address: John F. Kennedy International Airport (JFK), Queens, NY (comprimento: 55 )
page.tsx:637   - destination_address: Filadèlfia, PA (comprimento: 14 )
page.tsx:638   - pickup_date: 2001-12-10 (tipo: string )
page.tsx:639   - pickup_time: 11:28 (tipo: string )
page.tsx:640   - passengers: 1 (tipo: number )
page.tsx:641   - status: draft (tipo: string )
page.tsx:643 
🔍 COMPARAÇÃO PREÇOS (ANTES vs DEPOIS):
page.tsx:644   ANTES - formData.base_price: 145 ( number )
page.tsx:645   DEPOIS - quoteData.base_price: 145 ( number )
page.tsx:646   ANTES - formData.total_amount: 167 ( number )
page.tsx:647   DEPOIS - quoteData.total_amount: 167 ( number )
page.tsx:649 
✅ VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS:
page.tsx:664   customer_name: ✅ OK
page.tsx:664   customer_email: ✅ OK
page.tsx:664   customer_phone: ✅ OK
page.tsx:664   pickup_address: ✅ OK
page.tsx:664   destination_address: ✅ OK
page.tsx:664   pickup_date: ✅ OK
page.tsx:664   pickup_time: ✅ OK
page.tsx:664   vehicle_category_id: ✅ OK
page.tsx:664   base_price: ✅ OK
page.tsx:664   total_amount: ✅ OK
page.tsx:675 
🎯 DADOS COMPLETOS ENVIADOS PARA createQuote: {
  "booking_reference": "QT623753",
  "status": "draft",
  "customer_name": "Marcos",
  "customer_email": "marcos16@gmail.com",
  "customer_phone": "64992019427",
  "quote_type": "one-way",
  "pickup_address": "John F. Kennedy International Airport (JFK), Queens, NY",
  "pickup_date": "2001-12-10",
  "pickup_time": "11:28",
  "destination_address": "Filadèlfia, PA",
  "return_date": null,
  "return_time": null,
  "service_hours": null,
  "service_type": null,
  "flight_number": "",
  "airline": "",
  "vehicle_category_id": "sedan",
  "passengers": 1,
  "luggage_large": 2,
  "luggage_small": 2,
  "base_price": 145,
  "extras_price": 22,
  "total_amount": 167,
  "extras": {
    "24f5d8cd-1957-4e31-bc0c-d5e3f89ad933": 1,
    "476f4361-622e-4b7c-bc6a-2fc06663abee": 1
  },
  "expires_days": 7,
  "notes": null
}
page.tsx:676 === FIM DA ANÁLISE FRONTEND ===

page.tsx:679 🚀 INICIANDO SALVAMENTO DO ORÇAMENTO...
page.tsx:680 📤 DADOS FINAIS SENDO ENVIADOS:
page.tsx:681   - base_price final: 145 (tipo: number )
page.tsx:682   - total_amount final: 167 (tipo: number )
page.tsx:683   - extras enviados: Object
useQuotes.ts:66 
=== 🔍 DIAGNÓSTICO COMPLETO DE CRIAÇÃO DE ORÇAMENTO ===
useQuotes.ts:67 📥 DADOS RECEBIDOS (quote): Object
useQuotes.ts:68 🔍 DADOS RECEBIDOS PARA CRIAÇÃO:
useQuotes.ts:69   - quote.base_price: 145 (tipo: number )
useQuotes.ts:70   - quote.total_amount: 167 (tipo: number )
useQuotes.ts:71   - quote.extras: Object
useQuotes.ts:72   - Dados completos recebidos: Object
useQuotes.ts:90 🔍 VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS:
useQuotes.ts:94   customer_name: ✅ OK (string) = Marcos
useQuotes.ts:94   customer_email: ✅ OK (string) = marcos16@gmail.com
useQuotes.ts:94   customer_phone: ✅ OK (string) = 64992019427
useQuotes.ts:94   quote_type: ✅ OK (string) = one-way
useQuotes.ts:94   pickup_address: ✅ OK (string) = John F. Kennedy International Airport (JFK), Queens, NY
useQuotes.ts:94   pickup_date: ✅ OK (string) = 2001-12-10
useQuotes.ts:94   pickup_time: ✅ OK (string) = 11:28
useQuotes.ts:94   destination_address: ✅ OK (string) = Filadèlfia, PA
useQuotes.ts:94   vehicle_category_id: ✅ OK (string) = sedan
useQuotes.ts:94   passengers: ✅ OK (number) = 1
useQuotes.ts:94   base_price: ✅ OK (number) = 145
useQuotes.ts:94   total_amount: ✅ OK (number) = 167
useQuotes.ts:115 📋 DADOS PROCESSADOS PARA INSERÇÃO:
useQuotes.ts:116   - quoteData.base_price: 145 (tipo: number )
useQuotes.ts:117   - quoteData.total_amount: 167 (tipo: number )
useQuotes.ts:118   - quoteData.extras: Object
useQuotes.ts:119   - quoteData.vehicle_category_id: sedan
useQuotes.ts:120   - Dados completos processados: Object
useQuotes.ts:122 
📋 COMPARAÇÃO ANTES/DEPOIS DO PROCESSAMENTO:
useQuotes.ts:123 ANTES (quote original):
useQuotes.ts:124   - base_price: 145 (tipo: number )
useQuotes.ts:125   - total_amount: 167 (tipo: number )
useQuotes.ts:126   - vehicle_category_id: sedan
useQuotes.ts:127   - status: draft
useQuotes.ts:128   - booking_reference: QT623753
useQuotes.ts:130 DEPOIS (quoteData processado):
useQuotes.ts:131   - base_price: 145 (tipo: number )
useQuotes.ts:132   - total_amount: 167 (tipo: number )
useQuotes.ts:133   - vehicle_category_id: sedan
useQuotes.ts:134   - status: draft
useQuotes.ts:135   - booking_reference: QT623753
useQuotes.ts:137 
📊 ANÁLISE COMPLETA DOS DADOS PARA INSERÇÃO:
useQuotes.ts:138 🔢 CAMPOS NUMÉRICOS:
useQuotes.ts:139   - base_price: 145 (tipo: number , válido: true )
useQuotes.ts:140   - total_amount: 167 (tipo: number , válido: true )
useQuotes.ts:141   - passengers: 1 (tipo: number , válido: true )
useQuotes.ts:142   - luggage_large: 2 (tipo: number )
useQuotes.ts:143   - luggage_small: 2 (tipo: number )
useQuotes.ts:144   - expires_days: 7 (tipo: number )
useQuotes.ts:146 📝 CAMPOS DE TEXTO:
useQuotes.ts:147   - customer_name: Marcos (comprimento: 6 )
useQuotes.ts:148   - customer_email: marcos16@gmail.com (comprimento: 18 )
useQuotes.ts:149   - customer_phone: 64992019427 (comprimento: 11 )
useQuotes.ts:150   - vehicle_category_id: sedan
useQuotes.ts:151   - quote_type: one-way
useQuotes.ts:152   - pickup_address: John F. Kennedy International Airport (JFK), Queens, NY (comprimento: 55 )
useQuotes.ts:153   - destination_address: Filadèlfia, PA (comprimento: 14 )
useQuotes.ts:155 📅 CAMPOS DE DATA/HORA:
useQuotes.ts:156   - pickup_date: 2001-12-10
useQuotes.ts:157   - pickup_time: 11:28
useQuotes.ts:158   - expires_at: 2025-09-04T21:30:23.769Z
useQuotes.ts:160 
🎯 DADOS FINAIS ENVIADOS PARA SUPABASE: {
  "booking_reference": "QT623753",
  "status": "draft",
  "customer_name": "Marcos",
  "customer_email": "marcos16@gmail.com",
  "customer_phone": "64992019427",
  "quote_type": "one-way",
  "pickup_address": "John F. Kennedy International Airport (JFK), Queens, NY",
  "pickup_date": "2001-12-10",
  "pickup_time": "11:28",
  "destination_address": "Filadèlfia, PA",
  "return_date": null,
  "return_time": null,
  "service_hours": null,
  "service_type": null,
  "flight_number": "",
  "airline": "",
  "vehicle_category_id": "sedan",
  "passengers": 1,
  "luggage_large": 2,
  "luggage_small": 2,
  "base_price": 145,
  "extras_price": 22,
  "total_amount": 167,
  "extras": {
    "24f5d8cd-1957-4e31-bc0c-d5e3f89ad933": 1,
    "476f4361-622e-4b7c-bc6a-2fc06663abee": 1
  },
  "expires_days": 7,
  "notes": null,
  "created_at": "2025-08-28T21:30:23.766Z",
  "updated_at": "2025-08-28T21:30:23.769Z",
  "expires_at": "2025-09-04T21:30:23.769Z"
}
useQuotes.ts:193 ✅ ORÇAMENTO CRIADO COM SUCESSO:
useQuotes.ts:194   - data.id: 4eb93011-5d4d-4ab1-b605-d5d80a6b4d70
useQuotes.ts:195   - data.base_price: 145 (tipo: number )
useQuotes.ts:196   - data.total_amount: 167 (tipo: number )
useQuotes.ts:197   - data.extras: Object
useQuotes.ts:198   - data.vehicle_category_id: sedan
useQuotes.ts:199   - Resultado completo: Object
useQuotes.ts:201 
✅ SUCESSO! Orçamento criado:
useQuotes.ts:202   - ID: 4eb93011-5d4d-4ab1-b605-d5d80a6b4d70
useQuotes.ts:203   - Referência: QT623753
useQuotes.ts:204   - Status: draft
useQuotes.ts:205   - Preço base: 145
useQuotes.ts:206   - Total: 167
useQuotes.ts:207   - Dados completos: Object
useQuotes.ts:208 === FIM DO DIAGNÓSTICO ===

page.tsx:691 ✅ ORÇAMENTO SALVO COM SUCESSO:
page.tsx:692   - ID salvo: 4eb93011-5d4d-4ab1-b605-d5d80a6b4d70
page.tsx:693   - base_price salvo: 145 (tipo: number )
page.tsx:694   - total_amount salvo: 167 (tipo: number )
page.tsx:695   - extras salvos: Object
page.tsx:696   - Dados completos salvos: Object
2useQuotes.ts:26 Sessão válida, token: eyJhbGciOi...
2useQuotes.ts:42 Orçamentos carregados com sucesso: 11
hot-reloader-client.js:187 [Fast Refresh] rebuilding
hot-reloader-client.js:44 [Fast Refresh] done in 7103ms