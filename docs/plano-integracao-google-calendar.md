# Plano de Integração com Google Calendar (Agenda/Admin)

Objetivo: habilitar duas funcionalidades principais no Admin → Agenda:
1) Criação automática de eventos no Google Calendar quando uma reserva for confirmada/atualizada/cancelada.
2) Visualização/listagem dos eventos no período selecionado, com filtros básicos.

Funcionalidades Extras (opcionais para próximas fases):
- Consulta de disponibilidade (free/busy) para evitar conflitos.
- Webhooks (notificações em tempo real) para refletir alterações feitas diretamente no Google Calendar.
- Convites/participantes (ex.: motorista/cliente recebem convite).
- Multi-calendário (por motorista/equipe/serviço) e seleção de calendário de destino.
- Lembretes/notifications, eventos recorrentes e sincronização bidirecional.

Arquitetura (resumo)
- Backend (Next.js API Routes): integração com biblioteca oficial googleapis; fluxo OAuth2; endpoints para autenticar, criar e listar eventos.
- Supabase: armazenamento seguro de tokens OAuth (access/refresh) e mapeamento reserva ↔ evento (booking_id ↔ google_event_id).
- Frontend (Admin > Agenda): componente atual passa a consumir nossos endpoints para listar eventos e criar/atualizar quando ações de reserva ocorrerem.

Escopos de Autorização (MVP)
- https://www.googleapis.com/auth/calendar.events (criar/editar eventos).

Variáveis de Ambiente
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI (ex.: https://seu-dominio.com/api/calendar/callback)
- GOOGLE_CALENDAR_ID (opcional; default: primary)

Modelo de Dados (mapeamento Reserva → Evento)
- summary: "[Reserva #{booking_code}] Nome do Cliente"
- description: detalhes da reserva (rota, voo, contato, observações)
- location: endereço de pickup/dropoff ou aeroporto
- start: data/hora de início (timezone correto)
- end: data/hora de término (timezone correto)
- attendees (opcional/extra): e-mails de motorista/cliente
- extendedProperties.private.bookingId: id interno da reserva (facilita sincronização)

Endpoints (MVP)
1) GET /api/calendar/auth → inicia OAuth e redireciona ao Google (armazena state)
2) GET /api/calendar/callback → troca code por tokens e salva no Supabase
3) GET /api/calendar/events?timeMin&timeMax&calendarId=primary → lista eventos para o período
4) POST /api/calendar/events → cria evento a partir de uma reserva
   Body (exemplo): { bookingId, calendarId?, start, end, summary?, description?, location? }

Fluxos Principais
- Autenticação: Admin realiza o login Google uma única vez; tokens ficam salvos no Supabase (refresh para renovar).
- Criação automática: ao confirmar/atualizar/cancelar uma reserva, chamamos POST /api/calendar/events (ou update/delete) e persistimos google_event_id.
- Visualização: Agenda chama GET /api/calendar/events passando timeMin/timeMax e exibe os resultados.

Segurança e Privacidade
- Não logar segredos/tokens; criptografar em repouso no Supabase.
- Usar escopo mínimo; revogar tokens quando necessário.
- Respeitar fuso horário do negócio e do calendário destino.

Testes e Critérios de Aceite (MVP)
- Conseguir autenticar e armazenar tokens no Supabase.
- Criar evento ao confirmar uma reserva e visualizar o evento no Google Calendar.
- Listar eventos do período na tela de Agenda.
- Atualizar e cancelar eventos quando a reserva muda/é cancelada.
- Tratamento de erros (ex.: tokens expirados) com renovação automática via refresh.

Roadmap (estimativa)
- Dia 1–2: Configurar projeto GCP, OAuth e endpoints de auth/callback; persistência de tokens.
- Dia 3: Implementar POST/GET de eventos e mapeamento reserva → evento.
- Dia 4: Integrar Agenda (listagem) e gatilhos de criação/atualização/cancelamento.
- Dia 5: Testes ponta a ponta e acertos de UX (timezone, loading, erros).

Extras (próximas fases)
- Free/Busy (consulta disponibilidade) para sugerir horários sem conflito.
- Webhooks (channels.watch) para refletir mudanças em tempo real.
- Multi-calendário por motorista/equipe e regras de roteamento.
- Convites e lembretes personalizados ao cliente/motorista.
- Recorrência e sincronização bidirecional com reconciliação.

Observações de Implementação
- Utilizar googleapis no backend; manter lógica sensível no servidor.
- Guardar relação booking_id ↔ google_event_id para atualização/cancelamento.
- Padronizar formatos de data (ISO) e timezone (IANA) em toda a aplicação.




documentacao api 

 # Criar eventos

bookmark_border

