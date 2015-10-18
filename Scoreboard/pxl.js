/*****************************************************|
|************** Written by Josh Hompoth **************|
|**************       Hompoth.com       **************|
|*****************************************************/
// Converts each sprite on the sprite sheet into an object that can easily be drawn
var s_bg,
    s_clouds,
    s_chickenOxen,
    s_humanOxen,
    s_humanPig,
    s_human,

    ao_chickenOxen,
    ao_humanOxen,
    ao_humanPig,
    ao_human,

    as_chickenOxen,
    as_humanOxen,
    as_humanPig,
    as_human;

function Sprite(img, x, y, width, height) {
    this.img = img; // each sprite has an IMG
    this.x = x; // an (x,y) positon
    this.y = y;
    this.width = width; // a width and height
    this.height = height;
};

Sprite.prototype.draw = function(x, y, dir) {
    // draw takes in the position, the frame positon, and the direction
    x = Math.round(x);
    y = Math.round(y);
    var width2 = Math.floor(this.width / 2);
    if (dir >= 0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x - width2, y - this.height, this.width, this.height);
    } else {
        ctx.save(); // flips the image
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, -1 * (x + width2), y - this.height, this.width, this.height);
        ctx.restore();
    }
};

function initSprites(img, type) {
    if (type == 0) {
        // initiate all sprites from sprite sheet
        s_clouds = [ // load the clouds
            new Sprite(img, 164, 0, 41, 41), // cloud 1
            new Sprite(img, 205, 0, 41, 41), // cloud 2
        ];
        s_chickenOxen = [ // load chickenOxen animation
            new Sprite(img, 0, 123, 41, 41), // frame 1
            new Sprite(img, 41, 123, 41, 41), // frame 2
            new Sprite(img, 82, 123, 41, 41), // frame 3
            new Sprite(img, 123, 123, 41, 41), // frame 4
        ];
        s_humanOxen = [ // load humanOxen animation
            new Sprite(img, 0, 82, 41, 41), // frame 1
            new Sprite(img, 41, 82, 41, 41), // frame 2
            new Sprite(img, 82, 82, 41, 41), // frame 3
            new Sprite(img, 123, 82, 41, 41), // frame 4
        ];
        s_humanPig = [ // load humanPig animation
            new Sprite(img, 0, 41, 41, 41), // frame 1
            new Sprite(img, 41, 41, 41, 41), // frame 2
            new Sprite(img, 82, 41, 41, 41), // frame 3
            new Sprite(img, 123, 41, 41, 41), // frame 4
        ];
        s_human = [ // load human animation
            new Sprite(img, 0, 0, 41, 41), // frame 1
            new Sprite(img, 41, 0, 41, 41), // frame 2
            new Sprite(img, 82, 0, 41, 41), // frame 3
            new Sprite(img, 123, 0, 41, 41), // frame 4
        ];

        // animation order
        ao_chickenOxen = [3, 2, 1, 0];
        ao_humanOxen = [3, 2, 1, 0];
        ao_humanPig = [0, 1, 2, 3];
        ao_human = [0, 1, 2, 3];

        // animation speed
        as_chickenOxen = 4;
        as_humanOxen = 4;
        as_humanPig = 4;
        as_human = 6;
    } else {
        s_bg = new Sprite(img, 0, 0, 338, 63); // load background
    }
};

/*****************************************************|
|****************** Game Code below ******************|
|*****************************************************|
|*****************************************************/

