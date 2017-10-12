"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @namespace IconPatterns
 */
(function (factory) {
  /* istanbul ignore next */
  if (typeof define === "function" && define.amd) {
    // AMD import
    define(["jquery"], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    // Node/CommonJS import
    module.exports = function () {
      var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : global.window;
      return factory(require("jQuery")(window));
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  "use strict";

  /**
   * @memberof IconPatterns
   * @property {object} DEFAULTS           - The default setupf or iconPatterns
   * @property {array} DEFAULTS.animations - The available animation types
   * @property {number} DEFAULTS.size      - The default icon size
   * @property {string} DEFAULTS.color     - The default icon color
   * @property {object} ANIMATIONS         - The available animation styles
   */

  $.iconPatterns = {
    DEFAULTS: {
      color: "#FFFFFF"
    },
    ANIMATIONS: {
      INITIALIZE: ["initialize", "initialize--fast", "initialize--slow"],
      ROTATE: ["rotate", "rotate--fast", "rotate--slow", "rotate-reverse", "rotate-reverse--fast", "rotate-reverse--slow"],
      EXPAND: ["expand", "expand--fast", "expand--slow", "expand-reverse", "expand-reverse--fast", "expand-reverse--slow"]
    }
  };

  /**
   * Internal helper functions
   *
   * @namespace IconPatterns.Helpers
   * @memberof IconPatterns
   * @returns {object}
   */
  var Helpers = {
    /**
     * Generates a random degree count for a rotation (0deg - 360deg)
     *
     * @method Helpers.getRandomRotation
     * @memberof IconPatterns
     * @returns {number} degrees
     */
    getRandomRotation: function getRandomRotation() {
      return Math.round(Math.random() * 360) + 1;
    },

    /**
     * Returns random number within a range
     *
     * @method Helpers.getRandomNumber
     * @memberof IconPatterns
     * @param {number} min  - Min value allowed
     * @param {number} max  - Max value allowed
     * @returns {number}
     */
    getRandomNumber: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    /**
     * Returns random item from an array
     *
     * @method Helpers.getRandomItemFrom
     * @memberof IconPatterns
     * @param {array}  - The base array from which the item will be extracted
     * @returns {*} item
     */
    getRandomItemFrom: function getRandomItemFrom(arr) {
      return arr[Helpers.getRandomNumber(0, arr.length)];
    },

    /**
     * Returns random position within a region
     *
     * @method Helpers.getRandomPosition
     * @memberof IconPatterns
     * @param {number} width     - X axis size
     * @param {number} height    - Y axis size
     * @returns {object} pos     - Random position
     * @returns {number} pos.x   - Random position X offset
     * @returns {number} pos.y   - Random position Y offset
     */
    getRandomPosition: function getRandomPosition(width, height) {
      return {
        x: parseInt(Math.random() * width),
        y: parseInt(Math.random() * height)
      };
    }

  };

  /**
   * @class PatternInstance
   *
   * @constructor
   * @memberof IconPatterns
   * @param {jQuery} $target    - The jQuery object where the overlay will be applied
   * @param {object} config        - Configuration properties
   * @param {array} config.icons   - The icon properties to use
   * @param {string} config.color  - The icon color to use
   * @returns {PatternInstance}
   */
  function PatternInstance($target) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!$target || !$target.length) {
      throw new Error("Missing `target` jQuery instance");
    }
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    this.color = config.color;
    this.icons = config.icons;
    this.width = $target.outerWidth();
    this.height = $target.outerHeight();
    this.$overlay = this.generateOverlay(this.width, this.height);
    this.$target = $target;
    this.$target.css("position", "relative");
    this.$target.prepend(this.$overlay);
  }

  /**
   * Generates an icon
   *
   * @method generateIcon
   * @memberof IconPatterns.PatternInstance
   * @param {string} name                - Icon name tag
   * @param {string} size                - Icon size (in px)
   * @param {string} pos                 - Icon position
   * @param {number} pos.x               - X axis offset
   * @param {number} pos.y               - Y axis offset
   * @param {number} rotation            - Icon rotation (in degrees 0 - 360)
   * @param {object} animations          - The available set of animations to use
   * @param {string} animations.initial  - Animation set for initial behaviour
   * @param {string} animations.expand   - Animation set for expansion behaviour
   * @param {string} animations.rotate   - Animation set for rotation behaviour
   * @returns {jquery} icon
   */
  PatternInstance.prototype.generateIcon = function (color, className, size, pos, rotation, animations) {
    var iconStyle = ["font-size: " + size + "px", "color: " + color];
    var spanStyle = ["left: " + pos.x + "px", "top: " + pos.y + "px", "-webkit-transform: rotate(" + rotation + "deg)", "-MS-transform: rotate(" + rotation + "deg)", "transform: rotate(" + rotation + "deg)"];
    return $("<span class='icon-patterns__animations__initial " + animations.initial + "' style='" + spanStyle.join(";") + "'><span class='icon-patterns__animations__expand " + animations.expand + "'> <i class='" + [className, animations.rotate].join(" ") + "' style='" + iconStyle.join(";") + "'></i></span></span>");
  };

  /**
   * Generates overlay <div>
   *
   * @method generateOverlay
   * @memberof IconPatterns.PatternInstance
   * @returns {number} width    - The parent container width
   * @returns {number} height   - The parent container height
   * @returns {jquery} overlay
   */
  PatternInstance.prototype.generateOverlay = function (width, height) {
    var $overlay = $("<div class='icon-patterns__overlay'></div>");
    $overlay.width(width);
    $overlay.height(height);
    $overlay.css({
      "position": "absolute",
      "z-index": 1,
      "top": 0,
      "left": 0
    });
    return $overlay;
  };

  /**
   * Renders a canvas scene with icons
   *
   * @method draw
   * @memberof IconPatterns.PatternInstance
   * @returns {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.draw = function () {
    var _this = this;

    var ANIMATIONS = $.iconPatterns.ANIMATIONS;
    Object.entries(this.icons).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          iconName = _ref2[0],
          iconProperties = _ref2[1];

      var sizeVariation = iconProperties.sizeVariation,
          count = iconProperties.count;
      // Attach icons

      Array.from(Array(count)).forEach(function () {
        // Generate a random position for each icon
        var rotation = Helpers.getRandomRotation();
        var pos = Helpers.getRandomPosition(_this.width, _this.height);
        // Determine sizeWeight for each icon
        var size = Helpers.getRandomNumber(sizeVariation[0], sizeVariation[1]);
        // Determine animation styles
        var animations = {
          initial: Helpers.getRandomItemFrom(ANIMATIONS.INITIALIZE),
          rotate: Helpers.getRandomItemFrom(ANIMATIONS.ROTATE),
          expand: Helpers.getRandomItemFrom(ANIMATIONS.EXPAND)
        };
        // Generate and append icon
        _this.$overlay.append(_this.generateIcon(_this.color, iconName, size, pos, rotation, animations));
      });
    });
    return this;
  };

  /**
   * Attaches IconPatern to jQuery namespace
   * @private
   */
  $.extend($.fn, {
    /**
     * Retunns a new PatternInstance for a given configuration
     *
     * @method IconPatterns
     * @param {object} config        - Configuration properties
     * @param {array} config.icons   - The icon properties to use
     * @param {string} config.color  - The icon color to use
     * @returns {PatternInstance}
     */
    IconPatterns: function IconPatterns(config) {
      /* istanbul ignore next */
      return new PatternInstance($(this), Object.assign({}, config, $.iconPatterns.DEFAULTS));
    }
  });

  /**
   * Public functions
   */
  return {
    Helpers: Helpers,
    PatternInstance: PatternInstance
  };
});