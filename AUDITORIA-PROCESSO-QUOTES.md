# Auditoria Completa do Processo de Quotes

## Resumo Executivo

Esta auditoria foi realizada para investigar o uso do valor 'economy' como `vehicle_category_id` e compreender todo o fluxo de criação de orçamentos no sistema.

## Principais Achados

### 1. Uso do Valor 'Economy'

**Conclusão**: O valor 'economy' foi criado especificamente para permitir a personalização de preços de veículos quando as categorias padrão não se aplicam.

- **Localização**: Encontrado apenas no arquivo `backend/debug-quotes-insert.sql` como exemplo
- **Propósito**: Categoria personalizada para casos especiais de precificação
- **Status**: Não existe como categoria válida no banco de dados

### 2. Sistema de Categorias de Veículos

#### Categorias Predefinidas (lib/zone-pricing-type.ts)
```typescript
export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    capacity: 3,
    base_price: 130,
    description: 'Toyota Camry ou similar'
  },
  {
    id: 'suv', 
    name: 'SUV',
    capacity: 6,
    base_price: 160,
    description: 'Chevrolet Suburban ou similar'
  },
  {
    id: 'van',
    name: 'Van', 
    capacity: 7,
    base_price: 150,
    description: 'Chrysler Pacifica ou similar'
  }
];
```

#### Estrutura da Tabela vehicle_categories
- `id` (text) - Chave primária
- `name` (text) - Nome da categoria
- `description` (text) - Descrição
- `base_price` (integer) - Preço base em centavos
- `capacity` (integer) - Capacidade de passageiros
- `features` (jsonb) - Características do veículo
- `is_active` (boolean) - Status ativo
- `created_at`, `updated_at` (timestamp)

### 3. Fluxo de Criação de Orçamentos

#### Arquivos Principais
- **Frontend**: `app/admin/quotes/new/page.tsx`
- **Hook**: `hooks/useQuotes.ts`
- **Banco**: `backend/create-quotes-table.sql`
- **Tipos**: `lib/supabase.ts`

#### Processo de Criação

1. **Inicialização do Formulário**
   ```typescript
   const [formData, setFormData] = useState({
     vehicle_category_id: 'sedan', // Categoria padrão
     base_price: 0, // Preço personalizado
     // ... outros campos
   });
   ```

2. **Cálculo de Preços**
   - **Localizações na cobertura**: Usa preços da tabela `zone_pricing`
   - **Localizações fora de cobertura**: Permite preço personalizado via `base_price`
   - **Serviços por hora**: Cálculo baseado em duração (1-2h = $100/h, 3+h = $80/h)

3. **Validação e Salvamento**
   ```typescript
   // Validação de campos obrigatórios
   if (!formData.vehicle_category_id) {
     setErrors(prev => ({ ...prev, vehicle_category_id: 'Categoria é obrigatória' }));
     return;
   }
   
   // Salvamento via createQuote
   const result = await createQuote({
     vehicle_category_id: formData.vehicle_category_id,
     base_price: formData.base_price,
     // ... outros dados
   });
   ```

### 4. Sistema de Preços Personalizados

#### Quando é Usado
- **Endereços fora de cobertura**: Sistema detecta automaticamente
- **Casos especiais**: Admin pode ajustar manualmente
- **Serviços customizados**: Preços que não seguem tabela padrão

#### Como Funciona
1. **Detecção de zona**: Sistema verifica se endereços estão na área de cobertura
2. **Fallback para preço personalizado**: Se fora de cobertura, permite ajuste manual
3. **Persistência**: Valor personalizado é mantido no campo `base_price` da tabela `quotes`

#### Código Relevante (app/admin/quotes/new/page.tsx)
```typescript
// Cálculo condicional de preço
if (hasOutOfCoverage && formData.base_price > 0) {
  // Usa preço personalizado para localizações fora de cobertura
  basePrice = formData.base_price;
} else if (formData.quote_type === 'hourly') {
  // Cálculo por hora
  const hourlyRate = formData.service_hours <= 2 ? 100 : 80;
  basePrice = hourlyRate * formData.service_hours;
} else {
  // Usa preços da tabela zone_pricing
  basePrice = getRouteBasePrice(/* parâmetros */) || vehicleCategory?.base_price || 130;
}
```

