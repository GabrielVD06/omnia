package com.ejemplo.holamundo.model

import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory
import java.io.StringReader

data class ItemFactura(
    val descripcion: String,
    val cantidad: Double,
    val precioUnitario: Double,
    val totalLinea: Double,
    val impoconsumoPorcentaje: Double = 8.0
)

data class FacturaVentaData(
    val nombreComercial: String = "",
    val numeroFactura: String = "",
    val consecutivo: String = "",
    val fechaHora: String = "",
    val mesa: String = "",
    val cajero: String = "",
    val clienteNombre: String = "",
    val clienteId: String = "",
    val items: List<ItemFactura> = emptyList(),
    val totalArticulos: Int = 0,
    val total: Double = 0.0,
    val metodoPago: String = "",
    val entregado: Double = 0.0,
    val baseImpoconsumo: Double = 0.0,
    val impoconsumo: Double = 0.0,
    val resolucionNumero: String = "",
    val rangoDesde: String = "",
    val rangoHasta: String = ""
)

object FacturaXmlParser {
    fun parse(xmlString: String): FacturaVentaData {
        val factory = XmlPullParserFactory.newInstance()
        val parser = factory.newPullParser()
        parser.setInput(StringReader(xmlString))

        var eventType = parser.eventType
        var currentTag = ""
        
        // Variables acumuladoras
        var nombreComercial = ""
        var numeroFactura = ""
        var consecutivo = ""
        var fechaHora = ""
        var mesa = ""
        var cajero = ""
        var clienteNombre = ""
        var clienteId = ""
        var resolucionNumero = ""
        var rangoDesde = ""
        var rangoHasta = ""
        var total = 0.0
        var entregado = 0.0
        var totalArticulos = 0
        var baseImpoconsumo = 0.0
        var impoconsumo = 0.0
        var metodoPago = ""
        
        val items = mutableListOf<ItemFactura>()

        // Variables temporales para <Item>
        var itemDesc = ""
        var itemCant = 0.0
        var itemPrecio = 0.0
        var itemTotal = 0.0

        while (eventType != XmlPullParser.END_DOCUMENT) {
            when (eventType) {
                XmlPullParser.START_TAG -> currentTag = parser.name
                XmlPullParser.TEXT -> {
                    val text = parser.text.trim()
                    if (text.isNotEmpty()) {
                        when (currentTag) {
                            "NombreComercial" -> if (nombreComercial.isEmpty()) nombreComercial = text
                            "NumeroFactura" -> numeroFactura = text
                            "ConsecutivoDIAN" -> consecutivo = text
                            "FechaHora" -> fechaHora = text
                            "Mesas" -> mesa = text
                            "Cajero" -> cajero = text
                            "Nombre" -> if (clienteNombre.isEmpty()) clienteNombre = text
                            "Identificacion" -> clienteId = text
                            "Numero" -> resolucionNumero = text
                            "RangoDesde" -> rangoDesde = text
                            "RangoHasta" -> rangoHasta = text
                            "Descripcion" -> itemDesc = text
                            "Cantidad" -> itemCant = text.toDoubleOrNull() ?: 0.0
                            "PrecioUnitario" -> itemPrecio = text.toDoubleOrNull() ?: 0.0
                            "TotalLinea" -> itemTotal = text.toDoubleOrNull() ?: 0.0
                            "Articulos" -> totalArticulos = text.toIntOrNull() ?: 0
                            "Total" -> total = text.toDoubleOrNull() ?: 0.0
                            "Metodo" -> metodoPago = text
                            "Entregado" -> entregado = text.toDoubleOrNull() ?: 0.0
                            "BaseImpoconsumo" -> baseImpoconsumo = text.toDoubleOrNull() ?: 0.0
                            "Impoconsumo" -> impoconsumo = text.toDoubleOrNull() ?: 0.0
                        }
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (parser.name == "Item") {
                        items.add(ItemFactura(itemDesc, itemCant, itemPrecio, itemTotal))
                        itemDesc = ""
                        itemCant = 0.0
                        itemPrecio = 0.0
                        itemTotal = 0.0
                    }
                    currentTag = ""
                }
            }
            eventType = parser.next()
        }

        return FacturaVentaData(
            nombreComercial = nombreComercial,
            numeroFactura = numeroFactura,
            consecutivo = consecutivo,
            fechaHora = fechaHora,
            mesa = mesa,
            cajero = cajero,
            clienteNombre = clienteNombre,
            clienteId = clienteId,
            items = items,
            totalArticulos = totalArticulos,
            total = total,
            metodoPago = metodoPago,
            entregado = entregado,
            baseImpoconsumo = baseImpoconsumo,
            impoconsumo = impoconsumo,
            resolucionNumero = resolucionNumero,
            rangoDesde = rangoDesde,
            rangoHasta = rangoHasta
        )
    }
}