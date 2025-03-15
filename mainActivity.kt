class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(FileHandler(this), "AndroidFileHandler")
        webView.loadUrl("file:///android_asset/index.html")
    }

    class FileHandler(private val context: Context) {
        @JavascriptInterface
        fun guardarArchivo(nombreArchivo: String, contenido: String) {
            val file = File(context.filesDir, nombreArchivo)
            file.writeText(contenido)
            println("Archivo guardado en: ${file.absolutePath}")
        }
    }
}
