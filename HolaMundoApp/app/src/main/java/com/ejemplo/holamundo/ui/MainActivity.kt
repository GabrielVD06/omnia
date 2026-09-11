package com.ejemplo.holamundo
package com.ejemplo.holamundo.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ejemplo.holamundo.model.FacturaXmlParser
import com.ejemplo.holamundo.printer.EscPosInvoiceFormatter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.ejemplo.holamundo.printer.PosPrinterTestDriver

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    PrinterTestScreen()
                }
            }
        }
    }
}

@Composable
fun PrinterTestScreen() {
    var macAddress by remember { mutableStateOf("10:22:33:05:C0:18") }
    var isPrinting by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf("Listo para enviar prueba") }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Prueba de Impresión Bluetooth",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = macAddress,
            onValueChange = { macAddress = it },
            label = { Text("Dirección MAC de Impresora") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (macAddress.isBlank()) return@Button
                isPrinting = true
                statusMessage = "Conectando e imprimiendo factura XML..."
                
                scope.launch(Dispatchers.IO) {
                    try {
                        val xmlData = """
                            <FacturaVenta xmlns="urn:restaurant:sales-receipt:v1" version="1.0">
                                <Emisor>
                                    <NombreComercial>Mi Restaurante</NombreComercial>
                                    <RazonSocial>Mi Restaurante principal</RazonSocial>
                                    <Regimen>Regimen Simplificado</Regimen>
                                    <NIT>80000000-1</NIT>
                                    <RepresentanteLegal>Juan Perez</RepresentanteLegal>
                                    <Direccion>Calle 1 No 2 - 3</Direccion>
                                    <Ciudad>Pasto</Ciudad>
                                    <Pais>Colombia</Pais>
                                    <CodigoPostal>5200001</CodigoPostal>
                                    <Telefono>3001233456</Telefono>
                                </Emisor>
                                <ResolucionDIAN>
                                    <Numero>123456</Numero>
                                    <RangoDesde>1</RangoDesde>
                                    <RangoHasta>2000</RangoHasta>
                                </ResolucionDIAN>
                                <Factura>
                                    <ConsecutivoDIAN>1963</ConsecutivoDIAN>
                                    <NumeroFactura>ABC1963</NumeroFactura>
                                    <NumeroCuenta>BILL-20260911-0001</NumeroCuenta>
                                    <FechaHora>2026-09-11T20:21:35.9868618+00:00</FechaHora>
                                    <Mesas>M-13</Mesas>
                                    <Pedidos>T-20260911-2527</Pedidos>
                                </Factura>
                                <Cliente>
                                    <Nombre>Consumidor final</Nombre>
                                    <Identificacion>2222222</Identificacion>
                                </Cliente>
                                <Cajero>Iván Villota</Cajero>
                                <Items>
                                    <Item>
                                        <Descripcion>Combo Hamburguresa y Cerveza</Descripcion>
                                        <Categoria>Promoción</Categoria>
                                        <Cantidad>3.0000</Cantidad>
                                        <PrecioUnitario>20000.00</PrecioUnitario>
                                        <TotalLinea>60000.00</TotalLinea>
                                        <Impoconsumo>4444.44</Impoconsumo>
                                    </Item>
                                </Items>
                                <Pagos>
                                    <Pago>
                                        <Metodo>EFECTIVO</Metodo>
                                        <Monto>60000.00</Monto>
                                    </Pago>
                                </Pagos>
                                <Totales>
                                    <Articulos>3</Articulos>
                                    <Subtotal>60000.00</Subtotal>
                                    <Descuento>0</Descuento>
                                    <BaseImpoconsumo>55555.56</BaseImpoconsumo>
                                    <ImpoconsumoPorcentaje>8.00</ImpoconsumoPorcentaje>
                                    <Impoconsumo>4444.44</Impoconsumo>
                                    <Propina>0</Propina>
                                    <Total>60000.00</Total>
                                    <Entregado>60000.00</Entregado>
                                    <Cambio>0</Cambio>
                                    <Moneda>COP</Moneda>
                                </Totales>
                            </FacturaVenta>
                        """.trimIndent()

                        val parsedInvoice = FacturaXmlParser.parse(xmlData)
                        val formatter = EscPosInvoiceFormatter()
                        val payload = formatter.buildInvoiceBytes(parsedInvoice)

                        val driver = PosPrinterTestDriver(macAddress.trim())
                        val result = driver.printRawBytes(payload)

                        withContext(Dispatchers.Main) {
                            isPrinting = false
                            statusMessage = if (result.isSuccess) {
                                "¡Factura impresa correctamente!"
                            } else {
                                "Error: ${result.exceptionOrNull()?.message ?: "Fallo al imprimir"}"
                            }
                        }
                    } catch (e: Exception) {
                        withContext(Dispatchers.Main) {
                            isPrinting = false
                            statusMessage = "Error al procesar XML: ${e.localizedMessage}"
                        }
                    }
                }
            },
            enabled = !isPrinting,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            if (isPrinting) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("IMPRIMIR FACTURA XML")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = statusMessage,
            color = if (statusMessage.contains("Error")) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.secondary,
            fontSize = 14.sp
        )
    }
}