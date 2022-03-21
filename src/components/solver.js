import React from "react";
import { useState, useEffect } from "react";
import { IconButton, TextField, Typography } from "@mui/material";
import { Button, Stack, Grid, Box } from "@mui/material";
import words from "./words";
import commonWords from "./commonWords";
import CircularProgress from "@mui/material/CircularProgress";
import getBestSuggestion from "./getBestSuggestion";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import { InfoOutlined } from "@mui/icons-material";

export default function WsordleSolver(props) {
  const [word, setWord] = useState("");
  const [possibleCharacters, setPossibleCharacters] = useState("");
  const [alreadyGuessed, setAlreadyGuessed] = useState("");
  const [availableWords, setAvailableWords] = useState(null);
  const [suggestionWord, setSuggestionWord] = useState("");
  const [secondBestSuggestion, setSecondBestSuggestion] = useState("");
  const [thirdBestSuggestion, setThirdBestSuggestion] = useState("");
  const [possibleCharacterHistory, setPossibleCharacterHistory] = useState([]);

  const [invalidCharacters, setInvalidCharacters] = useState("");
  const [firstGuess, setFirstGuess] = useState("");
  const [secondGuess, setSecondGuess] = useState("");
  const [thirdGuess, setThirdGuess] = useState("");
  const [fourthGuess, setFourthGuess] = useState("");
  const [fifthGuess, setFifthGuess] = useState("");
  const [firstFocused, setFirstFocused] = useState(false);
  const [secondFocused, setSecondFocused] = useState(false);
  const [thirdFocused, setThirdFocused] = useState(false);
  const [fourthFocused, setFourthFocused] = useState(false);
  const [fifthFocused, setFifthFocused] = useState(false);

  const [firstColor, setFirstColor] = useState("");
  const [secondColor, setSecondColor] = useState("");
  const [thirdColor, setThirdColor] = useState("");
  const [fourthColor, setFourthColor] = useState("");
  const [fifthColor, setFifthColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [pastGuesses, setPastGuesses] = useState([]);
  const [pastColors, setPastColors] = useState([]);

  const [allAvailableChars, setAllAvailableChars] = useState(new Set());

  const clearStates = () => {
    setWord("");
    setPossibleCharacters("");
    setAlreadyGuessed("");
    setAvailableWords(null);
    setSuggestionWord("");
    setSecondBestSuggestion("");
    setThirdBestSuggestion("");
    setPossibleCharacterHistory([]);
    setAllAvailableChars(new Set());

    setFirstColor("");
    setSecondColor("");
    setThirdColor("");
    setFourthColor("");
    setFifthColor("");

    setFirstGuess("");
    setSecondGuess("");
    setThirdGuess("");
    setFourthGuess("");
    setFifthGuess("");
    setPastGuesses([]);
    setPastColors([]);
  };

  const clearColors = () => {
    setFirstColor("");
    setSecondColor("");
    setThirdColor("");
    setFourthColor("");
    setFifthColor("");

    setFirstGuess("");
    setSecondGuess("");
    setThirdGuess("");
    setFourthGuess("");
    setFifthGuess("");
  };

  const handleSubmitFunc = async () => {
    await handleSubmit();
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    let wordString = "";
    let colorArray = [
      firstColor,
      secondColor,
      thirdColor,
      fourthColor,
      fifthColor,
    ];
    let guessArray = [
      firstGuess,
      secondGuess,
      thirdGuess,
      fourthGuess,
      fifthGuess,
    ];

    let newPastGuesses = [...pastGuesses];
    newPastGuesses.push(guessArray);
    setPastGuesses(newPastGuesses);
    let newPastColors = [...pastColors];
    newPastColors.push(colorArray);
    setPastColors(newPastColors);

    let posChar = "";
    for (let i = 0; i < 5; ++i) {
      if (colorArray[i] === "yellow") {
        posChar = posChar + guessArray[i].toLowerCase();
        let addThese = allAvailableChars;
        addThese = addThese.add(guessArray[i].toLowerCase());
        setAllAvailableChars(addThese);
      } else {
        posChar = posChar + "-";
      }
    }
    setPossibleCharacters(posChar);

    for (let i = 0; i < 5; ++i) {
      if (colorArray[i] === "green") {
        wordString = wordString + guessArray[i].toLowerCase();
        let addThese = allAvailableChars;
        addThese = addThese.add(guessArray[i].toLowerCase());
        setAllAvailableChars(addThese);
      } else {
        wordString = wordString + "-";
      }
    }
    setWord(wordString);

    let invalidChar = alreadyGuessed;
    for (let i = 0; i < 5; ++i) {
      if (colorArray[i] === "input") {
        let possibleChars = [];
        if (
          (alreadyGuessed.indexOf(guessArray[i]) === -1 ||
            alreadyGuessed === "") &&
          posChar.indexOf(guessArray[i]) === -1 &&
          wordString.indexOf(guessArray[i] === -1)
        )
          invalidChar = invalidChar + guessArray[i].toLowerCase();
      }
    }
    setAlreadyGuessed(invalidChar);

    let possibleWords = words;
    let array = possibleCharacterHistory;
    array.push(posChar);
    setPossibleCharacterHistory(array);

    for (let i = 0; i < 5; ++i) {
      //filter already guessed characters
      let newArray = possibleWords.filter(function (str) {
        let valid = true;
        for (let i = 0; i < invalidChar.length; ++i) {
          if (str.indexOf(invalidChar.at(i)) !== -1) {
            valid = false;
          }
        }
        return valid;
      });
      possibleWords = newArray;
    }

    for (let i = 0; i < 5; ++i) {
      //make sure possible words only includes words with possible characters
      let newArray = possibleWords.filter(function (str) {
        let valid = true;
        for (let j = 0; j < array.length; ++j) {
          let value = array[j];
          for (let i = 0; i < value.length; ++i) {
            if (value.at(i) !== "-") {
              if (str.indexOf(value.at(i)) === -1) {
                valid = false;
              }
              if (str.at(i) === value.at(i)) {
                valid = false;
              }
            }
          }
        }
        return valid;
      });
      possibleWords = newArray;
      newArray = [];
    }

    //Rule out words without all of the words in the word, or possible characters

    let newArray = [];
    newArray = possibleWords.filter(function (str) {
      let valid = true;
      for (let i = 0; i < 5; ++i) {
        if (wordString.at(i) !== "-") {
          if (str.at(i) !== wordString.at(i)) {
            valid = false;
          }
        }
      }
      return valid;
    });
    possibleWords = newArray;
    newArray = [];

    await setAvailableWords(possibleWords);

    console.log(possibleWords);
    console.log(invalidChar);
    console.log(allAvailableChars.size);

    if (possibleWords.length < 250) {
      let data = await getBestSuggestion(
        possibleWords,
        invalidChar,
        allAvailableChars,
        commonWords
      );
      setSuggestionWord(data.suggestion);
      setSecondBestSuggestion(data.second);
      setThirdBestSuggestion(data.third);
    } else {
      let found = false;
      let data = "";
      for (let i = 0; i < commonWords.length; ++i) {
        if (possibleWords.indexOf(commonWords[i]) !== -1) {
          data = commonWords[i];
          console.log(data);
          setSuggestionWord(data);
        }
      }
      if (data === "") {
        let first = "";
        let second = "";
        let third = "";
        for (let i = 0; i < commonWords.length; ++i) {
          if (first === "") {
            if (isUnique(possibleWords[i])) {
              first = possibleWords[i];
              setSuggestionWord(possibleWords[i]);
            }
          } else if (second === "") {
            if (isUnique(possibleWords[i])) {
              second = possibleWords[i];
              setSecondBestSuggestion(possibleWords[i]);
            }
          } else if (third === "") {
            if (isUnique(possibleWords[i])) {
              third = possibleWords[i];
              setThirdBestSuggestion(possibleWords[i]);
            }
          }
        }
      }
    }

    clearColors();
    setLoading(false);
  };

  const isUnique = (str) => {
    return new Set(str).size == str.length;
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{mt: 3}}
      >
        <h3>
          Hard Mode Wordle Helper{" "}
          <Tooltip title="Information">
            <IconButton>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </h3>
        {!loading
          ? pastGuesses.map((guessArray, arrayIndex) => {
              return (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: 0.5, marginBottom: 2 }}
                  textAlign="center"
                >
                  {guessArray.map((guessNum, index) => {
                    return (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            p: 0,
                            m: 0,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            justifyContent: "center",
                          }}
                        >
                          {pastColors[arrayIndex].at(index) === "green" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "success.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : pastColors[arrayIndex].at(index) === "input" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "secondary.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : pastColors[arrayIndex].at(index) === "yellow" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "warning.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : (
                            ""
                          )}
                        </Box>
                      </>
                    );
                  })}
                </Stack>
              );
            })
          : ""}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ width: 0.5, marginBottom: 2 }}
          textAlign="center"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
              justifyContent: "center",
            }}
          >
            {firstColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  document.getElementById("box2").focus();
                  setFirstColor("input");
                }}
                autoFocus={true}
              />
            ) : firstColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  document.getElementById("box2").focus();
                  setFirstColor("input");
                }}
                autoFocus={true}
              />
            ) : firstColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  document.getElementById("box2").focus();
                  setFirstColor("input");
                }}
                autoFocus={true}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  document.getElementById("box2").focus();
                  setFirstColor("input");
                }}
                autoFocus={true}
              />
            )}
            <Button
              onClick={() => {
                if (firstColor === "input") {
                  setFirstColor("green");
                } else if (firstColor === "green") {
                  setFirstColor("yellow");
                } else {
                  setFirstColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {secondColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  document.getElementById("box3").focus();
                  setSecondColor("input");
                }}
              />
            ) : secondColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  document.getElementById("box3").focus();
                  setSecondColor("input");
                }}
              />
            ) : secondColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  document.getElementById("box3").focus();
                  setSecondColor("input");
                }}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  document.getElementById("box3").focus();
                  setSecondColor("input");
                }}
              />
            )}
            <Button
              onClick={() => {
                if (secondColor === "input") {
                  setSecondColor("green");
                } else if (secondColor === "green") {
                  setSecondColor("yellow");
                } else {
                  setSecondColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {thirdColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  document.getElementById("box4").focus();
                  setThirdColor("input");
                }}
              />
            ) : thirdColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  document.getElementById("box4").focus();
                  setThirdColor("input");
                }}
              />
            ) : thirdColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  document.getElementById("box4").focus();
                  setThirdColor("input");
                }}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  document.getElementById("box4").focus();
                  setThirdColor("input");
                }}
              />
            )}
            <Button
              onClick={() => {
                if (thirdColor === "input") {
                  setThirdColor("green");
                } else if (thirdColor === "green") {
                  setThirdColor("yellow");
                } else {
                  setThirdColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {fourthColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  document.getElementById("box5").focus();
                  setFourthColor("input");
                }}
              />
            ) : fourthColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  document.getElementById("box5").focus();
                  setFourthColor("input");
                }}
              />
            ) : fourthColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  document.getElementById("box5").focus();
                  setFourthColor("input");
                }}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  document.getElementById("box5").focus();
                  setFourthColor("input");
                }}
              />
            )}
            <Button
              onClick={() => {
                if (fourthColor === "input") {
                  setFourthColor("green");
                } else if (fourthColor === "green") {
                  setFourthColor("yellow");
                } else {
                  setFourthColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {fifthColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  document.getElementById("box1").focus();
                  setFifthColor("input");
                }}
              />
            ) : fifthColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  document.getElementById("box1").focus();
                  setFifthColor("input");
                }}
              />
            ) : fifthColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  document.getElementById("box1").focus();
                  setFifthColor("input");
                }}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  document.getElementById("box1").focus();
                  setFifthColor("input");
                }}
              />
            )}
            <Button
              onClick={() => {
                if (fifthColor === "input") {
                  setFifthColor("green");
                } else if (fifthColor === "green") {
                  setFifthColor("yellow");
                } else {
                  setFifthColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            p: 0,
            m: 0,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Button
            onClick={() => {
              handleSubmitFunc();
              document.getElementById("box1").focus();
            }}
            variant="contained"
            id="getSuggestion"
            sx={{ marginRight: 2 }}
            color="info"
          >
            Get Suggestion
          </Button>
          <Button
            onClick={() => {
              clearStates();
              document.getElementById("box1").focus();
            }}
            variant="contained"
            color="info"
          >
            I Got It!
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {suggestionWord !== "" ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  margin: 2
                }}
              >
                <nav aria-label="secondary mailbox folders">
                  <List>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemText
                          primary={
                            suggestionWord !== ""
                              ? `Suggestion 1: ${suggestionWord.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton component="a" href="#simple-list">
                        <ListItemText
                          primary={
                            secondBestSuggestion !== ""
                              ? `Suggestion 2: ${secondBestSuggestion.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton component="a" href="#simple-list">
                        <ListItemText
                          primary={
                            thirdBestSuggestion !== ""
                              ? `Suggestion 3: ${thirdBestSuggestion.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </List>
                </nav>
              </Box>
            ) : (
              ""
            )}

            {availableWords ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Available Words</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      {availableWords ? "Available Words: " : ""}
                      {availableWords?.map((word) => {
                        return word + " ";
                      })}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ) : (
              ""
            )}
          </>
        )}
      </Grid>
    </>
  );
}
