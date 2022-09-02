import { useState } from "react";

interface IVoto {
    etapa: string;
    voto: string;
}

export const useUrna = (descricao: React.RefObject<HTMLDivElement>, lateral: React.RefObject<HTMLDivElement>) => {
    const [etapaAtual, setEtapaAtual] = useState(0);
    const [numero,setNumero] = useState('');
    const [votoBranco, setVotoBranco] = useState(false);
    const [votos, setVotos] = useState<IVoto[]>([]);
    const [cargo, setCargo] = useState('VEREADOR');
    const [seuVotoParaStyle,setSeuVotoParaStyle ] = useState({});
    const [avisoStyle,setAvisoStyle ] = useState({});
    const [piscaNumero, setPiscaNumero] = useState(false);


    const comecarEtapa = () => {
        let etapa = etapas[etapaAtual];
    

        setNumero('');
        setVotoBranco(false);
    
        for(let i=0;i<etapa.numeros;i++) {
            if(i ===0) {
                setPiscaNumero(true);
            } else{
                setPiscaNumero(false);
            }    
        }

        setSeuVotoParaStyle({display: 'none'});
    
        descricao.current!.innerHTML = '';

        setAvisoStyle({display: 'none'});

        lateral.current!.innerHTML = '';
    }

    const atualizaInterface = () => {
        let etapa = etapas[etapaAtual];
        let candidato = etapa.candidatos.find((item)=>item.numero === numero);

        if(candidato) {
            setSeuVotoParaStyle({display: 'block'});
            setAvisoStyle({display: 'block'});
            //descricao.innerHTML = 'Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}';
            descricao.current!.innerHTML = 'Nome: '+candidato.nome+'<br/>'+'Partido: '+candidato.partido;
    
            let fotosHTML = '';
            for(let i in candidato.fotos){
                if(candidato.fotos[i].small) {
                    fotosHTML += '<div class="d-1-image small"> <img src="Images/'+candidato.fotos[i].url+'" alt="" />'+candidato.fotos[i].legenda+'</div>';
                }else {
                    //fotosHTML += '<div class="d-1-image"> <img src="Images/${candidato.fotos[i].url}" alt="" />${candidato.fotos[i].legenda}</div>';
                    fotosHTML += '<div class="d-1-image"> <img src="Images/'+candidato.fotos[i].url+'" alt="" />'+candidato.fotos[i].legenda+'</div>';
                }
     
            }
    
            lateral.current!.innerHTML = fotosHTML;
        }else {
            seuVotoPara.style.display = 'block';
            aviso.style.display = 'block';
            descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
        }
    }

    return {comecarEtapa, seuVotoParaStyle,}
}



let seuVotoPara = document.querySelector('.d-1-1 span');
let aviso = document.querySelector('.d-2');

let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];




function clicou(n) {
    let somNumeros = new Audio();
    somNumeros.src = "audios/numeros.mp3";
    somNumeros.play();

    let elNumero = document.querySelector('.numero.pisca');
    if(elNumero !== null) {
        elNumero.innerHTML = n;
        //numero = '${numero}${n}';
        numero = numero+n;

        //fazer com que o campo de número pisque e após preenchido passe para o proximo campo
        elNumero.classList.remove('pisca');
        if( elNumero.nextElementSibling !== null){
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
} 
function branco() {
    numero === ''
    votoBranco = true;

    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    numeros.innerHTML = '';
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = '';

    
}
function corrige() {
    let somCorrige = new Audio();
    somCorrige.src = "audios/corrige.mp3";
    somCorrige.play();
    comecarEtapa();
}
function confirma() {
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false;
    let somConfirma = new Audio("audios/confirma.mp3");

    if(votoBranco === true) {
        votoConfirmado = true;
        somConfirma.play();

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if(numero.length === etapa.numeros) {
        votoConfirmado = true;
        somConfirma.play();

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }

    if(votoConfirmado) {
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined) {
            comecarEtapa();
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
            console.log(votos);
        }
    }
}

comecarEtapa();