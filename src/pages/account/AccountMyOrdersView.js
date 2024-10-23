import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { GridLayout } from '../../components/Utilities/common'
import { getOrder } from '../../services/orders.service'
import { useParams } from 'react-router-dom'
import OrderDetails from './OrderDetails'
import { myAccountMyOrders } from '../../services/service.config'
import { BackButton } from '../../components/Utilities/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ACCESS_TOKEN } from 'constants/localstorage'

const downloadOrder = (order, myInvoiceUrl, myInvoiceFormat) => {
  const invoiceUrl = myInvoiceUrl
  const invoiceFormat = myInvoiceFormat
  const token_old = localStorage.getItem(ACCESS_TOKEN)
  const token = 'BfCX6Sx5aakAGRjCIu8ip4UFOrqi'
  axios({
    url: invoiceUrl,
    headers: {
      Authorization: 'Bearer ' + token,
    },
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    const href = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', order.id + '.' + invoiceFormat)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  })
}

const MyOrdersView = () => {
  const [order, setOrder] = useState({})
  const { orderId } = useParams()

  const fetchedOrder = useCallback(async () => {
    const fetchedOrder = await getOrder(orderId)
    setOrder(fetchedOrder)
  }, [orderId])

  useEffect(() => {
    fetchedOrder()
  }, [])

  return (
    <GridLayout className="mt-9 gap-12">
      <div className="pb-6 border-b border-bgWhite">
        <div className="lg:block hidden">
        <strong>ERP EXPORTS</strong>
        <div className="font-inter font-semibold text-[14px] underline">
          {true && (
            <div className="font-inter font-semibold text-[14px] underline ml-6">
              {order?.mixins?.OrderExport?.OrderJSONExport && (
                <a onClick={() => downloadOrder(order, order?.mixins?.OrderExport?.OrderJSONExport, 'json')} className="download-invoice-link" >Download JSON</a>
              )}
            </div>
          )}
          {true && (
            <div className="font-inter font-semibold text-[14px] underline ml-6">
              {order?.mixins?.OrderExport?.OrderCSVExport && (
                <a onClick={() => downloadOrder(order, order?.mixins?.OrderExport?.OrderCSVExport, 'csv')} className="download-invoice-link" >Download CSV</a>
              )}
            </div>
          )}
          {true && (
            <div className="font-inter font-semibold text-[14px] underline ml-6">
              {order?.mixins?.OrderExport?.OrderEDIFACTExport && (
                <a onClick={() => downloadOrder(order, order?.mixins?.OrderExport?.OrderEDIFACTExport, 'xml')} className="download-invoice-link" >Download EDI</a>
              )}
            </div>
          )}
          {true && (
            <div className="font-inter font-semibold text-[14px] underline ml-6">
              {order?.mixins?.OrderExport?.OrderXMLExport && (
                <a onClick={() => downloadOrder(order, order?.mixins?.OrderExport?.OrderXMLExport, 'xml')} className="download-invoice-link" >Download XML</a>
              )}
            </div>
          )}
          {true && (
            <div className="font-inter font-semibold text-[14px] underline ml-6">
              {order?.mixins?.OrderExport?.OrdercXMLExport && (
                <a onClick={() => downloadOrder(order, order?.mixins?.OrderExport?.OrdercXMLExport, 'cXML')} className="download-invoice-link" >Download cXML</a>
              )}
            </div>
          )}
        </div>  
          <OrderDetails order={order} />
        </div>
      </div>
    </GridLayout>
  )
}

const AccountMyOrdersView = () => {
  const { orderId } = useParams()

  return (
    <AccountLayout page="View" detail={orderId}>
      <BackButton link={myAccountMyOrders()} title={'Back to orders list'} />
      <MyOrdersView />
    </AccountLayout>
  )
}
export default AccountMyOrdersView
