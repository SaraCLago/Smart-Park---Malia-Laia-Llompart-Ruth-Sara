const SerialPort = require('serialport'); // Requiere el paquete SerialPort
const Readline = require('@serialport/parser-readline');

// Configura el puerto serial (asegúrate de cambiar el puerto a tu puerto específico)
const port = new SerialPort('/dev/ttyUSB0', { // Cambia a tu puerto de Arduino
  baudRate: 9600
});

// Usamos el parser para leer líneas completas
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

// Escuchar los datos del Arduino
parser.on('data', function(data) {
  console.log('Datos recibidos desde Arduino:', data);
  // Aquí puedes agregar la lógica para manejar los datos recibidos
});

// Configurar error
port.on('error', function(err) {
  console.log('Error en puerto serial:', err.message);
});