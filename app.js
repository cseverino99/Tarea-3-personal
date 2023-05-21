const express = require("express");
const app = express();
const port = process.env.PORT || 3001;


const { Pool } = require('pg');

const pool = new Pool({
  host: 'langosta.ing.puc.cl',
  port: 5432,
  user: 'cseverinr@uc.cl',
  password: '19637918',
  database: 'cseverinr@uc.cl'
});

async function almacenarEvento(evento) {
  try {
    const query = 'INSERT INTO eventos (tipo_operacion, monto, cuenta_origen, banco_origen, cuenta_destino, banco_destino, id_mensaje) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [evento.tipoOperacion, 
      evento.monto, evento.cuentaOrigen, evento.bancoOrigen, 
      evento.cuentaDestino, evento.bancoDestino, evento.idMensaje];

    const client = await pool.connect();
    await client.query(query, values);
    client.release();

    console.log('Evento almacenado correctamente en la base de datos');
  } catch (error) {
    console.error('Error al almacenar el evento en la base de datos:', error);
  }
}
app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(express.json());


app.post('/messages', (req, res) => {
  const message = req.body.message;
  const sub = req.body.subscription;

  console.log(message);
  console.log(sub);

  const mensajeCodificado = Buffer.from(message.data, 'base64').toString('utf-8');
  console.log(mensajeCodificado);

  const tipoOperacion = parseInt(mensajeCodificado.substring(0, 4));
  console.log(tipoOperacion);
  let fondos = "";
  //quiero hacer un if para ver si esque tipoOperacion es 2200 o 2400
  if (tipoOperacion === 2200) {
    //ahora cambia el valor de tipoOperacion a "Envio de fondos"
    fondos = "Envio de fondos"
  } else if (tipoOperacion === 2400) {
    fondos = "Recepcion de fondos"
  }

  const idMensaje = mensajeCodificado.substring(4, 4 + 10);
  const bancoOrigen = parseInt(mensajeCodificado.substring(14, 14 + 7));
  const cuentaOrigen = parseInt(mensajeCodificado.substring(21, 21 + 10));
  const bancoDestino = parseInt(mensajeCodificado.substring(31, 31 + 7));
  const cuentaDestino = parseInt(mensajeCodificado.substring(38, 38 + 10));
  const monto = parseInt(mensajeCodificado.substring(48, 48 + 16));

  const evento = {
    tipoOperacion: tipoOperacion,
    idMensaje: idMensaje,
    bancoOrigen: bancoOrigen,
    cuentaOrigen: cuentaOrigen,
    bancoDestino: bancoDestino,
    cuentaDestino: cuentaDestino,
    monto: monto
  };
  
  // quiero imprimir en consola los valores de las variables en una sola frase
  console.log("El tipo de operacion es: " + fondos + "de $" + monto +" desde la cuenta "+ cuentaOrigen + " del banco" + bancoOrigen + " hacia la  cuenta de destino: " + cuentaDestino + "en el banco de destino: "+ bancoDestino + "con el id de mensaje: " + idMensaje);
  almacenarEvento(evento)
    .then(() => {
      res.status(200).send('OK');
    })
    .catch(error => {
      console.error('Error al almacenar el evento en la base de datos:', error);
      res.status(500).send('Error al almacenar el evento en la base de datos');
    });
  // Envía una respuesta al cliente
});

