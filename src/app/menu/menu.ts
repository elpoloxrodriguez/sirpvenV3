import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard/home',
    nombre: 'Principal',
    icono: 'home',
    // role: [1, 2],
    type: 'item',
    url: 'home',
  },
    // PAGOS DEL SISTEMA 
    {
      id: 'philately-admin',
      nombre: 'Pagos Soporte',
      title: 'Pagos Soporte',
      role: [3,6],
      type: 'collapsible',
      icono: 'dollar-sign',
      children: [
        {
          id: 'report-payment',
          nombre: 'Lista Pagos',
          type: 'item',
          icono: 'circle',
          url: 'license/report-payment'
        },
      ]
    },


  // AUDITORIA
  {
    id: 'audit',
    nombre: 'Auditoria',
    role: [3, 4],
    icono: 'database',
    type: 'item',
    url: 'audit/audit',
  },

  // RELACION DE PAGOS
  {
    id: 'paymet-relations',
    nombre: 'Relacion Pagos',
    role: [3, 4, 6],
    icono: 'credit-card',
    type: 'item',
    url: 'paymet-relations/paymet',
  },
  // OPERADORES POSTALES PRIVADOS Y SUBCONTRATISTAS
  {
    id: 'list-opp',
    nombre: 'OPP-SUB',
    icono: 'list',
    type: 'item',
    role: [3, 6],
    url: 'management/private-postal-operator',
  },
  // PAGO OBLIGACIONES ADMIN
  {
    id: 'payments-obligation',
    nombre: 'Pagos Obligaciones',
    icono: 'credit-card',
    type: 'item',
    role: [3, 6],
    url: 'payments-obligations/obligations',
  },

  // MODULO OPERADOR POSTAL Y SUBCONTRATISTAS

  // Empresa
  {
    id: 'EmpresaOPP',
    nombre: 'Operador Postal Privado',
    role: [1],
    icono: 'layout',
    type: 'item',
    url: 'business/opp',
  },
  {
    id: 'EmpresaOPP',
    nombre: 'Subcontratista',
    role: [2],
    icono: 'layout',
    type: 'item',
    url: 'business/opp',
  },
  // Franqueo Postal
  {
    id: 'FanqueoPostal',
    nombre: 'Franqueo Postal',
    title: 'Franqueo Postal',
    role: [1],
    type: 'collapsible',
    icono: 'file-text',
    children: [
      {
        id: 'TablaPrecios',
        nombre: 'Tabla de Tarifas',
        type: 'item',
        icono: 'circle',
        url: 'postage/price-table'
      },
      {
        id: 'MovementOfParts',
        nombre: 'Declaración de Piezas',
        type: 'item',
        icono: 'circle',
        url: 'postage/postage-per-month'
      }
    ]
  },

// Pagos
  {
    id: 'PagosPostales',
    nombre: 'Pagos',
    title: 'Pagos',
    role: [1],
    type: 'collapsible',
    icono: 'credit-card',
    children: [
      {
        id: 'PagoFPO',
        nombre: 'Franqueo Postal',
        type: 'item',
        icono: 'circle',
        url: 'payments/payments-list'
      },
      {
        id: 'PagosMmtto',
        nombre: 'Mantenimiento',
        type: 'item',
        icono: 'circle',
        url: 'payments/maintenance'
      },
      {
        id: 'PagosObligaciones',
        nombre: 'Obligaciones',
        type: 'item',
        icono: 'circle',
        url: 'payments/obligations'
      }
    ]
  },

  // SUCURSALES SUBCONTRATISTAS
  {
    id: 'Agencias',
    nombre: 'Agencias',
    role: [2],
    icono: 'users',
    type: 'item',
    url: 'subcontractor/branch-offices',
  },
  // Pagos Postal
  {
    id: 'PagosPostales',
    nombre: 'Pagos',
    role: [2],
    icono: 'credit-card',
    type: 'item',
    url: 'payments/payments-list',
  },

  // Reportes
  {
    id: 'reports',
    nombre: 'Ranking',
    role: [1],
    icono: 'trending-up',
    type: 'item',
    url: 'opp-reports/reports-ranking',
  },


  // MENU ADMINISTRACION

  {
    id: 'register-opp-sub',
    nombre: 'Registrar OPP - SUB',
    title: 'Registrar OPP - SUB',
    role: [3,6],
    type: 'collapsible',
    icono: 'edit',
    children: [
      {
        id: 'register-opp',
        nombre: 'Registrar Opp',
        type: 'item',
        icono: 'circle',
        url: 'register-opp'
      },
      {
        id: 'register-sub',
        nombre: 'Registrar Subcontratista',
        type: 'item',
        icono: 'circle',
        url: 'register-sub'
      },
    ]
  },

  {
    id: 'TablaPrecios',
    nombre: 'Franqueo Postal',
    icono: 'file-text',
    type: 'item',
    url: 'postage/price-table-opp',
    role: [3, 6],
  },
  // Multas y Sanciones
  {
    id: 'finesandpenalties',
    nombre: 'Multas F.P.O',
    icono: 'trending-down',
    type: 'item',
    url: 'fines-and-penalties/fines-penalties',
    role: [3, 6],
  },
  //  REPORTES
  {
    id: 'reports',
    nombre: 'Reportes',
    icono: 'bar-chart-2',
    type: 'item',
    role: [3, 6],
    url: 'admin-reports/admin-reports',
  },
  //  RECAUDACION
  {
    id: 'takings',
    nombre: 'Recaudacion',
    icono: 'credit-card',
    type: 'item',
    role: [3, 6],
    url: 'takings/list-payments',
  },
  //  ARCHIVO DIGITAL POSTAL
  {
    id: 'digital-file-opp',
    nombre: 'Archivo Digital P',
    icono: 'folder-plus',
    type: 'item',
    role: [3, 4, 5, 6],
    url: 'digital-file-opp/private-postal-operator',
  },
  //  ACTUALIZACION DE SISTEMA
  {
    id: 'update-system',
    nombre: 'Actualizar SIRPV',
    icono: 'refresh-ccw',
    type: 'item',
    role: [3, 4],
    url: 'update-system/system-pull',
  },
  // Soporte
  {
    id: 'config',
    nombre: 'Configuración',
    title: 'Configuración',
    type: 'collapsible',
    icono: 'tool',
    // hidden: true,
    role: [3, 4],
    children: [
      {
        id: 'systemHors',
        nombre: 'Estatus Sistema',
        type: 'item',
        icono: 'circle',
        url: 'settings/connection-settings'
      },
      // {
      //   id: 'permisosusuarios',
      //   nombre: 'Permisos de Usuarios',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/permissions-user'
      // },
      // {
      //   id: 'gestiontablas',
      //   nombre: 'Gestion Tablas',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/table-management'
      // },
      // {
      //   id: 'cambiarcontraseña',
      //   nombre: 'Cambiar Contraseña',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/change-password'
      // },
      {
        id: 'users-system',
        nombre: 'Usuarios',
        type: 'item',
        icono: 'circle',
        url: 'settings/system-users'
      },
    ]
  },

  // Asistente Virtual
  {
    id: 'asistente-virtual',
    nombre: 'Asistente Virtual',
    role: [3, 4],
    icono: 'cpu',
    type: 'item',
    url: 'virtual-assistant',
  },
];
