openapi: 3.0.2 
info: 
  title: AeroAPI 
  version: 4.17.1 
  description: | 
    # Introdução 
    A AeroAPI é uma API simples, baseada em consultas, que oferece aos desenvolvedores de software acesso 
    a uma variedade de dados de voo da FlightAware. Os usuários podem obter dados atuais ou 
    históricos. A AeroAPI é uma API RESTful que fornece 
    dados de aviação precisos e acionáveis. Com a introdução do Foresight™, os clientes 
    têm acesso aos dados que impulsionam mais da metade dos 
    ETAs preditivos das companhias aéreas nos EUA. 

    ## Categorias 
    O AeroAPI é dividido em várias categorias para facilitar a 
    descoberta. 
    - Voos: informações resumidas, rotas planejadas, posições e muito mais 
    - Foresight: posições de voo aprimoradas com o FlightAware Foresight™ 
    - Aeroportos: informações de aeroporto e recursos no estilo FIDS 
    - Operadores: informações de operadores e recursos de atividade da frota 
    - Alertas: configurar alertas de voo e destinos de entrega 
    - Histórico: acesso ao histórico de voos para vários endpoints 
    - Diversos: interrupção de voo, informações de programação futura e informações do proprietário da aeronave 

    ## Ferramentas de Desenvolvimento 
    O AeroAPI é definido usando a OpenAPI Spec 3.0, o que significa que pode ser facilmente 
    importado para ferramentas como o Postman. Para começar, tente importar a 
    especificação da API usando as 
    [instruções do Postman](https://learning.postman.com/docs/integrations/available-integrations/working-with-openAPI/). 
    Uma vez importado como uma coleção, apenas o campo "Valor" sob o A aba Autorização da coleção 
    precisa ser preenchida e salva antes de realizar chamadas. 

    A especificação AeroAPI OpenAPI está localizada em: 
    https://flightaware.com/commercial/aeroapi/resources/aeroapi-openapi.yml 

    Nosso [projeto AeroApps de código aberto](/aeroapi/portal/resources) 
    fornece uma pequena coleção de serviços e aplicativos de exemplo para ajudar 
    você a começar. 

    O AeroApp do Sistema de Exibição de Informações de Voo (FIDS) é um exemplo de 
    aplicativo multicamadas que utiliza diversas linguagens e contêineres Docker. 
    Ele demonstra conectividade, cache de dados, apresentação de voo e aproveitamento de mapas de voo. 

    O AeroApp Alertas demonstra o uso do AeroAPI para definir, editar e 
    receber alertas em um aplicativo de exemplo com um backend Python Dockerizado 
    e um frontend React. 

    Nossa interface de teste de notificação push AeroAPI [interface](/commercial/aeroapi/send.rvt)
    fornece uma maneira rápida e fácil de testar a entrega de alertas personalizados via push AeroAPI. 
tags: 
  - nome: voos 
  - nome: previsão 
    descrição: | 
      Os endpoints do Foresight fornecem acesso aos modelos preditivos e previsões do Foresight da FlightAware 
      para eventos importantes. Nossos modelos avançados de aprendizado de máquina (ML) identificam os principais 
      fatores de influência para um voo para prever eventos futuros em tempo real, fornecendo 
      insights sem precedentes para melhorar a eficiência operacional e facilitar uma melhor 
      tomada de decisão no ar e no solo. Para saber mais sobre o poder do Foresight, 
      visite https://www.flightaware.com/commercial/foresight/ 

      Cada um desses endpoints espelha um endpoint equivalente não Foresight de funcionalidade semelhante, 
      com a adição de todos os valores 'previstos' de ML incluídos na resposta do Foresight. A 
      respectiva resposta do endpoint não Foresight inclui um sinalizador, 'foresight_predictions_available', 
      que pode ser usado opcionalmente como um gatilho para obter e alavancar as previsões do Foresight conforme a 
      necessidade e gerenciar custos. O Foresight está disponível apenas para clientes Premium. 
      Entre em contato com integrationsales@flightaware.com para obter mais informações, detalhes de preços e para 
      habilitar sua conta para o Foresight. 
  - nome: aeroportos 
  - nome: operadores 
  - nome: alertas 
    descrição: | 
      O AeroAPI Alerts pode ser usado para configurar e receber alertas em tempo real sobre 
      eventos importantes de voo. Com alertas personalizáveis ​​oferecidos por nossos endpoints de alerta, o AeroAPI permite que 
      os usuários selecionem seletivamente vários tipos de eventos/filtros para alertar. Ao fazer isso, 
      você pode receber alertas personalizados enviados a você para eventos como plano de voo 
      arquivado, partida do voo (ida e volta), chegada do voo (entrada e saída) e muito mais! 

      Para começar a usar o alerta, o endpoint **PUT /alerts/endpoint** deve primeiro ser usado 
      para configurar a URL padrão de toda a conta para a qual os alertas serão entregues. Esta etapa deve 
      ser realizada antes que qualquer alerta possa ser configurado e servirá como a URL de fallback para a qual todos 
      os alertas serão enviados para a conta se uma URL de entrega específica não for designada em um 
      alerta específico. Se isso não for feito antes de configurar os alertas, você 
      receberá um erro 400 com uma mensagem de erro lembrando-o desta etapa ao tentar interagir 
      com o endpoint **POST /alerts**. Após definir uma URL por meio do endpoint **PUT /alerts/endpoint**,
      os alertas podem ser configurados usando o endpoint **POST /alerts**. O endpoint **GET /alerts** 
      também pode ser usado para recuperar todos os alertas configurados atualmente associados à sua chave AeroAPI. 
      O endpoint **GET /alerts** permitirá que você recupere facilmente o ID de quaisquer alertas específicos de 
      interesse configurados para a conta, o que pode permitir que você use os endpoints **GET** **PUT** e **DELETE** 
      **/alerts/{id}** para recuperar, atualizar e excluir alertas específicos. 

      Ao configurar um alerta individual, o campo *target_url* pode ser definido como uma URL 
      diferente do endpoint de destino de toda a conta definido por meio do campo **PUT /alerts/endpoint**. Se 
      o campo *target_url* for definido em um alerta, esse alerta específico será entregue ao 
      *target_url* especificado em vez do padrão para toda a conta. Se esse campo não estiver 
      configurado para o alerta, o alerta será entregue ao endpoint padrão para toda a conta. 
      Ao definir este campo, é possível facilmente direcionar diferentes alertas a serem recebidos por diferentes endpoints, 
      o que pode ser útil para configurar alertas por aplicativo ou enviar alertas para um 
      ambiente de desenvolvimento alternativo sem precisar ajustar uma configuração de alerta de produção. 

      Para cada alerta configurado, eventos um-para-muitos podem ser definidos para entrega de alertas. Embora a maioria 
      dos eventos resulte em uma entrega de alerta, tanto o evento de *chegada* quanto o de *partida* podem 
      resultar em múltiplos alertas entregues (chamados de agrupados). O evento de *partida* agrupa o 
      alerta de partida (real FORA do solo), juntamente com o alerta arquivado do plano de voo e até 5 
      alterações por partida, que podem incluir alertas para atrasos significativos na partida de mais de 
      30 minutos, mudanças de portão e atrasos no aeroporto. Os clientes da FlightAware Global 
      também receberão alertas de *Ligado* e *Pronto para taxiar* como parte do pacote de partida. O evento *chegada* 
      agrupa o alerta de chegada (realmente EM solo), juntamente com até 5 alterações de rota 
      identificadas (incluindo atrasos de mais de 30 minutos e excluindo desvios). Os clientes da FlightAware Global também receberão 
      os horários de *paradas de táxi* como parte do pacote *chegada*. Definir um tipo de pacote e um tipo desagrupado para um 
      On/Off resultará em apenas um alerta caso os eventos possam se sobrepor. 

      Se for necessário alterar as configurações de alerta, 
      é preferível atualizar um alerta usando o endpoint **PUT /alerts/{id}** e um identificador de alerta exclusivo (id) em vez de criar um alerta adicional.
      Ao fazer isso, você pode evitar a entrega de alertas duplicados, o que poderia criar ruído desnecessário 
      se eles não forem mais de interesse. 

      Se em algum momento houver necessidade de excluir um alerta, o endpoint **DELETE alerts/{id}** pode ser 
      aproveitado para excluir um alerta para que ele não seja mais entregue. Como um lembrete, 
      IDs de alerta específicos podem ser recuperados do endpoint **GET /alerts**. 
  - nome: histórico 
  - nome: diversos 
servidores: 
  - url: 'https://{env}.flightaware.com/aeroapi' 
    variáveis: 
      env: 
        padrão: aeroapi 
        enum: 
          - aeroapi 
componentes: 
  securitySchemes: 
    ApiKeyAuth: 
      tipo: apiKey 
      in: cabeçalho 
      nome: x-apikey 
      descrição: | 
        Ao contrário das versões anteriores do AeroAPI, a autenticação agora é controlada por 
        uma chave de API que deve ser definida no cabeçalho ```x-apikey```. Seu 
        nome de usuário do FlightAware não é usado ao autenticar na API. 
security: 
  - ApiKeyAuth: [] 
paths: 
  /flights/search: 
    get: 
      operationId: get_flights_by_search 
      summary: Pesquisar voos 
      description: | 
        Pesquisar voos aéreos comparando-os com vários parâmetros, incluindo 
        dados geoespaciais. Usa uma sintaxe de consulta simplificada em comparação com 
        /flights/search/advanced. 
      tags: 
        - flights 
      parameters: 
        - name: query 
          in: query 
          description: | 
            Consulta para pesquisar voos com uma sintaxe simplificada (em comparação com 
            /flights/search/advanced). Não deve exceder 1000 bytes de comprimento. 
            A sintaxe da consulta permite a filtragem por caixa de latitude/longitude, identificador da aeronave 
            com curingas, tipo com curingas, prefixo, aeroporto de origem, 
            aeroporto de destino, aeroporto de origem ou destino, velocidade em solo e 
            altitude. Ela aceita termos de pesquisa em uma única string contendo pares "-chave/ 
            valor". Codeshares e identificadores alternativos NÃO são pesquisados ​​ao 
            usar a cláusula -idents. 

            As chaves incluem: 
            * `-prefix STRING` 
            * `-type STRING` 
            * `-idents STRING` 
            * `-identOrReg STRING` 
            * `-airline STRING` 
            * `-destination STRING` 
            * `-origin STRING`
            * `-originOrDestination STRING` 
            * `-aboveAltitude INTEGER` 
            * `-belowAltitude INTEGER` 
            * `-aboveGroundspeed INTEGER` 
            * `-belowGroundspeed INTEGER` 
            * `-latlong "MINLAT MINLON MAXLAT MAXLON"` 
            * `-filter {ga|airline}` 
          esquema: 
            tipo: string 
            exemplo: | 
              -latlong "44.953469 -111.045360 40.962321 -104.046577" 
        - in: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - in: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    necessário: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: matriz 
                    itens: 
                      allOf: 
                        - título: InFlightStatus 
                          tipo: objeto 
                          propriedades: 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código do operador seguido pelo número do voo
                                (para voos comerciais) ou o registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              type: string 
                              nullable: true 
                              description: | 
                                O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              type: string 
                              nullable: true 
                              description: | 
                                O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                            fa_flight_id: 
                              type: string 
                              description: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ou string ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  anulável: true 
                                code_lid: 
                                  tipo: string
                                  descrição: | 
                                    Código LID 
                                  anulável: true 
                                fuso horário: 
                                  tipo: string 
                                  descrição: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  anulável: true 
                                  exemplo: América/Nova_Iorque 
                                nome: 
                                  tipo: string 
                                  descrição: | 
                                    Nome comum do aeroporto 
                                  anulável: true 
                                  exemplo: LaGuardia 
                                cidade: 
                                  tipo: string 
                                  descrição: | 
                                    Cidade mais próxima do aeroporto 
                                  anulável: true 
                                  exemplo: Nova Iorque 
                                airport_info_url: 
                                  tipo: string 
                                  anulável: true 
                                  formato: uri-reference 
                                  descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              obrigatório: 
                                - código 
                                - airport_info_url 
                            destino: 
                              descrição: | 
                                Informações para o aeroporto de destino deste voo. 
                              título: FlightAirportRef 
                              tipo: objeto 
                              anulável: true 
                              propriedades: 
                                código: 
                                  tipo: string 
                                  descrição: | 
                                    Código ou string ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  anulável: true 
                                code_icao: 
                                  tipo: string
                                  descrição: | 
                                    Código ICAO 
                                  anulável: true 
                                code_iata: 
                                  tipo: string 
                                  descrição: | 
                                    Código IATA 
                                  anulável: true 
                                code_lid: 
                                  tipo: string 
                                  descrição: | 
                                    Código LID 
                                  anulável: true 
                                fuso horário: 
                                  tipo: string 
                                  descrição: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  anulável: true 
                                  exemplo: America/New_York 
                                nome: 
                                  tipo: string 
                                  descrição: | 
                                    Nome comum do aeroporto 
                                  anulável: true 
                                  exemplo: LaGuardia 
                                cidade: 
                                  tipo: string 
                                  descrição: | 
                                    Cidade mais próxima do aeroporto 
                                  anulável: true 
                                  exemplo: Nova York 
                                airport_info_url: 
                                  tipo: string 
                                  anulável: true 
                                  formato: uri-reference 
                                  descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              obrigatório: 
                                - código 
                                - airport_info_url 
                            waypoints: 
                              tipo: array 
                              itens: 
                                tipo: número 
                              descrição: | 
                                Waypoints da rota como um array de latitudes e longitudes alternadas. 
                            first_position_time:
                              tipo: string 
                              anulável: true 
                              formato: data e hora 
                              descrição: Carimbo de data e hora de quando a primeira posição deste voo foi recebida. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            last_position: 
                              tipo: objeto 
                              descrição: Posição mais recente recebida para este voo. 
                              título: FlightPosition 
                              anulável: true 
                              propriedades: 
                                fa_flight_id: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: | 
                                    Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                                    posição. Este campo é preenchido apenas por `/flights/search/positions` 
                                    (em outros casos, o usuário já terá especificado o fa_flight_id). 
                                altitude: 
                                  tipo: inteiro 
                                  descrição: Altitude da aeronave em centenas de pés 
                                altitude_change: 
                                  tipo: string 
                                  anulável: false 
                                  descrição: | 
                                    C quando a aeronave estiver subindo, D quando estiver descendo e - quando a 
                                    altitude estiver sendo mantida. 
                                  enum: 
                                    - C 
                                    - D 
                                    - '-' 
                                groundspeed: 
                                  tipo: inteiro 
                                  descrição: Velocidade em solo mais recente (nós) 
                                título: 
                                  tipo: inteiro 
                                  anulável: verdadeiro 
                                  descrição: Rumo da aeronave em graus (0-360) 
                                  mínimo: 0 
                                  máximo: 360 
                                latitude: 
                                  tipo: número
                                  descrição: Posição de latitude mais recente 
                                longitude: 
                                  tipo: número 
                                  descrição: Posição de longitude mais recente 
                                timestamp: 
                                  tipo: string 
                                  formato: data-hora 
                                  descrição: Hora em que a posição foi recebida 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                update_type: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: | 
                                    P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                                    D=link de dados, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                                    S=baseado no espaço 
                                  enum: 
                                    - P 
                                    - O 
                                    - Z 
                                    - A 
                                    - M 
                                    - D 
                                    - X 
                                    - S 
                                    - nulo 
                              obrigatório: 
                                - fa_flight_id 
                                - altitude 
                                - altitude_change 
                                - velocidade no solo 
                                - rumo 
                                - latitude 
                                - longitude 
                                - timestamp 
                                - update_type 
                            bounding_box: 
                              tipo: matriz 
                              anulável: true 
                              descrição: | 
                                Lista de 4 coordenadas representando as bordas de uma caixa que 
                                contém inteiramente as posições deste voo. A ordem das coordenadas são os 
                                lados superior, esquerdo, inferior e direito da caixa. 
                              maxItems: 4 
                              minItems: 4 
                              itens:
                                tipo: número 
                            ident_prefix: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Um código de prefixo identificador de um ou dois caracteres (valores comuns: G ou GG 
                                Evacuação Médica, L Salva-vidas, A Táxi Aéreo, H Pesado, M Médio). 
                            aircraft_type: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido. 
                            actual_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de partida da pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                          obrigatório: 
                            - ident 
                            - fa_flight_id 
                            - actual_off 
                            - actual_on - 
                            origin 
                            - destination 
                            - waypoints - 
                            first_position_time 
                            - last_position 
                            - bounding_box 
                            - ident_prefix 
                            - aircraft_type 
                        - título: ForesightPredictionsAvailable 
                          tipo: objeto 
                          propriedades: 
                            foresight_predictions_available: 
                              tipo: booleano 
                              descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade AeroAPI /foresight.
                              exemplo: true 
                          obrigatório: 
                            - foresight_predictions_available 
                        - título: ForesightLegacyDummy 
                          tipo: objeto 
                          propriedades: 
                            predict_out: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: null 
                            predict_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de partida da pista. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: null 
                            predict_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de chegada à pista. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: null 
                            predict_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de chegada do portão. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: null 
                            predict_out_source: 
                              tipo: string 
                              anulável: true 
                              descrição: Indicador de origem da hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                              enum: 
                                - null 
                                - Previsão 
                                - Média Histórica 
                            predict_off_source: 
                              type: string 
                              nullable: true 
                              description: Indicador de origem do horário previsto para o evento de saída da pista. Disponível apenas nos endpoints /foresight.
                              enum: 
                                - null 
                                - Previsão 
                                - Média Histórica 
                            prediction_on_source: 
                              type: string 
                              nullable: true 
                              description: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível somente nos endpoints /foresight. 
                              enum: 
                                - null 
                                - Previsão 
                                - Média Histórica 
                            prediction_in_source: 
                              type: string 
                              nullable: true 
                              description: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível somente nos endpoints /foresight. 
                              enum: 
                                - null 
                                - Previsão 
                                - Média Histórica 
                          required: 
                            - prediction_out 
                            - prediction_off 
                            - prediction_on 
                            - prediction_in 
                            - prediction_out_source 
                            - prediction_off_source 
                            - prediction_on_source 
                            - prediction_in_source 
                required: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). A consulta pode estar vazia. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  /flights/search/positions: 
    obter: 
      operationId: get_flights_by_position_search 
      resumo: Pesquisar posições de voo 
      descrição: | 
        Retorna posições de voo com base em parâmetros de pesquisa geoespacial. Isso 
        permite localizar voos que já voaram dentro de uma 
        caixa específica de latitude/longitude, velocidade em solo e altitude. Ele recebe 
        termos de pesquisa em uma única string composta por elementos {operator key value} 
        e retorna uma matriz de estruturas de voo. Cada termo de pesquisa deve estar 
        entre chaves. Vários termos de pesquisa podem ser combinados em um 
        "e" booleano implícito, separando os termos com pelo menos um espaço. 
        Esta função pesquisa apenas dados de voo que representam aproximadamente as 
        últimas 24 horas. 

        Os operadores suportados incluem (observe que os operadores recebem números diferentes de argumentos): 

        * falso - os resultados devem ter a chave booleana especificada definida como falso. Exemplo: {false preferred} 
        * true - os resultados devem ter a chave booleana especificada definida como um valor true. Exemplo: {true preferred} 
        * null - os resultados devem ter a chave especificada definida como um valor nulo. Exemplo: {null waypoints} 
        * notnull - os resultados devem ter a chave especificada não definida como um valor nulo. Exemplo: {notnull aircraftType} 
        * = - os resultados devem ter uma chave que corresponda exatamente ao valor especificado. Exemplo: {= fp C172} 
        * != - os resultados devem ter uma chave que não corresponda ao valor especificado. Exemplo: {!= prefix H} * < - os resultados 
        devem ter uma chave que seja lexicograficamente menor que um valor especificado. Exemplo: {< arrivalTime 1276811040} 
        * \> - os resultados devem ter uma chave que seja lexicograficamente maior que um valor especificado. Exemplo: {> speed 500} 
        * <= - os resultados devem ter uma chave que seja lexicograficamente menor ou igual a um valor especificado. Exemplo: {<= alt 8000} 
        * \>= - os resultados devem ter uma chave que seja lexicograficamente maior ou igual a um valor especificado.
        * match - os resultados devem ter uma chave que corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {match ident AAL*} 
        * notmatch - os resultados devem ter uma chave que não corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {notmatch aircraftType B76*} 
        * range - os resultados devem ter uma chave que esteja numericamente entre os dois valores especificados. Exemplo: {range alt 8000 20000} 
        * in - os resultados devem ter uma chave que corresponda exatamente a um dos valores especificados. Exemplo: {in orig {KLAX KBUR KSNA KLGB}} 

        Os nomes de chave suportados incluem (observe que nem todos esses nomes de chave são retornados na estrutura do resultado e alguns têm nomes ligeiramente diferentes): 

        * alt - Altitude, medida em centenas de pés ou Nível de Voo. 
        * altChange - um código de um caractere que indica a mudança de altitude. 
        * cid - um código cid de três caracteres 
        * clock - carimbo de data/hora UNIX em segundos desde 1970 
        * fp - identificador exclusivo atribuído pelo FlightAware para este voo, também conhecido como fa_flight_id. 
        * gs - velocidade em solo, medida em nós. 
        * lat - latitude da posição relatada. 
        * lon - longitude da posição relatada 
        * updateType - fonte da última posição relatada (P=projetada, O=oceânica, Z=radar, A=ADS-B, M=multilateração, D=link de dados, X=superfície e próxima à superfície (ADS-B e ASDE-X), S=baseada no espaço) 
      tags: 
        - voos 
      parâmetros: 
        - nome: consulta 
          em: 
          descrição da consulta: | 
            Consulta para pesquisar posições de voos. Não deve exceder 1000 bytes 
            de comprimento. Os critérios de pesquisa são aplicados a todas as posições de um 
            voo. Esta função pesquisa apenas voos nas 
            últimas 24 horas aproximadamente. Os operadores suportados incluem (observe que os operadores 
            aceitam números diferentes de argumentos): 

            * false - os resultados devem ter a chave booleana especificada definida como false. Exemplo: {false preferred} 
            * true - os resultados devem ter a chave booleana especificada definida como true. Exemplo: {true preferred} 
            * null - os resultados devem ter a chave especificada definida como nula. Exemplo: {null waypoints} 
            * notnull - os resultados devem ter a chave especificada não definida como nula. Exemplo: {notnull aircraftType} 
            * = - os resultados devem ter uma chave que corresponda exatamente ao valor especificado. Exemplo: {= fp C172} 
            * != - os resultados devem ter uma chave que não corresponda ao valor especificado. Exemplo: {!= prefix H}
            * < - os resultados devem ter uma chave lexicograficamente menor que um valor especificado. Exemplo: {< arrivalTime 1276811040} 
            * \> - os resultados devem ter uma chave lexicograficamente maior que um valor especificado. Exemplo: {> speed 500} 
            * <= - os resultados devem ter uma chave lexicograficamente menor ou igual a um valor especificado. Exemplo: {<= alt 8000} 
            * \>= - os resultados devem ter uma chave lexicograficamente maior ou igual a um valor especificado. 
            * match - os resultados devem ter uma chave que corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {match ident AAL*} 
            * notmatch - os resultados devem ter uma chave que não corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {notmatch aircraftType B76*} 
            * range - os resultados devem ter uma chave que esteja numericamente entre os dois valores especificados. Exemplo: {range alt 8000 20000} 
            * in - os resultados devem ter uma chave que corresponda exatamente a um dos valores especificados. Exemplo: {in orig {KLAX KBUR KSNA KLGB}} 

            Os nomes de chave suportados incluem (observe que nem todos esses nomes de chave são retornados na estrutura do resultado e alguns têm nomes ligeiramente diferentes): 

            * alt - Altitude, medida em centenas de pés ou Nível de Voo. 
            * altChange - um código de um caractere que indica a mudança de altitude. 
            * altMax - Altitude, medida em centenas de pés ou Nível de Voo. 
            * cid - um código cid de três caracteres 
            * cidfac - um código cidfac de quatro caracteres * 
            clock - carimbo de data/hora UNIX em segundos desde 1970 
            * fp - identificador exclusivo atribuído pelo FlightAware para este voo, também conhecido como fa_flight_id. 
            * gs - velocidade em solo, medida em nós. 
            * lat - latitude da posição relatada. 
            * lon - longitude da posição relatada 
            * preferred - indicador booleano da qualidade da posição 
            * recvd - carimbo de data/hora da época UNIX em segundos desde 1970 
            * updateType - fonte da última posição relatada (P=projetada, O=oceânica, Z=radar, A=ADS-B, M=multilateração, D=link de dados, X=superfície e próxima à superfície (ADS-B e ASDE-X), S=baseada no espaço) 
          schema: 
            type: string 
            example: | 
              {< alt 500} {range gs 10 100} 
        - name: unique_flights 
          in: query 
          description: Se deve retornar apenas uma única posição por fa_flight_id exclusivo. 
          schema: 
            type: boolean 
            default: false 
        - in: query
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - in: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    necessário: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  posições: 
                    tipo: matriz 
                    itens: 
                      título: PosiçãoDeVoo 
                      tipo: objeto 
                      anulável: verdadeiro 
                      propriedades: 
                        fa_flight_id: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                            posição. Este campo é preenchido apenas por `/flights/search/positions` 
                            (em outros casos, o usuário já terá especificado o fa_flight_id). 
                        altitude: 
                          tipo: inteiro 
                          descrição: altitude da aeronave em centenas de pés 
                        altitude_change: 
                          tipo: string 
                          anulável: falso
                          descrição: | 
                            C quando a aeronave estiver subindo, D quando estiver descendo e - quando a 
                            altitude estiver sendo mantida. 
                          enum: 
                            - C 
                            - D 
                            - '-' 
                        groundspeed: 
                          tipo: inteiro 
                          descrição: Velocidade em solo mais recente (nós) 
                        heading: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: Rumo da aeronave em graus (0-360) 
                          mínimo: 0 
                          máximo: 360 
                        latitude: 
                          tipo: número 
                          descrição: Posição de latitude mais recente 
                        longitude: 
                          tipo: número 
                          descrição: Posição de longitude mais recente 
                        timestamp: 
                          tipo: string 
                          formato: data-hora 
                          descrição: Hora em que a posição foi recebida 
                          exemplo: '2021-12-31T19:59:59Z' 
                        update_type: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                            D=datalink, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                            S=baseado no espaço 
                          enum: 
                            - P 
                            - O 
                            - Z 
                            - A 
                            - M 
                            - D 
                            - X 
                            - S 
                            - nulo 
                      necessário: 
                        - fa_flight_id 
                        - altitude 
                        - altitude_change 
                        - velocidade no solo - 
                        rumo - 
                        latitude 
                        - longitude 
                        - carimbo de data/hora
                        - update_type 
                obrigatório: 
                  - links 
                  - num_pages 
                  - positions 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). Esperado(s): páginas > 0. 
          content: 
            application/json; charset=UTF-8: 
              schema: title: 
                Tipo 
                de erro : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  /flights/search/count: 
    get: 
      operationId: get_flights_count_by_search 
      summary: Obter a contagem de voos que correspondem aos parâmetros de pesquisa 
      description: | 
        A documentação completa da consulta de pesquisa está disponível no 
        ponto de extremidade /flights/search. 
      tags: 
        - flights 
      parameters: 
        - name: query 
          in: query 
          description: | 
            Consulta para pesquisar voos com sintaxe simplificada (em comparação com 
            /flights/search/advanced). Não deve exceder 1000 bytes de comprimento. 
            A sintaxe da consulta permite a filtragem por caixa de latitude/longitude, identificador da aeronave 
            com curingas, tipo com curingas, prefixo, aeroporto de origem, 
            aeroporto de destino, aeroporto de origem ou destino, velocidade em solo e 
            altitude. Ela aceita termos de pesquisa em uma única string composta 
            por pares "-chave/valor". Codeshares e identificadores alternativos NÃO são pesquisados ​​ao 
            usar a cláusula -idents. 
            As chaves incluem: 
            * `-prefix STRING`

            * `-type STRING` 
            * `-idents STRING` 
            * `-identOrReg STRING` 
            * `-airline STRING` 
            * `-destination STRING` 
            * `-origin STRING` 
            * `-originOrDestination STRING` 
            * `-aboveAltitude INTEGER` 
            * `-belowAltitude INTEGER` 
            * `-aboveGroundspeed INTEGER` 
            * `-belowGroundspeed INTEGER` 
            * `-latlong "MINLAT MINLON MAXLAT MAXLON"` 
          esquema: 
            tipo: string 
            exemplo: | 
              -latlong "44.953469 -111.045360 40.962321 -104.046577" 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  count: 
                    type: integer 
                required: 
                  - count 
  /flights/search/advanced: 
    get: 
      operationId: get_flights_by_advanced_search 
      summary: Pesquisar voos usando sintaxe avançada 
      description: | 
        Retorna voos atuais ou recentes com base em 
        parâmetros de pesquisa geoespacial. 

        Os parâmetros de consulta incluem uma caixa de latitude/longitude, identificador da aeronave com 
        curingas, tipo com curingas, prefixo, aeroporto de origem, 
        aeroporto de destino, aeroporto de origem ou destino, velocidade em solo e 
        altitude. Ela recebe termos de pesquisa em uma única string composta por 
        elementos {operator key value} e retorna uma matriz de 
        estruturas de voo. Cada termo de pesquisa deve estar entre chaves. Vários 
        termos de pesquisa podem ser combinados em um booleano implícito "and" separando 
        os termos com pelo menos um espaço. Esta função pesquisa apenas 
        dados de voo que representam aproximadamente as últimas 24 horas. Codeshares e 
        identificadores alternativos NÃO são pesquisados ​​quando comparados com a chave de identificação. 

        Os operadores suportados incluem (observe que os operadores aceitam números diferentes de argumentos): 

        * false - os resultados devem ter a chave booleana especificada definida como false. Exemplo: {false arrived} 
        * true - os resultados devem ter a chave booleana especificada definida como true. Exemplo: {true lifeguard} 
        * null - os resultados devem ter a chave especificada definida como nula. Exemplo: {null waypoints}
        * notnull - os resultados devem ter a chave especificada não definida como um valor nulo. Exemplo: {notnull aircraftType} 
        * = - os resultados devem ter uma chave que corresponda exatamente ao valor especificado. Exemplo: {= aircraftType C172} 
        * != - os resultados devem ter uma chave que não corresponda ao valor especificado. Exemplo: {!= prefix H} 
        * < - os resultados devem ter uma chave que seja lexicograficamente menor que um valor especificado. Exemplo: {< arrivalTime 1276811040} 
        * \> - os resultados devem ter uma chave que seja lexicograficamente maior que um valor especificado. Exemplo: {> speed 500} 
        * <= - os resultados devem ter uma chave que seja lexicograficamente menor ou igual a um valor especificado. Exemplo: {<= alt 8000} 
        * \>= - os resultados devem ter uma chave que seja lexicograficamente maior ou igual a um valor especificado. 
        * match - os resultados devem ter uma chave que corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {match ident AAL*} 
        * notmatch - os resultados devem ter uma chave que não corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {notmatch aircraftType B76*} 
        * range - os resultados devem ter uma chave que esteja numericamente entre os dois valores especificados. Exemplo: {range alt 8000 20000} 
        * in - os resultados devem ter uma chave que corresponda exatamente a um dos valores especificados. Exemplo: {in orig {KLAX KBUR KSNA KLGB}} 
        * orig_or_dest - os resultados devem ter a chave de origem ou destino que corresponda exatamente a um dos valores especificados. Exemplo: {orig_or_dest {KLAX KBUR KSNA KLGB}} 
        * airline - os resultados incluirão somente airline flight se o argumento for 1, ou somente GA flights se o argumento for 0. Exemplo: {airline 1} 
        * aircraftType - os resultados devem ter uma chave aircraftType que corresponda a um dos padrões curinga que não diferenciam maiúsculas de minúsculas especificados. Exemplo: {aircraftType {B76* B77*}} 
        * ident - os resultados devem ter uma chave ident que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident {N123* N456* AAL* UAL*}} 
        * ident_or_reg - os resultados devem ter uma chave ident ou ser operados por um registro de aeronave que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident_or_reg {N123* N456* AAL* UAL*}} 

        Os nomes de chave suportados incluem (observe que nem todos esses nomes de chave são retornados na estrutura do resultado, e alguns têm nomes ligeiramente diferentes): 

        * actualDepartureTime - Hora real da partida, ou nulo se ainda não partiu. Carimbo de data/hora UNIX em segundos desde 1970 
        * aircraftType - ID do tipo de aeronave (por exemplo: B763) 
        * alt - altitude na última posição relatada (centenas de pés ou nível de voo)
        * altChange - indicação de mudança de altitude (por exemplo: "C" se estiver subindo, "D" se estiver descendo e vazio se estiver nivelado) 
        * arrivalTime - Hora real de chegada ou nula se ainda não chegou. Carimbo de data/hora UNIX segundos desde 1970 
        * arrived - verdadeiro se o voo chegou ao seu destino. 
        * cancelled - verdadeiro se o voo foi cancelado. O significado de cancellation é que o voo não está mais sendo rastreado pelo FlightAware. Há vários motivos pelos quais um voo pode ser cancelado, incluindo o cancelamento pela companhia aérea, mas nem sempre será esse o caso. 
        * cdt - Hora de partida controlada, definida se houver uma espera em solo no voo. Carimbo de data/hora UNIX segundos desde 1970 
        * clock - Hora da última posição recebida. Carimbo de data/hora UNIX segundos desde 1970 
        * cta - Hora de chegada controlada, definida se houver uma espera em solo no voo. Segundos do registro de data e hora da época UNIX desde 1970 
        * dest - código ICAO do aeroporto de destino (por exemplo: KLAX) 
        * edt - Horário estimado de partida. Segundos do registro de data e hora da época desde 1970 
        * eta - Horário estimado de chegada. Segundos do registro de data e hora da época desde 1970 
        * fdt - Horário de partida do campo. Segundos do registro de data e hora da época UNIX desde 1970 
        * firstPositionTime - Horário em que a primeira posição relatada foi recebida, ou 0 se nenhuma posição foi recebida ainda. Segundos de carimbo de data/hora da época desde 1970 
        * correções - interseções e/ou VORs ao longo da rota (por exemplo: SLS AMERO ARTOM VODIR NOTOS ULAPA ACA NUXCO OLULA PERAS ALIPO UPN GDL KEDMA BRISA CUL PERTI CEN PPE ALTAR ASUTA JLI RONLD LAADY WYVIL OLDEE RAL PDZ ARNES BASET WELLZ CIVET) 
        * fp - identificador exclusivo atribuído pelo FlightAware para este voo, também conhecido como fa_flight_id. 
        * gs - velocidade em solo na última posição informada, em nós. 
        * rumo - direção da viagem na última posição informada. 
        * hiLat - latitude mais alta percorrida pelo voo. 
        * hiLon - longitude mais alta percorrida pelo voo. 
        * ident - identificador de voo ou registro da aeronave. 
        * lastPositionTime - hora em que a última posição informada foi recebida ou 0 se nenhuma posição foi recebida ainda. Segundos do registro de data e hora da época desde 1970. 
        * lat - latitude da última posição informada. 
        * lifeguard - verdadeiro se for um voo de resgate "salva-vidas". 
        * lon - longitude da última posição informada. 
        * lowLat - latitude mais baixa percorrida pelo voo. 
        * lowLon - longitude mais baixa percorrida pelo voo. 
        * ogta - Hora original de chegada. Segundos do registro de data e hora da época do UNIX 
        desde 1970. * ogtd - Hora original de partida. Segundos do registro de data e hora da época do UNIX desde 1970.
        * orig - código de origem do aeroporto ICAO (por exemplo: KIAH) 
        * physClass - classe física (por exemplo: J é jato) 
        * prefix - um código de prefixo identificador de um ou dois caracteres (valores comuns: G ou GG Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
        * speed - velocidade em solo, em nós. 
        * status - código de uma única letra para o status atual do voo, pode ser S Scheduled, F Filed, A Active, Z Completed ou X Cancelled. 
        * updateType - fonte de dados da última posição (P=projected, O=oceanic, Z=radar, A=ADS-B, M=multilateração, D=datalink, X=surface e near surface (ADS-B e ASDE-X), S=space-based). 
        * waypoints - todas as interseções e VORs que compõem as 
      tags de rota: 
        - flights 
      parameters: 
        - name: query 
          in: query 
          description: | 
            Consulta para pesquisar voos aéreos ou que chegaram recentemente. Não deve 
            exceder 1000 bytes de comprimento. Os critérios de pesquisa são aplicados somente à 
            posição mais recente de um voo. Esta função pesquisa somente voos 
            nas últimas 24 horas, aproximadamente. Os operadores suportados incluem 
            (observe que os operadores aceitam números diferentes de argumentos): 

            * false - os resultados devem ter a chave booleana especificada definida como false. Exemplo: {false arrived} 
            * true - os resultados devem ter a chave booleana especificada definida como true. Exemplo: {true lifeguard} 
            * null - os resultados devem ter a chave especificada definida como nula. Exemplo: {null waypoints} 
            * notnull - os resultados devem ter a chave especificada não definida como nula. Exemplo: {notnull aircraftType} 
            * = - os resultados devem ter uma chave que corresponda exatamente ao valor especificado. Exemplo: {= aircraftType C172} 
            * != - os resultados devem ter uma chave que não corresponda ao valor especificado. Exemplo: {!= prefix H} 
            * < - os resultados devem ter uma chave lexicograficamente menor que um valor especificado. Exemplo: {< arrivalTime 1276811040} 
            * \> - os resultados devem ter uma chave lexicograficamente maior que um valor especificado. Exemplo: {> speed 500} 
            * <= - os resultados devem ter uma chave lexicograficamente menor ou igual a um valor especificado. Exemplo: {<= alt 8000} 
            * \>= - os resultados devem ter uma chave lexicograficamente maior ou igual a um valor especificado. 
            * match - os resultados devem ter uma chave que corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {match ident AAL*}
            * notmatch - os resultados devem ter uma chave que não corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {notmatch aircraftType B76*} 
            * range - os resultados devem ter uma chave que esteja numericamente entre os dois valores especificados. Exemplo: {range alt 8000 20000} 
            * in - os resultados devem ter uma chave que corresponda exatamente a um dos valores especificados. Exemplo: {in orig {KLAX KBUR KSNA KLGB}} 
            * orig_or_dest - os resultados devem ter a chave de origem ou destino que corresponda exatamente a um dos valores especificados. Exemplo: {orig_or_dest {KLAX KBUR KSNA KLGB}} 
            * airline - os resultados incluirão somente airline flight se o argumento for 1, ou somente incluirão GA flights se o argumento for 0. Exemplo: {airline 1} 
            * aircraftType - os resultados devem ter uma chave aircraftType que corresponda a um dos padrões curinga que não diferenciam maiúsculas de minúsculas especificados. Exemplo: {aircraftType {B76* B77*}} 
            * ident - os resultados devem ter uma chave ident que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident {N123* N456* AAL* UAL*}} 
            * ident_or_reg - os resultados devem ter uma chave ident ou ser operados por um registro de aeronave que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident_or_reg {N123* N456* AAL* UAL*}} 

            Os nomes de chave suportados incluem (observe que nem todos esses nomes de chave são retornados na estrutura do resultado, e alguns têm nomes ligeiramente diferentes): 

            * actualDepartureTime - Hora real da partida ou nulo se ainda não partiu. Segundos do registro de data e hora da época UNIX desde 1970 
            * aircraftType - ID do tipo de aeronave (por exemplo: B763) 
            * alt - altitude na última posição relatada (centenas de pés ou nível de voo) 
            * altChange - indicação de mudança de altitude (por exemplo: "C" se estiver subindo, "D" se estiver descendo e vazio se estiver nivelado) 
            * arrivalTime - Hora real de chegada ou nula se ainda não chegou. Segundos do registro de data e hora da época UNIX desde 1970 
            * arrived - verdadeiro se o voo chegou ao seu destino. 
            * cancelled - verdadeiro se o voo foi cancelado. O significado de cancelamento é que o voo não está mais sendo rastreado pelo FlightAware. Há vários motivos pelos quais um voo pode ser cancelado, incluindo o cancelamento pela companhia aérea, mas nem sempre será esse o caso. 
            * cdt - Hora de partida controlada, definida se houver uma espera em solo no voo. Segundos do registro de data e hora da época UNIX desde 1970 
            * clock - Hora da última posição recebida. Carimbo de data/hora UNIX, segundos desde 1970 
            * cta - Tempo de Chegada Controlado, definido se houver espera em solo no voo. Carimbo de data/hora UNIX, segundos desde 1970
            * dest - código ICAO do aeroporto de destino (por exemplo: KLAX) 
            * edt - Horário estimado de partida. Carimbo de data e hora da época, segundos desde 1970 * eta 
            - Horário estimado de chegada. Carimbo de data e hora da época, segundos desde 1970 
            * fdt - Horário de partida do campo. Carimbo de data e hora da época UNIX, segundos desde 1970 
            * firstPositionTime - Horário em que a primeira posição relatada foi recebida, ou 0 se nenhuma posição foi recebida ainda. Segundos de carimbo de data/hora da época desde 1970 
            * correções - interseções e/ou VORs ao longo da rota (por exemplo: SLS AMERO ARTOM VODIR NOTOS ULAPA ACA NUXCO OLULA PERAS ALIPO UPN GDL KEDMA BRISA CUL PERTI CEN PPE ALTAR ASUTA JLI RONLD LAADY WYVIL OLDEE RAL PDZ ARNES BASET WELLZ CIVET) 
            * fp - identificador exclusivo atribuído pelo FlightAware para este voo, também conhecido como fa_flight_id. 
            * gs - velocidade em solo na última posição informada, em nós. 
            * rumo - direção da viagem na última posição informada. 
            * hiLat - latitude mais alta percorrida pelo voo. 
            * hiLon - longitude mais alta percorrida pelo voo. 
            * ident - identificador de voo ou registro da aeronave. 
            * lastPositionTime - hora em que a última posição informada foi recebida ou 0 se nenhuma posição foi recebida ainda. Segundos do carimbo de data/hora da época desde 1970. 
            * lat - latitude da última posição informada. 
            * lifeguard - verdadeiro se for um voo de resgate "salva-vidas". 
            * lon - longitude da última posição informada. 
            * lowLat - latitude mais baixa percorrida pelo voo. 
            * lowLon - longitude mais baixa percorrida pelo voo. 
            * ogta - Hora original de chegada. Segundos do carimbo de data/hora da época do UNIX desde 1970 
            * ogtd - Hora original de partida. Segundos do carimbo de data/hora da época do UNIX desde 1970 
            * orig - código de origem do aeroporto ICAO (por exemplo: KIAH) * 
            physClass - classe física (por exemplo: J é jato) 
            * prefix - um código de prefixo identificador de um ou dois caracteres (valores comuns: G ou GG Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
            * speed - velocidade em solo, em nós. 
            * status - código de uma única letra para o status atual do voo, pode ser S Scheduled, F Filed, A Active, Z Completed ou X Cancelled. 
            * updateType - fonte de dados da última posição (P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, D=link de dados, X=superfície e próxima à superfície (ADS-B e ASDE-X), S=baseado no espaço). 
            * waypoints - todas as interseções e VORs que compõem o esquema da rota 
          : 
            tipo: string 
            exemplo: |
              {orig_or_dest {KLAX KBUR KSNA KLGB}} {<= alt 8000} {match ident AAL*} 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: array 
                    itens: 
                      allOf: 
                        - título: InFlightStatus 
                          tipo: objeto 
                          propriedades: 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código do operador seguido pelo número do voo 
                                (para voos comerciais) ou pelo registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: |
                                O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              type: string 
                              nullable: true 
                              description: | 
                                O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                            fa_flight_id: 
                              type: string 
                              description: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ou string ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: |
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            destination: 
                              description: | 
                                Informações para o aeroporto de destino deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ICAO/IATA/LID ou string que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: | 
                                    Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            waypoints: 
                              type: array 
                              items: 
                                type: number 
                              description: | 
                                Waypoints da rota como uma matriz de latitudes e longitudes alternadas. 
                            first_position_time: 
                              type: string 
                              nullable: true 
                              format: data e hora 
                              description: Carimbo de data e hora de quando a primeira posição para este voo foi recebida. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            última_posição:
                              tipo: objeto 
                              descrição: Posição mais recente recebida para este voo. 
                              título: FlightPosition 
                              nulo: verdadeiro 
                              propriedades: 
                                fa_flight_id: 
                                  tipo: sequência de caracteres 
                                  nulo: verdadeiro 
                                  descrição: | 
                                    Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                                    posição. Este campo é preenchido apenas por `/flights/search/positions` 
                                    (em outros casos, o usuário já terá especificado o fa_flight_id). 
                                altitude: 
                                  tipo: inteiro 
                                  descrição: Altitude da aeronave em centenas de pés 
                                altitude_change: 
                                  tipo: sequência de caracteres 
                                  nulo: falso 
                                  descrição: | 
                                    C quando a aeronave está subindo, D quando está descendo e - quando a 
                                    altitude está sendo mantida. 
                                  enum: 
                                    - C 
                                    - D 
                                    - '-' 
                                groundspeed: 
                                  tipo: inteiro 
                                  descrição: Velocidade em solo mais recente (nós) 
                                heading: 
                                  tipo: inteiro 
                                  nulo: verdadeiro 
                                  descrição: Rumo da aeronave em graus (0-360) 
                                  mínimo: 0 
                                  máximo: 360 
                                latitude: 
                                  tipo: número 
                                  descrição: Posição em latitude mais recente 
                                longitude: 
                                  tipo : número descrição 
                                  : Posição em longitude mais recente 
                                timestamp: 
                                  tipo: sequência de caracteres
                                  formato: data-hora 
                                  descrição: Horário em que a posição foi recebida 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                update_type: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: | 
                                    P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                                    D=link de dados, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                                    S=baseado no espaço 
                                  enum: 
                                    - P 
                                    - O 
                                    - Z 
                                    - A 
                                    - M 
                                    - D 
                                    - X 
                                    - S 
                                    - nulo 
                              obrigatório: 
                                - fa_flight_id 
                                - altitude 
                                - altitude_change 
                                - velocidade no solo 
                                - rumo 
                                - latitude 
                                - longitude 
                                - carimbo de data/hora 
                                - update_type 
                            bounding_box: 
                              tipo: array 
                              anulável: true 
                              descrição: | 
                                Lista de 4 coordenadas representando as bordas de uma caixa que 
                                contém inteiramente as posições deste voo. A ordem das coordenadas são os 
                                lados superior, esquerdo, inferior e direito da caixa. 
                              maxItems: 4 
                              minItems: 4 
                              itens: 
                                tipo: número 
                            ident_prefix: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Um código de prefixo identificador de um ou dois caracteres (valores comuns: G ou GG
                                Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: | 
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido. 
                            actual_off: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário real de partida da pista. 
                              example: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                          obrigatório: 
                            - ident 
                            - fa_flight_id 
                            - actual_off 
                            - actual_on - 
                            origin 
                            - destination 
                            - waypoints - 
                            first_position_time 
                            - last_position 
                            - bounding_box 
                            - ident_prefix 
                            - aircraft_type 
                        - title: ForesightPredictionsAvailable 
                          tipo: objeto 
                          propriedades: 
                            foresight_predictions_available: 
                              tipo: booleano 
                              descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade AeroAPI /foresight. 
                              exemplo: true 
                          obrigatório: 
                            - foresight_predictions_available 
                        - título: ForesightLegacyDummy 
                          tipo: objeto 
                          propriedades: 
                            predict_out:
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: nulo 
                            predict_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de partida da pista. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: nulo 
                            predict_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de chegada da pista. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: nulo 
                            predict_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: Hora prevista do evento de chegada do portão. Disponível somente nos pontos de extremidade /foresight. 
                              exemplo: nulo 
                            predict_out_source: 
                              tipo: string 
                              anulável: true 
                              descrição: Indicador de origem da hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                              enum: 
                                - null 
                                - Foresight 
                                - Média Histórica 
                            predict_off_source: 
                              tipo: string 
                              anulável: true 
                              descrição: Indicador de origem da hora prevista do evento de partida da pista. Disponível somente nos endpoints /foresight. 
                              enum: 
                                - null 
                                - Foresight 
                                - Média Histórica 
                            predict_on_source: 
                              type: string 
                              nullable: true
                              descrição: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível somente nos endpoints /foresight. 
                              enum: 
                                - null 
                                - Foresight 
                                - Média Histórica 
                            prediction_in_source: 
                              type: string 
                              nullable: true 
                              descrição: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível somente nos endpoints /foresight. 
                              enum: 
                                - null 
                                - Foresight 
                                - Média Histórica 
                          obrigatório: 
                            - predict_out 
                            - predict_off 
                            - predict_on - 
                            predict_in - 
                            predict_out_source - 
                            predict_off_source - 
                            predict_on_source 
                            - predict_in_source 
                obrigatório: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O ID pode estar ausente ou não estar no formato fa_flight_id. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: 
                Tipo de erro: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório:
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/voos/{ident}': 
    obter: 
      operationId: 
      resumo do get_flight: Obter informações para uma 
      descrição de voo: | 
        Retorna o resumo do status das informações do voo para um registro, ident ou 
        fa_flight_id. Se um fa_flight_id for especificado, no máximo 1 
        voo será retornado, a menos que o voo tenha sido desviado, caso em que 
        tanto o voo original quanto quaisquer desvios serão retornados com um 
        fa_flight_id duplicado. Se um registro ou ident for especificado, 
        aproximadamente 14 dias de informações de voos recentes e programados serão 
        retornados, ordenados por `scheduled_out` (ou `scheduled_off` se 
        `scheduled_out` estiver ausente) em ordem decrescente. Como alternativa, especifique um 
        parâmetro inicial e final para encontrar seu(s) voo(s) de interesse, incluindo até 
        10 dias de histórico de voo. 
      tags: 
        - 
      parâmetros de voos: 
        - nome: ident 
          em: caminho 
          descrição: | 
            O ident, registro ou fa_flight_id a ser buscado. Se estiver usando 
            um ident de voo, é altamente recomendável especificar 
            o ident de voo ICAO em vez do ident de voo IATA para evitar ambiguidade e resultados inesperados. 
            Definir o ident_type também pode ser usado para ajudar a desambiguar. 
          required: true 
          schema: 
            type: string 
          examples: 
            ident: 
              value: UAL4 
            reg: 
              value: N123HQ 
            fa_id: 
              value: UAL1234-1234567890-airline-0123 
        - name: ident_type 
          in: query 
          description: | 
            Tipo de ident fornecido no parâmetro ident. Por padrão, o 
            ident passado é interpretado como um registro, se possível. Este parâmetro pode 
            forçar o ident a ser interpretado como um designador. 
          schema: 
            type: string 
            enum: 
              - designator 
              - registration 
              - fa_flight_id 
        - name: start 
          in: query 
          description: | 
            O intervalo de datas inicial para resultados de voo, comparando com os voos
            Campo `scheduled_out` (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ou data e hora ISO8601, e o limite é 
            inclusivo. A data de início especificada não pode ser posterior a 10 dias no 
            passado e 2 dias no futuro. Se não for especificado, o padrão será 
            partidas iniciadas aproximadamente 11 dias no passado. Se usar data 
            em vez de data e hora, o padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data e hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'no' 
        - nome: fim 
          em: consulta 
          descrição: | 
            O intervalo de datas de término para resultados de voos, comparando com 
            o campo `scheduled_out` dos voos (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ou data e hora ISO8601, e o limite é 
            exclusivo. A data de término especificada não pode ser posterior a 10 dias no 
            passado e 2 dias no futuro. Se não for especificado, o padrão será 
            partidas começando aproximadamente 2 dias no futuro. Se usar data 
            em vez de data e hora, o padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data e hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - in: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - em: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; conjunto de caracteres=UTF-8:
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: matriz 
                    itens: 
                      allOf: 
                        - título: BaseFlight 
                          tipo: objeto 
                          propriedades: 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código da operadora seguido pelo número do voo 
                                (para voos comerciais) ou o registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                            actual_runway_off: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Pista de partida real na origem, quando conhecida 
                            actual_runway_on: 
                              tipo: string 
                              anulável: verdadeiro
                              descrição: | 
                                Chegada real na pista de destino, quando conhecida 
                            fa_flight_id: 
                              tipo: string 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            operador: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                            operador_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Código ICAO da operadora do voo. 
                            operador_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Código IATA da operadora do voo. 
                            número_voo: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Número do voo. 
                            registro: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                            atc_ident: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente de ident. 
                            inbound_fa_flight_id: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para o voo anterior do
                                aeronave servindo este voo. 
                            codeshares: 
                              type: array 
                              nullable: true 
                              description: | 
                                Lista de todos os codeshares da ICAO operando neste voo. 
                              items: 
                                type: string 
                            codeshares_iata: 
                              type: array 
                              nullable: true 
                              description: | 
                                Lista de todos os codeshares da IATA operando neste voo. 
                              items: 
                                type: string 
                            blocked: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo está bloqueado para visualização pública. 
                            diverted: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo foi desviado. 
                            cancelled: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                                FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                                incluindo cancelamento pela companhia aérea, mas nem sempre será o 
                                caso. 
                            position_only: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: |
                                    Código ou sequência de caracteres ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            destination:
                              descrição: | 
                                Informações sobre o aeroporto de destino deste voo. 
                              título: FlightAirportRef 
                              tipo: objeto 
                              nulo: verdadeiro 
                              propriedades: 
                                código: 
                                  tipo: string 
                                  descrição: | 
                                    Código ICAO/IATA/LID ou string que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nulo: verdadeiro 
                                código_icao: 
                                  tipo: string 
                                  descrição: | 
                                    Código ICAO 
                                  nulo: verdadeiro 
                                código_iata: 
                                  tipo: string 
                                  descrição: | 
                                    Código IATA 
                                  nulo: verdadeiro 
                                código_lid: 
                                  tipo: string 
                                  descrição: | 
                                    Código LID 
                                  nulo: verdadeiro 
                                fuso horário: 
                                  tipo: string 
                                  descrição: | 
                                    Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                                  nulo: verdadeiro 
                                  exemplo: América/Nova_Iorque 
                                nome: 
                                  tipo: string 
                                  descrição: | 
                                    Nome comum do aeroporto 
                                  nulo: verdadeiro 
                                  exemplo: LaGuardia 
                                cidade: 
                                  tipo: string 
                                  descrição: | 
                                    Cidade mais próxima do aeroporto 
                                  nulo: verdadeiro 
                                  exemplo: Nova York 
                                airport_info_url:
                                  tipo: string 
                                  anulável: true 
                                  formato: referência-uri 
                                  descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              obrigatório: 
                                - código 
                                - airport_info_url 
                            departure_delay: 
                              tipo: inteiro 
                              anulável: true 
                              descrição: | 
                                Atraso de partida (em segundos) com base no 
                                horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                            arrival_delay: 
                              tipo: inteiro 
                              anulável: true 
                              descrição: | 
                                Atraso de chegada (em segundos) com base no 
                                horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                            filed_ete: 
                              tipo: inteiro 
                              anulável: true 
                              descrição: | 
                                Duração do campo pista a pista (segundos). 
                            progress_percent: 
                              tipo: inteiro 
                              anulável: true 
                              descrição: | 
                                A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                                para voos somente de posição em rota. 
                              mínimo: 0 
                              máximo: 100 
                            status: 
                              tipo: string 
                              descrição: | 
                                Resumo legível do status do voo. 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: |
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido. 
                            route_distance: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                                variar da distância real voada. 
                            filed_airspeed: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Velocidade do ar IFR registrada (nós). 
                            filed_altitude: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Altitude IFR registrada (centenas de pés). 
                            route: 
                              type: string 
                              nullable: true 
                              description: | 
                                A descrição textual da rota do voo. 
                            baggage_claim: 
                              type: string 
                              nullable: true 
                              description: | 
                                Local de retirada de bagagem no aeroporto de destino. 
                            seats_cabin_business: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe executiva. 
                            seats_cabin_coach: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe econômica. 
                            seats_cabin_first: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine de primeira classe. 
                            gate_origin: 
                              type: string 
                              nullable: true
                              descrição: | 
                                Portão de embarque no aeroporto de origem. 
                            gate_destination: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Portão de desembarque no aeroporto de destino. 
                            terminal_origin: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Terminal de embarque no aeroporto de origem. 
                            terminal_destination: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Terminal de desembarque no aeroporto de destino. 
                            tipo: 
                              tipo: string 
                              descrição: | 
                                Se este é um voo de aviação comercial ou geral. 
                              enum: 
                                - Aviação_Geral 
                                - Companhia aérea 
                            scheduled_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: verdadeiro 
                              descrição: | 
                                Horário de partida programado no portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: verdadeiro 
                              descrição: | 
                                Horário estimado de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: verdadeiro 
                              descrição: | 
                                Horário real de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_off: 
                              tipo: string
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário de partida programado para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário estimado de partida para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de partida para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário de chegada programado para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário estimado de chegada para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora programada de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z'
                            estimated_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora estimada de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora real de chegada ao portão. 
                              Exemplo: '2021-12-31T19:59:59Z' 
                          necessário: 
                            - ident 
                            - fa_flight_id 
                            - operador 
                            - operator_iata 
                            - flight_number 
                            - registration 
                            - atc_ident 
                            - inbound_fa_flight_id 
                            - codeshares 
                            - blocked 
                            - diverted 
                            - cancelled 
                            - position_only 
                            - origin 
                            - destination 
                            - departure_delay 
                            - arrival_delay 
                            - filed_ete 
                            - progress_percent 
                            - status 
                            - aircraft_type 
                            - route_distance 
                            - filed_airspeed 
                            - filed_altitude 
                            - route 
                            - baggage_claim 
                            - seats_cabin_business 
                            - 
                            seats_cabin_coach - seats_cabin_first 
                            - gate_origin 
                            - gate_destination - 
                            terminal_origin 
                            - terminal_destination 
                            - type 
                            - scheduled_out 
                            - estimated_out 
                            - actual_out
                            - scheduled_off 
                            - estimated_off 
                            - actual_off 
                            - scheduled_on 
                            - estimated_on 
                            - actual_on 
                            - scheduled_in 
                            - estimated_in 
                            - actual_in 
                        - title: ForesightPredictionsAvailable 
                          type: object 
                          properties: 
                            foresight_predictions_available: 
                              type: boolean 
                              description: Indica se as previsões do Foresight estão disponíveis para os endpoints AeroAPI /foresight. 
                              example: true 
                          required: 
                            - foresight_predictions_available 
                required: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ident pode estar ausente ou não estar no formato fa_flight_id ou as páginas podem ser < 1. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/flights/{ident}/canonical': 
    obter: 
      operationId: get_flights_canonical 
      resumo: Obter a identificação canônica de um voo
      descrição: | 
        Quando o parâmetro ident é um código que pode mapear para vários outros códigos, 
        este ponto de extremidade retorna uma matriz de informações sobre todos os códigos possíveis. 
        Um tipo de ident opcional e um código de país podem ser fornecidos para refinar 
        idents ambíguos para um único resultado. O tipo de ident deve ser designator ou 
        registration para descrever o ident que está sendo passado. O código do país deve 
        representar um país em que o operador do voo opera. 
      tags: 
        - flights 
      parâmetros: 
        - name: ident 
          in: path 
          descrição: O designador de voo ou registro de aeronave 
          necessário: true 
          schema: 
            type: string 
          exemplos: 
            ident: 
              value: B6109 
        - name: ident_type 
          in: query 
          descrição: Tipo de ident fornecido no parâmetro ident 
          schema: 
            type: string 
            enum: 
              - designator 
              - registration 
        - name: country_code 
          in: query 
          descrição: Um código de país ISO 3166-1 alfa-2. 
          schema: 
            type: string 
            exemplo: US 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                tipo: 
                propriedades do objeto: 
                  idents: 
                    tipo: 
                    itens do array: 
                      título: CanonicalIdent 
                      tipo: 
                      propriedades do objeto: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            Ident canônico 
                        ident_type: 
                          tipo: string 
                          descrição: | 
                            Tipo de ident fornecido em id 
                          enum: 
                            - designador 
                            - registro 
                      necessário: 
                        - ident 
                        - tipo de ident_necessário 
                :
                  - idents 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). ident, ident_type ou country_code podem ser inválidos. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/flights/{ident}/intents': 
    post: 
      operationId: post_flights_by_ident 
      summary: Enviar uma intenção de voo 
      description: | 
        Esta operação informa o FlightAware sobre um 
        voo futuro (ou que partiu recentemente). Essas informações são usadas exclusivamente pelo FlightAware para 
        melhorar a precisão do rastreamento de voos. Este método não 
        transmite para nenhuma instalação ANSP/ATC para separação de voos ou 
        serviços operacionais. O acesso a este ponto de extremidade requer 
        autorização de conta especial. A conta FlightAware também deve estar inscrita no 
        FlightAware Global e o registro ou identificação especificado deve estar na 
        conta Global. 
      tags: 
        - voos 
      parâmetros: 
        - nome: ident 
          in: caminho 
          descrição: A identificação ou registro da Intenção de Voo 
          obrigatório: true 
          esquema: 
            tipo: string 
          exemplos: 
            ident: 
              valor: RPA4854 
            reg: 
              valor: N123HQ 
      requestBody: 
        descrição: Intenção de Voo
        content: 
          application/json; charset=UTF-8: 
            schema: 
              title: FlightIntent 
              type: object 
              properties: 
                aircraft_type: 
                  type: string 
                  description: Código ICAO do tipo de aeronave. 
                  example: C162 
                origin: 
                  type: string 
                  description: Código ICAO ou LID do aeroporto de origem. 
                  example: KSGR 
                destination: 
                  type: string 
                  description: Código ICAO ou LID do aeroporto de destino. 
                  example: 50R 
                intended_off: 
                  type: string 
                  format: data-hora 
                  description: | 
                    Horário pretendido de partida da pista do voo. Deve ser dentro de 2 horas do 
                    horário real de partida ou a intenção de voo será ignorada. O horário 
                    não pode ser superior a 1 hora no passado ou 48 horas no futuro. 
                  example: '2021-10-16T21:30:00Z' 
                intended_on: 
                  type: string 
                  format: data-hora 
                  description: Horário pretendido de chegada da pista do voo. 
                  exemplo: '2021-10-16T22:50:00Z' 
                altitude: 
                  tipo: inteiro 
                  descrição: Altitude de cruzeiro (pés). 
                  exemplo: 3500 
                velocidade do ar: 
                  tipo: inteiro 
                  descrição: Velocidade do ar de cruzeiro (nós). 
                  exemplo: 86 
                rota: 
                  tipo: string 
                  descrição: Rota de voo como uma série de pontos de referência separados por espaço. 
                  exemplo: MAPGP VICUC 
              necessário: 
                - aircraft_type 
                - origin 
                - destination 
                - intended_off 
                - intended_on 
      respostas: 
        '200': 
          descrição: OK 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O ident pode estar ausente ou as páginas podem ser < 1. O corpo pode estar incompleto. O usuário pode não ter permissões para publicar a intenção de voo para este ident. Os horários de chegada/partida, a duração ou o tipo de aeronave podem ser inválidos.
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/flights/{id}/position': 
    get: 
      operationId: get_flight_position 
      summary: Obter a posição atual do voo 
      description: Retorna a posição mais recente de um voo 
      tags: 
        - flights 
      parameters: 
        - name: id 
          in: path 
          description: | 
            O fa_flight_id a ser buscado. Se estiver procurando dados de mais de 10 dias atrás, 
            use o ponto de extremidade histórico correspondente. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                allOf: 
                  - título: InFlightStatus 
                    tipo: objeto 
                    propriedades: 
                      ident: 
                        tipo: string 
                        descrição: | 
                          O código do operador seguido pelo número do voo 
                          (para voos comerciais) ou pelo registro da aeronave (para 
                          aviação geral).
                      ident_icao: 
                        type: string 
                        nullable: true 
                        description: | 
                          O código do operador ICAO seguido do número do voo (para voos comerciais) 
                      ident_iata: 
                        type: string 
                        nullable: true 
                        description: | 
                          O código do operador IATA seguido do número do voo (para voos comerciais) 
                      fa_flight_id: 
                        type: string 
                        description: | 
                          Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                          o voo for desviado, o novo trecho do voo terá um 
                          fa_flight_id duplicado. 
                      origin: 
                        description: | 
                          Informações sobre o aeroporto de origem deste voo. 
                        title: FlightAirportRef 
                        type: object 
                        nullable: true 
                        properties: 
                          code: 
                            type: string 
                            description: | 
                              Código ou string ICAO/IATA/LID que indica o local onde 
                              o rastreamento do voo começou/terminou para voos somente de posição. 
                            nullable: true 
                          code_icao: 
                            type: string 
                            description: | 
                              Código ICAO 
                            nullable: true 
                          code_iata: 
                            type: string 
                            description: | 
                              Código IATA 
                            nullable: true 
                          code_lid: 
                            type: string 
                            description: | 
                              Código LID 
                            anulável: true 
                          fuso horário: 
                            tipo: string 
                            descrição: | 
                              Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ
                            anulável: true 
                            exemplo: América/Nova_Iorque 
                          nome: 
                            tipo: string 
                            descrição: | 
                              Nome comum do aeroporto 
                            anulável: true 
                            exemplo: LaGuardia 
                          cidade: 
                            tipo: string 
                            descrição: | 
                              Cidade mais próxima do aeroporto 
                            anulável: true 
                            exemplo: Nova Iorque 
                          airport_info_url: 
                            tipo: string 
                            anulável: true 
                            formato: uri-reference 
                            descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                        obrigatório: 
                          - código 
                          - airport_info_url 
                      destino: 
                        descrição: | 
                          Informações sobre o aeroporto de destino deste voo. 
                        título: FlightAirportRef 
                        tipo: objeto 
                        anulável: true 
                        propriedades: 
                          código: 
                            tipo: string 
                            descrição: | 
                              Código ou string ICAO/IATA/LID que indica o local onde 
                              o rastreamento do voo começou/terminou para voos somente de posição. 
                            anulável: true 
                          código_icao: 
                            tipo: string 
                            descrição: | 
                              Código ICAO 
                            anulável: true 
                          código_iata: 
                            tipo: string 
                            descrição: | 
                              Código IATA 
                            anulável: true 
                          código_lid: 
                            tipo: string 
                            descrição: | 
                              Código LID 
                            anulável: true 
                          fuso horário:
                            tipo: string 
                            descrição: | 
                              Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                            nulo: verdadeiro 
                            exemplo: América/Nova_Iorque 
                          nome: 
                            tipo: string 
                            descrição: | 
                              Nome comum do aeroporto 
                            nulo: verdadeiro 
                            exemplo: LaGuardia 
                          cidade: 
                            tipo: string 
                            descrição: | 
                              Cidade mais próxima do aeroporto 
                            nulo: verdadeiro 
                            exemplo: Nova Iorque 
                          airport_info_url: 
                            tipo: string 
                            nulo: verdadeiro 
                            formato: uri-reference 
                            descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                        obrigatório: 
                          - código 
                          - airport_info_url 
                      waypoints: 
                        tipo: matriz 
                        itens: 
                          tipo: número 
                        descrição: | 
                          Waypoints da rota como uma matriz de latitudes e longitudes alternadas. 
                      first_position_time: 
                        tipo: string 
                        nulo: verdadeiro 
                        formato: data e hora 
                        descrição: Carimbo de data e hora de quando a primeira posição para este voo foi recebida. 
                        exemplo: '2021-12-31T19:59:59Z' 
                      last_position: 
                        tipo: objeto 
                        descrição: Posição mais recente recebida para este voo. 
                        título: FlightPosition 
                        anulável: true 
                        propriedades: 
                          fa_flight_id: 
                            tipo: string 
                            anulável: true 
                            descrição: | 
                              Identificador exclusivo atribuído pelo FlightAware ao voo com este
                              posição. Este campo é preenchido apenas por `/flights/search/positions` 
                              (em outros casos, o usuário já terá especificado o fa_flight_id). 
                          altitude: 
                            tipo: inteiro 
                            descrição: Altitude da aeronave em centenas de pés 
                          altitude_change: 
                            tipo: string 
                            anulável: falso 
                            descrição: | 
                              C quando a aeronave estiver subindo, D quando estiver descendo e - quando a 
                              altitude estiver sendo mantida. 
                            enum: 
                              - C 
                              - D 
                              - '-' 
                          groundspeed: 
                            tipo: inteiro 
                            descrição: Velocidade em solo mais recente (nós) 
                          heading: 
                            tipo: inteiro 
                            anulável: verdadeiro 
                            descrição: Rumo da aeronave em graus (0-360) 
                            mínimo: 0 
                            máximo: 360 
                          latitude: 
                            tipo: número 
                            descrição: Posição de latitude mais recente 
                          longitude: 
                            tipo: número 
                            descrição: Posição de longitude mais recente 
                          timestamp: 
                            tipo: string 
                            formato: data e hora 
                            descrição: Hora em que a posição foi recebida 
                            exemplo: '2021-12-31T19:59:59Z' 
                          update_type: 
                            tipo: string 
                            anulável: verdadeiro 
                            descrição: | 
                              P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                              D=datalink, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                              S=baseado no espaço 
                            enum: 
                              - P 
                              - O 
                              - Z 
                              - A
                              - M 
                              - D 
                              - X 
                              - S 
                              - null 
                        required: 
                          - fa_flight_id 
                          - altitude 
                          - altitude_change 
                          - groundspeed 
                          - heading 
                          - latitude 
                          - longitude 
                          - timestamp 
                          - update_type 
                      bounding_box: 
                        type: array 
                        nullable: true 
                        description: | 
                          Lista de 4 coordenadas representando as bordas de uma caixa que 
                          contém inteiramente as posições deste voo. A ordem das coordenadas são os 
                          lados superior, esquerdo, inferior e direito da caixa. 
                        maxItems: 4 
                        minItems: 4 
                        items: 
                          type: number 
                      ident_prefix: 
                        type: string 
                        nullable: true 
                        description: | 
                          Um código de prefixo identificador de um ou dois caracteres (Valores comuns: G ou GG 
                          Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
                      aircraft_type: 
                        type: string 
                        nullable: true 
                        description: | 
                          O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                          quando o código ICAO não for conhecido. 
                      actual_off: 
                        type: string 
                        format: date-time 
                        nullable: true 
                        description: | 
                          Hora real de partida da pista. 
                        exemplo: '2021-12-31T19:59:59Z' 
                      actual_on: 
                        tipo: string 
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: | 
                          Hora real de chegada à pista.
                        exemplo: '2021-12-31T19:59:59Z' 
                    obrigatório: 
                      - ident 
                      - fa_flight_id 
                      - actual_off 
                      - actual_on - 
                      origin 
                      - destination 
                      - waypoints 
                      - first_position_time 
                      - last_position 
                      - bounding_box 
                      - ident_prefix 
                      - aircraft_type 
                  - title: ForesightPredictionsAvailable 
                    tipo: objeto 
                    propriedades: 
                      foresight_predictions_available: 
                        tipo: booleano 
                        descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade /foresight do AeroAPI. 
                        exemplo: verdadeiro 
                    obrigatório: 
                      - foresight_predictions_available 
                  - título: ForesightLegacyDummy 
                    tipo: objeto 
                    propriedades: 
                      predict_out: 
                        tipo: string 
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: Hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                        exemplo: nulo 
                      predict_off: 
                        tipo: string 
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: Hora prevista do evento de partida da pista. Disponível somente nos pontos de extremidade /foresight. 
                        Exemplo: nulo 
                      predict_on: 
                        tipo: string 
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: hora prevista para o evento de chegada à pista. Disponível apenas nos endpoints /foresight. 
                        Exemplo: nulo 
                      predict_in: 
                        tipo: string 
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: hora prevista para o evento de chegada ao portão. Disponível apenas nos endpoints /foresight. 
                        Exemplo: nulo
                      prediction_out_source: 
                        type: string 
                        nullable: true 
                        description: Indicador de origem do tempo previsto para o evento de partida do portão. Disponível apenas nos pontos de extremidade /foresight. 
                        enum: 
                          - null 
                          - Previsão 
                          - Média histórica 
                      prediction_off_source: 
                        type: string 
                        nullable: true 
                        description: Indicador de origem do tempo previsto para o evento de partida da pista. Disponível apenas nos pontos de extremidade /foresight. 
                        enum: 
                          - null 
                          - Previsão 
                          - Média histórica 
                      prediction_on_source: 
                        type: string 
                        nullable: true 
                        description: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível apenas nos pontos de extremidade /foresight. 
                        enum: 
                          - null 
                          - Previsão 
                          - Média histórica 
                      prediction_in_source: 
                        type: string 
                        nullable: true 
                        description: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível apenas nos pontos de extremidade /foresight. 
                        enum: 
                          - null 
                          - Previsão 
                          - Média Histórica 
                    necessária: 
                      - predict_out 
                      - predict_off 
                      - predict_on 
                      - predict_in 
                      - predict_out_source 
                      - predict_off_source 
                      - predict_on_source 
                      - predict_in_source 
        '400': 
          description: | 
            Parâmetro (id) incorreto. O ID pode estar ausente ou não estar no formato fa_flight_id. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties:
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/flights/{id}/track': 
    get: 
      operationId: get_flight_track 
      summary: Obtém o rastreamento do voo 
      description: | 
        Retorna o rastreamento de um voo como uma matriz de posições. 
        Dados de até 10 dias atrás podem ser obtidos. Se estiver procurando por dados mais antigos, 
        use o ponto de extremidade histórico correspondente. 
      tags: 
        - flights 
      parameters: 
        - name: id 
          in: path 
          description: | 
            O fa_flight_id a ser buscado. Se estiver procurando por dados de mais de 10 dias atrás, 
            use o ponto de extremidade histórico correspondente. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: sequência de caracteres 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
        - nome: include_estimated_positions 
          em: consulta 
          descrição: se as posições estimadas devem ser incluídas no rastreamento de voo 
          esquema: 
            tipo: booleano 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  posições: 
                    tipo: matriz 
                    itens: 
                      título: FlightPosition 
                      tipo: objeto 
                      anulável: verdadeiro 
                      propriedades: 
                        fa_flight_id:
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                            posição. Este campo é preenchido apenas por `/flights/search/positions` 
                            (em outros casos, o usuário já terá especificado o fa_flight_id). 
                        altitude: 
                          tipo: inteiro 
                          descrição: Altitude da aeronave em centenas de pés 
                        altitude_change: 
                          tipo: string 
                          anulável: false 
                          descrição: | 
                            C quando a aeronave está subindo, D quando está descendo e - quando a 
                            altitude está sendo mantida. 
                          enum: 
                            - C 
                            - D 
                            - '-' 
                        groundspeed: 
                          tipo: inteiro 
                          descrição: Velocidade em solo mais recente (nós) 
                        heading: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: Rumo da aeronave em graus (0-360) 
                          mínimo: 0 
                          máximo: 360 
                        latitude: 
                          tipo: número 
                          descrição: Posição de latitude mais recente 
                        longitude: 
                          tipo: número 
                          descrição: Posição de longitude mais recente 
                        timestamp: 
                          tipo: string 
                          formato: data-hora 
                          descrição: Hora em que a posição foi recebida 
                          exemplo: '2021-12-31T19:59:59Z' 
                        update_type: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                            D=datalink, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                            S=baseado no espaço 
                          enum:
                            - P 
                            - O 
                            - Z 
                            - A 
                            - M 
                            - D 
                            - X 
                            - S 
                            - null 
                      required: 
                        - fa_flight_id 
                        - altitude 
                        - altitude_change 
                        - groundspeed 
                        - heading 
                        - latitude 
                        - longitude 
                        - timestamp 
                        - update_type 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ID pode estar ausente ou não estar no formato fa_flight_id. A aeronave pode estar bloqueada. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: | 
            Nenhuma trilha disponível para este voo. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    tipo: string 
                    description: Breve resumo do tipo de erro encontrado.
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/flights/{id}/route': 
    get: 
      operationId: get_flight_route 
      summary: Obtém a rota arquivada do voo 
      description: | 
        Retorna informações sobre a rota arquivada de um voo, incluindo coordenadas, 
        nomes e tipos de correções ao longo da rota. Nem todas as rotas de voo podem 
        ser decodificadas com sucesso por este endpoint, principalmente se o voo 
        não estiver totalmente dentro do espaço aéreo continental dos EUA, já que esta função 
        só tem acesso a auxílios de navegação dentro dessa área. Se os dados de um waypoint estiverem 
        ausentes, o tipo será listado como "DESCONHECIDO". Dados de até 10 dias 
        atrás podem ser obtidos. Se estiver procurando por dados mais antigos, use o 
        endpoint histórico correspondente. 
      tags: 
        - flights 
      parameters: 
        - name: id 
          in: path 
          description: | 
            O fa_flight_id a ser buscado. Se estiver procurando dados de mais de 10 dias atrás, 
            use o ponto de extremidade histórico correspondente. 
          obrigatório: true 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  route_distance: 
                    nulo: true 
                    tipo: string 
                  correções: 
                    tipo: array 
                    itens: 
                      título: RouteFix
                      tipo: objeto 
                      propriedades: 
                        nome: 
                          tipo: string 
                          descrição: Nome da correção de rota 
                        latitude: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: Longitude da correção em graus decimais 
                        longitude: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: Longitude da correção em graus decimais 
                        distance_from_origin: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: | 
                            Distância do aeroporto de origem indicada em milhas estatutárias, milhas náuticas ou 
                            quilômetros, dependendo das opções de exibição da conta FlightAware 
                        distance_this_leg: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: | 
                            Distância do último ponto na rota indicada em milhas estatutárias, 
                            milhas náuticas ou quilômetros, dependendo das opções de exibição da conta FlightAware 
                        distance_to_destination: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: | 
                            Distância até o aeroporto de destino indicada em milhas estatutárias, milhas náuticas ou 
                            quilômetros, dependendo das opções de exibição da conta FlightAware 
                        outbound_course: 
                          tipo: número 
                          anulável: verdadeiro 
                          descrição: | 
                            Curso em graus inteiros do ponto atual para o próximo em relação ao norte verdadeiro 
                        tipo: 
                          tipo: string 
                          descrição: Tipo de correção (ou seja, ponto de referência/ponto de relatório) 
                      necessário: 
                        - nome 
                        - latitude 
                        - longitude 
                        - distância_da_origem 
                        - distância_desta_etapa 
                        - distância_até_o_destino
                        - outbound_course 
                        - tipo 
                obrigatório: 
                  - route_distance 
                  - corrige 
        '400': 
          descrição: | 
            Parâmetro incorreto (id). O Id pode estar ausente ou pode não estar no formato fa_flight_id. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
        '404': 
          descrição: | 
            Nenhuma rota disponível para este voo. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório:
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/flights/{id}/map': 
    get: 
      operationId: get_flight_map 
      resumo: Obter uma imagem do trajeto de um voo em um mapa 
      descrição: | 
        Retorna o trajeto de um voo como uma imagem codificada em base64. A imagem pode conter uma 
        variedade de camadas de dados adicionais além do trajeto. Dados de até 10 dias 
        atrás podem ser obtidos. Se estiver procurando por dados mais antigos, use o 
        ponto de extremidade histórico correspondente. 
      tags: 
        - voos 
      parâmetros: 
        - nome: id 
          in: caminho 
          descrição: | 
            O fa_flight_id a ser buscado. Se estiver procurando por dados de mais de 10 dias atrás, 
            use o ponto de extremidade histórico correspondente. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
        - nome: altura 
          em: 
          descrição da consulta: altura da imagem solicitada (pixels) 
          esquema: 
            tipo: inteiro 
            mínimo: 1 
            máximo: 1500 
            padrão: 480 
        - nome: largura 
          em: 
          descrição da consulta: largura da imagem solicitada (pixels) 
          esquema: 
            tipo: inteiro 
            mínimo: 1 
            máximo: 1500 
            padrão: 640 
        - nome: camada_ativa 
          em: 
          descrição da consulta: lista de camadas de mapa a serem habilitadas 
          esquema: 
            tipo: matriz 
            itens: 
              tipo: string 
              enumeração: 
                - cidades dos EUA 
                - limites de países europeus 
                - limites de países asiáticos 
                - principais aeroportos - 
                limites de países - 
                limites de estados dos EUA 
                - água 
                - principais estradas dos EUA 
                - radar 
                - rastreamento 
                - voos 
                - aeroportos 
            padrão: 
              - limites de países 
              - limites de estados dos EUA 
              - água
              - Principais estradas dos EUA 
              - radar 
              - rastrear 
              - voos 
              - aeroportos 
        - nome: layer_off 
          in: 
          descrição da consulta: Lista de camadas de mapa a serem desabilitadas 
          esquema: 
            tipo: array 
            itens: 
              tipo: string 
              enum: 
                - Cidades dos EUA 
                - limites de países europeus 
                - limites de países asiáticos 
                - principais aeroportos 
                - limites de países 
                - limites de estados dos EUA - 
                água 
                - Principais estradas dos EUA 
                - radar 
                - rastrear 
                - voos 
                - aeroportos 
            padrão: 
              - Cidades dos EUA 
              - limites de países europeus - 
              limites de países asiáticos 
              - principais aeroportos 
        - nome: show_data_block 
          in: 
          descrição da consulta: | 
            Se uma legenda textual contendo o ident, o tipo, o rumo, 
            a altitude, a origem e o destino deve ser exibida pela 
            posição do voo. 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - nome: airports_expand_view 
          in: 
          descrição da consulta: | 
            Se deve forçar o zoom na área para garantir que os aeroportos de origem/destino estejam 
            visíveis. Habilitar esse sinalizador 
            também habilita o sinalizador show_airports. 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - nome: show_airports 
          in: 
          descrição da consulta: | 
            Se os aeroportos de origem/destino do voo devem ser exibidos como 
            pontos rotulados no mapa. 
          schema: 
            type: boolean 
            default: false 
        - name: bounding_box 
          in: query 
          description: | 
            Especifique manualmente a área de zoom do mapa usando limites personalizados. Deve 
            ser uma lista de 4 coordenadas representando os lados superior, direito, inferior e 
            esquerdo da área (nessa ordem). 
          schema: 
            type: array 
            items:
              tipo: número 
            itens mínimos: 4 
            itens máximos: 4 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  mapa: 
                    tipo: string 
                    formato: byte 
                necessário: 
                  - mapa 
        '400': 
          descrição: | 
            Parâmetro incorreto (id). O Id pode estar ausente ou pode não estar no formato fa_flight_id. Os cantos da caixa delimitadora podem estar definidos incorretamente. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: erro 
                tipo: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: o código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/foresight/flights/{ident}': 
    obter: 
      operationId: get_flight_with_foresight 
      resumo: 'Obter informações sobre um voo, incluindo dados do Foresight' 
      descrição: | 
        Retorna o resumo do status das informações do voo para um registro, ident ou 
        fa_flight_id, incluindo todos os campos previstos disponíveis. Se um 
        fa_flight_id for especificado, no máximo 1 voo será retornado, 
        a menos que o voo tenha sido desviado, caso em que tanto o 
        voo original quanto quaisquer desvios serão retornados com um fa_flight_id duplicado. 
      tags: 
        - foresight 
      parâmetros: 
        - nome: ident 
          em: caminho 
          descrição: |
            O ident, registro ou fa_flight_id a ser buscado. Se estiver usando 
            um ident de voo, é altamente recomendável especificar 
            o ident de voo ICAO em vez do ident de voo IATA para evitar ambiguidade e resultados inesperados. 
            Definir o ident_type também pode ser usado para ajudar a desambiguar. 
          required: true 
          schema: 
            type: string 
          examples: 
            ident: 
              value: UAL4 
            reg: 
              value: N123HQ 
            fa_id: 
              value: UAL1234-1234567890-airline-0123 
        - name: ident_type 
          in: query 
          description: | 
            Tipo de ident fornecido no parâmetro ident. Por padrão, o 
            ident passado é interpretado como um registro, se possível. Este parâmetro pode 
            forçar o ident a ser interpretado como um designador. 
          schema: 
            type: string 
            enum: 
              - designator 
              - registration 
              - fa_flight_id 
        - name: start 
          in: query 
          description: | 
            O intervalo de datas de início para resultados de voos, comparando com 
            o campo `scheduled_out` dos voos (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ISO8601 ou data e hora, e o limite é 
            inclusivo. A data de início especificada não pode ser posterior a 10 dias no 
            passado e 2 dias no futuro. Se não for especificado, o padrão será 
            partidas iniciadas aproximadamente 11 dias no passado. Se usar data 
            em vez de data e hora, o padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data e hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - nome: fim 
          em: consulta 
          descrição: | 
            O intervalo de datas final para os resultados de voos, comparando com 
            o campo `scheduled_out` dos voos (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ISO8601 ou data/hora, e o limite é
            exclusivo. A data de término especificada não pode ser posterior a 10 dias no 
            passado e 2 dias no futuro. Se não for especificado, o padrão será 
            partidas começando aproximadamente 2 dias no futuro. Se usar data 
            em vez de data e hora, o padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data e hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - in: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - in: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência uri 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: matriz 
                    itens: 
                      allOf: 
                        - título: BaseFlight 
                          tipo: objeto 
                          propriedades: 
                            ident:
                              tipo: string 
                              descrição: | 
                                O código do operador seguido pelo número do voo 
                                (para voos comerciais) ou o registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                            actual_runway_off: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Pista de partida real na origem, quando conhecida 
                            actual_runway_on: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Pista de chegada real no destino, quando conhecida 
                            fa_flight_id: 
                              tipo: string 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            operador: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Código ICAO, se existir, da operadora do voo, caso contrário, o código IATA 
                            operator_icao: 
                              type: string 
                              nullable: true 
                              description: | 
                                Código ICAO da operadora do voo. 
                            operator_iata:
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Código IATA da operadora do voo. 
                            flight_number: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Número do voo. 
                            registration: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Registro da aeronave (número da cauda), quando conhecido. 
                            atc_ident: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                            inbound_fa_flight_id: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                                aeronave que atende este voo. 
                            codeshares: 
                              tipo: array 
                              anulável: true 
                              descrição: | 
                                Lista de todos os codeshares da ICAO operando neste voo. 
                              items: 
                                tipo: string 
                            codeshares_iata: 
                              tipo: array 
                              anulável: true 
                              descrição: | 
                                Lista de todos os codeshares da IATA operando neste voo. 
                              items: 
                                tipo: string 
                            blocked: 
                              tipo: boolean 
                              descrição: | 
                                Sinalizador que indica se este voo está bloqueado para visualização pública. 
                            diverted: 
                              tipo: boolean
                              description: | 
                                Sinalizador que indica se este voo foi desviado. 
                            cancelled: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                                FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                                incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                                caso. 
                            position_only: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ou string ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: |
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            destination: 
                              description: | 
                                Informações para o aeroporto de destino deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ou string ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: |
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  nullable: true 
                                  exemplo: America/New_York 
                                nome: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  exemplo: LaGuardia 
                                cidade: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  exemplo: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  formato: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            departure_delay: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Atraso de partida (em segundos) com base no horário de partida do portão real ou estimado 
                                . Se o horário do portão não estiver disponível, será com base no 
                                horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                            arrival_delay: 
                              type: integer 
                              nullable: true 
                              description: |
                                Atraso de chegada (em segundos) com base no 
                                horário real ou estimado de chegada ao portão. Se o horário do portão não estiver disponível, será com base no 
                                horário de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                            filed_ete: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Duração do voo pista a pista registrada (segundos). 
                            progress_percent: 
                              type: integer 
                              nullable: true 
                              description: | 
                                A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                                para voos somente de posição em rota. 
                              minimum: 0 
                              maximum: 100 
                            status: 
                              type: string 
                              description: | 
                                Resumo legível do status do voo. 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: | 
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido. 
                            route_distance: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Distância de voo planejada (milhas estatutárias) com base na rota registrada. Pode 
                                variar da distância real voada. 
                            filed_airspeed: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Velocidade do ar IFR registrada (nós). 
                            filed_altitude: 
                              tipo: inteiro 
                              nullable: verdadeiro 
                              description: | 
                                Altitude IFR arquivada (centenas de pés). 
                            route: 
                              tipo: string
                              nullable: true 
                              description: | 
                                A descrição textual da rota do voo. 
                            baggage_claim: 
                              type: string 
                              nullable: true 
                              description: | 
                                Local de retirada de bagagem no aeroporto de destino. 
                            seats_cabin_business: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe executiva. 
                            seats_cabin_coach: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe econômica. 
                            seats_cabin_first: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da primeira classe. 
                            gate_origin: 
                              type: string 
                              nullable: true 
                              description: | 
                                Portão de embarque no aeroporto de origem. 
                            gate_destination: 
                              type: string 
                              nullable: true 
                              description: | 
                                Portão de desembarque no aeroporto de destino. 
                            terminal_origin: 
                              type: string 
                              nullable: true 
                              description: | 
                                Terminal de embarque no aeroporto de origem. 
                            terminal_destination: 
                              type: string 
                              nullable: true 
                              description: | 
                                Terminal de desembarque no aeroporto de destino. 
                            type: 
                              type: string 
                              description: |
                                Se este é um voo de aviação comercial ou geral. 
                              enum: 
                                - General_Aviation 
                                - Airline 
                            scheduled_out: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário de partida do portão programado. 
                              example: '2021-12-31T19:59:59Z' 
                            estimated_out: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário estimado de partida do portão. 
                              example: '2021-12-31T19:59:59Z' 
                            actual_out: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário real de partida do portão. 
                              example: '2021-12-31T19:59:59Z' 
                            scheduled_off: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário de partida da pista programado. 
                              example: '2021-12-31T19:59:59Z' 
                            estimated_off: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário estimado de partida da pista. 
                              Exemplo: '2021-12-31T19:59:59Z' 
                            actual_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário real de partida da pista. 
                              Exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_on:
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário programado de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário estimado de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário programado de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário estimado de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora real de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                          obrigatório: 
                            - ident 
                            - fa_flight_id 
                            - operador 
                            - operator_iata 
                            - flight_number 
                            - registration 
                            - atc_ident
                            - inbound_fa_flight_id 
                            - codeshares 
                            - bloqueado 
                            - desviado 
                            - cancelado 
                            - position_only 
                            - origem 
                            - destino 
                            - atraso_de_partida 
                            - atraso_de_chegada 
                            - filed_ete 
                            - progress_percent 
                            - status 
                            - aircraft_type 
                            - route_distance 
                            - filed_airspeed - 
                            filed_altitude 
                            - rota 
                            - retirada_de_bagagem 
                            - seats_cabin_business 
                            - seats_cabin_coach 
                            - seats_cabin_first 
                            - origem_do_portão 
                            - destino_do_portão 
                            - origem_do_terminal - destino_do_terminal 
                            - 
                            tipo 
                            - scheduled_out 
                            - estimated_out - 
                            actual_out - 
                            scheduled_off - 
                            estimated_off - 
                            actual_off - 
                            scheduled_on - 
                            estimated_on - actual_on 
                            - 
                            scheduled_in - 
                            estimated_in - 
                            actual_in 
                        - título: ForesightFields 
                          allOf: 
                            - título: ForesightPredictionsAvailable 
                              tipo: objeto 
                              propriedades: 
                                foresight_predictions_available: 
                                  tipo: booleano 
                                  descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade AeroAPI /foresight. 
                                  exemplo: verdadeiro 
                              obrigatório: 
                                - foresight_predictions_available
                            - título: ForesightLegacy 
                              tipo: objeto 
                              propriedades: 
                                predict_out: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: verdadeiro 
                                  descrição: Hora prevista para o evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_off: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: verdadeiro 
                                  descrição: Hora prevista para o evento de partida da pista. Disponível somente nos pontos de extremidade /foresight. 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_on: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: verdadeiro 
                                  descrição: Hora prevista para o evento de chegada à pista. Disponível somente nos pontos de extremidade /foresight. 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_in: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: verdadeiro 
                                  descrição: Hora prevista para o evento de chegada ao portão. Disponível somente nos pontos de extremidade /foresight. 
                                  Exemplo: '2021-12-31T19:59:59Z' 
                                predict_out_source: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  Descrição: Indicador de origem do horário previsto para o evento de saída do portão. Disponível apenas nos endpoints /foresight. 
                                  Enum: 
                                    - nulo 
                                    - Previsão 
                                    - Média Histórica. 
                                  Exemplo: Previsão 
                                predict_off_source: 
                                  tipo: string 
                                  anulável: verdadeiro
                                  descrição: Indicador de origem do tempo previsto para o evento de partida da pista. Disponível somente nos pontos de extremidade /foresight. 
                                  enum: 
                                    - null 
                                    - Foresight 
                                    - Média histórica 
                                  exemplo: Média histórica 
                                predict_on_source: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível somente nos pontos de extremidade /foresight. 
                                  enum: 
                                    - null 
                                    - Foresight 
                                    - Média histórica 
                                  exemplo: Média histórica 
                                predict_in_source: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível somente nos pontos de extremidade /foresight. 
                                  enum: 
                                    - null 
                                    - Foresight 
                                    - Média histórica 
                                  exemplo: Foresight 
                              necessário: 
                                - predict_out 
                                - predict_off 
                                - predict_on 
                                - predict_in 
                                - predict_out_source 
                                - predict_off_source 
                                - predict_on_source 
                                - predict_in_source 
                            - título: ForesightModern 
                              tipo: objeto 
                              propriedades: 
                                predict_taxi_out_duration: 
                                  tipo: número 
                                  anulável: true 
                                  descrição: Duração prevista em segundos do evento de partida do portão. Disponível apenas em endpoints /foresight. 
                                  Exemplo: 1234
                                prediction_taxi_out_duration_source: 
                                  type: string 
                                  nullable: true 
                                  description: Indicador de origem da duração prevista do evento de partida do portão. Disponível apenas nos endpoints /foresight. 
                                  enum: 
                                    - null 
                                    - 
                                  Exemplo do Foresight: Foresight 
                              necessário: 
                                - prediction_taxi_out_duration 
                                - prediction_taxi_out_duration_source 
                necessário: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O identificador pode estar ausente ou não estar no formato fa_flight_id ou as páginas podem ser < 1. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : objeto 
                properties: 
                  title: 
                    tipo: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: inteiro 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  /foresight/voos/pesquisa/avançado: 
    obter: 
      operationId: obter_voos_por_pesquisa_avançada_com_foresight 
      resumo: 'Buscar voos, as respostas incluem dados do Foresight' 
      descrição: | 
        Retorna voos atuais ou recentes com base em parâmetros de pesquisa geoespacial 
        . Se disponível, os campos OOOI previstos para os voos serão 
        definidos. 
      tags:
        - 
      parâmetros de previsão: 
        - nome: consulta 
          em: 
          descrição da consulta: | 
            Consulta para pesquisar voos no ar ou que chegaram recentemente. Não deve 
            exceder 1000 bytes de comprimento. Os critérios de pesquisa são aplicados apenas à 
            posição mais recente de um voo. Esta função pesquisa apenas voos 
            nas últimas 24 horas aproximadamente. Os operadores suportados incluem 
            (observe que os operadores aceitam números diferentes de argumentos): 

            * false - os resultados devem ter a chave booleana especificada definida como um valor false. Exemplo: {false arrived} 
            * true - os resultados devem ter a chave booleana especificada definida como um valor true. Exemplo: {true lifeguard} 
            * null - os resultados devem ter a chave especificada definida como um valor nulo. Exemplo: {null waypoints} 
            * notnull - os resultados devem ter a chave especificada não definida como um valor nulo. Exemplo: {notnull aircraftType} 
            * = - os resultados devem ter uma chave que corresponda exatamente ao valor especificado. Exemplo: {= aircraftType C172} 
            * != - os resultados devem ter uma chave que não corresponda ao valor especificado. Exemplo: {!= prefix H} 
            * < - os resultados devem ter uma chave que seja lexicograficamente menor que um valor especificado. Exemplo: {< arrivalTime 1276811040} 
            * \> - os resultados devem ter uma chave que seja lexicograficamente maior que um valor especificado. Exemplo: {> speed 500} 
            * <= - os resultados devem ter uma chave que seja lexicograficamente menor ou igual a um valor especificado. Exemplo: {<= alt 8000} 
            * \>= - os resultados devem ter uma chave que seja lexicograficamente maior ou igual a um valor especificado. 
            * match - os resultados devem ter uma chave que corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {match ident AAL*} 
            * notmatch - os resultados devem ter uma chave que não corresponda a um padrão curinga que não diferencia maiúsculas de minúsculas. Exemplo: {notmatch aircraftType B76*} 
            * range - os resultados devem ter uma chave que esteja numericamente entre os dois valores especificados. Exemplo: {range alt 8000 20000} 
            * in - os resultados devem ter uma chave que corresponda exatamente a um dos valores especificados. Exemplo: {in orig {KLAX KBUR KSNA KLGB}} 
            * orig_or_dest - os resultados devem ter a chave de origem ou destino que corresponda exatamente a um dos valores especificados. Exemplo: {orig_or_dest {KLAX KBUR KSNA KLGB}} 
            * airline - os resultados incluirão apenas o voo da companhia aérea se o argumento for 1, ou incluirão apenas os voos da GA se o argumento for 0. Exemplo: {airline 1}
            * aircraftType - os resultados devem ter uma chave aircraftType que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {aircraftType {B76* B77*}} 
            * ident - os resultados devem ter uma chave ident que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident {N123* N456* AAL* UAL*}} 
            * ident_or_reg - os resultados devem ter uma chave ident ou ser operado por um registro de aeronave que corresponda a um dos padrões curinga sem distinção entre maiúsculas e minúsculas especificados. Exemplo: {ident_or_reg {N123* N456* AAL* UAL*}} 

            Os nomes de chave suportados incluem (observe que nem todos esses nomes de chave são retornados na estrutura do resultado, e alguns têm nomes ligeiramente diferentes): 

            * actualDepartureTime - Hora real da partida ou nulo se ainda não partiu. UNIX epoch timestamp segundos desde 1970 
            * aircraftType - ID do tipo de aeronave (por exemplo: B763) 
            * alt - altitude na última posição relatada (centenas de pés ou nível de voo) 
            * altChange - indicação de mudança de altitude (por exemplo: "C" se estiver subindo, "D" se estiver descendo e vazio se estiver nivelado ) 
            * arrivalTime - hora real de chegada ou nulo se ainda não chegou. UNIX epoch timestamp segundos desde 1970 
            * arrived - verdadeiro se o voo chegou ao seu destino. 
            * cancelled - verdadeiro se o voo foi cancelado. O significado de cancelamento é que o voo não está mais sendo rastreado pelo FlightAware. Há vários motivos pelos quais um voo pode ser cancelado, incluindo o cancelamento pela companhia aérea, mas nem sempre será esse o caso. 
            * cdt - Hora de partida controlada, definida se houver uma espera em solo no voo. UNIX epoch timestamp segundos desde 1970 
            * clock - hora da última posição recebida. Segundos do carimbo de data/hora da época UNIX desde 1970 
            * cta - Hora de chegada controlada, definida se houver uma espera em solo no voo. Segundos do carimbo de data/hora da época UNIX desde 1970 
            * dest - Código ICAO do aeroporto de destino (por exemplo: KLAX) 
            * edt - Hora estimada de partida. Segundos do carimbo de data/hora da época UNIX desde 1970 
            * eta - Hora estimada de chegada. Segundos do carimbo de data/hora da época UNIX desde 1970 
            * fdt - Hora de partida do campo. Segundos do carimbo de data/hora da época UNIX desde 1970 
            * firstPositionTime - Hora em que a primeira posição relatada foi recebida ou 0 se nenhuma posição foi recebida ainda. Marcação de data e hora da época em segundos desde 1970 
            * correções - interseções e/ou VORs ao longo da rota (por exemplo: SLS AMERO ARTOM VODIR NOTOS ULAPA ACA NUXCO OLULA PERAS ALIPO UPN GDL KEDMA BRISA CUL PERTI CEN PPE ALTAR ASUTA JLI RONLD LAADY WYVIL OLDEE RAL PDZ ARNES BASET WELLZ CIVET)
            * fp - identificador exclusivo atribuído pelo FlightAware para este voo, também conhecido como fa_flight_id. 
            * gs - velocidade em solo na última posição informada, em nós. 
            * heading - direção da viagem na última posição informada. 
            * hiLat - latitude mais alta percorrida pelo voo. 
            * hiLon - longitude mais alta percorrida pelo voo. 
            * ident - identificador do voo ou registro da aeronave. 
            * lastPositionTime - hora em que a última posição informada foi recebida, ou 0 se nenhuma posição foi recebida ainda. Carimbo de data/hora da época em segundos desde 1970. 
            * lat - latitude da última posição informada. 
            * lifeguard - verdadeiro se for um voo de resgate "salva-vidas". 
            * lon - longitude da última posição informada. 
            * lowLat - latitude mais baixa percorrida pelo voo. 
            * lowLon - longitude mais baixa percorrida pelo voo. 
            * ogta - hora original de chegada. Carimbo de data/hora da época do UNIX em segundos desde 1970. 
            * ogtd - hora original de partida. Segundos de carimbo de data/hora da época UNIX desde 1970 
            * orig - código de origem do aeroporto ICAO (por exemplo: KIAH) 
            * physClass - classe física (por exemplo: J é jato) 
            * prefix - um código de prefixo identificador de um ou dois caracteres (valores comuns: G ou GG Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
            * speed - velocidade em solo, em nós. 
            * status - código de uma única letra para o status atual do voo, pode ser S Scheduled, F Filed, A Active, Z Completed ou X Cancelled. 
            * updateType - fonte de dados da última posição (P=projected, O=oceanic, Z=radar, A=ADS-B, M=multilateração, D=datalink, X=superfície e próxima à superfície (ADS-B e ASDE-X), S=baseado no espaço). 
            * waypoints - todas as interseções e VORs que compõem o 
          esquema de rota: 
            type: string 
            example: | 
              {orig_or_dest {KLAX KBUR KSNA KLGB}} {<= alt 8000} {match ident AAL*} 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200':
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: matriz 
                    itens: 
                      allOf: 
                        - título: InFlightStatus 
                          tipo: objeto 
                          propriedades: 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código da operadora seguido pelo número do voo 
                                (para voos comerciais) ou o registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                            fa_flight_id: 
                              tipo: string 
                              descrição: | 
                                Identificador exclusivo atribuído pela FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho terá uma duplicata.
                                fa_flight_id. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code:
                                  type: string
                                  description: |
                                    ICAO/IATA/LID code or string indicating the location where
                                    tracking of the flight began/ended for position-only flights.
                                  nullable: true
                                code_icao:
                                  type: string
                                  description: |
                                    ICAO code
                                  nullable: true
                                code_iata:
                                  type: string
                                  description: |
                                    IATA code
                                  nullable: true
                                code_lid:
                                  type: string
                                  description: |
                                    LID code
                                  nullable: true
                                timezone:
                                  type: string
                                  description: |
                                    Applicable timezone for the airport, in the TZ database format
                                  nullable: true
                                  example: America/New_York
                                name:
                                  type: string
                                  description: |
                                    Common name of airport
                                  nullable: true
                                  example: LaGuardia
                                city:
                                  type: string
                                  description: |
                                    Closest city to the airport
                                  nullable: true
                                  example: New York
                                airport_info_url:
                                  type: string
                                  nullable: true
                                  format: uri-reference
                                  description: The URL to more information about the airport. Will be null for position-only flights.
                              required:
                                - code 
                                - airport_info_url 
                            destination: 
                              description: | 
                                Informações sobre o aeroporto de destino deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ICAO/IATA/LID ou string que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: | 
                                    Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: |
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: Nova York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            waypoints: 
                              type: array 
                              items: 
                                type: number 
                              description: | 
                                Waypoints da rota como uma matriz de latitudes e longitudes alternadas. 
                            first_position_time: 
                              type: string 
                              nullable: true 
                              format: data e hora 
                              description: Carimbo de data e hora de quando a primeira posição deste voo foi recebida. 
                              example: '2021-12-31T19:59:59Z' 
                            last_position: 
                              type: object 
                              description: Posição mais recente recebida para este voo. 
                              title: FlightPosition 
                              nullable: true 
                              properties: 
                                fa_flight_id: 
                                  type: string 
                                  nullable: true 
                                  description: | 
                                    Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                                    posição. Este campo é preenchido apenas por `/flights/search/positions` 
                                    (em outros casos, o usuário já terá especificado o fa_flight_id).
                                altitude: 
                                  tipo: inteiro 
                                  descrição: Altitude da aeronave em centenas de pés 
                                altitude_change: 
                                  tipo: string 
                                  anulável: falso 
                                  descrição: | 
                                    C quando a aeronave estiver subindo, D quando estiver descendo e - quando a 
                                    altitude estiver sendo mantida. 
                                  enum: 
                                    - C 
                                    - D 
                                    - '-' 
                                groundspeed: 
                                  tipo: inteiro 
                                  descrição: Velocidade em solo mais recente (nós) 
                                heading: 
                                  tipo: inteiro 
                                  anulável: verdadeiro 
                                  descrição: Rumo da aeronave em graus (0-360) 
                                  mínimo: 0 
                                  máximo: 360 
                                latitude: 
                                  tipo: número 
                                  descrição: Posição de latitude mais recente 
                                longitude: 
                                  tipo: número 
                                  descrição: Posição de longitude mais recente 
                                timestamp: 
                                  tipo: string 
                                  formato: data-hora 
                                  descrição: Hora em que a posição foi recebida 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                update_type: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  descrição: | 
                                    P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                                    D=datalink, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                                    S=baseado no espaço 
                                  enum: 
                                    - P 
                                    - O 
                                    - Z
                                    - A 
                                    - M 
                                    - D 
                                    - X 
                                    - S 
                                    - null 
                              required: 
                                - fa_flight_id 
                                - altitude 
                                - altitude_change 
                                - groundspeed 
                                - heading 
                                - latitude 
                                - longitude 
                                - timestamp 
                                - update_type 
                            bounding_box: 
                              type: array 
                              nullable: true 
                              description: | 
                                Lista de 4 coordenadas representando as bordas de uma caixa que 
                                contém inteiramente as posições deste voo. A ordem das coordenadas são os 
                                lados superior, esquerdo, inferior e direito da caixa. 
                              maxItems: 4 
                              minItems: 4 
                              items: 
                                type: number 
                            ident_prefix: 
                              type: string 
                              nullable: true 
                              description: | 
                                Um código de prefixo identificador de um ou dois caracteres (Valores comuns: G ou GG 
                                Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: | 
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido. 
                            actual_off: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Hora real de partida da pista. 
                              exemplo: '2021-12-31T19:59:59Z'
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Hora real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                          obrigatório: 
                            - ident 
                            - fa_flight_id 
                            - actual_off 
                            - actual_on - 
                            origin 
                            - destination 
                            - waypoints 
                            - first_position_time - 
                            last_position 
                            - bounding_box - 
                            ident_prefix 
                            - aircraft_type 
                        - título: ForesightFields 
                          allOf: 
                            - título: ForesightPredictionsAvailable 
                              tipo: objeto 
                              propriedades: 
                                foresight_predictions_available: 
                                  tipo: booleano 
                                  descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade /foresight da AeroAPI. 
                                  exemplo: true 
                              obrigatório: 
                                - foresight_predictions_available 
                            - título: ForesightLegacy 
                              tipo: objeto 
                              propriedades: 
                                predict_out: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: true 
                                  descrição: Hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                                  Exemplo: '2021-12-31T19:59:59Z' 
                                predict_off: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: verdadeiro 
                                  descrição: Horário previsto para o evento de partida da pista. Disponível apenas nos endpoints /foresight.
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_on: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: true 
                                  descrição: Hora prevista do evento de chegada à pista. Disponível somente nos endpoints /foresight. 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_in: 
                                  tipo: string 
                                  formato: data-hora 
                                  anulável: true 
                                  descrição: Hora prevista do evento de chegada ao portão. Disponível somente nos endpoints /foresight. 
                                  exemplo: '2021-12-31T19:59:59Z' 
                                predict_out_source: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: Indicador de origem da hora prevista do evento de partida do portão. Disponível somente nos endpoints /foresight. 
                                  enum: 
                                    - null 
                                    - Foresight 
                                    - Média Histórica 
                                  exemplo: Foresight 
                                predict_off_source: 
                                  tipo: string 
                                  anulável: true 
                                  descrição: Indicador de origem da hora prevista do evento de partida da pista. Disponível somente nos endpoints /foresight. 
                                  enum: 
                                    - null 
                                    - Previsão 
                                    - Média Histórica 
                                  exemplo: Média Histórica 
                                predict_on_source: 
                                  tipo: string 
                                  nullable: true 
                                  descrição: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível apenas nos endpoints /foresight. 
                                  enum: 
                                    - null 
                                    - Previsão 
                                    - Média Histórica
                                  exemplo: Média Histórica 
                                prediction_in_source: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  descrição: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível somente nos endpoints /foresight. 
                                  enum: 
                                    - nulo 
                                    - Previsão 
                                    - Média Histórica 
                                  exemplo: Previsão 
                              necessária: 
                                - prediction_out 
                                - prediction_off 
                                - prediction_on 
                                - prediction_in 
                                - prediction_out_source 
                                - prediction_off_source 
                                - prediction_on_source 
                                - prediction_in_source 
                            - título: PrevisãoModerna 
                              tipo: objeto 
                              propriedades: 
                                prediction_taxi_out_duration: 
                                  tipo: número 
                                  anulável: verdadeiro 
                                  descrição: Duração prevista em segundos para o evento de partida do portão. Disponível somente nos endpoints /foresight. 
                                  exemplo: 1234 
                                prediction_taxi_out_duration_source: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  descrição: Indicador de origem da duração prevista para o evento de partida do portão. Disponível somente nos endpoints /foresight. 
                                  enum: 
                                    - null 
                                    - 
                                  Exemplo de Foresight: Foresight 
                              necessário: 
                                - expected_taxi_out_duration 
                                - expected_taxi_out_duration_source 
                necessário: 
                  - links 
                  - num_pages 
                  - voos 
        '400': 
          description: |
            Parâmetro(s) incorreto(s). A consulta pode estar incorreta. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/foresight/flights/{id}/position': 
    get: 
      operationId: get_flight_position_with_foresight 
      summary: 'Obter a posição atual do voo, incluindo dados do Foresight' 
      description: Retorna a posição mais recente de um voo 
      tags: 
        - foresight 
      parameters: 
        - name: id 
          in: path 
          description: | 
            O fa_flight_id a ser buscado. Se estiver procurando dados de mais de 10 dias atrás, 
            use o ponto de extremidade histórico correspondente. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                allOf: 
                  - título: InFlightStatus 
                    tipo: objeto 
                    propriedades: 
                      ident: 
                        tipo: string 
                        descrição: | 
                          O código do operador seguido pelo número do voo para o voo
                          (para voos comerciais) ou o registro da aeronave (para 
                          aviação geral). 
                      ident_icao: 
                        type: string 
                        nullable: true 
                        description: | 
                          O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                      ident_iata: 
                        type: string 
                        nullable: true 
                        description: | 
                          O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                      fa_flight_id: 
                        type: string 
                        description: | 
                          Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                          o voo for desviado, o novo trecho do voo terá um 
                          fa_flight_id duplicado. 
                      origin: 
                        description: | 
                          Informações sobre o aeroporto de origem deste voo. 
                        title: FlightAirportRef 
                        type: object 
                        nullable: true 
                        properties: 
                          code: 
                            type: string 
                            description: | 
                              Código ou string ICAO/IATA/LID que indica o local onde 
                              o rastreamento do voo começou/terminou para voos somente de posição. 
                            nullable: true 
                          code_icao: 
                            type: string 
                            description: | 
                              Código ICAO 
                            nullable: true 
                          code_iata: 
                            type: string 
                            description: | 
                              Código IATA 
                            anulável: true 
                          code_lid: 
                            tipo: string 
                            descrição: | 
                              Código LID 
                            anulável: true 
                          fuso horário: 
                            tipo: string
                            descrição: | 
                              Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                            anulável: true 
                            exemplo: América/Nova_Iorque 
                          nome: 
                            tipo: string 
                            descrição: | 
                              Nome comum do aeroporto 
                            anulável: true 
                            exemplo: LaGuardia 
                          cidade: 
                            tipo: string 
                            descrição: | 
                              Cidade mais próxima do aeroporto 
                            anulável: true 
                            exemplo: Nova Iorque 
                          airport_info_url: 
                            tipo: string 
                            anulável: true 
                            formato: uri-reference 
                            descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                        obrigatório: 
                          - código 
                          - airport_info_url 
                      destino: 
                        descrição: | 
                          Informações para o aeroporto de destino deste voo. 
                        título: FlightAirportRef 
                        tipo: objeto 
                        anulável: true 
                        propriedades: 
                          código: 
                            tipo: string 
                            descrição: | 
                              Código ou string ICAO/IATA/LID que indica o local onde 
                              o rastreamento do voo começou/terminou para voos somente de posição. 
                            anulável: true 
                          code_icao: 
                            tipo: string 
                            descrição: | 
                              Código ICAO 
                            anulável: true 
                          code_iata: 
                            tipo: string 
                            descrição: | 
                              Código IATA 
                            anulável: true 
                          code_lid: 
                            tipo: string
                            descrição: | 
                              Código LID 
                            anulável: true 
                          fuso horário: 
                            tipo: string 
                            descrição: | 
                              Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                            anulável: true 
                            exemplo: América/Nova_Iorque 
                          nome: 
                            tipo: string 
                            descrição: | 
                              Nome comum do aeroporto 
                            anulável: true 
                            exemplo: LaGuardia 
                          cidade: 
                            tipo: string 
                            descrição: | 
                              Cidade mais próxima do aeroporto 
                            anulável: true 
                            exemplo: Nova Iorque 
                          airport_info_url: 
                            tipo: string 
                            anulável: true 
                            formato: uri-reference 
                            descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                        obrigatório: 
                          - código 
                          - airport_info_url 
                      waypoints: 
                        tipo: matriz 
                        itens: 
                          tipo: número 
                        descrição: | 
                          Waypoints da rota como uma matriz de latitudes e longitudes alternadas. 
                      first_position_time: 
                        tipo: string 
                        anulável: true 
                        formato: data e hora 
                        descrição: Carimbo de data e hora de quando a primeira posição para este voo foi recebida. 
                        exemplo: '2021-12-31T19:59:59Z' 
                      last_position: 
                        tipo: objeto 
                        descrição: posição mais recente recebida para este voo. 
                        título: FlightPosition 
                        anulável: verdadeiro 
                        propriedades: 
                          fa_flight_id: 
                            tipo: string
                            nullable: true 
                            description: | 
                              Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                              posição. Este campo é preenchido apenas por `/flights/search/positions` 
                              (em outros casos, o usuário já terá especificado o fa_flight_id). 
                          altitude: 
                            type: integer 
                            description: Altitude da aeronave em centenas de pés 
                          altitude_change: 
                            type: string 
                            nullable: false 
                            description: | 
                              C quando a aeronave está subindo, D quando está descendo e - quando a 
                              altitude está sendo mantida. 
                            enum: 
                              - C 
                              - D 
                              - '-' 
                          groundspeed: 
                            tipo: inteiro 
                            descrição: Velocidade em solo mais recente (nós) 
                          heading: 
                            tipo: inteiro 
                            anulável: verdadeiro 
                            descrição: Rumo da aeronave em graus (0-360) 
                            mínimo: 0 
                            máximo: 360 
                          latitude: 
                            tipo: número 
                            descrição: Posição de latitude mais recente 
                          longitude: 
                            tipo: número 
                            descrição: Posição de longitude mais recente 
                          timestamp: 
                            tipo: string 
                            formato: data-hora 
                            descrição: Hora em que a posição foi recebida 
                            exemplo: '2021-12-31T19:59:59Z' 
                          update_type: 
                            tipo: string 
                            anulável: verdadeiro 
                            descrição: | 
                              P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                              D=datalink, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                              S=baseado no espaço
                            enum: 
                              - P 
                              - O 
                              - Z 
                              - A 
                              - M 
                              - D 
                              - X 
                              - S 
                              - null 
                        required: 
                          - fa_flight_id 
                          - altitude 
                          - altitude_change 
                          - groundspeed 
                          - heading 
                          - latitude 
                          - longitude 
                          - timestamp 
                          - update_type 
                      bounding_box: 
                        type: array 
                        nullable: true 
                        description: | 
                          Lista de 4 coordenadas representando as bordas de uma caixa que 
                          contém inteiramente as posições deste voo. A ordem das coordenadas são os 
                          lados superior, esquerdo, inferior e direito da caixa. 
                        maxItems: 4 
                        minItems: 4 
                        items: 
                          type: number 
                      ident_prefix: 
                        type: string 
                        nullable: true 
                        description: | 
                          Um código de prefixo identificador de um ou dois caracteres (Valores comuns: G ou GG 
                          Medevac, L Lifeguard, A Air Taxi, H Heavy, M Medium). 
                      aircraft_type: 
                        type: string 
                        nullable: true 
                        description: | 
                          O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                          quando o código ICAO não for conhecido. 
                      actual_off: 
                        type: string 
                        format: date-time 
                        nullable: true 
                        description: | 
                          Horário real de partida da pista. 
                        Exemplo: '2021-12-31T19:59:59Z' 
                      actual_on: 
                        tipo: string
                        formato: data-hora 
                        anulável: verdadeiro 
                        descrição: | 
                          Hora real de chegada à pista. 
                        exemplo: '2021-12-31T19:59:59Z' 
                    obrigatório: 
                      - ident 
                      - fa_flight_id 
                      - actual_off 
                      - actual_on - 
                      origem 
                      - destino 
                      - waypoints 
                      - first_position_time 
                      - last_position - 
                      bounding_box - 
                      ident_prefix 
                      - aircraft_type 
                  - título: ForesightFields 
                    allOf: 
                      - título: ForesightPredictionsAvailable 
                        tipo: objeto 
                        propriedades: 
                          foresight_predictions_available: 
                            tipo: booleano 
                            descrição: Indica se as previsões do Foresight estão disponíveis para os pontos de extremidade /foresight da AeroAPI. 
                            exemplo: verdadeiro 
                        obrigatório: 
                          - foresight_predictions_available 
                      - título: ForesightLegacy 
                        tipo: objeto 
                        propriedades: 
                          predict_out: 
                            tipo: string 
                            formato: data-hora 
                            anulável: verdadeiro 
                            descrição: Hora prevista do evento de partida do portão. Disponível somente nos pontos de extremidade /foresight. 
                            Exemplo: '2021-12-31T19:59:59Z' 
                          predict_off: 
                            tipo: string 
                            formato: data-hora 
                            anulável: verdadeiro 
                            Descrição: Horário previsto para o evento de partida da pista. Disponível apenas nos endpoints /foresight. 
                            Exemplo: '2021-12-31T19:59:59Z' 
                          predict_on: 
                            tipo: string 
                            formato: data-hora 
                            anulável: verdadeiro
                            descrição: Tempo previsto para o evento de chegada à pista. Disponível somente nos endpoints /foresight. 
                            exemplo: '2021-12-31T19:59:59Z' 
                          predict_in: 
                            tipo: string 
                            formato: data-hora 
                            anulável: verdadeiro 
                            descrição: Tempo previsto para o evento de chegada ao portão. Disponível somente nos endpoints /foresight. 
                            exemplo: '2021-12-31T19:59:59Z' 
                          predict_out_source: 
                            tipo: string 
                            anulável: verdadeiro 
                            descrição: Indicador de origem do tempo previsto para o evento de partida do portão. Disponível somente nos endpoints /foresight. 
                            enum: 
                              - nulo 
                              - Previsão 
                              - Média histórica 
                            exemplo: Previsão 
                          predict_off_source: 
                            tipo: string 
                            anulável: verdadeiro 
                            descrição: Indicador de origem do tempo previsto para o evento de partida da pista. Disponível somente nos endpoints /foresight. 
                            enum: 
                              - nulo 
                              - Previsão 
                              - Média histórica 
                            exemplo: Média histórica 
                          predict_on_source: 
                            tipo: string 
                            anulável: verdadeiro 
                            descrição: Indicador de origem do tempo previsto para o evento de chegada à pista. Disponível apenas nos endpoints /foresight. 
                            enum: 
                              - null 
                              - Foresight 
                              - Média Histórica. 
                            exemplo: Média Histórica 
                          predict_in_source: 
                            tipo: string 
                            nullable: true 
                            descrição: Indicador de origem do tempo previsto para o evento de chegada ao portão. Disponível apenas nos endpoints /foresight. 
                            enum: 
                              - null 
                              - Foresight
                              - Exemplo de média histórica 
                            : Previsão 
                        necessária: 
                          - expected_out 
                          - expected_off 
                          - predict_on 
                          - predict_in 
                          - predict_out_source 
                          - predict_off_source 
                          - predict_on_source 
                          - predict_in_source 
                      - título: ForesightModern 
                        tipo: objeto 
                        propriedades: 
                          predict_taxi_out_duration: 
                            tipo: número 
                            anulável: verdadeiro 
                            descrição: Duração prevista em segundos do evento de partida do portão. Disponível somente nos endpoints /foresight. 
                            exemplo: 1234 
                          predict_taxi_out_duration_source: 
                            tipo: sequência de caracteres 
                            anulável: verdadeiro 
                            descrição: Indicador de origem da duração prevista do evento de partida do portão. Disponível somente nos endpoints /foresight. 
                            enum: 
                              - nulo 
                              - 
                            Exemplo de previsão: Previsão 
                        necessária: 
                          - predict_taxi_out_duration 
                          - predict_taxi_out_duration_source 
        '400': 
          descrição: | 
            Parâmetro incorreto (id). O Id pode estar ausente ou pode não estar no formato fa_flight_id. A consulta pode estar incorreta. 
          conteúdo: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  /airports: 
    parameters: 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        schema: 
          type: integer 
          default: 1 
          minimum: 1 
      - in: query 
        name: cursor 
        description: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        schema: 
          type: string 
    get: 
      operationId: get_all_airports 
      summary: Obter todos os aeroportos 
      description: | 
        Retorna os identificadores ICAO de todos os aeroportos conhecidos. Para aeroportos que 
        não têm um identificador ICAO, o identificador FAA LID será usado. 
        Links para mais informações sobre cada aeroporto estão incluídos. 
      tags: 
        - airports 
      responses: 
        '200': 
          description: Retorna uma lista de aeroportos 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                type: object 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: inteiro 
                    minimum: 1 
                  airports: 
                    type: array 
                    items:
                      título: AirportRef 
                      tipo: objeto 
                      anulável: verdadeiro 
                      propriedades: 
                        código: 
                          tipo: sequência de caracteres 
                          descrição: | 
                            Identificador ICAO se conhecido, caso contrário, IATA ou LID. Para 
                            voos somente de posição, também pode ser uma sequência de caracteres indicando o local onde o rastreamento 
                            do voo começou/terminou. 
                        airport_info_url: 
                          tipo: sequência de 
                          caracteres anulável: verdadeiro 
                          formato: referência-URI 
                          descrição: A URL para mais informações sobre o aeroporto. 
                      obrigatório: 
                        - código 
                        - airport_info_url 
                obrigatório: 
                  - links 
                  - num_pages 
                  - aeroportos 
  /airports/nearby: 
    obter: 
      operationId: obter_aeroportos_próximos 
      resumo: Obter aeroportos próximos a um local 
      descrição: | 
        Retorna uma lista de aeroportos localizados a uma determinada distância do 
        local fornecido. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: latitude 
          em: consulta 
          descrição: | 
            A latitude do ponto usado para pesquisar aeroportos próximos 
          obrigatório: verdadeiro 
          esquema: 
            tipo: número 
        - nome: longitude 
          em: consulta 
          descrição: | 
            A longitude do ponto usado para pesquisar aeroportos próximos 
          obrigatório: true 
          esquema: 
            tipo: número 
        - nome: raio 
          em: consulta 
          descrição: | 
            O raio de pesquisa a ser usado para encontrar aeroportos próximos (milhas estatutárias) 
          obrigatório: true 
          esquema: 
            tipo: inteiro 
        - nome: only_iap 
          em: consulta 
          descrição: | 
            Retorna apenas aeroportos próximos com aproximações por instrumentos (também limita 
            os resultados a aeroportos da América do Norte) 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - em: consulta
          nome: max_pages 
          descrição: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - em: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  aeroportos: 
                    tipo: array 
                    itens: 
                      título: NearbyAirport 
                      allOf: 
                        - tipo: objeto 
                          propriedades: 
                            airport_code: 
                              tipo: string 
                              descrição: 'Identificador de aeroporto padrão, geralmente ICAO, mas pode ser IATA ou LID se o aeroporto não tiver um código ICAO' 
                              exemplo: KHOU 
                            code_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador ICAO para o aeroporto, se conhecido 
                              exemplo: KHOU 
                            code_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador IATA para o aeroporto, se conhecido
                              exemplo: HOU 
                            code_lid: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador LID para o aeroporto, se conhecido 
                              exemplo: HOU 
                            alternate_ident: 
                              obsoleto: verdadeiro 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: 'Identificador IATA ou LID para o aeroporto. (Obsoleto, use code_iata para o identificador IATA ou code_lid para o identificador LID.)' 
                            nome: 
                              tipo: string 
                              descrição: Nome comum para o aeroporto 
                              exemplo: Londres Heathrow 
                            tipo: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Tipo de aeroporto 
                              enum: 
                                - Aeroporto 
                                - Heliporto 
                                - Base de Hidroaviões 
                                - Ultraleve - 
                                Stolport 
                                - Gliderport 
                                - Balloonport 
                                - nulo 
                            elevação: 
                              tipo: número 
                              descrição: Altura acima do Nível Médio do Mar (MSL) 
                            cidade: 
                              tipo: string 
                              descrição: Cidade mais próxima do aeroporto 
                            estado: 
                              tipo: string 
                              descrição: | 
                                Estado/província onde o aeroporto reside, se aplicável. Para estados dos EUA, 
                                este será o código de 2 letras; para províncias ou outras entidades, será 
                                o nome completo. 
                            longitude: 
                              tipo: número 
                              descrição: longitude do 'aeroporto', geralmente o ponto central do aeroporto 
                            latitude: 
                              tipo: número
                              descrição: latitude do 'aeroporto', geralmente o ponto central do aeroporto' 
                            fuso horário: 
                              tipo: string 
                              descrição: 'Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ' 
                              exemplo: América/Chicago 
                            country_code: 
                              tipo: string 
                              descrição: código de 2 letras do país onde o aeroporto está localizado (ISO 3166-1 alfa-2) 
                            wiki_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: link para a página da wikipedia do aeroporto 
                              formato: uri 
                            airport_flights_url: 
                              tipo: string 
                              formato: uri-referência 
                              descrição: a URL para voos para este aeroporto 
                          obrigatório: 
                            - airport_code 
                            - alternate_ident 
                            - nome 
                            - elevação 
                            - cidade 
                            - estado 
                            - longitude 
                            - latitude 
                            - fuso horário 
                            - country_code 
                            - wiki_url 
                            - airport_flights_url 
                        - tipo: objeto 
                          propriedades: 
                            distância: 
                              tipo: inteiro 
                              descrição: | 
                                Distância do aeroporto a partir do local especificado (milhas estatutárias) 
                            título: 
                              tipo: inteiro 
                              descrição: | 
                                Direção do local especificado para o aeroporto (graus) 
                              mínimo: 1 
                              máximo: 360 
                            direção: 
                              tipo: string 
                              descrição: | 
                                Direção cardinal do local especificado para o aeroporto
                              enum: 
                                - 'N' 
                                - E 
                                - S 
                                - W 
                                - NE 
                                - SE 
                                - SW 
                                - NW 
                          required: 
                            - distance 
                            - heading 
                            - direction 
                required: 
                  - links 
                  - num_pages 
                  - airports 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). Esperado(s): latitude e longitude numéricas, raio > 0. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  /airports/delays: 
    parameters: 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro 
          padrão: 1 
          mínimo: 1 
      - em: consulta 
        nome: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    obter:
      operationId: get_delays_for_all_airports 
      summary: Obter informações sobre atrasos para todos os aeroportos com atrasos 
      description: | 
        Retorna uma lista de aeroportos com atrasos. Pode haver vários motivos 
        retornados por aeroporto se houver vários tipos de atrasos relatados em 
        um aeroporto. Observe que voos individuais podem ser atrasados ​​sem que 
        haja um atraso em todo o aeroporto retornado por este ponto de extremidade. 
      tags: 
        - aeroportos 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: inteiro 
                    minimum: 1 
                  delays: 
                    type: array 
                    items: 
                      title: Atraso no Aeroporto 
                      type: objeto 
                      properties: 
                        aeroporto: 
                          type: string 
                          description: Código ICAO/IATA do aeroporto 
                        category: 
                          type: string 
                          description: | 
                            Categoria do maior atraso. Alguns valores possíveis são "clima", "tráfego", 
                            "equipamento", etc. 
                        cor: 
                          tipo: string 
                          descrição: cor do maior atraso 
                          enum: 
                            - vermelho 
                            - amarelo 
                            - verde 
                        delay_secs: 
                          tipo: inteiro
                          descrição: | 
                            Duração do maior atraso (segundos). Este valor não deve ser 
                            apresentado aos usuários e deve ser usado apenas para classificar os resultados. 
                        motivos: 
                          tipo: matriz 
                          descrição: Motivos do atraso 
                          itens: 
                            tipo: objeto 
                            propriedades: 
                              categoria: 
                                tipo: string 
                                descrição: | 
                                  Categoria do atraso. Alguns valores possíveis são "clima", "trânsito", 
                                  "equipamento" etc. 
                              cor: 
                                tipo: string 
                                descrição: Cor que indica a gravidade do atraso 
                                enum: 
                                  - vermelho 
                                  - amarelo 
                                  - verde 
                              delay_secs: 
                                tipo: inteiro 
                                descrição: | 
                                  Duração do atraso (segundos). Este valor não deve ser 
                                  apresentado aos usuários e deve ser usado apenas para classificar os resultados. 
                              motivo: 
                                tipo: string 
                                descrição: Descrição textual da causa do atraso 
                            obrigatório: 
                              - categoria 
                              - cor 
                              - delay_secs 
                              - motivo 
                      obrigatório: 
                        - aeroporto 
                        - categoria 
                        - cor 
                        - delay_secs 
                        - motivos 
                obrigatórios: 
                  - links 
                  - num_pages 
                  - atrasos 
  '/airports/{id}': 
    obter: 
      operationId: obter_aeroporto 
      resumo: Obter informações estáticas sobre um aeroporto 
      descrição: | 
        Retorna informações sobre um aeroporto dado um código de aeroporto ICAO ou LID
        como KLAX, KIAH, O07, etc. Os dados retornados incluem nome do aeroporto, 
        cidade, estado (quando conhecido), latitude, longitude e fuso horário. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          in: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
      respostas: 
        '200': 
          descrição: Informações sobre o aeroporto solicitado. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              schema: 
                allOf: 
                  - type: object 
                    properties: 
                      airport_code: 
                        type: string 
                        description: 'Identificador de aeroporto padrão, geralmente ICAO, mas pode ser IATA ou LID se o aeroporto não tiver um código ICAO' 
                        example: KHOU 
                      code_icao: 
                        type: string 
                        nullable: true 
                        description: Identificador ICAO para o aeroporto, se conhecido 
                        example: KHOU 
                      code_iata: 
                        type: string 
                        nullable: true 
                        description: Identificador IATA para o aeroporto, se conhecido 
                        example: HOU 
                      code_lid: 
                        type: string 
                        nullable: true 
                        description: Identificador LID para o aeroporto, se conhecido 
                        example: HOU 
                      alternate_ident: 
                        deprecated: true 
                        type: string 
                        nullable: true 
                        description: 'Identificador IATA ou LID para o aeroporto. (Obsoleto, use code_iata para o identificador IATA ou code_lid para o identificador LID.)' 
                      name: 
                        type: string 
                        description: Nome comum para o aeroporto 
                        example: London Heathrow
                      tipo: 
                        tipo: string 
                        nulo: verdadeiro 
                        descrição: Tipo de aeroporto 
                        enum: 
                          - Aeroporto 
                          - Heliporto 
                          - Base de Hidroaviões 
                          - Ultraleve 
                          - Stolport 
                          - Gliderport 
                          - Porto de Balões 
                          - nulo 
                      elevação: 
                        tipo: número 
                        descrição: Altura acima do Nível Médio do Mar (MSL) 
                      cidade: 
                        tipo: string 
                        descrição: Cidade mais próxima do aeroporto 
                      estado: 
                        tipo: string 
                        descrição: | 
                          Estado/província onde o aeroporto está localizado, se aplicável. Para estados dos EUA, 
                          este será o código de 2 letras; para províncias ou outras entidades, será 
                          o nome completo. 
                      longitude: 
                        tipo: número 
                        descrição: longitude do 'aeroporto', geralmente o ponto central do aeroporto 
                      latitude: 
                        tipo: número 
                        descrição: latitude do 'aeroporto', geralmente o ponto central do aeroporto 
                      timezone: 
                        tipo: string 
                        descrição: 'Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ' 
                        exemplo: América/Chicago 
                      country_code: 
                        tipo: string 
                        descrição: código de 2 letras do país onde o aeroporto está localizado (ISO 3166-1 alfa-2) 
                      wiki_url: 
                        tipo: string 
                        nullable: true 
                        descrição: link para a página da Wikipédia do aeroporto 
                        formato: uri 
                      airport_flights_url: 
                        tipo: string 
                        formato: uri-reference 
                        descrição: a URL para voos para este aeroporto 
                    obrigatório: 
                      - airport_code
                      - alternate_ident 
                      - nome 
                      - elevação 
                      - cidade 
                      - estado 
                      - longitude 
                      - latitude 
                      - fuso horário 
                      - código_do_país 
                      - wiki_url 
                      - airport_flights_url 
                  - tipo: objeto 
                    propriedades: 
                      alternativas: 
                        tipo: matriz 
                        descrição: | 
                          Uma matriz de outras possíveis correspondências de aeroporto 
                        itens: 
                          tipo: objeto 
                          propriedades: 
                            airport_code: 
                              tipo: string 
                              descrição: 'Identificador de aeroporto padrão, geralmente ICAO, mas pode ser IATA ou LID se o aeroporto não tiver um código ICAO' 
                              exemplo: KHOU 
                            code_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador ICAO para o aeroporto, se conhecido 
                              exemplo: KHOU 
                            code_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador IATA para o aeroporto, se conhecido 
                              exemplo: HOU 
                            code_lid: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador LID para o aeroporto, se conhecido 
                              exemplo: HOU 
                            alternate_ident: 
                              obsoleto: verdadeiro 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: 'Identificador IATA ou LID para o aeroporto. (Obsoleto, use code_iata para o identificador IATA ou code_lid para o identificador LID.)' 
                            name: 
                              type: string 
                              description: Nome comum para o aeroporto 
                              exemplo: Londres Heathrow 
                            tipo:
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: Tipo de aeroporto 
                              enumeração: 
                                - Aeroporto 
                                - Heliporto 
                                - Base de Hidroaviões 
                                - Ultraleve 
                                - Porto de Stol 
                                - Porto de Planadores 
                                - Porto de Balões 
                                - nulo 
                            elevação: 
                              tipo: número 
                              descrição: Altura acima do Nível Médio do Mar (MSL) 
                            cidade: 
                              tipo: string 
                              descrição: Cidade mais próxima do aeroporto 
                            estado: 
                              tipo: string 
                              descrição: | 
                                Estado/província onde o aeroporto está localizado, se aplicável. Para estados dos EUA, 
                                este será o código de 2 letras; para províncias ou outras entidades, será 
                                o nome completo. 
                            longitude: 
                              tipo: número 
                              descrição: longitude do 'aeroporto', geralmente o ponto central do aeroporto 
                            latitude: 
                              tipo: número 
                              descrição: latitude do 'aeroporto', geralmente o ponto central do aeroporto 
                            timezone: 
                              tipo: string 
                              descrição: 'Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ' 
                              exemplo: América/Chicago 
                            country_code: 
                              tipo: string 
                              descrição: código de 2 letras do país onde o aeroporto está localizado (ISO 3166-1 alfa-2) 
                            wiki_url: 
                              tipo: string 
                              nullable: true 
                              descrição: link para a página da Wikipédia do aeroporto 
                              formato: uri 
                            airport_flights_url: 
                              tipo: string
                              format: uri-reference 
                              description: A URL para voos para este aeroporto 
                          necessária: 
                            - airport_code 
                            - alternate_ident 
                            - name 
                            - elevation 
                            - city 
                            - state 
                            - longitude 
                            - latitude 
                            - timezone 
                            - country_code 
                            - wiki_url 
                            - airport_flights_url 
        '400': 
          description: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/canonical': 
    obter: 
      operationId: obter_airports_canonical 
      Resumo: Obter o código canônico de um aeroporto 
      Descrição: | 
        Retorna uma lista de códigos de aeroportos ICAO correspondentes ao código IATA ou LID fornecido. 
        Os códigos IATA podem ser idênticos a alguns códigos LID; portanto, se id_type for especificado, apenas um código ICAO 
        será retornado. Se nenhum id_type for especificado e houver dois códigos ICAO possíveis, 
        ambos serão retornados. 
      Tags: 
        - aeroportos
      parâmetros: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: id_type 
          em: consulta 
          descrição: | 
            Tipo de código de aeroporto fornecido no parâmetro id 
          esquema: 
            tipo: string 
            enum: 
              - iata 
              - lid 
              - icao 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  aeroportos: 
                    tipo: array 
                    itens: 
                      título: CanonicalAirport 
                      tipo: objeto 
                      propriedades: 
                        id: 
                          tipo: string 
                          descrição: | 
                            Código canônico do aeroporto. Este é o código pelo qual um determinado aeroporto (e 
                            seus voos) podem ser acessados ​​no AeroAPI. 
                        id_type: 
                          tipo: string 
                          descrição: | 
                            Tipo de código de aeroporto fornecido na 
                          enumeração id: 
                            - icao 
                            - iata 
                            - lid 
                      obrigatório: 
                        - id 
                        - id_type 
                obrigatório: 
                  - aeroportos 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O id deve ser um código de aeroporto válido e o id_type deve ser 'icao', 'iata' ou 'lid'. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : 
                propriedades do objeto: 
                  título:
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/nearby': 
    obter: 
      operationId: obter_aeroportos_near_airport 
      resumo: Obter aeroportos próximos a um aeroporto 
      descrição: | 
        Retorna uma lista de aeroportos localizados a uma determinada distância do 
        aeroporto especificado. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: raio 
          em: consulta 
          descrição: | 
            O raio de busca a ser usado para encontrar aeroportos próximos (milhas-estátua) 
          obrigatório: verdadeiro 
          esquema: 
            tipo: inteiro 
        - nome: only_iap 
          em: consulta 
          descrição: | 
            Retorna apenas aeroportos próximos com Aproximações por Instrumentos (também limita 
            os resultados a aeroportos da América do Norte) 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - em: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro
            padrão: 1 
            mínimo: 1 
        - em: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  aeroportos: 
                    tipo: array 
                    itens: 
                      título: NearbyAirport 
                      allOf: 
                        - tipo: objeto 
                          propriedades: 
                            airport_code: 
                              tipo: string 
                              descrição: 'Identificador de aeroporto padrão, geralmente ICAO, mas pode ser IATA ou LID se o aeroporto não tiver um código ICAO' 
                              exemplo: KHOU 
                            code_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador ICAO para o aeroporto, se conhecido 
                              exemplo: KHOU 
                            code_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Identificador IATA para o aeroporto, se conhecido 
                              exemplo: HOU 
                            code_lid: 
                              tipo: string 
                              anulável: verdadeiro
                              descrição: Identificador LID para o aeroporto, se conhecido 
                              exemplo: HOU 
                            alternate_ident: 
                              deprecated: true 
                              tipo: string 
                              anulável: true 
                              descrição: 'Identificador IATA ou LID para o aeroporto. (Obsoleto, use code_iata para o identificador IATA ou code_lid para o identificador LID.)' 
                            nome: 
                              tipo: string 
                              descrição: Nome comum para o aeroporto 
                              exemplo: Londres Heathrow 
                            tipo: 
                              tipo: string 
                              anulável: true 
                              descrição: Tipo de aeroporto 
                              enum: 
                                - Aeroporto 
                                - Heliporto 
                                - Base de Hidroaviões 
                                - Ultraleve 
                                - Stolport 
                                - Gliderport 
                                - Balloonport 
                                - null 
                            elevação: 
                              tipo: número 
                              descrição: Altura acima do Nível Médio do Mar (MSL) 
                            cidade: 
                              tipo: string 
                              descrição: Cidade mais próxima do aeroporto 
                            estado: 
                              tipo: string 
                              descrição: | 
                                Estado/província onde o aeroporto reside, se aplicável. Para estados dos EUA, 
                                este será o código de 2 letras; para províncias ou outras entidades, será 
                                o nome completo. 
                            longitude: 
                              tipo: número 
                              descrição: longitude do 'aeroporto', geralmente o ponto central do aeroporto 
                            latitude: 
                              tipo: número 
                              descrição: latitude do 'aeroporto', geralmente o ponto central do aeroporto 
                            fuso horário: 
                              tipo: string
                              descrição: 'Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ' 
                              exemplo: América/Chicago 
                            country_code: 
                              tipo: string 
                              descrição: código de 2 letras do país onde o aeroporto está localizado (ISO 3166-1 alfa-2) 
                            wiki_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: link para a página da wikipedia do aeroporto 
                              formato: uri 
                            airport_flights_url: 
                              tipo: string 
                              formato: uri-reference 
                              descrição: a URL para voos para este aeroporto 
                          obrigatório: 
                            - airport_code 
                            - alternate_ident 
                            - nome 
                            - elevação 
                            - cidade - 
                            estado 
                            - longitude 
                            - latitude 
                            - fuso horário 
                            - country_code 
                            - wiki_url 
                            - airport_flights_url 
                        - tipo: objeto 
                          propriedades: 
                            distance: 
                              tipo: inteiro 
                              descrição: | 
                                Distância do aeroporto a partir do local especificado (milhas estatutárias) 
                            header: 
                              tipo: inteiro 
                              descrição: | 
                                Direção do local especificado até o aeroporto (graus) 
                              mínimo: 1 
                              máximo: 360 
                            direction: 
                              tipo: string 
                              descrição: | 
                                Direção cardinal do local especificado para o aeroporto 
                              enum: 
                                - 'N' 
                                - E 
                                - S 
                                - O
                                - NE 
                                - SE 
                                - SW 
                                - NW 
                          obrigatório: 
                            - distância 
                            - rumo 
                            - direção 
                obrigatório: 
                  - links 
                  - num_pages 
                  - aeroportos 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O ID deve ser um código de aeroporto válido e não pode estar vazio, raio > 0. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/delays': 
    obter: 
      operaçãoId: obter_atrasos_do_aeroporto 
      resumo: Obter informações sobre atrasos no aeroporto 
      descrição: | 
        Retorna uma lista de códigos de motivo para atrasos em um aeroporto específico. Podem 
        ser retornados vários motivos se houver vários tipos de atrasos 
        relatados em um aeroporto. Observe que voos individuais podem sofrer atrasos 
        sem que haja um atraso no aeroporto retornado por este ponto de extremidade. 
      tags: 
        - 
      parâmetros de aeroportos: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade.
          required: true 
          schema: 
            type: string 
          examples: 
            ICAO: 
              value: KIAH 
            IATA: 
              value: IAH 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Atraso no aeroporto 
                type: object 
                properties: 
                  airport: 
                    type: string 
                    description: Código ICAO/IATA do aeroporto 
                  category: 
                    type: string 
                    description: | 
                      Categoria do maior atraso. Alguns valores possíveis são "clima", "tráfego", 
                      "equipamento" etc. 
                  color: 
                    type: string 
                    description: Cor do maior atraso 
                    enum: 
                      - vermelho 
                      - amarelo 
                      - verde 
                  delay_secs: 
                    type: inteiro 
                    description: | 
                      Duração do maior atraso (segundos). Este valor não deve ser 
                      apresentado aos usuários e deve ser usado apenas para classificar os resultados. 
                  reasons: 
                    type: array 
                    description: Motivos do atraso 
                    items: 
                      type: object 
                      properties: 
                        category: 
                          type: string 
                          description: | 
                            Categoria do atraso. Alguns valores possíveis são "clima", "trânsito", 
                            "equipamento", etc. 
                        cor: 
                          tipo: string 
                          descrição: cor que indica a gravidade do atraso 
                          enum: 
                            - vermelho 
                            - amarelo 
                            - verde 
                        delay_secs: 
                          tipo: inteiro 
                          descrição: | 
                            Duração do atraso (segundos). Este valor não se destina a ser
                            apresentado aos usuários e deve ser usado somente para classificar resultados. 
                        reason: 
                          type: string 
                          description: Descrição textual da causa do atraso 
                      required: 
                        - category 
                        - color 
                        - delay_secs 
                        - reason 
                required: 
                  - airport 
                  - category 
                  - color 
                  - delay_secs 
                  - reasons 
        '400': 
          description: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Erro 
                type: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/flights': 
    get: 
      operationId: get_airport_flights 
      summary: Obter todos os voos para um determinado aeroporto 
      description: | 
        Retorna todos os voos recentes e futuros com partida ou chegada no 
        aeroporto especificado. O comportamento de filtragem/ordenação dos 
        parâmetros opcionais de início e término para cada tipo (`scheduled_departures`, 
        `scheduled_arrivals`, `departures`, `arrivals`) corresponde ao comportamento em 
        seus respectivos endpoints. 
      Tags: 
        - 
      parâmetros de aeroportos:
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: companhia aérea 
          em: 
          descrição da consulta: Companhia aérea para filtrar voos. Não forneça a companhia aérea se o tipo for fornecido. 
          esquema: 
            tipo: string 
            exemplo: UAL 
        - nome: digite 
          em: 
          descrição da consulta: Tipo de voos para retorno. Não forneça o tipo se a companhia aérea for fornecida. 
          esquema: 
            tipo: string 
            enum: 
              - General_Aviation 
              - Companhia aérea 
        - nome: início 
          em: 
          descrição da consulta: | 
            O intervalo de datas inicial para resultados de voos. O formato é ISO8601 data 
            ou data e hora, e o limite é inclusivo. A data inicial especificada 
            não deve ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            date em vez de datetime, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - name: end 
          in: query 
          description: | 
            O intervalo de datas final para resultados de voos. O formato é data ISO8601 
            ou datetime, e o limite é exclusivo. A data final especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            date em vez de datetime, o horário padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data/hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31'
          x-fill-example: 'no' 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: integer 
                    minimum: 1 
                  scheduled_arrivals: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo bruto. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true
                          description: | 
                            O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente de ident. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pela 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Bandeira indicando que este voo não possui um plano de voo, horário ou outra indicação de intenção disponível. 
                        origem: 
                          descrição: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          título: FlightAirportRef
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            aeroporto_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório:
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações sobre o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            airport_info_url:
                              tipo: string 
                              anulável: true 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Duração do campo pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: string 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido.
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: |
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado no portão. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de partida da pista programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: |
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada ao portão agendado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada ao portão.
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - bloqueado 
                        - desviado 
                        - cancelado 
                        - position_only 
                        - origem 
                        - destino 
                        - atraso_de_partida 
                        - atraso_de_chegada 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - rota 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination - 
                        terminal_origin - terminal_destination 
                        - 
                        tipo 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on - 
                        estimated_on - 
                        actual_on - 
                        scheduled_in - estimated_in 
                        - 
                        actual_in partidas 
                  programadas: 
                    tipo: array 
                    itens: 
                      título: BaseFlight 
                      tipo: 
                      propriedades do objeto: 
                        ident: 
                          tipo: string 
                          descrição: |
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number:
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Número do voo. 
                        registro: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Registro da aeronave (número da cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          tipo: array 
                          anulável: true 
                          descrição: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          itens: 
                            tipo: string 
                        codeshares_iata: 
                          tipo: array 
                          anulável: true 
                          descrição: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          itens: 
                            tipo: string 
                        bloqueado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        desviado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador indicando que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer
                            incluindo cancelamento pela companhia aérea, mas isso nem sempre será o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador indicando que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações para o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ICAO/IATA/LID ou string indicando o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            airport_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            code_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            code_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            code_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: true 
                              exemplo: Nova York 
                            airport_info_url: 
                              tipo: string 
                              nulo: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Duração do campo pista a pista (ver condições). 
                        progress_percent: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada na pista. Nulo 
                            para voos somente de posição em rota. 
                          Mínimo: 0
                          máximo: 100 
                        status: 
                          tipo: string 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Distância planejada do voo (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine do ônibus. 
                        seats_cabin_first: 
                          tipo: inteiro
                          nullable: true 
                          description: | 
                            Número de assentos na cabine de primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de chegada no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de chegada no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão.
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de partida da pista agendado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada da pista agendado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in:
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - bloqueado 
                        - desviado 
                        - cancelado 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on 
                        - estimated_on
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                  arrivals: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código da operadora seguido do número do voo 
                            (para voos comerciais) ou do registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora ICAO seguido do número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido do número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            código ICAO, se existir, do operador do voo, caso contrário, o código IATA
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de quaisquer codeshares ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de quaisquer codeshares IATA operando neste voo. 
                          itens: 
                            tipo: string 
                        bloqueado: 
                          tipo: booleano 
                          descrição: |
                            Sinalizador indicando se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador indicando se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador indicando que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos para isso acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador indicando que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            code_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true 
                            code_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            code_lid:
                              tipo: string 
                              descrição: | 
                                código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida real ou estimado do portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no horário de chegada real ou estimado do portão 
                            . Se o horário do portão não estiver disponível, o valor será baseado no 
                            horário de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete:
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Duração arquivada de pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: sequência de caracteres 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          tipo: sequência de caracteres 
                          nulo: verdadeiro 
                          descrição: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Distância planejada do voo (milhas estatutárias) com base na rota arquivada. Pode 
                            variar da distância real voada. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Velocidade do ar IFR arquivada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          tipo: sequência de caracteres 
                          nulo: verdadeiro 
                          descrição: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino.
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de chegada no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo comercial ou de aviação geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out:
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de chegada programado na pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de chegada na pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora
                          nullable: true 
                          description: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data e hora 
                          nullable: true 
                          description: | 
                            Hora programada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data e hora 
                          nullable: true 
                          description: | 
                            Hora estimada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data e hora 
                          nullable: true 
                          description: | 
                            Hora real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - 
                        actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on - scheduled_in 
                        - estimated_in 
                        - actual_in 
                  departures: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código da operadora seguido do número do voo 
                            (para voos comerciais) ou do registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora ICAO seguido do número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido do número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          nullable: true 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id:
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                        operador_icao: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Código ICAO da operadora do voo. 
                        operador_iata: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Número do voo. 
                        registro: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Registro da aeronave (número da cauda), quando conhecido. 
                        atc_ident: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente do ident. 
                        inbound_fa_flight_id: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items:
                            tipo: string 
                        codeshares_iata: 
                          tipo: array 
                          nullable: true 
                          descrição: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          itens: 
                            tipo: string 
                        blocked: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos para isso acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será o 
                            caso. 
                        position_only: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          descrição: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nullable: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            code_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true 
                            code_iata:
                              tipo: string 
                              descrição: | 
                                código IATA 
                              anulável: true 
                            code_lid: 
                              tipo: string 
                              descrição: | 
                                código LID 
                              anulável: true 
                            timezone: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        departure_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, com base na partida da pista
                            time. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de chegada (em segundos) com base no 
                            horário real ou estimado de chegada ao portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Duração do registro pista a pista (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância planejada do voo (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real voada. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Velocidade do ar IFR arquivada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: |
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          description: |
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida do portão programado. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário real de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida da pista programado. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: |
                            Horário de chegada programado para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                      obrigatório: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination
                        - atraso_de_partida 
                        - atraso_chegada 
                        - 
                        porcentagem_de_progresso 
                        - status 
                        - tipo_aeronave - 
                        distância_da_rota - velocidade_do_ar 
                        - altitude_arquivada 
                        - 
                        rota 
                        - retirada_de_bagagem 
                        - assentos_cabine_executiva 
                        - assentos_cabine_ônibus 
                        - assentos_cabine_primeira - origem_do_portão - 
                        destino_do_portão 
                        - origem_do_terminal 
                        - destino_do_terminal 
                        - tipo - 
                        saída_programada 
                        - saída_estimada 
                        - 
                        saída_real - desligamento_programado 
                        - desligamento_estimado 
                        - desligamento_real 
                        - ligado_programado - ligado_estimado - ligado_real 
                        - ligado_programado 
                        - entrada_estimada 
                        - 
                        entrada_estimada 
                        - 
                        entrada_real 
                obrigatório: 
                  - links 
                  - número_de_páginas 
                  - chegadas_programadas 
                  - partidas_programadas - 
                  chegadas 
                  - partidas 
        '400': 
          descrição: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. Os parâmetros de consulta de companhia aérea e tipo não podem ser definidos simultaneamente. 
          conteúdo: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/flights/arrivals': 
    get: 
      operationId: get_airport_flights_arrived 
      summary: Obter voos que chegaram recentemente a um aeroporto 
      description: | 
        Retorna voos que chegaram a um aeroporto, ordenados por 
        `actual_on` decrescente. O valor padrão do parâmetro start é 24 horas 
        antes do horário atual. O valor padrão do parâmetro end é o 
        horário atual. 
      tags: 
        - airports 
      parameters: 
        - name: id 
          in: path 
          description: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: sequência de caracteres 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: companhia aérea 
          em: 
          descrição da consulta: Companhia aérea para filtrar voos. Não forneça a companhia aérea se o tipo for fornecido. 
          esquema: 
            tipo: sequência de caracteres 
            exemplo: UAL 
        - nome: digite 
          em: 
          descrição da consulta: Tipo de voos para retorno. Não forneça o tipo se a companhia aérea for fornecida. 
          esquema: 
            tipo: sequência de 
            caracteres enum: 
              - Aviação_Geral 
              - Companhia Aérea 
        - nome: início 
          em: 
          descrição da consulta: | 
            O intervalo de datas inicial para resultados de voos. O formato é data 
            ou data/hora ISO8601, e o limite é inclusivo. A data de início especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data/hora, o horário padrão será 00:00:00Z. 
          esquema: 
            tipo: sequência de caracteres 
            oneOf:
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data-hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - nome: fim 
          em: consulta 
          descrição: | 
            O intervalo de datas final para resultados de voo. O formato é data 
            ou data-hora ISO8601, e o limite é exclusivo. A data final especificada 
            não deve ser superior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data-hora, o horário padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data-hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - em: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - em: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas
                    tipo: inteiro 
                    mínimo: 1 
                  chegadas: 
                    tipo: matriz 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            código ICAO, se existir, do operador do voo, caso contrário, o código IATA 
                        operador_icao: 
                          tipo: string
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de quaisquer codeshares ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de quaisquer codeshares IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Bandeira indicando se este voo está bloqueado para visualização pública. 
                        desviado:
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        posição_somente: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origem: 
                          descrição: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável ao aeroporto, no formato de banco de dados TZ
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            code_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true 
                            code_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            code_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        departure_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida real ou estimado do portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada real ou estimado do portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer 
                          nullable: true 
                          description: |
                            Duração do registro de pista a pista (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          tipo: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nullable: true
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de desembarque no aeroporto de destino. 
                        tipo: 
                          tipo: string 
                          descrição: | 
                            Se este é um voo comercial ou de aviação geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data e hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário de partida programado do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada à pista.
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada ao portão agendado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out - 
                        scheduled_off - 
                        estimated_off - 
                        actual_off - 
                        scheduled_on - 
                        estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - arrivals 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ID deve ser um código de aeroporto válido e não pode estar vazio. Os parâmetros de consulta de companhia aérea e tipo não podem ser definidos simultaneamente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/voos/partidas': 
    obter: 
      operationId: obter_voos_do_aeroporto_partidas_resumo 
      : Obter voos que partiram recentemente de um aeroporto 
      descrição: | 
        Retorna voos que partiram de um aeroporto e não foram 
        desviados, ordenados por `actual_off` em ordem decrescente. Os 
        parâmetros opcionais de início e fim serão comparados com `actual_off` para limitar o
        voos retornados. O valor padrão do parâmetro start é 24 horas 
        antes do horário atual. O valor padrão do parâmetro end é o 
        horário atual. 
      tags: 
        - airports 
      parameters: 
        - name: id 
          in: path 
          description: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          required: true 
          schema: 
            type: string 
          examples: 
            ICAO: 
              value: KIAH 
            IATA: 
              value: IAH 
        - name: airline 
          in: query 
          description: Companhia aérea para filtrar voos. Não informe a companhia aérea se o tipo for fornecido. 
          schema: 
            type: string 
            example: UAL 
        - name: type 
          in: query 
          description: Tipo de voos a serem retornados. Não informe o tipo se a companhia aérea for fornecida. 
          schema: 
            type: string 
            enum: 
              - General_Aviation 
              - Companhia aérea 
        - name: start 
          in: query 
          description: | 
            O intervalo de datas inicial para resultados de voos. O formato é ISO8601 date 
            ou datetime, e o limite é inclusivo. A data de início especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data e hora, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - name: end 
          in: query 
          description: | 
            O intervalo de datas final para resultados de voos. O formato é data 
            ou data e hora ISO8601, e o limite é exclusivo. A data de término especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data e hora, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf:
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data-hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'não' 
        - em: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - em: consulta 
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  partidas: 
                    tipo: array 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou pelo registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string
                          nullable: true 
                          description: | 
                            O código da operadora ICAO seguido do número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido do número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se existir, da operadora do voo; caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo do voo. 
                        registration: 
                          type: string 
                          nullable: true
                          description: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pela 
                            FlightAware. Há uma série de razões pelas quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: |
                            Bandeira indicando que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações para o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ICAO/IATA/LID ou string indicando o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url:
                              tipo: string 
                              anulável: true 
                              formato: referência-uri 
                              descrição: URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações sobre o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade:
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            airport_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Duração do campo pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: string 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type:
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine de primeira classe. 
                        gate_origin: 
                          tipo: string 
                          anulável: verdadeiro
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de desembarque no aeroporto de destino. 
                        tipo: 
                          tipo: string 
                          descrição: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário de partida programado no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: |
                            Horário de partida programado para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada programado para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora programada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada ao portão.
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - bloqueado 
                        - desviado 
                        - cancelado 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out - 
                        scheduled_off - 
                        estimated_off 
                        - actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                necessário: 
                  - links
                  - num_pages 
                  - departures 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ID deve ser um código de aeroporto válido e não pode estar vazio. Os parâmetros de consulta de companhia aérea e tipo não podem ser definidos simultaneamente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/flights/scheduled_departures': 
    get: 
      operationId: get_airport_flights_scheduled_departures 
      summary: Obter voos futuros partindo de um aeroporto 
      description: | 
        Retorna voos programados para partir de um aeroporto ou que foram 
        cancelados recentemente, ordenados por `estimated_off` (ou `scheduled_off` 
        se `estimated_off` estiver ausente) em ordem crescente. Os 
        parâmetros opcionais start e end serão comparados com `scheduled_off` para limitar os 
        voos retornados. O valor padrão do parâmetro start é 2 horas antes 
        do horário atual. O valor padrão do parâmetro end é 24 horas após 
        o horário atual. 
      tags: 
        - airports 
      parameters: 
        - name: id 
          in: path 
          description: | 
            ICAO, IATA ou LID ID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          required: true 
          schema: 
            type: string 
          examples: 
            ICAO:
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: companhia aérea 
          em: 
          descrição da consulta: Companhia aérea para filtrar voos. Não forneça a companhia aérea se o tipo for fornecido. 
          esquema: 
            tipo: sequência de caracteres 
            exemplo: UAL 
        - nome: digite 
          em: 
          descrição da consulta: Tipo de voos para retorno. Não forneça o tipo se a companhia aérea for fornecida. 
          esquema: 
            tipo: sequência de 
            caracteres enum: 
              - General_Aviation 
              - Companhia aérea 
        - nome: início 
          em: 
          descrição da consulta: | 
            O intervalo de datas inicial para resultados de voos. O formato é data ISO8601 
            ou data/hora, e o limite é inclusivo. A data de início especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data/hora, o horário padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data-hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-exemplo: 'não' 
        - nome: fim 
          em: consulta 
          descrição: | 
            O intervalo de datas final para resultados de voo. O formato é data ISO8601 
            ou data-hora, e o limite é exclusivo. A data final especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data-hora, o horário padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data-hora 
              - formato: data 
          exemplos: 
            data-hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
          x-fill-example: 'no' 
        - em: consulta 
          nome: max_pages 
          descrição: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          esquema: 
            tipo: inteiro 
            padrão: 1 
            mínimo: 1 
        - em: consulta
          nome: cursor 
          descrição: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          esquema: 
            tipo: string 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: true 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    necessário: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  scheduled_departures: 
                    tipo: matriz 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            O código do operador IATA seguido do número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                        operador_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código ICAO da operadora do voo. 
                        operador_iata: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código IATA da operadora do voo. 
                        número_do_voo: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Número do voo. 
                        registro: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            A identidade do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identidade. 
                        inbound_fa_flight_id: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: |
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: |
                                Código ou sequência de caracteres ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        destination: 
                          description: | 
                            Informações sobre o aeroporto de destino deste voo.
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            aeroporto_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição.
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário real ou estimado de partida do portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário real ou estimado de chegada do portão. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            Duração do campo pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: sequência de caracteres 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          tipo: sequência de caracteres 
                          nullable: verdadeiro 
                          descrição: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Maio
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR arquivada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: |
                            Terminal de partida no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de chegada no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo comercial ou de aviação geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado no portão. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário real de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado na pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: str ing 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                      obrigatório: 
                        - ident 
                        - fa_flight_id 
                        - operador
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach - 
                        seats_cabin_first 
                        - gate_origin - gate_destination - 
                        terminal_origin 
                        - 
                        terminal_destination 
                        - type 
                        - scheduled_out - 
                        estimated_out - 
                        actual_out - 
                        scheduled_off - estimated_off 
                        - actual_off 
                        - scheduled_on - estimated_on 
                        - actual_on - scheduled_in 
                        - 
                        estimated_in 
                        - 
                        actual_in 
                        obrigatório 
                : 
                  - links 
                  - num_pages 
                  - scheduled_departures 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O ID deve ser um código de aeroporto válido e não pode estar vazio. Os parâmetros de consulta de tipo e de companhia aérea não podem ser definidos simultaneamente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Error 
                type: object 
                properties: 
                  title: 
                    type: string
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/flights/scheduled_arrivals': 
    get: 
      operationId: get_airport_flights_scheduled_arrivals 
      summary: Obter voos futuros chegando a um aeroporto 
      description: | 
        Retorna voos que devem chegar a um aeroporto. Isso pode 
        incluir voos que não partiram e em rota. Os voos são ordenados por 
        `estimated_on` em ordem crescente. Os parâmetros start e end opcionais serão 
        comparados com `estimated_on` para limitar os voos retornados. O 
        valor padrão do parâmetro start é 48 horas antes do horário atual 
        (isso considera voos atrasados). O valor padrão do parâmetro end 
        é 24 horas após o horário atual. 
      tags: 
        - 
      parâmetros de aeroportos: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: companhia aérea 
          em: 
          descrição da consulta: Companhia aérea para filtrar voos. Não informe a companhia aérea se o tipo for fornecido. 
          esquema: 
            tipo: string 
            exemplo: UAL 
        - nome: digite 
          em: 
          descrição da consulta: Tipo de voos para retorno. Não informe o tipo se a companhia aérea for fornecida. 
          esquema: 
            tipo: string
            enum: 
              - General_Aviation 
              - Airline 
        - name: start 
          in: query 
          description: | 
            O intervalo de datas inicial para resultados de voos. O formato é data 
            ou data/hora ISO8601, e o limite é inclusivo. A data de início especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            date em vez de datetime, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - name: end 
          in: query 
          description: | 
            O intervalo de datas final para resultados de voos. O formato é data ou data/hora ISO8601 
            , e o limite é exclusivo. A data de término especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            date em vez de datetime, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                type: object 
                properties: 
                  links: 
                    type: object
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: inteiro 
                    minimum: 1 
                  scheduled_arrivals: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código da operadora seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Chegada real na pista de destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: |
                            Identificador exclusivo atribuído pela FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número da cauda), quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente do ident. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          tipo: array 
                          nullable: true 
                          descrição: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          itens: 
                            tipo: string
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos para isso acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              anulável: true 
                            code_iata: 
                              tipo: string
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            code_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            code_icao:
                              tipo: string 
                              descrição: | 
                                código ICAO 
                              anulável: true 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                código IATA 
                              anulável: true 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            aeroporto_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - aeroporto_info_url 
                        atraso_de_partida: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será com base no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado.
                        arrival_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada ao portão, real ou estimado. Se o horário do portão não estiver disponível, será com base no 
                            horário de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Duração do registro pista a pista (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância planejada do voo (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Velocidade do ar IFR arquivada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route:
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: type 
                          : string 
                          nullable: true 
                          description: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data-hora 
                          nullable: true 
                          descrição: | 
                            Horário de partida do portão programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          nullable: true 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          nullable: true 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          nullable: true 
                          descrição: | 
                            Horário de partida da pista programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          nullable: true 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on:
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora programada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - 
                        seats_cabin_first 
                        - gate_origin - gate_destination - 
                        terminal_origin - 
                        terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in - 
                        estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - scheduled_arrivals 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ID deve ser um código de aeroporto válido e não pode estar vazio. Os parâmetros de consulta de companhia aérea e tipo não podem ser definidos simultaneamente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/voos/para/{dest_id}': 
    obter: 
      operationId: obter_voos_entre_aeroportos 
      resumo: Obter voos com uma origem e destino específicos 
      descrição: | 
        Este ponto de extremidade é bastante semelhante ao operador `FindFlight` em 
        versões anteriores do AeroAPI. Os resultados podem incluir voos diretos e com uma escala 
        . Observe que, como os voos retornados podem incluir vários 
        trechos, o formato de resposta difere da maioria dos outros 
        pontos de extremidade de retorno de voo. Se os parâmetros de consulta opcionais start ou end não forem 
        fornecidos, start será definido como padrão para 1 dia no futuro, enquanto end será 
        definido como padrão para 7 dias no passado em relação ao horário em que a consulta for feita. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: dest_id 
          in: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: digite 
          in: consulta 
          descrição: Tipo de voos a serem retornados. 
          esquema: 
            tipo: string 
            enum: 
              - General_Aviation 
              - Airline 
        - nome: conexão 
          in: consulta 
          descrição: | 
            Se os voos devem ser filtrados com base em seu status de conexão. Se definir 
            parâmetros de data de início/término, a conexão deve ser definida como direta e, por padrão, será 
            direta se deixada em branco. Se início/término não forem especificados, sair
            este espaço em branco resultará em uma mistura de voos diretos e com uma escala sendo retornados, 
            com uma preferência para voos diretos. Voos com uma escala são identificados com uma 
            heurística personalizada, que pode estar incompleta. 
          schema: 
            type: string 
            enum: 
              - nonstop 
              - onestop 
        - name: start 
          in: query 
          description: | 
            O intervalo de datas inicial para resultados de voos. O formato é data 
            ou data e hora ISO8601, e o limite é inclusivo. A data de início especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data e hora, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - name: end 
          in: query 
          description: | 
            O intervalo de datas final para resultados de voos. O formato é data 
            ou data/hora ISO8601, e o limite é exclusivo. A data final especificada 
            não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
            data em vez de data/hora, o horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
          x-fill-example: 'no' 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200':
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: array 
                    itens: 
                      título: FullFlight 
                      tipo: objeto 
                      propriedades: 
                        segmentos: 
                          tipo: array 
                          itens: 
                            título: BaseFlight 
                            tipo: objeto 
                            propriedades: 
                              ident: 
                                tipo: string 
                                descrição: | 
                                  O código da operadora seguido pelo número do voo 
                                  (para voos comerciais) ou o registro da aeronave (para 
                                  aviação geral). 
                              ident_icao: 
                                tipo: string 
                                anulável: verdadeiro 
                                descrição: | 
                                  O código da operadora ICAO seguido pelo número do voo (para voos comerciais) 
                              ident_iata: 
                                tipo: string 
                                anulável: verdadeiro 
                                descrição: | 
                                  O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                              actual_runway_off:
                                tipo: string 
                                anulável: true 
                                descrição: | 
                                  Pista de partida real na origem, quando conhecida 
                              actual_runway_on: 
                                tipo: string 
                                anulável: true 
                                descrição: | 
                                  Pista de chegada real no destino, quando conhecida 
                              fa_flight_id: 
                                tipo: string 
                                descrição: | 
                                  Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                  o voo for desviado, o novo trecho do voo terá um 
                                  fa_flight_id duplicado. 
                              operador: 
                                tipo: string 
                                anulável: true 
                                descrição: | 
                                  Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                              operador_icao: 
                                tipo: string 
                                anulável: true 
                                descrição: | 
                                  Código ICAO da operadora do voo. 
                              operador_iata: 
                                tipo 
                                : string 
                                anulável: true 
                                descrição: | 
                                  Código IATA da operadora do voo. 
                              número_do_voo: tipo: string 
                                anulável: true 
                                descrição: | 
                                  Número do voo. 
                              registro: 
                                tipo: string 
                                anulável: true 
                                descrição: | 
                                  Registro da aeronave (número da cauda), quando conhecido. 
                              atc_ident: 
                                tipo: string 
                                anulável: true 
                                descrição: |
                                  O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente do ident. 
                              inbound_fa_flight_id: 
                                type: string 
                                nullable: true 
                                description: | 
                                  Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                                  aeronave que atende este voo. 
                              codeshares: 
                                type: array 
                                nullable: true 
                                description: | 
                                  Lista de todos os codeshares da ICAO operando neste voo. 
                                items: 
                                  type: string 
                              codeshares_iata: 
                                type: array 
                                nullable: true 
                                description: | 
                                  Lista de todos os codeshares da IATA operando neste voo. 
                                items: 
                                  type: string 
                              blocked: 
                                type: boolean 
                                description: | 
                                  Sinalizador que indica se este voo está bloqueado para visualização pública. 
                              diverted: 
                                type: boolean 
                                description: | 
                                  Sinalizador que indica se este voo foi desviado. 
                              cancelled: 
                                type: boolean 
                                description: | 
                                  Sinalizador que indica que o voo não está mais sendo rastreado pela 
                                  FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                                  incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                                  caso. 
                              position_only: 
                                type: boolean 
                                description: | 
                                  Bandeira indicando que este voo não possui um plano de voo, horário ou outra indicação de intenção disponível. 
                              origem:
                                descrição: | 
                                  Informações sobre o aeroporto de origem deste voo. 
                                título: FlightAirportRef 
                                tipo: objeto 
                                anulável: true 
                                propriedades: 
                                  código: 
                                    tipo: string 
                                    descrição: | 
                                      Código ICAO/IATA/LID ou string que indica o local onde 
                                      o rastreamento do voo começou/terminou para voos somente de posição. 
                                    anulável: true 
                                  código_icao: 
                                    tipo: string 
                                    descrição: | 
                                      Código ICAO 
                                    anulável: true 
                                  código_iata: 
                                    tipo: string 
                                    descrição: | 
                                      Código IATA 
                                    anulável: true 
                                  código_lid: 
                                    tipo: string 
                                    descrição: | 
                                      Código LID 
                                    anulável: true 
                                  fuso horário: 
                                    tipo: string 
                                    descrição: | 
                                      Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                    anulável: true 
                                    exemplo: América/Nova_Iorque 
                                  nome: 
                                    tipo: string 
                                    descrição: | 
                                      Nome comum do aeroporto 
                                    anulável: true 
                                    exemplo: LaGuardia 
                                  cidade: 
                                    tipo: string 
                                    descrição: | 
                                      Cidade mais próxima do aeroporto 
                                    anulável: true 
                                    exemplo: Nova York
                                  airport_info_url: 
                                    type: string 
                                    nullable: true 
                                    format: uri-reference 
                                    description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                                required: 
                                  - code 
                                  - airport_info_url 
                              destination: 
                                description: | 
                                  Informações para o aeroporto de destino deste voo. 
                                title: FlightAirportRef 
                                type: object 
                                nullable: true 
                                properties: 
                                  code: 
                                    type: string 
                                    description: | 
                                      Código ICAO/IATA/LID ou string que indica o local onde 
                                      o rastreamento do voo começou/terminou para voos somente de posição. 
                                    nullable: true 
                                  code_icao: 
                                    type: string 
                                    description: | 
                                      Código ICAO 
                                    nullable: true 
                                  code_iata: 
                                    type: string 
                                    description: | 
                                      Código IATA 
                                    nullable: true 
                                  code_lid: 
                                    type: string 
                                    description: | 
                                      Código LID 
                                    nullable: true 
                                  timezone: 
                                    type: string 
                                    description: | 
                                      Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                    nullable: true 
                                    example: America/New_York 
                                  name: 
                                    type: string
                                    descrição: | 
                                      Nome comum do aeroporto 
                                    nulo: true 
                                    exemplo: LaGuardia 
                                  cidade: 
                                    tipo: string 
                                    descrição: | 
                                      Cidade mais próxima do aeroporto 
                                    nulo: true 
                                    exemplo: Nova York 
                                  airport_info_url: 
                                    tipo: string 
                                    nulo: true 
                                    formato: uri-reference 
                                    descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                                obrigatório: 
                                  - código 
                                  - airport_info_url 
                              departure_delay: 
                                tipo: inteiro 
                                nulo: true 
                                descrição: | 
                                  Atraso de partida (em segundos) com base no 
                                  horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                  horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                              arrival_delay: 
                                tipo: inteiro 
                                nulo: true 
                                descrição: | 
                                  Atraso de chegada (em segundos) com base no 
                                  horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                  horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                              filed_ete: 
                                tipo: inteiro 
                                nulo: true 
                                descrição: | 
                                  Duração do campo pista a pista (segundos). 
                              progress_percent: 
                                tipo: inteiro 
                                nulo: true 
                                descrição: |
                                  A porcentagem de conclusão de um voo, com base na partida/chegada na pista. Nulo 
                                  para voos somente de posição em rota. 
                                mínimo: 0 
                                máximo: 100 
                              status: 
                                tipo: string 
                                descrição: | 
                                  Resumo legível do status do voo. 
                              aircraft_type: 
                                tipo: string 
                                nulo: verdadeiro 
                                descrição: | 
                                  O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                  quando o código ICAO não for conhecido. 
                              route_distance: 
                                tipo: inteiro 
                                nulo: verdadeiro 
                                descrição: | 
                                  Distância planejada do voo (milhas estatutárias) com base na rota registrada. Pode 
                                  variar da distância real percorrida. 
                              filed_airspeed: 
                                tipo: inteiro 
                                nulo: verdadeiro 
                                descrição: | 
                                  Velocidade do ar IFR registrada (nós). 
                              filed_altitude: 
                                tipo: inteiro 
                                nulo: verdadeiro 
                                descrição: | 
                                  Altitude IFR registrada (centenas de pés). 
                              route: 
                                tipo: string 
                                nulo: verdadeiro 
                                descrição: | 
                                  A descrição textual da rota do voo. 
                              baggage_claim: 
                                tipo: string 
                                nulo: verdadeiro 
                                descrição: | 
                                  Local de retirada de bagagem no aeroporto de destino. 
                              seats_cabin_business: 
                                tipo: inteiro 
                                anulável: verdadeiro 
                                descrição: |
                                  Número de assentos na cabine da classe executiva. 
                              seats_cabin_coach: 
                                type: integer 
                                nullable: true 
                                description: | 
                                  Número de assentos na cabine da classe econômica. 
                              seats_cabin_first: 
                                type: integer 
                                nullable: true 
                                description: | 
                                  Número de assentos na cabine da primeira classe. 
                              gate_origin: 
                                type: string 
                                nullable: true 
                                description: | 
                                  Portão de embarque no aeroporto de origem. 
                              gate_destination: 
                                type: string 
                                nullable: true 
                                description: | 
                                  Portão de desembarque no aeroporto de destino. 
                              terminal_origin: 
                                type: string 
                                nullable: true 
                                description: | 
                                  Terminal de embarque no aeroporto de origem. 
                              terminal_destination: 
                                type: string 
                                nullable: true 
                                description: | 
                                  Terminal de desembarque no aeroporto de destino. 
                              type: 
                                type: string 
                                description: | 
                                  Se este é um voo comercial ou de aviação geral. 
                                enum: 
                                  - General_Aviation 
                                  - Airline 
                              scheduled_out: 
                                type: string 
                                format: date-time 
                                nullable: true 
                                description: | 
                                  Horário de partida programado do portão. 
                                example: '2021-12-31T19:59:59Z'
                              estimated_out: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário estimado de partida do portão. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              actual_out: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário real de partida do portão. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              scheduled_off: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário programado de partida da pista. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              estimated_off: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário estimado de partida da pista. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              actual_off: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário real de partida da pista. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              scheduled_on: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true 
                                descrição: | 
                                  Horário de chegada à pista agendado. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              estimated_on: 
                                tipo: string 
                                formato: data-hora 
                                anulável: true
                                descrição: | 
                                  Horário estimado de chegada à pista. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              actual_on: 
                                tipo: string 
                                formato: data-hora 
                                anulável: verdadeiro 
                                descrição: | 
                                  Horário real de chegada à pista. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              scheduled_in: 
                                tipo: string 
                                formato: data-hora 
                                anulável: verdadeiro 
                                descrição: | 
                                  Horário programado de chegada ao portão. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              estimated_in: 
                                tipo: string 
                                formato: data-hora 
                                anulável: verdadeiro 
                                descrição: | 
                                  Horário estimado de chegada ao portão. 
                                exemplo: '2021-12-31T19:59:59Z' 
                              actual_in: 
                                tipo: string 
                                formato: data-hora 
                                anulável: verdadeiro 
                                descrição: | 
                                  Horário real de chegada ao portão. 
                                Exemplo: '2021-12-31T19:59:59Z' 
                            obrigatório: 
                              - ident 
                              - fa_flight_id 
                              - operador 
                              - operator_iata 
                              - flight_number 
                              - registration 
                              - atc_ident 
                              - inbound_fa_flight_id 
                              - codeshares 
                              - blocked 
                              - diverted 
                              - cancelled 
                              - position_only 
                              - origin 
                              - destination 
                              - departure_delay
                              - arrival_delay 
                              - filed_ete 
                              - progress_percent 
                              - status 
                              - aircraft_type 
                              - route_distance 
                              - filed_airspeed 
                              - filed_altitude 
                              - route 
                              - baggage_claim 
                              - seats_cabin_business 
                              - seats_cabin_coach - 
                              seats_cabin_first 
                              - gate_origin 
                              - gate_destination 
                              - terminal_origin 
                              - terminal_destination 
                              - type 
                              - scheduled_out 
                              - estimated_out 
                              - actual_out 
                              - scheduled_off 
                              - estimated_off 
                              - actual_off 
                              - scheduled_on - 
                              estimated_on 
                              - actual_on 
                              - scheduled_in 
                              - estimated_in 
                              - actual_in 
                      required: 
                        - segments 
                required: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). Id e dest_id devem ser códigos de aeroporto válidos e não podem estar vazios. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/flights/counts': 
    get: 
      operationId: get_airport_flights_count 
      summary: Obter contagens de voos para um aeroporto 
      description: | 
        Retorna contagens de voos para um aeroporto divididas por status de voo. 
        As categorias retornadas são sutilmente diferentes do que é retornado dos 
        endpoints `/airports/{id}/flights`. Especificamente, esta operação 
        não inclui voos concluídos em suas contagens e não conta 
        voos cancelados/desviados. Ela também não limita estritamente o tempo 
        para o qual os voos programados são contados, portanto, todos os voos futuros que 
        o FlightAware conhece são incluídos nas contagens. Consulte o 
        esquema de resposta e a documentação para os endpoints de voos do aeroporto para obter mais 
        informações. 
      tags: 
        - airports 
      parameters: 
        - name: id 
          in: path 
          description: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: AirportFlightCounts 
                tipo: objeto 
                descrição: Nenhuma das contagens inclui cancelamentos. 
                propriedades: 
                  partiu: 
                    tipo: inteiro 
                    mínimo: 0 
                    descrição: | 
                      Número de voos que partiram do aeroporto e estão 
                      no ar no momento.
                  enroute: 
                    type: integer 
                    minimum: 0 
                    description: | 
                      Número de voos que estão atualmente com destino ao aeroporto. 
                  scheduled_arrivals: 
                    type: integer 
                    minimum: 0 
                    description: | 
                      Número de voos que ainda não partiram, mas estão programados para chegar 
                      ao aeroporto. 
                  scheduled_departures: 
                    type: integer 
                    minimum: 0 
                    description: | 
                      Número de voos que estão programados para partir do aeroporto. 
                required: 
                  - departed 
                  - enroute 
                  - scheduled_arrivals 
                  - scheduled_departures 
        '400': 
          description: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : objeto 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/weather/observations': 
    obter: 
      operationId: get_airport_weather_observations 
      resumo: Obter condições meteorológicas para o aeroporto fornecido 
      descrição: | 
        Retorna o clima para um aeroporto na forma de um METAR decodificado, começando
        do último relatório e trabalhando de trás para frente no tempo conforme mais dados são 
        solicitados. Os dados são fornecidos em 
        formatos analisados, legíveis por humanos e brutos. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          in: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: temperature_units 
          in: 
          descrição da consulta: Unidades a serem usadas para campos de temperatura. 
          esquema: 
            tipo: string 
            padrão: Celsius 
            enum: 
              - C 
              - F 
              - Celsius 
              - Fahrenheit 
        - nome: return_nearby_weather 
          in: 
          descrição da consulta: | 
            Se o aeroporto solicitado não tiver um relatório de condições meteorológicas, 
            será retornado o clima do aeroporto mais próximo em um raio de 30 milhas 
            . 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - nome: timestamp 
          in: 
          descrição da consulta: | 
            Carimbo de data/hora a partir do qual começar a retornar dados meteorológicos em um intervalo de 1 dia. 
            Como os dados meteorológicos são retornados em ordem cronológica reversa, todos 
            os relatórios meteorológicos retornados serão anteriores a esse carimbo de data/hora. Se não for especificado, 
            o tempo será retornado a partir de agora até ou antes do limite do histórico do usuário, 
            normalmente 14 dias. 
          schema: 
            type: string 
            format: date-time 
            example: '2021-12-31T19:59:59Z' 
          x-fill-example: 'no' 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: |
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                type: object 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: integer 
                    minimum: 1 
                  observations: 
                    type: array 
                    items: 
                      title: WeatherObservation 
                      type: object 
                      properties: 
                        airport_code: 
                          type: string 
                          description: | 
                            O código do aeroporto do relatório. LID/IATA será usado se o aeroporto não tiver um 
                            código ICAO. 
                        cloud_friendly: 
                          type: string 
                          nullable: true 
                          description: | 
                            Resumo de nuvens amigável para humanos. 
                          exemplo: Céu nublado 
                        nuvens: 
                          tipo: array 
                          itens: 
                            tipo: objeto 
                            propriedades: 
                              altitude: 
                                tipo: inteiro 
                                anulável: verdadeiro 
                                descrição: Altura em pés (AGL) da base da nuvem 
                              símbolo: 
                                tipo: string
                                descrição: Símbolo de nuvem bruta do relatório METAR 
                              tipo: 
                                tipo: string 
                                descrição: 'Tipo de nuvem. Pode ser CLR, FEW, SCT, BKN, OVC, VV' 
                          description: Matriz de 
                        condições de dados de nuvens: 
                          type: string 
                          nullable: true 
                          description: Exemplo de clima notável 
                          : BR 
                        pressure: 
                          type: number 
                          nullable: true 
                          description: Pressão do ar (consulte o campo pressure_units para unidades) 
                        pressure_units: 
                          type: string 
                          nullable: true 
                          description: Unidades para pressão do ar 
                          enum: 
                            - null 
                            - mb 
                            - em Hg 
                        raw_data: 
                          type: string 
                          description: String de relatório METAR bruto 
                        temp_air: 
                          type: integer 
                          nullable: true 
                          description: Temperatura do ar 
                        temp_dewpoint: 
                          type: integer 
                          nullable: true 
                          description: Temperatura do ponto de orvalho 
                        temp_perceived: 
                          type: integer 
                          nullable: true 
                          description: Temperatura percebida (por exemplo, sensação térmica) 
                        relative_humidity: 
                          type: integer 
                          nullable: true 
                          description: Umidade relativa (porcentagem) 
                          minimum: 0 
                          maximum: 100 
                        time: 
                          type: string 
                          format: date-time description: Carimbo de data e hora 
                          em que o relatório foi coletado 
                          example: 
                        Visibilidade '2021-12-31T19:59:59Z' : 
                          tipo: número
                          anulável: verdadeiro 
                          descrição: Distância de visibilidade horizontal (consulte visibility_units para unidades) 
                        visibility_units: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: Unidades para visibilidade 
                          enum: 
                            - nulo 
                            - metros 
                            - SM 
                        wind_direction: 
                          tipo: inteiro 
                          descrição: Direção do vento (graus) 
                          mínimo: 0 
                          máximo: 360 
                        wind_friendly: 
                          tipo: string 
                          descrição: Amigável para humanos resumo dos ventos 
                          exemplo: Muito ventoso 
                        wind_speed: 
                          tipo: inteiro 
                          descrição: Velocidade do vento 
                          mínimo: 0 
                        wind_speed_gust: 
                          tipo: inteiro 
                          descrição: Velocidade da rajada de vento 
                          mínimo: 0 
                        wind_units: 
                          tipo: string 
                          descrição: Unidades para velocidade e rajadas de vento 
                          enum: 
                            - MPS 
                            - KT 
                      necessário: 
                        - código_do_aeroporto 
                        - amigável_à_nuvem 
                        - nuvens 
                        - condições 
                        - pressão 
                        - unidades_de_pressão 
                        - dados_brutos - 
                        temperatura_do_ar 
                        - ponto_de_orvalho_da_temp 
                        - temperatura_percebida 
                        - umidade_relativa - 
                        tempo 
                        - visibilidade 
                        - unidades_de_visibilidade - direção_do_vento 
                        - amigável_ao_vento 
                        - velocidade_do_vento 
                        - 
                        velocidade_do_vento_rajada 
                        - unidades_de_vento 
                obrigatório:
                  - links 
                  - num_pages 
                  - observations 
        '400': 
          description: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. Temperature_units pode ser inválido. O registro de data e hora pode ser anterior ao limite do histórico do usuário. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/airports/{id}/weather/forecast': 
    get: 
      operationId: get_airport_weather_forecast 
      summary: Obter previsão do tempo para o aeroporto fornecido 
      description: | 
        Retorna a previsão do tempo para um aeroporto na forma de uma TAF 
        (Previsão de Área Terminal) decodificada. Apenas um único resultado é retornado. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          in: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: carimbo de data/hora 
          in: consulta 
          descrição: | 
            Carimbo de data/hora a partir do qual iniciar o retorno dos dados meteorológicos em um intervalo de 1 dia.
            Como os dados meteorológicos são retornados em ordem cronológica inversa, todos 
            os relatórios meteorológicos retornados serão anteriores a esse registro de data e hora. Se não for especificado, 
            o clima será retornado a partir de agora até ou antes do limite do histórico do usuário, 
            normalmente 14 dias. 
          schema: 
            type: string 
            format: date-time 
            example: '2021-12-31T19:59:59Z' 
          x-fill-example: 'no' 
        - name: return_nearby_weather 
          in: query 
          description: | 
            Se o aeroporto solicitado não tiver um relatório de condições meteorológicas, 
            o clima do aeroporto mais próximo em um raio de 30 milhas será retornado 
            . 
          schema: 
            type: boolean 
            default: false 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: WeatherForecast 
                type: object 
                properties: 
                  airport_code: 
                    type: string 
                    description: | 
                      O código do aeroporto do relatório. LID/IATA será usado se o aeroporto não tiver um 
                      código ICAO. 
                  raw_forecast: 
                    tipo: matriz 
                    descrição: matriz de linhas de previsão bruta do TAF 
                    itens: 
                      tipo: sequência de caracteres 
                  tempo: 
                    tipo: sequência de caracteres 
                    formato: data e hora 
                    descrição: data e hora em que a previsão foi gerada. 
                    exemplo: '2021-12-31T19:59:59Z' 
                  decoded_forecast: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    propriedades: 
                      início: 
                        tipo: sequência de caracteres 
                        formato: data e hora 
                        exemplo: '2021-12-31T19:59:59Z' 
                      fim: 
                        tipo: sequência de caracteres 
                        formato: data e hora 
                        exemplo: '2021-12-31T19:59:59Z' 
                      linhas: 
                        tipo: matriz 
                        itens:
                          tipo: 
                          propriedades do objeto: 
                            tipo: 
                              tipo: string 
                              descrição: | 
                                Tipo de linha de previsão (previsão, de, temporária, tornando-se) 
                            início: 
                              tipo: string 
                              formato: data-hora 
                              descrição: Início do período efetivo para esta linha de previsão 
                              exemplo: '2021-12-31T19:59:59Z' 
                            fim: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: Fim do período efetivo para esta linha de previsão 
                              exemplo: '2021-12-31T19:59:59Z' 
                            turbulence_layers: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Previsão de turbulência 
                            icing_layers: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Previsão de gelo 
                            barometric_pressure: 
                              tipo: número 
                              anulável: verdadeiro 
                              descrição: Pressão prevista (porcentagem) 
                              mínimo: 0 
                              máximo: 100 
                            significant_weather: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: Previsão de tempo significativa 
                            winds: 
                              tipo: objeto 
                              anulável: verdadeiro 
                              propriedades: 
                                símbolo: 
                                  tipo: string 
                                  descrição: Símbolo de vento TAF bruto 
                                direction: 
                                  tipo: string 
                                  descrição: Direção do vento (0-360 ou "variável") 
                                velocidade: 
                                  tipo: inteiro
                                  descrição: 
                                Unidades de velocidade do vento: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  descrição: Unidades de vento 
                                peak_rajadas: 
                                  tipo: inteiro 
                                  anulável: verdadeiro 
                                  descrição: Rajadas de pico para previsão 
                              necessárias: 
                                - símbolo 
                                - direção 
                                - velocidade 
                                - unidades 
                                - peak_rajadas 
                            windshear: 
                              tipo: objeto 
                              anulável: verdadeiro 
                              propriedades: 
                                símbolo: 
                                  tipo: string 
                                  descrição: Símbolo de cisalhamento do vento TAF bruto 
                                altura: 
                                  tipo: string 
                                  descrição: Altitude da ocorrência de cisalhamento do vento de baixo nível 
                                direção: 
                                  tipo: string 
                                  descrição: Direção do vento do cisalhamento do vento (0-360 ou "variável") 
                                velocidade: 
                                  tipo: string 
                                  descrição: Velocidade do vento do cisalhamento do vento 
                                unidades: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  descrição: Unidades de vento do cisalhamento do vento 
                              necessárias: 
                                - símbolo 
                                - altura 
                                - direção 
                                - velocidade 
                                - unidades 
                            visibilidade: 
                              tipo: objeto 
                              anulável: verdadeiro 
                              propriedades: 
                                símbolo: 
                                  tipo: string 
                                  descrição: Símbolo de visibilidade TAF bruto
                                visibility: 
                                  type: string 
                                  description: Visibilidade numérica (ou "ilimitada") 
                                units: 
                                  type: string 
                                  nullable: true 
                                  description: Unidades de visibilidade 
                              necessárias: 
                                - símbolo 
                                - visibility 
                                - unidades 
                            clouds: 
                              type: array 
                              items: 
                                type: object 
                                properties: 
                                  symbol: 
                                    type: string 
                                    description: Símbolo de nuvem TAF bruto 
                                  coverage: 
                                    type: string 
                                    nullable: true 
                                    description: | 
                                      Área do céu coberta pela camada de nuvens (poucas 0-2 octas, dispersas 
                                      3-4 octas, quebradas 5-7 octas, nublado 8 octas) 
                                    enum: 
                                      - null 
                                      - sky_clear 
                                      - poucas 
                                      - dispersas 
                                      - quebradas 
                                      - nublado 
                                  altitude: 
                                    type: string 
                                    nullable: true 
                                    description: Altura (AGL) da base da camada de nuvens 
                                  special: 
                                    type: string 
                                    nullable: true 
                                    description: | 
                                      Quaisquer modificadores especiais, como CB (cumulonimbus) ou TCU 
                                      (towering cumulonimbus), 
                                necessários: 
                                  - símbolo 
                                  - coverage 
                                  - altitude
                                  - especial 
                          necessário: 
                            - tipo 
                            - início 
                            - fim 
                            - camadas_de_turbulência 
                            - camadas_de_gelo 
                            - pressão_barométrica 
                            - clima_significativo 
                            - ventos 
                            - cisalhamento do vento 
                            - visibilidade 
                            - nuvens 
                    necessário: 
                      - início 
                      - fim 
                      - linhas 
                necessário: 
                  - código_aeroporto 
                  - previsão_bruta 
                  - hora 
                  - previsão_decodificada 
        '400': 
          descrição: | 
            Parâmetro incorreto (id). O Id deve ser um código de aeroporto válido e não pode estar vazio. Unidades_de_temperatura podem ser inválidas. O carimbo de data/hora pode ser anterior ao limite do histórico do usuário. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: 
                Tipo de erro: objeto 
                propriedades: 
                  título: 
                    tipo: sequência de caracteres 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: sequência de caracteres 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: sequência de caracteres 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
        '404': 
          descrição: | 
            Nenhuma previsão futura disponível atualmente para este aeroporto. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Erro
                tipo: objeto 
                propriedades: 
                  título: 
                    tipo: sequência de caracteres 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: sequência de caracteres 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: sequência de caracteres 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/airports/{id}/routes/{dest_id}': 
    obter: 
      operationId: obter_rotas_entre_aeroportos 
      resumo: Obter rotas entre 2 aeroportos 
      descrição: | 
        Retorna informações sobre roteamentos IFR atribuídos entre dois aeroportos. 
      tags: 
        - aeroportos 
      parâmetros: 
        - nome: id 
          em: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: dest_id 
          in: caminho 
          descrição: | 
            ID ICAO, IATA ou LID do aeroporto de destino a ser buscado. [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            ICAO: 
              valor: KIAH 
            IATA: 
              valor: IAH 
        - nome: sort_by 
          in: consulta 
          descrição: | 
            Campo para classificar os resultados. "count" classificará os resultados pela 
            contagem de registros de rota (em ordem decrescente). "last_departure_time" classificará os resultados por
            o último horário de partida programado para essa rota (em ordem decrescente). 
          schema: 
            type: string 
            default: count 
            enum: 
              - count 
              - last_departure_time 
        - name: max_file_age 
          in: query 
          description: | 
            Idade máxima arquivada dos voos a serem considerados. Pode ser um valor menor 
            ou igual a 14 dias (2 semanas) OU 1 mês OU 1 ano. 
          schema: 
            type: string 
            default: 2 weeks 
          examples: 
            days: 
              value: 6 days 
            month: 
              value: 1 month 
            year: 
              value: 1 year 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                type: object 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: inteiro 
                    minimum: 1 
                  routes: 
                    type: array 
                    items: 
                      title: RouteInfo
                      tipo: objeto 
                      propriedades: 
                        aircraft_types: 
                          tipo: matriz 
                          descrição: Lista de tipos de aeronaves que registraram esta rota 
                          itens: 
                            tipo: sequência de caracteres 
                        contagem: 
                          tipo: inteiro 
                          mínimo: 0 
                          descrição: O número de voos com esta rota registrada 
                        filed_altitude_max: 
                          tipo: inteiro 
                          descrição: A altitude mais alta registrada para a rota (centenas de pés) 
                        filed_altitude_min: 
                          tipo: inteiro 
                          descrição: A altitude mais baixa registrada para a rota (centenas de pés) 
                        last_departure_time: 
                          tipo: sequência de caracteres 
                          formato: data e hora 
                          descrição: O horário de partida mais recente para um voo operando nesta rota 
                          exemplo: '2021-12-31T19:59:59Z' 
                        route: 
                          tipo: sequência de caracteres 
                          descrição: A rota IFR atribuída 
                        route_distance: 
                          tipo: sequência de caracteres 
                          descrição: A distância conforme registrada para a rota. Pode variar da distância real voada. Inclui unidades em sequência de caracteres. 
                      obrigatório: 
                        - aircraft_types 
                        - count 
                        - filed_altitude_max 
                        - filed_altitude_min 
                        - last_departure_time 
                        - route 
                        - route_distance 
                obrigatório: 
                  - links 
                  - num_pages 
                  - routes 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). Id e dest_id devem ser códigos de aeroporto válidos e não podem estar vazios. Max_file_age deve ser um dos valores especificados. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : 
                propriedades do objeto: 
                  título:
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  /operadores: 
    parâmetros: 
      - in: 
        nome da consulta: max_pages 
        descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro 
          padrão: 1 
          mínimo: 1 
      - in: 
        nome da consulta: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    obter: 
      operationId: obter_todos_operadores 
      resumo: Obter todos os operadores. 
      descrição: | 
        Retorna uma lista de referências de operadores (códigos ICAO/IATA e URLs para acessar 
        mais informações). 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: Lista de operadores. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next
                  num_pages: 
                    description: Número de páginas retornadas 
                    type: inteiro 
                    minimum: 1 
                  operators: 
                    type: array 
                    items: 
                      title: OperatorRef 
                      type: objeto 
                      properties: 
                        code: 
                          type: string 
                          description: 'Identificador ICAO se conhecido, caso contrário IATA.' 
                        operator_info_url: 
                          type: string 
                          format: uri-reference 
                          description: A URL da AeroAPI para obter mais informações sobre o operador 
                      required: 
                        - code 
                        - operator_info_url 
                required: 
                  - links 
                  - num_pages 
                  - operadores 
  '/operators/{id}': 
    parameters: 
      - name: id 
        in: path 
        required: true 
        description: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o código ICAO lexicograficamente primeiro será retornado. 
        schema: 
          type: string 
          example: UAL 
    get: 
      operationId: get_operator 
      summary: Obter informações estáticas para um operador. 
      description: | 
        Retorna informações de um operador, como nome, 
        códigos ICAO/IATA, localização da sede, etc. 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                allOf: 
                  - tipo: objeto 
                    propriedades: 
                      icao: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: O código ICAO do operador. 
                      iata: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: O código IATA do operador.
                      indicativo: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: | 
                          Nome de telefonia ICAO (indicativo) da operadora usado com 
                          o controle de tráfego aéreo. 
                      nome: 
                        tipo: string 
                        descrição: Nome da operadora. Normalmente, o nome comercial legal. 
                      país: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: País onde a operadora está sediada. 
                      localização: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: | 
                          Potencialmente, um local mais específico onde a operadora está sediada. Pode 
                          especificar cidade, estado, província, etc. 
                      telefone: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: Número de telefone público da operadora. 
                      nome abreviado: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: | 
                          Versão mais curta do nome da operadora. Normalmente, o 
                          nome "fazendo negócios como", quando diferente de "nome". 
                      url: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: URL do site da operadora. 
                      wiki_url: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: URL da página da operadora na Wikipédia. 
                    obrigatório: 
                      - icao 
                      - iata 
                      - indicativo 
                      - nome 
                      - país 
                      - localização 
                      - telefone 
                      - nome curto 
                      - url 
                      - wiki_url 
                  - tipo: objeto 
                    propriedades: 
                      alternativas: 
                        tipo: matriz 
                        descrição: |
                          Uma matriz de outras possíveis correspondências de operadores 
                        items: 
                          type: object 
                          properties: 
                            icao: 
                              type: string 
                              nullable: true 
                              description: O código ICAO do operador. 
                            iata: 
                              type: string 
                              nullable: true 
                              description: O código IATA do operador. 
                            callsign: 
                              type: string 
                              nullable: true 
                              description: | 
                                O nome de telefonia ICAO do operador (indicativo de chamada) usado com o 
                                controle de tráfego aéreo. 
                            name: 
                              type: string 
                              description: O nome do operador. Normalmente, o nome comercial legal. 
                            country: 
                              type: string 
                              nullable: true 
                              description: País onde o operador tem sede. 
                            location: 
                              type: string 
                              nullable: true 
                              description: | 
                                Potencialmente, um local mais específico onde o operador está baseado. Pode 
                                especificar cidade, estado, província, etc. 
                            phone: 
                              type: string 
                              nullable: true 
                              description: Número de telefone público do operador. 
                            shortname: 
                              type: string 
                              nullable: true 
                              description: | 
                                Versão mais curta do nome do operador. Normalmente, o 
                                nome "fazendo negócios como", quando diferente de "nome". 
                            url: 
                              type: string 
                              nullable: true 
                              description: URL do site do operador. 
                            URL_wiki:
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: URL da página do operador na Wikipédia. 
                          obrigatório: 
                            - icao 
                            - iata 
                            - indicativo 
                            - nome 
                            - país 
                            - localização 
                            - telefone 
                            - nome abreviado 
                            - url 
                            - wiki_url 
        '400': 
          descrição: Parâmetro (id) incorreto. O Id deve ser um código de operador válido e não pode estar vazio. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: Erro 
                tipo: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
        '404': 
          descrição: Esse operador não existe. 
          conteúdo: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/operators/{id}/canonical': 
    parâmetros: 
      - nome: id 
        in: caminho 
        obrigatório: verdadeiro 
        descrição: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o código ICAO lexicograficamente primeiro será retornado. 
        esquema: 
          tipo: sequência de caracteres 
          exemplo: UAL 
      - nome: country_code 
        in: consulta 
        descrição: | 
          Um código de país ISO 3166-1 alfa-2. 
        esquema: 
          tipo: sequência de caracteres 
          exemplo: EUA 
    obter: 
      operationId: get_operators_canonical 
      resumo: Obtenha o código canônico de um operador para uso da API. 
      descrição: | 
        Retorna todas as correspondências possíveis para um determinado código de operador (ICAO ou IATA). 
        Um código de país opcional pode ser fornecido para refinar códigos IATA ambíguos 
        para um único resultado. O código de país deve representar o país 
        em que a operadora opera. 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  operadores: 
                    tipo: array 
                    itens: 
                      título: CanonicalOperator 
                      tipo: objeto 
                      propriedades: 
                        id: 
                          tipo: string 
                          descrição: ID do operador para uso na API 
                        id_type: 
                          tipo: string 
                          descrição: ID do operador tipo
                          enum: 
                            - icao 
                            - iata 
                      required: 
                        - id 
                        - id_type 
                required: 
                  - operators 
        '400': 
          description: | 
            Parâmetro incorreto (id ou country_code). O Id deve ser um código de operador válido e não pode estar vazio. 
            O código do país deve representar um país em que o operador opera. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: Esse operador não existe. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção.
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/operators/{id}/flights': 
    parâmetros: 
      - nome: id 
        em: caminho 
        obrigatório: verdadeiro 
        descrição: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o primeiro código ICAO lexicograficamente será retornado. 
        esquema: 
          tipo: sequência de caracteres 
          exemplo: UAL 
      - nome: início 
        em: consulta 
        descrição: | 
          O intervalo de datas inicial para resultados de voos. O formato é data ISO8601 
          ou data e hora, e o limite é inclusivo. A data de início especificada 
          não pode ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data e hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data-hora 
            - formato: data 
        exemplos: 
          data-hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-exemplo: 'não' 
      - nome: fim 
        em: consulta 
        descrição: | 
          O intervalo de datas final para resultados de voo. O formato é data ISO8601 ou 
          data-hora, e o limite é exclusivo. A data final especificada não pode ser 
          posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data-hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data-hora 
            - formato: data 
        exemplos: 
          data-hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'no' 
      - in: consulta 
        nome: max_pages 
        descrição: Número máximo de páginas a serem recuperadas. Este é um limite máximo e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro
          padrão: 1 
          mínimo: 1 
      - em: consulta 
        nome: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    get: 
      operationId: get_operator_flights 
      resumo: Obter todos os voos de uma operadora 
      descrição: | 
        Retorna todos os voos recentes e futuros para esta operadora. O comportamento para 
        datas de início e término opcionais para cada tipo retornado (`scheduled`, `arrivals`, 
        `enroute`) corresponde ao comportamento em seus pontos de extremidade correspondentes. 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: Voos da operadora. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      next: 
                        tipo: string 
                        formato: uri-reference 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  programado: 
                    tipo: array 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou pelo registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: |
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se existir, do operador do voo; caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO do operador do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA do operador do voo. 
                        flight_number: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Número do voo do voo. 
                        registration: 
                          tipo: string 
                          anulável: true 
                          descrição: |
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pela 
                            FlightAware. Há uma série de razões pelas quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: |
                            Bandeira indicando que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações para o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ICAO/IATA/LID ou string indicando o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url:
                              tipo: string 
                              anulável: true 
                              formato: referência-uri 
                              descrição: URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações sobre o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade:
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            airport_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Duração do campo pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: string 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type:
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine de primeira classe. 
                        gate_origin: 
                          tipo: string 
                          anulável: verdadeiro
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de desembarque no aeroporto de destino. 
                        tipo: 
                          tipo: string 
                          descrição: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário de partida programado do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: |
                            Horário de partida programado para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada programado para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada para a pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora programada de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada ao portão.
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Hora real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - bloqueado 
                        - desviado 
                        - cancelado 
                        - position_only 
                        - origem - 
                        destino 
                        - atraso_de_partida 
                        - atraso_de_chegada 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - rota 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach - 
                        seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - tipo 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out - 
                        scheduled_off - 
                        estimated_off 
                        - actual_off - 
                        scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                  chegadas: 
                    tipo: array
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo.
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número da cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        desviado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo foi desviado.
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                              nullable: true 
                              exemplo: America/New_York 
                            nome:
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: true 
                              exemplo: Nova York 
                            airport_info_url: 
                              tipo: string 
                              nulo: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: true 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: true 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: true 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: true 
                            fuso horário: 
                              tipo: string
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: sequência de caracteres 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: sequência de caracteres 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: verdadeiro 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: sequência de caracteres 
                              anulável: verdadeiro 
                              formato: referência-URI 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida real ou estimado do portão. Se o horário do portão não estiver disponível, com base no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada real ou estimado do portão. Se o horário do portão não estiver disponível, com base no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Duração do registro de pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada na pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach:
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine de primeira classe. 
                        gate_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de chegada no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de chegada no aeroporto de destino. 
                        tipo: 
                          tipo: string 
                          descrição: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário de partida programado do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z'
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora estimada de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de chegada programado no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de chegada no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de chegada no portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business - 
                        seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - 
                        actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in - estimated_in 
                        - actual_in 
                  enroute: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código do operador seguido do número do voo 
                            (para voos comerciais) ou do registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador ICAO seguido do número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador IATA seguido do número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho terá um 
                            fa_flight_id duplicado.
                        operador: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                        operador_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código ICAO da operadora do voo. 
                        operador_iata: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código IATA da operadora do voo. 
                        número_do_voo: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Número do voo. 
                        registro: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Registro da aeronave (número da cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          tipo: array 
                          anulável: verdadeiro 
                          descrição: | 
                            Lista de quaisquer codeshares ICAO operando neste voo. 
                          itens: 
                            tipo: string 
                        codeshares_iata: 
                          tipo: array 
                          anulável: true 
                          descrição: | 
                            Lista de todos os codeshares da IATA operando neste voo.
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos para isso acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              anulável: true 
                            code_lid: 
                              tipo: string 
                              descrição: |
                                Código LID 
                              nulo: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nulo: true 
                              exemplo: America/New_York 
                            nome: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nulo: true 
                              exemplo: LaGuardia 
                            cidade: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nulo: true 
                              exemplo: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              formato: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          description: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: true 
                          propriedades: 
                            código: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nulo: true 
                            code_iata: 
                              type: string
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            code_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no horário de partida do portão real ou estimado 
                            . Se o horário do portão não estiver disponível, será com base no horário de partida da pista 
                            . Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no portão real ou estimado
                            hora de chegada. Se o horário do portão não estiver disponível, será baseado na 
                            hora de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Duração do voo pista a pista registrada (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real voada. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim:
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Número de assentos na classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Número de assentos na classe econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          nulo: true 
                          descrição: | 
                            Número de assentos na primeira classe. 
                        gate_origin: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          descrição: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        programada_saída: 
                          tipo: string 
                          formato: data-hora 
                          nulo: true
                          descrição: | 
                            Horário de partida do portão programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de partida da pista programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: |
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on - 
                        estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - scheduled 
                  - arrivals 
                  - enroute 
        '400': 
          description: Parâmetro incorreto (id). O Id deve ser um código de operador válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
        '404':
          descrição: Não existe tal operador. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: 
                Tipo de erro: objeto 
                propriedades: 
                  título: 
                    tipo: sequência de caracteres 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: sequência de caracteres 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: sequência de caracteres 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/operators/{id}/flights/scheduled': 
    parâmetros: 
      - nome: id 
        em: caminho 
        necessário: verdadeiro 
        descrição: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o primeiro código ICAO lexicograficamente será retornado. 
        esquema: 
          tipo: sequência de caracteres 
          exemplo: UAL 
      - nome: início 
        em: consulta 
        descrição: | 
          O intervalo de datas inicial para resultados de voos. O formato é data 
          ou data/hora ISO8601, e o limite é inclusivo. A data de início especificada 
          não deve ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data/hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data-hora 
            - formato: data 
        exemplos: 
          data/hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'no' 
      - nome: fim 
        em: consulta 
        descrição: |
          O intervalo de datas de término para resultados de voos. O formato é data ISO8601 ou 
          data/hora, e o limite é exclusivo. A data de término especificada não pode ser 
          posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data/hora, o horário padrão será 00:00:00Z. 
        schema: 
          type: string 
          oneOf: 
            - format: date-time 
            - format: date 
        examples: 
          datetime: 
            value: '2021-12-31T19:59:59Z' 
          date: 
            value: '2021-12-31' 
        x-fill-example: 'no' 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        schema: 
          type: integer 
          default: 1 
          minimum: 1 
      - in: query 
        name: cursor 
        description: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    obter: 
      operationId: get_operator_flights_scheduled 
      resumo: Obter voos programados 
      descrição: | 
        Retorna voos para esta operadora que estão programados para partir ou foram 
        cancelados recentemente, ordenados por `estimated_off` (ou `scheduled_off` 
        se `estimated_off` estiver ausente) em ordem crescente. Os parâmetros opcionais start e end 
        serão comparados com `scheduled_off` para limitar os 
        voos retornados. Se start não for especificado, voos com um 
        `scheduled_off` ou horário de cancelamento não superior a duas horas no 
        passado serão retornados. Se end não for especificado, não há 
        limite garantido para quando no futuro os voos programados serão retornados ( 
        normalmente será em torno de 48 horas no futuro para voos comerciais 
        ). 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados.
                    propriedades: 
                      next: 
                        tipo: string 
                        formato: uri-reference 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  programado: 
                    tipo: matriz 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pela FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho terá uma duplicata.
                            fa_flight_id. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se houver, da operadora do voo, caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número da cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de quaisquer codeshares ICAO operando neste voo. 
                          itens: 
                            tipo: string 
                        codeshares_iata: 
                          tipo: array 
                          anulável: verdadeiro 
                          descrição: |
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos para isso acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              anulável: true 
                            code_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              anulável: true 
                            code_lid:
                              tipo: string 
                              descrição: | 
                                código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: uri-reference 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações para o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          anulável: true 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              anulável: true 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              anulável: true
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        departure_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será com base no horário de partida da pista 
                            . Um valor negativo indica que o voo está adiantado. 
                        arrival_d elay: 
                          type: integer 
                          nullable: true 
                          description: |
                            Atraso de chegada (em segundos) com base no 
                            horário real ou estimado de chegada ao portão. Se o horário do portão não estiver disponível, será com base no 
                            horário de chegada à pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Duração do voo pista a pista registrada (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real voada. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          tipo: string 
                          nullable: verdadeiro 
                          description: |
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - Aviação_Geral 
                            - 
                        Saída_programada_da_companhia_aérea: 
                          tipo: string
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de partida do portão programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de partida da pista programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - 
                        gate_destination 
                        - terminal_origin - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - 
                        scheduled_on 
                        - estimated_on - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - scheduled 
        '400': 
          description: Parâmetro incorreto (id). O Id deve ser um código de operador válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
        '404': 
          descrição: Esse operador não existe.
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/operators/{id}/flights/arrivals': 
    parameters: 
      - name: id 
        in: path 
        required: true 
        description: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o primeiro código ICAO lexicograficamente será retornado. 
        schema: 
          type: string 
          example: UAL 
      - name: start 
        in: query 
        description: | 
          O intervalo de datas inicial para resultados de voos. O formato é data 
          ou data/hora ISO8601, e o limite é inclusivo. A data de início especificada 
          não deve ser posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data/hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data-hora 
            - formato: data 
        exemplos: 
          data/hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'no' 
      - nome: fim 
        em: consulta 
        descrição: | 
          O intervalo de datas final para resultados de voo. O formato é data ISO8601 ou
          datetime, e o limite é exclusivo. A data final especificada não pode ser 
          posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          date em vez de datetime, o horário padrão será 00:00:00Z. 
        schema: 
          type: string 
          oneOf: 
            - format: date-time 
            - format: date 
        examples: 
          datetime: 
            value: '2021-12-31T19:59:59Z' 
          date: 
            value: '2021-12-31' 
        x-fill-example: 'no' 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        schema: 
          type: integer 
          default: 1 
          minimum: 1 
      - in: query 
        name: cursor 
        description: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        schema: 
          type: string 
    get: 
      operationId: get_operator_flights_arrived 
      summary: Obter voos chegados 
      description: | 
        Retorna voos para este operador que partiram e posteriormente 
        chegaram, ordenados por `actual_on` em ordem decrescente. Os 
        parâmetros opcionais start e end serão comparados com `actual_on` para limitar os voos 
        retornados. O valor padrão do parâmetro start é 24 horas antes do 
        horário atual. O valor padrão do parâmetro end é o horário atual. 
      tags: 
        - operadores 
      responses: 
        '200': 
          description: Voos chegaram. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto contendo links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    required: 
                      - next 
                  num_pages:
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  chegadas: 
                    tipo: array 
                    itens: 
                      título: BaseFlight 
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            Código ICAO, se existir, do operador do voo, caso contrário, o código IATA 
                        operator_icao:
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Código ICAO da operadora do voo. 
                        operador_iata: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Código IATA da operadora do voo. 
                        número_de_voo: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Número do voo. 
                        registro: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          tipo: array 
                          anulável: true 
                          descrição: | 
                            Lista de quaisquer codeshares ICAO operando neste voo. 
                          itens: 
                            tipo: string 
                        codeshares_iata: 
                          tipo: array 
                          anulável: true 
                          descrição: | 
                            Lista de quaisquer codeshares IATA operando neste voo. 
                          itens: 
                            tipo: string 
                        bloqueado: 
                          tipo: booleano 
                          descrição: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública.
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: |
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        destination: 
                          description: | 
                            Informações para o aeroporto de destino deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string
                              descrição: | 
                                Código LID 
                              anulável: true 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              anulável: true 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              anulável: true 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              anulável: true 
                              exemplo: Nova Iorque 
                            airport_info_url: 
                              tipo: string 
                              anulável: true 
                              formato: referência-URI 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida real ou estimado do portão. Se o horário do portão não estiver disponível, com base no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no horário de chegada real ou estimado do portão 
                            . Se o horário do portão não estiver disponível, com base no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          type: integer
                          nullable: true 
                          description: | 
                            Duração arquivada de pista a pista (segundos). 
                        progress_percent: 
                          type: integer 
                          nullable: true 
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada à pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância planejada do voo (milhas estatutárias) com base na rota arquivada. Pode 
                            variar da distância real voada. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR arquivada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR arquivada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business:
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          tipo: inteiro 
                          nulo: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          tipo: string 
                          nulo: verdadeiro 
                          descrição: | 
                            Terminal de desembarque no aeroporto de destino. 
                        tipo: 
                          tipo: string 
                          descrição: | 
                            Se este é um voo comercial ou de aviação geral. 
                          enum: 
                            - Aviação_Geral 
                            - Companhia aérea 
                        scheduled_out: 
                          tipo: string 
                          formato: data e hora 
                          nulo: verdadeiro 
                          descrição: | 
                            Horário de partida programado do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          tipo: string
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada programado na pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada na pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário programado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário estimado de chegada ao portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário real de chegada ao portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out 
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - arrivals 
        '400': 
          description: Parâmetro incorreto (id). O Id deve ser um código de operador válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: Esse operador não existe. 
          conteúdo: 
            aplicativo/json; conjunto de caracteres=UTF-8: 
              esquema: 
                título: 
                tipo de erro: 
                propriedades do objeto: 
                  título: 
                    tipo: string
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: sequência de caracteres 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: sequência de caracteres 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/operators/{id}/flights/enroute': 
    parâmetros: 
      - nome: id 
        em: caminho 
        necessário: verdadeiro 
        descrição: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o código ICAO lexicograficamente primeiro será retornado. 
        esquema: 
          tipo: sequência de caracteres 
          exemplo: UAL 
      - nome: início 
        em: consulta 
        descrição: | 
          O intervalo de datas inicial para resultados de voos. O formato é data 
          ou data e hora ISO8601, e o limite é inclusivo. A data de início especificada não deve ser 
          posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data e hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data e hora 
            - formato: data 
        exemplos: 
          data e hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'no' 
      - nome: fim 
        em: consulta 
        descrição: | 
          O intervalo de datas final para resultados de voo. O formato é data ou 
          data e hora ISO8601, e o limite é exclusivo. A data final especificada não pode ser 
          posterior a 10 dias no passado e 2 dias no futuro. Se usar 
          data em vez de data e hora, o horário padrão será 00:00:00Z. 
        esquema: 
          tipo: string 
          oneOf:
            - formato: data-hora 
            - formato: data 
        exemplos: 
          data-hora: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'não' 
      - in: consulta 
        nome: max_pages 
        descrição: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro 
          padrão: 1 
          mínimo: 1 
      - in: consulta 
        nome: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    get: 
      operationId: get_operator_flights_enroute 
      resumo: Obter voos em rota 
      descrição: | 
        Retorna voos para esta operadora que partiram e estão atualmente 
        em rota, ordenados por `estimated_on` crescente. Os 
        parâmetros opcionais start e end serão comparados com `estimated_on` para limitar os 
        voos retornados. O valor padrão do parâmetro start é 48 horas 
        antes do horário atual (isso leva em conta voos atrasados). 
        Não há um limite final padrão. 
      tags: 
        - operadores 
      respostas: 
        '200': 
          descrição: Voos em rota. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      next: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  enroute: 
                    tipo: array 
                    itens: 
                      título: BaseFlight
                      tipo: objeto 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: | 
                            O código do operador seguido pelo número do voo 
                            (para voos comerciais) ou o registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            O código do operador ICAO seguido pelo número do voo (para voos comerciais) 
                        ident_iata: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            O código do operador IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          tipo: string 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operador: 
                          tipo: string 
                          nulo: true 
                          descrição: | 
                            Código ICAO, se existir, da operadora do voo, caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número da cauda), quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            A identificação do voo para fins de Controle de Tráfego Aéreo, quando conhecida e diferente da identificação. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Bandeira indicando se este voo foi desviado. 
                        cancelado: 
                          tipo: booleano
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                        origin: 
                          description: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: | 
                                Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                              nullable: true 
                              exemplo: America/New_York 
                            nome: 
                              tipo: string 
                              descrição: |
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        destination: 
                          description: | 
                            Informações sobre o aeroporto de destino deste voo. 
                          title: FlightAirportRef 
                          type: object 
                          nullable: true 
                          properties: 
                            code: 
                              type: string 
                              description: | 
                                Código ou string ICAO/IATA/LID que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nullable: true 
                            code_icao: 
                              type: string 
                              description: | 
                                Código ICAO 
                              nullable: true 
                            code_iata: 
                              type: string 
                              description: | 
                                Código IATA 
                              nullable: true 
                            code_lid: 
                              type: string 
                              description: | 
                                Código LID 
                              nullable: true 
                            timezone: 
                              type: string 
                              description: |
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nullable: true 
                              example: America/New_York 
                            name: 
                              type: string 
                              description: | 
                                Nome comum do aeroporto 
                              nullable: true 
                              example: LaGuardia 
                            city: 
                              type: string 
                              description: | 
                                Cidade mais próxima do aeroporto 
                              nullable: true 
                              example: New York 
                            airport_info_url: 
                              type: string 
                              nullable: true 
                              format: uri-reference 
                              description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          required: 
                            - code 
                            - airport_info_url 
                        departure_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de partida (em segundos) com base no horário de partida real ou estimado do portão 
                            . Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Atraso de chegada (em segundos) com base no horário de chegada real ou estimado do portão 
                            . Se o horário do portão não estiver disponível, será baseado no horário de chegada da pista 
                            . Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          description: | 
                            Duração do registro de pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          nullable: verdadeiro
                          description: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada na pista. Nulo 
                            para voos somente de posição em rota. 
                          minimum: 0 
                          maximum: 100 
                        status: 
                          type: string 
                          description: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido. 
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas estatutárias) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          tipo: inteiro 
                          nullable: verdadeiro 
                          descrição: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          tipo: inteiro
                          nullable: true 
                          description: | 
                            Número de assentos na cabine econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine de primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de chegada no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de chegada no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - General_Aviation 
                            - Companhia aérea 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_out:
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Hora estimada de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Hora real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora
                          nullable: true 
                          description: | 
                            Horário de chegada programado no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data e hora 
                          nullable: true 
                          description: | 
                            Horário estimado de chegada no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data e hora 
                          nullable: true 
                          description: | 
                            Horário real de chegada no portão. 
                          Exemplo: '2021-12-31T19:59:59Z' 
                      necessário: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude 
                        - route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach - seats_cabin_first 
                        - 
                        gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out
                        - actual_out 
                        - scheduled_off 
                        - estimated_off 
                        - actual_off 
                        - scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                required: 
                  - links 
                  - num_pages 
                  - enroute 
        '400': 
          description: Parâmetro incorreto (id). O Id deve ser um código de operador válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Resumo curto do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: Esse operador não existe. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/operators/{id}/flights/counts': 
    parameters: 
      - name: id 
        in: path 
        required: true 
        description: | 
          O identificador ICAO ou IATA de um operador. O uso do código ICAO é 
          altamente preferível. No caso de códigos IATA não exclusivos, o operador 
          com o primeiro código ICAO lexicograficamente será retornado. 
        schema: 
          type: string 
          example: UAL 
    get: 
      operationId: get_operator_flights_count 
      summary: Obter contagens de voos para o operador 
      description: | 
        Retorna contagens de voos aéreos e operados recentemente para 
        o operador. 
      tags: 
        - operadores 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: OperatorFlightCounts 
                type: object 
                properties: 
                  airborne: 
                    type: integer 
                    minimum: 0 
                    description: O número de voos atualmente em operação para esta operadora. 
                  flights_last_24_hours: 
                    type: integer 
                    minimum: 0 
                    description: | 
                      O número de voos que partiram nas últimas 24 horas para esta operadora, 
                      incluindo voos da Airborne. 
                required: 
                  - airborne 
                  - flights_last_24_hours 
        '400': 
          description: Parâmetro incorreto (id). O Id deve ser um código de operadora válido e não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Erro 
                type: object 
                properties:
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: Esse operador não existe. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: objeto 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  /alerts: 
    obter: 
      operationId: obter_todos_os_alertas 
      resumo: Obter todos os alertas configurados 
      descrição: | 
        Retorna todos os alertas configurados para a conta FlightAware (isso 
        inclui alertas configurados por outros meios pelo usuário do FlightAware 
        que possui a conta AeroAPI, como o site ou aplicativos móveis do FlightAware). 
      tags: 
        - 
      parâmetros de alertas:
        - in: query 
          name: max_pages 
          description: | 
            Número máximo de páginas a serem buscadas. Este é um limite superior e não 
            uma garantia de quantas páginas serão retornadas. O padrão é 0, o que significa que 
            nenhum máximo foi definido. Defina este parâmetro se o tempo limite da sua chamada estiver esgotado 
            (provavelmente devido a um alto número de alertas). 
          schema: 
            type: integer 
            default: 0 
            minimum: 0 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: Lista de todos os alertas. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  links: 
                    type: object 
                    nullable: true 
                    description: | 
                      Objeto que contém links para recursos relacionados. 
                    properties: 
                      next: 
                        type: string 
                        format: uri-reference 
                        description: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  alertas: 
                    tipo: array 
                    itens: 
                      allOf: 
                        - tipo: objeto 
                          propriedades: 
                            id: 
                              tipo: inteiro 
                              descrição: 'ID exclusivo para alerta, pode ser usado para atualizar ou excluir alerta.' 
                            descrição: 
                              tipo: string 
                              descrição: | 
                                Descrição textual do alerta gerada pelo servidor. Pode incluir companhia aérea, 
                                número do voo, origem, destino, etc. 
                        - tipo: objeto 
                          propriedades:
                            ident: 
                              type: string 
                              nullable: true 
                              description: | 
                                Ident para alertar. Este valor pode ser modificado com base na 
                                resolução do codeshare. Se isso ocorrer, o ident fornecido originalmente será 
                                preservado no campo user_ident. 
                        - type: object 
                          properties: 
                            ident_icao: 
                              type: string 
                              nullable: true 
                              description: | 
                                Ident ICAO para alertar 
                            ident_iata: 
                              type: string 
                              nullable: true 
                              description: | 
                                Ident IATA para alertar 
                        - type: object 
                          properties: 
                            origin: 
                              type: string 
                              nullable: true 
                              description: 'Código ICAO, IATA ou LID do aeroporto de origem para alertar.' 
                        - type: object 
                          properties: 
                            origin_icao: 
                              type: string 
                              nullable: true 
                              description: Código ICAO do aeroporto de origem para alertar. 
                            origin_iata: 
                              type: string 
                              nullable: true 
                              description: Código IATA do aeroporto de origem para alertar. 
                            origin_lid: 
                              type: string 
                              nullable: true 
                              description: Código LID do aeroporto de origem para alertar. 
                        - tipo: 
                          propriedades do objeto: 
                            destino: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: 'Código ICAO, IATA ou LID do aeroporto de destino para alertar.' 
                        - tipo: 
                          propriedades do objeto:
                            destination_icao: 
                              type: string 
                              nullable: true 
                              description: Código ICAO do aeroporto de destino para alertar. 
                            destination_iata: 
                              type: string 
                              nullable: true 
                              description: Código IATA do aeroporto de destino para alertar. 
                            destination_lid: 
                              type: string 
                              nullable: true 
                              description: Código LID do aeroporto de destino para alertar. 
                        - type: object 
                          properties: 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: Código ICAO do tipo de aeronave para alertar. 
                        - type: object 
                          properties: 
                            created: 
                              type: string 
                              format: date-time 
                              description: Hora em que o alerta foi criado. 
                              example: '2021-12-31T19:59:59Z' 
                            changed: 
                              type: string 
                              format: date-time 
                              description: Hora em que o alerta foi modificado pela última vez. 
                              example: '2021-12-31T19:59:59Z' 
                        - type: object 
                          properties: 
                            start: 
                              type: string 
                              nullable: true 
                              format: date 
                              description: | 
                                Data de início do alerta. Deve estar no 
                                fuso horário do aeroporto de partida. 
                            end: 
                              type: string 
                              nullable: true 
                              format: date 
                              description: | 
                                Data de término do alerta (inclusive). Deve estar no 
                                fuso horário do aeroporto de partida. 
                        - tipo: objeto
                          propriedades: 
                            user_ident: 
                              tipo: string 
                              nullable: true 
                              descrição: Identificação especificada originalmente. 
                        - tipo: objeto 
                          propriedades: 
                            eta: 
                              tipo: inteiro 
                              descrição: | 
                                Quantos minutos antes do horário previsto de chegada de um voo um alerta deve ser 
                                entregue. Os alertas só serão entregues após o voo estar no 
                                ar por pelo menos 15 minutos. Defina como 0 para desativar. 
                              padrão: 0 
                            eventos: 
                              tipo: objeto 
                              propriedades: 
                                chegada: 
                                  tipo: booleano 
                                  descrição: | 
                                    Se os alertas devem ser entregues na chegada. Os clientes da FlightAware 
                                    Global também receberão 
                                    alertas "Parada de táxi" e "Pronto para Táxi" (Ready To Taxi™), a menos que tenham optado por não participar. 
                                  default: false 
                                cancelled: 
                                  type: boolean 
                                  description: | 
                                    Se os alertas devem ser entregues em caso de cancelamento pela companhia aérea 
                                  default: false 
                                departure: 
                                  type: boolean 
                                  description: | 
                                    Se os alertas devem ser entregues na partida. 
                                    Os clientes da FlightAware Global também receberão alertas "Ligar" e "Iniciar táxi" e " 
                                    Pronto para Táxi" (Ready To Taxi™), a menos que tenham optado por não participar. 
                                  default: false 
                                diverted: 
                                  type: boolean 
                                  description: Se os alertas devem ser entregues em caso de desvio 
                                  default: false 
                                filed: 
                                  type: boolean
                                  descrição: Se os alertas devem ser entregues no arquivamento 
                                  padrão: falso 
                                saída: 
                                  tipo: booleano 
                                  descrição: Se os alertas devem ser entregues quando a aeronave sai do portão de embarque 
                                  padrão: falso 
                                'off': 
                                  tipo: booleano 
                                  descrição: Se os alertas devem ser entregues quando a aeronave sai da pista 
                                  padrão: falso 
                                'on': 
                                  tipo: booleano 
                                  descrição: Se os alertas devem ser entregues quando a aeronave pousa na pista 
                                  padrão: falso 
                                entrada: 
                                  tipo: booleano 
                                  descrição: Se os alertas devem ser entregues quando a aeronave entra no portão de desembarque 
                                  padrão: falso 
                              obrigatório: 
                                - chegada 
                                - cancelado 
                                - partida 
                                - desviado 
                                - 
                                arquivado 
                                - saída - 'off' 
                                - 'on' 
                                - em 
                            target_url: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                URL específica do alerta para entrega. Se nulo, o alerta 
                                será entregue ao 
                                destino de URL de alerta configurado para toda a conta. 
                        - tipo: objeto 
                          propriedades: 
                            habilitado: 
                              tipo: booleano 
                              descrição: Se o alerta está habilitado. 
                      obrigatório: 
                        - id 
                        - descrição 
                        - ident 
                        - origem 
                        - destino
                        - aircraft_type 
                        - criado 
                        - alterado 
                        - início 
                        - fim 
                        - user_ident 
                        - eta 
                        - eventos 
                        - target_url 
                        - habilitado 
                obrigatório: 
                  - alertas 
    post: 
      operationId: create_alert 
      resumo: Criar novo alerta 
      descrição: | 
        Criar um novo alerta de voo AeroAPI. Quando o alerta for acionado, um 
        mecanismo de retorno de chamada será usado para notificar o endereço definido por meio do 
        endpoint /alerts/endpoint. Cada retorno de chamada será cobrado como uma consulta e 
        contará para o uso da chave AeroAPI que criou o alerta. Se essa chave 
        for desativada ou removida, o alerta não estará mais disponível. 
        Se um target_url for fornecido, esse alerta específico será entregue 
        a esse endereço, independentemente do endereço definido por meio do endpoint /alerts/endpoint. 
      tags: 
        - alertas 
      requestBody: 
        descrição: Estrutura de configuração do alerta 
        conteúdo: 
          application/json; charset=UTF-8: 
            esquema: 
              allOf: 
                - tipo: objeto 
                  propriedades: 
                    ident: 
                      tipo: string 
                      nulo: verdadeiro 
                      descrição: | 
                        Identificador para alertar. Esse valor pode ser modificado com base na 
                        resolução do codeshare. Se isso ocorrer, o ident fornecido originalmente será 
                        preservado no campo user_ident. 
                - type: object 
                  properties: 
                    origin: 
                      type: string 
                      nullable: true 
                      description: 'Código ICAO, IATA ou LID do aeroporto de origem para alertar.' 
                - type: object 
                  properties: 
                    destination: 
                      type: string 
                      nullable: true 
                      description: 'Código ICAO, IATA ou LID do aeroporto de destino para alertar.' 
                - type: object 
                  properties: 
                    aircraft_type:
                      tipo: string 
                      anulável: verdadeiro 
                      descrição: Código ICAO do tipo de aeronave para alertar. 
                - tipo: objeto 
                  propriedades: 
                    início: 
                      tipo: string 
                      anulável: verdadeiro 
                      formato: data 
                      descrição: | 
                        Data de início do alerta. Deve estar no 
                        fuso horário do aeroporto de partida. 
                    fim: 
                      tipo: string 
                      anulável: verdadeiro 
                      formato: data 
                      descrição: | 
                        Data de término do alerta (inclusive). Deve estar no 
                        fuso horário do aeroporto de partida. 
                - tipo: objeto 
                  propriedades: 
                    max_weekly: 
                      tipo: inteiro 
                      descrição: | 
                        Rejeite o novo alerta se o número estimado de alertas disparados 
                        por semana com base nas tendências históricas de voo exceder esse valor. 
                        O limite considera apenas os alertas disparados por esta configuração de alerta 
                        (não é um total para todos os alertas configurados anteriormente). A verificação é 
                        aplicada apenas na criação/modificação do alerta e não 
                        impede que os alertas sejam entregues mesmo que excedam a 
                        quantidade fornecida. Se sua solicitação de alerta for rejeitada, considere adicionar 
                        critérios de filtro adicionais para a criação do alerta para refinar ainda mais a configuração. 
                        Se max_weekly não for especificado para um cliente padrão, o valor padrão de 
                        max_weekly será 1000. Para um cliente premium, o valor padrão de max_weekly 
                        será 4000. 
                - tipo: objeto 
                  propriedades: 
                    eta: 
                      tipo: inteiro 
                      descrição: | 
                        Quantos minutos antes do horário previsto de um voo um alerta deve ser 
                        enviado. Os alertas só serão enviados após o voo estar no 
                        ar por pelo menos 15 minutos. Defina como 0 para desativar. 
                      padrão: 0 
                    eventos:
                      tipo: objeto 
                      propriedades: 
                        chegada: 
                          tipo: booleano 
                          descrição: | 
                            Se os alertas devem ser entregues na chegada. Os clientes da FlightAware 
                            Global também receberão 
                            alertas "Taxi Stop" e "Ready To Taxi™", a menos que tenham optado por não participar. 
                          default: false 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Se os alertas devem ser entregues em caso de cancelamento pela companhia aérea 
                          default: false 
                        departure: 
                          type: boolean 
                          description: | 
                            Se os alertas devem ser entregues na partida. 
                            Os clientes da FlightAware Global também receberão alertas "Power On" e "Taxi Start" e " 
                            Ready To Taxi™, a menos que tenham optado por não participar. 
                          default: false 
                        diverted: 
                          type: boolean 
                          description: Se os alertas devem ser entregues no desvio 
                          default: false 
                        filed: 
                          type: boolean 
                          description: Se os alertas devem ser entregues no arquivamento 
                          default: false 
                        out: 
                          type: boolean 
                          description: Se os alertas devem ser entregues quando a aeronave sai do portão de embarque 
                          default: false 
                        'off': 
                          type: boolean 
                          description: Se os alertas devem ser entregues quando a aeronave sai da pista 
                          default: false 
                        'on': 
                          type: boolean 
                          description: Se os alertas devem ser entregues quando a aeronave pousa na pista 
                          default: false 
                        em: 
                          tipo: booleano 
                          descrição: Se os alertas devem ser entregues quando a aeronave entra no portão de chegada 
                          padrão: falso
                      obrigatório: 
                        - chegada 
                        - cancelado 
                        - partida 
                        - desviado 
                        - arquivado 
                        - fora 
                        - 'desligado' 
                        - 'ligado' 
                        - em 
                    target_url: 
                      tipo: string 
                      anulável: verdadeiro 
                      descrição: | 
                        URL específica do alerta para entrega. Se nulo, o alerta 
                        será entregue ao destino de URL de alerta configurado para toda a conta 
                        . 
              obrigatório: 
                - id 
                - descrição 
                - ident 
                - origem 
                - destino 
                - aircraft_type 
                - criado 
                - alterado 
                - início 
                - fim 
                - user_ident 
                - eta 
                - eventos 
                - target_url 
      respostas: 
        '201': 
          descrição: Alerta criado com sucesso 
          cabeçalhos: 
            Localização: 
              descrição: URL do alerta recém-criado 
              esquema: 
                tipo: string 
                formato: uri-reference 
        '400': 
          descrição: | 
            Parâmetros inválidos especificados (identificação, origem, destino, aircraft_type, datas ou eventos ausentes inválidos) ou alerta configurado disparariam mais 
            do que max_weekly alertas entregues por semana. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/alerts/{id}': 
    parameters: 
      - in: path 
        name: id 
        description: O ID do alerta a ser obtido ou atualizado 
        required: true 
        schema: 
          type: integer 
    get: 
      operationId: get_alert 
      summary: Obter alerta específico 
      description: | 
        Retorna os dados de configuração de um alerta com o ID especificado. 
      tags: 
        - alerts 
      responses: 
        '200': 
          description: Retorna a estrutura de configuração do alerta. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                allOf: 
                  - type: object 
                    properties: 
                      id: 
                        type: integer 
                        description: 'ID exclusivo para alerta, pode ser usado para atualizar ou excluir alerta.' 
                      description: 
                        type: string 
                        description: | 
                          Descrição textual do alerta gerada pelo servidor. Pode incluir transportadora, 
                          número do voo, origem, destino, etc. 
                  - type: object 
                    properties: 
                      ident: 
                        type: string 
                        nullable: true 
                        description: | 
                          Ident para alertar. Este valor pode ser modificado com base na 
                          resolução do codeshare. Se isso ocorrer, o ident fornecido originalmente será 
                          preservado no campo user_ident. 
                  - tipo: objeto 
                    propriedades: 
                      ident_icao: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: |
                          Identificação ICAO para alertar sobre 
                      ident_iata: 
                        type: string 
                        nullable: true 
                        description: | 
                          Identificação IATA para alertar sobre 
                  - type: object 
                    properties: 
                      origin: 
                        type: string 
                        nullable: true 
                        description: 'Código ICAO, IATA ou LID do aeroporto de origem para alertar.' 
                  - type: object 
                    properties: 
                      origin_icao: 
                        type: string 
                        nullable: true 
                        description: Código ICAO do aeroporto de origem para alertar. 
                      origin_iata: 
                        type: string 
                        nullable: true 
                        description: Código IATA do aeroporto de origem para alertar. 
                      origin_lid: 
                        type: string 
                        nullable: true 
                        description: Código LID do aeroporto de origem para alertar. 
                  - type: object 
                    properties: 
                      destination: 
                        type: string 
                        nullable: true 
                        description: 'Código ICAO, IATA ou LID do aeroporto de destino para alertar.' 
                  - type: object 
                    properties: 
                      destination_icao: 
                        type: string 
                        nullable: true 
                        description: Código ICAO do aeroporto de destino para alertar. 
                      destination_iata: 
                        type: string 
                        nullable: true 
                        description: Código IATA do aeroporto de destino para alertar. 
                      destination_lid: 
                        type: string 
                        nullable: true 
                        description: Código LID do aeroporto de destino para alertar. 
                  - type: object 
                    properties: 
                      aircraft_type: 
                        type: string 
                        nullable: true 
                        description: Código ICAO do tipo de aeronave para alertar.
                  - tipo: 
                    propriedades do objeto: 
                      criado: 
                        tipo: string 
                        formato: data-hora 
                        descrição: Hora em que o alerta foi criado. 
                        exemplo: '2021-12-31T19:59:59Z' 
                      alterado: 
                        tipo: string 
                        formato: data-hora 
                        descrição: Hora em que o alerta foi modificado pela última vez. 
                        exemplo: '2021-12-31T19:59:59Z' 
                  - tipo: 
                    propriedades do objeto: 
                      início: 
                        tipo: string 
                        anulável: verdadeiro 
                        formato: data 
                        descrição: | 
                          Data de início do alerta. Deve estar no 
                          fuso horário do aeroporto de partida. 
                      fim: 
                        tipo: string 
                        anulável: verdadeiro 
                        formato: data 
                        descrição: | 
                          Data de término do alerta (inclusive). Deve estar no 
                          fuso horário do aeroporto de partida. 
                  - tipo: 
                    propriedades do objeto: 
                      user_ident: 
                        tipo: string 
                        anulável: verdadeiro 
                        descrição: Identificação especificada originalmente. 
                  - tipo: 
                    propriedades do objeto: 
                      eta: 
                        tipo: inteiro 
                        descrição: | 
                          Quantos minutos antes do ETA de um voo um alerta deve ser 
                          entregue. Os alertas só serão entregues após o voo estar no 
                          ar por pelo menos 15 minutos. Defina como 0 para desativar. 
                        Padrão: 0 
                      eventos: 
                        tipo: objeto 
                        propriedades: 
                          chegada: 
                            tipo: booleano 
                            descrição: | 
                              Se os alertas devem ser entregues na chegada. 
                              Os clientes da FlightAware Global também receberão o "ponto de táxi" Ready To Taxi™.
                              alertas, a menos que tenham optado por não recebê-los. 
                            padrão: falso 
                          cancelado: 
                            tipo: booleano 
                            descrição: | 
                              Se os alertas devem ser entregues no cancelamento pela companhia aérea 
                            padrão: falso 
                          partida: 
                            tipo: booleano 
                            descrição: | 
                              Se os alertas devem ser entregues na partida. Os clientes da FlightAware 
                              Global também receberão alertas "power on" e "taxi start" do 
                              Ready To Taxi™, a menos que tenham optado por não participar. 
                            padrão: falso 
                          desviado: 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues no desvio 
                            padrão: falso 
                          arquivado: 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues no arquivamento 
                            padrão: falso 
                          fora: 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues quando a aeronave sai do portão de embarque 
                            padrão: falso 
                          'desligado': 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues quando a aeronave sai da pista 
                            padrão: falso 
                          'ligado': 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues quando a aeronave pousa na pista 
                            padrão: falso 
                          em: 
                            tipo: booleano 
                            descrição: Se os alertas devem ser entregues quando a aeronave entra no portão de desembarque 
                            padrão: falso 
                        necessário: 
                          - chegada 
                          - cancelado 
                          - partida 
                          - desviado 
                          - arquivado 
                          - fora
                          - 'off' 
                          - 'on' 
                          - em 
                      target_url: 
                        type: string 
                        nullable: true 
                        description: | 
                          URL específica do alerta para entrega. Se nulo, o alerta 
                          será entregue ao 
                          destino de URL de alerta configurado para toda a conta. 
                  - type: object 
                    properties: 
                      enabled: 
                        type: boolean 
                        description: Se o alerta está habilitado. 
                required: 
                  - id 
                  - description 
                  - ident 
                  - origin - 
                  destination 
                  - aircraft_type 
                  - created 
                  - changed 
                  - start 
                  - end 
                  - user_ident 
                  - eta 
                  - events 
                  - target_url 
                  - enabled 
        '404': 
          description: Não existe tal alerta. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Erro 
                type: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
    put: 
      operationId: update_alert
      Resumo: Modificar descrição de alerta específico 
      : | 
        Modifica a configuração de um alerta com o ID especificado. Se um 
        endereço de URL de destino for fornecido, o alerta será entregue a esse endereço, 
        mesmo que seja diferente do endereço padrão de toda a conta definido por meio 
        do endpoint alerts/endpoint. Atualizar um alerta criado com uma 
        chave AeroAPI diferente é possível, mas não alterará a chave AeroAPI à qual 
        o alerta está associado para uso. 
      tags: 
        - alerts 
      requestBody: 
        description: Estrutura de configuração do alerta 
        content: 
          application/json; charset=UTF-8: 
            schema: 
              allOf: 
                - allOf: 
                    - type: object 
                      properties: 
                        ident: 
                          type: string 
                          nullable: true 
                          description: | 
                            Ident para alertar. Este valor pode ser modificado com base na 
                            resolução do codeshare. Se isso ocorrer, o ident fornecido originalmente será 
                            preservado no campo user_ident. 
                    - type: object 
                      properties: 
                        origin: 
                          type: string 
                          nullable: true 
                          description: 'Código ICAO, IATA ou LID do aeroporto de origem para alertar.' 
                    - tipo: 
                      propriedades do objeto: 
                        destino: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: 'Código ICAO, IATA ou LID do aeroporto de destino para alertar.' 
                    - tipo: 
                      propriedades do objeto: 
                        tipo_aeronave: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: Código ICAO do tipo de aeronave para alertar. 
                    - tipo: 
                      propriedades do objeto: 
                        início: 
                          tipo: string 
                          anulável: verdadeiro 
                          formato: data 
                          descrição: |
                            Data de início do alerta. Deve estar no 
                            fuso horário do aeroporto de partida. 
                        end: 
                          type: string 
                          nullable: true 
                          format: date 
                          description: | 
                            Data de término do alerta (inclusive). Deve estar no 
                            fuso horário do aeroporto de partida. 
                    - type: object 
                      properties: 
                        max_weekly: 
                          type: integer 
                          description: | 
                            Rejeite o novo alerta se o número estimado de alertas disparados 
                            por semana com base nas tendências históricas de voos exceder esse valor. 
                            O limite considera apenas os alertas disparados por esta configuração de alerta 
                            (não é um total para todos os alertas configurados anteriormente). A verificação é 
                            aplicada apenas na criação/modificação do alerta e impede ou não 
                            que os alertas sejam entregues, mesmo que excedam a 
                            quantidade fornecida. Se sua solicitação de alerta for rejeitada, considere adicionar 
                            critérios de filtro adicionais para a criação do alerta para refinar ainda mais a configuração. 
                            Se max_weekly não for especificado para um cliente padrão, o padrão é 
                            1000 para max_weekly. Para um cliente premium, o padrão é 
                            4000 para max_weekly. 
                    - type: object 
                      properties: 
                        eta: 
                          type: integer 
                          description: | 
                            Quantos minutos antes do horário previsto para o voo um alerta deve ser 
                            enviado. Os alertas só serão enviados após o voo estar no 
                            ar por pelo menos 15 minutos. Defina como 0 para desativar. 
                          padrão: 0 
                        eventos: 
                          tipo: objeto 
                          propriedades: 
                            chegada: 
                              tipo: booleano 
                              descrição: | 
                                Se os alertas devem ser enviados na chegada. FlightAware
                                Os clientes globais também receberão 
                                alertas "Taxi Stop" Ready To Taxi™, a menos que tenham optado por não participar. 
                              default: false 
                            cancelled: 
                              type: boolean 
                              description: | 
                                Se os alertas devem ser entregues em caso de cancelamento pela companhia aérea 
                              default: false 
                            departure: 
                              type: boolean 
                              description: | 
                                Se os alertas devem ser entregues na partida. 
                                Os clientes globais da FlightAware também receberão 
                                alertas "Power On" e "Taxi Start" Ready To Taxi™, a menos que tenham optado por não participar. 
                              default: false 
                            diverted: 
                              type: boolean 
                              description: Se os alertas devem ser entregues no desvio 
                              default: false 
                            filed: 
                              type: boolean 
                              description: Se os alertas devem ser entregues no arquivamento 
                              default: false 
                            out: 
                              type: boolean 
                              description: Se os alertas devem ser entregues quando a aeronave sai do portão de embarque 
                              default: false 
                            'off': 
                              type: boolean 
                              description: Se os alertas devem ser entregues quando a aeronave sai da pista 
                              default: false 
                            'on': 
                              type: boolean 
                              description: Se os alertas devem ser entregues quando a aeronave pousa na pista 
                              default: false 
                            in: 
                              tipo: booleano 
                              descrição: se os alertas devem ser entregues quando a aeronave entra no portão de chegada 
                              padrão: falso 
                          obrigatório: 
                            - chegada 
                            - cancelado
                            - partida 
                            - desviado 
                            - arquivado 
                            - fora 
                            - 'desligado' 
                            - 'ligado' 
                            - em 
                        target_url: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            URL específica do alerta para entrega. Se nulo, o alerta 
                            será entregue ao 
                            destino de URL de alerta configurado para toda a conta. 
                  obrigatório: 
                    - id 
                    - descrição 
                    - ident 
                    - origem 
                    - destino 
                    - aircraft_type 
                    - criado 
                    - alterado 
                    - início - 
                    fim 
                    - user_ident 
                    - eta 
                    - eventos 
                    - target_url 
                - tipo: objeto 
                  propriedades: 
                    habilitado: 
                      tipo: booleano 
                      descrição: Se o alerta está habilitado. 
              obrigatório: 
                - habilitado 
      respostas: 
        '204': 
          descrição: Alerta modificado 
        '400': 
          descrição: | 
            Parâmetros inválidos especificados (identificação, origem, destino, aircraft_type, datas ou eventos ausentes inválidos) ou alerta configurado disparariam mais do que max_weekly alertas entregues por semana. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Tipo de erro 
                : objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: |
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
        '404': 
          description: Esse alerta não existe. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
    delete: 
      operationId: delete_alert 
      summary: Excluir alerta específico 
      description: | 
        Exclui alerta específico com o ID fornecido 
      tags: 
        - alerts 
      responses: 
        '204': 
          description: Alerta excluído. 
        '400': 
          description: ID inválido. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: 
                Tipo de erro: 
                propriedades do objeto: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  /alerts/endpoint: 
    get: 
      operationId: get_alerts_endpoint 
      summary: Obtenha a URL de retorno de chamada de alerta configurada 
      description: | 
        Retorna a URL que será POSTada para alertas entregues via AeroAPI. 
      tags: 
        - alerts 
      responses: 
        '200': 
          description: Retorna a URL do endpoint. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                type: object 
                description: | 
                  Configuração para uma URL para a qual os alertas da AeroAPI devem ser entregues via HTTP POST. 
                  Esta é a URL padrão para toda a conta para a qual todos os alertas da AeroAPI serão entregues 
                  se o alerta não tiver uma URL de alerta específica configurada para ele. 
                propriedades: 
                  url: 
                    tipo: string 
                    formato: uri 
                    anulável: true 
                    descrição: URL padrão para toda a conta que será POSTada para alertas de voo. 
                obrigatório: 
                  - url 
        '400': 
          descrição: Falha ao obter o endpoint ou nenhum endpoint definido. 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: 
                tipo de erro: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe:
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
    put: 
      operationId: set_alerts_endpoint 
      resumo: Definir URL de retorno de chamada de alerta 
      descrição: | 
        Atualiza a URL padrão para a qual será enviado o POST para alertas entregues via AeroAPI. 
        Isso define a URL padrão para toda a conta para a qual todos os alertas serão entregues, a menos que 
        o alerta específico tenha um endereço de entrega diferente configurado para ele. 
      tags: 
        - alertas 
      requestBody: 
        descrição: Estrutura de configuração da URL do endpoint 
        conteúdo: 
          application/json; charset=UTF-8: 
            esquema: 
              tipo: objeto 
              descrição: | 
                Configuração para uma URL para a qual os alertas do AeroAPI devem ser entregues via HTTP POST. 
                Esta é a URL padrão para toda a conta para a qual todos os alertas do AeroAPI serão entregues 
                se o alerta não tiver uma URL de alerta específica configurada para ele. 
              propriedades: 
                url: 
                  tipo: string 
                  formato: uri 
                  anulável: true 
                  descrição: URL padrão para toda a conta que será POSTada para alertas de voo. 
              obrigatório: 
                - url 
      respostas: 
        '204': 
          descrição: 'Ponto de extremidade atualizado com sucesso, resposta vazia.' 
        '400': 
          descrição: 'Endereço inválido, nome de host ausente ou protocolo de endereço não suportado.' 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                título: 
                tipo de erro: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Resumo breve do tipo de erro encontrado. 
                  motivo: 
                    tipo: string
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
      retornos de chamada: 
        deliver_alert: 
          registrado endpoint: 
            post: 
              requestBody: 
                obrigatório: true 
                conteúdo: 
                  application/json; charset=UTF-8: 
                    esquema: 
                      tipo: objeto 
                      obrigatório: 
                        - descrição_longa 
                        - descrição_curta 
                        - resumo 
                        - código_do_evento 
                        - id_de_alerta 
                        - 
                      propriedades do voo: 
                        descrição_longa: 
                          tipo: string 
                        descrição_curta: 
                          tipo: string 
                        resumo: 
                          tipo: string 
                        código_do_evento: 
                          tipo: string 
                          enum: 
                            - arquivado 
                            - partida 
                            - chegada 
                            - saída 
                            - 'desligado' 
                            - 'ligado' 
                            - entrada 
                            - desviado 
                            - cancelado 
                            - chegada_somente_posição 
                            - partida_somente_posição 
                            - chegada_fru 
                            - chegada_não_aeroporto 
                            - partida_não_aeroporto 
                            - não_arquivado_aeroporto 
                            - minutos_desligados 
                            - ligar
                            - alterar 
                        alert_id: 
                          tipo: inteiro 
                        flight: 
                          tipo: objeto 
                          obrigatório: 
                            - fa_flight_id 
                          propriedades: 
                            fa_flight_id: 
                              tipo: string 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código do operador (ICAO ou IATA) seguido pelo número do voo 
                                (para voos comerciais) ou pelo número da cauda da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                O código do operador ICAO seguido pelo número do voo. 
                            ident_iata 
                              : tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                O código do operador IATA seguido pelo número do voo. 
                            registration: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Registro da aeronave (número da cauda), quando conhecido. 
                            atc_ident: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Identificador alternativo para o voo, possivelmente atribuído pelo ATC. 
                            aircraft_type: 
                              tipo: string 
                              descrição: | 
                                O tipo de aeronave geralmente será o código ICAO, mas
                                O código IATA será fornecido quando o código ICAO 
                                não for conhecido. 
                            origin: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador ICAO, IATA ou LID para o aeroporto de origem 
                            origin_icao: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador ICAO para o aeroporto de origem 
                            origin_iata: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador IATA para o aeroporto de origem 
                            origin_lid: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador LID para o aeroporto de origem 
                            destination: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador ICAO, IATA ou LID para o aeroporto de destino 
                            destination_icao: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador ICAO para o aeroporto de destino 
                            destination_iata: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador IATA para o aeroporto de destino 
                            destination_lid: 
                              type: string 
                              nullable: true 
                              description: | 
                                O identificador LID para o aeroporto de destino 
                            route: 
                              type: string 
                              nullable: true 
                              description: |
                                A descrição textual da rota do voo 
                            position_only: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                            blocked: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo está bloqueado para visualização pública. 
                            cancelled: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo foi cancelado. 
                            diverted: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo foi desviado. 
                            route_distance: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Distância de voo planejada (milhas estatutárias) com base na rota registrada. Pode 
                                variar da distância real percorrida. 
                            filed_ete: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Duração registrada de pista a pista (segundos). 
                            filed_altitude: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Altitude IFR registrada (centenas de pés). 
                            filed_airspeed_kts: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Velocidade do ar IFR registrada (nós). 
                            scheduled_out: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Horário de partida programado do portão.
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_out: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário estimado de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_out: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário programado de partida da pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário estimado de partida da pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de partida da pista. 
                              Exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário programado de chegada à pista. 
                              Exemplo: '2021 -12-31T19:59:59Z' 
                            estimated_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro
                              descrição: | 
                                Horário estimado de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário programado de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário estimado de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Horário real de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            baggage_claim: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Local de retirada de bagagem no aeroporto de destino. 
                            gate_origin: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Portão de embarque no aeroporto de origem. 
                            gate_destination: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Portão de desembarque no aeroporto de destino. 
                            terminal_origin:
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Terminal de partida no aeroporto de origem. 
                            terminal_destination: 
                              tipo: string 
                              nulo: verdadeiro 
                              descrição: | 
                                Terminal de chegada no aeroporto de destino. 
                            erro: 
                              tipo: string 
                              descrição: | 
                                Conterá informações de erro caso seja 
                                encontrado um problema ao montar os detalhes do voo 
              respostas: 
                '200': 
                  descrição: Seu servidor retornará este código se aceitar o retorno de chamada 
    exclusão: 
      operationId: delete_alerts_endpoint 
      resumo: Remover e desabilitar a URL de retorno de chamada de alerta padrão para toda a conta 
      descrição: | 
        Remover a URL padrão para toda a conta que será POSTada para alertas que 
        não estejam configurados com uma URL específica. Isso significa que quaisquer alertas que não estejam configurados 
        com uma URL específica não serão entregues. 
      tags: 
        - alertas 
      respostas: 
        '204': 
          descrição: Endpoint removido com sucesso. 
        '400': 
          descrição: Falha ao excluir endpoint. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Erro 
                tipo: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro.
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/history/flights/{ident }': 
    obter: 
      operationId: 
      resumo do get_history_flight: Obter informações para uma 
      descrição histórica de voo: | 
        Retorna um resumo do status das informações históricas de voo para um registro, ident 
        ou fa_flight_id. Se um fa_flight_id for especificado, no máximo 1 
        voo será retornado, a menos que o voo tenha sido desviado, caso em que 
        tanto o voo original quanto quaisquer desvios serão retornados com um 
        fa_flight_id duplicado. Se um registraion ou ident for especificado, uma 
        start_date e uma end_date devem ser especificadas. O intervalo entre start_date 
        e end_date pode ser de até 7 dias. Não mais do que 40 páginas podem ser solicitadas 
        de uma vez. Os dados estão disponíveis a partir de agora até 01/01/2011 00:00:00 UTC. 

        O campo `inbound_fa_flight_id` não será preenchido por este recurso. 
      tags: 
        - histórico 
      parâmetros: 
        - nome: ident 
          em: caminho 
          descrição: | 
            O ident, registro ou fa_flight_id a ser buscado. Se estiver usando 
            um ident de voo, é altamente recomendável especificar 
            o ident de voo ICAO em vez do ident de voo IATA para evitar ambiguidade e resultados inesperados. 
            Definir o ident_type também pode ser usado para ajudar a desambiguar. 
          required: true 
          schema: 
            type: string 
          examples: 
            ident: 
              value: UAL4 
            reg: 
              value: N123HQ 
            fa_id: 
              value: UAL1234-1234567890-airline-0123 
        - name: ident_type 
          in: query 
          description: | 
            Tipo de ident fornecido no parâmetro ident. Por padrão, o 
            ident passado é interpretado como um registro, se possível. Este parâmetro pode 
            forçar o ident a ser interpretado como um designador. 
          schema: 
            type: string 
            enum: 
              - designator 
              - registration 
              - fa_flight_id 
        - name: start 
          in: query 
          description: |
            O intervalo de datas de início para resultados de voos, comparando com 
            o campo `scheduled_out` dos voos (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ISO8601 ou data e hora, e o limite é 
            inclusivo. A data de início especificada deve ocorrer em ou após 2011-01-01 00:00:00 UTC 
            e não pode ser no futuro. Se usar data em vez de data e hora, o 
            horário padrão será 00:00:00Z. 
          esquema: 
            tipo: string 
            oneOf: 
              - formato: data e hora 
              - formato: data 
          exemplos: 
            data e hora: 
              valor: '2021-12-31T19:59:59Z' 
            data: 
              valor: '2021-12-31' 
        - nome: fim 
          em: consulta 
          descrição: | 
            O intervalo de datas de término para resultados de voos, comparando com o campo `scheduled_out` dos voos 
            (ou `scheduled_off` se `scheduled_out` estiver 
            ausente). O formato é data ou data e hora ISO8601, e o limite é 
            exclusivo. A data final especificada deve ocorrer após 2011-01-01 00:00:00 UTC 
            e não pode ser no futuro. Se usar data em vez de data e hora, o 
            horário padrão será 00:00:00Z. 
          schema: 
            type: string 
            oneOf: 
              - format: date-time 
              - format: date 
          examples: 
            datetime: 
              value: '2021-12-31T19:59:59Z' 
            date: 
              value: '2021-12-31' 
        - in: query 
          name: max_pages 
          description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
          schema: 
            type: integer 
            default: 1 
            minimum: 1 
        - in: query 
          name: cursor 
          description: | 
            Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
          schema: 
            type: string 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      next: 
                        tipo: string 
                        formato: uri-reference 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  voos: 
                    tipo: matriz 
                    itens: 
                      allOf: 
                        - título: BaseFlight 
                          tipo: objeto 
                          propriedades: 
                            ident: 
                              tipo: string 
                              descrição: | 
                                O código da operadora seguido pelo número do voo 
                                (para voos comerciais) ou o registro da aeronave (para 
                                aviação geral). 
                            ident_icao: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora ICAO seguido pelo número do voo (para voos comerciais) 
                            ident_iata: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                            actual_runway_off: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Pista de partida real na origem, quando conhecida 
                            actual_runway_on: 
                              tipo: string 
                              anulável: verdadeiro 
                              descrição: | 
                                Chegada real na pista de destino, quando conhecido 
                            fa_flight_id:
                              tipo: string 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                                o voo for desviado, o novo trecho do voo terá um 
                                fa_flight_id duplicado. 
                            operador: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                            operador_icao: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Código ICAO da operadora do voo. 
                            operador_iata: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Código IATA da operadora do voo. 
                            flight_number: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Número do voo. 
                            registro: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Registro da aeronave (número da cauda), quando conhecido. 
                            atc_ident: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente do ident. 
                            inbound_fa_flight_id: 
                              tipo: string 
                              anulável: true 
                              descrição: | 
                                Identificador exclusivo atribuído pelo FlightAware para o voo anterior da 
                                aeronave que atende este voo. 
                            codeshares: 
                              type: array 
                              nullable: true
                              description: | 
                                Lista de todos os codeshares da ICAO operando neste voo. 
                              items: 
                                type: string 
                            codeshares_iata: 
                              type: array 
                              nullable: true 
                              description: | 
                                Lista de todos os codeshares da IATA operando neste voo. 
                              items: 
                                type: string 
                            blocked: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo está bloqueado para visualização pública. 
                            diverted: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica se este voo foi desviado. 
                            cancelled: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que o voo não está mais sendo rastreado pelo 
                                FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                                incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                                caso. 
                            position_only: 
                              type: boolean 
                              description: | 
                                Sinalizador que indica que este voo não tem um plano de voo, horário ou outra indicação de intenção disponível. 
                            origin: 
                              description: | 
                                Informações sobre o aeroporto de origem deste voo. 
                              title: FlightAirportRef 
                              type: object 
                              nullable: true 
                              properties: 
                                code: 
                                  type: string 
                                  description: | 
                                    Código ou sequência de caracteres ICAO/IATA/LID que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição.
                                  nullable: true 
                                code_icao: 
                                  type: string 
                                  description: | 
                                    Código ICAO 
                                  nullable: true 
                                code_iata: 
                                  type: string 
                                  description: | 
                                    Código IATA 
                                  nullable: true 
                                code_lid: 
                                  type: string 
                                  description: | 
                                    Código LID 
                                  nullable: true 
                                timezone: 
                                  type: string 
                                  description: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  nullable: true 
                                  example: America/New_York 
                                name: 
                                  type: string 
                                  description: | 
                                    Nome comum do aeroporto 
                                  nullable: true 
                                  example: LaGuardia 
                                city: 
                                  type: string 
                                  description: | 
                                    Cidade mais próxima do aeroporto 
                                  nullable: true 
                                  example: New York 
                                airport_info_url: 
                                  type: string 
                                  nullable: true 
                                  format: uri-reference 
                                  description: A URL para mais informações sobre o aeroporto. Será null para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            destination: 
                              description: | 
                                Informações para o aeroporto de destino deste voo. 
                              title: FlightAirportRef
                              tipo: objeto 
                              anulável: verdadeiro 
                              propriedades: 
                                código: 
                                  tipo: string 
                                  descrição: | 
                                    Código ICAO/IATA/LID ou string que indica o local onde 
                                    o rastreamento do voo começou/terminou para voos somente de posição. 
                                  anulável: verdadeiro 
                                código_icao: 
                                  tipo: string 
                                  descrição: | 
                                    Código ICAO 
                                  anulável: verdadeiro 
                                código_iata: 
                                  tipo: string 
                                  descrição: | 
                                    Código IATA 
                                  anulável: verdadeiro 
                                código_lid: 
                                  tipo: string 
                                  descrição: | 
                                    Código LID 
                                  anulável: verdadeiro 
                                fuso horário: 
                                  tipo: string 
                                  descrição: | 
                                    Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                                  anulável: verdadeiro 
                                  exemplo: América/Nova_Iorque 
                                nome: 
                                  tipo: string 
                                  descrição: | 
                                    Nome comum do aeroporto 
                                  anulável: verdadeiro 
                                  exemplo: LaGuardia 
                                cidade: 
                                  tipo: string 
                                  descrição: | 
                                    Cidade mais próxima do aeroporto 
                                  anulável: verdadeiro 
                                  exemplo: Nova York 
                                airport_info_url: 
                                  tipo: string 
                                  anulável: verdadeiro 
                                  formato: uri-reference
                                  description: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                              required: 
                                - code 
                                - airport_info_url 
                            departure_delay: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Atraso de partida (em segundos) com base no 
                                horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                            arrival_delay: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Atraso de chegada (em segundos) com base no 
                                horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                                horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                            filed_ete: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Duração do campo pista a pista (segundos). 
                            progress_percent: 
                              type: integer 
                              nullable: true 
                              description: | 
                                A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                                para voos somente de posição em rota. 
                              minimum: 0 
                              maximum: 100 
                            status: 
                              type: string 
                              description: | 
                                Resumo legível do status do voo. 
                            aircraft_type: 
                              type: string 
                              nullable: true 
                              description: | 
                                O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                                quando o código ICAO não for conhecido.
                            route_distance: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                                variar da distância real percorrida. 
                            filed_airspeed: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Velocidade do ar IFR registrada (nós). 
                            filed_altitude: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Altitude IFR registrada (centenas de pés). 
                            route: 
                              type: string 
                              nullable: true 
                              description: | 
                                A descrição textual da rota do voo. 
                            baggage_claim: 
                              type: string 
                              nullable: true 
                              description: | 
                                Local de retirada de bagagem no aeroporto de destino. 
                            seats_cabin_business: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe executiva. 
                            seats_cabin_coach: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da classe econômica. 
                            seats_cabin_first: 
                              type: integer 
                              nullable: true 
                              description: | 
                                Número de assentos na cabine da primeira classe. 
                            gate_origin: 
                              type: string 
                              nullable: true 
                              description: | 
                                Portão de embarque no aeroporto de origem. 
                            portão_destination:
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Portão de chegada no aeroporto de destino. 
                            terminal_origin: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Terminal de partida no aeroporto de origem. 
                            terminal_destination: 
                              tipo: string 
                              nulo: true 
                              descrição: | 
                                Terminal de chegada no aeroporto de destino. 
                            tipo: 
                              tipo: string 
                              descrição: | 
                                Se este é um voo de aviação comercial ou geral. 
                              enum: 
                                - Aviação_Geral 
                                - Companhia aérea 
                            scheduled_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: true 
                              descrição: | 
                                Horário de partida programado do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: true 
                              descrição: | 
                                Horário estimado de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_out: 
                              tipo: string 
                              formato: data-hora 
                              nulo: true 
                              descrição: | 
                                Horário real de partida do portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: |
                                Horário de partida programado para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário estimado de partida para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_off: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário real de partida para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário de chegada programado para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: true 
                              descrição: | 
                                Horário estimado de chegada para a pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            actual_on: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Hora real de chegada à pista. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            scheduled_in: 
                              tipo: string 
                              formato: data-hora 
                              anulável: verdadeiro 
                              descrição: | 
                                Hora programada de chegada ao portão. 
                              exemplo: '2021-12-31T19:59:59Z' 
                            estimated_in: 
                              tipo: string 
                              formato: data-hora
                              nullable: true 
                              description: | 
                                Hora estimada de chegada ao portão. 
                              example: '2021-12-31T19:59:59Z' 
                            actual_in: 
                              type: string 
                              format: date-time 
                              nullable: true 
                              description: | 
                                Hora real de chegada ao portão. 
                              Exemplo: '2021-12-31T19:59:59Z' 
                          necessário: 
                            - ident 
                            - fa_flight_id 
                            - operador 
                            - operator_iata 
                            - flight_number 
                            - registration 
                            - atc_ident 
                            - inbound_fa_flight_id 
                            - codeshares 
                            - blocked 
                            - diverted 
                            - cancelled 
                            - position_only 
                            - origin 
                            - destination 
                            - departure_delay 
                            - arrival_delay 
                            - filed_ete 
                            - progress_percent 
                            - status 
                            - aircraft_type 
                            - route_distance 
                            - filed_airspeed 
                            - filed_altitude 
                            - route 
                            - baggage_claim 
                            - seats_cabin_business 
                            - seats_cabin_coach 
                            - seats_cabin_first 
                            - gate_origin 
                            - gate_destination 
                            - terminal_origin 
                            - terminal_destination 
                            - type 
                            - scheduled_out 
                            - estimated_out 
                            - actual_out 
                            - scheduled_off 
                            - estimated_off 
                            - actual_off
                            - scheduled_on 
                            - estimated_on 
                            - actual_on 
                            - scheduled_in 
                            - estimated_in 
                            - actual_in 
                        - title: ForesightPredictionsAvailable 
                          type: object 
                          properties: 
                            foresight_predictions_available: 
                              type: boolean 
                              description: Indica se as previsões do Foresight estão disponíveis para os endpoints AeroAPI /foresight. 
                              example: true 
                          required: 
                            - foresight_predictions_available 
                required: 
                  - links 
                  - num_pages 
                  - flights 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O ident pode estar ausente ou não estar no formato fa_flight_id ou max_pages pode ser < 1. A solicitação pode ser para dados anteriores à data mais antiga ou um período de resultados de mais de 7 dias foi solicitado. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Erro 
                type: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/history/flights/{id}/track': 
    obter: 
      operationId: get_history_flight_track 
      resumo: Obter informações históricas para o rastreamento de um voo 
      descrição: |
        Retorna o trajeto de um voo histórico como uma matriz de posições. 
        Os dados estão disponíveis desde agora até 2011-01-01T00:00:00Z. 
      tags: 
        - histórico 
      parâmetros: 
        - nome: id 
          em: caminho 
          descrição: O fa_flight_id a ser buscado 
          obrigatório: true 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
        - nome: include_estimated_positions 
          em: consulta 
          descrição: Se as posições estimadas devem ser incluídas no trajeto do voo 
          esquema: 
            tipo: booleano 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                propriedades: 
                  posições: 
                    tipo: matriz 
                    itens: 
                      título: FlightPosition 
                      tipo: objeto 
                      anulável: true 
                      propriedades: 
                        fa_flight_id: 
                          tipo: string 
                          anulável: true 
                          descrição: | 
                            Identificador exclusivo atribuído pelo FlightAware ao voo com esta 
                            posição. Este campo é preenchido apenas por `/flights/search/positions` 
                            (em outros casos, o usuário já terá especificado o fa_flight_id). 
                        altitude: 
                          tipo: inteiro 
                          descrição: Altitude da aeronave em centenas de pés 
                        altitude_change: 
                          tipo: string 
                          anulável: falso 
                          descrição: | 
                            C quando a aeronave está subindo, D quando está descendo e - quando a 
                            altitude está sendo mantida. 
                          enum: 
                            - C 
                            - D 
                            - '-' 
                        groundspeed: 
                          tipo: inteiro 
                          descrição: Velocidade em solo mais recente (nós)
                        título: 
                          tipo: inteiro 
                          anulável: verdadeiro 
                          descrição: Rumo da aeronave em graus (0-360) 
                          mínimo: 0 
                          máximo: 360 
                        latitude: 
                          tipo: número 
                          descrição: Posição de latitude mais recente 
                        longitude: 
                          tipo: número 
                          descrição: Posição de longitude mais recente 
                        carimbo de data/hora: 
                          tipo: string 
                          formato: data-hora 
                          descrição: Hora em que a posição foi recebida 
                          exemplo: '2021-12-31T19:59:59Z' 
                        update_type: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: | 
                            P=projetado, O=oceânico, Z=radar, A=ADS-B, M=multilateração, 
                            D=link de dados, X=superfície e próximo à superfície (ADS-B e ASDE-X), 
                            S=baseado no espaço 
                          enum: 
                            - P 
                            - O 
                            - Z 
                            - A 
                            - M 
                            - D 
                            - X 
                            - S 
                            - nulo 
                      obrigatório: 
                        - fa_flight_id 
                        - altitude 
                        - altitude_change 
                        - velocidade no solo 
                        - título 
                        - latitude 
                        - longitude 
                        - carimbo de data/hora 
                        - update_type 
        '400': 
          descrição: | 
            Parâmetro(s) incorreto(s). O parâmetro id não pode estar no formato fa_flight_id. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: sequência de caracteres 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: sequência de caracteres 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/history/flights/{id}/map': 
    obter: 
      operationId: obter_history_flight_map 
      resumo: Obter uma imagem do trajeto de um voo histórico em um mapa 
      descrição: | 
        Retorna o trajeto de um voo histórico como uma imagem codificada em base64. A imagem pode conter uma 
        variedade de camadas de dados adicionais além do trajeto. Os dados estão disponíveis a partir de agora até 
        2011-01-01T00:00:00Z. 
      tags: 
        - parâmetros de histórico 
      : 
        - nome: id 
          em: caminho 
          descrição: O fa_flight_id a ser buscado 
          obrigatório: verdadeiro 
          esquema: 
            tipo: sequência de caracteres 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
        - nome: altura 
          em: 
          descrição da consulta: Altura da imagem solicitada (pixels) 
          esquema: 
            tipo: inteiro 
            mínimo: 1 
            máximo: 1500 
            padrão: 480 
        - nome: largura 
          em: 
          descrição da consulta: Largura da imagem solicitada (pixels) 
          esquema: 
            tipo: inteiro 
            mínimo: 1 
            máximo: 1500 
            padrão: 640 
        - nome: camada_ativa 
          em: 
          descrição da consulta: Lista de camadas de mapa a serem habilitadas 
          esquema: 
            tipo: matriz itens: 
              tipo: sequência de 
            caracteres 
              enum: 
                - Cidades dos EUA 
                - limites de países europeus
                - limites dos países da Ásia 
                - principais aeroportos 
                - limites dos países 
                - limites dos estados dos EUA 
                - água - 
                principais estradas dos EUA 
                - radar 
                - rastrear 
                - voos 
                - aeroportos 
            padrão: 
              - limites dos países 
              - limites dos estados dos EUA 
              - água 
              - principais estradas dos EUA 
              - radar 
              - rastrear 
              - voos 
              - aeroportos 
        - nome: layer_off 
          in: consulta 
          descrição: Lista de camadas de mapa a serem desabilitadas 
          esquema: 
            tipo: matriz 
            itens: 
              tipo: string 
              enum: 
                - Cidades dos EUA 
                - limites dos países europeus 
                - limites dos países da Ásia 
                - principais aeroportos 
                - limites dos países 
                - limites dos estados dos EUA - 
                água 
                - principais estradas dos EUA 
                - radar 
                - rastrear 
                - voos 
                - aeroportos 
            padrão: 
              - Cidades dos EUA 
              - limites dos países europeus - 
              limites dos países da Ásia 
              - principais aeroportos 
        - nome: show_data_block 
          in: consulta 
          descrição: | 
            Se uma legenda textual contendo o ident, o tipo, o rumo, 
            a altitude, a origem e o destino deve ser exibida pela 
            posição do voo. 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - nome: airports_expand_view 
          in: consulta 
          descrição: | 
            Se deve forçar o zoom na área para garantir que os aeroportos de origem/destino estejam 
            visíveis. Habilitar este sinalizador 
            também habilita o sinalizador show_airports. 
          esquema: 
            tipo: booleano 
            padrão: falso 
        - nome: show_airports 
          em: consulta 
          descrição: | 
            Se os aeroportos de origem/destino do voo devem ser mostrados como
            pontos rotulados no mapa. 
          schema: 
            type: boolean 
            default: false 
        - name: bounding_box 
          in: query 
          description: | 
            Especifique manualmente a área de zoom do mapa usando limites personalizados. Deve 
            ser uma lista de 4 coordenadas representando os lados superior, direito, inferior e 
            esquerdo da área (nessa ordem). 
          schema: 
            type: array 
            items: 
              type: number 
            minItems: 4 
            maxItems: 4 
      responses: 
        '200': 
          description: OK 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  map: 
                    type: string 
                    format: byte 
                required: 
                  - map 
        '400': 
          description: | 
            Parâmetro incorreto (id). O id pode estar ausente ou pode não estar no formato fa_flight_id. Os cantos da caixa delimitadora podem estar definidos incorretamente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo - 
                  detalhe 
                  - status 
  '/history/flights/{id}/route': 
    obter: 
      operationId: get_history_flight_route 
      resumo: Obter rota arquivada do histórico de voos 
      descrição: |
        Retorna informações sobre a rota arquivada de um voo histórico, incluindo 
        coordenadas, nomes e tipos de correções ao longo da rota. Nem todas 
        as rotas de voo podem ser decodificadas com sucesso por este ponto de extremidade, principalmente se o 
        voo não estiver totalmente dentro do espaço aéreo continental dos EUA, já que esta função 
        só tem acesso a auxílios de navegação dentro dessa área. Se os dados de um ponto de referência estiverem 
        ausentes, o tipo será listado como "DESCONHECIDO". Os dados estão disponíveis a partir de agora até 
        2011-01-01T00:00:00Z. 
      tags: 
        - histórico 
      parâmetros: 
        - nome: id 
          in: caminho 
          descrição: O fa_flight_id a ser buscado 
          obrigatório: verdadeiro 
          esquema: 
            tipo: string 
          exemplos: 
            fa_id: 
              valor: UAL1234-1234567890-airline-0123 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              schema: 
                properties: 
                  route_distance: 
                    nullable: true 
                    type: string 
                  fixes: 
                    type: array 
                    items: 
                      title: RouteFix 
                      type: object 
                      properties: 
                        name: 
                          type: string 
                          description: Nome da correção de rota 
                        latitude: 
                          type: number 
                          nullable: true 
                          description: Longitude da correção em graus decimais 
                        longitude: 
                          type: number 
                          nullable: true 
                          description: Longitude da correção em graus decimais 
                        distance_from_origin: 
                          type: number 
                          nullable: true 
                          description: | 
                            Distância do aeroporto de origem indicada em milhas estatutárias, milhas náuticas ou 
                            quilômetros, dependendo das Opções de exibição da conta do FlightAware 
                        distance_this_leg: 
                          type: number 
                          nullable: true
                          description: | 
                            Distância do último ponto na Rota indicada em milhas estatutárias, 
                            milhas náuticas ou quilômetros, dependendo das Opções de Exibição da Conta FlightAware 
                        distance_to_destination: 
                          type: number 
                          nullable: true 
                          description: | 
                            Distância até o aeroporto de destino indicada em milhas estatutárias, milhas náuticas ou 
                            quilômetros, dependendo das Opções de Exibição da Conta FlightAware 
                        outbound_course: 
                          type: number 
                          nullable: true 
                          description: | 
                            Curso em graus inteiros do ponto atual até o próximo em relação ao norte verdadeiro 
                        type: 
                          type: string 
                          description: Tipo de correção (ou seja, Waypoint/Ponto de Relatório) 
                      necessária: 
                        - name 
                        - latitude 
                        - longitude 
                        - distance_from_origin 
                        - distance_this_leg 
                        - distance_to_destination 
                        - outbound_course 
                        - type 
                required: 
                  - route_distance 
                  - corrige 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). O parâmetro Id pode não estar no formato fa_flight_id. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status:
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/history/aircraft/{registration}/last_flight': 
    obter: 
      operationId: obter_history_aircraft_last_flight 
      resumo: Obter o último voo conhecido da aeronave 
      descrição: | 
        Retorna um resumo do status das informações do voo para o último voo conhecido de uma aeronave, 
        dado seu registro. A busca é limitada a voos realizados desde 
        1º de janeiro de 2011. Em uma resposta bem-sucedida, o corpo conterá uma 
        matriz de voos com apenas 1 elemento. Se um usuário consultar um registro com 
        seu último voo conhecido antes de 1º de janeiro de 2011, uma matriz de voos vazia será 
        retornada. 
      tags: 
        - histórico 
      parâmetros: 
        - nome: registro 
          em: caminho 
          descrição: O número de registro da aeronave a ser buscado 
          obrigatório: verdadeiro 
          esquema: 
            tipo: sequência de caracteres 
          exemplos: 
            registro: 
              valor: N199UA 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              schema: 
                properties: 
                  flights: 
                    type: array 
                    items: 
                      title: BaseFlight 
                      type: object 
                      properties: 
                        ident: 
                          type: string 
                          description: | 
                            O código do operador seguido do número do voo 
                            (para voos comerciais) ou do registro da aeronave (para 
                            aviação geral). 
                        ident_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            O código do operador ICAO seguido do número do voo (para voos comerciais) 
                        ident_iata: 
                          type: string
                          nullable: true 
                          description: | 
                            O código da operadora IATA seguido pelo número do voo (para voos comerciais) 
                        actual_runway_off: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de partida real na origem, quando conhecida 
                        actual_runway_on: 
                          type: string 
                          nullable: true 
                          description: | 
                            Pista de chegada real no destino, quando conhecida 
                        fa_flight_id: 
                          type: string 
                          description: | 
                            Identificador exclusivo atribuído pelo FlightAware para este voo específico. Se 
                            o voo for desviado, o novo trecho do voo terá um 
                            fa_flight_id duplicado. 
                        operator: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO, se houver, da operadora do voo; caso contrário, o código IATA 
                        operator_icao: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código ICAO da operadora do voo. 
                        operator_iata: 
                          type: string 
                          nullable: true 
                          description: | 
                            Código IATA da operadora do voo. 
                        flight_number: 
                          type: string 
                          nullable: true 
                          description: | 
                            Número do voo bruto. 
                        registration: 
                          type: string 
                          nullable: true 
                          description: | 
                            Registro da aeronave (número de cauda) da aeronave, quando conhecido. 
                        atc_ident: 
                          type: string 
                          nullable: true
                          description: | 
                            O ident do voo para fins de Controle de Tráfego Aéreo, quando conhecido e diferente de ident. 
                        inbound_fa_flight_id: 
                          type: string 
                          nullable: true 
                          description: | 
                            Identificador exclusivo atribuído pela FlightAware para o voo anterior da 
                            aeronave que atende este voo. 
                        codeshares: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da ICAO operando neste voo. 
                          items: 
                            type: string 
                        codeshares_iata: 
                          type: array 
                          nullable: true 
                          description: | 
                            Lista de todos os codeshares da IATA operando neste voo. 
                          items: 
                            type: string 
                        blocked: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo está bloqueado para visualização pública. 
                        diverted: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica se este voo foi desviado. 
                        cancelled: 
                          type: boolean 
                          description: | 
                            Sinalizador que indica que o voo não está mais sendo rastreado pela 
                            FlightAware. Há vários motivos pelos quais isso pode acontecer, 
                            incluindo cancelamento pela companhia aérea, mas nem sempre será esse o 
                            caso. 
                        position_only: 
                          type: boolean 
                          description: | 
                            Bandeira indicando que este voo não possui um plano de voo, horário ou outra indicação de intenção disponível. 
                        origem: 
                          descrição: | 
                            Informações sobre o aeroporto de origem deste voo. 
                          título: FlightAirportRef
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato do banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            aeroporto_info_url: 
                              tipo: string 
                              nulo: verdadeiro 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório:
                            - código 
                            - airport_info_url 
                        destino: 
                          descrição: | 
                            Informações sobre o aeroporto de destino deste voo. 
                          título: FlightAirportRef 
                          tipo: objeto 
                          nulo: verdadeiro 
                          propriedades: 
                            código: 
                              tipo: string 
                              descrição: | 
                                Código ICAO/IATA/LID ou string que indica o local onde 
                                o rastreamento do voo começou/terminou para voos somente de posição. 
                              nulo: verdadeiro 
                            código_icao: 
                              tipo: string 
                              descrição: | 
                                Código ICAO 
                              nulo: verdadeiro 
                            código_iata: 
                              tipo: string 
                              descrição: | 
                                Código IATA 
                              nulo: verdadeiro 
                            código_lid: 
                              tipo: string 
                              descrição: | 
                                Código LID 
                              nulo: verdadeiro 
                            fuso horário: 
                              tipo: string 
                              descrição: | 
                                Fuso horário aplicável para o aeroporto, no formato de banco de dados TZ 
                              nulo: verdadeiro 
                              exemplo: América/Nova_Iorque 
                            nome: 
                              tipo: string 
                              descrição: | 
                                Nome comum do aeroporto 
                              nulo: verdadeiro 
                              exemplo: LaGuardia 
                            cidade: 
                              tipo: string 
                              descrição: | 
                                Cidade mais próxima do aeroporto 
                              nulo: verdadeiro 
                              exemplo: Nova York 
                            airport_info_url:
                              tipo: string 
                              anulável: true 
                              formato: referência-uri 
                              descrição: A URL para mais informações sobre o aeroporto. Será nulo para voos somente de posição. 
                          obrigatório: 
                            - código 
                            - airport_info_url 
                        departure_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de partida (em segundos) com base no 
                            horário de partida do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de partida da pista. Um valor negativo indica que o voo está adiantado. 
                        arrival_delay: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Atraso de chegada (em segundos) com base no 
                            horário de chegada do portão real ou estimado. Se o horário do portão não estiver disponível, será baseado no 
                            horário de chegada da pista. Um valor negativo indica que o voo está adiantado. 
                        filed_ete: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            Duração do campo pista a pista (segundos). 
                        progress_percent: 
                          tipo: inteiro 
                          anulável: true 
                          descrição: | 
                            A porcentagem de conclusão de um voo, com base na partida/chegada da pista. Nulo 
                            para voos somente de posição em rota. 
                          mínimo: 0 
                          máximo: 100 
                        status: 
                          tipo: string 
                          descrição: | 
                            Resumo legível do status do voo. 
                        aircraft_type: 
                          type: string 
                          nullable: true 
                          description: | 
                            O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido 
                            quando o código ICAO não for conhecido.
                        route_distance: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Distância de voo planejada (milhas terrestres) com base na rota registrada. Pode 
                            variar da distância real percorrida. 
                        filed_airspeed: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Velocidade do ar IFR registrada (nós). 
                        filed_altitude: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Altitude IFR registrada (centenas de pés). 
                        route: 
                          type: string 
                          nullable: true 
                          description: | 
                            A descrição textual da rota do voo. 
                        baggage_claim: 
                          type: string 
                          nullable: true 
                          description: | 
                            Local de retirada de bagagem no aeroporto de destino. 
                        seats_cabin_business: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe executiva. 
                        seats_cabin_coach: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da classe econômica. 
                        seats_cabin_first: 
                          type: integer 
                          nullable: true 
                          description: | 
                            Número de assentos na cabine da primeira classe. 
                        gate_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Portão de embarque no aeroporto de origem. 
                        gate_destination: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: |
                            Portão de desembarque no aeroporto de destino. 
                        terminal_origin: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de embarque no aeroporto de origem. 
                        terminal_destination: 
                          type: string 
                          nullable: true 
                          description: | 
                            Terminal de desembarque no aeroporto de destino. 
                        type: 
                          type: string 
                          description: | 
                            Se este é um voo de aviação comercial ou geral. 
                          enum: 
                            - General_Aviation 
                            - Airline 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário de partida programado no portão. 
                          example: '2021-12-31T19:59:59Z' 
                        estimated_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário estimado de partida do portão. 
                          example: '2021-12-31T19:59:59Z' 
                        actual_out: 
                          type: string 
                          format: date-time 
                          nullable: true 
                          description: | 
                            Horário real de partida do portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: | 
                            Horário de partida da pista programado. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: verdadeiro 
                          descrição: |
                            Horário estimado de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_off: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de partida da pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário programado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_on: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada à pista. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        scheduled_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário de chegada programado no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        estimated_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário estimado de chegada no portão. 
                          exemplo: '2021-12-31T19:59:59Z' 
                        actual_in: 
                          tipo: string 
                          formato: data-hora 
                          anulável: true 
                          descrição: | 
                            Horário real de chegada no portão. 
                          exemplo: '2021-12-31T19:59:59Z'
                      obrigatório: 
                        - ident 
                        - fa_flight_id 
                        - operador 
                        - operator_iata 
                        - flight_number 
                        - registration 
                        - atc_ident 
                        - inbound_fa_flight_id 
                        - codeshares 
                        - blocked 
                        - diverted 
                        - cancelled 
                        - position_only 
                        - origin 
                        - destination 
                        - departure_delay 
                        - arrival_delay 
                        - filed_ete 
                        - progress_percent 
                        - status 
                        - aircraft_type 
                        - route_distance 
                        - filed_airspeed 
                        - filed_altitude - 
                        route 
                        - baggage_claim 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                        - gate_origin 
                        - gate_destination 
                        - terminal_origin 
                        - terminal_destination 
                        - type 
                        - scheduled_out 
                        - estimated_out - actual_out 
                        - 
                        scheduled_off - 
                        estimated_off - 
                        actual_off - 
                        scheduled_on 
                        - estimated_on 
                        - actual_on 
                        - scheduled_in 
                        - estimated_in 
                        - actual_in 
                obrigatório: 
                  - flights 
        '400': 
          description: | 
            Parâmetro incorreto. O parâmetro de registro pode estar ausente ou não estar no formato correto. 
          content: 
            application/json; charset=UTF-8: 
              esquema: 
                título: 
                Tipo de erro: 
                propriedades do objeto: 
                  título:
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                necessário: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/aircraft/{ident}/blocked': 
    parâmetros: 
      - nome: ident 
        em: caminho 
        descrição: O ident ou registro da aeronave 
        necessário: verdadeiro 
        esquema: 
          tipo: string 
        exemplos: 
          ident: 
            valor: RPA4854 
          reg: 
            valor: N123HQ 
    obter: 
      operationId: get_aircraft_blocked 
      resumo: Verificar se um determinado ident está bloqueado 
      descrição: | 
        Dada uma identificação de aeronave, retorna verdadeiro se a aeronave estiver bloqueada do 
        rastreamento público por solicitação do proprietário/operador, falso se não estiver bloqueada. 
        Quaisquer idents semelhantes a IATA serão traduzidos para ICAO antes da consulta. 
        Quando marcados como bloqueados, nenhuma informação de voo associada ficará visível no 
        AeroAPI. O FlightAware pode fornecer aos proprietários/operadores de aeronaves acesso seguro aos 
        seus dados de voo bloqueados [entrando em contato com o FlightAware para obter ajuda](https://www.flightaware.com/about/contact). 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  bloqueado: 
                    tipo: booleano 
                    descrição: Defina como verdadeiro se a aeronave ou identificação estiver bloqueada para rastreamento. 
                obrigatório: 
                  - bloqueado 
        '400': 
          descrição: |
            Parâmetro(s) incorreto(s). Ident pode estar ausente. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/aircraft/{ident}/owner': 
    parameters: 
      - name: ident 
        in: path 
        description: O ident ou registro da aeronave 
        required: true 
        schema: 
          type: string 
        examples: 
          ident: 
            value: RPA4854 
          reg: 
            value: N123HQ 
    get: 
      operationId: get_aircraft_owner 
      summary: Obter o proprietário de uma aeronave 
      description: | 
        Retorna informações sobre o proprietário de uma aeronave, dado um número de voo 
        ou registro da aeronave. Os dados retornados incluem o nome do proprietário, a localização (normalmente 
        cidade e estado) e o site, se houver. Codeshares e identificadores alternativos são 
        pesquisados ​​automaticamente. As informações específicas sobre o nome do proprietário são limitadas à propriedade 
        nos EUA (obtidas pela FAA), Austrália e Nova Zelândia. Observe que, embora 
        essas informações sejam atualizadas semanalmente, pode haver um atraso nas fontes de dados upstream, 
        refletindo uma mudança de propriedade. 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema:
                properties: 
                  owner: 
                    type: object 
                    properties: 
                      name: 
                        type: string 
                        description: Nome do proprietário registrado da aeronave 
                        nullable: true 
                      location: 
                        type: string 
                        description: 'Cidade e estado do proprietário registrado. Para Austrália, estado e país. Para Nova Zelândia, cidade e país.' 
                        nullable: true 
                      location2: 
                        type: string 
                        description: Endereço do proprietário registrado 
                        nullable: true 
                      website: 
                        type: string 
                        description: Site do proprietário, se disponível 
                        nullable: true 
        '400': 
          description: | 
            Identificação incorreta ou ausente. Deve ser um número de voo ou um número de cauda. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Erro 
                type: object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/aircraft/types/{type}': 
    parâmetros: 
      - em: 
        nome do caminho: tipo 
        descrição: | 
          O designador de tipo de aeronave ICAO para a aeronave para a qual serão obtidas informações 
        obrigatório: verdadeiro 
        esquema:
          tipo: string 
          exemplo: GALX 
    obter: 
      operationId: get_flight_type 
      resumo: Obter informações sobre um tipo de aeronave 
      descrição: | 
        Retorna informações sobre um tipo de aeronave, dada uma sequência de caracteres de designação de tipo de aeronave ICAO. 
        Os dados retornados incluem a descrição, o tipo, o fabricante, o tipo de motor e 
        a contagem de motores. 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  fabricante: 
                    tipo: string 
                    descrição: Fabricante da aeronave 
                  tipo: 
                    tipo: string 
                  descrição 
                    : Tipo de aeronave descrição: 
                    tipo: string 
                    descrição: Uma breve descrição da aeronave 
                  engine_count: 
                    tipo: inteiro 
                    nulo: verdadeiro 
                    descrição: Número de motores 
                  engine_type: 
                    tipo: string 
                    nulo: verdadeiro 
                    descrição: Tipo de motor 
        '400': 
          descrição: | 
            Parâmetros incorretos. O tipo deve ser uma sequência de caracteres de designação de tipo de aeronave ICAO. 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                título: Erro 
                tipo: objeto 
                propriedades: 
                  título: 
                    tipo: string 
                    descrição: Breve resumo do tipo de erro encontrado. 
                  motivo: 
                    tipo: string 
                    descrição: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status 
  '/schedules/{date_start}/{date_end}': 
    parâmetros: 
      - em: 
        nome do caminho: date_start 
        descrição: | 
          Data/hora ou data do primeiro voo programado de partida para retorno. Isso 
          não pode ser anterior a 3 meses no passado e não pode ser mais de 3 semanas 
          antes de date_end. A violação de qualquer uma das restrições resultará em um erro. 
          Se usar date em vez de datetime, o horário padrão será 00:00:00Z. 
        obrigatório: verdadeiro 
        esquema: 
          tipo: string 
          oneOf: 
            - formato: data-hora 
            - formato: data 
        exemplos: 
          datetime: 
            valor: '2021-12-31T19:59:59Z' 
          data: 
            valor: '2021-12-31' 
        x-fill-example: 'não' 
      - em: 
        nome do caminho: date_end 
        descrição: | 
          Data/hora ou data do último voo programado de partida para retorno. Isso 
          não pode ser posterior a 1 ano no futuro e não pode ser mais de 3 semanas após 
          date_start. A violação de qualquer restrição resultará em um erro. Se usar 
          date em vez de datetime, o horário padrão será 00:00:00Z. Portanto, 
          a data do dia seguinte deve ser especificada se um dia de dados for desejado ao 
          usar date em vez de datetime. 
        required: true 
        schema: 
          type: string 
          oneOf: 
            - format: date-time 
            - format: date 
        examples: 
          datetime: 
            value: '2021-12-31T19:59:59Z' 
          date: 
            value: '2021-12-31' 
        x-fill-example: 'no' 
      - in: query 
        name: origin 
        description: | 
          Somente voos de volta com este aeroporto de origem. Códigos de aeroporto ICAO ou IATA 
          podem ser fornecidos. 
        schema: 
          type: string 
        examples: 
          icao: 
            value: KIAH 
          iata: 
            value: IAH 
      - in: query 
        name: destination 
        description: |
          Somente voos de volta com este aeroporto de destino. Códigos de aeroporto ICAO ou IATA 
          podem ser fornecidos. 
        schema: 
          type: string 
        examples: 
          icao: 
            value: KIAH 
          iata: 
            value: IAH 
      - in: query 
        name: airline 
        description: | 
          Somente voos de volta operados por esta companhia aérea. Códigos de companhia aérea ICAO ou IATA 
          podem ser fornecidos. 
        schema: 
          type: string 
        examples: 
          icao: 
            value: UAL 
          iata: 
            value: UA 
      - in: query 
        name: flight_number 
        description: Somente voos de volta com este número de voo. 
        schema: 
          type: integer 
          format: int32 
      - in: query 
        name: include_codeshares 
        description: | 
          Sinalizador que indica se codeshares de emissão de bilhetes também devem ser retornados. 
        schema: 
          type: boolean 
          default: true 
      - in: query 
        name: include_regional 
        description: | 
          Sinalizador que indica se codeshares regionais também devem ser retornados. 
        schema: 
          type: boolean 
          default: true 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem recuperadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro 
          padrão: 1 
          mínimo: 1 
      - em: consulta 
        nome: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    get: 
      operationId: get_schedules_by_date 
      resumo: Obter voos programados 
      descrição: | 
        Retorna voos programados que foram publicados por companhias aéreas. Esses 
        horários estão disponíveis para até três meses no passado, bem como 
        para um ano no futuro. 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema:
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  programado: 
                    tipo: matriz 
                    itens: 
                      tipo: objeto 
                      descrição: | 
                        Informações para um voo programado. Todos os dados são obtidos da programação da operadora 
                        e podem não refletir as informações reais do voo (mesmo após a 
                        ocorrência do voo). 
                      propriedades: 
                        ident: 
                          tipo: string 
                          descrição: Identificação de voo 
                        ident_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: Identificação de voo no formato ICAO 
                        ident_iata: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: Identificação de voo no formato IATA 
                        actual_ident: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: 'Se ident for um voo de codeshare, este é o identificador principal usado pela operadora' 
                        actual_ident_icao: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: 'Se ident for um voo de codeshare, este é o identificador principal usado pela operadora no formato ICAO' 
                        actual_ident_iata: 
                          tipo: string 
                          anulável: verdadeiro
                          description: 'Se ident for um voo codeshare, este é o identificador principal usado pelo operador no formato IATA' 
                        aircraft_type: 
                          type: string 
                          description: 'O tipo de aeronave geralmente será o código ICAO, mas o código IATA será fornecido quando o código ICAO não for conhecido' 
                        scheduled_in: 
                          type: string 
                          format: date-time 
                          description: Horário programado de chegada no portão 
                          example: '2021-12-31T19:59:59Z' 
                        scheduled_out: 
                          type: string 
                          format: date-time 
                          description: Horário programado de partida do portão 
                          example: '2021-12-31T19:59:59Z' 
                        origin: 
                          type: string 
                          description: O código identificador do aeroporto de origem 
                        origin_icao: 
                          type: string 
                          nullable: true 
                          description: O código ICAO do aeroporto de origem 
                        origin_iata: 
                          type: string 
                          nullable: true 
                          description: O código IATA do aeroporto de origem 
                        origin_lid: 
                          type: string 
                          nullable: true 
                          description: O LID do aeroporto de origem 
                        destination: 
                          type: string 
                          description: O Código de identificação do aeroporto de destino 
                        destination_icao: 
                          type: string 
                          nullable: true 
                          description: Código ICAO do aeroporto de destino 
                        destination_iata: 
                          type: string 
                          nullable: true 
                          description: Código IATA do aeroporto de destino 
                        destination_lid: 
                          type: string 
                          nullable: true 
                          description: LID do aeroporto de destino 
                        fa_flight_id: 
                          type: string
                          nullable: true 
                          description: | 
                            ID exclusivo do FlightAware para o voo. Será nulo para voos 
                            programados para daqui a mais de alguns dias. 
                        meal_service: 
                          type: string 
                          description: Serviço de refeição oferecido no voo 
                        seats_cabin_business: 
                          type: integer 
                          description: Número de assentos na cabine da classe executiva 
                        seats_cabin_coach: 
                          type: integer 
                          description: Número de assentos na cabine da classe econômica 
                        seats_cabin_first: 
                          type: integer 
                          description: Número de assentos na cabine da primeira classe 
                      obrigatório: 
                        - ident 
                        - ident_icao 
                        - ident_iata 
                        - actual_ident 
                        - actual_ident_icao 
                        - actual_ident_iata 
                        - aircraft_type 
                        - scheduled_in 
                        - scheduled_out 
                        - origin 
                        - origin_icao 
                        - origin_iata 
                        - origin_lid 
                        - destination 
                        - destination_icao 
                        - destination_iata 
                        - destination_lid 
                        - fa_flight_id 
                        - meal_service 
                        - seats_cabin_business 
                        - seats_cabin_coach 
                        - seats_cabin_first 
                obrigatório: 
                  - links 
                  - num_pages 
                  - scheduled 
        '400': 
          description: | 
            Parâmetro(s) incorreto(s). Date_start e date_end devem estar dentro das restrições de tempo e do formato ISO 8601 (ex.: 1970-01-01T00:00:00Z). A companhia aérea e o número do voo, se presentes, devem ser válidos. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties:
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                required: 
                  - title 
                  - reason 
                  - detail 
                  - status 
  '/disruption_counts/{entity_type}': 
    parameters: 
      - in: path 
        name: entity_type 
        required: true 
        description: O tipo de entidade para obter estatísticas de interrupção. 
        schema: 
          type: string 
          enum: 
            - airline 
            - origin 
            - destination 
          example: origin 
      - in: query 
        name: time_period 
        description: '' 
        schema: 
          type: string 
          default: today 
          enum: 
            - yesterday 
            - today 
            - tomorrow - 
            plus2days 
            - twoDaysAgo 
            - minus2plus12hrs 
            - next36hrs 
            - week 
      - in: query 
        name: max_pages 
        description: Número máximo de páginas a serem buscadas. Este é um limite superior e não uma garantia de quantas páginas serão retornadas. 
        esquema: 
          tipo: inteiro 
          padrão: 1 
          mínimo: 1 
      - em: consulta 
        nome: cursor 
        descrição: | 
          Valor opaco usado para obter o próximo lote de dados de uma coleção paginada. 
        esquema: 
          tipo: string 
    get: 
      operationId: get_all_disruption_counts 
      resumo: Obter estatísticas globais de interrupção de voos 
      descrição: | 
        Retorna contagens gerais de cancelamentos/atrasos de voos no tempo especificado
        período para todas as companhias aéreas ou todos os aeroportos. 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            application/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  links: 
                    tipo: objeto 
                    anulável: verdadeiro 
                    descrição: | 
                      Objeto contendo links para recursos relacionados. 
                    propriedades: 
                      próximo: 
                        tipo: string 
                        formato: referência-URI 
                        descrição: | 
                          Um link para o próximo conjunto de registros em uma coleção. 
                    obrigatório: 
                      - próximo 
                  num_pages: 
                    descrição: Número de páginas retornadas 
                    tipo: inteiro 
                    mínimo: 1 
                  entidades: 
                    tipo: matriz 
                    descrição: | 
                      Informações de interrupção por entidade. 
                    itens: 
                      tipo: objeto 
                      propriedades: 
                        cancelamentos: 
                          tipo: inteiro 
                          mínimo: 0 
                          descrição: | 
                            O número de voos cancelados para esta companhia aérea ou aeroporto. 
                        atrasos: 
                          tipo: inteiro 
                          mínimo: 0 
                          descrição: | 
                            O número de voos atrasados ​​para esta companhia aérea ou aeroporto. 
                        total: 
                          tipo: inteiro 
                          mínimo: 0 
                          descrição: | 
                            Número total de voos originalmente programados para esta companhia aérea ou 
                            aeroporto. 
                        nome_da_entidade: 
                          tipo: string 
                          anulável: verdadeiro 
                          descrição: O nome da companhia aérea ou aeroporto. 
                        id_da_entidade: 
                          tipo: string
                          nullable: true 
                          description: Código da companhia aérea ou aeroporto. 
                      required: 
                        - cancellations 
                        - delays 
                        - total 
                        - entity_name 
                        - entity_id 
                  total_cancellations_national: 
                    type: integer 
                    minimum: 0 
                    description: Número total de voos cancelados nos EUA. 
                  total_cancellations_worldwide: 
                    type: integer 
                    minimum: 0 
                    description: Número total de voos cancelados. 
                  total_delays_worldwide: 
                    type: integer 
                    minimum: 0 
                    description: Número total de voos atrasados. 
                required: 
                  - links 
                  - num_pages 
                  - entities 
                  - total_cancellations_national 
                  - total_cancellations_worldwide 
                  - total_delays_worldwide 
        '400': 
          description: | 
            Parâmetros incorretos. Entity_type e time_period devem ser um dos valores especificados. Entity_type não pode estar vazio. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : object 
                properties: 
                  title: 
                    type: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detalhe: 
                    tipo: string 
                    descrição: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    tipo: inteiro 
                    descrição: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status
  '/disruption_counts/{entity_type}/{id}': 
    parameters: 
      - in: path 
        name: id 
        required: true 
        description: | 
          O código ICAO da companhia aérea ou o ID do aeroporto (ICAO, IATA ou LID) 
          para o qual você está buscando estatísticas de interrupção. Para o ID do aeroporto, 
          [ICAO é altamente preferível](/aeroapi/portal/resources#icaoCode) para evitar ambiguidade. 
        schema: 
          type: string 
        examples: 
          ICAO: 
            value: KHOU 
          IATA: 
            value: HOU 
      - in: path 
        name: entity_type 
        required: true 
        description: O tipo de entidade para a qual as estatísticas de interrupção serão obtidas. 
        esquema: 
          tipo: string 
          enum: 
            - companhia aérea 
            - origem 
            - destino 
          exemplo: origem 
      - em: consulta 
        nome: período_de_tempo 
        descrição: '' 
        esquema: 
          tipo: string 
          padrão: hoje 
          enum: 
            - ontem 
            - hoje 
            - amanhã 
            - mais2dias 
            - doisDiasAtrás 
            - menos2mais12horas - 
            próximas36horas 
            - semana 
    obter: 
      operationId: obter_contagens_de_interrupção 
      resumo: Obter estatísticas de interrupção de voo para uma entidade específica 
      descrição: | 
        Retorna contagens de cancelamentos/atrasos de voo no período de tempo especificado 
        para uma companhia aérea ou aeroporto específico. 
      tags: 
        - diversos 
      respostas: 
        '200': 
          descrição: OK 
          conteúdo: 
            aplicativo/json; charset=UTF-8: 
              esquema: 
                tipo: objeto 
                propriedades: 
                  cancelamentos: 
                    tipo: inteiro 
                    mínimo: 0 
                    descrição: | 
                      O número de voos cancelados para esta companhia aérea ou aeroporto. 
                  atrasos: 
                    tipo: inteiro 
                    mínimo: 0 
                    descrição: | 
                      O número de voos atrasados ​​para esta companhia aérea ou aeroporto.
                  total: 
                    type: integer 
                    minimum: 0 
                    description: | 
                      Número total de voos originalmente programados para esta companhia aérea ou 
                      aeroporto. 
                  entity_name: 
                    type: string 
                    nullable: true 
                    description: O nome da companhia aérea ou aeroporto. 
                  entity_id: 
                    type: string 
                    nullable: true 
                    description: Código da companhia aérea ou aeroporto. 
                required: 
                  - cancellations 
                  - delays 
                  - total 
                  - entity_name 
                  - entity_id 
        '400': 
          description: | 
            Parâmetros incorretos. Entity_type e time_period devem ser um dos valores especificados. Entity_type não pode estar vazio. id deve ser um código de operador ou aeroporto válido. 
          content: 
            application/json; charset=UTF-8: 
              schema: 
                title: Tipo de erro 
                : objeto 
                properties: 
                  title: 
                    tipo: string 
                    description: Breve resumo do tipo de erro encontrado. 
                  reason: 
                    type: string 
                    description: Nome do tipo de erro diretamente do backend. 
                  detail: 
                    type: string 
                    description: | 
                      Descrição mais detalhada do erro, possivelmente incluindo informações 
                      sobre campos inválidos específicos ou etapas de correção. 
                  status: 
                    type: integer 
                    description: O código de resposta HTTP retornado como parte do erro. 
                obrigatório: 
                  - título 
                  - motivo 
                  - detalhe 
                  - status