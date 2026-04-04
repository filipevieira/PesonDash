// Utilização estrita de ES5 (Galaxy Tab 10.1 / WebKit legado)

var loginScreen = document.getElementById('login-screen');
var dashboardScreen = document.getElementById('dashboard-screen');
var passwordInput = document.getElementById('password-input');
var clockDisplay = document.getElementById('clock-display');
var dateDisplay = document.getElementById('date-display');

var diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
var mesesAle = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatarNum(n) { return n < 10 ? '0' + n : n.toString(); }
function gerarSenhaDinamica() { return formatarNum(new Date().getDate()) + formatarNum(new Date().getMinutes()); }

document.getElementById('login-button').onclick = tentarLogin;
passwordInput.onkeypress = function(e) { if((e.which||e.keyCode)===13) tentarLogin(); };

function tentarLogin() {
    if (passwordInput.value === gerarSenhaDinamica()) {
        loginScreen.className = 'screen hidden';
        dashboardScreen.className = 'screen visible';
        iniciarDashboard();
    } else {
        document.getElementById('login-error').innerHTML = 'Incorreto. Tente: Dia+Minuto atual';
        document.getElementById('login-error').style.display = 'block';
        passwordInput.value = '';
    }
}

// ------ MATEMATICA CRONOLOGICA ------
function calcularInfoHeader() {
    var hoje = new Date();
    var inicioAno = new Date(hoje.getFullYear(), 0, 1);
    var diasPassados = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000) + 1;
    var totalAno = ((hoje.getFullYear() % 4 === 0 && hoje.getFullYear() % 100 !== 0) || hoje.getFullYear() % 400 === 0) ? 366 : 365;
    
    document.getElementById('pill-diaano').innerHTML = 'Dia: ' + diasPassados;
    document.getElementById('pill-restante').innerHTML = 'Faltam: ' + (totalAno - diasPassados);
    document.getElementById('pill-semana').innerHTML = 'Semana: ' + Math.ceil((diasPassados + inicioAno.getDay() + 1) / 7);
    
    var ciclo = 29.53058867;
    var fase = (((hoje.getTime() - new Date("2000-01-06T18:14:00Z").getTime()) / 86400000) % ciclo) / ciclo;
    var nL = "🌑 Nova";
    if(fase>0.05&&fase<=0.25)nL="🌒 Crescente"; else if(fase>0.25&&fase<=0.45)nL="🌓 Quarto C."; else if(fase>0.45&&fase<=0.55)nL="🌕 Cheia"; else if(fase>0.55&&fase<=0.75)nL="🌖 Ming."; else if(fase>0.75&&fase<=0.95)nL="🌗 Quarto M.";
    document.getElementById('pill-lua').innerHTML = 'Lua: ' + nL;
}

function atualizarRelogio() {
    var a = new Date();
    clockDisplay.innerHTML = formatarNum(a.getHours()) + ':' + formatarNum(a.getMinutes()) + ':' + formatarNum(a.getSeconds());
    dateDisplay.innerHTML = diasSemana[a.getDay()] + ', ' + a.getDate() + ' de ' + mesesAle[a.getMonth()] + ' de ' + a.getFullYear();
    if (a.getHours() === 0 && a.getMinutes() === 0) calcularInfoHeader();
}

// ------ XHR ENGINE ------
function request(url, errCB, okCB) {
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.onreadystatechange = function() {
        if (x.readyState === 4) { if (x.status === 200) { try { okCB(JSON.parse(x.responseText)); } catch(e) { errCB("Fail"); } } else errCB("Fail"); }
    }; x.send();
}

// ------ CLIMA (SVGs Ouro) ------
var diasCurto = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
function getIconeClima(c) {
    var sS = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="#ffaa00"/><path d="M50 10v10M50 80v10M10 50h10M80 50h10M20 20l8 8M72 72l8 8M20 80l8-8M72 28l8-8" stroke="#ffaa00" stroke-width="6" stroke-linecap="round"/></svg>';
    var sN = '<svg viewBox="0 0 100 100"><path d="M25 65a15 15 0 0 1 0-30 20 20 0 0 1 35-10 15 15 0 0 1 20 20 15 15 0 0 1 0 30z" fill="#aaa"/></svg>';
    var sC = '<svg viewBox="0 0 100 100"><path d="M25 55a15 15 0 0 1 0-30 20 20 0 0 1 35-10 15 15 0 0 1 20 20 15 15 0 0 1 0 30z" fill="#778899"/><path d="M40 60l-5 15M55 60l-5 15M70 60l-5 15" stroke="#00ccff" stroke-width="4" stroke-linecap="round"/></svg>';
    return c <= 2 ? sS : (c <= 49 ? sN : sC);
}

