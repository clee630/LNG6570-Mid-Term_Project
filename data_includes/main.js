PennController.ResetPrefix(null);
DebugOff();

Sequence("instructions", randomize("experimental-trial"), "send", "completion_screen");

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
        newImage("Image 1", row.Image_file)
            .size(200, 200),
        newImage("Image 2", row.Image_file2)
            .size(200, 200),
        newVar("accuracy") // Create a new variable for accuracy
            .settings.global(), // Make it global
        newVar("reaction_time") // Create a new variable for reaction time
            .settings.global() // Make it global
            .set(v => Date.now()), // Set it to the current time
        newCanvas("side-by-side", 450, 200)
            .add(0, 0, getImage("Image 1"))
            .add(250, 0, getImage("Image 2"))
            .center()
            .print()
            .log(),
        newSelector("selection")
            .add(getImage("Image 1"), getImage("Image 2"))
            .shuffle()
            .keys("F", "J")
            .log()
            .wait(), // Wait for response
        getVar("reaction_time")
            .set(v => Date.now() - v), // Calculate reaction time
        newTimer("timeout", row.Duration)
            .start()
            .wait(),
        getAudio("audio")
            .wait("first"),
        // Set accuracy based on selection
        getSelector("selection")
            .test.selected(getImage("Image 1")) // Check if Image 1 is selected
            .success(getVar("accuracy").set(1)) // Set accuracy to 1 if correct
            .failure(getVar("accuracy").set(0)) // Set accuracy to 0 if incorrect
    )
    .log("ID", getVar("ID"))
    .log("Condition", row.Condition)
    .log("Group", row.Group)
    .log("Image 1", row.Image_file)
    .log("Image 2", row.Image_file2)
    .log("accuracy", getVar("accuracy"))
    .log("reaction_time", getVar("reaction_time"))
);

SendResults("send");

newTrial("completion_screen",
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("wait", "")
        .wait()
)
;
