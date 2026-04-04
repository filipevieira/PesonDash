// Utilização estrita de ES5 (Galaxy Tab 10.1 / WebKit legado)

var loginScreen = document.getElementById('login-screen');
var dashboardScreen = document.getElementById('dashboard-screen');
var passwordInput = document.getElementById('password-input');
var clockDisplay = document.getElementById('clock-display');
var dateDisplay = document.getElementById('date-display');

var diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
var mesesAle = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

var formatarNum = function(n) { return n < 10 ? '0' + n : n.toString(); };
function gerarSenhaDinamica() { return formatarNum(new Date().getDate()) + formatarNum(new Date().getMinutes()); }

// ------ ESTADO GLOBAL (TEMA E TICKER) ------
var currentTheme = localStorage.getItem('dash_theme') || 'dark';
if (currentTheme === 'light') document.body.classList.add('theme-light');

window.LIVE_TICKER_DATA = [];
window.LIVE_PLAYS_DATA = [];
var emitirTicker = function() {
    var dest = document.getElementById('live-ticker');
    if (!dest) return;
    if (window.LIVE_TICKER_DATA.length === 0) {
        dest.innerHTML = "<span class='ticker-item'>🌐 NENHUM RESULTADO AO VIVO ENCONTRADO PARA A DATA DE HOJE NOS ESPORTES SELECIONADOS. Use ◁ ▷ nos boxes para rever a semana.</span>";
    } else {
        var str = window.LIVE_TICKER_DATA.join(" &nbsp;&nbsp;<span style='color:#00ffcc'>|</span>&nbsp;&nbsp; ");
        dest.innerHTML = "<span class='ticker-item'>" + str + "</span><span class='ticker-item'>" + str + "</span>"; 
    }
    
    var playsBox = document.getElementById('live-plays');
    if (playsBox) {
        if (window.LIVE_PLAYS_DATA.length > 0) {
            playsBox.innerHTML = "<marquee scrollamount='4' scrolldelay='60' class='live-play-text'>⚡ " + window.LIVE_PLAYS_DATA.join(" &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;⚡ ") + "</marquee>";
        } else {
            playsBox.innerHTML = "<span class='live-play-text' style='color:#888;'>Central de Lances Ociosa no momento.</span>";
        }
    }
};

function carregarDataRelogio() { return formatarNum(new Date().getDate()) + formatarNum(new Date().getMinutes()); }

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

var btnFs = document.getElementById('btn-fullscreen');
if (btnFs) {
    btnFs.onclick = function() {
        var doc = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (doc.requestFullscreen) doc.requestFullscreen();
            else if (doc.webkitRequestFullScreen) doc.webkitRequestFullScreen();
            else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
            this.style.color = '#00ffcc';
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            this.style.color = '';
        }
    };
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
    var ts = new Date(); 
    var ets = document.getElementById('weather-timestamp');
    if(ets) ets.innerHTML = "Última att: " + formatarNum(ts.getHours()) + ":" + formatarNum(ts.getMinutes());
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

// ------ NOTICIAS G1 (LISTA EXPRESSA 6 LINKS) ------
function carregarNoticias() {
    document.getElementById('news-list').innerHTML = "<li><p style='color:#aaa;'>Puxando G1...</p></li>";
    request("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://g1.globo.com/rss/g1/sp/campinas-regiao/"), function(){}, function(d){
        if(d && d.items) {
            var html = "";
            for(var i=0; i<6 && i<d.items.length; i++) {
                html += "<li><a href='"+d.items[i].link+"' target='_blank'>"+d.items[i].title+"</a></li>";
            }
            document.getElementById('news-list').innerHTML = html;
        }
    });
}

// ------ ESPORTES ESPN DELUXE (LOGOS E CARROSSEL) ------
var SPORTS_MAP = {
    nfl: { id: 'nfl', name: '🏈 NFL', path: 'football/nfl' },
    nhl: { id: 'nhl', name: '🏒 NHL', path: 'hockey/nhl' },
    mlb: { id: 'mlb', name: '⚾ MLB', path: 'baseball/mlb' },
    pl: { id: 'pl', name: '⚽ Premiere League', path: 'soccer/eng.1' },
    f1: { id: 'f1', name: '🏎️ Formula 1', path: 'racing/f1' }
};

var mySports = JSON.parse(localStorage.getItem('dash_sports') || '["nfl","nhl","mlb"]');

