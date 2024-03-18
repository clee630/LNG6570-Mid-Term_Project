PennController.ResetPrefix(null);
DebugOff();

// Control trial sequence
Sequence("instructions", randomize("experimental-trial"), "send", "completion_screen");

// Instructions
newTrial("instructions",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newText("instructions-1", "Welcome!"),
    newText("instructions-2", "In this experiment, you will hear and read a sentence, and see two images."),
    newText("instructions-3", "<b>Select the image that better matches the sentence:</b>"),
    newText("instructions-4", "Press the <b>F</b> key to select the image on the left.<br>Press the <b>J</b> key to select the image on the right.<br>You can also click on an image to select it."),
    newText("instructions-5", "Please enter your ID and then click the button below to start the experiment."),
    newTextInput("input_ID")
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newButton("wait", "Click to start the experiment")
        .center()
        .print()
        .wait(),
    newVar("ID")
        .global()
        .set(getTextInput("input_ID"))
);

Template("input.csv", row =>
    newTrial("experimental-trial",
        newAudio("audio", row.Audio_file)
            .play(),
        newTimer("audioDelay", 500) // Add a delay of 500 ms after playing audio
            .start()
            .wait(),
        newImage("Image 1", row.Image_file) // Use consistent naming convention
            .size(200, 200),
        newImage("Image 2", row.Image_file2) // Use consistent naming convention
            .size(200, 200),
        newCanvas("side-by-side", 450, 200)
            .add(0, 0, getImage("Image 1"))
            .add(250, 0, getImage("Image 2"))
            .center()
            .print()
            .log(),
        newVar("RT")  // Create a new variable for reaction time
            .settings.global() // Make it global
            .set(0), // Initialize reaction time variable
        newVar("Accuracy")
            .global()
            .set(0), // Initialize accuracy variable
        newSelector("selection")
            .add(getImage("Image 1"), getImage("Image 2"))
            .shuffle()
            .keys("F", "J")
            .log()
            .wait(), // Wait for response
        newTimer("timeout", row.Duration)
            .start()
            .wait(),
        getAudio("audio")
            .wait("first"),
        getVar("RT")
            .set(v => Date.now()), // Set initial reaction time
        newVar("CorrectResponse")
            .set(row.Image_file), // Set correct response
        getSelector("selection")
            .test.selected()
            .success(
                getVar("Accuracy").set(1) // Set accuracy to 1 if correct
            )
            .failure(
                getVar("Accuracy").set(0) // Set accuracy to 0 if incorrect
            )
            .log(), // Log the accuracy
        getVar("RT")
            .set(v => Date.now() - v), // Calculate the reaction time
    )
    .log("group", row.Group)
    .log("ID", getVar("ID"))
    .log("RT", getVar("RT")) // Log the reaction time
    .log("Accuracy", getVar("Accuracy")) // Log the accuracy
    .log("CorrectResponse", getVar("CorrectResponse")) // Log the correct response
);



// Send results manually
SendResults("send");

// Completion screen
newTrial("completion_screen",
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .center()
        .print(),
    newButton("wait", "")
        .wait()
);
