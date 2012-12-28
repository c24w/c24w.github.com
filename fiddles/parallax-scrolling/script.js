window.onload = function () {

	var b = document.body;

	function enablePageDragging(xSpeed, ySpeed) {
		if (typeof xSpeed === 'undefined') xSpeed = 1;
		if (typeof ySpeed === 'undefined') ySpeed = xSpeed;
		var b = document.body;
		var dragging = false;
		var oldX, oldY;
		b.onmousedown = function (e) {
			oldX = e.x;
			oldY = e.y;
			dragging = true;
			e.preventDefault()
		};

		b.onmouseup = function (e) {
			dragging = false;
			e.preventDefault();
		};

		b.onmousemove = function (e) {
			if (dragging) {
				var newX = e.x;
				var newY = e.y
				scrollBy((newX - oldX) * xSpeed, (newY - oldY) * ySpeed);
				oldX = newX;
				oldY = newY;
			}
		};
	}

	enablePageDragging(0.3, 2);

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