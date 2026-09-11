package com.ejemplo.holamundo.printer

import com.ejemplo.holamundo.model.FacturaVentaData
import java.text.NumberFormat
import java.util.Locale

class EscPosInvoiceFormatter {

    fun buildInvoiceBytes(data: FacturaVentaData): ByteArray {
        val bytes = mutableListOf<Byte>()
        val currencyFormat = NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }

        // 1. Inicializar e instrucciones de codificación
        bytes.addAll(byteArrayOf(0x1B, 0x40).toList()) // ESC @ (Reset)
        
        // 2. Encabezado Factura
        bytes.addAll(byteArrayOf(0x1B, 0x61, 0x02).toList()) // Derecha
        bytes.addAll("${data.numeroFactura}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("ORIGINAL\n\n".toByteArray(Charsets.ISO_8859_1).toList())

        bytes.addAll(byteArrayOf(0x1B, 0x61, 0x01).toList()) // Centro
        bytes.addAll(byteArrayOf(0x1D, 0x21, 0x11).toList()) // Texto Doble Alto/Ancho
        bytes.addAll("${data.nombreComercial}\n".toByteArray(Charsets.ISO_8859_1).toList())
        
        bytes.addAll(byteArrayOf(0x1D, 0x21, 0x00).toList()) // Texto Normal
        bytes.addAll(byteArrayOf(0x1B, 0x45, 0x01).toList()) // Negrita ON
        bytes.addAll("FACTURA ELECTRÓNICA\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll(byteArrayOf(0x1B, 0x45, 0x00).toList()) // Negrita OFF
        bytes.addAll("Identificador: ${data.consecutivo}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("Cajero: ${data.cajero}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("${data.fechaHora}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("Sala-Mesa: ${data.mesa}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("================================\n".toByteArray(Charsets.ISO_8859_1).toList())

        // 3. Datos de Cliente
        bytes.addAll(byteArrayOf(0x1B, 0x61, 0x00).toList()) // Izquierda
        bytes.addAll("${data.clienteNombre.uppercase()}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("CC: ${data.clienteId}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())

        // 4. Tabla de Ítems
        bytes.addAll("DESCRIPCIÓN\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll(" | CAN REF UM %IM | VALOR\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())

        for (item in data.items) {
            bytes.addAll("${item.descripcion}\n".toByteArray(Charsets.ISO_8859_1).toList())
            val cantidadStr = " | ${item.cantidad.toInt()}   uds  8"
            val totalFormatted = currencyFormat.format(item.totalLinea)
            
            // Justificado de línea (32 columnas)
            val line = alignTwoColumns(cantidadStr, totalFormatted, 32)
            bytes.addAll("$line\n".toByteArray(Charsets.ISO_8859_1).toList())
        }

        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())

        // 5. Totales
        val totalArticulosStr = "${data.totalArticulos} Artículos"
        val totalMontoStr = "TOTAL ${currencyFormat.format(data.total)}"
        
        bytes.addAll(byteArrayOf(0x1B, 0x45, 0x01).toList()) // Negrita ON
        bytes.addAll("${alignTwoColumns(totalArticulosStr, totalMontoStr, 32)}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll(byteArrayOf(0x1B, 0x45, 0x00).toList()) // Negrita OFF
        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())

        // 6. Pago y Desglose de Impuestos
        bytes.addAll("${alignTwoColumns(data.metodoPago, "Entregado", 32)}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("${alignTwoColumns("", currencyFormat.format(data.entregado), 32)}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())
        
        bytes.addAll("Impuestos incluidos\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("${alignTwoColumns(" | Base", " | Impuesto", 32)}\n".toByteArray(Charsets.ISO_8859_1).toList())
        
        val baseStr = "IMPOCONSUMO 8%  ${currencyFormat.format(data.baseImpoconsumo)}"
        val impStr = currencyFormat.format(data.impoconsumo)
        bytes.addAll("${alignTwoColumns(baseStr, impStr, 32)}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("--------------------------------\n".toByteArray(Charsets.ISO_8859_1).toList())

        // 7. Pie de Página DIAN (Centrado)
        bytes.addAll(byteArrayOf(0x1B, 0x61, 0x01).toList()) // Centro
        bytes.addAll("Resolución DIAN ${data.resolucionNumero}\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("RANGO (Desde ${data.rangoDesde} Hasta ${data.rangoHasta})\n".toByteArray(Charsets.ISO_8859_1).toList())
        bytes.addAll("Autorizado\n\n\n\n".toByteArray(Charsets.ISO_8859_1).toList())

        // Corte de papel parcial/total
        bytes.addAll(byteArrayOf(0x1D, 0x56, 0x41, 0x00).toList())

        return bytes.toByteArray()
    }

    private fun alignTwoColumns(left: String, right: String, width: Int): String {
        val totalLength = left.length + right.length
        if (totalLength >= width) {
            return "$left $right"
        }
        val spaces = " ".repeat(width - totalLength)
        return "$left$spaces$right"
    }
}