var modal = document.getElementById('settings-modal');
var btnSettings = document.getElementById('btn-settings');
var togglesBox = document.getElementById('settings-toggles');

if (btnSettings && modal) {
    btnSettings.onclick = function() {
        var h = "";
        for(var key in SPORTS_MAP) {
            var checked = mySports.indexOf(key) > -1 ? "checked" : "";
            h += "<label class='chk-row'><input type='checkbox' class='sport-chk' value='"+key+"' "+checked+"> " + SPORTS_MAP[key].name + "</label>";
        }
        togglesBox.innerHTML = h;
        modal.classList.remove('hidden');
    };
    
    document.getElementById('btn-close-settings').onclick = function() { modal.classList.add('hidden'); };
    document.getElementById('btn-save-settings').onclick = function() {
        var chks = document.querySelectorAll('.sport-chk');
        var newSports = [];
        for(var i=0; i<chks.length; i++) { if(chks[i].checked) newSports.push(chks[i].value); }
        localStorage.setItem('dash_sports', JSON.stringify(newSports));
        modal.classList.add('hidden');
        desenharCarrosselEsportes();
    };
    
    var btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
        btnTheme.onclick = function() {
            if (document.body.classList.contains('theme-light')) {
                document.body.classList.remove('theme-light');
                localStorage.setItem('dash_theme', 'dark');
            } else {
                document.body.classList.add('theme-light');
                localStorage.setItem('dash_theme', 'light');
            }
        };
    }
}

// ------ MÁQUINA DO TEMPO (DATAS) ------
var sportDatesOffset = {};
function labelForOffset(off) {
    if(off === 0) return "Hoje";
    if(off === 1) return "Amanhã";
    if(off === -1) return "Ontem";
    var d = new Date(); d.setDate(d.getDate() + off);
    return formatarNum(d.getDate()) + "/" + formatarNum(d.getMonth() + 1);
}
function formatterESPN_Date(off) {
    var d = new Date(); d.setDate(d.getDate() + off);
    return d.getFullYear() + "" + formatarNum(d.getMonth() + 1) + "" + formatarNum(d.getDate());
}

window.mudarDataEsporte = function(sportId, dif) {
    sportDatesOffset[sportId] = (sportDatesOffset[sportId] || 0) + dif;
    var lbl = document.getElementById('date-lbl-' + sportId);
    if(lbl) lbl.innerHTML = labelForOffset(sportDatesOffset[sportId]);
    if(SPORTS_MAP[sportId]) {
        carregarLigaESPN(SPORTS_MAP[sportId].path, 'container-'+sportId, sportId);
    }
};

function desenharCarrosselEsportes() {
    mySports = JSON.parse(localStorage.getItem('dash_sports') || '["nfl","nhl","mlb"]');
    var track = document.getElementById('carousel-track');
    window.LIVE_TICKER_DATA = [];
    window.LIVE_PLAYS_DATA = [];
    
    if (!track) return;
    
    if (mySports.length === 0) {
        track.innerHTML = "<p style='color:#666; padding:20px;'>Nenhum esporte ativado. Use as engrenagens no topo.</p>";
        emitirTicker();
        return;
    }
    
    var html = "";
    for(var i=0; i<mySports.length; i++) {
        var k = mySports[i];
        if(!SPORTS_MAP[k]) continue;
        sportDatesOffset[k] = 0; // zera pro default Hoje toda renderização
        html += "<div class='widget sports-panel'>";
        html += "  <h2 class='league-title' style='display:flex; justify-content:space-between; align-items:center;'>";
        html += "    <span>" + SPORTS_MAP[k].name + "</span>";
        html += "    <span style='font-size:11px;'><button class='date-nav-btn' onclick='mudarDataEsporte(\""+k+"\", -1)'>◁</button> <span id='date-lbl-"+k+"' style='display:inline-block; width:45px; text-align:center;'>Hoje</span> <button class='date-nav-btn' onclick='mudarDataEsporte(\""+k+"\", 1)'>▷</button></span>";
        html += "  </h2>";
        html += "  <div class='scroll-area flex-height'>";
        html += "    <div id='container-"+k+"' class='sports-list'><p style='color:#888;'>Procurando...</p></div>";
        html += "  </div>";
        html += "</div>";
    }
    track.innerHTML = html;
    
    for(var j=0; j<mySports.length; j++) {
        var sk = mySports[j];
        if(SPORTS_MAP[sk]) carregarLigaESPN(SPORTS_MAP[sk].path, 'container-'+sk, sk);
    }
}

