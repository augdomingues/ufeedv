var xhttp = new XMLHttpRequest();
var usuario = {};
var url;
usuario.feeds = [];

window.onload = checaFeedsCadastrados;


function checaFeedsCadastrados(){
    var feedsCadastrados = JSON.parse(localStorage.getItem("feedStorage"));
    console.log(feedsCadastrados);
    if(feedsCadastrados[0].id >= 0){
        for(var i = 0; i < feedsCadastrados.length; i++){
            var url = feedsCadastrados[i].url;
            console.log(url);
            getStorageRSS(url);
        }
    }
}


xhttp.onreadystatechange = function() {
    console.log("Estado pronto: " + xhttp.readyState);
    console.log("Status: "  + xhttp.status);
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        myFunction(xhttp);
    }
    //else {
    //    errorCall();
    //}
};

function getRSS(){
    url = document.getElementById("feed").value;
    xhttp.open("GET", url, false);
    xhttp.send();
    move();

}

function getStorageRSS(storageURL){
    url = storageURL;
    console.log("Pegando o feed de: "  + storageURL);
    xhttp.open("GET", storageURL, false); //FALSE = sincrono ; TRUE = ASSINCRONO
    xhttp.send();
    move();
}

function myFunction(xml) {
    var xmlDoc = xml.responseXML;
    var nomeFeed = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    console.log("Novo: " + nomeFeed);
    if(novoFeed(nomeFeed))
    {
        //console.log("Novo : " + nomeFeed);
        adicionaFeed(nomeFeed, xmlDoc.getElementsByTagName("item"));
        console.log(nomeFeed);
        atualizaQuantidade();
        localStorage.setItem("feedStorage", JSON.stringify(usuario.feeds));
    }
}

function novoFeed(nomeFeed){
    for(var i = 0; i < usuario.feeds.length; i++)
    {
        if(usuario.feeds[i].nome == nomeFeed){
            alert("Feed já cadastrado!");
            return false;
        }
    }
    return true;
}

function adicionaFeed(nomeFeed,noticias){
    var listaNoticias = [];
    for(var i = 0; i < noticias.length; i++)
    {
        listaNoticias.push({id: listaNoticias.length, title: noticias[i].getElementsByTagName("title")[0].childNodes[0].nodeValue, link: noticias[i].getElementsByTagName("link")[0].childNodes[0].nodeValue, description: noticias[i].getElementsByTagName("description")[0].childNodes[0].nodeValue, pubDate: noticias[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue});
    }
    //console.log(listaNoticias);
    usuario.feeds.push({id:usuario.feeds.length, nome:nomeFeed, tamanho: listaNoticias.length, feedNoticias: listaNoticias, url: url});
    addListaNomesFeed(nomeFeed);
    addListaFeeds(usuario.feeds);
    return true;
}

function removeFeedLista(nomeFeed){
    for(var i = 0; i < usuario.feeds.length; i++){
        if(usuario.feeds[i].nome == nomeFeed){
            usuario.feeds.splice(i,1);
        }
    }
}


function addListaNomesFeed(nomeFeed)
{
    var seusFeeds = document.getElementById("seusFeeds").innerHTML;
    var spanClass = "<span id=\'" + nomeFeed + '\' onclick="removeFeed(\'' + nomeFeed + '\')\"' + " class=\"w3-closebtn w3-margin-right w3-medium\">x</span>";
    seusFeeds+= "<li>" + nomeFeed + spanClass + "</li>";
    document.getElementById("seusFeeds").innerHTML = seusFeeds;
}
//\"this.parentElement.style.display='none'\"
function addListaFeeds(feeds)
{
    var lista = "";
    for(var i = 0; i < feeds.length; i++)
    {
        noticias = feeds[i].feedNoticias;
        //console.log(noticias);
        for(var j = 0; j < noticias.length; j++){
            noticia = noticias[j];
            lista += "<a target='_blank' id='feed" + noticia.id + "' onclick='feedLido(" + noticia.id + ")' href='" + noticia.link + "'><li class='borda w3-padding-16'> " + noticia.title + "<p style='font-weight: normal;'>" + noticia.pubDate.substr(0,22) +  "</p></li></a>";
        }
    }
    document.getElementById("demo").innerHTML = lista;
    document.getElementById("demo").style.fontWeight =  "bold";

}

function feedLido(idFeed){
   // document.getElementById("feed"  + idFeed).innerHTML += " X ";
}


function getTamanhoLista(){
    var tamanho = 0;
    for(var i = 0; i < usuario.feeds.length; i++){
        tamanho += usuario.feeds[i].tamanho;
    }
    return tamanho;
}

function atualizaQuantidade(){
    document.getElementById("quantidade").innerHTML = "&nbsp;&nbsp;&nbsp;<span class='w3-badge w3-red'>" + getTamanhoLista() + "</span> artigos!";
}

function errorCall(){
    document.getElementById("demo").innerHTML = "&nbsp;&nbsp;&nbsp;Algum erro ocorreu. Tente novamente!";
}

function removeFeed(nomeFeed){
    document.getElementById(nomeFeed).parentElement.style.display='none';
    for(var i = 0; i < usuario.feeds.length; i++){
        if (usuario.feeds[i].nome == nomeFeed){
            usuario.feeds.splice(i,1);
        }
    }
    atualizaQuantidade();
    removeFeedLista(nomeFeed);
    addListaFeeds(usuario.feeds);
    localStorage.setItem("feedStorage", JSON.stringify(usuario.feeds));

}


function move() {
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 0.1);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width+= 10;
            elem.style.width = width + '%';
        }
    }
}
