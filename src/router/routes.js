const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      /********** product definitions **********/
      { path: '', name:'home', component: () => import('pages/IndexPage.vue'), meta:{groupName:'index',requiredPermission:'Pos.DashBoard.ShowList'}, },
      { path: 'table', name:'table', component: () => import('pages/TablePage.vue'), meta:{groupName:'index',requiredPermission:'Pos.Table.ShowList'}, },
      { path: 'settings', name:'settings', component: () => import('pages/SettingsPage.vue'), meta:{groupName:'index',requiredPermission:'Pos.Settings.ShowList'}, },
      { path: 'table/:id', name:'tableDetail', component: () => import('pages/CatalogPage.vue'), meta:{groupName:'index',requiredPermission:'Pos.TableDetail.ShowList'}, },
      {path: 'orders', name:'orders', component: () => import('pages/OrdersPage.vue'), meta:{groupName:'index',requiredPermission:'Pos.Orders.ShowList'}, },
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', name:'login', component: () => import('pages/LoginPage.vue'), meta:{groupName:'auth',requiredPermission:'Pos.Login.ShowList'}, },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