function carregarClima() {
    var ts = new Date(); document.getElementById('weather-timestamp').innerHTML = "Última att: " + formatarNum(ts.getHours()) + ":" + formatarNum(ts.getMinutes());
    request("https://api.open-meteo.com/v1/forecast?latitude=-22.9056&longitude=-47.0608&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=relativehumidity_2m&timezone=America%2FSao_Paulo", 
        function() { document.getElementById('weather-week-container').innerHTML = "<p>Erro na API.</p>"; }, 
        function(data) {
            if(data.current_weather){
                document.getElementById('temp-display').innerHTML = Math.round(data.current_weather.temperature)+"°";
                document.getElementById('weather-icon').innerHTML = getIconeClima(data.current_weather.weathercode);
                document.getElementById('w-humidity').innerHTML = "💧 Umidade: " + (data.hourly?data.hourly.relativehumidity_2m[new Date().getHours()]:"--") + "%";
                document.getElementById('w-wind').innerHTML = "🌬️ Vento: " + Math.round(data.current_weather.windspeed) + " km/h";
                
                var wHtml = "";
                for(var i=0; i<7 && i<data.daily.time.length; i++) {
                    var dataStr = data.daily.time[i]; 
                    var dd = new Date(dataStr + "T12:00:00Z"); 
                    var min = Math.round(data.daily.temperature_2m_min[i]);
                    var max = Math.round(data.daily.temperature_2m_max[i]);
                    var nomeD = (i === 0) ? "HOJ" : diasCurto[dd.getDay()];
                    
                    wHtml += "<div class='f-week-box'>";
                    wHtml += "  <span class='f-week-day'>"+nomeD+"</span>";
                    wHtml += "  <span class='f-week-val'>"+min+"° / "+max+"°</span>";
                    wHtml += "</div>";
                }
                var container = document.getElementById('weather-week-container');
                if (container) container.innerHTML = wHtml;
            }
        }
    );
}

// ------ NOTICIAS G1 (GRID 3x2 com Card Images) ------
function carregarNoticias() {
    document.getElementById('news-grid').innerHTML = "<p style='text-align:center; padding-top:40px; color:#aaa;'>Puxando portal G1...</p>";
    request("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://g1.globo.com/rss/g1/sp/campinas-regiao/"), function(){}, function(d){
        if(d && d.items) {
            var html = "";
            for(var i=0; i<3 && i<d.items.length; i++) {
                var m = d.items[i];
                var imgUrl = m.thumbnail || (m.enclosure ? m.enclosure.link : "") || "";
                var bgCss = imgUrl ? "background-image: url('"+imgUrl+"');" : "background-color: #222;";
                
                html += "<a href='"+m.link+"' target='_blank' class='news-card'>";
                html += "  <div class='news-img' style=\"" + bgCss + "\"></div>";
                html += "  <p class='news-txt'>"+m.title+"</p>";
                html += "</a>";
            }
            document.getElementById('news-grid').innerHTML = html;
        }
    });
}

// ------ ESPORTES ESPN DELUXE (LOGOS) ------
function carregarLigaESPN(ligaCaminho, containerId) {
    document.getElementById(containerId).innerHTML = "<p style='padding:10px;color:#888;'>Procurando...</p>";
    request("https://site.api.espn.com/apis/site/v2/sports/" + ligaCaminho + "/scoreboard?lang=pt&region=br", 
        function() { document.getElementById(containerId).innerHTML = "<p style='padding:10px;'>Off</p>"; }, 
        function(d) {
            if(d && d.events && d.events.length > 0) {
                var html = "";
                for(var i=0; i<d.events.length; i++) {
                    var jogo = d.events[i];
                    var st = jogo.status.type.shortDetail;
                    var lnk = (jogo.links && jogo.links.length > 0) ? jogo.links[0].href : "#";
                    
                    var comp = jogo.competitions[0].competitors;
                    
                    // Extrai as duas equipes da Array competitors (Mandante e Visitante)
                    var t1 = comp[0].team;
                    var t2 = comp[1].team;
                    var img1 = t1.logo || "";
                    var nm1 = t1.shortDisplayName || t1.abbreviation;
                    var img2 = t2.logo || "";
                    var nm2 = t2.shortDisplayName || t2.abbreviation;
                    
                    // Estrutura de Batalha: T2 [IMG] vs [IMG] T1
                    html += "<a href='"+lnk+"' target='_blank' class='sport-row'>";
                    html += "  <div class='team-block t-home'><span class='team-name'>" + nm2 + "</span> <img src='"+img2+"' class='team-logo' onerror='this.style.display=\"none\"'/></div>";
                    html += "  <div class='match-info'>" + st + "</div>";
                    html += "  <div class='team-block t-away'><img src='"+img1+"' class='team-logo' onerror='this.style.display=\"none\"'/> <span class='team-name'>" + nm1 + "</span></div>";
                    html += "</a>";
                }
                document.getElementById(containerId).innerHTML = html;
            } else {
                document.getElementById(containerId).innerHTML = "<p style='padding:10px;'>Sem agenda para hoje.</p>";
            }
        }
    );
}

function iniciarDashboard() {
    calcularInfoHeader(); atualizarRelogio(); setInterval(atualizarRelogio, 1000);
    
    document.getElementById('btn-refresh-weather').onclick = carregarClima;
    carregarClima();
    
    document.getElementById('btn-refresh-news').onclick = carregarNoticias;
    carregarNoticias();
    
    carregarLigaESPN('football/nfl', 'nfl-container');
    carregarLigaESPN('hockey/nhl', 'nhl-container');
    carregarLigaESPN('baseball/mlb', 'mlb-container');
    
    // Refresh Global Backup
    setTimeout(function() { window.location.reload(); }, 30 * 60 * 1000);
}
