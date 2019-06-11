/* eslint-disable */
// 本js用于web端图片缩放，传参img父级元素elem及能够表示屏幕宽度的元素parentDom


class ImagesZoom {
  // 给初始化数据
  init(param) {
    var isSupportTouch = "ontouchend" in document ? true : false;
    if (!isSupportTouch) {
      throw new Error("不支持tachend事件");
    }
    var self = this,
      params = param || {};
    self.elem = params.elem;
    var imgList = self.elem,
      zoomMask = params.parentDom,
      zoomImg = self.elem
    self.element = imgList;
    self.buffMove = 3; //缓冲系数
    self.buffScale = 2; //放大系数
    self.finger = false; //触摸手指的状态 false：单手指 true：多手指

    self._destroy();
    // 禁止页面滚动
    // document.addEventListener("touchmove", self.eventStop, { passive: false });

    self.imgBaseWidth = zoomImg.offsetWidth;
    self.imgBaseHeight = zoomImg.offsetHeight;

    self.addEventStart({
      wrapX: zoomMask.offsetWidth,
      wrapY: zoomMask.offsetHeight,
      mapX: zoomImg.width,
      mapY: zoomImg.height
    });
    // }
    // }, false);
    // }
  }
  addEventStart(param) {
    var self = this,
      params = param || {};

    // self.element = document.querySelector(self.elem+" img")[0];

    //config set
    self.wrapX = params.wrapX || 0; //可视区域宽度
    self.wrapY = params.wrapY || 0; //可视区域高度
    self.mapX = params.mapX || 0; //图片宽度
    self.mapY = params.mapY || 0; //图片高度

    self.outDistY = (self.mapY - self.wrapY) / 2; //图片超过一屏的时候有用

    self.width = self.mapX - self.wrapX; //图片的宽度减去可视区域的宽度
    self.height = self.mapY - self.wrapY; //图片的高度减去可视区域的高度

    self.element.addEventListener(
      "touchstart",
      function (e) {
        // e.stopPropagation();
        // e.preventDefault();
        self._touchstart(e);
      },
      false
    );
    self.element.addEventListener(
      "touchmove",
      function (e) {
        self._touchmove(e);
      },
      false
    );
    self.element.addEventListener(
      "touchend",
      function (e) {
        // e.stopPropagation();
        // e.preventDefault();
        self._touchend(e);
      },
      false
    );
  }
  // 重置坐标数据
  _destroy() {
    this.distX = 0;
    this.distY = 0;
    this.newX = 0;
    this.newY = 0;
  }
  // 更新图片信息
  _changeData() {
    this.mapX = this.element.offsetWidth; //图片宽度
    this.mapY = this.element.offsetHeight; //图片高度
    // this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
    this.width = this.mapX - this.wrapX; //图片的宽度减去可视区域的宽度
    this.height = this.mapY - this.wrapY; //图片的高度减去可视区域的高度
  }
  _touchstart(e) {
    var self = this;

    // e.preventDefault();

    var touchTarget = e.targetTouches.length; //获得触控点数

    self._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算

    if (touchTarget === 1) {
      // 获取开始坐标
      self.basePageX = this.getPage(e, "pageX");
      self.basePageY = this.getPage(e, "pageY");

      self.finger = false;
    } else {
      self.finger = true;

      self.startFingerDist = self.getTouchDist(e).dist;
      self.startFingerX = self.getTouchDist(e).x;
      self.startFingerY = self.getTouchDist(e).y;
    }

    // console.log("pageX: " + getPage(e, "pageX"));
    // console.log("pageY: " + getPage(e, "pageY"));
  }
  _touchmove(e) {
    var self = this;

    e.preventDefault();
    // e.stopPropagation();

    var touchTarget = e.targetTouches.length; //获得触控点数

    if (touchTarget === 1 && !self.finger) {
      self._move(e);
    }

    if (touchTarget >= 2) {
      self._zoom(e);
    }
  }
  _touchend(e) {
    this.newX = 0,
      this.newY = 0;

    if (this.wrapX < this.element.offsetWidth) {
      this.newX = (this.wrapX - this.element.offsetWidth) / 2;
    }
    if (this.wrapY < this.element.offsetHeight) {
      this.newY = (this.wrapY - this.element.offsetHeight) / 2;
    }
    this.refresh(0 + this.newX, 0 + this.newY, "0.2s", "ease-in-out");
  }
  _move(e) {
    var self = this,
      pageX = this.getPage(e, "pageX"), //获取移动坐标
      pageY = this.getPage(e, "pageY");
    // 获得移动距离
    self.distX = pageX - self.basePageX + self.newX;
    self.distY = pageY - self.basePageY + self.newY;
    self.refresh(self.distX, self.distY, "0s", "ease");
    self.finger = false;
  }
  // 图片缩放
  _zoom(e) {
    var self = this;
    // e.preventDefault();
    // e.stopPropagation();

    var nowFingerDist = self.getTouchDist(e).dist, //获得当前长度
      ratio = nowFingerDist / self.startFingerDist, //计算缩放比
      imgWidth = Math.round(self.mapX * ratio), //计算图片宽度
      imgHeight = Math.round(self.mapY * ratio); //计算图片高度

    // 计算图片新的坐标
    self.imgNewX = Math.round(
      self.startFingerX * ratio - self.startFingerX - self.newX * ratio
    );
    self.imgNewY = Math.round(
      (self.startFingerY * ratio - self.startFingerY) / 2 - self.newY * ratio
    );
    if (imgWidth >= self.imgBaseWidth) {
      self.element.style.width = imgWidth + "px";
      self.refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
      self.finger = true;
    } else {
      if (imgWidth < self.imgBaseWidth) {
        self.element.style.width = self.imgBaseWidth + "px";
      }
    }

    self.finger = true;
  }
  // 移动坐标
  movePos() {
    var self = this;

    if (self.height < 0) {
      if (self.element.offsetWidth === self.imgBaseWidth) {
        self.moveY = Math.round(self.distY / self.buffMove);
      } else {
        var moveTop = Math.round(
          (self.element.offsetHeight - self.imgBaseHeight) / 2
        );
        self.moveY =
          -moveTop + Math.round((self.distY + moveTop) / self.buffMove);
      }
    } else {
      var a = Math.round((self.wrapY - self.imgBaseHeight) / 2),
        b =
          self.element.offsetHeight -
          self.wrapY +
          Math.round(self.wrapY - self.imgBaseHeight) / 2;

      if (self.distY >= -a) {
        self.moveY = Math.round((self.distY + a) / self.buffMove) - a;
      } else if (self.distY <= -b) {
        self.moveY = Math.round((self.distY + b) / self.buffMove) - b;
      } else {
        self.moveY = self.distY;
      }
    }
    self.refresh(self.moveX, self.moveY, "0s", "ease");
  }
  // 重置数据
  reset() {
    var self = this,
      hideTime = ".2s";
    if (self.height < 0) {
      self.newY =
        -Math.round(self.element.offsetHeight - self.imgBaseHeight) / 2;
    } else {
      self.newY = 0;
    }
    self.refresh(self.newX, self.newY, hideTime, "ease-in-out");
  }
  // 执行图片移动
  refresh(x, y, timer, type) {
    this.element.style.webkitTransitionProperty = "-webkit-transform";
    this.element.style.webkitTransitionDuration = timer;
    this.element.style.webkitTransitionTimingFunction = type;
    this.element.style.webkitTransform = this.getTranslate(x, y);
  }
  // 获取多点触控
  getTouchDist(e) {
    var x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      x3 = 0,
      y3 = 0,
      result = {};

    x1 = e.touches[0].pageX;
    x2 = e.touches[1].pageX;
    y1 = e.touches[0].pageY - document.body.scrollTop;
    y2 = e.touches[1].pageY - document.body.scrollTop;

    if (!x1 || !x2) return;

    if (x1 <= x2) {
      x3 = (x2 - x1) / 2 + x1;
    } else {
      x3 = (x1 - x2) / 2 + x2;
    }
    if (y1 <= y2) {
      y3 = (y2 - y1) / 2 + y1;
    } else {
      y3 = (y1 - y2) / 2 + y2;
    }

    result = {
      dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
      x: Math.round(x3),
      y: Math.round(y3)
    };
    return result;
  }
  eventStop(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  support() {
    return {
      transform3d: "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix(),
      touch: "ontouchstart" in window
    }
  };

  getTranslate(x, y) {
    var distX = x,
      distY = y;
    return this.support().transform3d
      ? "translate3d(" + distX + "px, " + distY + "px, 0)"
      : "translate(" + distX + "px, " + distY + "px)";
  }

  getPage(event, page) {
    return this.support().touch ? event.changedTouches[0][page] : event[page];
  }
};
const imagesZoom = new ImagesZoom();
export default imagesZoom;