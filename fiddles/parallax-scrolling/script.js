window.onload = function () {

	var b = document.body,
		pageWidth = b.offsetWidth,
		pageHeight = b.offsetHeight,
		viewWidth = window.innerWidth,
		viewHeight = window.innerHeight,
		box = document.createElement('div'),
		plane = document.createElement('img');

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

	function Cloud(w, h, x, y, layer) {
		this.element = document.createElement('img');
		this.element.src = 'cloud.png';
		this.element.className = 'cloud ' + layer;
		this.style = this.element.style;
		this.style.width = w + 'px';
		this.style.height = h + 'px';
		this.startX = x;
		this.startY = y;
		this.position(x, y);
	}

	Cloud.prototype.position = function (x, y) {
			this.style.left = x + 'px';
			this.style.top = y + 'px';
		};

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

	box.id = 'cropArea';
	box.style.width = pageWidth + 'px';
	box.style.height = pageHeight + 'px';

	plane.src = 'plane.png';
	plane.id = 'plane';
	box.appendChild(plane);

	var noClouds = Math.floor(pageWidth * pageHeight / 250000);
	var clouds = [];

	for (var i = 0; i < noClouds; i++) {
		var w = scaleRand(254),
			h = scaleRand(198),
			x = randInt(pageWidth - w),
			y = randInt(pageHeight - h),
			everyOtherCloud = i % 2 === 0;
			layer = (everyOtherCloud) ? 'background' : 'foreground',
			cloud = new Cloud(w, h, x, y, layer);

		if (everyOtherCloud) clouds[i] = cloud;
		box.appendChild(cloud.element);
	}

	b.appendChild(box);
	b.removeChild(b.children[0]);

	enablePageDragging({
		invert: true,
		ySpeed: 3
	});

};