use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum EngineError {
    #[error("Decoding failed: {0}")]
    DecodeError(String),
    #[error("Encoding failed: {0}")]
    EncodeError(String),
    #[error("Invalid parameters: {0}")]
    InvalidParameters(String),
    #[error("Operation cancelled")]
    Cancelled,
    #[error("IO Error: {0}")]
    Io(String),
}

#[derive(Clone, Default)]
pub struct CancelToken {
    cancelled: Arc<AtomicBool>,
}

impl CancelToken {
    pub fn new() -> Self {
        Self {
            cancelled: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn cancel(&self) {
        self.cancelled.store(true, Ordering::SeqCst);
    }

    pub fn is_cancelled(&self) -> bool {
        self.cancelled.load(Ordering::SeqCst)
    }

    pub fn check(&self) -> Result<(), EngineError> {
        if self.is_cancelled() {
            Err(EngineError::Cancelled)
        } else {
            Ok(())
        }
    }
}

pub trait ProgressSink: Send + Sync {
    fn on_progress(&self, fraction: f32, message: &str);
}

#[derive(Clone, Debug)]
pub struct RgbaBuffer {
    pub width: u32,
    pub height: u32,
    pub data: Vec<u8>,
}

impl RgbaBuffer {
    pub fn new(width: u32, height: u32) -> Self {
        let size = (width as usize) * (height as usize) * 4;
        Self {
            width,
            height,
            data: vec![0u8; size],
        }
    }

    pub fn from_vec(width: u32, height: u32, data: Vec<u8>) -> Result<Self, EngineError> {
        let expected = (width as usize) * (height as usize) * 4;
        if data.len() != expected {
            return Err(EngineError::InvalidParameters(format!(
                "Buffer size mismatch: expected {expected}, got {}",
                data.len()
            )));
        }
        Ok(Self { width, height, data })
    }
}

#[derive(Clone, Debug)]
pub struct EngineCapabilities {
    pub formats_read: Vec<String>,
    pub formats_write: Vec<String>,
    pub filters: Vec<String>,
    pub simd_enabled: bool,
    pub threads: usize,
}
