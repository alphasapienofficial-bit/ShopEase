# ShopEase — Capstone E-commerce App

React 19 + TypeScript + Vite + Tailwind CSS v4 (Google Sans). Register, log in, browse products, manage a cart and check out.

## Run it

```bash
npm install
npm run msw:init      # creates public/mockServiceWorker.js (once)
npm run dev           # http://localhost:5173  (MSW mocks every /api call)
npm test              # Jest + React Testing Library + MSW
```

Demo account: demo@shop.com / password123

## Where each concept lives

| Concept                         | File(s)                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| Tailwind CSS v4 (dark: variant) | styles/global.css, utility classes in every component       |
| Formik + Yup forms              | features/auth/LoginPage, RegisterPage, checkout/CheckoutPage   |
| Formik useField custom input    | components/FormField                                           |
| Axios instance                  | api/apiClient                                                  |
| Interceptors + Bearer token     | api/interceptors                                               |
| TanStack Query (queries)        | features/products/useProducts                                  |
| TanStack Query (mutations)      | features/auth/useAuthMutations                                 |
| Query key factory               | api/queryKeys                                                  |
| Redux Toolkit store             | app/store, app/hooks                                           |
| createSlice / prepare / Immer   | features/cart/cartSlice, features/auth/authSlice               |
| createEntityAdapter             | features/cart/cartAdapter                                      |
| createSelector                  | features/cart/cartSelectors                                    |
| createAsyncThunk + extraReducers| features/checkout/orderThunks, ordersSlice                     |
| Listener middleware             | app/listeners                                                  |
| React Router (nested, lazy, 404)| app/routes, components/Layout                                  |
| Route params / search params    | ProductDetailsPage / ProductsPage                              |
| Protected route (HOC)           | hoc/withAuth                                                   |
| Lazy + Suspense + ErrorBoundary | hoc/withSuspense, components/ErrorBoundary                     |
| Portals                         | components/Modal, context/ToastContext                         |
| Compound component              | components/Modal (Modal.Header / Body / Footer)                |
| Render props                    | components/QueryBoundary                                       |
| Provider pattern                | app/AppProviders, context/*                                    |
| Container / presentational      | ProductsPage → ProductGrid → ProductCard                       |
| useContext (dark / light theme) | context/ThemeContext                                           |
| useMemo / useCallback / memo    | ProductsPage, ProductCard, CartPage                            |
| useReducer + useRef             | context/ToastContext                                           |
| useTransition / useDeferredValue| features/products/ProductsPage                                 |
| useImperativeHandle + useId     | features/products/SearchBar, components/FormField              |
| useLayoutEffect                 | hooks/useLockBodyScroll                                        |
| useSyncExternalStore / useDebugValue | hooks/useOnlineStatus                                     |
| useActionState (React 19)       | features/home/Newsletter                                       |
| Custom hooks                    | hooks/*, features/*/use*.ts                                    |
| MSW mocks                       | mocks/handlers, browser, server                                |
| Unit tests                      | __tests__/*, test/test-utils                                   |
