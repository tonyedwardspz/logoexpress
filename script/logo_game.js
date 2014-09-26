var score = 0;
var totalScore = 0;
var progressCounter = 0;
var imageSetSelection = 1;
var lives = 3;
var correctAnswer = 0;
var guesses = 0;
var correctGuesses = 0;
var progressBarUpdate = 0;
var roundNumber = 1;

//---------------Set up----------------//

//Game setup & button clicks
$(document).ready(function (e) {
    
    //Set the initital game playing area on load
    $("#startGame").show(750);
    $("#gamePlacement").hide();
    $("#gameOverScreen").hide();
    $("#headerContainer").hide();
    $("#menuScreen").hide();
    $("#categoryWrap").hide();
    $("#roundCompleteScreen").hide();
    $("#gameCompleteScreen").hide();
    
    preLoadImages ();

    $("#replaygame").click(function () {
        audioFeedback = "startGame";
        playSound();
        lives = 3;
        correctGuesses = 0;
        totalScore = 0;
        progressCounter = -10;
        $("#menuContainer").hide(1000);
        startGame();
        startProgress();
    });
        
    $("#nextRound").click(function () {
        audioFeedback = "startGame";
        playSound();
        lives = 3;
        correctGuesses = 0;
        progressCounter = -10;
        $("#menuContainer").hide(1000);
        startGame();
    });

    $("#startButton").click(function () {
        audioFeedback = "startGame";
        playSound();
        imageSetSelection = 1;
        lives = 3;
        progressCounter = -10;
        $("#menuContainer").hide(1000);
        startGame();
    }); 

    $("#menuContainer").click(
        
        function () {
            $("#menuScreen").toggle(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );

    $("#closeMenuButton").click(
        function () {
            $("#menuScreen").hide(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );

    $(".categoryButton").click(
        function () {
            $("#categoryWrap").toggle(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );

    $(".luckyDipButton").click(
        function () {
            imageSetSelection = 1;
            $("#categoryWrap").toggle(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );

    $(".fashionButton").click(
        function () {
            imageSetSelection = 3;
            $("#categoryWrap").toggle(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );

    $(".technologyButton").click(
        function () {
            imageSetSelection = 2;
            $("#categoryWrap").toggle(1000);
            audioFeedback = "startGame";
            playSound();
        }
    );
});

//-------------The game screens / conditions---------------//

//The game loop
function startGame() {

    //Update the game playing area
    $("#scoreHolder").html(score);
    $("#livesDisplay").html(lives);
    $("#gamePlacement").show(800);
    $("#startGame").hide(500);
    $("#roundCompleteScreen").hide(500);
    $("#gameOverScreen").hide(750);
    $("#headerContainer").hide(500);
    
    //Reset the drag and drop elements
    correctCards = false;
    $('#cardPile').html('');
    $('#cardSlots').html('');

    //Suffle the images and answers
    shuffle(numbers);
    displayImage(arrayImg, "");
    shuffle(arraySortAnswer);
    showAnswer(arraySortAnswer);
    
    startProgress();    
}

//Succesful round complete
function roundComplete() {
    
    clearInterval(progressBarUpdate);
    
    //Reset the game counters
    progressBarUpdate = 0;
    totalScore += score;
    progressCounter = 0;
    guesses = 0;
    lives = 3;
    correctGuesses = 0;
    
    //Update the onscreen elements
    $("#scoreslot").html("Total Score: " + totalScore);
    $("#scoreDisplay").html(score);
    $("#scoreslot3").html("Total Score: " + totalScore);
    $("#scoreDisplay3").html(score);
    $("#gameMessage").html("").show(1000);
    
    $("#gamePlacement").hide(600);
    
    if (imageSetSelection <= 2){
        $("#roundCompleteScreen").show(1200);
    }else{
        $("#gameCompleteScreen").show(1200);
        $("#scoreslot2").html("Total Score: " + totalScore);
        $("#scoreDisplay2").html(score);
    }
    
    $("#menuContainer").slideDown(800);
    
    audioFeedback = "endGame";
    playSound();
    
    imageSetSelection++;
    preLoadImages ();    
    score = 0;
}


//Game over screen and reset
function gameOver() {

    clearInterval(progressBarUpdate);
    
    //Reset the game counters
    progressBarUpdate = 0;
    totalScore += score;
    progressCounter = 0;
    guesses = 0;
    lives = 3;
    correctGuesses = 0;
    
    audioFeedback = "endGame";
    playSound();
    
    //Update the onscreen elements
    $("#gamePlacement").hide(600);
    $("#gameOverScreen").show(1200);
    $("#menuContainer").slideDown(800);
    $("#scoreslot").html("Total Score: " + totalScore);
    $("#scoreDisplay").html(score);

    score = 0;
}

//-------------------Image and answer selection-------------------//

var arrayImg = new Array();
var arraySortAnswer = new Array();
var arrayAnswer = new Array();

//Display the four randomly selected images
function displayImage(imgAr, path) {


    if (imageSetSelection == 1) {
        path = path || 'images/technology/';
    }

    if (imageSetSelection == 2) {
        path = path || 'images/luckyDip/';
    }

    if (imageSetSelection == 3) {
        path = path || 'images/fashion/';
    }

    for (var i = 0; i < 4; i++) {        
        var img = imgAr[i];
        arraySortAnswer[i] = numbers[i];
        var imgStr = '<img src="' + path + numbers[i] + '.png" width = "170px" height="170px" class="image resizeme">';

        $('<div>' + imgStr + '</div>').data('number', numbers[i]).attr('id', 'card' + numbers[i]).appendTo('#cardPile').addClass('unit one-of-two').draggable({
            containment: 'window',
            stack: '#cardPile div',
            cursor: 'move',
            revert: true
        });
    }
}

//Select a random answer from the four images
function showAnswer() {

    var temp2 = Math.floor(Math.random() * 4);
    var answer = "";
    
    if (imageSetSelection == 1) {
        answer = answerTechnology[arraySortAnswer[temp2]];
    }
    if (imageSetSelection == 2) {
        answer = answerLuckyDip[arraySortAnswer[temp2]];
    }
    if (imageSetSelection == 3) {
        answer = answerFashion[arraySortAnswer[temp2]];
    }
    
        $('<div>' + answer + '</div>').data('number', arraySortAnswer[temp2]).appendTo('#cardSlots').droppable({
            accept: '#cardPile div',
            hoverClass: 'hovered',
            drop: handleCardDrop
        });
}

// Shuffle the numbers array using the Fisher-Yates Shuffle Algorithm
function shuffle(toBeShuffled) {

    var theLength = toBeShuffled.length - 1;
    var toSwap;
    var temp;

    for (var i = theLength; i > 0; i--) {
        toSwap = Math.floor(Math.random() * i);
        temp = numbers[i];
        toBeShuffled[i] = toBeShuffled[toSwap];
        toBeShuffled[toSwap] = temp;
    }
}

//----------------------Game Functions------------------------//

var correctCards = false;

//Progress bar update
function startProgress() {
    
    clearInterval(progressBarUpdate);
    
    progressBarUpdate = setInterval(function updateProgressBar(){ 
        progressCounter += 1;
        if (progressCounter > 100){
            clearInterval(progressBarUpdate);
            
            $(gameOver);   
        }
        $(function() {
            $( "#progressbar" ).progressbar({
                value: progressCounter
            });
        });
    }, 50);
}

//Test answer on drop
function handleCardDrop(event, ui) {
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');
    
    $("#gameMessage").show();

    if ((slotNumber == cardNumber) && (progressCounter <= 98)) {
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        $(this).droppable('disable');
        ui.draggable.position({
            of: $(this),
            my: 'left top',
            at: 'left top'
        });
        ui.draggable.draggable('option', 'revert', false);
        correctCards = true;
        audioFeedback = "true";
        
        correctGuess();
    }

    //Incorrect Guess
    else if (slotNumber != cardNumber) {
        correctCards = false;
        correctGuesses = 0;
        guesses += 1;
        lives -= 1;
        score -= 5;
        audioFeedback = "false";
        
        $("#livesDisplay").html(lives);
    }
    
    playSound();
    escape();
}

function escape(){
    
    //Restart the game loop if player is "Alive"
    if (lives >= 1 && guesses < 10 && progressCounter < 100) {
        progressCounter -= 40;
        var progressFix;
        if (progressCounter < 0) {
            progressFix = (Math.abs(0 - progressCounter));
            progressCounter += progressFix;
        }
        startGame(); 
    }
    
    //escape conditions
    if (correctGuesses == 10){
        score += 35;
        
        clearInterval(progressBarUpdate);
        roundComplete();
        guesses = 0;
    }
    if ((guesses == 10 && (correctGuesses != 10)) || (lives < 1)){
        clearInterval(progressBarUpdate);
        gameOver();
    }
}

function correctGuess(){
    if (correctCards == true) {
        guesses += 1;
        correctGuesses += 1;
        score += 10;
        
        //Appy bonuses
        if (progressCounter < 50) {
            score += 5;
        }
        else if (progressCounter < 20) {
            score += 10;
        }

        if (correctGuesses == 3){
            score += 10;
            $("#gameMessage").html("Bonus - 3 in a row").show();
        }
        else if (correctGuesses == 5){
            score += 15;
            $("#gameMessage").html("Bonus - 5 in a row").show();
        }
        else if (correctGuesses == 8){
            score += 20;
            $("#gameMessage").html("Bonus - 8 in a row").show();
        }
        else{
            $("#gameMessage").html(" ").show();
        }
    }
}

//------------------------------ Misc and Extras ------------------------//

//Stop the background from being selectable.
//Bugfix for tablet
$(document).bind("touchmove", function (event) {
    event.preventDefault();
});

//Sound Effects
var filename = '';
var audioFeedback = "";
function playSound() {
    
    if (audioFeedback == "true"){
        filename = 'audio/correct';
    }
    if (audioFeedback == "false"){
        filename  = 'audio/incorrect';
    }
    if (audioFeedback == "startGame"){
        filename  = 'audio/game_start';
    }
    if (audioFeedback == "endGame"){
        filename  = 'audio/game_over';
    }
    
    document.getElementById("sound").innerHTML = '<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>';
}

//Preload the images
function preLoadImages (){
    
    for (var i = 1; i <= 36; i++){
        $.preload('images/luckyDip/' + [i] + '.png');
    }
    for (var j = 1; j <= 36; ++j){
        $.preload('images/technology/' + [j] + '.png');
    }
    for (var k = 1; k <= 36; ++k){
        $.preload('images/fashion/' + [k] + '.png');
    }
}


//Tween Element
//function tweenIt(){
//    
//        TweenMax.to($(".box"), 3, {width:"+=50", ease:Elastic.easeOut,});
//    
//}

//-------------------Images & answers----------------------------//

//This array is shuffled everytime the images are selected.
//The values in the first four indexes are used as the selected image file names.
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

//---- Answers Arrays ----//
var answerTechnology=new Array();answerTechnology[0]="ERREER";answerTechnology[1]="Google Drive";answerTechnology[2]="iColud";answerTechnology[3]="Nvidia";answerTechnology[4]="Compaq";answerTechnology[5]="YouTube";answerTechnology[6]="Java";answerTechnology[7]="Visual Studio";answerTechnology[8]="Half Life";answerTechnology[9]="Freesat";answerTechnology[10]="Firefox";answerTechnology[11]="Opera";answerTechnology[12]="Wii";answerTechnology[13]="Atari";answerTechnology[14]="Wii U";answerTechnology[15]="Codemasters";answerTechnology[16]="Lucas Arts";answerTechnology[17]="Sucker Punch";answerTechnology[18]="Rockstar Games";answerTechnology[19]="Android";answerTechnology[20]="Apple";answerTechnology[21]="Microsoft";answerTechnology[22]="MSN";answerTechnology[23]="Blackberry";answerTechnology[24]="Dreamcast";answerTechnology[25]="N64";answerTechnology[26]="Skype";answerTechnology[27]="Twitter";answerTechnology[28]="Digg";answerTechnology[29]="Reddit";answerTechnology[30]="Stumbleupon";answerTechnology[31]="Instagram";answerTechnology[32]="Amiga";answerTechnology[33]="Midway";answerTechnology[34]="Blender";answerTechnology[35]="HTML 5";answerTechnology[36]="Facebook";var answerFashion=new Array();answerFashion[0]="ERREER";answerFashion[1]="Animal";answerFashion[2]="Converse";answerFashion[3]="Vans";answerFashion[4]="Billabong";answerFashion[5]="Versace";answerFashion[6]="Dream Gold";answerFashion[7]="Lacoste";answerFashion[8]="North Face";answerFashion[9]="Ralph Lauren";answerFashion[10]="Ray Ban";answerFashion[11]="Yves Saint Laurent";answerFashion[12]="Lois Vuitton";answerFashion[13]="Channel";answerFashion[14]="Calvin Klien";answerFashion[15]="DC";answerFashion[16]="Umbro";answerFashion[17]="Kappa";answerFashion[18]="Addidas";answerFashion[19]="Nike";answerFashion[20]="Rip Curl";answerFashion[21]="Roxy";answerFashion[22]="Givenchy";answerFashion[23]="Tommy Hillfiger";answerFashion[24]="FCUK";answerFashion[25]="Burberry";answerFashion[26]="Timberland";answerFashion[27]="Regatta";answerFashion[28]="Lowe Alpine";answerFashion[29]="Ronhill";answerFashion[30]="H & M";answerFashion[31]="Immink";answerFashion[32]="Fruit of the Loom";answerFashion[33]="Crew Clothing";answerFashion[34]="Spin A Yarn";answerFashion[35]="Volcom";answerFashion[36]="Armarni";var answerLuckyDip=new Array();answerLuckyDip[0]="ERREER";answerLuckyDip[1]="Starbucks";answerLuckyDip[2]="Vauxhall";answerLuckyDip[3]="Oakley";answerLuckyDip[4]="Mini";answerLuckyDip[5]="Malibu Rum";answerLuckyDip[6]="Amazon";answerLuckyDip[7]="Playboy";answerLuckyDip[8]="Tom Tom";answerLuckyDip[9]="Unilever";answerLuckyDip[10]="Nickelodeon";answerLuckyDip[11]="The Premier League";answerLuckyDip[12]="Mitsubishi";answerLuckyDip[13]="Nespresso";answerLuckyDip[14]="Smart Car";answerLuckyDip[15]="ING Foundation";answerLuckyDip[16]="Orange";answerLuckyDip[17]="Shell";answerLuckyDip[18]="Morrisons";answerLuckyDip[19]="KFC";answerLuckyDip[20]="Mcdonalds";answerLuckyDip[21]="Paramount";answerLuckyDip[22]="The National Lottery";answerLuckyDip[23]="The Telegraph";answerLuckyDip[24]="Thomas Cook";answerLuckyDip[25]="British Airways";answerLuckyDip[26]="Red Bull";answerLuckyDip[27]="Formula 1";answerLuckyDip[28]="Force India";answerLuckyDip[29]="Ocado";answerLuckyDip[30]="O2";answerLuckyDip[31]="The Brit Awards";answerLuckyDip[32]="The Body Shop";answerLuckyDip[33]="Toys R Us";answerLuckyDip[34]="SEGA";answerLuckyDip[35]="Prime Location";answerLuckyDip[36]="Find a Property";