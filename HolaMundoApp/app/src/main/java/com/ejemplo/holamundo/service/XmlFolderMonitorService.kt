package com.ejemplo.holamundo.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.documentfile.provider.DocumentFile
import com.ejemplo.holamundo.model.FacturaXmlParser
import com.ejemplo.holamundo.printer.EscPosInvoiceFormatter
import com.ejemplo.holamundo.printer.PosPrinterTestDriver
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock


class XmlFolderMonitorService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val printMutex = Mutex()
    private var isRunning = false

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val folderUriString = intent?.getStringExtra("FOLDER_URI")
        val macAddress = intent?.getStringExtra("MAC_ADDRESS")

        if (folderUriString != null && macAddress != null) {
            startForegroundServiceNotification()
            startMonitoring(Uri.parse(folderUriString), macAddress)
        }

        return START_STICKY
    }

    private fun startMonitoring(folderUri: Uri, macAddress: String) {
        if (isRunning) return
        isRunning = true

        serviceScope.launch {
            val driver = PosPrinterTestDriver(macAddress)
            val formatter = EscPosInvoiceFormatter()

            while (isActive && isRunning) {
                printMutex.withLock {
                    processFolder(folderUri, driver, formatter)
                }
                delay(3000)
            }
        }
    }

    private suspend fun processFolder(
        folderUri: Uri,
        driver: PosPrinterTestDriver,
        formatter: EscPosInvoiceFormatter
    ) {
        val directory = DocumentFile.fromTreeUri(applicationContext, folderUri) ?: return
        val files = directory.listFiles()

        val xmlFiles = files.filter { it.isFile && it.name?.endsWith(".xml", ignoreCase = true) == true }

        for (file in xmlFiles) {
            try {
                val xmlContent = applicationContext.contentResolver.openInputStream(file.uri)?.use { inputStream ->
                    inputStream.bufferedReader().use { it.readText() }
                } ?: continue

                val invoice = FacturaXmlParser.parse(xmlContent)
                val payload = formatter.buildInvoiceBytes(invoice)

                val result = driver.printRawBytes(payload)

                if (result.isSuccess) {
                    file.delete()
                } else {
                    break
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun startForegroundServiceNotification() {
        val channelId = "xml_printer_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Servidor de Impresión POS",
                NotificationManager.IMPORTANCE_LOW
            )
            getSystemService(NotificationManager::class.java)?.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Impresora POS Activa")
            .setContentText("Monitoreando carpeta local y procesando XMLs...")
            .setSmallIcon(android.R.drawable.ic_menu_upload)
            .build()

        startForeground(1, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}