Imagine um app que ajude os usuários a encontrar as melhores rotas de caminhada. Ao adicionar o plano de caminhada como um evento da agenda, os usuários recebem muita ajuda para se manter organizados automaticamente. O Google Agenda ajuda a compartilhar o plano e lembra as pessoas sobre ele para que possam se preparar sem estresse. Além disso, graças à integração perfeita dos produtos do Google, o Google Now avisa sobre o horário de sair, e o Google Maps direciona as pessoas ao local da reunião a tempo.

Neste artigo, explicamos como criar eventos e adicioná-los às agendas dos usuários.

Adicionar um evento
Para criar um evento, chame o método events.insert() fornecendo pelo menos estes parâmetros:

calendarId é o identificador da agenda e pode ser o endereço de e-mail da agenda em que o evento será criado ou uma palavra-chave especial 'primary', que usa a agenda principal do usuário conectado. Se você não souber o endereço de e-mail da agenda que quer usar, verifique nas configurações da interface da Web do Google Agenda (na seção "Endereço da agenda") ou procure no resultado da chamada calendarList.list().
event é o evento a ser criado com todos os detalhes necessários, como início e fim. Os únicos campos obrigatórios são os horários start e end. Consulte a referência de event para ver o conjunto completo de campos de evento.
Especifique eventos com carimbo de data/hora usando os campos start.dateTime e end.dateTime. Para eventos de dia inteiro, use start.date e end.date.
Para criar eventos, você precisa:

Defina o escopo do OAuth como https://www.googleapis.com/auth/calendar para ter acesso de edição à agenda do usuário.
Verifique se o usuário autenticado tem acesso de gravação ao calendário com o calendarId fornecido. Por exemplo, chame calendarList.get() para o calendarId e verifique o accessRole.
Adicionar metadados de eventos
Você pode adicionar metadados de eventos ao criar um evento na agenda. Se você não adicionar metadados durante a criação, poderá atualizar muitos campos usando o events.update(). No entanto, alguns campos, como o ID do evento, só podem ser definidos durante uma operação events.insert().

Local
Adicionar um endereço no campo de local ativa recursos como "hora de sair" ou mostra um mapa com as rotas.
ID do evento
Ao criar um evento, você pode gerar seu próprio ID que esteja de acordo com nossos requisitos de formato. Isso permite que você mantenha as entidades no seu banco de dados local sincronizadas com os eventos no Google Agenda. Ele também evita a criação de eventos duplicados se a operação falhar em algum momento após ser executada com êxito no back-end do Google Agenda. Se nenhum ID de evento for fornecido, o servidor vai gerar um para você. Consulte a referência de ID do evento para mais informações.
Participantes
O evento criado aparece em todas as agendas principais do Google dos participantes incluídos com o mesmo ID de evento. Se você definir sendUpdates como "all" ou "externalOnly" na sua solicitação de inserção, os participantes correspondentes vão receber uma notificação por e-mail sobre o evento. Para saber mais, consulte eventos com vários participantes.
Os exemplos a seguir mostram como criar um evento e definir os metadados dele:

Go
Java
JavaScript
Node.js
PHP
Python
Ruby

// Refer to the Go quickstart on how to setup the environment:
// https://developers.google.com/workspace/calendar/quickstart/go
// Change the scope to calendar.CalendarScope and delete any stored credentials.

event := &calendar.Event{
  Summary: "Google I/O 2015",
  Location: "800 Howard St., San Francisco, CA 94103",
  Description: "A chance to hear more about Google's developer products.",
  Start: &calendar.EventDateTime{
    DateTime: "2015-05-28T09:00:00-07:00",
    TimeZone: "America/Los_Angeles",
  },
  End: &calendar.EventDateTime{
    DateTime: "2015-05-28T17:00:00-07:00",
    TimeZone: "America/Los_Angeles",
  },
  Recurrence: []string{"RRULE:FREQ=DAILY;COUNT=2"},
  Attendees: []*calendar.EventAttendee{
    &calendar.EventAttendee{Email:"lpage@example.com"},
    &calendar.EventAttendee{Email:"sbrin@example.com"},
  },
}

calendarId := "primary"
event, err = srv.Events.Insert(calendarId, event).Do()
if err != nil {
  log.Fatalf("Unable to create event. %v\n", err)
}
fmt.Printf("Event created: %s\n", event.HtmlLink)

Adicionar anexos do Drive a eventos
Você pode anexar arquivos do Google Drive, como atas de reuniões no Documentos, orçamentos nas Planilhas, apresentações no Apresentações ou qualquer outro arquivo relevante do Google Drive aos seus eventos da Agenda. Você pode adicionar o anexo ao criar um evento com events.insert() ou depois como parte de uma atualização, como com events.patch().

As duas partes do processo de anexar um arquivo do Google Drive a um evento são:

