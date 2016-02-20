/***/

function moveIntersect(x1, y1, x2, y2) {
        if (x2 > x1 + 1 || x2 < x1 - 1) {
            return false;
        }
        else if (y2 > y2 + 1 || y2 < y2 - 1) {
            return false;
        }
        else {
            return true;
        }
}

function kickIntersect(x1, y1, x2, y2) {
        if (x1 == x2 || y1 == y2) {
            return false;
        }
    
        if (x2 > x1 + 2 || x2 < x1 - 2) {
            return false;
        }
        else if (y2 > y2 + 2 || y2 < y2 - 2) {
            return false;
        }
        else {
            return true;
        }
}


/**
 * Created by alexandr.beloborodov on 2/20/2016.
 */

// "<span style='display: block;background: #fff;border-radius: 5px'>o</span>"

function player() {
    this.items = [];
}

player.prototype.addItem = function (item) {
    this.item.push(item);
};


var player1 = new player();
player1.item = "<span class='player1 drag' draggable='true' style='display: block;background: #fff;border-radius: 5px'>o</span>";
var player2 = new player();
player2.item = "<span class='player2 drag' draggable='true' style='display: block;background: #2d2d2d;border-radius: 5px'>o</span>";

function createField() {
    var field = [];
    for (var i = 0; i < 8;i++) {
        field[i] = [];
        for (var j = 0; j < 8; j++) {
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    field[i].push({point:'w'});
                }
                else {
                    field[i].push({point:'b'});
                }
            }
            else  {
                if (j % 2 == 1) {
                    field[i].push({point:'w'});
                }
                else {
                    field[i].push({point:'b'});
                }
            }

            if (field[i][j].point == 'b' && i < 3) {
                field[i][j].item = player1.item;
            }

            if (field[i][j].point == 'b' && i > 4) {
                field[i][j].item = player2.item;
            }
        }
    }
    return field;
}

function createPlayer1() {

}

var f = createField();

var exit = 0;

var html = '<table>';

var body = document.getElementsByTagName('body')[0];

for (var i = 0; i < f.length; i++) {
    html += "<tr>";
    for (var j = 0; j < f[i].length; j++) {
        if (f[i][j].point == 'w') {
            html += '<td data-x="'+j+'" data-y="'+(f.length - 1 - i)+'" class="w" style="background: rgb(255, 255, 255)">&nbsp;&nbsp;&nbsp;</td>';
        }
        else {
            if (f[i][j].item != undefined) {
                html += '<td data-x="'+j+'" data-y="'+(f.length - 1 - i)+'" class="b" style="background: #000">&nbsp;' + f[i][j].item + '&nbsp;</td>';
            }
            else {
                html += '<td data-x="'+j+'" data-y="'+(f.length - 1 - i)+'" class="b" style="background: #000">&nbsp;&nbsp;&nbsp;</td>';
            }
        }
    }
    html += "</tr>";
}
html += '</table>';
body.innerHTML = html;




var dStartColor = '#000';
var dEndColor = '#E5E5E5';
var mark = false;
var listEl = document.getElementsByClassName('drag');
var tds = document.getElementsByTagName('td');
var dragSrcEl = null;
var kickedEl = null;

/**
 * Начали перетскивание
 * @param e
 */
function handleDragStart(e) {
    this.style.opacity = '0.6';
    this.style.background = dStartColor;

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}


/*** ##################################################
 *
 *
 *
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
    kickedEl = this;
    mark = true;
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

/*** ###################################################
 *
 *
 *
 */

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function handleDragEnd(e) {

    this.style.background = dEndColor;
    this.style.opacity = '1';

    [].forEach.call(listEl, function (el) {
        el.classList.remove('over');
    });
}


/***
 */
 
 function handleTdDragOver(e) {
     if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    return false;
 }
 
 function handleTdDrop(e) {
     if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    var x2 = this.dataset.x, y2 = this.dataset.y;
    var x1 = dragSrcEl.parentNode.dataset.x, y1 = dragSrcEl.parentNode.dataset.y;

    if (dragSrcEl != this && this.nodeName == "TD" && 
        this.className == 'b' && moveIntersect(Number(x1), Number(y1), Number(x2), Number(y2)) &&
        this.children.length == 0) {
        this.appendChild(dragSrcEl);
        delete dragSrcEl;
    }
    else if (kickIntersect(Number(x1), Number(y1), Number(x2), Number(y2)) && mark) {
        this.appendChild(dragSrcEl);
        kickedEl.remove();
    }
    
    mark = false;
    kickedEl = null;
    return false;
 }


[].forEach.call(listEl, function(el) {
    el.addEventListener('dragstart', handleDragStart, false);
    el.addEventListener('dragenter', handleDragEnter, false);
    el.addEventListener('dragover', handleDragOver, false);
    el.addEventListener('dragleave', handleDragLeave, false);
    el.addEventListener('dragend', handleDragEnd, false);
//    el.addEventListener('drop', handleDrop, false);
});

[].forEach.call(tds, function(el) {
    el.addEventListener('dragover', handleTdDragOver, false);
    el.addEventListener('drop', handleTdDrop, false);
});