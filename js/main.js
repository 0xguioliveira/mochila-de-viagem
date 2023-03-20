const form = document.getElementById("novoItem");
const lista = document.getElementById("lista");
const itens = JSON.parse(localStorage.getItem("itens")) || [];
//"JSON.parse" transforma o array em JS para que seja possível manipular esses dados, isso é necessário pois esse array foi transformado em string com "JSON.stringfy" para o localStorage receber os dados.

//realizando um laço no array para que cada elemento se torne interável. Neste caso, está acontecendo um looping da função criaElemento, fazendo com que, ao recarregar a página, todos os elementos presentes no localStorage apareçam na lista da mochila de viagem.
itens.forEach((elemento) => {
    criaElemento(elemento)
})
    
form.addEventListener("submit", (evento) =>{
    evento.preventDefault()
    //com o "submit" do formulário, o evento a ser escutado é o "preventDefault" para ser possível capturar o que for inserido no formulário. Isso porque, por padrão, o formulário manda os seus valores inseridos para a prória página, impedindo a captura desses dados.

    const nome = evento.target.elements['nome']
    const quantidade =  evento.target.elements['quantidade']

    //procurando na o array "itens", após o envio do formulário pelo usuário, se aquele elemento já existe.
    const existe = itens.find( elemento => elemento.nome === nome.value)

    //criando um objeto para que o localStorage guarde os inputs dos usuários.
    const itemAtual = {
        "nome": nome.value,
        "quantidade": quantidade.value
    };

    //se o elemento é encontrado:
    if(existe){
        itemAtual.id = existe.id
        atualizaElemento(itemAtual)

        // procurando no array itens o id do elemento para garantir que estou buscando o elemento correto e atualizando o conteúdo no localStorage.
        itens[itens.findIndex(elemento => elemento.id === existe.id)] = itemAtual

    } else {
        // o "?" funciona como "se", e o ":" como else.
        //se já possui itens na lista, pegar o id do último item e somar 1, se não houver item, manter o id 0.
        itemAtual.id = itens[itens.length - 1] ? (itens[itens.length - 1]).id + 1 : 0
     
        // parâmetros que capturam o valor inserido no formulário.    
        criaElemento(itemAtual) 
        
        //"push" insere elementos na lista
        itens.push(itemAtual)       
    }

    //setItem" para criar o localStorage, e JSON.stringify converte o objeto itemAtual, que está dentro da lista de itens ('const itens') em string, para que possa ser lido e armazenado no localStorage.
    localStorage.setItem("itens", JSON.stringify(itens))

    //deixando os inputs vazios após a criação dos itens.
    nome.value = ''
    quantidade.value = ''
})

function criaElemento(item){
    //<li class="item"><strong>7</strong>Camisas</li> no javascript:   

    const novoItem = document.createElement('li')
    //Adicionando a classe: "item":
    novoItem.classList.add("item")

    const numeroItem = document.createElement('strong')
    numeroItem.innerHTML = item.quantidade
    //item na posição quantidade.

    //criando um id dinâmico (data atributte) dentro do strong, ou seja, na quantidade, dependedo da posição do item na lista.
    numeroItem.dataset.id = item.id
    
    //juntando os dois elementos html ("li" e "strong") através do "appendChield":
    novoItem.appendChild(numeroItem)
    novoItem.innerHTML += item.nome
    //item na posição nome.

    novoItem.appendChild(botaoDeleta(item.id));

    //lista recebendo o novoItem completo:
    lista.appendChild(novoItem)
}

function atualizaElemento(item){
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade
    //na dúvida, fazer um console.log
}

function botaoDeleta(id){
    const elementoBotao = document.createElement('button')
    elementoBotao.innerHTML = "X";
    
    // arrow function, neste caso, não funciona pois não consegue trazer o "this" para o js.
    elementoBotao.addEventListener('click', function(){
        deletaElemento(this.parentNode, id)
        //this seria o botão, o parentNode o elemeprto pai (li), o item da lista, e o id seria a identificação do elemento.
    });

    return elementoBotao
}

function deletaElemento(tag, id){
    tag.remove()

    //procurando o id do elemento a ser removido(splice), dentro do array itens.
    itens.splice(itens.findIndex(elemento => elemento.id === id), 1)
        //A prtimeira posição do splice é o item que queremos remover, e o segundo a quantidade de itens a paritr daquela posição.

    localStorage.setItem("itens", JSON.stringify(itens))    
}