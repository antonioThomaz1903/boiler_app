
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("ligar_boiler").addEventListener("click", ligar_boiler);
    document.getElementById("desligar_boiler").addEventListener("click", desligar_boiler);
    atualizar_status();

});

function atualizar_status(){
    let status = document.getElementById("boiler_status");
    fetch('/status_boiler', {method: 'GET'}).then(response => response.text())
        .then(data => {
        if(data.startsWith("Status do boiler: ON")){
            status.innerText = "LIGADO";
            status.style.color = "#4CAF50";
        }
        else if(data.startsWith("Status do boiler: OFF")){
            status.innerText = "DESLIGADO";
            status.style.color = "#e74c3c";
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
    atualizar_status();
}