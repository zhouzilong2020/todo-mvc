window.addEventListener("load", function () {
  var initX;
  var moveX;
  var X = 0;
  var objX = 0;
  var width = $(".removeJs").width(); //按钮的宽度(removeJs修改为按钮的className)
  var liClassName = ".route-item"; //li的className(route-item修改为li的className)
  $("body").on("touchstart", liClassName, function (event) {
    var obj = this;
    initX = event.targetTouches[0].pageX;
    objX =
      obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(
        /px\)/g,
        ""
      ) * 1;
    if (objX == 0) {
      $("body").on("touchmove", liClassName, function (event) {
        // event.preventDefault();
        var obj = this;
        moveX = event.targetTouches[0].pageX;
        X = moveX - initX;
        if (X > 0) {
          obj.style.WebkitTransform = "translateX(" + 0 + "px)";
        } else if (X < 0) {
          var l = Math.abs(X);
          obj.style.WebkitTransform = "translateX(" + -l + "px)";
          if (l > width) {
            l = width;
            obj.style.WebkitTransform = "translateX(" + -l + "px)";
          }
        }
      });
    } else if (objX < 0) {
      $("body").on("touchmove", liClassName, function (event) {
        // event.preventDefault();
        var obj = this;
        moveX = event.targetTouches[0].pageX;
        X = moveX - initX;
        if (X > 0) {
          var r = -width + Math.abs(X);
          obj.style.WebkitTransform = "translateX(" + r + "px)";
          if (r > 0) {
            r = 0;
            obj.style.WebkitTransform = "translateX(" + r + "px)";
          }
        } else {
          //向左滑动
          obj.style.WebkitTransform = "translateX(" + -width + "px)";
        }
      });
    }
  });
  $("body").on("touchend", liClassName, function (event) {
    var obj = this;
    objX =
      obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(
        /px\)/g,
        ""
      ) * 1;
    if (objX > -width / 2) {
      obj.style.WebkitTransform = "translateX(" + 0 + "px)";
    } else {
      obj.style.WebkitTransform = "translateX(" + -width + "px)";
    }
  });
});
