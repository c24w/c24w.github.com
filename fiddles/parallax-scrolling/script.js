window.onload = function () {

	var b = document.body;

function enablePageDragging(options) {
	// options.xSpeed = integer
	// options.ySpeed = integer
	// options.invert = boolean
 
	var x = { speed: options && options.xSpeed || 1 },
		y = { speed: options && options.ySpeed || 1 },
		invert = options && options.invert,
		d = document, b = d.body,
		captureArea = d.createElement('div'),
		mouseDown;
 
	function isLeftClick(e) { return e.button === 0; }
 
	function setOldXY(e) {
		x.old = e.x;
		y.old = e.y;
	}
 
	function getScrollAmount(o) {
		var amount = o.old - o['new'];
		amount = invert ? 0 - amount : amount;
		return amount * o.speed;
	}
 
	function setNewXY(e) {
		x['new'] = e.x;
		y['new'] = e.y;
	}
 
	captureArea.style.position = 'fixed';
	captureArea.style.top = captureArea.style.left = '0';
	captureArea.style.width = captureArea.style.height = '100%';
	captureArea.style.zIndex = '999';
 
	captureArea.onmousedown = function (e) {
		setOldXY(e);
		mouseDown = true;
		e.preventDefault();
	};
 
	captureArea.onmouseup = function (e) {
		mouseDown = false;
		e.preventDefault();
	};
 
	captureArea.onmousemove = function (e) {
		if (mouseDown) {
			setNewXY(e);
			scrollBy(getScrollAmount(x), getScrollAmount(y));
			setOldXY(e);
		}
	};
 
	b.appendChild(captureArea);
}
 
enablePageDragging({
	invert: true,
	ySpeed: 3
});

	var pageWidth = b.offsetWidth;
	var pageHeight = b.offsetHeight;
	var viewWidth = window.innerWidth;
	var viewHeight = window.innerHeight;

	var box = document.createElement('div');
	box.id = 'cropArea';
	box.style.width = pageWidth + 'px';
	box.style.height = pageHeight + 'px';

	var plane = document.createElement('img');
	plane.src = 'plane.png';
	plane.id = 'plane';
	box.appendChild(plane);

	var noClouds = Math.floor(pageWidth * pageHeight / 250000);
	var clouds = [];

	for (var i = 0; i < noClouds; i++) {
		var w = scaleRand(254);
		var h = scaleRand(198);
		var x = randInt(pageWidth - w);
		var y = randInt(pageHeight - h);
		var layer = (i % 2 === 0) ? 'background' : 'foreground';
		var cloud = new Cloud(w, h, x, y, layer);
		if (i % 2 == 0) clouds[i] = cloud;
		box.appendChild(cloud.element);
	}

	b.appendChild(box);
	b.removeChild(b.children[0]);

	function Cloud(w, h, x, y, layer) {
		this.element = document.createElement('img');
		this.element.src = 'cloud.png';
		this.element.className = 'cloud ' + layer;
		var style = this.style = this.element.style;
		style.width = w + 'px';
		style.height = h + 'px';
		this.startX = x;
		this.startY = y;
		this.position = function (x, y) {
			style.left = x + 'px';
			style.top = y + 'px';
		}
		this.position(x, y);
	}

	function scaleRand(baseDimension) {
		var scalar = 1 + Math.random();
		return Math.floor(baseDimension * scalar);
	}

	function randInt(x) {
		return Math.floor(Math.random() * x);
	}

	window.onscroll = function () {
		positionBackground(0.9);
		positionClouds(0.5);
		positionPlane();
	};

	function positionBackground(scrollSpeed) {
		b.style.backgroundPosition = (b.scrollLeft * scrollSpeed) + 'px ' + (b.scrollTop * scrollSpeed) + 'px';
	}

	function positionClouds(scrollSpeed) {
		for (var i = 0; i < clouds.length; i += 2) {
			var cloud = clouds[i];
			var x = cloud.startX + (b.scrollLeft * scrollSpeed);
			var y = cloud.startY + (b.scrollTop * scrollSpeed);
			cloud.style.left = x + 'px';
			cloud.style.top = y + 'px';
		}
	}

	/*  +--------page--------+
		|   |  □   |         |
		|   |      |         |
		|   | view |         |
		+--------------------+  */

	function positionPlane() { // location of view relative to page -> location of plane relative to view
		var navigablePageWidth = pageWidth - viewWidth;
		var navigablePageHeight = pageHeight - viewHeight;
		var navigableViewWidth = viewWidth - plane.clientWidth;
		var navigableViewHeight = viewHeight - plane.clientHeight;
		var viewFromLeft = b.scrollLeft / navigablePageWidth;
		var viewFromTop = b.scrollTop / navigablePageHeight;
		var x = navigableViewWidth * viewFromLeft;
		var y = navigableViewHeight * viewFromTop;
		plane.style.left = x + 'px';
		plane.style.top = y + 'px';
	}

};