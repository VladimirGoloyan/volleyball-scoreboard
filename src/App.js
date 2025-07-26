import React, {useState, useEffect} from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
    Container,
    Button,
    Typography,
    Box,
    Stack,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    FormControlLabel,
    Switch,
} from "@mui/material";
import logo from "./vfa.png";
import am from "./flags/am.svg";
import at from "./flags/at.svg";
import bg from "./flags/bg.svg";
import cz from "./flags/cz.svg";
import fr from "./flags/fr.svg";
import gr from "./flags/gr.svg";
import hu from "./flags/hu.svg";
import it from "./flags/it.svg";
import lv from "./flags/lv.svg";
import pl from "./flags/pl.svg";
import ro from "./flags/ro.svg";
import rs from "./flags/rs.svg";
import si from "./flags/si.svg";
import es from "./flags/es.svg";
import tr from "./flags/tr.svg";
import ua from "./flags/ua.svg";

const FLAGS = {
    am,
    at,
    bg,
    cz,
    fr,
    gr,
    hu,
    it,
    lv,
    pl,
    ro,
    rs,
    si,
    es,
    tr,
    ua,
};
const channel = new BroadcastChannel("scoreboard");

const COUNTRIES = [
    {name: "ARMENIA", code: "AM"},
    {name: "AUSTRIA", code: "AT"},
    {name: "BULGARIA", code: "BG"},
    {name: "CZECHIA", code: "CZ"},
    {name: "FRANCE", code: "FR"},
    {name: "GREECE", code: "GR"},
    {name: "HUNGARY", code: "HU"},
    {name: "ITALY", code: "IT"},
    {name: "LATVIA", code: "LV"},
    {name: "POLAND", code: "PL"},
    {name: "ROMANIA", code: "RO"},
    {name: "SERBIA", code: "RS"},
    {name: "SLOVENIA", code: "SI"},
    {name: "SPAIN", code: "ES"},
    {name: "TÜRKIYE", code: "TR"},
    {name: "UKRAINE", code: "UA"},
];

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Control/>}/>
                <Route path="/display" element={<Display/>}/>
            </Routes>
        </Router>
    );
}

