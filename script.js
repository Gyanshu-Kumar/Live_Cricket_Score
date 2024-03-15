async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/cricScore?apikey=f529c71b-edaf-4f8d-85ed-49f3f027315e");
        const data = await response.json();

        if (data.status !== "success") return;

        const matchesList = data.data;
        if (!matchesList) return [];

        
        const liveMatches = matchesList.filter(match => match.ms === "live" || match.status.toLowerCase().includes("opt to"));

        const relevantData = liveMatches.map(match => {
            const name = match.name ? match.name : `${match.t1} vs ${match.t2}`;
            return {
                name: name,
                status: match.status,
                t1: match.t1,
                t2: match.t2,
                t1s: match.t1s,
                t2s: match.t2s
            };
        });

        console.log({ relevantData });

        const matchListHTML = relevantData.map(match => `
            <li>
                <div class="match-name"><strong>${match.name}</strong> (${match.status})</div>
                <div class="team-scores">
                    <div class="team-score">${match.t1} ${match.t1s ? '(' + match.t1s + ')' : ''}</div>
                    <div class="team-score">${match.t2} ${match.t2s ? '(' + match.t2s + ')' : ''}</div>
                </div>
            </li>
        `).join('');

        document.getElementById("matches").innerHTML = matchListHTML;

        return relevantData;
    } catch (error) {
        console.error("Error fetching match data:", error);
    }
}

getMatchData();
