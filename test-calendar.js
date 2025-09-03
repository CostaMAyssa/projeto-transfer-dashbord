const testCalendarAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/calendar/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary: 'Teste de Evento',
        description: 'Teste da integração',
        start: '2024-01-20T10:00:00',
        end: '2024-01-20T12:00:00',
        timezone: 'America/Sao_Paulo',
        location: 'São Paulo, SP',
        userId: 'da51bd1b-4ac8-4319-9888-9838818fa8aa' // UUID de teste - em produção será dinâmico
      })
    })
    
    const result = await response.text()
    console.log('Status:', response.status)
    console.log('Response:', result)
    
    if (!response.ok) {
      console.error('Erro na API:', result)
    }
  } catch (error) {
    console.error('Erro:', error.message)
  }
}

testCalendarAPI()