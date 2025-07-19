import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

const channel = new BroadcastChannel("scoreboard");

const COUNTRIES = [
  { name: "ARMENIA", code: "AM" },
  { name: "AUSTRIA", code: "AT" },
  { name: "BULGARIA", code: "BG" },
  { name: "CZECHIA", code: "CZ" },
  { name: "FRANCE", code: "FR" },
  { name: "GREECE", code: "GR" },
  { name: "HUNGARY", code: "HU" },
  { name: "ITALY", code: "IT" },
  { name: "LATVIA", code: "LV" },
  { name: "POLAND", code: "PL" },
  { name: "ROMANIA", code: "RO" },
  { name: "SERBIA", code: "RS" },
  { name: "SLOVENIA", code: "SI" },
  { name: "SPAIN", code: "ES" },
  { name: "TÜRKIYE", code: "TR" },
  { name: "UKRAINE", code: "UA" },
];

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Control />} />
          <Route path="/display" element={<Display />} />
        </Routes>
      </Router>
  );
}

function Control() {
  const [teamA, setTeamA] = useState(COUNTRIES[0].name);
  const [teamB, setTeamB] = useState(COUNTRIES[1].name);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [timeoutsA, setTimeoutsA] = useState([false, false]);
  const [timeoutsB, setTimeoutsB] = useState([false, false]);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoreState"));
    if (saved) {
      setTeamA(saved.teamA);
      setTeamB(saved.teamB);
      setScoreA(saved.scoreA);
      setScoreB(saved.scoreB);
      setSetsA(saved.setsA);
      setSetsB(saved.setsB);
      setTimeoutsA(saved.timeoutsA || [false, false]);
      setTimeoutsB(saved.timeoutsB || [false, false]);
      setIsHidden(saved.isHidden || true);
    }
  }, []);

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
    };
    channel.postMessage(state);
    localStorage.setItem("scoreState", JSON.stringify(state));
  }, [teamA, teamB, scoreA, scoreB, setsA, setsB, timeoutsA, timeoutsB, isHidden]);

  const resetScores = () => {
    setScoreA(0);
    setScoreB(0);
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
  };

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

  return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
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
              sx={{ mb: 3 }}
          />

          {/* Team A */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Team A</InputLabel>
              <Select
                  value={teamA}
                  label="Team A"
                  onChange={(e) => setTeamA(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.name}>
                      {c.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => setScoreA(scoreA + 1)}>
              +1
            </Button>
            <Button
                variant="outlined"
                onClick={() => setScoreA(Math.max(scoreA - 1, 0))}
            >
              -1
            </Button>
            <Typography variant="h6">{scoreA}</Typography>
          </Stack>

          {/* Team B */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Team B</InputLabel>
              <Select
                  value={teamB}
                  label="Team B"
                  onChange={(e) => setTeamB(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.name}>
                      {c.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => setScoreB(scoreB + 1)}>
              +1
            </Button>
            <Button
                variant="outlined"
                onClick={() => setScoreB(Math.max(scoreB - 1, 0))}
            >
              -1
            </Button>
            <Typography variant="h6">{scoreB}</Typography>
          </Stack>

          {/* Sets */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button onClick={() => setSetsA(setsA + 1)}>A +1</Button>
            <Typography>{setsA}</Typography>
            <Button onClick={() => setSetsA(Math.max(setsA - 1, 0))}>A -1</Button>
            <Button onClick={() => setSetsB(setsB + 1)}>B +1</Button>
            <Typography>{setsB}</Typography>
            <Button onClick={() => setSetsB(Math.max(setsB - 1, 0))}>B -1</Button>
          </Stack>

          {/* Timeouts */}
          <Stack direction="row" spacing={4} mb={2}>
            <Box>
              <Typography variant="subtitle1">Team A Timeouts</Typography>
              {timeoutsA.map((t, i) => (
                  <IconButton
                      key={i}
                      onClick={() => toggleTimeout("A", i)}
                      sx={{ fontSize: 32 }}
                  >
                    {t ? "●" : "○"}
                  </IconButton>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1">Team B Timeouts</Typography>
              {timeoutsB.map((t, i) => (
                  <IconButton
                      key={i}
                      onClick={() => toggleTimeout("B", i)}
                      sx={{ fontSize: 32 }}
                  >
                    {t ? "●" : "○"}
                  </IconButton>
              ))}
            </Box>
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
    isHidden: true,
  });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoreState"));
    if (saved) setState(saved);
    channel.onmessage = (e) => setState(e.data);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date) => {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return `${date.toLocaleDateString(undefined, optionsDate)}  ${date.toLocaleTimeString(undefined, optionsTime)}`;
  };

  const getFlagUrl = (countryName) => {
    const c = COUNTRIES.find((c) => c.name === countryName);
    return c ? `https://flagcdn.com/w320/${c.code.toLowerCase()}.png` : "";
  };

  const renderTimeouts = (timeouts) => (
      <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
        {timeouts.map((t, i) => (
            <Typography key={i} sx={{ fontSize: 40 }}>
              {t ? "●" : "○"}
            </Typography>
        ))}
      </Stack>
  );

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
          {/* Replace src with your own logo */}
          <img
              src="vfa.jpg"
              alt="Logo"
              style={{ maxWidth: "60%", maxHeight: "60%" }}
          />
        </Box>
    );
  }

  const SX = {
    flag: {
      width: 300,
      height: 150,
      marginTop: 8
    },
    teamNameContainer: {
      width: '35vw'
    },
    score: {
      width: '30vw',
      display: 'flex',
      alignItems: 'center'
    },
    teamScore: {
      fontSize: '10vw',
      width:'12vw',
      textAlign: 'center',
    }

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
        {/* Live Date/Time */}
        <Box sx={{
          pt: 4,
          height: '30vh',
          mb: 4,
        }}>
          <Typography variant="h2">
            {formatDateTime(now)}
          </Typography>
        </Box>
        <Box sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {/* Scoreboard */}
        <Box
            sx={{
              display: "flex",
              width: '100vw',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
        >
          {/* Team A */}
          <Box textAlign="center" sx={SX.teamNameContainer}>
            <Typography variant="h1">{state.teamA}</Typography>
            <img
                src={getFlagUrl(state.teamA)}
                alt={state.teamA}
                style={SX.flag}
            />
            {renderTimeouts(state.timeoutsA)}
          </Box>

          <Box sx={SX.score} >
            <Typography sx={SX.teamScore}>
              {state.scoreA}
            </Typography>
            <Typography variant='h1' sx={{width: '6vw', textAlign: 'center', fontSize: '10vw'}}>
              -
            </Typography>

            <Typography sx={SX.teamScore}>
              {state.scoreB}
            </Typography>
          </Box>

          {/* Team B */}
          <Box textAlign="center" sx={SX.teamNameContainer}>
            <Typography variant="h1">{state.teamB}</Typography>
            <img
                src={getFlagUrl(state.teamB)}
                alt={state.teamB}
                style={SX.flag}
            />
            {renderTimeouts(state.timeoutsB)}
          </Box>
        </Box>

          <Box sx={{
            display: 'flex',
            width: '10vw',
            justifyContent: 'space-around',
          }}>
            <Typography variant="h1">
              {state.setsA}
            </Typography>
            <Typography variant="h1">
              -
            </Typography>
            <Typography variant="h1">
              {state.setsB}
            </Typography>

          </Box>
        </Box>
      </Box>
  );
}
