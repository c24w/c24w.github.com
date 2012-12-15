var b = document.body;
var plane = document.getElementById('plane');
var clouds = [];
var index = 0;
var cw = b.clientWidth; // page width
var ch = b.clientHeight; // page height
var vw = window.innerWidth; // viewport width
var vh = window.innerHeight; // viewport height

/* added 'box' to crop clouds moving beyond defined dimensions, rather than allowing the 'body' to grow indefinitely (becomes glitchy) */
var box = document.getElementById('cropArea');
box.style.width = cw + 'px';
box.style.height = ch + 'px';

// add random clouds
var noClouds = cw * ch / 100000;
while(noClouds > 0){
	var w = 254;
	var h = 198;
	var e = document.createElement('img');
	e.src = 'http://i49.tinypic.com/552pah.png';
	e.className = 'cloud';
	var x = Math.floor(Math.random() * (cw - w));
	var y = Math.floor(Math.random() * (ch - h));
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	if(noClouds % 3 === 0){ // randomly bigger cloud at interval
		var scalar = 1 + Math.random();
		w = Math.floor(w * scalar);
		h = Math.floor(h * scalar);
		e.style.width = w + 'px';
		e.style.height = h + 'px';
		e.style.zIndex = '0';
		e.setAttribute('data-xy', x + ',' + y);
		clouds[index] = e;
		index++;
	}
	box.appendChild(e);
	noClouds--;
}

window.onscroll = scrollElements;
};

function scrollElements(){
	var bgAmount = 0.9;
	var cloudAmount = 0.5;
	var x,y;
	// clouds
	for(var i = 0; i < clouds.length; i++){
		var c = clouds[i];
		var xy = c.getAttribute('data-xy').split(',');
		x =  (b.scrollLeft * cloudAmount) + parseInt(xy[0]);
		y =  (b.scrollTop * cloudAmount) + parseInt(xy[1]);
		//      if(x > cw - c.clientWidth)
		//        x = cw - c.clientWidth;
		c.style.left = x + 'px';
		c.style.top = y + 'px';
	}
	// background
	b.style.backgroundPosition = (b.scrollLeft * bgAmount) + 'px '
                               + (b.scrollTop * bgAmount) + 'px';
	// plane
	x = (b.scrollLeft / (cw - vw)) * (vw - plane.clientWidth);
	y = (b.scrollTop / (ch - vh)) * (vh - plane.clientHeight);
	plane.style.left = x + 'px';
	plane.style.top = y + 'px';
}​