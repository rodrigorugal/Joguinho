
// VARIÁVEIS

var canvas, ctx, ALTURA, LARGURA, frame = 0, maxPulos = 3, velocidade = 6
var estadoAtual, recorde, img
estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
}
var chao = {
    y: 550,
    altura: 50,
    cor: "#e8da78",

    desenha: function() {
        ctx.fillStyle = this.cor
        ctx.fillRect(0, this.y, LARGURA, this.altura)
    }
}
var bloco = {
    x: 50,
    y:0,
    altura: 50,
    largura: 50,
    cor: "#ff9239",
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 23.6,
    qntPulos: 0,
    atualiza: function(){
        this.velocidade += this.gravidade
        this.y += this.velocidade

        if (this.y > chao.y - this.altura) {
            this.y = chao.y - this.altura
            this.qntPulos = 0
        }
    },
    pular: function() {
        if (this.qntPulos < maxPulos) {
            this.velocidade = -this.forcaDoPulo
            this.qntPulos++
        }
    },
    reset: function() {
        this.velocidade = 0
        this.y = 0
        if(this.score > recorde){
            localStorage.setItem("recorde", this.score)
            recorde = this.score
        }
        this.score = 0
    },
    desenha: function() {
        ctx.fillStyle = this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}
var obstaculos = {
    _obs: [],
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,

    insere: function(){
        this._obs.push({
            x: LARGURA,
            //largura: 30 + Math.floor(21 * Math.random()),
            largura: 30,
            altura: 26 + Math.floor(108 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())]
        })
        this.tempoInsere = 30 + Math.floor(26 * Math.random())
    },
    atualiza: function() {
        if (this.tempoInsere == 0) {
            this.insere()
        }else{
            this.tempoInsere--
        }
        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i]

            obs.x -= velocidade 

            if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {

                estadoAtual = estados.perdeu

            }else if (obs.x == 0 ) {
                bloco.score++
            }else if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1)
                tam--
                i--
            }       
        }
    },
    limpa: function() {
        this._obs = []
    },
    desenha: function() {
        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i]
            ctx.fillStyle = obs.cor
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)
        }
    }
}
/********************
*  ÁREA DE FUNÇÕES  *
********************/
function click(event) {             //FUNÇÃO EVENTOS DE CLICK
    //alert('Clicou!')
    if (estadoAtual == estados.jogando) {
        bloco.pular()    
    }else if(estadoAtual == estados.jogar){
        estadoAtual = estados.jogando
    }else if (estadoAtual == estados.perdeu) {
        estadoAtual = estados.jogar
        obstaculos.limpa()
        bloco.reset()
    }   
}
function main() {                   //FUNÇÃO PRINCIPAL // cria a tela do jogo
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth
    if (LARGURA >= 500) {
        LARGURA = 600
        ALTURA = 600
    }
    canvas = document.createElement("canvas")
    canvas.width = LARGURA
    canvas.height = ALTURA
    canvas.style.border = "1px solid #000"

    ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    document.addEventListener("mousedown", click)

    estadoAtual = estados.jogar
    recorde = localStorage.getItem("recorde")
    if (recorde == null) {
        recorde  = 0
    }
    img = new Image()
    img.src = "../img/fundoM.jpg"
    roda()
}
function roda() {                  //FUNÇÃO DE REPETIÇÃO // continua o fluxo do jogo
    atualiza()
    desenhar()
    window.requestAnimationFrame(roda)
}
function atualiza() {               //FUNÇÃO DE ATUALIZAÇÃO // sempre q é chamada na repetição atualiza os status do jogo
    frame++

    bloco.atualiza()

    if (estadoAtual == estados.jogando) {   
        obstaculos.atualiza()
    }
}
function desenhar() {               //FUNÇÃO QUE DESENHA O MAPA DO JOGO // imprime na tela os componentes do jogo como o chão, os obstaculos e o player
    ctx.fillStyle = "#80daff"
    ctx.fillRect(0, 0, LARGURA, ALTURA)



    ctx.fillStyle = "#fff"
    ctx.font = "50px Arial"
    ctx.fillText(bloco.score, 30, 68)

    if(estadoAtual == estados.jogar){

        ctx.fillStyle = "green"
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)
    }else if(estadoAtual == estados.perdeu){

        ctx.fillStyle = "red"
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)

        ctx.save()
        ctx.translate(LARGURA / 2, ALTURA / 2)
        ctx.fillStyle = "#fff"

        if (bloco.score > recorde) {
            ctx.fillText("Novo Recorde!", -150, -65)
        }else if(recorde < 10){
            ctx.fillText("Recorde!" + recorde, -99, -65)
        }else if(recorde >= 10 && bloco.score < 100){
            ctx.fillText("Recorde!" + recorde, -122, -65)
        }else{
            ctx.fillText("Recorde!" + recorde, -125, -65)
        }

        if(bloco.score < 10){
            ctx.fillText(bloco.score, -13, 19)
        }else if(bloco.score >= 10 && bloco.score < 100) {
            ctx.fillText(bloco.score, -26, 19)
        }else {
            ctx.fillText(bloco.score, -39, 19)
        }

        ctx.restore()
    }else if (estadoAtual == estados.jogando) {

        obstaculos.desenha()
    }
    chao.desenha()
    //obstaculos.desenha()
    bloco.desenha()
}
//Inicializa o Jogo
main()      // sempre q finaliza o jogo da inicio novamente