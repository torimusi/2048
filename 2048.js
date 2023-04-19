var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    // board = [
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0]
    // ]

    board = [
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [4, 4, 8, 8],
        [4, 4, 8, 8]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //クラスリストを空にする
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => { //キーが離された時
    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    }
})

function filterZero(row) {
    return row.filter(num => num != 0); //0を除いた新たな配列を作る
}

function slide(row) {
    //行から0を消す
    row = filterZero(row); //[0, 2, 2, 2] -> [2, 2, 2]

    //スライドして数を足す
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    } //[2, 2, 2] -> [4, 0, 2]

    //配列から0を消して詰める
    row = filterZero(row); //[4, 0, 2] -> [4, 2]

    //空いているタイルに0を入れる
    while (row.length < columns) {
        row.push(0);
    } //[4, 2] -> [4, 2, 0, 0]

    return row;
}

function slideLeft() {
    //各行ずつ左にスライドする
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        //各行の各タイルのスライド結果を反映する
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        //slideLeft()においてタイルの並びを2回反転させる
        let row = board[r];
        row.reverse(); //[2, 2, 2, 0] -> [0, 2, 2, 2]
        row = slide(row); //[0, 2, 2, 2] -> [4, 2, 0, 0]
        row.reverse(); //[4, 2, 0, 0] -> [0, 0, 2, 4]
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}