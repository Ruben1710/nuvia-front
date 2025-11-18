# Миграция на Backend API

## Что было сделано

### 1. API слой (`shared/api/`)
- **axios.ts** - Axios instance с автоматическим добавлением JWT токена и обработкой 401 ошибок
- **products.ts** - API функции для работы с товарами:
  - `getProducts()` - получить все товары
  - `getProduct(id)` - получить товар по ID
  - `getProductsByCategory(slug)` - получить товары по категории (фильтрация на фронте)
- **categories.ts** - API функции для работы с категориями:
  - `getCategories()` - получить все категории
  - `getCategory(id)` - получить категорию по ID

### 2. Zustand Stores (`shared/store/`)
- **cartStore.ts** - Управление корзиной:
  - `items` - массив товаров в корзине
  - `add()` - добавить товар
  - `remove()` - удалить товар
  - `increase()` - увеличить количество
  - `decrease()` - уменьшить количество
  - `clear()` - очистить корзину
  - `useCartTotalPrice()` - селектор для общей стоимости
  - Persist в localStorage

- **productsStore.ts** - Управление товарами:
  - `products` - массив товаров
  - `loading` - состояние загрузки
  - `error` - ошибка
  - `fetchProducts()` - загрузить все товары
  - `fetchProduct(id)` - загрузить товар по ID
  - `getProductById(id)` - получить товар из кэша

- **categoriesStore.ts** - Управление категориями:
  - `categories` - массив категорий
  - `loading` - состояние загрузки
  - `error` - ошибка
  - `fetchCategories()` - загрузить все категории
  - `getCategoryBySlug(slug)` - получить категорию по slug

- **uiStore.ts** - UI состояние:
  - `language` - текущий язык (ru/en/arm)
  - `setLanguage()` - установить язык
  - `theme` - тема (для будущего использования)
  - Persist в localStorage

### 3. Обновленные компоненты
- **products-page.tsx** - использует `useProductsStore` вместо `products.json`
- **product-detail-page.tsx** - использует `useProductsStore` и `useCartStore`
- **hero-slider.tsx** - использует `useProductsStore` вместо `products.json`
- **cart-context.tsx** - обертка над `cartStore` для обратной совместимости

### 4. Удалено
- `shared/data/products.json` - удален, все данные теперь из API

## Настройка

1. Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

2. Убедитесь, что backend запущен на порту 3000

## Использование

### Загрузка товаров
```typescript
import { useProductsStore } from '@/shared/store/productsStore';

const { products, loading, error, fetchProducts } = useProductsStore();

useEffect(() => {
  if (products.length === 0) {
    fetchProducts();
  }
}, []);
```

### Работа с корзиной
```typescript
import { useCartStore } from '@/shared/store/cartStore';

const { items, add, remove, increase, decrease } = useCartStore();
const totalPrice = useCartTotalPrice();
```

### Обратная совместимость
Старый `useCart()` hook из `cart-context` все еще работает и использует `cartStore` внутри.

## Структура данных

Backend возвращает данные в формате:
```typescript
{
  id: number;
  categoryId: number;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  // ...
}
```

API слой автоматически преобразует их в формат фронтенда:
```typescript
{
  id: number;
  category: string;
  name: { en, ru, arm };
  // ...
}
```

## Примечания

- Все запросы автоматически включают JWT токен из localStorage (если есть)
- При 401 ошибке выводится предупреждение в консоль
- Данные кэшируются в Zustand stores
- Корзина сохраняется в localStorage через persist middleware

