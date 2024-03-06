PennController.ResetPrefix(null);
DebugOff()

// Define stimuli
const conditions = {
    1: "control",
    2: "imaginable",
    3: "non_imaginable"
};

const audioFolders = {
    "control": "audio/control/",
    "imaginable": "audio/imaginable/",
    "non_imaginable": "audio/non_imaginable/"
};

const conditionWords = {
    "control": ["word1_control", "word2_control", "word3_control"],
    "imaginable": ["word1_imaginable", "word2_imaginable", "word3_imaginable"],
    "non_imaginable": ["word1_non_imaginable", "word2_non_imaginable", "word3_non_imaginable"]
};
// Define function to play audio for each condition
function playAudio(condition) {
    let words = shuffle(conditionWords[condition]); // Shuffle the words within the condition
    let promises = [];
    for (let word of words) {
        let audioFile = audioFolders[condition] + word + ".mp3";
        let audioPromise = new Promise((resolve, reject) => {
            let audio = newAudio("wordAudio", audioFile);
            audio.play().then(() => {
                resolve(); // Resolve the promise when audio playback is complete
            }).catch(error => {
                reject(error); // Reject the promise if there is an error
            });
        });
        promises.push(audioPromise);
        promises.push(newTimer("delay", 500).start().wait()); // Adjust delay as needed
    }
    return Promise.all(promises); // Return a promise that resolves when all audio and delays are completed
}


// Participant-Condition Sequence
const sequence = [
    [1, 1, 2, 3],
    [2, 2, 3, 1],
    [3, 3, 1, 2]
];

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the experiment
PennController.DebugOff();

sequence.forEach(participant => {
    let participantID = participant[0];
    let conditionSequence = participant.slice(1);
    
    conditionSequence.forEach((condition, index) => {
        PennController.Sequence(
            // Display instructions here if needed
            ["experiment", "participant" + participantID + "_condition" + condition, newTimer("delay", 500).start().wait()]
        );
    });
});

// Define trials for each condition
for (let participant = 1; participant <= 3; participant++) {
    for (let condition = 1; condition <= 3; condition++) {
        let conditionName = conditions[condition];
        PennController("participant" + participant + "_condition" + condition, async function() {
            await playAudio(conditionName);
            PennController.Submit();
        });
    }
}