var ctx, sprite, background, // Declare variables and initialize any that you can
    width,
    height,
    chickenOxenNames = [],
    humanOxenNames = [],
    humanPigNames = [],
    humanNames = [],
    chickenOxenPos = [],
    humanOxenPos = [],
    humanPigPos = [],
    humanPos = [],
    frames = 0,

    bg = {
        draw: function() {
            var n = width / 338 / 2 + 1;
            for (var i = 1; i <= n; ++i) {
                s_bg.draw(width / 2 + 338 * i, height, 0);
                s_bg.draw(width / 2 - 338 * i, height, 0);
            }
            s_bg.draw(width / 2, height, 0);
        },
    },
    clouds = {
        clouds_: [],
        init: function() {
            for (var i = 0; i < width / 25; ++i) {
                this.add();
                this.clouds_[this.clouds_.length - 1].x = Math.round(Math.random() * width - width/2);
            }
        },
        add: function() {
            this.clouds_.push(new Cloud());
        },
        draw: function() {
            for (var i = 0; i < this.clouds_.length; ++i) {
                this.clouds_[i].draw();
            }
        },
        update: function() {
            if (frames % 2700 == 0) this.add();
            for (var i = 0; i < this.clouds_.length; ++i) {
                this.clouds_[i].update();
                if (this.clouds_[i].x < -width / 2 - s_clouds[this.clouds_[i].type].width) {
                    this.clouds_.splice(i, 1);
                    --i;
                }
            }
        },
    },
    allSprites = {
	character: [],
	add: function(character_) {
            this.character.push(character_);
        },
        draw: function() {
            for (var i = 0; i < this.character.length; ++i) {
                if (this.character[i]) this.character[i].draw();
            }
        },
	pushToFront: function(target) {
            for (var i = 0; i < this.character.length; ++i) {
                if (this.character[i] == target) {
                    this.character.push(this.character.splice(i, 1)[0]);
                    break;
                }
            }
        },
	update: function() {
            for (var i = 0; i < this.character.length; ++i) {
                if (this.character[i]) {
			this.character[i].update();
		}
            }
        },
    },
    chickenOxen = {
        character: [],
        add: function(name, level) {
	    var character_ = new Character(name, level, 3, this.character.length);
            this.character.push(character_);
            chickenOxenNames.push(name + " - " + level);
            chickenOxenPos.push(0);
			allSprites.add(character_)
        },
    },
    humanOxen = {
        character: [],
        add: function(name, level) {
	    var character_ = new Character(name, level, 2, this.character.length);
            this.character.push(character_);
            humanOxenNames.push(name+" - "+level);
            humanOxenPos.push(0);
			allSprites.add(character_);
        },
    },
    humanPig = {
        character: [],
        add: function(name, level) {
	    var character_ = new Character(name, level, 1, this.character.length);
            this.character.push(character_);
            humanPigNames.push(name + " - " + level);
            humanPigPos.push(0);
			allSprites.add(character_);
        },
    },
    human = {
        character: [],
        add: function(name, level) {
	    var character_ = new Character(name, level, 0, this.character.length);
            this.character.push(character_);
            humanNames.push(name + " - " + level);
            humanPos.push(0);
			allSprites.add(character_);
        },
    };

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Cloud() {
    this.type = (Math.random() > .5) ? 0 : 1;
    this.x = Math.round(width/2 + s_clouds[this.type].width);
    this.y = Math.random() * 20;
    this.dir = 1;
    this.draw = function() {
        s_clouds[this.type].draw(width/2 + this.x, height - 40 - this.y, this.dir);
    }
    this.update = function() {
        this.x--;
    }
}

function Character(name, level, type, index) {
    this.name = name;
    this.level = level;
    this.type = type;
	this.index = index;
    this.distance = 0;
    this.wait = 0;
    this.frame = 0;
    this.frames = 0;
    this.x = Math.round(Math.random() * width - width / 2);
    this.dir = (Math.random() > .5) ? 1 : -1;
    this.draw = function() {
        var i = this.frame % 4;
        if (this.type == 0)
            s_human[ao_human[i]].draw(this.x + width / 2, height - 4, this.dir);
        if (this.type == 1)
            s_humanPig[ao_humanPig[i]].draw(this.x + width / 2, height - 4, this.dir);
        if (this.type == 2)
            s_humanOxen[ao_humanOxen[i]].draw(this.x + width / 2, height - 4, this.dir);
        if (this.type == 3)
            s_chickenOxen[ao_chickenOxen[i]].draw(this.x + width / 2, height - 4, this.dir);
    };
    this.update = function(i) {
        this.distance--;
        this.wait--;
        if (this.x > width / 2) this.dir = -1;
        if (this.x < -width / 2) this.dir = 1;
        if (this.distance <= 0) {
            if (this.wait <= 0) {
                this.frames = 1;
                this.frame = 0;
                var tmp = Math.random();
                if (tmp > .5) {
                    allSprites.pushToFront(this);
                    this.distance = Math.random() * width;
                }
                else this.wait = Math.random() * 120;
            }
        } else {
            this.x += this.dir;
            this.frames++;
        }
        if (this.type == 0){
			humanPos[this.index] = this.x
			if(this.frames % as_human == 0) this.frame++;
		}
		if (this.type == 1){
			humanPigPos[this.index] = this.x
			if(this.frames % as_humanPig == 0) this.frame++;
		}
		if (this.type == 2){
			humanOxenPos[this.index] = this.x
			if(this.frames % as_humanOxen == 0) this.frame++;
		}
		if (this.type == 3){
			chickenOxenPos[this.index] = this.x
			if(this.frames % as_chickenOxen == 0) this.frame++;
		}
    };
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'http://potw.quinnftw.com/api/solvers', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        } 
    };
    xobj.send(null);
}