Receba o URL do arquivo alternateLink, title e mimeType do recurso de arquivos da API Drive, geralmente com o método files.get().
Crie ou atualize um evento com os campos attachments definidos no corpo da solicitação e o parâmetro supportsAttachments definido como true.
O exemplo de código a seguir demonstra como atualizar um evento para adicionar um anexo:

Java
PHP
Python

public static void addAttachment(Calendar calendarService, Drive driveService, String calendarId,
    String eventId, String fileId) throws IOException {
  File file = driveService.files().get(fileId).execute();
  Event event = calendarService.events().get(calendarId, eventId).execute();

  List<EventAttachment> attachments = event.getAttachments();
  if (attachments == null) {
    attachments = new ArrayList<EventAttachment>();
  }
  attachments.add(new EventAttachment()
      .setFileUrl(file.getAlternateLink())
      .setMimeType(file.getMimeType())
      .setTitle(file.getTitle()));

  Event changes = new Event()
      .setAttachments(attachments);
  calendarService.events().patch(calendarId, eventId, changes)
      .setSupportsAttachments(true)
      .execute();
}

Importante: faça uma sincronização completa de todos os eventos antes de ativar o parâmetro supportsAttachments para modificações de eventos ao adicionar suporte a anexos no app atual que armazena eventos localmente. Se você não fizer uma sincronização primeiro, poderá remover inadvertidamente os anexos atuais dos eventos do usuário.
Adicionar videoconferências e conferências por telefone a eventos
Você pode associar eventos a conferências do Hangouts e do Google Meet para permitir que os usuários se reúnam remotamente por uma ligação telefônica ou uma videochamada.

O campo conferenceData pode ser usado para ler, copiar e limpar os detalhes de uma conferência. Ele também pode ser usado para solicitar a geração de novas conferências. Para permitir a criação e modificação dos detalhes da conferência, defina o parâmetro de solicitação conferenceDataVersion como 1.

Há três tipos de conferenceData compatíveis no momento, conforme indicado pelo conferenceData.conferenceSolution.key.type:

Hangouts para consumidores (eventHangout)
Hangouts clássico para usuários do Google Workspace (descontinuado; eventNamedHangout)
Google Meet (hangoutsMeet)
Para saber qual tipo de conferência é compatível com uma determinada agenda de um usuário, consulte o conferenceProperties.allowedConferenceSolutionTypes nas coleções calendars e calendarList. Você também pode saber se o usuário prefere que o Hangouts seja criado para todos os eventos criados recentemente verificando a configuração autoAddHangouts na coleção settings.

Além do type, o conferenceSolution também fornece os campos name e iconUri, que podem ser usados para representar a solução de conferência, conforme mostrado abaixo:

JavaScript

const solution = event.conferenceData.conferenceSolution;

const content = document.getElementById("content");
const text = document.createTextNode("Join " + solution.name);
const icon = document.createElement("img");
icon.src = solution.iconUri;

content.appendChild(icon);
content.appendChild(text);

Você pode criar uma nova conferência para um evento fornecendo um createRequest com um requestId recém-gerado, que pode ser um string aleatório. As conferências são criadas de forma assíncrona, mas você pode verificar o status da solicitação a qualquer momento para informar aos usuários o que está acontecendo.

Por exemplo, para solicitar a geração de uma conferência para um evento atual:

JavaScript

const eventPatch = {
  conferenceData: {
    createRequest: {requestId: "7qxalsvy0e"}
  }
};

gapi.client.calendar.events.patch({
  calendarId: "primary",
  eventId: "7cbh8rpc10lrc0ckih9tafss99",
  resource: eventPatch,
  sendUpdates: "all",
  conferenceDataVersion: 1
}).execute(function(event) {
  console.log("Conference created for event: %s", event.htmlLink);
});

A resposta imediata a essa chamada ainda não pode conter o conferenceData totalmente preenchido. Isso é indicado por um código de status pending no campo status. O código de status muda para success depois que as informações da conferência são preenchidas. O campo entryPoints contém informações sobre quais URIs de vídeo e telefone estão disponíveis para os usuários discarem.

Se você quiser programar vários eventos do Google Agenda com os mesmos detalhes da conferência, copie todo o conferenceData de um evento para outro.

A cópia é útil em algumas situações. Por exemplo, suponha que você esteja desenvolvendo um aplicativo de recrutamento que configura eventos separados para o candidato e o entrevistador. Você quer proteger a identidade do entrevistador, mas também quer garantir que todos os participantes entrem na mesma teleconferência.

Importante: faça uma sincronização completa de todos os eventos antes de ativar o suporte a dados de conferência (definindo o parâmetro de solicitação conferenceDataVersion como 1 para modificações de eventos) ao adicionar suporte a conferência ao app atual que armazena eventos localmente. Se você não fizer uma sincronização primeiro, poderá remover inadvertidamente as conferências atuais dos eventos dos usuários.

