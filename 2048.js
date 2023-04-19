var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
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

    setTwo();
    setTwo();
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

//ランダムに2のタイルを生成する
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        //0以上行（列）数未満のランダムな行（列）番号
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
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
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = score;
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

function slideUp() {
    //各列ずつ上にスライドする
    for (let c = 0; c < columns; c++) {
        //タイルの並びを転置させる
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        //各列の各タイルのスライド結果を反映する
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //スライド後、対応するよう列に数字を代入する
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    //各列ずつ上にスライドする
    for (let c = 0; c < columns; c++) {
        //タイルの並びを転置させる
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        //各列の各タイルのスライド結果を反映する
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //スライド後、対応するよう列に数字を代入する
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}