function loadSprites(json) {
    var obj = JSON.parse(json), max = 1;
    for (var i = 0; i < obj.data.length; ++i) {
        if(obj.data[i].solved > max) max = obj.data[i].solved;
    }
    for (var i = 0; i < obj.data.length; ++i) {
        if (obj.data[i].student_id.localeCompare("gheriba") == 0)
            chickenOxen.add(obj.data[i].student_id, obj.data[i].solved);
        else if (obj.data[i].solved == max)
            humanOxen.add(obj.data[i].student_id, obj.data[i].solved);
        else if (obj.data[i].solved >= Math.ceil(max/2))
            humanPig.add(obj.data[i].student_id, obj.data[i].solved);
        else if (obj.data[i].solved > 0)
            human.add(obj.data[i].student_id, obj.data[i].solved);
    }
    (function loop() {
        requestAnimFrame(loop);
        update();
    })();
}

function setWidthHeight() {
    if (document.body && document.body.offsetWidth) {
        width = document.body.offsetWidth;
        height = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
        width = document.documentElement.offsetWidth;
        height = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    width = Math.floor(width / 7);
    height = Math.min(Math.floor(height / 9), 72);
    canvas.width = width;
    canvas.height = height;
}

// finds if a letter centered above the sprite can be placed
function getNameChar(name, pos, col) {
    var shift = Math.floor(name.length/2);
    if(pos - shift <= col && col < pos - shift + name.length) {
        var tmp = col - pos + shift;
        if(tmp < name.length) return name[tmp];
    }
    return '';
}

function toAscii() {
    var line = "";

    //accessing pixel data
    var pixels = ctx.getImageData(0, 0, width, height);
    var colordata = pixels.data;
    var ascii = document.getElementById("ascii");
    for (var i = 0; ascii.lastChild && (i < 83 || frames % 60 == 0); ++i) {
        ascii.removeChild(ascii.lastChild);
    }
    var startPos = colordata.length - 42 * width * 4;
    if (frames % 60 == 0 || startPos < 0) startPos = 0;
    for (var i = startPos; i < colordata.length; i = i + 4) {
        r = colordata[i];
        g = colordata[i + 1];
        b = colordata[i + 2];
        gray = r * 0.2126 + g * 0.7152 + b * 0.0722;

        if (gray > 250) character = " ";
        else if (gray > 230) character = "`";
        else if (gray > 200) character = ":";
        else if (gray > 175) character = "*";
        else if (gray > 150) character = "+";
        else if (gray > 125) character = "#";
        else if (gray > 50) character = "W";
        else character = "@";

        var row = Math.floor(i / width / 4);
        var rowFromBottom = height - row;
        var col = i / 4 % width;
        var colFromMiddle = Math.round(col - width / 2);
        if (rowFromBottom == 42) {
            for (var j = 0; j < humanOxenNames.length; ++j) {
                var tmp = getNameChar(humanOxenNames[j], humanOxenPos[j], colFromMiddle);
                if(tmp != '') character = tmp;
            }
        }
        if (rowFromBottom == 40) {
            for (var j = 0; j < chickenOxenNames.length; ++j) {
                var tmp = getNameChar(chickenOxenNames[j], chickenOxenPos[j], colFromMiddle);
                if(tmp != '') character = tmp;
            }
        }
        if (rowFromBottom == 36) {
            for (var j = 0; j < humanPigNames.length; ++j) {
                var tmp = getNameChar(humanPigNames[j], humanPigPos[j], colFromMiddle);
                if(tmp != '') character = tmp;
            }
        }
        if (rowFromBottom == 25) {
            for (var j = 0; j < humanNames.length; ++j) {
                var tmp = getNameChar(humanNames[j], humanPos[j], colFromMiddle);
                if(tmp != '') character = tmp;
            }
        }

        if ((i != 0) && ((i / 4) % width) == 0) {
            ascii.appendChild(document.createTextNode(line));
            ascii.appendChild(document.createElement("br"));
            line = "";
        }

        line += character;
    }
}

function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    clouds.draw();
    bg.draw();
    allSprites.draw();
    toAscii();
}

function update() {
    ++frames;
    frames %= 6000;
    if (frames % 60 == 0) {
        setWidthHeight();
        clouds.update();
    }
    if (frames % 4 == 0) {
	allSprites.update();
        render();
    }
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setWidthHeight();
    sprite = new Image();
    sprite.src = 'sprite.png';
    sprite.onload = function() {
        initSprites(this, 0);
        loadJSON(loadSprites);
        clouds.init();
    }

    background = new Image();
    background.src = 'background.png';
    background.onload = function() {
        initSprites(this, 1);
    }
}
window.onload = init; //after the window loads, call init.
