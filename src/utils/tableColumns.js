import {i18n} from "boot/i18n";
import {date, format} from "quasar";
import {camelCaseToSentence} from "src/utils/helpers";

const tableColumns = [
  {
    name: 'orderHistories',
    columns: [
      {
        name: 'id',
        align: 'center',
        label: 'ID',
        locale: 'base.id',
        field: 'id',
        required: true,
        sortable: true,
      },
      {
        name: 'terminalName',
        align: 'center',
        sortable: true,
        locale: 'order.terminalName',
        field: 'terminalName',
      },
      {
        name: 'tableName',
        align: 'center',
        sortable: true,
        locale: 'order.tablePlayer',
        field: 'tableName',
      },
      {
        name: 'orderedByFullName',
        align: 'center',
        sortable: true,
        locale: 'order.orderedBy',
        field: 'orderedByFullName',
      },
      {
        name: 'createdAt',
        align: 'center',
        sortable: true,
        locale: 'base.createdAt',
        field: 'createdAt',
        format: (val) => date.formatDate(val, 'HH:mm:ss')
      },
      {
        name: 'products',
        align: 'center',
        locale: 'order.productAndPortion',
        field: 'products',
      },
      // {
      //   name: 'action',
      //   align: 'center',
      //   locale: 'base.actions',
      //   field: 'id',
      // },

    ]
  },

]
export const getTableColumns = (name) => {
  const columns = tableColumns.find(item => item.name === name).columns
  columns.map(item => {
    item.label = i18n.global.t(item.locale)
  });
  return columns
}
export const makeVirtualColumns = (columns) => {
  return columns.map((column) => {
    return {
      name: column,
      required: false,
      locale: column,
      label: camelCaseToSentence(column),
      align: 'center',
      field: column,
      sortable: false,
      visible: true
    }
  })
}
