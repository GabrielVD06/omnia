package com.ejemplo.holamundo.printer

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothSocket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.io.IOException
import java.util.UUID

class PosPrinterTestDriver(private val macAddress: String) {

    private val SPP_UUID: UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")

    @SuppressLint("MissingPermission")
    suspend fun printRawBytes(bytes: ByteArray): Result<Unit> = withContext(Dispatchers.IO) {
        var socket: BluetoothSocket? = null
        try {
            val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
                ?: return@withContext Result.failure(Exception("El dispositivo no soporta Bluetooth"))

            val cleanMac = macAddress.replace("-", ":").trim().uppercase()
            val device = bluetoothAdapter.getRemoteDevice(cleanMac)

            bluetoothAdapter.cancelDiscovery()

            socket = device.createRfcommSocketToServiceRecord(SPP_UUID)
            socket.connect()

            val outputStream = socket.outputStream
            outputStream.write(bytes)
            outputStream.flush()

            delay(500)

            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        } finally {
            try {
                socket?.close()
            } catch (_: IOException) {}
        }
    }
}