from flask import Flask, render_template
from flasgger import Swagger
import socket

app = Flask(__name__)
Swagger(app)

@app.route('/')
def hello_world():
    """
    Endpoint para retornar uma página HTML.
    ---
    responses:
      200:
        description: Retorna uma página HTML
    """
    return render_template('index.html')

@app.route('/ligar_boiler')
def ligar_boiler():
    """
    Endpoint para enviar um comando UDP para ligar o boiler.
    ---
    responses:
      200:
        description: Comando UDP enviado com sucesso
    """
    UDP_IP = "192.168.15.2"
    UDP_PORT = 3232
    MESSAGE = b'ON'

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

    return 'Comando enviado via UDP!'

@app.route('/desligar_boiler')
def desligar_boiler():
    """
    Endpoint para enviar um comando UDP para ligar o boiler.
    ---
    responses:
      200:
        description: Comando UDP enviado com sucesso
    """
    UDP_IP = "192.168.15.2"
    UDP_PORT = 3232
    MESSAGE = b'OFF'

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

    return 'Comando enviado via UDP!'


@app.route('/status_boiler')
def status_boiler():
    """
    Endpoint para enviar um comando UDP e receber o status do boiler.
    ---
    responses:
      200:
        description: Retorna o status do boiler
    """
    UDP_IP = "192.168.15.2"
    UDP_PORT = 3232  # Porta do destino
    MESSAGE = b'STATUS'

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(2)  # Tempo limite para resposta
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

    try:
        data, _ = sock.recvfrom(1024)  # Aguarda resposta do ESP
        return f'Status do boiler: {data.decode()}'
    except socket.timeout:
        return 'Nenhuma resposta do boiler', 504

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)