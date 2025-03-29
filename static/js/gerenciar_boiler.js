
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("ligar_boiler").addEventListener("click", ligar_boiler);
    document.getElementById("desligar_boiler").addEventListener("click", desligar_boiler);
    atualizar_status();

});

let intervalo;

function atualizar_status(){
    let status = document.getElementById("boiler_status");
    let tempos;
    let tempoFinal;
    fetch('/status_boiler', {method: 'GET'}).then(response => response.text())
        .then(data => {
        if(data.startsWith("Status do boiler: ON")){
            clearInterval(intervalo);
            status.innerText = "LIGADO";
            status.style.color = "#4CAF50";
            tempos = data.match(/\d+/g);
            tempos = tempos.map(Number);

            tempoFinal = tempos[0] - tempos[1];

            iniciarTimer(tempoFinal);
        }
        else if(data.startsWith("Status do boiler: OFF")){
            status.innerText = "DESLIGADO";
            status.style.color = "#e74c3c";
            clearInterval(intervalo);
            document.getElementById("horas").textContent = "00";
            document.getElementById("minutos").textContent = "00";
            document.getElementById("segundos").textContent = "00";
            document.getElementById("fundo-timer").style.backgroundColor = "#ff9d9d"
        }
    })
        .catch(error => console.error('Error: ', error));
}

function ligar_boiler() {
    fetch('/ligar_boiler', {method: 'GET'}).then(response => response.text())
        .then(boiler => atualizar_status())
        .catch(error => console.error('Error: ', error));
}

function desligar_boiler() {
    fetch('/desligar_boiler', {method: 'GET'}).then(response => response.text())
        .then(boiler => atualizar_status())
        .catch(error => console.error('Error: ', error));
}

function iniciarTimer(ms) {
    let tempoRestante = ms;
    document.getElementById("fundo-timer").style.backgroundColor = "#c5ffa3"
    function atualizarHoras() {
        let horas = Math.floor(tempoRestante / (1000 * 60 * 60));
        document.getElementById("horas").textContent = String(horas).padStart(2, '0');
    }

    function atualizarMinutos() {
        let minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
        document.getElementById("minutos").textContent = String(minutos).padStart(2, '0');
    }

    function atualizarSegundos() {
        let segundos = Math.floor((tempoRestante / 1000) % 60);
        document.getElementById("segundos").textContent = String(segundos).padStart(2, '0');
    }

    function atualizarTimer() {
        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            document.getElementById("horas").textContent = "00";
            document.getElementById("minutos").textContent = "00";
            document.getElementById("segundos").textContent = "00";
            return;
        }

        atualizarHoras();
        atualizarMinutos();
        atualizarSegundos();

        tempoRestante -= 1000; // Decrementa 1 segundo
    }

    atualizarTimer(); // Atualiza imediatamente para evitar esperar 1 segundo
    intervalo = setInterval(atualizarTimer, 1000);
}