document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const logradouro = document.getElementById("logradouro");
    const bairro = document.getElementById("bairro");
    const localidade = document.getElementById("localidade");
    const uf = document.getElementById("uf");

    let errorDiv = document.querySelector(".error");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error";
        document.getElementById("principal").appendChild(errorDiv);
    }

    function limpaCampos() {
        logradouro.value = "";
        bairro.value = "";
        localidade.value = "";
        uf.value = "";
    }

    function buscarCEP() {
        const cep = cepInput.value.trim();

        if (!/^\d{8}$/.test(cep)) {
            limpaCampos();
            errorDiv.innerText = "CEP inválido. Digite 8 números.";
            errorDiv.style.display = "block";
            return;
        }

        errorDiv.style.display = "none";

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na requisição.");
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    limpaCampos();
                    errorDiv.innerText = "CEP não encontrado.";
                    errorDiv.style.display = "block";
                } else {
                    logradouro.value = data.logradouro || "";
                    bairro.value = data.bairro || "";
                    localidade.value = data.localidade || "";
                    uf.value = data.uf || "";
                }
            })
            .catch(() => {
                limpaCampos();
                errorDiv.innerText = "Erro ao buscar o CEP.";
                errorDiv.style.display = "block";
            });
    }

    // Aciona busca ao sair do campo (blur)
    cepInput.addEventListener("blur", buscarCEP);

    // Aciona busca ao pressionar Enter
    cepInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita envio de formulário, se houver
            buscarCEP();
        }
    });
});