### 5. Estrutura da Tabela Quotes

#### Campos Relacionados a Preços
- `vehicle_category_id` (text NOT NULL) - FK para vehicle_categories
- `base_price` (numeric NOT NULL) - **Preço base personalizado**
- `extras_price` (numeric) - Preço dos extras
- `total_amount` (numeric NOT NULL) - Valor total

#### Políticas RLS
- Admins: Acesso total (SELECT, INSERT, UPDATE, DELETE)
- Público: Apenas leitura (SELECT)

### 6. Problemas Identificados e Soluções

#### Problema Original
- **Erro**: Violação de chave estrangeira com `vehicle_category_id='economy'`
- **Causa**: Categoria 'economy' não existe na tabela `vehicle_categories`
- **Solução**: Usar categorias válidas ('sedan', 'suv', 'van') + campo `base_price` para personalização

#### Arquivos de Correção
- `backend/fix-vehicle-categories-foreign-key.sql` - Corrige relacionamento FK
- `backend/fix-quotes-rls-final.sql` - Corrige políticas RLS
- `SOLUCAO-ERRO-400-QUOTES.md` - Documentação da solução

### 7. Recomendações

#### Para Preços Personalizados
1. **Sempre usar categoria válida**: Escolher entre 'sedan', 'suv', 'van'
2. **Personalizar via base_price**: Ajustar o campo `base_price` para casos especiais
3. **Documentar casos especiais**: Usar campo `notes` para explicar preços customizados

#### Para Desenvolvimento
1. **Validação no frontend**: Garantir que apenas categorias válidas sejam selecionadas
2. **Fallback gracioso**: Sistema deve lidar bem com categorias inexistentes
3. **Logs de auditoria**: Registrar quando preços personalizados são usados

#### Exemplo de Uso Correto
```typescript
// ✅ CORRETO: Usar categoria válida + preço personalizado
const quoteData = {
  vehicle_category_id: 'sedan', // Categoria válida
  base_price: 200, // Preço personalizado
  notes: 'Preço especial para cliente VIP'
};

// ❌ INCORRETO: Usar categoria inexistente
const quoteData = {
  vehicle_category_id: 'economy', // Categoria não existe
  base_price: 150
};
```

## Conclusão

O sistema de quotes está funcionando corretamente com o mecanismo de preços personalizados através do campo `base_price`. O valor 'economy' foi apenas um exemplo usado em scripts de debug e não deve ser utilizado em produção. Para casos que requerem preços personalizados, deve-se usar uma das categorias válidas ('sedan', 'suv', 'van') combinada com o ajuste do campo `base_price`.

## Arquivos Auditados

### Frontend
- `app/admin/quotes/new/page.tsx` - Formulário de criação
- `app/admin/quotes/page.tsx` - Listagem e estatísticas
- `app/quote/[id]/ClientQuotePage.tsx` - Visualização do cliente

### Backend/Hooks
- `hooks/useQuotes.ts` - Lógica de criação e busca
- `hooks/useVehicleCategories.ts` - Busca de categorias
- `hooks/useZonePricing.ts` - Cálculo de preços por zona

### Banco de Dados
- `backend/create-quotes-table.sql` - Estrutura da tabela
- `backend/fix-quotes-rls-final.sql` - Políticas RLS
- `backend/fix-vehicle-categories-foreign-key.sql` - Chaves estrangeiras

### Configuração
- `lib/zone-pricing-type.ts` - Definições de tipos e categorias
- `lib/zone-pricing.ts` - Lógica de precificação
- `lib/supabase.ts` - Tipos do banco de dados

### Documentação
- `SOLUCAO-ERRO-400-QUOTES.md` - Solução do erro 400
- `backend/docs/Esquema_de_banco_de_dados.md` - Esquema completo
- `CORRECAO-ERRO-RELACIONAMENTO.md` - Correção de FK

---

**Data da Auditoria**: Janeiro 2025  
**Status**: Concluída  
**Próximas Ações**: Implementar validações adicionais no frontend para prevenir uso de categorias inválidas