
const datos = {
    // 26: // seleccion argentina
    //     [],
    33: // manchester united
        [2467], // lisandro martinez
    40: // liverpool
        [6716], // macallister
    47: //tothenham
        [30776], // cuti romero
    49: // chelsea
        [5996], // enzo fernandez
    50: // manchester city
        [6009], // julian alvarez
    66: // aston villa
        [19599], // dibu martinez
    505: //inter de milan
        [217], // lautaro martinez
    211: //benfica
        [624, 266], // otamendi
    530: //atletico de madrid
        [2472], // de paul
    9568: // inter de miami
        [154] // lionel messi
}

const data = [2467,6716,30776,5996,6009,19599,217,624, 266,2472,154]

const leagues = {
    39: // premier legue
        [33,40,47,49,50,66],
    135: // serie a de italia
        [505],
    94: // primeira liga de portugal
        [211],
    140: // la liga de españa
        [530],
    253: // Major League Soccer de usa
        [9568]
}

// Función para obtener datos del jugador desde Local Storage o API
const getPlayerFromLocalOrApi = async (id) => {
    // Verifica si el jugador ya está en Local Storage
    let jugador = localStorage.getItem(`player_${id}`);

    if (jugador) {
        if (jugador) {
            try {
                // Si está en Local Storage, lo parseamos y lo retornamos
                return JSON.parse(jugador);
            } catch (e) {
                console.log(`Error parsing player data for ID ${id} from Local Storage`, e);
            }
        }
    } else {
        // Si no está, hacemos la petición a la API
        jugador = await getPlayer(id);
        console.log(jugador)

        // Lo guardamos en Local Storage
        localStorage.setItem(`player_${id}`, JSON.stringify(jugador));
        return jugador;
    }
}

const getPlayer = async (id) => {
    try{
        const response = await fetch(`https://v3.football.api-sports.io/players?id=${id}&season=2024`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "7a1cfee70b66966794e038bbe6cc1893"
            }
        })
        
        if (response.status === 200){
            const datos = await response.json();
            return {
                'name': datos.response[0].player.name,
                'photo': datos.response[0].player.photo,
                'team-name': datos.response[0].statistics[0].team.name,
                'team-logo': datos.response[0].statistics[0].team.logo
            }
        } else if (response.status === 499 || response.status === 500){
            console.log(response.message)
        } else {
            console.log("Something went wrong!")
        }
    } catch(err){
	    console.log(err);
    }
}

async function createPlayerSection(){
    let players = document.querySelector('#players')
    
    for (const player of data) {
        let jugador = await getPlayerFromLocalOrApi(player);

        articleContent = `
                <article>
                    <p><img src="${jugador['team-logo']}" style="width:20px"/> ${jugador['team-name']}</p>    
                    <img src="${jugador['photo']}" alt="Imagen de ${jugador['name']}"/>
                    <h3>${jugador['name']}</h3>
                </article>`;
    
        players.innerHTML += articleContent;
    }
}

const getFixture = async (league, season, team) => {
    try{
        const response = await fetch(`https://v3.football.api-sports.io/fixtures?season=${season}&league=${league}&next=1&team=${team}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "7a1cfee70b66966794e038bbe6cc1893"
            }
        })
        
        if (response.status === 200){
            const datos = await response.json();
            console.log(datos)
            return datos
        } else if (response.status === 499 || response.status === 500){
            console.log(response.message)
        } else {
            console.log("Something went wrong!")
        }
    } catch(err){
	    console.log(err);
    }
}

async function createFixtureSection(){
    const games = document.getElementById('games')

    for (const leagueId in leagues) {
        const teams = leagues[leagueId];
        
        for (const teamId of teams) {
            const fixture = await getFixture(leagueId, 2024, teamId)
            let fixtureContent = ''
            const fechaOriginal = fixture.response[0].fixture.date;
        
            const fecha = fechaOriginal.slice(5, 10); // "08-16"
            const hora = fechaOriginal.slice(11, 16); // "19:00"
        
            fixtureContent += `
                    <article class="article-games">
                        <p>${fecha} ${hora}</p>
                        <img src="${fixture.response[0].teams.away.logo}" alt="">
                        <p>${fixture.response[0].teams.away.name}</p>
                        <p>VS</p>
                        <p>${fixture.response[0].teams.home.name}</p>
                        <img src="${fixture.response[0].teams.home.logo}" alt="">
                    </article>`
        
            games.innerHTML += fixtureContent
        }
    }

}

async function main(){
    await createPlayerSection()

    createFixtureSection()
}

main()

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`Key: ${key}, Value: ${value}`);
}

