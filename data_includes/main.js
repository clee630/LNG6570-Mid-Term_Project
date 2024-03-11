// Remove command prefix
PennController.ResetPrefix(null);

// Turn off debugger
DebugOff();

// Control trial sequence
Sequence("instructions", randomize("experimental-trial"), "send", "completion_screen")
;
// Instructions
newTrial("instructions",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("instructions-1", "Welcome!")
    ,
    newText("instructions-2", "In this experiment, you will hear a word, and see two images.")
    ,
    newText("instructions-3", "<b>Select the image that better matches the word:</b>")
    ,
    newText("instructions-4", "Press the <b>F</b> key to select the image on the left.<br>Press the <b>J</b> key to select the image on the right.<br>You can also click on an image to select it.")
    ,
    newText("instructions-5", "If you do not select an image by the time the audio finishes playing,<br>the experiment will skip to the next sentence.")
    ,
    newText("instructions-6", "Please enter your ID and then click the button below to start the experiment.")
    ,
    newTextInput("input_ID")
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newButton("wait", "Click to start the experiment")
        .center()
        .print()
        .wait()
    ,
    newVar("ID")
        .global()
        .set(getTextInput("input_ID"))
)
;
// Experimental trial
Template("input.csv", row =>
    newTrial("experimental-trial",
        newTimer("break", 1000)
            .start()
            .wait()
        ,
        newAudio("audio", row.Audio_file)
            .play()
        ,
        newTimer("timeout", row.duration)
            .start()
        ,
        newText("Word", row.Word)
            .center()
            .unfold(row.duration)
        ,
        newImage("Image 1", row.Image_file)
            .size(200, 200)
        ,
        newImage("Image 2", row.Image_file2)
            .size(200, 200)
        ,
        newCanvas("side-by-side", 450,200)
            .add(  0, 0, getImage("Image 1"))
            .add(250, 0, getImage("Image 2"))
            .center()
            .print()
            .log()
        ,
        newSelector("selection")
            .add(getImage("Image 1"), getImage("Image 2"))
            .shuffle()
            .keys("F", "J")
            .log()
            .callback(getTimer("timeout").stop())
        ,
        getTimer("timeout")
            .wait()
        ,
        getAudio("audio")
            .stop()
    )
    .log("group", row.Group)
    .log("item", row.Word)
    .log("condition", row.Condition)
    .log("ID", getVar("ID"))
)
;
// Send results manually
SendResults("send");

// Completion screen
newTrial("completion_screen",
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("wait", "")
        .wait()
    );
