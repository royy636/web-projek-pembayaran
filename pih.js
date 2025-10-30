let port;
let writer;

async function connectArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();
    logMessage("✅ Arduino terhubung.");
  } catch (error) {
    logMessage("❌ Gagal menghubungkan Arduino: " + error);
  }
}

async function disconnectArduino() {
  if (port) {
    await port.close();
    port = null;
    logMessage("🔌 Koneksi terputus.");
  }
}

async function sendPayment() {
  if (!writer) {
    logMessage("⚠️ Arduino belum terhubung.");
    return;
  }

  const amount = document.getElementById("amount").value;
  const method = document.getElementById("method").value;

  const data = `PAY:${amount}:${method}\n`;
  const encoder = new TextEncoder();
  await writer.write(encoder.encode(data));
  logMessage(`💳 Pembayaran dikirim ke Arduino → ${data}`);
}

function logMessage(msg) {
  const log = document.getElementById("log");
  log.textContent += msg + "\n";
  log.scrollTop = log.scrollHeight;
}

document.getElementById("connectBtn").addEventListener("click", connectArduino);
document.getElementById("disconnectBtn").addEventListener("click", disconnectArduino);
document.getElementById("payBtn").addEventListener("click", sendPayment);
