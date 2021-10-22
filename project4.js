var rowArray = [],
    columnArray = [],
    boxArray = [],
    selectedcolumnArray = [],
    selectedColumnValues = [],
    selectedRowArray = [],
    selectedRowValues = [],
    responseJSON,
    currentNumber;

//this loads the puzzle when the page is loaded
$(document).ready(function () {
    identifyColumns();
    identifyRows();
    getPuzzle();
});

//clicking on the start new game button with get a new puzzle with the getPuzzle function
$(document).ready(function () {
    $("#startNewGame").click(function () {
        getPuzzle();
        $(".gameButton").removeClass("bg-primary text-white");
        $(".gameButton").removeClass("bg-danger text-dark");
        $(".gameButton").attr("style", "color: blue");

    });
});

//sends API request for new puzzle and fills the board with new puzzle if response is complete and
//response code is 200
function getPuzzle() {
    var xhr = new XMLHttpRequest,
        difficulty;
    xhr.open('GET', "https://sugoku.herokuapp.com/board?difficulty=easy", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responseJSON = JSON.parse(xhr.response);
            console.log(responseJSON);
            fillCells();
        }
    };
    xhr.send();
}

//fills cells with data from API
function fillCells() {
    $(".gameButton").attr("disabled", false);
    for (var i = 0; i < 9; i++) {
        var row = rowArray[i];
        for (var j = 0; j < 9; j++) {
            row[j].firstElementChild.textContent = responseJSON.board[i][j];
            if (row[j].firstElementChild.textContent == 0) {
                row[j].firstElementChild.textContent = "";
            }
            else {
                row[j].firstElementChild.setAttribute("disabled", true);
                row[j].firstElementChild.setAttribute("style", "color: blue");
            }

        }
    }
}

//this adds the class of gameSquare to all of the squares on the board
//it also adds the class of gameButton to all of the buttons on the board
$(document).ready(function () {
    $(".row1, .row2, .row3, .row4, .row5, .row5, .row6, .row7, .row8, .row9").addClass("gameSquare");
    for (var i = 0; i < 100; i++) {
        if (document.body.contains($(".gameSquare")[i])) {
            $("td.gameSquare > button").addClass("gameButton")
        }
    }
});

//defines an array of each column which contains an array of all cells in that column
function identifyColumns() {
    for (var i = 1; i < 10; i++) {
        columnArray[i - 1] = $(`[id^=sq][id$=${i}]`);
    }
}

//defines an array of each row which contains an array of all cells in that row
function identifyRows() {
    for (var i = 1; i < 10; i++) {
        rowArray.push(document.querySelectorAll(`.row${i}`))
    }
}

//this function will go through a box and return an array of its contents
//the array will start at the top left box and read left to right top to bottom
function IdentifyBoxes(boxNumber, startx, endx, starty, endy, box) {
    for (var i = startx; i < endx; i++) {
        for (var j = starty; j < endy; j++) {
            box[boxNumber].push(rowArray[i][j].firstElementChild.textContent);
        }
    }
    boxArray.push(box[boxNumber]);
}

//when you click on a number in the number row this sets that as the current number and 
//changes its style
$(document).ready(function () {
    $(".number").click(function () {
        $(".number").removeClass("bg-primary text-white");
        $(this).addClass("bg-primary text-white");
        if ($(this).text() == "") {
            $("#currentNumber").html("Erase");
        } else {
            $("#currentNumber").html($(this).text());
        }
    });
});


//this is what happens when you click gamebox
//it adds the current number that you have selected from the top row
//changes the color of the selected box
//there are multiple log options that are currently disabled but can be re-activated for debugging
$(document).ready(function () {
    $(".gameButton").click(function () {
        //change the class and style and add current number to pag
        if ($("#currentNumber").text() == "Erase") {
            $(this).html("");
            $(this).removeClass("bg-primary text-white");
            $(this).removeClass("bg-danger text-dark");
            $(this).attr("style", "color: blue");
        } else {
            $(this).removeClass("bg-primary text-white");
            $(this).addClass("bg-primary text-white");
            $(this).html($("#currentNumber").text());
        }
        //this finds out which row you clicked in
        let clickedRowNum = ($(this).parent().parent().attr("id")).substring(2, 3),
            clickedBoxNum = ($(this).parent().attr("class")).substring(3, 4),
            clickedColumn = ($(this).parent().attr("id").substring(3, 4));
        console.log(clickedBoxNum);
        selectedRowArray.push(rowArray[clickedRowNum - 1]);
        let rowValues = [],
            columnValues = [];
        rowValues = rowReturn(clickedRowNum - 1);
        columnValues = columnReturn(clickedColumn - 1);
        allBoxContents();
        identifyColumns();
        console.log(clickedColumn);
        if ($("#currentNumber").text() === "Erase") {
            return;
        }
        else if (findDups(rowValues, $("#currentNumber").text()) == true ||
            findDups(boxArray[clickedBoxNum - 1], $("#currentNumber").text()) == true ||
            findDups(columnValues, $("#currentNumber").text()) == true) {
            $(this).removeClass("bg-primary text-white");
            $(this).addClass("bg-danger text-dark");
        } else {
            $(this).removeClass("bg-danger text-dark");
            $(this).addClass("bg-primary text-white");
        }
        console.log(clickedBoxNum);
    });
});

//gets all of the values in a specific row
function rowReturn(rowNumber) {
    selectedRowValues.length = 0;
    for (var i = 0; i < 9; i++) {
        selectedRowValues.push(rowArray[rowNumber][i].firstElementChild.textContent);
    }
    return selectedRowValues;
    console.log(selectedRowValues);
}

//gets all of the values in a specific column
function columnReturn(columnNumber) {
    selectedColumnValues.length = 0;
    for (var i = 0; i < 9; i++) {
        selectedColumnValues.push(columnArray[columnNumber][i].firstElementChild.textContent);
    }
    return selectedColumnValues;
    console.log(selectedColumnValues);
}

//iterate through an array and finds out if there are duplicates
function findDups(a, c) {
    var index = a.indexOf(c);
    a.splice(index, 1);
    for (var i = 0; i < 8; i++) {
        if (a[i] == c) {
            return true;
        }
    }
    return false;
}

//this iterates the box function through all of the boxes and returns an array that shows the contents of each box
function allBoxContents() {
    var box = [[], [], [], [], [], [], [], [], []]
    IdentifyBoxes(0, 0, 3, 0, 3, box);
    IdentifyBoxes(1, 0, 3, 3, 6, box);
    IdentifyBoxes(2, 0, 3, 6, 9, box);
    IdentifyBoxes(3, 3, 6, 0, 3, box);
    IdentifyBoxes(4, 3, 6, 3, 6, box);
    IdentifyBoxes(5, 3, 6, 6, 9, box);
    IdentifyBoxes(6, 6, 9, 0, 3, box);
    IdentifyBoxes(7, 6, 9, 3, 6, box);
    IdentifyBoxes(8, 6, 9, 6, 9, box);
    boxArray = box;
    return boxArray;
}