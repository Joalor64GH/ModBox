class FileHandler(private val context: Context) {
    @JavascriptInterface
    fun guardarArchivo(nombreArchivo: String, contenido: String) {
        val file = File(context.filesDir, nombreArchivo)
        file.writeText(contenido)
        println("Archivo guardado en: ${file.absolutePath}")
    }
}