function carregarLigaESPN(ligaCaminho, containerId, sportKey) {
    if(!document.getElementById(containerId)) return;
    document.getElementById(containerId).innerHTML = "<p style='padding:10px;color:#888;'>Procurando...</p>";
    
    var offset = sportDatesOffset[sportKey] || 0;
    var suffix = "?lang=pt&region=br";
    var endpoint = "scoreboard";
    if (offset !== 0) { suffix += "&dates=" + formatterESPN_Date(offset); }
    
    // Custom F1 endpoint if it's Formula 1 and no offset (just get Standings)
    if (sportKey === 'f1') {
        endpoint = "standings";
        suffix = "";
    }

    request("https://site.api.espn.com/apis/site/v2/sports/" + ligaCaminho + "/" + endpoint + suffix, 
        function() { var el=document.getElementById(containerId); if(el) el.innerHTML = "<p style='padding:10px;'>Off</p>"; }, 
        function(d) {
            var el = document.getElementById(containerId); if(!el) return;
            var html = "";
            
            // --- MOTOR ESPECIAL: FORMULA 1 STANDINGS ---
            if (sportKey === 'f1') {
                try {
                    var rank = d.children[0].standings.entries;
                    for(var f=0; f<rank.length && f<8; f++) {
                        var f1Athelete = rank[f].athlete.displayName;
                        var pts = rank[f].stats[0].displayValue;
                        html += "<div class='sport-row' style='display:flex; justify-content:space-between;'>";
                        html += "  <span style='color:#ccc;'><b style='color:#00ffcc;'>"+(f+1)+"º</b> " + f1Athelete + "</span>";
                        html += "  <span style='color:#fff; font-weight:bold;'>" + pts + " pts</span>";
                        html += "</div>";
                    }
                    el.innerHTML = html !== "" ? html : "<p style='padding:10px;'>Grid vazio.</p>";
                } catch(e) { el.innerHTML = "<p style='padding:10px;'>Grid indisponível.</p>"; }
                return;
            }
            
            if(d && d.events && d.events.length > 0) {
                
                // --- MOTOR ESPECIAL PARA GOLF (LEADERBOARDS) ---
                if (ligaCaminho === 'golf/pga') {
                    for(var i=0; i<d.events.length; i++) {
                        try {
                            var trny = d.events[i];
                            html += "<div class='sport-row' style='cursor:default;'>";
                            html += "  <div style='color:#00ffcc; font-size:14px; font-weight:bold; margin-bottom:5px;'>" + trny.shortName + " <span style='color:#888;font-size:10px;'>("+trny.status.type.shortDetail+")</span></div>";
                            
                            var comps = trny.competitions[0].competitors;
                            var maxP = comps.length > 3 ? 3 : comps.length;
                            for(var p=0; p<maxP; p++) {
                                var ath = comps[p].athlete;
                                var score = comps[p].score || "E";
                                html += "  <div style='display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px dashed #333;'>";
                                html += "     <span style='color:#eee; font-size:12px; font-weight:bold;'>" + (p+1) + "º " + ath.displayName + "</span>";
                                html += "     <span style='color:#00ffcc; font-weight:bold;'>" + score + "</span>";
                                html += "  </div>";
                            }
                            html += "</div>";
                            
                            // Abastece letreiro (se for no dia original)
                            if (offset === 0 && window.LIVE_TICKER_DATA.length < 15 && comps.length>0) {
                                window.LIVE_TICKER_DATA.push("⛳ " + trny.shortName + " Lider: " + comps[0].athlete.displayName + " (" + (comps[0].score||"E") + ")");
                            }
                        } catch(e) {}
                    }
                    el.innerHTML = html !== "" ? html : "<p style='padding:10px;'>Torneio em hiato.</p>";
                    emitirTicker();
                    return; /* Interrompe para não usar o motor Time vs Time */
                }

                // --- MOTOR PADRÃO (CONFRONTOS FRONTAIS) ---
                for(var i=0; i<d.events.length; i++) {
                    try {
                        var jogo = d.events[i];
                        var st = jogo.status.type.shortDetail;
                        var lnk = (jogo.links && jogo.links.length > 0) ? jogo.links[0].href : "#";
                        var comp = jogo.competitions[0].competitors;
                        
                        if(comp.length < 2) continue; // Ignora atletas solitarios estranhos
                        
                        var t1 = comp[0].team || comp[0].athlete;
                        var t2 = comp[1].team || comp[1].athlete;
                        
                        var score1Val = parseInt(comp[0].score) || 0;
                        var score2Val = parseInt(comp[1].score) || 0;
                        var isPost = (jogo.status.type.state === 'post');
                        
                        // Determinando o Vencedor da Partida
                        var wClass1 = "", wClass2 = "", crown1 = "", crown2 = "";
                        if (isPost && score1Val > score2Val) { wClass1 = "winner-txt"; crown1 = "<span class='winner-crown'>👑</span>"; }
                        if (isPost && score2Val > score1Val) { wClass2 = "winner-txt"; crown2 = "<span class='winner-crown'>👑</span>"; }
                        
                        var img1 = t1.logo || t1.flag || "";
                        var nm1 = t1.shortDisplayName || t1.abbreviation || t1.displayName;
                        var p1Score = comp[0].score ? "<span class='score-txt " + wClass1 + "'>" + comp[0].score + "</span>" : "";
                        
                        var img2 = t2.logo || t2.flag || "";
                        var nm2 = t2.shortDisplayName || t2.abbreviation || t2.displayName;
                        var p2Score = comp[1].score ? "<span class='score-txt " + wClass2 + "'>" + comp[1].score + "</span>" : "";
                        
                        html += "<a href='"+lnk+"' target='_blank' class='sport-row'>";
                        html += "  <div class='team-block t-home'><span class='team-name " + wClass2 + "'>" + nm2 + crown2 + "</span> " + p2Score + " <img src='"+img2+"' class='team-logo' onerror='this.style.display=\"none\"'/></div>";
                        html += "  <div class='match-info'>" + st + "</div>";
                        html += "  <div class='team-block t-away'><img src='"+img1+"' class='team-logo' onerror='this.style.display=\"none\"'/> " + p1Score + " <span class='team-name " + wClass1 + "'>" + crown1 + nm1 + "</span></div>";
                        html += "</a>";
                        
                        // Abastece Letreiro ao Vivo (apenas em offset local e se nao explodiu)
                        if (offset === 0 && sportKey) {
                            var icn = SPORTS_MAP[sportKey].name.split(' ')[0]; // Pega o emoji 🏀🏈⚾
                            var fakeScoreStr = (comp[1].score||"0") + " x " + (comp[0].score||"0");
                            // se não iniciou, mostra agenda
                            if (!comp[0].score && jogo.status.type.state==="pre") fakeScoreStr = jogo.status.type.shortDetail;
                            window.LIVE_TICKER_DATA.push(icn + " " + nm2 + " " + fakeScoreStr + " " + nm1);
                        }
                        
                        // Abastece Faixa Amarela (Últimos Lances se tiver Ao Vivo)
                        var shortIcn = SPORTS_MAP[sportKey].name.split(' ')[0];
                        if (offset === 0 && jogo.status.type.state === 'in') {
                            if (jogo.situation && jogo.situation.lastPlay && jogo.situation.lastPlay.text) {
                                window.LIVE_PLAYS_DATA.push(shortIcn + " " + nm2 + " vs " + nm1 + " [" + jogo.situation.lastPlay.text + "]");
                            }
                        } else if (offset === 0 && isPost) {
                            // Se nao ta rolando ao vivo, popula yellow box com finais
                            window.LIVE_PLAYS_DATA.push(shortIcn + " FIM: " + nm2 + " " + score2Val + " x " + score1Val + " " + nm1);
                        }
                    } catch(e) {}
                }
                el.innerHTML = html !== "" ? html : "<p style='padding:10px;'>Indisponível hoje.</p>";
            } else {
                el.innerHTML = "<p style='padding:10px;'>Sem agenda para "+labelForOffset(offset)+".</p>";
            }
            emitirTicker(); // Invoca atualização da barra no fim de cada chamada
        }
    );
}

function iniciarDashboard() {
    calcularInfoHeader(); atualizarRelogio(); setInterval(atualizarRelogio, 1000);
    
    var wBtn = document.getElementById('btn-refresh-weather');
    if (wBtn) wBtn.onclick = carregarClima;
    carregarClima();
    
    var nBtn = document.getElementById('btn-refresh-news');
    if (nBtn) nBtn.onclick = carregarNoticias;
    carregarNoticias();
    
    desenharCarrosselEsportes();
    
    // Refresh Global Backup
    setTimeout(function() { window.location.reload(); }, 30 * 60 * 1000);
}
