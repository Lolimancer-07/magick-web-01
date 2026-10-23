package com.magickstudio.app.core.engine

object NativeBridge {
    private var isLoaded = false

    init {
        try {
            System.loadLibrary("studio_ffi")
            isLoaded = true
        } catch (_: UnsatisfiedLinkError) {
            isLoaded = false
        } catch (_: Exception) {
            isLoaded = false
        }
    }

    fun isNativeEngineAvailable(): Boolean = isLoaded

    fun getCapabilitiesMask(): Int {
        return if (isLoaded) {
            try {
                nativeProbeCapabilities()
            } catch (_: Exception) {
                0
            }
        } else {
            0
        }
    }

    private external fun nativeProbeCapabilities(): Int
}
