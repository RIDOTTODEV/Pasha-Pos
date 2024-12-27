import {useOrderStore} from "stores/order-store";
import {useTerminalStore} from "stores/terminal-store";
import {storeToRefs} from "pinia";
import {computed, defineAsyncComponent, inject, onMounted, ref, watch} from "vue";
import {useQuasar,date} from "quasar";
import {useRouter} from "vue-router";
import {i18n} from "boot/i18n";


export function useCatalog() {

  const router = useRouter()
  const bus = inject('bus')
  const $q = useQuasar()
  const terminalStore = useTerminalStore()
  const {getTerminal, terminalMenu} = storeToRefs(terminalStore)
  const {getOrderTables, getOrderSections, getSectionTables,waiters} = storeToRefs(terminalStore)

  const orderStore = useOrderStore()
  const {selectedSection, selectedTable, getSelectedTable} = storeToRefs(orderStore)
  const {onSelectSection, onSelectTable} = orderStore
  const selectedSectionTables = computed(() => {
    if (searchTableByName.value){
      let tableName = searchTableByName.value
      return terminalStore.searchTableByName(tableName)
    }
    return selectedSection.value?.id ? [...getSectionTables.value(selectedSection.value?.id)] : []
  })

  const searchTableByName = ref('')
  const orderPlayer = ref(null)
  const order = ref({
    terminalId: getTerminal.value('id'),
    terminalName: getTerminal.value('name'),
    playerId: 0,
    tableId: getSelectedTable.value('id'),
    tableName: getSelectedTable.value('name'),
    isClosed: false,
    waiterId: 0,
    waiterName: '',
    note: '',
    externalId: 0,
    orderSource: 0,
    playerClass: null,
    products: [],
    orderedByFullName: '',
  })
  const categories = ref([])
  const categoryHistory = ref([])
  const products = ref([])
  const fetchFavoriteProduct = ref(false)
  const searchProductInput = ref('')
  const selectedOrderItem = ref({
    index: -1,
    product: null,
  })
  const orderProcess = ref('product') // product, productDetail, chooseWaiter
  const selectedWaiter = ref(null)
  const selectedAlphabet = ref('')
  const filteredWaiters = computed(() => {
    // filter waiters by name first charter waiter.name.toLowerCase().includes(selectedAlphabet.value.toLowerCase())

    return waiters.value.filter(waiter => {
      if (selectedAlphabet.value === '') {
        return waiter
      }
      return waiter.name.toLowerCase().startsWith(selectedAlphabet.value)
    })
  })
  const turkishAlphabet =  'abcçdefgğhıijklmnoöprsştuüvyzw'.split('').filter(item => {
    if (waiters.value.find(waiter => waiter.name.toLowerCase().startsWith(item))) {
      return item
    }
  })
  const playerPhotoUrl = computed(() => {
    return getTerminal.value('assistApiUrl') + '/Member/GetPhotoAsJpeg?id='+orderPlayer.value?.externalPlayerId || null
  })
  onMounted(async () => {
    initializeMenu()
    await setPlayerDetail()

    bus.on('searchTable',(tableName) => {
      searchTableByName.value = tableName
    })
  })

  const initializeMenu = () => {
    if (terminalMenu.value.length === 1) {
      categoryHistory.value.push(terminalMenu.value[0])
      if (terminalMenu.value[0].categories.length === 1) {
        categoryHistory.value.push(terminalMenu.value[0].categories[0])
        categories.value = terminalMenu.value[0].categories[0].categories?.sort((a, b) => a.categoryName.localeCompare(b.categoryName)) || terminalMenu.value[0].categories[0].subCategories?.sort((a, b) => a.categoryName.localeCompare(b.categoryName)) || []
        products.value = terminalMenu.value[0].categories[0].products?.sort((a, b) => a.productName.localeCompare(b.productName)) || []
      } else {
        categories.value = terminalMenu.value[0].categories?.sort((a, b) => a.categoryName.localeCompare(b.categoryName)) || []
      }
    } else {
      categories.value = terminalMenu.value?.sort((a, b) => a.menuName.localeCompare(b.menuName)) || []
    }
  }
  const onClickCategory = (category) => {
    categoryHistory.value.push(category)
    categories.value = category.categories?.sort((a, b) => a.categoryName.localeCompare(b.categoryName)) || category.subCategories?.sort((a, b) => a.categoryName.localeCompare(b.categoryName)) || []
    products.value = category.products?.sort((a, b) => a.productName.localeCompare(b.productName)) || []
    fetchFavoriteProduct.value = false
  }
  const onClickBack = () => {
    if (categoryHistory.value.length > 0) {
      categoryHistory.value.pop()
      const category = categoryHistory.value[categoryHistory.value.length - 1]
      categories.value = category ? category.categories || category.subCategories || [] : terminalMenu.value
      products.value = category ? category.products || [] : []
    }
  }
  const onClickFavorite = async () => {
    fetchFavoriteProduct.value = !fetchFavoriteProduct.value
    if (fetchFavoriteProduct.value) {
      await filterProducts()
    } else {
      products.value = categoryHistory.value.length > 0 ? categoryHistory.value[categoryHistory.value.length - 1]?.products : []
    }
  }
  const onClickProduct = (product) => {
    if (!productPortionAndExtra(product, 'add')) {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId:categoryHistory.value[0]?.menuId || null,
        ...getDefaultPortionAndExtras(product)
      })
    }
  }
  const getDefaultPortionAndExtras = (product) => {
    const portionSet = terminalStore.getPortionSet(product.portionSetId)
    const extraSet = terminalStore.getExtraSet(product.extraSetId)

    const portionSetDefault = portionSet?.portions.find(portion => portion.id === portionSet.defaultPortionId)
    const extraSetDefault = extraSet?.extras.filter(extra => extra.defaultExtra).map(extra => extra.id)
    return {
      portion: portionSetDefault?.name || null,
      extras: extraSetDefault?.name || null
    }

  }
  const addProductToOrder = (product) => {
    const existingProduct = checkProductExist(product)
    if (existingProduct) {
      existingProduct.quantity++
    } else {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId:categoryHistory.value[0]?.menuId || null
      })
    }

  }
  const checkProductExist = (product) => {
    return order.value.products.find(
      p => p.id === product.id
        && p.productName === product.productName
        && p.portionSetId === product.portionSetId
        && p.extraSetId === product.extraSetId
        && p?.portion === product?.portion
        && p?.extra === product?.extra
        && p?.note === product?.note
    ) || null
  }
  const filterProducts = async () => {
    const menuId = categoryHistory.value[0]?.menuId || null // [0] is the root category
    const categoryId = categoryHistory.value[categoryHistory.value.length - 1]?.categoryId || null // [length - 1] is the current category
    const payload = {
      menuId: menuId,
      categoryId: categoryId,
      search: searchProductInput.value,
      favorite: fetchFavoriteProduct.value,
    }
    //   if (searchProductInput.value.length > 0 && menuId) {
    if (menuId) {
      await orderStore.searchProducts(payload).then(res => {
        products.value = res.data || []
      })
    } else {
      products.value = categoryHistory.value.length > 0 ? categoryHistory.value[categoryHistory.value.length - 1]?.products : []
    }
  }
  const onSelectOrderItem = (product, index) => {
    selectedOrderItem.value = {
      index: index,
      product: {...product},
    }
    orderProcess.value = 'productDetail'
  }
  const onClickAddNoteSelectedOrderItem = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("/src/pages/components/NoteDialog.vue")),
      componentProps: {
        existNote: order.value.products[selectedOrderItem.value.index].note,
        kioskBoardInputType: 'textarea'
      }
    }).onOk((payload) => {
      selectedOrderItem.value.product.note = payload.note
      order.value.products[selectedOrderItem.value.index] = selectedOrderItem.value.product
    })
  }
  const productPortionAndExtra = (product, action = 'add',showExist= false) => {
    const portionSet = terminalStore.getPortionSet(product.portionSetId)
    const extraSet = terminalStore.getExtraSet(product.extraSetId)

    if (showExist) {
      $q.dialog({
        component: defineAsyncComponent(() => import("/src/pages/components/ExtraPortionDialog.vue")),
        componentProps: {
          portions: portionSet.portions || [],
          product: {
            ...product,
            extras: product.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        }
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
      return
    }
    if (portionSet && !portionSet.defaultPortionId) {
      $q.dialog({
        component: defineAsyncComponent(() => import("/src/pages/components/ExtraPortionDialog.vue")),
        componentProps: {
          portions: portionSet.portions || [],
          product: {
            ...product,
            extras: product.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        }
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
    }

    return portionSet && !portionSet.defaultPortionId
  }
  const onClickAddOrderNote = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("/src/pages/components/NoteDialog.vue")),
      componentProps: {
        existNote: order.value.note,
        kioskBoardInputType: 'textarea'
      }
    }).onOk((payload) => {
      order.value.note = payload.note
    })
  }
  const onClickCopyProduct = (product) => {
    const existingProduct = checkProductExist(product)
    if (existingProduct) {
      existingProduct.quantity += product.quantity
    } else {
      order.value.products.push({
        ...product,
        quantity: 1,
      })
    }
  }
  const onSelectAlphabet = (alphabet) => {
    if (alphabet === selectedAlphabet.value) {
      selectedAlphabet.value = ''
      return
    } else{
      selectedAlphabet.value = alphabet
    }

  }
  const onSelectWaiter = async (waiter) => {
    selectedWaiter.value = waiter
    order.value.waiterId = waiter.id
    order.value.waiterName = waiter.name
    order.value.orderedByFullName = waiter?.name + waiter?.surname || null
    await completedOrder()
  }
  const completedOrder = async () => {
    await terminalStore.createOrder({...order.value})
  }
  const setPlayerDetail = async () => {
    if (order.value.tableId){
      const player = await terminalStore.getPlayerByTableNo(order.value.tableId).then(res => res.result) || null
      order.value.playerId = player.playerId || null
      order.value.externalId = player?.externalPlayerId || null
      order.value.playerClass = player?.class || null
      order.value.playerFullName = player?.name + player?.surname || null
      order.value.playerName = player?.name + player?.surname || null
      orderPlayer.value = player

      if (player.externalPlayerId && player.externalPlayerId > 0) {
        let d = date.subtractFromDate(new Date(), {days: getTerminal.value('playerLastOrderDay') || 10})
        let params = {
          startDate:date.formatDate(d, 'YYYY-MM-DDTHH:mm:ss'),
          endDate: null,
          ExternalId: player.externalPlayerId,
          Take: getTerminal.value('playersLastOrderCount') || 5,
          Skip: 0,
          QueryType: 'byTime'
        }
        const playerOrders = await orderStore.getPlayerOrders(params).then(res => res.data) || null
        orderPlayer.value.orders= playerOrders.data
      }
    }
  }
  const increaseProduct = (productIndex) => {
    order.value.products[productIndex].quantity++
  }
  const decreaseProduct = (productIndex) => {
    if (order.value.products[productIndex].quantity > 1) {
      order.value.products[productIndex].quantity--
    } else {
      order.value.products.splice(productIndex, 1)
      if (selectedOrderItem.value.index === productIndex) {
        selectedOrderItem.value = {
          index: -1,
          product: null,
        }
      }
      orderProcess.value = 'product'
    }
  }
  watch(selectedSection, async () => {
    searchTableByName.value = ''
  })
  const onClickCancel = async () => {
    selectedTable.value = null
    await router.push({name: 'table'})
  }

  const onClickNext = () => {
    orderProcess.value = 'chooseWaiter'
    if (orderProcess.value === 'chooseWaiter' && selectedWaiter.value === null) {
      $q.notify({
        message:i18n.global.t('base.pleaseSelectAWaiter'),
        type:'warning',
        position:'center',
        timeout:1000
      })
    }

  }

  const onClickSearchPlayer = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("/src/pages/components/SearchPlayerDialog.vue")),
      componentProps:{
        searchFn: terminalStore.searchPlayer,
      }
    }).onOk(async (player) => {

      let splitName = player.fullName.split(' ')
      let playerFormatted = {
        playerId:player.id,
        externalId:player.assistId,
        playerClass:null,
        name:splitName[0],
        surname:splitName[1],
        playerFullName:player.fullName,
      }

      order.value.playerId = player.id || null
      order.value.externalId = player?.assistId || null
      order.value.playerClass = null
      order.value.playerFullName = player.fullName  || null
      order.value.playerName =  player.fullName || null
      orderPlayer.value = playerFormatted
      orderPlayer.value.newPlayer = true

      if (player.assistId && player.assistId > 0) {
        let d = date.subtractFromDate(new Date(), {days: getTerminal.value('playerLastOrderDay') || 10})
        let params = {
          startDate:date.formatDate(d, 'YYYY-MM-DDTHH:mm:ss'),
          endDate: null,
          ExternalId: player.assistId,
          Take: getTerminal.value('playersLastOrderCount') || 5,
          Skip: 0,
          QueryType: 'byTime'
        }
        const playerOrders = await orderStore.getPlayerOrders(params).then(res => res.data) || null
        orderPlayer.value.orders= playerOrders.data
      }

    })
  }
  return {
    terminalStore,
    orderStore,
    getOrderTables,
    getOrderSections,
    getSectionTables,
    $q,
    onSelectSection,
    selectedSection,
    onSelectTable,
    selectedSectionTables,
    selectedTable,
    order,
    categories,
    categoryHistory,
    products,
    fetchFavoriteProduct,
    searchProductInput,
    selectedOrderItem,
    orderProcess,
    turkishAlphabet,
    waiters,
    selectedAlphabet,
    orderPlayer,
    playerPhotoUrl,
    filteredWaiters,
    onClickCategory,
    onClickBack,
    onClickFavorite,
    onClickProduct,
    filterProducts,
    onSelectOrderItem,
    onClickAddNoteSelectedOrderItem,
    productPortionAndExtra,
    onClickAddOrderNote,
    onClickCopyProduct,
    onSelectAlphabet,
    onSelectWaiter,
    increaseProduct,
    decreaseProduct,
    onClickCancel,
    onClickNext,
    onClickSearchPlayer
  }
}