function Control() {

    const saved = localStorage.getItem("scoreState");
    let initialState = {};
    if (saved) {
        const parsed = JSON.parse(saved);
        initialState.teamA = parsed.teamA;
        initialState.teamB = parsed.teamB;
        initialState.scoreA = parsed.scoreA;
        initialState.scoreB = parsed.scoreB;
        initialState.setsA = parsed.setsA;
        initialState.setsB = parsed.setsB;
        initialState.timeoutsA = parsed.timeoutsA;
        initialState.timeoutsB = parsed.timeoutsB;
        initialState.isHidden = parsed.isHidden;
    }
    const [teamA, setTeamA] = useState(initialState.teamA || COUNTRIES[0].name);
    const [teamB, setTeamB] = useState(initialState.teamB || COUNTRIES[1].name);
    const [scoreA, setScoreA] = useState(initialState.scoreA || 0);
    const [scoreB, setScoreB] = useState(initialState.scoreB || 0);
    const [setsA, setSetsA] = useState(initialState.setsA || 0);
    const [setsB, setSetsB] = useState(initialState.setsB || 0);
    const [timeoutsA, setTimeoutsA] = useState(initialState.timeoutsA || [false, false]);
    const [timeoutsB, setTimeoutsB] = useState(initialState.timeoutsB || [false, false]);
    const [isHidden, setIsHidden] = useState(initialState.isHidden || false);
    const [isInverse, setIsInverse] = useState(initialState.isInverse || false);

    // ✅ Save state whenever something changes
    useEffect(() => {
        const state = {
            teamA,
            teamB,
            scoreA,
            scoreB,
            setsA,
            setsB,
            timeoutsA,
            timeoutsB,
            isHidden,
            isInverse,
        };
        localStorage.setItem("scoreState", JSON.stringify(state));
        channel.postMessage(state);
    }, [teamA, teamB, scoreA, scoreB, setsA, setsB, timeoutsA, timeoutsB, isHidden, isInverse]);

    const toggleTimeout = (team, index) => {
        if (team === "A") {
            const copy = [...timeoutsA];
            copy[index] = !copy[index];
            setTimeoutsA(copy);
        } else {
            const copy = [...timeoutsB];
            copy[index] = !copy[index];
            setTimeoutsB(copy);
        }
    };

    const resetScores = () => {
        setScoreA(0);
        setScoreB(0);
        setTimeoutsA([false, false]);
        setTimeoutsB([false, false]);
    };

    const resetAll = () => {
        setScoreA(0);
        setScoreB(0);
        setSetsA(0);
        setSetsB(0);
        setTeamA(COUNTRIES[0].name);
        setTeamB(COUNTRIES[1].name);
        setTimeoutsA([false, false]);
        setTimeoutsB([false, false]);
        setIsHidden(true);
    };

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            <Paper sx={{p: 3}}>
                <Typography variant="h4" gutterBottom>
                    🏐 Volleyball Scoreboard
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={isHidden}
                            onChange={(e) => setIsHidden(e.target.checked)}
                        />
                    }
                    label="Hide Display (show logo)"
                    sx={{mb: 3}}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={isInverse}
                            onChange={(e) => setIsInverse(e.target.checked)}
                        />
                    }
                    label="Inverse Display (swap teams)"
                    sx={{mb: 3}}
                />
                <Stack direction="row" spacing={2} justifyContent="space-between" mb={3}>

                    {/* Team A */}
                    <Stack direction="column" spacing={2} alignItems="center" mb={2}>
                        <FormControl sx={{minWidth: 160}}>
                            <InputLabel>Team A</InputLabel>
                            <Select
                                value={teamA}
                                onChange={(e) => setTeamA(e.target.value)}
                            >
                                {COUNTRIES.map((c) => (
                                    <MenuItem key={c.code} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography>Score</Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Button
                                variant="outlined"
                                onClick={() => setScoreA(Math.max(scoreA - 1, 0))}
                            >
                                -
                            </Button>
                            <Typography variant="h6">{scoreA}</Typography>
                            <Button variant="contained" onClick={() => setScoreA(scoreA + 1)}>
                                +
                            </Button>
                        </Stack>
                        <Typography>Set Score</Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Button variant="outlined" onClick={() => setSetsA(Math.max(setsA - 1, 0))}>-</Button>
                            <Typography>{setsA}</Typography>
                            <Button variant="contained" onClick={() => setSetsA(setsA + 1)}>+</Button>
                        </Stack>

                        <Box>
                            <Typography variant="subtitle1">Team A Timeouts</Typography>
                            {timeoutsA.map((t, i) => (
                                <IconButton
                                    key={i}
                                    onClick={() => toggleTimeout("A", i)}
                                    sx={{fontSize: 32}}
                                >
                                    {t ? "●" : "○"}
                                </IconButton>
                            ))}
                        </Box>
                    </Stack>

                    {/* Team B */}
                    <Stack direction="column" spacing={2} alignItems="center" mb={2}>
                        <FormControl sx={{minWidth: 160}}>
                            <InputLabel>Team B</InputLabel>
                            <Select
                                value={teamB}
                                onChange={(e) => setTeamB(e.target.value)}
                            >
                                {COUNTRIES.map((c) => (
                                    <MenuItem key={c.code} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <Typography>Score</Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>

                            <Button
                                variant="outlined"
                                onClick={() => setScoreB(Math.max(scoreB - 1, 0))}
                            >
                                -
                            </Button>
                            <Typography variant="h6">{scoreB}</Typography>
                            <Button variant="contained" onClick={() => setScoreB(scoreB + 1)}>
                                +
                            </Button>
                        </Stack>


                        <Typography>Set Score</Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Button variant="outlined" onClick={() => setSetsB(Math.max(setsB - 1, 0))}>-</Button>
                            <Typography>{setsB}</Typography>
                            <Button variant="contained" onClick={() => setSetsB(setsB + 1)}>+</Button>
                        </Stack>

                        <Box>
                            <Typography variant="subtitle1">Team B Timeouts</Typography>
                            {timeoutsB.map((t, i) => (
                                <IconButton
                                    key={i}
                                    onClick={() => toggleTimeout("B", i)}
                                    sx={{fontSize: 32}}
                                >
                                    {t ? "●" : "○"}
                                </IconButton>
                            ))}
                        </Box>

                    </Stack>

                </Stack>

                {/* Reset & Display */}
                <Stack direction="row" spacing={2} mt={3}>
                    <Button variant="contained" color="secondary" onClick={resetScores}>
                        Reset Scores
                    </Button>
                    <Button variant="outlined" color="error" onClick={resetAll}>
                        Reset All
                    </Button>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/display"
                        target="_blank"
                    >
                        Open Display
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

function Display() {
    const [state, setState] = useState({
        teamA: COUNTRIES[0].name,
        teamB: COUNTRIES[1].name,
        scoreA: 0,
        scoreB: 0,
        setsA: 0,
        setsB: 0,
        timeoutsA: [false, false],
        timeoutsB: [false, false],
        isHidden: false,
        isInverse: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem("scoreState");
        if (saved) setState(JSON.parse(saved));
        channel.onmessage = (e) => setState(e.data);
    }, []);


    const getFlagUrl = (countryName) => {
        const c = COUNTRIES.find((c) => c.name === countryName);
        if (!c) return "";
        const code = c.code.toLowerCase();
        return FLAGS[code] || "";
    };

    const renderTimeouts = (timeouts) => (
        <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
            {timeouts.map((t, i) => (
                <Typography key={i} sx={{fontSize: 60}}>
                    {t ? "●" : "○"}
                </Typography>
            ))}
        </Stack>
    );

    const renderTeamA = () =>
        <Box textAlign="center" sx={{width: "30vw"}}>
            <Typography variant="h1">{state.teamA}</Typography>
            <img
                src={getFlagUrl(state.teamA)}
                alt={state.teamA}
                style={{
                    width: 500, height: 300,
                    objectFit: "cover",
                    marginTop: 8
                }}
            />
            {renderTimeouts(state.timeoutsA)}
        </Box>

        const renderTeamB = () =>
            <Box textAlign="center" sx={{width: "30vw"}}>
                <Typography variant="h1">{state.teamB}</Typography>
                <img
                    src={getFlagUrl(state.teamB)}
                    alt={state.teamB}
                    style={{
                        width: 500, height: 300,
                        objectFit: "cover",
                        marginTop: 8
                    }}
                />
                {renderTimeouts(state.timeoutsB)}
            </Box>

    const renderScore = (inverse) => {
        return <Box sx={{width: "40vw", display: "flex", alignItems: "center"}}>
            <Typography sx={{fontSize: "14vw", width: "20vw", textAlign: "center"}}>
                {inverse ? state.scoreB : state.scoreA}
            </Typography>
            <Typography variant="h1" sx={{width: "10vw", textAlign: "center", fontSize: "10vw"}}>
                -
            </Typography>
            <Typography sx={{fontSize: "14vw", width: "20vw", textAlign: "center"}}>
                {inverse ? state.scoreA : state.scoreB}
            </Typography>
        </Box>
    }

    const renderSetScore = (inverse) => {
        return <Box sx={{display: "flex", width: "15vw", justifyContent: "space-around"}}>
            <Typography variant="h1">{inverse ? state.setsB : state.setsA}</Typography>
            <Typography variant="h1">-</Typography>
            <Typography variant="h1">{inverse ? state.setsA : state.setsB}</Typography>
        </Box>
    }

    const renderDisplay = () => {
       return  <Box
            sx={{
                display: "flex",
                width: "100vw",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
           {state.isInverse ? (
               <>
                   {renderTeamB()}
                   {renderScore(true)}
                   {renderTeamA()}
               </>
           ) : (
               <>
                   {renderTeamA()}
                   {renderScore(false)}
                   {renderTeamB()}
               </>
           )}
        </Box>
    }

    if (state.isHidden) {
        return (
            <Box
                sx={{
                    backgroundColor: "#000",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{height: '100vh'}}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                backgroundColor: "#000",
                color: "#fff",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box sx={{pt: 8, height: "20vh", mb: 4}}>
                <Typography variant="h2" sx={{fontWeight: 800}}>CEV U16 Volleyball European Championship</Typography>
            </Box>
            <Box
                sx={{
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {renderDisplay()}
                {renderSetScore(state.isInverse)}
            </Box>
        </Box>
    );
}
